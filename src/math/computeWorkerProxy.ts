/**
 * Specialized Compute Worker Proxy / Simulation Engine Bridge
 * 
 * Demonstrates clean microservice offloading architecture for high-intensity:
 * - Lattice Boltzmann fluid dynamics (CFD)
 * - Agent-based spatial modeling (PhysiCell)
 * - Stochastic Markov / Monte Carlo organotropism simulation
 * - Automated mathematical test execution
 */

import { SimulationPipelineService, SimulationParams, SimulationResults } from './simulationPipelineService.js';
import { AutomatedBiophysicalTestSuite, AutomatedTestSuiteSummary } from './automatedTestSuite.js';
import { DigitalTwinTelemetryPipeline, PatientTwinTelemetryStream } from './telemetryPipeline.js';
import { TimeSeriesForecastService, ForecastRequestParams, EnsembleForecastResponse } from './timeSeriesForecastService.js';
import {
  HighPerformanceSolverBackend,
  PdeSolveRequest,
  PdeSolveResult,
  LbmCfdSolveRequest,
  LbmCfdSolveResult,
  AbmStochasticRequest,
  AbmStochasticResult,
  HpcClusterStatus,
  SolverBackendType
} from './highPerformanceSolverBackend.js';

export class ComputeWorkerProxy {
  /**
   * Offloads multiscale simulation request to high-throughput compute service
   */
  public static async dispatchMultiscaleSimulation(params: SimulationParams): Promise<SimulationResults> {
    // In production cluster: dispatches via gRPC or WebSocket to Python / C++ PhysiCell worker pool
    // In node sandbox: executes optimized headless deterministic math service
    return SimulationPipelineService.executePipeline(params);
  }

  /**
   * Dispatches automated validation and property-based regression test suite
   */
  public static async executeAutomatedValidationSuite(): Promise<AutomatedTestSuiteSummary> {
    return AutomatedBiophysicalTestSuite.runAllTests();
  }

  /**
   * Dispatches EKF Digital Twin clinical telemetry assimilation (FHIR/OMOP)
   */
  public static async assimilatePatientTelemetry(patientId: string): Promise<PatientTwinTelemetryStream> {
    const pipeline = new DigitalTwinTelemetryPipeline(patientId);
    return pipeline.assimilateClinicalStream();
  }

  /**
   * Computes multi-scale ensemble forecasting with MASE/WAPE scaling validation
   */
  public static async executeTimeSeriesForecast(params: ForecastRequestParams): Promise<EnsembleForecastResponse> {
    return TimeSeriesForecastService.generateForecast(params);
  }

  /**
   * Dispatches 2D/3D Reaction-Diffusion PDE solve to high-performance compute backend
   */
  public static async solveReactionDiffusionPde(req: PdeSolveRequest): Promise<PdeSolveResult> {
    return HighPerformanceSolverBackend.solveReactionDiffusionPde(req);
  }

  /**
   * Dispatches Lattice-Boltzmann (LBM D2Q9) hemodynamic CFD solve to backend worker
   */
  public static async solveLbmMicrovascularCfd(req: LbmCfdSolveRequest): Promise<LbmCfdSolveResult> {
    return HighPerformanceSolverBackend.solveLbmMicrovascularCfd(req);
  }

  /**
   * Dispatches Gillespie / Tau-Leaping stochastic ABM to backend worker
   */
  public static async solveStochasticAbm(req: AbmStochasticRequest): Promise<AbmStochasticResult> {
    return HighPerformanceSolverBackend.solveStochasticAbm(req);
  }

  /**
   * Queries HPC compute cluster health, backend runtimes, and worker core allocation
   */
  public static async getHpcClusterStatus(): Promise<HpcClusterStatus> {
    return HighPerformanceSolverBackend.getHpcClusterStatus();
  }

  /**
   * Generates native HPC compilation & execution scripts for C++, Julia, or Python
   */
  public static async generateHpcJobScript(
    backend: SolverBackendType,
    params: { cancerType: string; organSite: string; gridNx: number; timeSteps: number }
  ) {
    return HighPerformanceSolverBackend.generateHpcJobScript(backend, params);
  }
}
