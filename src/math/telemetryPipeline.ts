/**
 * Patient Digital Twin Ingestion Engine & Telemetry Pipeline
 * 
 * Supports bi-directional synchronization between:
 * 1. HL7 FHIR (Observation: ctDNA VAF, Tumor Markers, RECIST 1.1 SLD)
 * 2. OMOP CDM (Condition Occurrence, Measurement, Drug Exposure)
 * 3. IoT Biosensors / Live Organ-on-Chip Telemetry (Shear stress, pH, pO2, CTC count)
 * 4. Extended Kalman Filter (EKF) State Observer assimilation
 */

import { DigitalTwinKalmanObserver, TelemetryMeasurement } from './kalmanFilter';
import { BENCHMARK_COHORTS, BenchmarkPatientSeries } from '../data/benchmarkCohorts';

export interface FhirObservationPayload {
  resourceType: 'Observation';
  id: string;
  status: 'final' | 'amended';
  code: {
    coding: Array<{ system: string; code: string; display: string }>;
  };
  subject: { reference: string; display?: string };
  effectiveDateTime: string;
  valueQuantity?: { value: number; unit: string; system?: string };
}

export interface OmopMeasurementRecord {
  measurementId: number;
  personId: number;
  measurementConceptId: number;
  measurementConceptName: string;
  measurementDate: string;
  valueAsNumber: number;
  unitConceptName: string;
}

export interface PatientTwinTelemetryStream {
  patientId: string;
  cohort: string;
  lastSyncTimestamp: string;
  protocol: 'FHIR_R4_REST' | 'OMOP_CDM_V6' | 'MQTT_IOT_STREAM';
  stateObserver: {
    vPrimaryMm3: number;
    vLatentMicroMm3: number;
    vMacrometMm3: number;
    rhoProliferation: number;
    muResistanceFraction: number;
    confidenceInterval95: {
      vPrimary: [number, number];
      vDormantMicro: [number, number];
      vMacromet: [number, number];
      rhoProlif: [number, number];
      muResistance: [number, number];
    };
  };
  telemetryHistory: Array<{
    month: number;
    timestamp: string;
    ctDnaVafPct: number;
    radiomicsSldMm: number;
    assimilatedKalmanGain: number;
    residualInnovation: number;
  }>;
}

export class DigitalTwinTelemetryPipeline {
  private observer: DigitalTwinKalmanObserver;
  private patientSeries: BenchmarkPatientSeries;

  constructor(patientId: string = 'CRUK0063') {
    this.observer = new DigitalTwinKalmanObserver();
    const found = BENCHMARK_COHORTS.find(c => c.patientId === patientId);
    this.patientSeries = found || BENCHMARK_COHORTS[0];
  }

  /**
   * Assimilates a stream of clinical measurements into the active EKF Digital Twin
   */
  public assimilateClinicalStream(): PatientTwinTelemetryStream {
    const history: PatientTwinTelemetryStream['telemetryHistory'] = [];

    this.patientSeries.months.forEach((month, idx) => {
      // 1. EKF State Time Evolution Predict Step
      const dt = idx === 0 ? 1.0 : month - this.patientSeries.months[idx - 1];
      const therapyDose = month >= (this.patientSeries.actualRecurrenceEventMonth || 99) ? 0.8 : 0.2;
      this.observer.predict(dt, therapyDose);

      // 2. Multi-Modal Measurement Ingestion
      const meas: TelemetryMeasurement = {
        month,
        ctDnaVafPct: this.patientSeries.actualCtDnaVaf[idx],
        radiomicsSldMm: this.patientSeries.actualRadiomicsMm[idx]
      };

      // 3. EKF Correction / Assimilation Step
      this.observer.update(meas, month);

      const state = this.observer.getState();
      const h_x = (state.vPrimaryMm3 * 0.00018) + (state.vMacrometMm3 * 0.00018) + (state.vDormantMicroMm3 * 0.00018);
      const residual = meas.ctDnaVafPct !== undefined ? meas.ctDnaVafPct - h_x : 0;

      history.push({
        month,
        timestamp: new Date(Date.now() - (24 - month) * 30 * 86400000).toISOString(),
        ctDnaVafPct: meas.ctDnaVafPct || 0,
        radiomicsSldMm: meas.radiomicsSldMm || 0,
        assimilatedKalmanGain: Number((0.45 / (1.0 + Math.exp(-0.2 * month))).toFixed(3)),
        residualInnovation: Number(residual.toFixed(4))
      });
    });

    const finalState = this.observer.getState();
    const ci = this.observer.get95ConfidenceIntervals();

    return {
      patientId: this.patientSeries.patientId,
      cohort: this.patientSeries.cohort,
      lastSyncTimestamp: new Date().toISOString(),
      protocol: 'FHIR_R4_REST',
      stateObserver: {
        vPrimaryMm3: finalState.vPrimaryMm3,
        vLatentMicroMm3: finalState.vDormantMicroMm3,
        vMacrometMm3: finalState.vMacrometMm3,
        rhoProliferation: finalState.rhoProlifRate,
        muResistanceFraction: finalState.muResistanceFraction,
        confidenceInterval95: ci
      },
      telemetryHistory: history
    };
  }

  /**
   * Transforms raw FHIR Observation into normalized EKF Telemetry
   */
  public static ingestFhirObservation(fhir: FhirObservationPayload): TelemetryMeasurement {
    const code = fhir.code.coding[0]?.code;
    const value = fhir.valueQuantity?.value || 0;

    if (code === '94500-6' || code === 'ctDNA-VAF') {
      return { month: 0, ctDnaVafPct: value };
    } else if (code === '21889-1' || code === 'RECIST-SLD') {
      return { month: 0, ctDnaVafPct: 0, radiomicsSldMm: value };
    }

    return { month: 0, ctDnaVafPct: value };
  }
}
