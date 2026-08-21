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
  DataGapMatrixItem,
  PreclinicalModelFidelity,
  MrdSurveillancePoint,
  MetastasisOntologyClass,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  HarmonizationInput
} from '../types/metastasis';



export const METMAP_CELL_LINES: MetMapCellLine[] = [
  {
    id: 'cell-001',
    name: 'MDA-MB-231-BoM',
    cancerType: 'Breast (BRCA)',
    primarySite: 'Mammary Gland',
    organTropismScores: {
      bone: 94,
      liver: 38,
      brain: 22,
      lung: 65,
      lymph_node: 80,
      peritoneum: 15
    },
    barcodedLineageCount: 1250,
    driverMutations: ['TP53 (R280K)', 'BRAF (G464V)', 'CDKN2A (Del)', 'NF1 (Q1336*)'],
    emtStatus: 'Mesenchymal',
    cedrDrugSensitivities: [
      { drug: 'Denosumab (RANKL Ab)', target: 'RANKL', ic50_uM: 0.12 },
      { drug: 'Cabozantinib', target: 'MET/VEGFR2', ic50_uM: 0.45 },
      { drug: 'Palbociclib', target: 'CDK4/6', ic50_uM: 3.8 }
    ]
  },
  {
    id: 'cell-002',
    name: 'MDA-MB-231-BrM',
    cancerType: 'Breast (BRCA)',
    primarySite: 'Mammary Gland',
    organTropismScores: {
      bone: 28,
      liver: 35,
      brain: 92,
      lung: 50,
      lymph_node: 72,
      peritoneum: 10
    },
    barcodedLineageCount: 980,
    driverMutations: ['TP53 (R280K)', 'PIK3CA (H1047R)', 'EGFR (Amp)'],
    emtStatus: 'Mesenchymal',
    cedrDrugSensitivities: [
      { drug: 'Lapatinib', target: 'HER2/EGFR', ic50_uM: 0.28 },
      { drug: 'Everolimus', target: 'mTOR', ic50_uM: 0.19 },
      { drug: 'Pembrolizumab', target: 'PD-1', ic50_uM: 1.2 }
    ]
  },
  {
    id: 'cell-003',
    name: 'HT-29-LM3',
    cancerType: 'Colorectal (COAD/READ)',
    primarySite: 'Colon',
    organTropismScores: {
      bone: 18,
      liver: 96,
      brain: 12,
      lung: 42,
      lymph_node: 88,
      peritoneum: 60
    },
    barcodedLineageCount: 1500,
    driverMutations: ['APC (E1309*)', 'BRAF (V600E)', 'TP53 (R273H)', 'PIK3CA (P539R)'],
    emtStatus: 'Hybrid EMT',
    cedrDrugSensitivities: [
      { drug: 'Encorafenib + Cetuximab', target: 'BRAF + EGFR', ic50_uM: 0.08 },
      { drug: 'Fruquintinib', target: 'VEGFR1/2/3', ic50_uM: 0.32 },
      { drug: 'Oxaliplatin', target: 'DNA Crosslink', ic50_uM: 2.1 }
    ]
  },
  {
    id: 'cell-004',
    name: 'PC-3-Met',
    cancerType: 'Prostate (PRAD)',
    primarySite: 'Prostate',
    organTropismScores: {
      bone: 98,
      liver: 25,
      brain: 8,
      lung: 30,
      lymph_node: 85,
      peritoneum: 12
    },
    barcodedLineageCount: 1100,
    driverMutations: ['PTEN (Del)', 'TP53 (K132N)', 'AR (F877L)'],
    emtStatus: 'Mesenchymal',
    cedrDrugSensitivities: [
      { drug: 'Radium-223 Mimetic', target: 'Bone Alpha Emitter', ic50_uM: 0.05 },
      { drug: 'Enzalutamide', target: 'AR', ic50_uM: 4.5 },
      { drug: 'Olaparib', target: 'PARP1', ic50_uM: 0.85 }
    ]
  },
  {
    id: 'cell-005',
    name: 'A549-BrMet',
    cancerType: 'Lung Non-Small (LUAD/LUSC)',
    primarySite: 'Lung',
    organTropismScores: {
      bone: 45,
      liver: 52,
      brain: 89,
      lung: 70,
      lymph_node: 90,
      peritoneum: 15
    },
    barcodedLineageCount: 1320,
    driverMutations: ['KRAS (G12S)', 'STK11 (F354L)', 'KEAP1 (D236H)', 'CDKN2A (Del)'],
    emtStatus: 'Hybrid EMT',
    cedrDrugSensitivities: [
      { drug: 'Sotorasib', target: 'KRAS G12C/S', ic50_uM: 0.65 },
      { drug: 'Osimertinib', target: 'EGFR', ic50_uM: 1.8 },
      { drug: 'Atezolizumab', target: 'PD-L1', ic50_uM: 0.75 }
    ]
  },
  {
    id: 'cell-006',
    name: 'A375-M2',
    cancerType: 'Melanoma (SKCM)',
    primarySite: 'Skin',
    organTropismScores: {
      bone: 62,
      liver: 78,
      brain: 88,
      lung: 82,
      lymph_node: 95,
      peritoneum: 20
    },
    barcodedLineageCount: 1750,
    driverMutations: ['BRAF (V600E)', 'CDKN2A (Del)', 'PTEN (Loss)'],
    emtStatus: 'Mesenchymal',
    cedrDrugSensitivities: [
      { drug: 'Dabrafenib + Trametinib', target: 'BRAF + MEK', ic50_uM: 0.04 },
      { drug: 'Nivolumab + Ipilimumab', target: 'PD-1 + CTLA-4', ic50_uM: 0.22 },
      { drug: 'Buparlisib', target: 'PI3K', ic50_uM: 0.95 }
    ]
  },
  {
    id: 'cell-007',
    name: 'PANC-1-LivMet',
    cancerType: 'Pancreatic (PAAD)',
    primarySite: 'Pancreas',
    organTropismScores: {
      bone: 10,
      liver: 98,
      brain: 5,
      lung: 55,
      lymph_node: 82,
      peritoneum: 75
    },
    barcodedLineageCount: 840,
    driverMutations: ['KRAS (G12D)', 'TP53 (R273C)', 'SMAD4 (Del)', 'CDKN2A (Del)'],
    emtStatus: 'Hybrid EMT',
    cedrDrugSensitivities: [
      { drug: 'Gemcitabine + Nab-Paclitaxel', target: 'DNA + Tubulin', ic50_uM: 1.2 },
      { drug: 'FAL-Metabolic Inhibitor', target: 'Glutaminase (GLS)', ic50_uM: 0.35 },
      { drug: 'Defactinib', target: 'FAK', ic50_uM: 0.58 }
    ]
  }
];

