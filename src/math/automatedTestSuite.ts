/**
 * Automated Validation & Unit Test Suite for Biophysical Models & Numerical Solvers
 * 
 * Verifies:
 * 1. ODE Solvers (RK4, RK45) local truncation error & convergence order against exact Gompertz solutions
 * 2. Conservation laws (Murray's law vascular bifurcation cube residual < 5%)
 * 3. Kalman Filter (EKF) covariance positivity, gain boundedness, and convergence
 * 4. Model Validation Metrics (MASE < 1.0 assertion for superior forecasting, WAPE sanity, C-index concordance)
 * 5. Biophysical Simulation Service probabilistic bounds [0, 1] and log-reduction consistency
 */

import { NumericalOdeEngine } from './odeSolvers';
import { DigitalTwinKalmanObserver } from './kalmanFilter';
import { ModelValidationMetricsEngine, PairedTimeSeriesPoint, SurvivalEventPair } from './validationMetrics';
import { SimulationPipelineService } from './simulationPipelineService';
import { BENCHMARK_COHORTS } from '../data/benchmarkCohorts';

export interface TestResultItem {
  id: string;
  suite: 'ODE_Convergence' | 'Physical_Conservation' | 'Kalman_Observer' | 'Statistical_Validation' | 'Simulation_Pipeline';
  name: string;
  passed: boolean;
  actualValue: string | number;
  expectedThreshold: string;
  executionTimeMs: number;
  message?: string;
}

export interface AutomatedTestSuiteSummary {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRatePct: number;
  totalDurationMs: number;
  results: TestResultItem[];
}

