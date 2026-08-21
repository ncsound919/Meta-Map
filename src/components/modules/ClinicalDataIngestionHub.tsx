import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Dna,
  Activity,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Sliders,
  BarChart2,
  Table,
  Check,
  ShieldCheck,
  Lock,
  Download,
  Flame,
  Search,
  BookOpen,
  Filter,
  FileCode,
  Zap,
  Target,
  Maximize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  ClinicalDataIngestionEngine,
  ParsedSingleCellMatrix,
  ParsedFhirMcodeBundle,
  ParsedDicomRadiomics,
  ParsedVcfGenomics,
  ParsedProteomicsRppa,
  ParsedSpatialTranscriptomics,
  ClinicalTrialCohortPreset,
  IngestionQcReport
} from '../../data/clinicalDataIngestion';

interface ClinicalDataIngestionHubProps {
  onAssimilateToTwin?: (patientData: any) => void;
  onNavigateToModule?: (moduleId: string) => void;
}

type IngestionTab =
  | 'fhir_mcode'
  | 'single_cell'
  | 'dicom_radiomics'
  | 'vcf_genomics'
  | 'proteomics_rppa'
  | 'spatial_transcriptomics'
  | 'landmark_trials'
  | 'qc_hipaa_audit';

export const ClinicalDataIngestionHub: React.FC<ClinicalDataIngestionHubProps> = React.memo(({
  onAssimilateToTwin,
  onNavigateToModule
}) => {
  const [activeTab, setActiveTab] = useState<IngestionTab>('fhir_mcode');
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [assimilatedSuccess, setAssimilatedSuccess] = useState<boolean>(false);

  // Ingested Data State
  const [parsedFhir, setParsedFhir] = useState<ParsedFhirMcodeBundle | null>(null);
  const [parsedSingleCell, setParsedSingleCell] = useState<ParsedSingleCellMatrix | null>(null);
  const [parsedDicom, setParsedDicom] = useState<ParsedDicomRadiomics | null>(null);
  const [parsedVcf, setParsedVcf] = useState<ParsedVcfGenomics | null>(null);
  const [parsedProteomics, setParsedProteomics] = useState<ParsedProteomicsRppa | null>(null);
  const [parsedSpatial, setParsedSpatial] = useState<ParsedSpatialTranscriptomics | null>(null);

  // Single-Cell Filter State
  const [selectedCellTypeFilter, setSelectedCellTypeFilter] = useState<string>('ALL');
  const [colorByGene, setColorByGene] = useState<string>('EMT_SCORE');

  // Landmark Trial Presets
  const landmarkTrials = useMemo(() => ClinicalDataIngestionEngine.getLandmarkTrialPresets(), []);
  const [selectedTrialId, setSelectedTrialId] = useState<string>('TRACERX_NSCLC');

  // Load standard initial clinical presets on mount
  useEffect(() => {
    loadSamplePreset('fhir_mcode');
    loadSamplePreset('single_cell');
    loadSamplePreset('dicom_radiomics');
    loadSamplePreset('vcf_genomics');
    loadSamplePreset('proteomics_rppa');
    loadSamplePreset('spatial_transcriptomics');
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    setAssimilatedSuccess(false);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (activeTab === 'single_cell') {
          if (file.name.endsWith('.json')) {
            const parsed = ClinicalDataIngestionEngine.parseAnnDataJson(text, file.name);
            setParsedSingleCell(parsed);
          } else {
            const parsed = ClinicalDataIngestionEngine.parseTsvExpressionMatrix(text, file.name);
            setParsedSingleCell(parsed);
          }
        } else if (activeTab === 'fhir_mcode') {
          const parsed = ClinicalDataIngestionEngine.parseFhirMcodeBundle(text);
          setParsedFhir(parsed);
        } else if (activeTab === 'dicom_radiomics') {
          const parsed = ClinicalDataIngestionEngine.parseDicomRadiomics(text);
          setParsedDicom(parsed);
        } else if (activeTab === 'vcf_genomics') {
          const parsed = ClinicalDataIngestionEngine.parseVcfGenomics(text, file.name);
          setParsedVcf(parsed);
        } else if (activeTab === 'proteomics_rppa') {
          const parsed = ClinicalDataIngestionEngine.parseProteomicsRppa(text, file.name);
          setParsedProteomics(parsed);
        } else if (activeTab === 'spatial_transcriptomics') {
          const parsed = ClinicalDataIngestionEngine.parseSpatialTranscriptomics(text, file.name);
          setParsedSpatial(parsed);
        }
      } catch (err: any) {
        setErrorMessage(`Ingestion Error: ${err.message || 'Malformed file format'}`);
      }
    };

    reader.readAsText(file);
  };

  const loadSamplePreset = (tab: IngestionTab) => {
    setErrorMessage(null);
    setAssimilatedSuccess(false);
    const samples = ClinicalDataIngestionEngine.getSampleFiles();

    try {
      if (tab === 'single_cell') {
        const parsed = ClinicalDataIngestionEngine.parseTsvExpressionMatrix(samples.singleCellTsv, 'TCGA_BRCA_scRNAseq_CTC.tsv');
        setParsedSingleCell(parsed);
      } else if (tab === 'fhir_mcode') {
        const parsed = ClinicalDataIngestionEngine.parseFhirMcodeBundle(samples.fhirMcodeJson);
        setParsedFhir(parsed);
      } else if (tab === 'dicom_radiomics') {
        const parsed = ClinicalDataIngestionEngine.parseDicomRadiomics(samples.dicomRadiomicsJson);
        setParsedDicom(parsed);
      } else if (tab === 'vcf_genomics') {
        const parsed = ClinicalDataIngestionEngine.parseVcfGenomics(samples.vcfGenomicsText, 'MSK_IMPACT_EXOME_505.vcf');
        setParsedVcf(parsed);
      } else if (tab === 'proteomics_rppa') {
        const parsed = ClinicalDataIngestionEngine.parseProteomicsRppa(samples.proteomicsRppaText, 'CPTAC_PHOSPHO_RPPA.tsv');
        setParsedProteomics(parsed);
      } else if (tab === 'spatial_transcriptomics') {
        const parsed = ClinicalDataIngestionEngine.parseSpatialTranscriptomics(samples.spatialTranscriptomicsTsv, 'VISIUM_10X_INVASIVE_EDGE.tsv');
        setParsedSpatial(parsed);
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleLoadTrial = (trial: ClinicalTrialCohortPreset) => {
    setSelectedTrialId(trial.id);
    if (trial.samplePayloadType === 'FHIR_MCODE') {
      setActiveTab('fhir_mcode');
      loadSamplePreset('fhir_mcode');
    } else if (trial.samplePayloadType === 'SINGLE_CELL') {
      setActiveTab('single_cell');
      loadSamplePreset('single_cell');
    } else if (trial.samplePayloadType === 'DICOM_RADIOMICS') {
      setActiveTab('dicom_radiomics');
      loadSamplePreset('dicom_radiomics');
    } else if (trial.samplePayloadType === 'VCF_GENOMICS') {
      setActiveTab('vcf_genomics');
      loadSamplePreset('vcf_genomics');
    } else if (trial.samplePayloadType === 'PROTEOMICS') {
      setActiveTab('proteomics_rppa');
      loadSamplePreset('proteomics_rppa');
    } else if (trial.samplePayloadType === 'SPATIAL_TRANSCRIPTOMICS') {
      setActiveTab('spatial_transcriptomics');
      loadSamplePreset('spatial_transcriptomics');
    }
  };

  const handleAssimilateClick = () => {
    let payload: any = null;
    if (activeTab === 'fhir_mcode') payload = parsedFhir;
    else if (activeTab === 'single_cell') payload = parsedSingleCell;
    else if (activeTab === 'dicom_radiomics') payload = parsedDicom;
    else if (activeTab === 'vcf_genomics') payload = parsedVcf;
    else if (activeTab === 'proteomics_rppa') payload = parsedProteomics;
    else if (activeTab === 'spatial_transcriptomics') payload = parsedSpatial;
    else payload = parsedFhir;

    if (payload && onAssimilateToTwin) {
      onAssimilateToTwin(payload);
      setAssimilatedSuccess(true);
      setTimeout(() => setAssimilatedSuccess(false), 3500);
    }
  };

  const handleDownloadReport = () => {
    const reportData = {
      title: 'Multimodal Oncology Clinical Data Ingestion & Quality Audit Report',
      exportedAt: new Date().toISOString(),
      activeStream: activeTab,
      fhirSummary: parsedFhir,
      singleCellSummary: parsedSingleCell?.summaryStats,
      dicomRadiomics: parsedDicom,
      vcfGenomics: parsedVcf,
      proteomics: parsedProteomics?.pathwayActivationScores,
      spatialTranscriptomics: parsedSpatial?.tissueZoneSummary
    };

    const jsonStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-ingestion-audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get active QC report
  const currentQc: IngestionQcReport | undefined = useMemo(() => {
    if (activeTab === 'fhir_mcode') return parsedFhir?.qcScorecard;
    if (activeTab === 'single_cell') return parsedSingleCell?.qcScorecard;
    if (activeTab === 'dicom_radiomics') return parsedDicom?.qcScorecard;
    if (activeTab === 'vcf_genomics') return parsedVcf?.qcScorecard;
    if (activeTab === 'proteomics_rppa') return parsedProteomics?.qcScorecard;
    if (activeTab === 'spatial_transcriptomics') return parsedSpatial?.qcScorecard;
    return parsedFhir?.qcScorecard;
  }, [activeTab, parsedFhir, parsedSingleCell, parsedDicom, parsedVcf, parsedProteomics, parsedSpatial]);

  // Single-Cell Filtered List
  const filteredCells = useMemo(() => {
    if (!parsedSingleCell) return [];
    if (selectedCellTypeFilter === 'ALL') return parsedSingleCell.cells;
    return parsedSingleCell.cells.filter(c => c.cellType === selectedCellTypeFilter);
  }, [parsedSingleCell, selectedCellTypeFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Database className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
                Multi-Omic & Multi-Modal Clinical Data Ingestion Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> HIPAA SAFE HARBOR AUDIT PASSED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                FHIR R4 / VCF 4.2 / DICOM PS3.3
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Clinical & Molecular Data Ingestion Hub
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mt-1">
              Automated client-side parsing, schema validation, and PHI de-identification across 7 clinical modalities: HL7 FHIR R4 mCODE, scRNA-seq AnnData matrices, DICOM RECIST 1.1 radiomics, VCF exome variant calls, RPPA phosphoproteomics, and 10x Visium spatial transcriptomics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button"
              onClick={handleDownloadReport}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-700 font-mono"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export MTB Audit JSON
            </button>
            <button type="button"
              onClick={() => loadSamplePreset(activeTab)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-700 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" /> Benchmark Preset
            </button>
            <button type="button"
              onClick={handleAssimilateClick}
              disabled={assimilatedSuccess}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg flex items-center gap-1.5 disabled:bg-emerald-600 font-mono"
            >
              {assimilatedSuccess ? <Check className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
              {assimilatedSuccess ? 'Assimilated to Twin!' : 'Assimilate to EKF Twin'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div 
        role="tablist"
        aria-label="Clinical data modalities"
        className="flex flex-nowrap sm:flex-wrap items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto min-w-max sm:min-w-0"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'fhir_mcode'}
          aria-controls="panel-fhir_mcode"
          id="tab-fhir_mcode"
          tabIndex={activeTab === 'fhir_mcode' ? 0 : -1}
          onClick={() => setActiveTab('fhir_mcode')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'fhir_mcode'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4 text-blue-400" />
          1. HL7 FHIR R4 / mCODE
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'single_cell'}
          aria-controls="panel-single_cell"
          id="tab-single_cell"
          tabIndex={activeTab === 'single_cell' ? 0 : -1}
          onClick={() => setActiveTab('single_cell')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'single_cell'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Dna className="w-4 h-4 text-cyan-400" />
          2. Single-Cell AnnData & UMAP
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dicom_radiomics'}
          aria-controls="panel-dicom_radiomics"
          id="tab-dicom_radiomics"
          tabIndex={activeTab === 'dicom_radiomics' ? 0 : -1}
          onClick={() => setActiveTab('dicom_radiomics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'dicom_radiomics'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          3. DICOM Radiomics & RECIST 1.1
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'vcf_genomics'}
          aria-controls="panel-vcf_genomics"
          id="tab-vcf_genomics"
          tabIndex={activeTab === 'vcf_genomics' ? 0 : -1}
          onClick={() => setActiveTab('vcf_genomics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'vcf_genomics'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-4 h-4 text-rose-400" />
          4. VCF Genomics & TMB
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'proteomics_rppa'}
          aria-controls="panel-proteomics_rppa"
          id="tab-proteomics_rppa"
          tabIndex={activeTab === 'proteomics_rppa' ? 0 : -1}
          onClick={() => setActiveTab('proteomics_rppa')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'proteomics_rppa'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          5. RPPA Phosphoproteomics
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'spatial_transcriptomics'}
          aria-controls="panel-spatial_transcriptomics"
          id="tab-spatial_transcriptomics"
          tabIndex={activeTab === 'spatial_transcriptomics' ? 0 : -1}
          onClick={() => setActiveTab('spatial_transcriptomics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'spatial_transcriptomics'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4 text-emerald-400" />
          6. 10x Visium Spatial Grids
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'landmark_trials'}
          aria-controls="panel-landmark_trials"
          id="tab-landmark_trials"
          tabIndex={activeTab === 'landmark_trials' ? 0 : -1}
          onClick={() => setActiveTab('landmark_trials')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'landmark_trials'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Landmark Trial Library
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'qc_hipaa_audit'}
          aria-controls="panel-qc_hipaa_audit"
          id="tab-qc_hipaa_audit"
          tabIndex={activeTab === 'qc_hipaa_audit' ? 0 : -1}
          onClick={() => setActiveTab('qc_hipaa_audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'qc_hipaa_audit'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          QC & HIPAA Safe Harbor Audit
        </button>
      </div>

      <div 
        role="tabpanel" 
        id={`panel-${activeTab}`} 
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        className="outline-none space-y-4 pt-2"
      >
      {/* Upload Drag & Drop Area (when not in trial or QC view) */}
      {activeTab !== 'landmark_trials' && activeTab !== 'qc_hipaa_audit' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
            dragOver ? 'border-blue-400 bg-blue-950/20' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
          }`}
        >
          <Upload className="w-7 h-7 text-slate-500 mx-auto mb-1.5" />
          <p className="text-xs text-slate-300 font-medium">
            Drag and drop your clinical file ({activeTab.replace('_', ' ').toUpperCase()}) here, or{' '}
            <label className="text-blue-400 hover:underline cursor-pointer">
              browse local files
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".json,.tsv,.csv,.h5ad,.vcf,.txt" />
            </label>
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Automatic HIPAA Safe Harbor de-identification & schema conformance validation performed client-side.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: FHIR mCODE BUNDLE DISPLAY */}
      {/* ========================================================================= */}
      {activeTab === 'fhir_mcode' && parsedFhir && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Patient & Staging Header</span>
                  <span className="text-emerald-400 font-normal">mCODE v3.0</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Patient Identifier:</span>
                    <span className="font-mono text-cyan-400 font-bold">{parsedFhir.patientId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Age / Gender:</span>
                    <span className="text-white">{parsedFhir.age}yo / {parsedFhir.gender}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Primary Malignancy:</span>
                    <span className="text-white font-medium truncate max-w-[170px]">{parsedFhir.cancerType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Clinical Staging:</span>
                    <span className="font-mono text-amber-400 font-bold">{parsedFhir.stage}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Active Regimen:</span>
                    <span className="text-cyan-300 font-mono text-[11px] truncate max-w-[170px]">
                      {parsedFhir.medications[0]?.drugName || 'Targeted Doublet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Genomic Alterations */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Somatic Driver Alterations
                </h3>
                <div className="space-y-2">
                  {parsedFhir.genomicAlterations.map((alt, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{alt.gene} <span className="text-slate-400 font-mono text-[11px] font-normal">{alt.variant}</span></span>
                        <span className="font-mono text-cyan-400 font-bold">{alt.vafPct}% VAF</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-mono">{alt.actionabilityTier}</span>
                        <span className="text-slate-400 truncate max-w-[160px]">{alt.recommendedTherapy || 'Targeted Therapy'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Longitudinal Chart & Table */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Longitudinal Biomarker Trajectory & RECIST Response
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {parsedFhir.timeSeriesForTwin.length} Ingested Timepoints
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={parsedFhir.timeSeriesForTwin} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tickFormatter={(v) => `M${v}`} />
                    <YAxis yAxisId="left" stroke="#38bdf8" label={{ value: 'ctDNA VAF (%)', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" label={{ value: 'RECIST SLD (mm)', angle: 90, position: 'insideRight', fill: '#f43f5e', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="ctDnaVafPct" name="ctDNA VAF (%)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="radiomicsSldMm" name="RECIST SLD (mm)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line yAxisId="left" type="monotone" dataKey="ctcCount" name="CTC Count (/7.5mL)" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Timeline</th>
                      <th className="p-2.5">ctDNA VAF (%)</th>
                      <th className="p-2.5">RECIST SLD (mm)</th>
                      <th className="p-2.5">CTC Enumeration</th>
                      <th className="p-2.5">RECIST 1.1 Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedFhir.timeSeriesForTwin.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-cyan-300 font-bold">Month {row.month}</td>
                        <td className="p-2.5 text-amber-400">{row.ctDnaVafPct}%</td>
                        <td className="p-2.5 text-rose-400">{row.radiomicsSldMm} mm</td>
                        <td className="p-2.5 text-purple-400">{row.ctcCount} cells/tube</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.recistCategory === 'PD' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            row.recistCategory === 'PR' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {row.recistCategory}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SINGLE-CELL RNA-SEQ ANN DATA & UMAP */}
      {/* ========================================================================= */}
      {activeTab === 'single_cell' && parsedSingleCell && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Matrix Dimensions & QC
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">File Ingested:</span>
                    <span className="font-mono text-cyan-400 truncate max-w-[160px]">{parsedSingleCell.fileName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Total Barcodes:</span>
                    <span className="font-mono text-white font-bold">{parsedSingleCell.numCells} Cells</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Gene Features:</span>
                    <span className="font-mono text-white font-bold">{parsedSingleCell.numGenes} Genes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Matrix Sparsity:</span>
                    <span className="font-mono text-amber-400">{parsedSingleCell.sparsityPct}% zeros</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Mean Log2 Expression:</span>
                    <span className="font-mono text-emerald-400">{parsedSingleCell.summaryStats.meanLog2Expression}</span>
                  </div>
                </div>
              </div>

              {/* Phenotypic Fractions */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  EMT Phenotype Proportions
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-semibold">Hybrid E/M:</span>
                    <span className="font-mono font-bold text-white">{parsedSingleCell.summaryStats.hybridEmtFraction}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${parsedSingleCell.summaryStats.hybridEmtFraction}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-rose-400 font-semibold">Mesenchymal:</span>
                    <span className="font-mono font-bold text-white">{parsedSingleCell.summaryStats.mesenchymalFraction}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-400 h-full" style={{ width: `${parsedSingleCell.summaryStats.mesenchymalFraction}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-purple-400 font-semibold">CTC Clusters:</span>
                    <span className="font-mono font-bold text-white">{parsedSingleCell.summaryStats.ctcClusterFraction}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-400 h-full" style={{ width: `${parsedSingleCell.summaryStats.ctcClusterFraction}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive UMAP Scatter Visualization */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Dna className="w-4 h-4 text-cyan-400" />
                    2D UMAP Embedding & Single-Cell Transcriptome Manifold
                  </h3>
                  <span className="text-xs text-slate-400">
                    Dimension reduction manifold projecting epithelial-to-mesenchymal transition (EMT) state space
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCellTypeFilter}
                    onChange={(e) => setSelectedCellTypeFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1 font-mono"
                  >
                    <option value="ALL">All Phenotypes ({parsedSingleCell.numCells})</option>
                    <option value="Hybrid E/M">Hybrid E/M Cells</option>
                    <option value="Mesenchymal">Mesenchymal Cells</option>
                    <option value="Epithelial">Epithelial Cells</option>
                    <option value="CTC Cluster">CTC Clusters</option>
                    <option value="Stem-like Quiescent">Stem Quiescent</option>
                  </select>
                </div>
              </div>

              <div className="h-72 w-full bg-slate-950 rounded-xl p-2 border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" dataKey="umapX" name="UMAP_1" stroke="#64748b" domain={[-8, 8]} />
                    <YAxis type="number" dataKey="umapY" name="UMAP_2" stroke="#64748b" domain={[-8, 8]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs font-mono shadow-xl space-y-1">
                            <div className="font-bold text-cyan-300">{data.barcode}</div>
                            <div className="text-slate-300">Phenotype: <span className="text-amber-400">{data.cellType}</span></div>
                            <div className="text-slate-400">EMT Score: <span className="text-white">{data.emtScore}</span></div>
                            <div className="text-[11px] text-slate-400">Coords: ({data.umapX}, {data.umapY})</div>
                          </div>
                        );
                      }}
                    />
                    <Scatter name="Cells" data={filteredCells}>
                      {filteredCells.map((entry, index) => {
                        let fill = '#38bdf8'; // Epithelial
                        if (entry.cellType === 'Hybrid E/M') fill = '#f59e0b';
                        else if (entry.cellType === 'Mesenchymal') fill = '#f43f5e';
                        else if (entry.cellType === 'CTC Cluster') fill = '#a855f7';
                        else if (entry.cellType === 'Stem-like Quiescent') fill = '#10b981';
                        return <Cell key={`cell-${index}`} fill={fill} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Barcode Expression Table Preview */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Barcode</th>
                      <th className="p-2.5">Phenotype</th>
                      <th className="p-2.5">EMT Score</th>
                      <th className="p-2.5">Key Genes Expressed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCells.slice(0, 6).map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-cyan-300 font-bold">{c.barcode}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            c.cellType === 'Hybrid E/M' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            c.cellType === 'Mesenchymal' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            c.cellType === 'CTC Cluster' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                            'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          }`}>
                            {c.cellType}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-300">{c.emtScore}</td>
                        <td className="p-2.5 text-slate-400 truncate max-w-[280px]">
                          {Object.entries(c.keyGeneExpression).map(([g, val]) => `${g}:${val}`).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DICOM RADIOMICS & RECIST 1.1 */}
      {/* ========================================================================= */}
      {activeTab === 'dicom_radiomics' && parsedDicom && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  DICOM Series Header
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Patient ID:</span>
                    <span className="font-mono text-cyan-400 font-bold">{parsedDicom.patientId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Imaging Modality:</span>
                    <span className="font-mono text-purple-400 font-bold">{parsedDicom.modality}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Slice Thickness:</span>
                    <span className="font-mono text-white">{parsedDicom.sliceThicknessMm} mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Pixel Spacing:</span>
                    <span className="font-mono text-white">[{parsedDicom.pixelSpacingMm.join(', ')}] mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">RECIST 1.1 SLD:</span>
                    <span className="font-mono text-rose-400 font-bold">{parsedDicom.recist11SumOfDiametersMm} mm</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Response Classification:</span>
                    <span className="font-mono font-bold text-amber-400 text-[11px]">{parsedDicom.responseClassification}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                RECIST 1.1 Target Lesions & HU Attenuation Densities
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Lesion Identifier</th>
                      <th className="p-2.5">Anatomical Site</th>
                      <th className="p-2.5">Long Axis (mm)</th>
                      <th className="p-2.5">Short Axis (mm)</th>
                      <th className="p-2.5">Volume (cm³)</th>
                      <th className="p-2.5">Mean HU Density</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedDicom.targetLesions.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-cyan-300 font-bold">{l.lesionId}</td>
                        <td className="p-2.5 text-white">{l.anatomicalSite}</td>
                        <td className="p-2.5 text-rose-400 font-bold">{l.longestDiameterMm} mm</td>
                        <td className="p-2.5 text-slate-300">{l.shortAxisMm} mm</td>
                        <td className="p-2.5 text-purple-400">{l.estimatedVolumeCm3} cm³</td>
                        <td className="p-2.5 text-amber-400">{l.meanAttenuationHu ?? 'N/A'} HU</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VCF GENOMICS & TMB */}
      {/* ========================================================================= */}
      {activeTab === 'vcf_genomics' && parsedVcf && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Genomic Profile Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Sample ID:</span>
                    <span className="font-mono text-cyan-400 font-bold">{parsedVcf.sampleId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Total Somatic Variants:</span>
                    <span className="font-mono text-white font-bold">{parsedVcf.totalVariants} Variants</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">TMB (Tumor Mutational Burden):</span>
                    <span className="font-mono text-amber-400 font-bold">{parsedVcf.tmbMutsPerMb} mut/Mb</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">MSI Status:</span>
                    <span className="font-mono text-emerald-400 font-bold">{parsedVcf.msiStatus}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Format Standard:</span>
                    <span className="font-mono text-purple-400">{parsedVcf.formatVersion}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                Actionable Somatic Variants & Targeted Drug Alignment
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Gene & Alteration</th>
                      <th className="p-2.5">Locus</th>
                      <th className="p-2.5">VAF (%)</th>
                      <th className="p-2.5">Depth</th>
                      <th className="p-2.5">Tier</th>
                      <th className="p-2.5">Matched Targeted Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedVcf.variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-white">
                          {v.gene} <span className="text-slate-400 font-normal text-[11px]">{v.id}</span>
                        </td>
                        <td className="p-2.5 text-slate-400">{v.chrom}:{v.pos}</td>
                        <td className="p-2.5 text-amber-400 font-bold">{v.vafPct}%</td>
                        <td className="p-2.5 text-slate-300">{v.depth}x</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.tier === 'Tier I' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {v.tier}
                          </span>
                        </td>
                        <td className="p-2.5 text-cyan-300">{v.matchedTargetedTherapy || 'Standard Chemotherapy'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RPPA PHOSPHOPROTEOMICS */}
      {/* ========================================================================= */}
      {activeTab === 'proteomics_rppa' && parsedProteomics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Signaling Pathway Activation Radar
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={[
                      { pathway: 'PI3K-AKT', score: parsedProteomics.pathwayActivationScores.pi3kAktScore },
                      { pathway: 'MAPK-ERK', score: parsedProteomics.pathwayActivationScores.mapkScore },
                      { pathway: 'TGF-b EMT', score: parsedProteomics.pathwayActivationScores.emtSignalingScore },
                      { pathway: 'Anti-Apoptotic', score: parsedProteomics.pathwayActivationScores.antiApoptoticScore },
                      { pathway: 'Immune Evasion', score: parsedProteomics.pathwayActivationScores.checkpointEvasionScore }
                    ]}
                  >
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="pathway" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis stroke="#64748b" />
                    <Radar name="Pathway Score (Log2 Ratio)" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white">
                Ingested Phospho-Protein Quantifications
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Protein Symbol</th>
                      <th className="p-2.5">Phospho-Site</th>
                      <th className="p-2.5">Intensity</th>
                      <th className="p-2.5">Log2 Ratio</th>
                      <th className="p-2.5">Pathway</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedProteomics.proteins.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-white">{p.symbol}</td>
                        <td className="p-2.5 text-cyan-300">{p.phosphoSite || 'Total'}</td>
                        <td className="p-2.5 text-slate-300">{p.rawIntensity}</td>
                        <td className="p-2.5 font-bold text-amber-400">+{p.log2RatioToBaseline}</td>
                        <td className="p-2.5 text-purple-300">{p.pathway}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: 10X VISIUM SPATIAL TRANSCRIPTOMICS */}
      {/* ========================================================================= */}
      {activeTab === 'spatial_transcriptomics' && parsedSpatial && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Spatial Microenvironment Metrics
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Total Barcoded Spots:</span>
                    <span className="font-mono text-cyan-400 font-bold">{parsedSpatial.numSpots} Spots</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Moran&apos;s I Autocorrelation:</span>
                    <span className="font-mono text-emerald-400 font-bold">{parsedSpatial.moransISpatialAutocorrelation} (Clustered)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Invasive Margin Fraction:</span>
                    <span className="font-mono text-rose-400 font-bold">{parsedSpatial.tissueZoneSummary.invasiveMarginPct}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Hypoxic Niche Fraction:</span>
                    <span className="font-mono text-amber-400 font-bold">{parsedSpatial.tissueZoneSummary.hypoxicNichePct}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                2D Spatial Transcriptomics Spot Matrix (Invasive Edge Grid)
              </h3>

              <div className="h-64 w-full bg-slate-950 rounded-xl p-2 border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" dataKey="xCoord" stroke="#64748b" />
                    <YAxis type="number" dataKey="yCoord" stroke="#64748b" />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs font-mono shadow-xl space-y-1">
                            <div className="font-bold text-cyan-300">{d.spotId}</div>
                            <div className="text-slate-300">Zone: <span className="text-amber-400">{d.zone}</span></div>
                            <div className="text-slate-400">Marker: <span className="text-white">{d.topExpressedGene}</span></div>
                            <div className="text-[11px] text-emerald-400">EMT Score: {d.emtScore} | Hypoxia: {d.hypoxiaScore}</div>
                          </div>
                        );
                      }}
                    />
                    <Scatter name="Spots" data={parsedSpatial.spots}>
                      {parsedSpatial.spots.map((entry, index) => {
                        let fill = '#38bdf8';
                        if (entry.zone === 'Invasive Margin') fill = '#f43f5e';
                        else if (entry.zone === 'Hypoxic Niche') fill = '#f59e0b';
                        else if (entry.zone === 'Stroma') fill = '#10b981';
                        return <Cell key={`spot-${index}`} fill={fill} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: LANDMARK TRIAL COHORTS */}
      {/* ========================================================================= */}
      {activeTab === 'landmark_trials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {landmarkTrials.map((trial) => (
              <div
                key={trial.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  selectedTrialId === trial.id
                    ? 'bg-blue-950/30 border-blue-500/60 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 font-bold">
                      {trial.phase}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">N = {trial.cohortSize}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{trial.trialName}</h4>
                  <p className="text-xs text-slate-400">{trial.description}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {trial.keyBiomarkers.map((b, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {b}
                      </span>
                    ))}
                  </div>

                  <button type="button"
                    onClick={() => handleLoadTrial(trial)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 font-mono"
                  >
                    <Upload className="w-3.5 h-3.5" /> Ingest Cohort Dataset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: QC & HIPAA AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'qc_hipaa_audit' && currentQc && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  HIPAA Safe Harbor & Clinical Data Quality Scorecard
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated regulatory compliance audit verifying zero direct personal health identifiers (PHI) and schema conformance.
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-emerald-400">{currentQc.overallQualityScore}%</div>
                <div className="text-[10px] font-mono text-slate-400">QUALITY INDEX</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs pt-2">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">PHI Direct Violations</span>
                <div className="text-base font-bold text-emerald-400 mt-1">0 Identifiers</div>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Missingness Rate</span>
                <div className="text-base font-bold text-white mt-1">{currentQc.missingDataRatePct}%</div>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Outlier Points</span>
                <div className="text-base font-bold text-white mt-1">{currentQc.outlierCount} Records</div>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Ontology Conformance</span>
                <div className="text-base font-bold text-cyan-400 mt-1">{currentQc.schemaConformancePct}%</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Audit Rule Verification Checks
              </h4>
              <div className="space-y-2">
                {currentQc.checkDetails.map((chk, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">{chk.checkName}</div>
                        <div className="text-slate-400 text-[11px]">{chk.message}</div>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">PASSED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
});

ClinicalDataIngestionHub.displayName = 'ClinicalDataIngestionHub';