export const PRIMARY_MET_PAIRS: PrimaryMetPairSample[] = [
  {
    pairId: 'pair-001',
    patientId: 'PT-BRCA-802',
    cancerType: 'Breast (BRCA)',
    primaryLocation: 'Mammary Duct (T2N1M0)',
    metastaticSite: 'bone',
    timeToMetastasisMonths: 28,
    treatmentHistory: ['Lumpectomy', 'AC-T Chemotherapy', 'Letrozole (Adjuvant)'],
    mutationsGain: ['ESR1 (Y537S)', 'MYC (Amplification)', 'FGFR1 (Amplification)'],
    mutationsLoss: ['CDH1 (Loss of Heterozygosity)'],
    mutationsShared: ['TP53 (R175H)', 'PIK3CA (E545K)'],
    geneExpressionDeltaLog2FC: {
      RANKL: 3.82,
      CXCR4: 2.95,
      ITGAV: 2.41,
      MMP9: 2.15,
      CDH1: -3.20,
      ZEB1: 2.60,
      NR2F1: -1.85,
      CD274: 1.90
    },
    atacAccessibilityPeaks: [
      { region: 'chr18:60382010', geneAssociated: 'RANKL', primaryAccess: 12.4, metAccess: 78.9, tfBinding: 'RUNX2/TEAD4' },
      { region: 'chr2:136541000', geneAssociated: 'CXCR4', primaryAccess: 18.2, metAccess: 85.1, tfBinding: 'AP-1/NF-kB' },
      { region: 'chr16:68842100', geneAssociated: 'CDH1', primaryAccess: 94.1, metAccess: 8.5, tfBinding: 'SNAI1/ZEB1 (Repressed)' }
    ],
    microenvironmentPrimary: {
      'Cancer Cells': 68,
      'Fibroblasts': 14,
      'CD8+ T Cells': 10,
      'Macrophages': 5,
      'Endothelial': 3
    },
    microenvironmentMet: {
      'Cancer Cells': 52,
      'Osteoclasts': 18,
      'Osteoblasts/Stromal': 12,
      'M2 Macrophages': 11,
      'Exhausted T Cells': 7
    },
    proteomicsDelta: {
      'p-ERK1/2': 2.4,
      'p-AKT (S473)': 1.8,
      'E-Cadherin': -3.5,
      'N-Cadherin': 2.9,
      'Integrin alpha-v-beta-3': 3.1
    },
    metabolomicsDelta: {
      'L-Lactate': 2.8,
      'Hydroxyproline': 4.2, // Bone matrix collagen breakdown
      '2-Hydroxyglutarate': 0.8,
      'Citrate': -1.9
    }
  },
  {
    pairId: 'pair-002',
    patientId: 'PT-COAD-419',
    cancerType: 'Colorectal (COAD/READ)',
    primaryLocation: 'Sigmoid Colon (T3N2M0)',
    metastaticSite: 'liver',
    timeToMetastasisMonths: 14,
    treatmentHistory: ['Hemicolectomy', 'FOLFOX4 (6 cycles)'],
    mutationsGain: ['KRAS (G12D - Subclonal Expansion)', 'ARID1A (Truncation)'],
    mutationsLoss: ['SMAD4 (Loss)'],
    mutationsShared: ['APC (R1450*)', 'TP53 (R248Q)'],
    geneExpressionDeltaLog2FC: {
      MET: 4.12,
      HGF: 3.45,
      CLDN2: 2.80,
      MMP2: 2.10,
      CDH1: -1.20,
      CD274: 2.85,
      SNAI1: 1.95,
      SLC2A1: 2.50
    },
    atacAccessibilityPeaks: [
      { region: 'chr7:116423000', geneAssociated: 'MET', primaryAccess: 22.1, metAccess: 92.4, tfBinding: 'HIF1A/STAT3' },
      { region: 'chr20:34120000', geneAssociated: 'CLDN2', primaryAccess: 15.0, metAccess: 71.3, tfBinding: 'TCF4/LEF1' }
    ],
    microenvironmentPrimary: {
      'Cancer Cells': 72,
      'Normal Mucosa': 8,
      'T Cells': 12,
      'Stromal': 8
    },
    microenvironmentMet: {
      'Cancer Cells': 58,
      'Kupffer Cells': 16,
      'Hepatic Stellate Cells': 14,
      'M2 Macrophages': 8,
      'Regulatory T Cells': 4
    },
    proteomicsDelta: {
      'p-MET (Y1234/1235)': 3.8,
      'p-STAT3 (Y705)': 2.9,
      'Claudin-2': 2.6,
      'Vimentin': 1.7
    },
    metabolomicsDelta: {
      'L-Lactate': 3.5,
      'Palmitate': 2.9,
      'Glutamine': -2.1,
      'Acetoacetate': 1.6
    }
  },
  {
    pairId: 'pair-003',
    patientId: 'PT-LUAD-105',
    cancerType: 'Lung Non-Small (LUAD/LUSC)',
    primaryLocation: 'Right Upper Lobe (T2aN0M0)',
    metastaticSite: 'brain',
    timeToMetastasisMonths: 9,
    treatmentHistory: ['Lobectomy', 'Cisplatin + Pemetrexed'],
    mutationsGain: ['EGFR (T790M + C797S Secondary)', 'MET (Amplification)'],
    mutationsLoss: ['RB1 (Loss)'],
    mutationsShared: ['EGFR (L858R)', 'TP53 (R273H)'],
    geneExpressionDeltaLog2FC: {
      L1CAM: 4.50,
      SERPINB2: 3.20,
      PCDH7: 2.85,
      VEGFA: 3.10,
      NR2F1: 2.40, // Dormant niche adaptation in astrocytes
      ABCB1: 2.90,
      MMP9: 2.70
    },
    atacAccessibilityPeaks: [
      { region: 'chr3:156200000', geneAssociated: 'L1CAM', primaryAccess: 14.2, metAccess: 88.6, tfBinding: 'SOX2/OCT4' },
      { region: 'chr18:61500000', geneAssociated: 'SERPINB2', primaryAccess: 11.0, metAccess: 65.4, tfBinding: 'STAT1/IRF1' }
    ],
    microenvironmentPrimary: {
      'Cancer Cells': 75,
      'Alveolar Macrophages': 10,
      'Stromal/CAF': 10,
      'Lymphocytes': 5
    },
    microenvironmentMet: {
      'Cancer Cells': 48,
      'Reactive Astrocytes': 22,
      'Microglia': 18,
      'Brain Endothelial': 8,
      'Immunosuppressive Myeloid': 4
    },
    proteomicsDelta: {
      'L1CAM': 4.1,
      'p-EGFR (Y1068)': 3.2,
      'SerpinB2': 2.8,
      'ZO-1 (Tight Junction)': -2.9
    },
    metabolomicsDelta: {
      'GABA': 2.4,
      'Glutamate': 3.1,
      'Lactate': 2.7,
      'Glucose-6-Phosphate': -1.8
    }
  }
];

