import React, { useState, useEffect } from 'react';
import { Slider } from '../ui/Slider';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Dna,
  Layers,
  Sliders,
  Download,
  Activity,
  Zap,
  Clock,
  Compass,
  ShieldCheck,
  RefreshCw,
  Eye,
  Filter,
  Maximize2,
  CheckCircle2,
  Tv,
  Microscope,
  Radio
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface LivingMetastasisCinemaProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const LivingMetastasisCinema: React.FC<LivingMetastasisCinemaProps> = ({
  selectedOrgan,
  selectedCancerType
}) => {
  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<'archive' | 'cinema' | 'crispr'>('cinema');

  // Living Archive State
  const [archiveSamples, setArchiveSamples] = useState<any[]>([]);
  const [selectedBarcode, setSelectedBarcode] = useState<string>('PATIENT-BRCA-0882-BONE-CTC');
  const [selectedSampleDetails, setSelectedSampleDetails] = useState<any>(null);
  const [isLoadingArchive, setIsLoadingArchive] = useState<boolean>(false);

  // Cinema Re-Animation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [timeFrameHours, setTimeFrameHours] = useState<number>(72);
  const [layerOverlay, setLayerOverlay] = useState<'live_fluorescence' | 'spatial_omics' | 'matrix_stiffness' | 'secretome_flux'>('live_fluorescence');
  const [cinemaFrames, setCinemaFrames] = useState<any[]>([]);
  const [aiDirectorInsights, setAiDirectorInsights] = useState<any>(null);

  // CRISPR Re-Engineering State
  const [crisprGene, setCrisprGene] = useState<'NR2F1' | 'MMP9' | 'CD274'>('NR2F1');
  const [crisprMethod, setCrisprMethod] = useState<string>('CRISPR_KO');
  const [crisprResult, setCrisprResult] = useState<any>(null);
  const [isEditingGenes, setIsEditingGenes] = useState<boolean>(false);

  // Load Archive and initial Re-animation
  useEffect(() => {
    fetchLivingArchive();
  }, [selectedOrgan, selectedCancerType]);

  useEffect(() => {
    fetchCinemaFrames();
  }, [selectedBarcode, timeFrameHours, layerOverlay]);

  // Automated playback timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentHour((prev) => {
          if (prev >= timeFrameHours) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 6;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeFrameHours, playbackSpeed]);

  // Fetch Archive Samples via Backend
  const fetchLivingArchive = async () => {
    setIsLoadingArchive(true);
    try {
      const res = await fetch('/api/living-cinema/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organSite: selectedOrgan,
          cancerType: selectedCancerType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setArchiveSamples(data.samples || []);
        if (data.samples && data.samples.length > 0) {
          const matched = data.samples.find((s: any) => s.barcodeId === selectedBarcode) || data.samples[0];
          setSelectedBarcode(matched.barcodeId);
          setSelectedSampleDetails(matched);
        }
      }
    } catch (e) {
      console.error('Failed to fetch living archive:', e);
    } finally {
      setIsLoadingArchive(false);
    }
  };

  // Fetch Re-Animation Frames via Backend
  const fetchCinemaFrames = async () => {
    try {
      const res = await fetch('/api/living-cinema/reanimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcodeId: selectedBarcode,
          timeFrameHours,
          layerOverlay
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCinemaFrames(data.frames || []);
        setAiDirectorInsights(data.aiDirectorInsights);
      }
    } catch (e) {
      console.error('Failed to reanimate living cinema:', e);
    }
  };

  // Execute CRISPR Gene Editing via Backend
  const handleExecuteCrisprEdit = async () => {
    setIsEditingGenes(true);
    try {
      const res = await fetch('/api/living-cinema/crispr-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcodeId: selectedBarcode,
          targetGene: crisprGene,
          editType: crisprMethod
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCrisprResult(data);
      }
    } catch (e) {
      console.error('Failed to execute CRISPR edit:', e);
    } finally {
      setIsEditingGenes(false);
    }
  };

  // Current active frame metrics
  const activeFrame = cinemaFrames.find(f => f.hour === currentHour) || cinemaFrames[0] || {
    hour: 0,
    frameTimestamp: 'T+00h:00m',
    cellVelocityUmHr: 18.5,
    matrixStiffnessKpa: 4.2,
    markerLevels: { NR2F1: 2.1, MMP9: 4.8, CD274: 1.5 },
    metaboliteLactateMm: 0.8,
    spatialX: 120,
    spatialY: 85,
    phenotypeLabel: 'Extravasation & Migration'
  };

  // Export Lineage Barcode Metadata
  const handleExportLineageBarcodeCsv = () => {
    if (!archiveSamples.length) return;
    const headers = ['Barcode_ID', 'Patient_ID', 'Cancer_Type', 'Organ_Niche', 'Sample_Type', 'Matrix_Hydrogel', 'Viability_Pct', 'Genomic_Drivers'];
    const rows = archiveSamples.map(s => [
      s.barcodeId,
      s.patientId,
      `"${s.cancerType}"`,
      s.organSite,
      `"${s.sampleType}"`,
      `"${s.matrixType}"`,
      s.viabilityPct,
      `"${s.genomicFeatures.join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Living_Metastasis_Archive_Lineages_${selectedBarcode}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Patient-Derived Living Metastasis Archive
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-Time Single-Cell Cinema & CRISPR Rewriting</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Living Metastasis Atlas (Metastatic Cell Cinema)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              An expanding biobank and time-lapse cinema of patient-derived metastatic cells. Query patient lineages, re-animate 4D multi-modal cell trajectories, and perform live CRISPR pathway re-engineering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportLineageBarcodeCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Lineage Barcodes (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('cinema')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'cinema' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" /> 4D Re-Animation Cinema
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'archive' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Microscope className="w-4 h-4" /> Patient Living Archive ({archiveSamples.length} samples)
        </button>
        <button
          onClick={() => setActiveTab('crispr')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'crispr' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dna className="w-4 h-4" /> Live CRISPR Re-Engineering
        </button>
      </div>

      {/* TAB 1: 4D RE-ANIMATION CINEMA */}
      {activeTab === 'cinema' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Cinema Video Canvas Stage */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  {selectedBarcode}
                </span>
                <span className="text-slate-400">
                  Phenotype: <span className="text-white font-semibold">{activeFrame.phenotypeLabel}</span>
                </span>
              </div>

              {/* Multi-Modal Layer Overlay Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['live_fluorescence', 'spatial_omics', 'matrix_stiffness', 'secretome_flux'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setLayerOverlay(mode)}
                    className={`px-2 py-1 rounded text-[11px] capitalize font-semibold transition-colors ${
                      layerOverlay === mode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewport Stage */}
            <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Animated Cell Microenvironment Simulation Stage */}
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <radialGradient id="nicheGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid Background */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <rect width="400" height="300" fill="url(#grid)" />

                {/* Layer 1: Matrix Stiffness Heatmap Contour */}
                {layerOverlay === 'matrix_stiffness' && (
                  <g opacity="0.4">
                    <circle cx="200" cy="150" r="110" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="200" cy="150" r="75" fill="none" stroke="#ef4444" strokeWidth="3" />
                    <text x="210" y="80" fill="#f59e0b" fontSize="10" fontFamily="monospace">AFM Stiffness: {activeFrame.matrixStiffnessKpa} kPa</text>
                  </g>
                )}

                {/* Layer 2: Spatial Transcriptomics Grid Coordinates */}
                {layerOverlay === 'spatial_omics' && (
                  <g opacity="0.6">
                    <rect x="100" y="60" width="200" height="180" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="105" y="75" fill="#a855f7" fontSize="10" fontFamily="monospace">Visium Spot (X:{activeFrame.spatialX}, Y:{activeFrame.spatialY})</text>
                  </g>
                )}

                {/* Layer 3: Secretome Flux Gradient */}
                {layerOverlay === 'secretome_flux' && (
                  <g>
                    <circle cx={activeFrame.spatialX} cy={activeFrame.spatialY} r="60" fill="url(#nicheGlow)" />
                    <text x="15" y="280" fill="#10b981" fontSize="10" fontFamily="monospace">Lactate Flux: {activeFrame.metaboliteLactateMm} mM</text>
                  </g>
                )}

                {/* Living Cell Tracking Node */}
                <g filter="url(#glow)">
                  {/* Trajectory Tail */}
                  <line x1="120" y1="85" x2={activeFrame.spatialX} y2={activeFrame.spatialY} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Primary Metastatic Cancer Cell Body */}
                  <circle
                    cx={activeFrame.spatialX}
                    cy={activeFrame.spatialY}
                    r="16"
                    fill="#06b6d4"
                    fillOpacity="0.8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  {/* Nucleus Marker (GFP-NR2F1) */}
                  <circle
                    cx={activeFrame.spatialX}
                    cy={activeFrame.spatialY}
                    r="6"
                    fill="#a855f7"
                  />
                </g>

                {/* Niche Stromal Partner Cell (Osteoblast / Fibroblast) */}
                <circle cx="240" cy="190" r="12" fill="#f59e0b" fillOpacity="0.6" stroke="#fbbf24" strokeWidth="1.5" />
                <line x1={activeFrame.spatialX} y1={activeFrame.spatialY} x2="240" y2="190" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
              </svg>

              {/* Viewport Overlay Controls & Frame Timestamp */}
              <div className="absolute top-3 left-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeFrame.frameTimestamp}</span>
              </div>

              <div className="absolute top-3 right-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-purple-300 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>Velocity: {activeFrame.cellVelocityUmHr} µm/hr</span>
              </div>
            </div>

            {/* Cinematic Scrubber Bar & Playback Controls */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => setCurrentHour(0)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Hour Timeline Slider */}
                <div className="flex-1 pt-1">
                  <Slider
                    label="Timeline"
                    min={0}
                    max={timeFrameHours}
                    step={6}
                    value={currentHour}
                    onChange={(val) => setCurrentHour(val)}
                    valueDisplay={`${currentHour}h / ${timeFrameHours}h`}
                  />
                </div>

                {/* Speed Multiplier */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono font-bold rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1.0x</option>
                  <option value={2}>2.0x</option>
                  <option value={4}>4.0x</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Director & Live Multi-Modal Metrics Inspector */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                AI Cinema Director & Telemetry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-modal single-cell data streaming in real time.
              </p>
            </div>

            {/* Active Marker Expression Gauges */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-300 block">Single-Cell Marker Expression Profile:</span>
              <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                {Object.entries(activeFrame.markerLevels || {}).map(([gene, level]) => (
                  <div key={gene} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-bold">{gene}</span>
                      <span className="text-cyan-400">{Number(level).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.min((Number(level) / 6) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Director Guidance Card */}
            {aiDirectorInsights && (
              <div className="bg-indigo-950/40 border border-indigo-800/80 rounded-xl p-3.5 text-xs space-y-2">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  Conserved Metastatic Program:
                </span>
                <p className="text-white font-semibold text-xs">
                  {aiDirectorInsights.dominantProgram}
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Suggested Next Capture: {aiDirectorInsights.suggestedNextCapture}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PATIENT LIVING ARCHIVE BROWSER */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">
              Showing {archiveSamples.length} patient-derived metastatic cell lines banked in standardized 3D hydrogel matrices.
            </span>
            <button
              onClick={fetchLivingArchive}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Archive Index
            </button>
          </div>

          {/* Sample Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archiveSamples.map((sample) => (
              <div
                key={sample.barcodeId}
                className={`p-4 rounded-xl border transition-all ${
                  selectedBarcode === sample.barcodeId
                    ? 'bg-cyan-950/50 border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">{sample.barcodeId}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[10px] border border-slate-700">
                    Viability: {sample.viabilityPct}%
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{sample.sampleType}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Cancer: <span className="font-semibold text-slate-100">{sample.cancerType}</span> | Niche: <span className="font-semibold text-cyan-300 capitalize">{sample.organSite}</span>
                </p>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>Matrix: <span className="text-slate-200">{sample.matrixType}</span></div>
                  <div>Treatment: <span className="text-amber-300">{sample.treatmentHistory}</span></div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sample.genomicFeatures.map((gf: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800">
                        {gf}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedBarcode(sample.barcodeId);
                      setSelectedSampleDetails(sample);
                      setActiveTab('cinema');
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Tv className="w-3.5 h-3.5" /> Re-Animate in Cinema
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE CRISPR RE-ENGINEERING PLAYGROUND */}
      {activeTab === 'crispr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Dna className="w-4 h-4 text-cyan-400" />
                Live CRISPR / Base Editing Suite
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target sample: <span className="text-cyan-300 font-mono font-bold">{selectedBarcode}</span>
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Gene:</label>
                <select
                  value={crisprGene}
                  onChange={(e) => setCrisprGene(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs rounded p-2 focus:outline-none font-bold"
                >
                  <option value="NR2F1">NR2F1 (Master Dormancy Regulator)</option>
                  <option value="MMP9">MMP9 (Extravasation Matrix Cleavage)</option>
                  <option value="CD274">CD274 (PD-L1 Immune Evasion)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Editing Vector Method:</label>
                <select
                  value={crisprMethod}
                  onChange={(e) => setCrisprMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded p-2 focus:outline-none"
                >
                  <option value="CRISPR_KO">Cas9 RNP Knockout (Frameshift Indel)</option>
                  <option value="BASE_EDITING">C-to-T Base Editor (Splice-Site Mutation)</option>
                  <option value="PRIME_EDITING">Prime Editing (Precise Regulatory Insertion)</option>
                </select>
              </div>

              <button
                onClick={handleExecuteCrisprEdit}
                disabled={isEditingGenes}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isEditingGenes ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Dna className="w-4 h-4 text-amber-300" />}
                Execute Gene Edit on Active Cell Line
              </button>
            </div>
          </div>

          {/* CRISPR Outcome Comparison Chart */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Wild-Type vs. Engineered Trajectory Comparison
              </h3>
            </div>

            {crisprResult?.timecourseComparison ? (
              <div className="space-y-4">
                <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-3.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Editing Efficiency: {crisprResult.editingEfficiencyPct}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Off-target: {crisprResult.offTargetIndelsPct}%</span>
                  </div>
                  <p className="text-white font-semibold">{crisprResult.phenotypicConsequence}</p>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crisprResult.timecourseComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line type="monotone" dataKey="wildTypeVelocity" name="Wild-Type Velocity (µm/h)" stroke="#94a3b8" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="editedVelocity" name="CRISPR Edited Velocity (µm/h)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="editedOutgrowth" name="CRISPR Colony Outgrowth" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-12 text-xs">
                Select a target gene and click "Execute Gene Edit" to simulate CRISPR phenotypic trajectory changes.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
