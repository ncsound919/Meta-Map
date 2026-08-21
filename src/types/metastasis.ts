export type MetastasisStage = 
  | 'local_invasion'
  | 'intravasation'
  | 'circulation'
  | 'extravasation'
  | 'colonization'
  | 'dormancy'
  | 'outgrowth';

export type OrganSite = 
  | 'bone'
  | 'liver'
  | 'brain'
  | 'lung'
  | 'lymph_node'
  | 'peritoneum';

export type PrimaryCancerType = 
  | 'Breast (BRCA)'
  | 'Colorectal (COAD/READ)'
  | 'Lung Non-Small (LUAD/LUSC)'
  | 'Prostate (PRAD)'
  | 'Melanoma (SKCM)'
  | 'Pancreatic (PAAD)'
  | 'Renal (KIRC)';

export interface MetMapCellLine {
  id: string;
  name: string;
  cancerType: PrimaryCancerType;
  primarySite: string;
  organTropismScores: Record<OrganSite, number>; // Normalized potential -1.0 to 1.0 or 0 to 100
  barcodedLineageCount: number;
  driverMutations: string[];
  emtStatus: 'Epithelial' | 'Hybrid EMT' | 'Mesenchymal';
  cedrDrugSensitivities: Array<{ drug: string; target: string; ic50_uM: number }>;
}

export interface PrimaryMetPairSample {
  pairId: string;
  patientId: string;
  cancerType: PrimaryCancerType;
  primaryLocation: string;
  metastaticSite: OrganSite;
  timeToMetastasisMonths: number;
  treatmentHistory: string[];
  mutationsGain: string[];
  mutationsLoss: string[];
  mutationsShared: string[];
  geneExpressionDeltaLog2FC: Record<string, number>;
  atacAccessibilityPeaks: Array<{ region: string; geneAssociated: string; primaryAccess: number; metAccess: number; tfBinding: string }>;
  microenvironmentPrimary: Record<string, number>; // percentages
  microenvironmentMet: Record<string, number>;
  proteomicsDelta: Record<string, number>;
  metabolomicsDelta: Record<string, number>;
}

export interface SingleCellMetaPoint {
  id: string;
  sampleId: string;
  cancerType: PrimaryCancerType;
  organSite: OrganSite;
  cellType: 'Metastatic Cancer Cell' | 'Cancer-Associated Fibroblast' | 'M2 Macrophage' | 'CD8+ T Cell' | 'Endothelial' | 'Osteoclast' | 'Kupffer Cell' | 'Astrocyte';
  cellState: 'Invasive' | 'Dormant' | 'Immune Suppressive' | 'EMT High' | 'Drug Resistant' | 'Proliferative Outgrowth';
  umapX: number;
  umapY: number;
  pseudotime: number;
  expression: {
    VIM: number;
    CDH1: number;
    CDH2: number;
    NR2F1: number; // Dormancy marker
    CD274: number; // PD-L1
    ABCB1: number;
    MMP9: number;
    RANKL: number;
  };
}

export interface NetworkGeneNode {
  id: string;
  label: string;
  category: 'Driver' | 'EMT' | 'Organotropism Homing' | 'Immune Checkpoint' | 'Niche Remodeling' | 'Metabolic Adaptor';
  expressionPrimary: number;
  expressionMetastasis: number;
  log2FC: number;
  associatedOrgans: OrganSite[];
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: 'activation' | 'inhibition' | 'binding' | 'phosphorylation';
  weight: number;
}

export interface LineageClonalNode {
  id: string;
  cloneName: string;
  frequencyPrimary: number;
  metastaticRoutes: Array<{ targetOrgan: OrganSite; migrationScore: number; timingWeeks: number }>;
  acquiredMutations: string[];
  parentCloneId?: string;
}

export interface SurvivalDataPoint {
  months: number;
  survivalRate: number;
  atRisk: number;
}

export interface SurvivalCohort {
  id: string;
  title: string;
  organSite: OrganSite;
  sampleCount: number;
  highRiskCurve: SurvivalDataPoint[];
  lowRiskCurve: SurvivalDataPoint[];
  hazardRatio: number;
  pValue: number;
  stratifiedBy: string;
}

export interface RouteFlowStep {
  sourcePrimary: PrimaryCancerType;
  pathway: 'Hematogenous Circulatory' | 'Lymphatic Drainage' | 'Direct Peritoneal Seeding';
  destinationOrgan: OrganSite;
  frequencyPct: number;
  medianLatencyYears: number;
  keyAdhesionMolecules: string[];
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  description: string;
  category: 'Organotropism' | 'Multi-Omics' | 'Single-Cell' | 'Translational';
  estimatedRuntimeSec: number;
  inputs: string[];
  outputs: string[];
  steps: string[];
}