export const SINGLE_CELL_ATLAS_POINTS: SingleCellMetaPoint[] = [
  // Bone Met Cluster - Invasive & Dormant
  { id: 'sc-001', sampleId: 'HCA-BM-01', cancerType: 'Breast (BRCA)', organSite: 'bone', cellType: 'Metastatic Cancer Cell', cellState: 'Dormant', umapX: -8.2, umapY: 6.4, pseudotime: 0.12, expression: { VIM: 1.2, CDH1: 3.5, CDH2: 0.8, NR2F1: 4.8, CD274: 0.5, ABCB1: 0.8, MMP9: 0.4, RANKL: 1.1 } },
  { id: 'sc-002', sampleId: 'HCA-BM-01', cancerType: 'Breast (BRCA)', organSite: 'bone', cellType: 'Metastatic Cancer Cell', cellState: 'Invasive', umapX: -6.5, umapY: 8.1, pseudotime: 0.45, expression: { VIM: 4.2, CDH1: 0.4, CDH2: 3.9, NR2F1: 0.8, CD274: 2.1, ABCB1: 1.8, MMP9: 4.5, RANKL: 3.9 } },
  { id: 'sc-003', sampleId: 'HCA-BM-02', cancerType: 'Breast (BRCA)', organSite: 'bone', cellType: 'Osteoclast', cellState: 'Proliferative Outgrowth', umapX: -4.1, umapY: 9.5, pseudotime: 0.85, expression: { VIM: 0.8, CDH1: 0.1, CDH2: 1.2, NR2F1: 0.2, CD274: 1.5, ABCB1: 0.5, MMP9: 3.8, RANKL: 4.8 } },
  { id: 'sc-004', sampleId: 'HCA-BM-02', cancerType: 'Prostate (PRAD)', organSite: 'bone', cellType: 'Metastatic Cancer Cell', cellState: 'Drug Resistant', umapX: -5.8, umapY: 10.2, pseudotime: 0.92, expression: { VIM: 3.8, CDH1: 0.9, CDH2: 3.1, NR2F1: 1.1, CD274: 3.2, ABCB1: 4.9, MMP9: 3.2, RANKL: 4.2 } },
  
  // Liver Met Cluster - Immune Suppressive & EMT
  { id: 'sc-005', sampleId: 'TISCH-LM-11', cancerType: 'Colorectal (COAD/READ)', organSite: 'liver', cellType: 'Metastatic Cancer Cell', cellState: 'EMT High', umapX: 7.4, umapY: -3.2, pseudotime: 0.58, expression: { VIM: 4.8, CDH1: 0.5, CDH2: 4.2, NR2F1: 0.4, CD274: 3.5, ABCB1: 2.1, MMP9: 3.9, RANKL: 0.6 } },
  { id: 'sc-006', sampleId: 'TISCH-LM-11', cancerType: 'Colorectal (COAD/READ)', organSite: 'liver', cellType: 'Kupffer Cell', cellState: 'Immune Suppressive', umapX: 8.8, umapY: -4.5, pseudotime: 0.62, expression: { VIM: 1.5, CDH1: 0.1, CDH2: 0.5, NR2F1: 0.2, CD274: 4.9, ABCB1: 0.8, MMP9: 2.8, RANKL: 0.3 } },
  { id: 'sc-007', sampleId: 'TISCH-LM-12', cancerType: 'Pancreatic (PAAD)', organSite: 'liver', cellType: 'Cancer-Associated Fibroblast', cellState: 'Immune Suppressive', umapX: 9.1, umapY: -2.1, pseudotime: 0.74, expression: { VIM: 4.9, CDH1: 0.2, CDH2: 2.8, NR2F1: 0.5, CD274: 3.1, ABCB1: 1.2, MMP9: 4.2, RANKL: 0.8 } },
  
  // Brain Met Cluster - Dormant to Outgrowth
  { id: 'sc-008', sampleId: 'BrM-Atlas-04', cancerType: 'Lung Non-Small (LUAD/LUSC)', organSite: 'brain', cellType: 'Metastatic Cancer Cell', cellState: 'Dormant', umapX: 1.2, umapY: -9.1, pseudotime: 0.08, expression: { VIM: 1.9, CDH1: 2.8, CDH2: 1.1, NR2F1: 4.6, CD274: 0.8, ABCB1: 1.1, MMP9: 0.9, RANKL: 0.2 } },
  { id: 'sc-009', sampleId: 'BrM-Atlas-04', cancerType: 'Lung Non-Small (LUAD/LUSC)', organSite: 'brain', cellType: 'Astrocyte', cellState: 'Invasive', umapX: 2.5, umapY: -7.8, pseudotime: 0.49, expression: { VIM: 3.5, CDH1: 0.3, CDH2: 2.4, NR2F1: 1.8, CD274: 2.4, ABCB1: 2.5, MMP9: 3.1, RANKL: 0.5 } },
  { id: 'sc-010', sampleId: 'BrM-Atlas-05', cancerType: 'Melanoma (SKCM)', organSite: 'brain', cellType: 'Metastatic Cancer Cell', cellState: 'Proliferative Outgrowth', umapX: 3.8, umapY: -8.9, pseudotime: 0.95, expression: { VIM: 4.5, CDH1: 0.2, CDH2: 4.5, NR2F1: 0.1, CD274: 4.1, ABCB1: 3.8, MMP9: 4.8, RANKL: 1.2 } },
  
  // Lung & Lymph Node Met Points
  { id: 'sc-011', sampleId: 'LnM-Atlas-02', cancerType: 'Breast (BRCA)', organSite: 'lymph_node', cellType: 'CD8+ T Cell', cellState: 'Immune Suppressive', umapX: -2.1, umapY: -4.2, pseudotime: 0.35, expression: { VIM: 0.8, CDH1: 0.1, CDH2: 0.2, NR2F1: 0.1, CD274: 4.8, ABCB1: 0.4, MMP9: 1.2, RANKL: 0.4 } },
  { id: 'sc-012', sampleId: 'LungM-Atlas-08', cancerType: 'Melanoma (SKCM)', organSite: 'lung', cellType: 'Endothelial', cellState: 'Invasive', umapX: 4.2, umapY: 4.8, pseudotime: 0.68, expression: { VIM: 3.1, CDH1: 0.8, CDH2: 2.1, NR2F1: 0.3, CD274: 1.8, ABCB1: 2.1, MMP9: 3.4, RANKL: 0.7 } }
];

export const NETWORK_NODES: NetworkGeneNode[] = [
  { id: 'TGFB1', label: 'TGF-β1', category: 'EMT', expressionPrimary: 12.4, expressionMetastasis: 48.9, log2FC: 1.98, associatedOrgans: ['bone', 'liver', 'lung'], x: 200, y: 150 },
  { id: 'SNAI1', label: 'Snail1', category: 'EMT', expressionPrimary: 8.1, expressionMetastasis: 35.2, log2FC: 2.12, associatedOrgans: ['bone', 'brain'], x: 140, y: 240 },
  { id: 'ZEB1', label: 'ZEB1', category: 'EMT', expressionPrimary: 10.5, expressionMetastasis: 42.1, log2FC: 2.00, associatedOrgans: ['bone', 'liver', 'peritoneum'], x: 280, y: 250 },
  { id: 'CDH2', label: 'N-Cadherin (CDH2)', category: 'Niche Remodeling', expressionPrimary: 15.0, expressionMetastasis: 72.4, log2FC: 2.27, associatedOrgans: ['bone', 'brain', 'liver'], x: 360, y: 180 },
  { id: 'RANKL', label: 'RANKL (TNFSF11)', category: 'Organotropism Homing', expressionPrimary: 4.2, expressionMetastasis: 68.1, log2FC: 4.02, associatedOrgans: ['bone'], x: 500, y: 120 },
  { id: 'RANK', label: 'RANK (TNFRSF11A)', category: 'Organotropism Homing', expressionPrimary: 8.9, expressionMetastasis: 54.0, log2FC: 2.60, associatedOrgans: ['bone'], x: 620, y: 130 },
  { id: 'MET', label: 'c-MET', category: 'Organotropism Homing', expressionPrimary: 18.5, expressionMetastasis: 88.2, log2FC: 2.25, associatedOrgans: ['liver', 'brain'], x: 480, y: 320 },
  { id: 'HGF', label: 'HGF', category: 'Organotropism Homing', expressionPrimary: 22.0, expressionMetastasis: 79.5, log2FC: 1.85, associatedOrgans: ['liver'], x: 600, y: 340 },
  { id: 'L1CAM', label: 'L1CAM', category: 'Organotropism Homing', expressionPrimary: 6.8, expressionMetastasis: 61.2, log2FC: 3.17, associatedOrgans: ['brain'], x: 220, y: 380 },
  { id: 'CD274', label: 'PD-L1 (CD274)', category: 'Immune Checkpoint', expressionPrimary: 11.2, expressionMetastasis: 52.4, log2FC: 2.23, associatedOrgans: ['liver', 'lung', 'brain'], x: 380, y: 410 },
  { id: 'NR2F1', label: 'NR2F1 (Dormancy Master)', category: 'Driver', expressionPrimary: 42.0, expressionMetastasis: 12.1, log2FC: -1.79, associatedOrgans: ['bone', 'brain'], x: 100, y: 380 },
  { id: 'MMP9', label: 'MMP-9', category: 'Niche Remodeling', expressionPrimary: 14.2, expressionMetastasis: 65.0, log2FC: 2.19, associatedOrgans: ['bone', 'lung', 'liver'], x: 440, y: 220 },
  { id: 'SLC16A3', label: 'MCT4 (Lactate Transporter)', category: 'Metabolic Adaptor', expressionPrimary: 16.0, expressionMetastasis: 58.4, log2FC: 1.87, associatedOrgans: ['liver', 'bone'], x: 300, y: 330 }
];

