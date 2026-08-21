import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MetastasisStageFilter } from './components/MetastasisStageFilter';
import { MetastasisAtlasBrowser } from './components/modules/MetastasisAtlasBrowser';
import { LivingMetastasisCinema } from './components/modules/LivingMetastasisCinema';
import { CascadeTwinSimulator } from './components/modules/CascadeTwinSimulator';
import { MetastasisForecastEngine } from './components/modules/MetastasisForecastEngine';
import { CausalMetastasisOracle } from './components/modules/CausalMetastasisOracle';
import { ResistanceForgeModule } from './components/modules/ResistanceForgeModule';
import { OntologyKnowledgeGraphModule } from './components/modules/OntologyKnowledgeGraphModule';
import { BottleneckResolverModule } from './components/modules/BottleneckResolverModule';
import { PrimaryMetPairExplorer } from './components/modules/PrimaryMetPairExplorer';


import { SingleCellStateNavigator } from './components/modules/SingleCellStateNavigator';
import { PathwayNetworkModule } from './components/modules/PathwayNetworkModule';
import { LongitudinalTrajectoryTracker } from './components/modules/LongitudinalTrajectoryTracker';
import { ClinicalOutcomeVisualization } from './components/modules/ClinicalOutcomeVisualization';
import { MultidimensionalRouteMap } from './components/modules/MultidimensionalRouteMap';
import { MultiOmicMatrixHeatmap } from './components/modules/MultiOmicMatrixHeatmap';
import { WorkflowEngine } from './components/modules/WorkflowEngine';
import { GeminiMetastasisAssistant } from './components/modules/GeminiMetastasisAssistant';
import { LabGradeCalibrationModal } from './components/LabGradeCalibrationModal';
import { ClinicalProactiveInterceptionModule } from './components/modules/ClinicalProactiveInterceptionModule';
import { ClinicalDataIngestionHub } from './components/modules/ClinicalDataIngestionHub';
import { ModelValidationBacktestingSuite } from './components/modules/ModelValidationBacktestingSuite';
import { MetastasisHpcComputeViewer } from './components/modules/MetastasisHpcComputeViewer';
import { MetastasisSimulationPipelineModule } from './components/modules/MetastasisSimulationPipelineModule';
import { CirculatorySimulatorModule } from './components/modules/CirculatorySimulatorModule';
import { TumorEvolutionMathEngineModule } from './components/modules/TumorEvolutionMathEngineModule';
import { OrganColonizationSandboxModule } from './components/modules/OrganColonizationSandboxModule';
import { ImmuneInteractionGridModule } from './components/modules/ImmuneInteractionGridModule';
import { UnifiedWorkflowRibbon } from './components/UnifiedWorkflowRibbon';

import {
  MetMapCellLine,
  PrimaryMetPairSample,
  SingleCellMetaPoint,
  NetworkGeneNode,
  NetworkEdge,
  LineageClonalNode,
  SurvivalCohort,
  RouteFlowStep,
  WorkflowPipeline,
  OrganSite,
  PrimaryCancerType,
  MetastasisStage
} from './types/metastasis';

import {
  METMAP_CELL_LINES,
  PRIMARY_MET_PAIRS,
  SINGLE_CELL_ATLAS_POINTS,
  NETWORK_NODES,
  NETWORK_EDGES,
  LINEAGE_CLONES,
  SURVIVAL_COHORTS,
  DISSEMINATION_ROUTES,
  WORKFLOW_PIPELINES
} from './data/metastasisDataset';

