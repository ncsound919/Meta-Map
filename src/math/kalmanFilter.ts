/**
 * Headless Extended Kalman Filter (EKF) / Bayesian State Space Observer
 * for Real-Time Cancer Digital Twin Telemetry Assimilation
 * 
 * Assimilates sparse, noisy, intermittent multi-modal clinical biomarkers:
 *  - ctDNA Variant Allele Frequency (VAF %)
 *  - Radiomics 3D Tumor Burden (RECIST 1.1 SLD in mm)
 *  - Serum Protein Biomarkers (CEA / PSA / CA 15-3 ng/mL)
 *  - Circulating Tumor Cells (CellSearch CTC count / 7.5 mL blood)
 * 
 * Latent State Vector: x = [V_primary, V_dormant_micro, V_macromet, rho_prolif, mu_resistance]^T
 */

export interface LatentStateVector {
  vPrimaryMm3: number;        // Primary tumor volume (mm^3)
  vDormantMicroMm3: number;   // Latent unobserved micrometastatic volume (mm^3)
  vMacrometMm3: number;       // Macrometastatic burden (mm^3)
  rhoProlifRate: number;      // Net proliferation rate (1/month)
  muResistanceFraction: number; // Fraction of resistant sub-clones [0, 1]
}

export interface TelemetryMeasurement {
  month: number;
  ctDnaVafPct?: number;       // e.g. 0.05% to 25.0%
  radiomicsSldMm?: number;    // e.g. 10mm to 80mm
  serumMarkerNgMl?: number;   // e.g. 2.5 to 150 ng/mL
  ctcCountPerTube?: number;   // e.g. 0 to 45 CTCs / 7.5 mL
  isIntermittentMissing?: boolean;
}

export interface KalmanFilterStepResult {
  month: number;
  priorState: LatentStateVector;
  posteriorState: LatentStateVector;
  posteriorUncertainty95CI: {
    vPrimary: [number, number];
    vDormantMicro: [number, number];
    vMacromet: [number, number];
    rhoProlif: [number, number];
    muResistance: [number, number];
  };
  kalmanGainDiagonal: number[];
  innovationResiduals: {
    ctDna?: number;
    radiomics?: number;
    serumMarker?: number;
    ctc?: number;
  };
  logLikelihood: number;
  isAssimilated: boolean;
}

export class DigitalTwinKalmanObserver {
  // State dimension n=5, Measurement dimension m=4
  private state: number[]; // [v_p, v_dm, v_mm, rho, mu]
  private P: number[][];   // 5x5 Posterior Covariance Matrix
  private Q: number[][];   // 5x5 Process Noise Covariance Matrix
  private R: number[][];   // 4x4 Measurement Noise Covariance Matrix

  constructor(
    initialState?: Partial<LatentStateVector>,
    processNoiseScale = 1.0,
    measurementNoiseScale = 1.0
  ) {
    const s = {
      vPrimaryMm3: 4500,
      vDormantMicroMm3: 150,
      vMacrometMm3: 50,
      rhoProlifRate: 0.18,
      muResistanceFraction: 0.05,
      ...initialState
    };

    this.state = [
      s.vPrimaryMm3,
      s.vDormantMicroMm3,
      s.vMacrometMm3,
      s.rhoProlifRate,
      s.muResistanceFraction
    ];

    // Initial estimation uncertainty covariance P_0
    this.P = [
      [500000, 0, 0, 0, 0],
      [0, 20000, 0, 0, 0],
      [0, 0, 10000, 0, 0],
      [0, 0, 0, 0.01, 0],
      [0, 0, 0, 0, 0.005]
    ];

    // Process noise Q (biological stochastic drift per time step dt=1 month)
    const qScale = Math.max(0.01, processNoiseScale);
    this.Q = [
      [50000 * qScale, 0, 0, 0, 0],
      [0, 5000 * qScale, 0, 0, 0],
      [0, 0, 4000 * qScale, 0, 0],
      [0, 0, 0, 0.002 * qScale, 0],
      [0, 0, 0, 0, 0.001 * qScale]
    ];

    // Measurement noise R (assay variance: ctDNA ~0.04, CT radiomics ~9.0 mm^2, Serum ~16.0, CTC ~4.0)
    const rScale = Math.max(0.01, measurementNoiseScale);
    this.R = [
      [0.04 * rScale, 0, 0, 0],
      [0, 9.0 * rScale, 0, 0],
      [0, 0, 16.0 * rScale, 0],
      [0, 0, 0, 4.0 * rScale]
    ];
  }