export const NETWORK_EDGES: NetworkEdge[] = [
  { source: 'TGFB1', target: 'SNAI1', type: 'activation', weight: 0.9 },
  { source: 'TGFB1', target: 'ZEB1', type: 'activation', weight: 0.85 },
  { source: 'SNAI1', target: 'CDH2', type: 'activation', weight: 0.92 },
  { source: 'ZEB1', target: 'NR2F1', type: 'inhibition', weight: 0.88 },
  { source: 'TGFB1', target: 'RANKL', type: 'activation', weight: 0.78 },
  { source: 'RANKL', target: 'RANK', type: 'binding', weight: 0.98 },
  { source: 'HGF', target: 'MET', type: 'phosphorylation', weight: 0.95 },
  { source: 'MET', target: 'MMP9', type: 'activation', weight: 0.82 },
  { source: 'L1CAM', target: 'MMP9', type: 'activation', weight: 0.75 },
  { source: 'ZEB1', target: 'CD274', type: 'activation', weight: 0.80 },
  { source: 'SLC16A3', target: 'TGFB1', type: 'activation', weight: 0.70 }
];

export const LINEAGE_CLONES: LineageClonalNode[] = [
  {
    id: 'clone-01',
    cloneName: 'Primary Ancestral (Clone A)',
    frequencyPrimary: 65.0,
    acquiredMutations: ['TP53 (R273H)', 'APC (E1309*)'],
    metastaticRoutes: [
      { targetOrgan: 'lymph_node', migrationScore: 82, timingWeeks: 12 }
    ]
  },
  {
    id: 'clone-02',
    cloneName: 'Bone-Homing Subclone (Clone B1)',
    frequencyPrimary: 18.5,
    acquiredMutations: ['RANKL (Enhancer Gain)', 'TEAD4 (Amplification)'],
    parentCloneId: 'clone-01',
    metastaticRoutes: [
      { targetOrgan: 'bone', migrationScore: 94, timingWeeks: 24 }
    ]
  },
  {
    id: 'clone-03',
    cloneName: 'Liver-Homing Subclone (Clone B2)',
    frequencyPrimary: 12.0,
    acquiredMutations: ['KRAS (G12D)', 'MET (Amplification)'],
    parentCloneId: 'clone-01',
    metastaticRoutes: [
      { targetOrgan: 'liver', migrationScore: 91, timingWeeks: 18 },
      { targetOrgan: 'peritoneum', migrationScore: 64, timingWeeks: 32 }
    ]
  },
  {
    id: 'clone-04',
    cloneName: 'Brain-Angiophilic Subclone (Clone C1)',
    frequencyPrimary: 4.5,
    acquiredMutations: ['L1CAM (High)', 'SERPINB2 (Amplification)'],
    parentCloneId: 'clone-02',
    metastaticRoutes: [
      { targetOrgan: 'brain', migrationScore: 88, timingWeeks: 36 }
    ]
  }
];

export const SURVIVAL_COHORTS: SurvivalCohort[] = [
  {
    id: 'surv-bone-01',
    title: 'Breast Cancer Bone Metastasis (MetMap High Bone Tropism)',
    organSite: 'bone',
    sampleCount: 342,
    stratifiedBy: 'Bone Metastatic Gene Signature (RANKL / CXCR4 / ITGAV)',
    hazardRatio: 2.84,
    pValue: 0.00012,
    highRiskCurve: [
      { months: 0, survivalRate: 100, atRisk: 171 },
      { months: 12, survivalRate: 82, atRisk: 140 },
      { months: 24, survivalRate: 58, atRisk: 99 },
      { months: 36, survivalRate: 38, atRisk: 65 },
      { months: 48, survivalRate: 24, atRisk: 41 },
      { months: 60, survivalRate: 15, atRisk: 25 }
    ],
    lowRiskCurve: [
      { months: 0, survivalRate: 100, atRisk: 171 },
      { months: 12, survivalRate: 94, atRisk: 160 },
      { months: 24, survivalRate: 84, atRisk: 143 },
      { months: 36, survivalRate: 72, atRisk: 123 },
      { months: 48, survivalRate: 64, atRisk: 109 },
      { months: 60, survivalRate: 58, atRisk: 99 }
    ]
  },
  {
    id: 'surv-liver-01',
    title: 'Colorectal Cancer Liver Metastasis (c-MET / HGF Axis)',
    organSite: 'liver',
    sampleCount: 488,
    stratifiedBy: 'Liver Tropism Score & Kupffer Evasion Signature',
    hazardRatio: 3.12,
    pValue: 0.00004,
    highRiskCurve: [
      { months: 0, survivalRate: 100, atRisk: 244 },
      { months: 12, survivalRate: 68, atRisk: 165 },
      { months: 24, survivalRate: 42, atRisk: 102 },
      { months: 36, survivalRate: 25, atRisk: 61 },
      { months: 48, survivalRate: 14, atRisk: 34 },
      { months: 60, survivalRate: 8, atRisk: 19 }
    ],
    lowRiskCurve: [
      { months: 0, survivalRate: 100, atRisk: 244 },
      { months: 12, survivalRate: 91, atRisk: 222 },
      { months: 24, survivalRate: 78, atRisk: 190 },
      { months: 36, survivalRate: 65, atRisk: 158 },
      { months: 48, survivalRate: 55, atRisk: 134 },
      { months: 60, survivalRate: 49, atRisk: 119 }
    ]
  },
  {
    id: 'surv-brain-01',
    title: 'Lung & Breast Cancer Brain Tropism (L1CAM / SERPINB2 Signature)',
    organSite: 'brain',
    sampleCount: 210,
    stratifiedBy: 'Vascular Co-option & Astrocyte Cross-Talk Index',
    hazardRatio: 3.65,
    pValue: 0.00001,
    highRiskCurve: [
      { months: 0, survivalRate: 100, atRisk: 105 },
      { months: 6, survivalRate: 62, atRisk: 65 },
      { months: 12, survivalRate: 35, atRisk: 37 },
      { months: 18, survivalRate: 18, atRisk: 19 },
      { months: 24, survivalRate: 10, atRisk: 11 },
      { months: 36, survivalRate: 4, atRisk: 4 }
    ],
    lowRiskCurve: [
      { months: 0, survivalRate: 100, atRisk: 105 },
      { months: 6, survivalRate: 88, atRisk: 92 },
      { months: 12, survivalRate: 72, atRisk: 75 },
      { months: 18, survivalRate: 58, atRisk: 61 },
      { months: 24, survivalRate: 48, atRisk: 50 },
      { months: 36, survivalRate: 39, atRisk: 41 }
    ]
  }
];