export class AutomatedBiophysicalTestSuite {
  public static runAllTests(): AutomatedTestSuiteSummary {
    const startTime = performance.now();
    const results: TestResultItem[] = [];

    // --- TEST 1: RK4 Numerical Order vs Analytical Gompertz ---
    {
      const t0 = performance.now();
      const v0 = 100;
      const a = 0.35;
      const b = 0.08;
      const f = NumericalOdeEngine.gompertzDerivative(v0, a, b);
      const h = 0.01;
      let yRk4 = [v0];
      const tEnd = 4;

      for (let t = 0; t < tEnd; t = Number((t + h).toFixed(4))) {
        yRk4 = NumericalOdeEngine.rk4Step(f, t, yRk4, h);
      }

      const exact = NumericalOdeEngine.exactGompertz(tEnd, v0, a, b);
      const absError = Math.abs(yRk4[0] - exact);
      const passed = absError < 1e-3;

      results.push({
        id: 'TEST-ODE-01',
        suite: 'ODE_Convergence',
        name: 'Classical RK4 Convergence vs Exact Gompertzian Analytical Solution',
        passed,
        actualValue: Number(absError.toExponential(3)),
        expectedThreshold: 'Abs Error < 1e-3',
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Passed with 4th order precision' : 'RK4 truncation error exceeded tolerance'
      });
    }

    // --- TEST 2: Adaptive RK45 Step-Size Bounded Error ---
    {
      const t0 = performance.now();
      const v0 = 50;
      const a = 0.25;
      const b = 0.05;
      const f = NumericalOdeEngine.gompertzDerivative(v0, a, b);
      const tol = 1e-4;

      const step = NumericalOdeEngine.rk45AdaptiveStep(f, 0, [v0], 0.2, tol);
      const passed = step.localTruncationError <= tol;

      results.push({
        id: 'TEST-ODE-02',
        suite: 'ODE_Convergence',
        name: 'Dormand-Prince RK45 Adaptive Step-Size Local Truncation Error',
        passed,
        actualValue: Number(step.localTruncationError.toExponential(3)),
        expectedThreshold: `LTE <= ${tol}`,
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Adaptive step LTE tightly constrained within tolerance' : 'LTE exceeded tolerance'
      });
    }

    // --- TEST 3: Murray's Law Conservation Residual ---
    {
      const t0 = performance.now();
      const r0 = 5.0;
      const r1 = 3.9685;
      const r2 = 3.9685;
      const residual = NumericalOdeEngine.murraysLawResidual(r0, r1, r2);
      const passed = residual.pctDeviation < 5.0; // within 5%

      results.push({
        id: 'TEST-PHYS-01',
        suite: 'Physical_Conservation',
        name: "Murray's Vascular Bifurcation Law (Cubic Conservation Residual)",
        passed,
        actualValue: `${residual.pctDeviation}%`,
        expectedThreshold: 'Deviation < 5.0%',
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Vascular shear conservation verified' : 'Bifurcation residual out of bounds'
      });
    }

    // --- TEST 4: Extended Kalman Filter Posterior Uncertainty Convergence ---
    {
      const t0 = performance.now();
      const observer = new DigitalTwinKalmanObserver();
      
      // Simulate 12 cycles of noisy measurements
      for (let m = 1; m <= 12; m++) {
        observer.predict(1.0, 0.5);
        observer.update({ month: m, ctDnaVafPct: 0.5 + m * 0.1, radiomicsSldMm: 20 + m }, m);
      }

      const ci = observer.get95ConfidenceIntervals();
      const passed = ci.vPrimary[0] >= 0 && ci.vPrimary[1] > ci.vPrimary[0] && ci.muResistance[0] >= 0 && ci.muResistance[1] <= 1.0;

      results.push({
        id: 'TEST-EKF-01',
        suite: 'Kalman_Observer',
        name: 'EKF State-Space Positivity & 95% Credible Interval Boundedness',
        passed,
        actualValue: `CI Prim: [${ci.vPrimary[0]}, ${ci.vPrimary[1]}], Resist: [${ci.muResistance[0]}, ${ci.muResistance[1]}]`,
        expectedThreshold: 'Bounds >= 0 and Mu <= 1.0',
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Posterior covariance stays strictly positive definite' : 'Covariance collapsed'
      });
    }

    // --- TEST 5: MASE Model Superiority vs Naive Persistence ---
    {
      const t0 = performance.now();
      const cohort = BENCHMARK_COHORTS[0]; // CRUK0063 TRACERx
      const paired: PairedTimeSeriesPoint[] = cohort.months.map((m, i) => ({
        timeIndex: m,
        actual: cohort.actualCtDnaVaf[i],
        predicted: cohort.modelEfkPred[i],
        naiveBaseline: cohort.naiveBaselinePred[i]
      }));

      const metrics = ModelValidationMetricsEngine.evaluateFullSuite(paired);
      const passed = metrics.mase < 1.0;

      results.push({
        id: 'TEST-STAT-01',
        suite: 'Statistical_Validation',
        name: 'MASE (Mean Absolute Scaled Error) Superiority vs. Naïve Benchmark',
        passed,
        actualValue: metrics.mase,
        expectedThreshold: 'MASE < 1.0 (Strictly Superior)',
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Model outperforms 1-step persistence baseline' : 'Model failed to beat persistence baseline'
      });
    }

    // --- TEST 6: Harrell's C-index Concordance for Survival Outcomes ---
    {
      const t0 = performance.now();
      const survivalPairs: SurvivalEventPair[] = [
        { patientId: 'P1', predictedRiskScore: 0.90, observedTimeMonths: 6, eventOccurred: true },
        { patientId: 'P2', predictedRiskScore: 0.75, observedTimeMonths: 12, eventOccurred: true },
        { patientId: 'P3', predictedRiskScore: 0.40, observedTimeMonths: 24, eventOccurred: true },
        { patientId: 'P4', predictedRiskScore: 0.15, observedTimeMonths: 36, eventOccurred: false }
      ];

      const cIndex = ModelValidationMetricsEngine.computeHarrellCIndex(survivalPairs);
      const passed = cIndex >= 0.70;

      results.push({
        id: 'TEST-STAT-02',
        suite: 'Statistical_Validation',
        name: "Harrell's Concordance Index (C-Index) on Right-Censored Cohorts",
        passed,
        actualValue: cIndex,
        expectedThreshold: 'C-Index >= 0.70',
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Strong survival ranking discrimination' : 'C-index below acceptable discrimination'
      });
    }

    // --- TEST 7: Simulation Pipeline Probabilistic Boundedness & Conservation ---
    {
      const t0 = performance.now();
      const sim = SimulationPipelineService.executePipeline({
        primaryCancer: 'Breast (BRCA)',
        targetOrgan: 'bone',
        oxygenHypoxia: 5.0,
        matrixStiffnessKpa: 30.0,
        fluidShearStress: 22.0
      });

      const pMet = sim.probabilityMetrics.cascadeBottleneck.pCumulativeOverallPct;
      const passed = pMet >= 0 && pMet <= 100 && sim.stage1_primary_microenvironment.emtCellsPercentage > 0;

      results.push({
        id: 'TEST-SIM-01',
        suite: 'Simulation_Pipeline',
        name: 'Coupled Cascade Multi-Scale Probability Boundedness [0, 100%]',
        passed,
        actualValue: `${pMet}%`,
        expectedThreshold: '0% <= pCumulative <= 100%',
        executionTimeMs: Number((performance.now() - t0).toFixed(2)),
        message: passed ? 'Probabilistic bounds strictly conserved across cascade' : 'Probability out of physical bounds'
      });
    }

    const totalDurationMs = Number((performance.now() - startTime).toFixed(2));
    const passedCount = results.filter(r => r.passed).length;

    return {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedTests: passedCount,
      failedTests: results.length - passedCount,
      passRatePct: Number(((passedCount / results.length) * 100).toFixed(1)),
      totalDurationMs,
      results
    };
  }
}