export default function App() {
  const [activeModule, setActiveModule] = useState<string>('proactive_interception');
  const [selectedOrgan, setSelectedOrgan] = useState<OrganSite | 'all'>('all');
  const [selectedCancerType, setSelectedCancerType] = useState<PrimaryCancerType | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<MetastasisStage | 'all'>('all');
  const [isLabModalOpen, setIsLabModalOpen] = useState<boolean>(false);

  // State loaded from API endpoints
  const [cellLines, setCellLines] = useState<MetMapCellLine[]>(METMAP_CELL_LINES);
  const [pairs, setPairs] = useState<PrimaryMetPairSample[]>(PRIMARY_MET_PAIRS);
  const [singleCellPoints, setSingleCellPoints] = useState<SingleCellMetaPoint[]>(SINGLE_CELL_ATLAS_POINTS);
  const [networkNodes, setNetworkNodes] = useState<NetworkGeneNode[]>(NETWORK_NODES);
  const [networkEdges, setNetworkEdges] = useState<NetworkEdge[]>(NETWORK_EDGES);
  const [lineageClones, setLineageClones] = useState<LineageClonalNode[]>(LINEAGE_CLONES);
  const [survivalCohorts, setSurvivalCohorts] = useState<SurvivalCohort[]>(SURVIVAL_COHORTS);
  const [disseminationRoutes, setDisseminationRoutes] = useState<RouteFlowStep[]>(DISSEMINATION_ROUTES);
  const [pipelines, setPipelines] = useState<WorkflowPipeline[]>(WORKFLOW_PIPELINES);

  // Fetch API data on mount (supports local server)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resCells, resPairs, resSC, resNet, resSurv, resRoutes, resPipe] = await Promise.all([
          fetch('/api/metastasis/cell-lines').then(r => r.ok ? r.json() : null),
          fetch('/api/metastasis/pairs').then(r => r.ok ? r.json() : null),
          fetch('/api/metastasis/single-cell').then(r => r.ok ? r.json() : null),
          fetch('/api/metastasis/network').then(r => r.ok ? r.json() : null),
          fetch('/api/metastasis/survival').then(r => r.ok ? r.json() : null),
          fetch('/api/metastasis/routes').then(r => r.ok ? r.json() : null),
          fetch('/api/metastasis/workflows').then(r => r.ok ? r.json() : null)
        ]);

        if (resCells?.data) setCellLines(resCells.data);
        if (resPairs?.data) setPairs(resPairs.data);
        if (resSC?.data) setSingleCellPoints(resSC.data);
        if (resNet?.nodes) setNetworkNodes(resNet.nodes);
        if (resNet?.edges) setNetworkEdges(resNet.edges);
        if (resSurv?.cohorts) setSurvivalCohorts(resSurv.cohorts);
        if (resRoutes?.routes) setDisseminationRoutes(resRoutes.routes);
        if (resPipe?.pipelines) setPipelines(resPipe.pipelines);
      } catch (err) {
        console.warn('Backend API fetching notice: using rich bundled datasets.', err);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        selectedOrgan={selectedOrgan}
        setSelectedOrgan={setSelectedOrgan}
        selectedCancerType={selectedCancerType}
        setSelectedCancerType={setSelectedCancerType}
        onOpenLabModal={() => setIsLabModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Metastatic Cascade 7-Stage Filter Bar */}
        <MetastasisStageFilter
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
        />

        {/* End-to-End Interception Unified Workflow Ribbon */}
        <UnifiedWorkflowRibbon
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          selectedOrgan={selectedOrgan}
          selectedCancerType={selectedCancerType}
        />

        {/* Dynamic Module Views */}
        {activeModule === 'hpc_compute' && (
          <MetastasisHpcComputeViewer
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'immune_grid' && (
          <ImmuneInteractionGridModule />
        )}

        {activeModule === 'colonization_sandbox' && (
          <OrganColonizationSandboxModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'clinical_ingestion' && (
          <ClinicalDataIngestionHub
            onAssimilateToTwin={() => {
              setActiveModule('model_validation');
            }}
            onNavigateToModule={(modId) => setActiveModule(modId)}
          />
        )}

        {activeModule === 'proactive_interception' && (
          <ClinicalProactiveInterceptionModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'model_validation' && (
          <ModelValidationBacktestingSuite
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'sim_pipeline' && (
          <MetastasisSimulationPipelineModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'circulatory_sim' && (
          <CirculatorySimulatorModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'tumor_evolution_math' && (
          <TumorEvolutionMathEngineModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'atlas' && (
          <MetastasisAtlasBrowser
            cellLines={cellLines}
            selectedOrgan={selectedOrgan}
            setSelectedOrgan={setSelectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'living_cinema' && (
          <LivingMetastasisCinema
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'cascade_twin' && (
          <CascadeTwinSimulator
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'forecast_engine' && (
          <MetastasisForecastEngine
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
            onNavigateModule={(modId, organ) => {
              setActiveModule(modId);
              if (organ && organ !== 'all') setSelectedOrgan(organ as OrganSite);
            }}
          />
        )}

        {activeModule === 'causal_oracle' && (
          <CausalMetastasisOracle
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'resistance_forge' && (
          <ResistanceForgeModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'ontology' && (
          <OntologyKnowledgeGraphModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'bottleneck' && (
          <BottleneckResolverModule
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}


        {activeModule === 'pairs' && (
          <PrimaryMetPairExplorer
            pairs={pairs}
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}


        {activeModule === 'single_cell' && (
          <SingleCellStateNavigator
            singleCellPoints={singleCellPoints}
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'network' && (
          <PathwayNetworkModule
            nodes={networkNodes}
            edges={networkEdges}
            selectedOrgan={selectedOrgan}
          />
        )}

        {activeModule === 'trajectory' && (
          <LongitudinalTrajectoryTracker
            clones={lineageClones}
            selectedOrgan={selectedOrgan}
          />
        )}

        {activeModule === 'clinical' && (
          <ClinicalOutcomeVisualization
            cohorts={survivalCohorts}
            selectedOrgan={selectedOrgan}
          />
        )}

        {activeModule === 'routes' && (
          <MultidimensionalRouteMap
            routes={disseminationRoutes}
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}

        {activeModule === 'matrix' && (
          <MultiOmicMatrixHeatmap
            selectedOrgan={selectedOrgan}
          />
        )}

        {activeModule === 'workflow' && (
          <WorkflowEngine
            pipelines={pipelines}
          />
        )}

        {activeModule === 'ai_assistant' && (
          <GeminiMetastasisAssistant
            selectedOrgan={selectedOrgan}
            selectedCancerType={selectedCancerType}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/80 py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>MetaMap Metastasis Bioinformatics Portal • Dedicated Organotropism Platform</span>
          <span className="font-mono text-[11px] text-slate-400">
            MetMap, TCGA/MET500, TISCH2, HCA, XCMS & CeDR Integrated
          </span>
        </div>
      </footer>
      {/* Lab-Grade Calibration & Biophysical SOP Suite Modal */}
      <LabGradeCalibrationModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        organSite={selectedOrgan === 'all' ? 'bone' : selectedOrgan}
        cancerType={selectedCancerType === 'all' ? 'Breast (BRCA)' : selectedCancerType}
      />
    </div>
  );
}