export const DISSEMINATION_ROUTES: RouteFlowStep[] = [
  {
    sourcePrimary: 'Breast (BRCA)',
    pathway: 'Hematogenous Circulatory',
    destinationOrgan: 'bone',
    frequencyPct: 70,
    medianLatencyYears: 3.5,
    keyAdhesionMolecules: ['Integrin αvβ3', 'CXCR4', 'RANKL']
  },
  {
    sourcePrimary: 'Breast (BRCA)',
    pathway: 'Hematogenous Circulatory',
    destinationOrgan: 'brain',
    frequencyPct: 20,
    medianLatencyYears: 4.8,
    keyAdhesionMolecules: ['L1CAM', 'ST6GALNAC5', 'SERPINB2']
  },
  {
    sourcePrimary: 'Colorectal (COAD/READ)',
    pathway: 'Hematogenous Circulatory',
    destinationOrgan: 'liver',
    frequencyPct: 78,
    medianLatencyYears: 1.8,
    keyAdhesionMolecules: ['Claudin-2', 'c-MET', 'E-Selectin']
  },
  {
    sourcePrimary: 'Lung Non-Small (LUAD/LUSC)',
    pathway: 'Hematogenous Circulatory',
    destinationOrgan: 'brain',
    frequencyPct: 45,
    medianLatencyYears: 1.1,
    keyAdhesionMolecules: ['L1CAM', 'PCDH7', 'N-Cadherin']
  },
  {
    sourcePrimary: 'Prostate (PRAD)',
    pathway: 'Hematogenous Circulatory',
    destinationOrgan: 'bone',
    frequencyPct: 88,
    medianLatencyYears: 5.2,
    keyAdhesionMolecules: ['Annexin A2', 'E-Selectin', 'CXCR4']
  },
  {
    sourcePrimary: 'Pancreatic (PAAD)',
    pathway: 'Direct Peritoneal Seeding',
    destinationOrgan: 'peritoneum',
    frequencyPct: 55,
    medianLatencyYears: 0.8,
    keyAdhesionMolecules: ['Mesothelin', 'Integrin α5β1', 'ICAM-1']
  }
];

export const WORKFLOW_PIPELINES: WorkflowPipeline[] = [
  {
    id: 'pipe-01',
    name: 'Organotropism Driver & Biomarker Discovery',
    description: 'Integrates MetMap cell line scores with matched TCGA/MET500 primary-met pair transcriptomes to extract organ-homing gene expression signatures.',
    category: 'Organotropism',
    estimatedRuntimeSec: 4,
    inputs: ['MetMap Organ Scores', 'Matched Primary-Met RNA-seq', 'Limma/DESeq2 Matrix'],
    outputs: ['Organ-Specific Driver Genes', 'Log2FC Volcano Plot', 'GO/KEGG Enrichment'],
    steps: [
      'Standardize organ tropism scores across MetMap & patient cohorts',
      'Execute differential expression (Metastatic vs Primary)',
      'Cross-reference with scATAC-seq chromatin accessibility peaks',
      'Compute Organotropism Specificity Index (OSI)'
    ]
  },
  {
    id: 'pipe-02',
    name: 'Single-Cell Metastatic Niche & Dormancy Scoring',
    description: 'Runs Seurat/Scanpy clustering on single-cell atlases to partition metastatic cells into Invasive, Dormant (NR2F1+), and Immune Suppressive states.',
    category: 'Single-Cell',
    estimatedRuntimeSec: 6,
    inputs: ['Single-Cell Count Matrix (scRNA-seq)', 'Metadata (Organ Site, Treatment)'],
    outputs: ['UMAP Projections', 'Cell State Proportions', 'Monocle Pseudotime Trajectory'],
    steps: [
      'Filter low-quality cells & perform SCTransform normalization',
      'Compute UMAP & Harmony batch-effect correction by organ site',
      'Calculate Dormancy vs Outgrowth gene module scores',
      'Run CellPhoneDB receptor-ligand cross-talk with niche stromal cells'
    ]
  },
  {
    id: 'pipe-03',
    name: 'Multi-Omic Matrix Integration (MOFA+ / SNF)',
    description: 'Unifies Bulk RNA, scATAC-seq, Proteomics, and Metabolomics to generate a consolidated multi-layer feature heatmap for metastatic lesions.',
    category: 'Multi-Omics',
    estimatedRuntimeSec: 8,
    inputs: ['RNA-seq Log2FC', 'scATAC Peak Access', 'Phospho-Proteomics', 'XCMS Metabolomics'],
    outputs: ['MOFA Latent Factors', 'Integrated Multi-Omic Heatmap', 'Pathway Network Graph'],
    steps: [
      'Normalize variance across omics layers',
      'Fit MOFA+ latent factor model for organ tropism',
      'Map latent factors to KEGG/Reactome metabolic & signaling pathways',
      'Export network nodes & edge weights to Cytoscape format'
    ]
  },
  {
    id: 'pipe-04',
    name: 'MetMap Model Selection & CeDR Therapy Profiling',
    description: 'Matches patient metastatic profile against MetMap cell line database and CeDR drug sensitivity atlas to find site-specific therapeutic vulnerabilities.',
    category: 'Translational',
    estimatedRuntimeSec: 5,
    inputs: ['Patient Primary-Met Profile', 'CeDR Drug Sensitivity Matrix'],
    outputs: ['Top 5 MetMap Preclinical Models', 'Drug IC50 Heatmap', 'Synergy Prediction'],
    steps: [
      'Calculate Spearman correlation between patient met profile and MetMap cell lines',
      'Extract drug sensitivity profiles for matched models',
      'Identify synthetic lethal vulnerabilities in metastatic niche',
      'Generate Kaplan-Meier survival stratification by drug target expression'
    ]
  }
];