  /**
   * Non-linear tumor growth and micrometastatic awakening forward model
   * dx/dt = [ f_p(x), f_dm(x), f_mm(x), f_rho(x), f_mu(x) ]
   */
  public predict(dtMonths = 1.0, therapyEfficacy = 0.0): LatentStateVector {
    const [vp, vdm, vmm, rho, mu] = this.state;

    // Drug kill rate reduces effective proliferation
    const effectiveRho = rho * (1 - therapyEfficacy * (1 - mu));
    
    // Primary tumor Gompertzian-like expansion
    const vpNext = Math.max(0, vp + (effectiveRho * vp * (1 - Math.log(Math.max(1, vp) / 200000))) * dtMonths);
    
    // Micrometastatic shedding from primary & spontaneous awakening transition to macrometastasis
    const sheddingFlux = 0.002 * vp * dtMonths;
    const awakeningRate = 0.03 * (1 - therapyEfficacy); // Dormancy exit probability
    const awakeningFlux = vdm * awakeningRate * dtMonths;
    const vdmNext = Math.max(0, vdm + sheddingFlux - awakeningFlux + (0.02 * vdm * dtMonths));

    // Macrometastatic outgrowth
    const vmmNext = Math.max(0, vmm + awakeningFlux + (effectiveRho * 1.3 * vmm * dtMonths));

    // Clonal resistance evolution under therapeutic selection pressure
    const muNext = Math.min(0.99, Math.max(0.01, mu + (therapyEfficacy > 0.2 ? 0.025 * therapyEfficacy * dtMonths : -0.002 * dtMonths)));

    const priorStateVector = [vpNext, vdmNext, vmmNext, rho, muNext];

    // Compute Jacobian F_k = df/dx
    const F = [
      [1 + effectiveRho * dtMonths, 0, 0, vp * dtMonths, 0],
      [0.002 * dtMonths, 1 - awakeningRate * dtMonths + 0.02 * dtMonths, 0, 0, 0],
      [0, awakeningRate * dtMonths, 1 + effectiveRho * 1.3 * dtMonths, vmm * 1.3 * dtMonths, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1]
    ];

    // Predict covariance: P_k^- = F * P_{k-1} * F^T + Q
    this.P = this.matrixAdd(this.matrixMultiply(this.matrixMultiply(F, this.P), this.transpose(F)), this.Q);
    this.state = priorStateVector;

    return this.vectorToState(this.state);
  }

  /**
   * Kalman Update step: Assimilate incoming noisy measurement y_k
   */
  public update(
    measurement: TelemetryMeasurement,
    month: number
  ): KalmanFilterStepResult {
    const priorState = this.vectorToState(this.state);

    // Measurement mapping function h(x):
    // ctDNA VAF % = 0.00015 * V_total
    // Radiomics SLD mm = (V_primary + V_macromet)^(1/3) * 1.24
    // Serum marker ng/mL = 0.004 * (V_primary + V_macromet) + 1.2
    // CTC count = 0.0008 * V_macromet + 0.0002 * V_primary
    const [vp, vdm, vmm, rho, mu] = this.state;
    const vTotal = vp + vdm + vmm;
    const vMalignantVisible = vp + vmm;

    const h_ctDna = 0.00018 * vTotal;
    const h_radiomics = Math.pow(Math.max(1, vMalignantVisible), 1 / 3) * 1.24;
    const h_serum = 0.0035 * vMalignantVisible + 1.5;
    const h_ctc = 0.0007 * vmm + 0.00015 * vp;

    const hasMeasurement =
      !measurement.isIntermittentMissing &&
      (measurement.ctDnaVafPct !== undefined ||
        measurement.radiomicsSldMm !== undefined ||
        measurement.serumMarkerNgMl !== undefined ||
        measurement.ctcCountPerTube !== undefined);

    if (!hasMeasurement) {
      // No valid telemetry packet available this cycle (intermittent dropout)
      return {
        month,
        priorState,
        posteriorState: priorState,
        posteriorUncertainty95CI: this.get95ConfidenceIntervals(),
        kalmanGainDiagonal: [0, 0, 0, 0, 0],
        innovationResiduals: {},
        logLikelihood: 0,
        isAssimilated: false
      };
    }

    // Build active measurement vector y and measurement Jacobian H
    const activeY: number[] = [];
    const activeH: number[][] = [];
    const activeR: number[][] = [];
    const innovations: Record<string, number> = {};

    if (measurement.ctDnaVafPct !== undefined) {
      activeY.push(measurement.ctDnaVafPct);
      activeH.push([0.00018, 0.00018, 0.00018, 0, 0]);
      activeR.push([this.R[0][0]]);
      innovations.ctDna = Number((measurement.ctDnaVafPct - h_ctDna).toFixed(4));
    }
    if (measurement.radiomicsSldMm !== undefined) {
      const dSld_dV = (1 / 3) * 1.24 * Math.pow(Math.max(1, vMalignantVisible), -2 / 3);
      activeY.push(measurement.radiomicsSldMm);
      activeH.push([dSld_dV, 0, dSld_dV, 0, 0]);
      activeR.push([this.R[1][1]]);
      innovations.radiomics = Number((measurement.radiomicsSldMm - h_radiomics).toFixed(2));
    }
    if (measurement.serumMarkerNgMl !== undefined) {
      activeY.push(measurement.serumMarkerNgMl);
      activeH.push([0.0035, 0, 0.0035, 0, 0]);
      activeR.push([this.R[2][2]]);
      innovations.serumMarker = Number((measurement.serumMarkerNgMl - h_serum).toFixed(2));
    }
    if (measurement.ctcCountPerTube !== undefined) {
      activeY.push(measurement.ctcCountPerTube);
      activeH.push([0.00015, 0, 0.0007, 0, 0]);
      activeR.push([this.R[3][3]]);
      innovations.ctc = Number((measurement.ctcCountPerTube - h_ctc).toFixed(2));
    }

    // Scalar / 1D-multi update simplification for diagonal measurement noise
    const mCount = activeY.length;
    let logLikelihood = 0;

    for (let i = 0; i < mCount; i++) {
      const hRow = activeH[i];
      const yVal = activeY[i];
      const rVal = activeR[i][0];

      // Predicted measurement scalar: h_i = H_i * x
      let hPred = 0;
      for (let j = 0; j < 5; j++) {
        hPred += hRow[j] * this.state[j];
      }

      // Innovation residual: y_tilde = y - h_pred
      const innovation = yVal - hPred;

      // Innovation variance: S = H * P * H^T + R
      let S = rVal;
      const PHt: number[] = [0, 0, 0, 0, 0];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          PHt[r] += this.P[r][c] * hRow[c];
        }
        S += hRow[r] * PHt[r];
      }