export interface WorkflowRunResult {
  runId: string;
  pipelineId: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  summaryMetrics?: Record<string, string | number>;
}

export interface DataGapMatrixItem {
  cancerType: PrimaryCancerType;
  organSite: OrganSite;
  pairedHumanSamplesCount: number;
  singleCellCellCount: number;
  spatialDatasetCount: number;
  metMapCellLineCount: number;
  gapSeverity: 'Critical Scarcity' | 'Moderate Gap' | 'Well Represented';
  keyMissingFeature: string;
}

export interface PreclinicalModelFidelity {
  id: string;
  modelClass: 'MetMap Cell Line Xenograft' | 'Subcutaneous PDX' | 'Syngeneic Mouse' | 'GEMM' | 'Orthotopic PDOX';
  modelName: string;
  primaryCancer: PrimaryCancerType;
  targetOrgan: OrganSite;
  organotropismFidelityScore: number; // 0 - 100
  immuneMicroenvironmentFidelity: 'Intact Human' | 'Murine Only' | 'Immunodeficient' | 'Partial Humanized';
  cascadeCompleteness: 'End-Stage Only' | 'Extravasation to Outgrowth' | 'Full Cascade (Local to Met)' | 'Dormancy & Outgrowth';
  dormancyRecapitulation: boolean; // Recapitulates NR2F1+ dormancy
  batchCorrectionMethod: 'Harmony' | 'Combat-seq' | 'Scanorama' | 'Uncorrected';
  dissociationProtocol: 'Whole-Cell Enzymatic' | 'Single-Nuclei RNA-seq' | 'Fresh Mechanical';
  limitations: string[];
  recommendedUse: string;
}

export interface MrdSurveillancePoint {
  month: number;
  ctDnaVafPct: number; // e.g. 0.082% down to 0.0001%
  ctDnaPpm: number; // Parts per million
  mrdStatus: 'Negative (<1 ppm)' | 'Low Molecular Residual (1-10 ppm)' | 'High Molecular Burden (>10 ppm)' | 'Overt Relapse';
  imagingStatus: 'No Evidence of Disease' | 'Ambiguous Lesion' | 'Confirmed RECIST Relapse';
  treatmentPhase: 'Post-Resection Adjuvant' | 'Surveillance Window' | 'Molecular Relapse Triggered Therapy' | 'Clinical Progression';
}

// ==================== ONTOLOGY & KNOWLEDGE GRAPH TYPES ====================

export interface MetastasisOntologyClass {
  id: string; // e.g. "MPO:0000005"
  label: string;
  definition: string;
  parentTermId?: string;
  oboNamespace: 'metastatic_cascade_process' | 'dissemination_route' | 'niche_environment' | 'clinical_synchronicity';
  xrefs: string[]; // e.g. ["UBERON:0002107", "FMA:14543", "NCIT:C3261"]
  synonyms: string[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  ontologyClassId: string;
  nodeType: 'PrimarySite' | 'CascadeProcess' | 'DisseminationRoute' | 'OrganNiche' | 'PatientSample' | 'CellState' | 'GeneDriver';
  properties: Record<string, any>;
  x?: number;
  y?: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: 'DISSEMINATES_VIA' | 'LOCATED_IN' | 'HAS_CASCADE_STAGE' | 'HAS_PREFERRED_NICHE' | 'EXPRESSES_MARKER' | 'ORIGINATES_FROM';
  properties: Record<string, any>;
}

export interface HarmonizationInput {
  rawSampleId: string;
  sourceConsortium: 'TCGA' | 'cBioPortal' | 'MET500' | 'SingleCellAtlas' | 'InHouseClinical';
  rawPrimaryText: string;
  rawSiteText: string;
  rawTnmCode?: string;
  rawSynchronicityText?: string;
  rawFreeTextNote?: string;
}

export interface HarmonizationOutputItem {
  input: HarmonizationInput;
  normalizedPrimaryCancer: PrimaryCancerType;
  normalizedOrganSite: OrganSite;
  mpoCascadeStage: MetastasisOntologyClass;
  mpoRoute: MetastasisOntologyClass;
  synchronicity: 'Synchronous' | 'Metachronous';
  latencyMonths?: number;
  confidenceScore: number; // 0.0 - 1.0
  reasoningChain: string;
  generatedCypherSnippet: string;
}