export const DATA_GAP_MATRIX: DataGapMatrixItem[] = [
  {
    cancerType: 'Breast (BRCA)',
    organSite: 'bone',
    pairedHumanSamplesCount: 51,
    singleCellCellCount: 42000,
    spatialDatasetCount: 8,
    metMapCellLineCount: 38,
    gapSeverity: 'Well Represented',
    keyMissingFeature: 'Longitudinal dormancy sampling during 5-10yr endocrine latency'
  },
  {
    cancerType: 'Breast (BRCA)',
    organSite: 'brain',
    pairedHumanSamplesCount: 18,
    singleCellCellCount: 12500,
    spatialDatasetCount: 3,
    metMapCellLineCount: 22,
    gapSeverity: 'Moderate Gap',
    keyMissingFeature: 'Paired primary-brain met scRNA-seq with astrocyte stromal co-capture'
  },
  {
    cancerType: 'Colorectal (COAD/READ)',
    organSite: 'liver',
    pairedHumanSamplesCount: 84,
    singleCellCellCount: 110000,
    spatialDatasetCount: 14,
    metMapCellLineCount: 45,
    gapSeverity: 'Well Represented',
    keyMissingFeature: 'Pre-metastatic niche priming kinetics in non-diseased liver tissue'
  },
  {
    cancerType: 'Colorectal (COAD/READ)',
    organSite: 'peritoneum',
    pairedHumanSamplesCount: 9,
    singleCellCellCount: 6800,
    spatialDatasetCount: 1,
    metMapCellLineCount: 12,
    gapSeverity: 'Critical Scarcity',
    keyMissingFeature: 'Lack of matched primary-peritoneal paired spatial multi-omics'
  },
  {
    cancerType: 'Prostate (PRAD)',
    organSite: 'bone',
    pairedHumanSamplesCount: 14,
    singleCellCellCount: 18000,
    spatialDatasetCount: 2,
    metMapCellLineCount: 19,
    gapSeverity: 'Moderate Gap',
    keyMissingFeature: 'Bone marrow aspirate dissociation artifacts (loss of endosteal niche cells)'
  },
  {
    cancerType: 'Prostate (PRAD)',
    organSite: 'brain',
    pairedHumanSamplesCount: 2,
    singleCellCellCount: 1200,
    spatialDatasetCount: 0,
    metMapCellLineCount: 4,
    gapSeverity: 'Critical Scarcity',
    keyMissingFeature: 'Extreme sample scarcity; no paired primary-brain multi-omics cohort exists'
  },
  {
    cancerType: 'Lung Non-Small (LUAD/LUSC)',
    organSite: 'brain',
    pairedHumanSamplesCount: 38,
    singleCellCellCount: 35000,
    spatialDatasetCount: 6,
    metMapCellLineCount: 29,
    gapSeverity: 'Well Represented',
    keyMissingFeature: 'Single-cell resolution of blood-brain barrier vascular co-option'
  },
  {
    cancerType: 'Pancreatic (PAAD)',
    organSite: 'liver',
    pairedHumanSamplesCount: 22,
    singleCellCellCount: 28000,
    spatialDatasetCount: 4,
    metMapCellLineCount: 15,
    gapSeverity: 'Moderate Gap',
    keyMissingFeature: 'Dense desmoplastic stroma dissociation bias in primary pancreatic tissue'
  },
  {
    cancerType: 'Melanoma (SKCM)',
    organSite: 'brain',
    pairedHumanSamplesCount: 29,
    singleCellCellCount: 41000,
    spatialDatasetCount: 5,
    metMapCellLineCount: 32,
    gapSeverity: 'Well Represented',
    keyMissingFeature: 'Immune-checkpoint resistance tracking across leptomeningeal spread'
  }
];

export const PRECLINICAL_MODELS: PreclinicalModelFidelity[] = [
  {
    id: 'model-001',
    modelClass: 'MetMap Cell Line Xenograft',
    modelName: 'MDA-MB-231-BoM (Barcoded Xenograft)',
    primaryCancer: 'Breast (BRCA)',
    targetOrgan: 'bone',
    organotropismFidelityScore: 92,
    immuneMicroenvironmentFidelity: 'Immunodeficient',
    cascadeCompleteness: 'Extravasation to Outgrowth',
    dormancyRecapitulation: false,
    batchCorrectionMethod: 'Harmony',
    dissociationProtocol: 'Whole-Cell Enzymatic',
    limitations: [
      'NSG mouse hosts lack T/B/NK cell adaptive immune responses',
      'Intracardiac injection bypasses local invasion & intravasation cascade steps'
    ],
    recommendedUse: 'High-throughput barcoded lineage tracking for osteolytic homing drivers'
  },
  {
    id: 'model-002',
    modelClass: 'Orthotopic PDOX',
    modelName: 'BrM-PDOX-082 (Intracranial Patient-Derived)',
    primaryCancer: 'Lung Non-Small (LUAD/LUSC)',
    targetOrgan: 'brain',
    organotropismFidelityScore: 96,
    immuneMicroenvironmentFidelity: 'Partial Humanized',
    cascadeCompleteness: 'Dormancy & Outgrowth',
    dormancyRecapitulation: true,
    batchCorrectionMethod: 'Combat-seq',
    dissociationProtocol: 'Single-Nuclei RNA-seq',
    limitations: [
      'High surgical expertise required',
      '3-6 month latency period before metastasis outgrowth'
    ],
    recommendedUse: 'Evaluating blood-brain barrier drug penetrance & astrocyte niche dormancy reactivation'
  },
  {
    id: 'model-003',
    modelClass: 'Syngeneic Mouse',
    modelName: '4T1-Luc Syngeneic Mammary Model',
    primaryCancer: 'Breast (BRCA)',
    targetOrgan: 'lung',
    organotropismFidelityScore: 78,
    immuneMicroenvironmentFidelity: 'Murine Only',
    cascadeCompleteness: 'Full Cascade (Local to Met)',
    dormancyRecapitulation: true,
    batchCorrectionMethod: 'Scanorama',
    dissociationProtocol: 'Whole-Cell Enzymatic',
    limitations: [
      'Murine cytokines do not fully bind human immune receptors',
      'Rapid primary tumor outgrowth often necessitates early primary resection'
    ],
    recommendedUse: 'Immunotherapy combination testing (PD-1 / CTLA-4 + anti-metastatic agents)'
  },
  {
    id: 'model-004',
    modelClass: 'GEMM',
    modelName: 'KPC Mouse (Pdx1-Cre; LSL-KrasG12D; LSL-Trp53R172H)',
    primaryCancer: 'Pancreatic (PAAD)',
    targetOrgan: 'liver',
    organotropismFidelityScore: 88,
    immuneMicroenvironmentFidelity: 'Murine Only',
    cascadeCompleteness: 'Full Cascade (Local to Met)',
    dormancyRecapitulation: true,
    batchCorrectionMethod: 'Harmony',
    dissociationProtocol: 'Single-Nuclei RNA-seq',
    limitations: [
      'Variable disease onset kinetics across littermates',
      'Dense fibroblastic stroma requires single-nuclei RNA-seq to avoid dissociation loss'
    ],
    recommendedUse: 'Spontaneous pancreatic-to-liver metastatic progression and pre-metastatic niche studies'
  },
  {
    id: 'model-005',
    modelClass: 'Subcutaneous PDX',
    modelName: 'COAD-PDX-112',
    primaryCancer: 'Colorectal (COAD/READ)',
    targetOrgan: 'liver',
    organotropismFidelityScore: 42,
    immuneMicroenvironmentFidelity: 'Immunodeficient',
    cascadeCompleteness: 'End-Stage Only',
    dormancyRecapitulation: false,
    batchCorrectionMethod: 'Uncorrected',
    dissociationProtocol: 'Fresh Mechanical',
    limitations: [
      'Subcutaneous flank implantation rarely metastasizes spontaneously to liver',
      'Lacks liver microvascular sinusoidal endothelial interaction'
    ],
    recommendedUse: 'Primary tumor bulk drug response testing; NOT recommended for organotropism studies'
  }
];