      // Kalman Gain K = P * H^T / S
      const K: number[] = [0, 0, 0, 0, 0];
      for (let r = 0; r < 5; r++) {
        K[r] = PHt[r] / Math.max(1e-6, S);
      }

      // State update: x = x + K * innovation
      for (let r = 0; r < 5; r++) {
        this.state[r] = Math.max(0, this.state[r] + K[r] * innovation);
      }

      // Covariance update: P = (I - K * H) * P
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          this.P[r][c] = this.P[r][c] - K[r] * PHt[c];
        }
      }

      // Log-likelihood contribution
      logLikelihood += -0.5 * (Math.log(2 * Math.PI * S) + (innovation * innovation) / S);
    }

    const posteriorState = this.vectorToState(this.state);

    return {
      month,
      priorState,
      posteriorState,
      posteriorUncertainty95CI: this.get95ConfidenceIntervals(),
      kalmanGainDiagonal: [this.P[0][0], this.P[1][1], this.P[2][2], this.P[3][3], this.P[4][4]],
      innovationResiduals: innovations,
      logLikelihood: Number(logLikelihood.toFixed(3)),
      isAssimilated: true
    };
  }

  public get95ConfidenceIntervals(): KalmanFilterStepResult['posteriorUncertainty95CI'] {
    const s = this.state;
    const std = [
      Math.sqrt(Math.max(0, this.P[0][0])),
      Math.sqrt(Math.max(0, this.P[1][1])),
      Math.sqrt(Math.max(0, this.P[2][2])),
      Math.sqrt(Math.max(0, this.P[3][3])),
      Math.sqrt(Math.max(0, this.P[4][4]))
    ];

    return {
      vPrimary: [Math.max(0, Math.round(s[0] - 1.96 * std[0])), Math.round(s[0] + 1.96 * std[0])],
      vDormantMicro: [Math.max(0, Math.round(s[1] - 1.96 * std[1])), Math.round(s[1] + 1.96 * std[1])],
      vMacromet: [Math.max(0, Math.round(s[2] - 1.96 * std[2])), Math.round(s[2] + 1.96 * std[2])],
      rhoProlif: [Math.max(0, Number((s[3] - 1.96 * std[3]).toFixed(3))), Number((s[3] + 1.96 * std[3]).toFixed(3))],
      muResistance: [Math.max(0, Number((s[4] - 1.96 * std[4]).toFixed(3))), Math.min(1.0, Number((s[4] + 1.96 * std[4]).toFixed(3)))]
    };
  }

  public getState(): LatentStateVector {
    return this.vectorToState(this.state);
  }

  private vectorToState(v: number[]): LatentStateVector {
    return {
      vPrimaryMm3: Math.round(v[0]),
      vDormantMicroMm3: Math.round(v[1]),
      vMacrometMm3: Math.round(v[2]),
      rhoProlifRate: Number(v[3].toFixed(3)),
      muResistanceFraction: Number(v[4].toFixed(3))
    };
  }

  // Matrix utility methods
  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
    const C: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += A[i][k] * B[k][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }

  private matrixAdd(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  }

  private transpose(A: number[][]): number[][] {
    return A[0].map((_, colIndex) => A.map(row => row[colIndex]));
  }
}