export const MRD_SURVEILLANCE_DATA: MrdSurveillancePoint[] = [
  { month: 0, ctDnaVafPct: 1.45, ctDnaPpm: 14500, mrdStatus: 'High Molecular Burden (>10 ppm)', imagingStatus: 'No Evidence of Disease', treatmentPhase: 'Post-Resection Adjuvant' },
  { month: 2, ctDnaVafPct: 0.12, ctDnaPpm: 1200, mrdStatus: 'High Molecular Burden (>10 ppm)', imagingStatus: 'No Evidence of Disease', treatmentPhase: 'Post-Resection Adjuvant' },
  { month: 4, ctDnaVafPct: 0.0008, ctDnaPpm: 8, mrdStatus: 'Low Molecular Residual (1-10 ppm)', imagingStatus: 'No Evidence of Disease', treatmentPhase: 'Surveillance Window' },
  { month: 6, ctDnaVafPct: 0.00005, ctDnaPpm: 0.5, mrdStatus: 'Negative (<1 ppm)', imagingStatus: 'No Evidence of Disease', treatmentPhase: 'Surveillance Window' },
  { month: 8, ctDnaVafPct: 0.00003, ctDnaPpm: 0.3, mrdStatus: 'Negative (<1 ppm)', imagingStatus: 'No Evidence of Disease', treatmentPhase: 'Surveillance Window' },
  { month: 10, ctDnaVafPct: 0.0014, ctDnaPpm: 14, mrdStatus: 'High Molecular Burden (>10 ppm)', imagingStatus: 'No Evidence of Disease', treatmentPhase: 'Molecular Relapse Triggered Therapy' },
  { month: 12, ctDnaVafPct: 0.018, ctDnaPpm: 180, mrdStatus: 'High Molecular Burden (>10 ppm)', imagingStatus: 'Ambiguous Lesion', treatmentPhase: 'Molecular Relapse Triggered Therapy' },
  { month: 14, ctDnaVafPct: 0.092, ctDnaPpm: 920, mrdStatus: 'High Molecular Burden (>10 ppm)', imagingStatus: 'Ambiguous Lesion', treatmentPhase: 'Molecular Relapse Triggered Therapy' },
  { month: 16, ctDnaVafPct: 0.48, ctDnaPpm: 4800, mrdStatus: 'Overt Relapse', imagingStatus: 'Confirmed RECIST Relapse', treatmentPhase: 'Clinical Progression' },
  { month: 18, ctDnaVafPct: 2.10, ctDnaPpm: 21000, mrdStatus: 'Overt Relapse', imagingStatus: 'Confirmed RECIST Relapse', treatmentPhase: 'Clinical Progression' }
];

// ==================== ONTOLOGY & KNOWLEDGE GRAPH DATA ====================

export const METASTASIS_ONTOLOGY_CLASSES: MetastasisOntologyClass[] = [
  {
    id: 'MPO:0000001',
    label: 'Local Invasion',
    definition: 'Breaching of the basement membrane and invasion into surrounding extracellular matrix by malignant tumor cells.',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C20227', 'GO:0043536'],
    synonyms: ['Extracellular matrix invasion', 'Basement membrane disruption']
  },
  {
    id: 'MPO:0000002',
    label: 'Intravasation',
    definition: 'Transendothelial migration of cancer cells into tumor blood vessels or lymphatic channels.',
    parentTermId: 'MPO:0000001',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C120468', 'GO:0001775'],
    synonyms: ['Vascular entry', 'Transendothelial entry']
  },
  {
    id: 'MPO:0000003',
    label: 'Circulation & Transport',
    definition: 'Survival and transit of circulating tumor cells (CTCs) or microemboli in systemic circulation.',
    parentTermId: 'MPO:0000002',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C120469'],
    synonyms: ['Hematogenous transit', 'CTC shear survival']
  },
  {
    id: 'MPO:0000004',
    label: 'Extravasation',
    definition: 'Adhesion to capillary endothelial walls in distant organ beds followed by transvascular emigration into parenchymal tissue.',
    parentTermId: 'MPO:0000003',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C120470', 'GO:0045123'],
    synonyms: ['Transvascular arrest', 'Endothelial exit']
  },
  {
    id: 'MPO:0000005',
    label: 'Colonization',
    definition: 'Adaptation and establishment of micrometastases in distant target organ niches.',
    parentTermId: 'MPO:0000004',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C120471'],
    synonyms: ['Micrometastatic seeding', 'Niche colonization']
  },
  {
    id: 'MPO:0000006',
    label: 'Dormancy State',
    definition: 'Reversible state of cellular or tumor mass quiescence (G0/G1 arrest) governed by microenvironmental signals like NR2F1 and TGF-beta2.',
    parentTermId: 'MPO:0000005',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C160533'],
    synonyms: ['Metastatic dormancy', 'Solitary cell quiescence', 'NR2F1-high latency']
  },
  {
    id: 'MPO:0000007',
    label: 'Reactivation & Outgrowth',
    definition: 'Escape from dormancy leading to vascularized macroscopic metastatic tumor outgrowth.',
    parentTermId: 'MPO:0000006',
    oboNamespace: 'metastatic_cascade_process',
    xrefs: ['NCIT:C120472'],
    synonyms: ['Macrometastasis outgrowth', 'Dormancy escape']
  },
  {
    id: 'MPO:0000101',
    label: 'Hematogenous Spread',
    definition: 'Dissemination route via venous or arterial blood vessel systems to distant capillaries.',
    oboNamespace: 'dissemination_route',
    xrefs: ['NCIT:C20228', 'FMA:50724'],
    synonyms: ['Vascular dissemination', 'Blood-borne spread']
  },
  {
    id: 'MPO:0000102',
    label: 'Lymphatic Spread',
    definition: 'Dissemination route via afferent lymphatic vessels into regional sentinel and distant lymph nodes.',
    oboNamespace: 'dissemination_route',
    xrefs: ['NCIT:C20229', 'FMA:50725'],
    synonyms: ['Lymph nodal dissemination', 'Lymphatic transport']
  },
  {
    id: 'MPO:0000103',
    label: 'Transcoelomic Spread',
    definition: 'Exfoliative seeding across peritoneal, pleural, or pericardial coelomic body cavities.',
    oboNamespace: 'dissemination_route',
    xrefs: ['NCIT:C120473', 'UBERON:0001155'],
    synonyms: ['Peritoneal seeding', 'Transperitoneal dissemination']
  },
  {
    id: 'MPO:0000201',
    label: 'Hepatic Sinusoidal Niche',
    definition: 'Liver parenchymal microenvironment composed of fenestrated sinusoidal endothelial cells, Kupffer cells, and hepatic stellate cells.',
    oboNamespace: 'niche_environment',
    xrefs: ['UBERON:0001281', 'FMA:14543'],
    synonyms: ['Liver sinusoidal niche', 'Hepatic metastasis niche']
  },
  {
    id: 'MPO:0000202',
    label: 'Osteolytic Endosteal Niche',
    definition: 'Bone marrow endosteal surface niche enriched in osteoclasts, osteoblasts, and CXCL12 stromal signals.',
    oboNamespace: 'niche_environment',
    xrefs: ['UBERON:0001474', 'FMA:24018'],
    synonyms: ['Bone endosteal niche', 'Trabecular bone niche']
  },
  {
    id: 'MPO:0000203',
    label: 'Perivascular Astrocytic Niche',
    definition: 'Brain parenchymal niche bounded by astrocyte end-feet and cerebral endothelial cells.',
    oboNamespace: 'niche_environment',
    xrefs: ['UBERON:0000955', 'FMA:50801'],
    synonyms: ['Blood-brain barrier niche', 'Brain perivascular niche']
  },
  {
    id: 'MPO:0000301',
    label: 'Synchronous Metastasis',
    definition: 'Metastatic lesions detected concurrently or within 6 months of primary tumor diagnosis.',
    oboNamespace: 'clinical_synchronicity',
    xrefs: ['NCIT:C133273'],
    synonyms: ['Presentation metastasis', 'De novo metastatic']
  },
  {
    id: 'MPO:0000302',
    label: 'Metachronous Metastasis',
    definition: 'Metastatic lesions presenting >6 months after primary tumor surgical resection.',
    oboNamespace: 'clinical_synchronicity',
    xrefs: ['NCIT:C133274'],
    synonyms: ['Recurrent metastasis', 'Relapsed distant lesion']
  }
];

export const KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  { id: 'node-crc', label: 'Colorectal (COAD/READ)', ontologyClassId: 'NCIT:C2955', nodeType: 'PrimarySite', properties: { tissue: 'Colon/Rectum', driver: 'APC/KRAS' }, x: 100, y: 150 },
  { id: 'node-brca', label: 'Breast (BRCA)', ontologyClassId: 'NCIT:C4872', nodeType: 'PrimarySite', properties: { subtype: 'ER+/HER2-', driver: 'PIK3CA' }, x: 100, y: 320 },
  { id: 'node-luad', label: 'Lung (LUAD)', ontologyClassId: 'NCIT:C3512', nodeType: 'PrimarySite', properties: { driver: 'EGFR/TP53' }, x: 100, y: 480 },

  { id: 'node-hem', label: 'Hematogenous Spread', ontologyClassId: 'MPO:0000101', nodeType: 'DisseminationRoute', properties: { vehicle: 'Portal Vein Circulation' }, x: 300, y: 180 },
  { id: 'node-[#1]', label: 'Lymphatic Spread', ontologyClassId: 'MPO:0000102', nodeType: 'DisseminationRoute', properties: { vehicle: 'Sentinel Node Chain' }, x: 300, y: 350 },

  { id: 'node-colonize', label: 'Colonization Stage', ontologyClassId: 'MPO:0000005', nodeType: 'CascadeProcess', properties: { driver: 'MMP9/VEGFA' }, x: 500, y: 200 },
  { id: 'node-dormant', label: 'Dormancy State', ontologyClassId: 'MPO:0000006', nodeType: 'CascadeProcess', properties: { marker: 'NR2F1 High' }, x: 500, y: 380 },

  { id: 'node-liver', label: 'Hepatic Sinusoidal Niche', ontologyClassId: 'MPO:0000201', nodeType: 'OrganNiche', properties: { organ: 'liver', cellTypes: 'Kupffer, HSC, LSEC' }, x: 700, y: 150 },
  { id: 'node-bone', label: 'Osteolytic Endosteal Niche', ontologyClassId: 'MPO:0000202', nodeType: 'OrganNiche', properties: { organ: 'bone', factors: 'RANKL, CXCL12' }, x: 700, y: 320 },
  { id: 'node-brain', label: 'Perivascular Astrocytic Niche', ontologyClassId: 'MPO:0000203', nodeType: 'OrganNiche', properties: { organ: 'brain', barrier: 'BBB' }, x: 700, y: 480 },

  { id: 'node-sample-82', label: 'Patient Pair #082', ontologyClassId: 'NCIT:C164032', nodeType: 'PatientSample', properties: { latencyMonths: 28, synchronicity: 'Metachronous' }, x: 400, y: 80 },
  { id: 'node-gene-mmp9', label: 'MMP9 (Matrix Metalloproteinase 9)', ontologyClassId: 'HGNC:7148', nodeType: 'GeneDriver', properties: { log2FC: 3.2, function: 'Extravasation' }, x: 880, y: 220 }
];

export const KNOWLEDGE_GRAPH_EDGES: KnowledgeGraphEdge[] = [
  { id: 'edge-1', sourceId: 'node-crc', targetId: 'node-hem', relation: 'DISSEMINATES_VIA', properties: { frequency: '85%' } },
  { id: 'edge-2', sourceId: 'node-hem', targetId: 'node-colonize', relation: 'HAS_CASCADE_STAGE', properties: { kinetics: 'Portal Flow First Pass' } },
  { id: 'edge-3', sourceId: 'node-colonize', targetId: 'node-liver', relation: 'LOCATED_IN', properties: { organotropismScore: 0.88 } },
  { id: 'edge-4', sourceId: 'node-brca', targetId: 'node-[#1]', relation: 'DISSEMINATES_VIA', properties: { sentinelInvolvement: 'High' } },
  { id: 'edge-5', sourceId: 'node-[#1]', targetId: 'node-dormant', relation: 'HAS_CASCADE_STAGE', properties: { medianLatencyYears: 4.2 } },
  { id: 'edge-6', sourceId: 'node-dormant', targetId: 'node-bone', relation: 'LOCATED_IN', properties: { latencyYears: 5.5 } },
  { id: 'edge-7', sourceId: 'node-sample-82', targetId: 'node-crc', relation: 'ORIGINATES_FROM', properties: { primaryTnm: 'pT3N1' } },
  { id: 'edge-8', sourceId: 'node-sample-82', targetId: 'node-liver', relation: 'LOCATED_IN', properties: { lesionSizeMm: 24 } },
  { id: 'edge-9', sourceId: 'node-liver', targetId: 'node-gene-mmp9', relation: 'EXPRESSES_MARKER', properties: { overexpressed: true } }
];

export const HARMONIZATION_TEST_SAMPLES: HarmonizationInput[] = [
  {
    rawSampleId: 'TCGA-AA-3821',
    sourceConsortium: 'TCGA',
    rawPrimaryText: 'Colon adenocarcinoma (COAD)',
    rawSiteText: 'hepatic metastasis lesion',
    rawTnmCode: 'pT3N2M1b',
    rawSynchronicityText: 'discovered 18 months post colectomy',
    rawFreeTextNote: 'Patient presented with elevated CEA 18 mo post resection. PET-CT confirmed 2.2 cm solitary liver lesion.'
  },
  {
    rawSampleId: 'MET500-BRCA-102',
    sourceConsortium: 'MET500',
    rawPrimaryText: 'Infiltrating ductal carcinoma breast',
    rawSiteText: 'lumbar spine osseous met',
    rawTnmCode: 'cT2N1M1a',
    rawSynchronicityText: 'de novo presentation',
    rawFreeTextNote: 'L3 vertebral lytic bone lesion on initial staging MRI. Biopsy confirms ER+ metastatic breast adenocarcinoma.'
  },
  {
    rawSampleId: 'cBio-LUAD-991',
    sourceConsortium: 'cBioPortal',
    rawPrimaryText: 'Non-small cell lung carcinoma',
    rawSiteText: 'right frontal lobe brain secondaries',
    rawTnmCode: 'pT2aN0M1c',
    rawSynchronicityText: 'synchronous diagnosis',
    rawFreeTextNote: 'Presenting neurological symptoms. Brain MRI shows ring-enhancing intra-axial brain mass.'
  }
];


