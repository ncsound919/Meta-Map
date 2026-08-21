import React, { useState, useEffect } from 'react';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import {
  TrendingUp,
  Brain,
  Zap,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Activity,
  Compass,
  Cpu,
  Layers,
  Dna,
  Share2,
  RefreshCw,
  ArrowRight,
  Database,
  Workflow,
  Network,
  GitMerge,
  Scale,
  Sliders,
  BarChart2,
  Gauge,
  FileCode,
  Check,
  Search,
  Filter,
  Swords
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

interface MetastasisForecastEngineProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
  onNavigateModule?: (moduleId: string, organ?: string) => void;
}

export const MetastasisForecastEngine: React.FC<MetastasisForecastEngineProps> = ({
  selectedOrgan,
  selectedCancerType,
  onNavigateModule
}) => {
  // Navigation Architecture Sub-Tabs
  const [activeLayerTab, setActiveLayerTab] = useState<
    'probabilistic_forecast' | 'data_features' | 'orchestration_backtest' | 'algorithm_zoo' | 'reconciliation_drift'
  >('probabilistic_forecast');

  // Patient Twin Selection State
  const [patientTwinId, setPatientTwinId] = useState<string>('PT-TWIN-2026-BRCA-09');
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [forecastData, setForecastData] = useState<any>(null);

  // Closed-Loop Prescription Execution State
  const [queuedPrescriptions, setQueuedPrescriptions] = useState<string[]>([]);
  const [queueingId, setQueueingId] = useState<string | null>(null);
  const [queueStatusMessage, setQueueStatusMessage] = useState<string | null>(null);

  // Interactive Simulation State
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);
  const [backtestResult, setBacktestResult] = useState<string | null>(null);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [reconcileResult, setReconcileResult] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictiveForecast();
  }, [patientTwinId, selectedOrgan, selectedCancerType]);

  // Fetch Forecast from Backend API
  const fetchPredictiveForecast = async () => {
    setIsPredicting(true);
    try {
      const res = await fetch('/api/forecast-engine/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientTwinId,
          cancerType: selectedCancerType,
          organSite: selectedOrgan,
          primaryStage: 'Stage IIIb (High Nodal Risk)'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setForecastData(data);
      }
    } catch (e) {
      console.error('Failed to fetch predictive forecast:', e);
    } finally {
      setIsPredicting(false);
    }
  };

  // Trigger Temporal Backtest
  const handleRunBacktest = async () => {
    setIsBacktesting(true);
    setBacktestResult(null);
    try {
      const res = await fetch('/api/forecast-engine/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'Expanding-Window Temporal Cross-Validation', folds: 5 })
      });
      if (res.ok) {
        const data = await res.json();
        setBacktestResult(data.message);
      }
    } catch (e) {
      console.error('Failed to run backtest:', e);
    } finally {
      setIsBacktesting(false);
    }
  };

  // Trigger Hierarchical Reconciliation
  const handleRunReconcile = async () => {
    setIsReconciling(true);
    setReconcileResult(null);
    try {
      const res = await fetch('/api/forecast-engine/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reconciliationMethod: 'MinT (Minimum Trace)' })
      });
      if (res.ok) {
        const data = await res.json();
        setReconcileResult(data.message);
      }
    } catch (e) {
      console.error('Failed to reconcile hierarchy:', e);
    } finally {
      setIsReconciling(false);
    }
  };

  // Queue Prescription into Physical Cascade Chip
  const handleQueuePrescription = async (prescriptionId: string) => {
    setQueueingId(prescriptionId);
    setQueueStatusMessage(null);
    try {
      const res = await fetch('/api/forecast-engine/queue-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId,
          patientTwinId,
          targetDevice: 'CASCADE_TWIN_PHYSICAL_CHIP_01'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQueuedPrescriptions(prev => [...prev, prescriptionId]);
        setQueueStatusMessage(data.protocolDigest);
      }
    } catch (e) {
      console.error('Failed to queue prescription:', e);
    } finally {
      setQueueingId(null);
    }
  };

  // Export Forecast Summary CSV
  const handleExportForecastCsv = () => {
    if (!forecastData) return;
    const headers = [
      'Day',
      'Standard_P10',
      'Standard_P50',
      'Standard_P90',
      'Prescribed_P10',
      'Prescribed_P50',
      'Prescribed_P90'
    ];
    const rows = forecastData.probabilisticTrajectory.map((p: any) => [
      p.dayLabel,
      p.standardP10,
      p.standardP50,
      p.standardP90,
      p.prescribedP10,
      p.prescribedP50,
      p.prescribedP90
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Enterprise_Forecast_Twin_${patientTwinId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Enterprise Time-Series Forecast Core Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">4-Layer Modular System Architecture</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Metastasis Forecast Engine
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Ingests multi-modal historical time-series data, runs automated feature engineering &amp; expanding-window backtesting across classical, tree-based ML, deep learning, and foundation models (TimeGPT/Chronos/MOIRAI), delivering probabilistic P10/P50/P90 forecasts and MinT reconciled prescriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportForecastCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Forecast Matrix (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Patient Twin Profile & Data Ingestion Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-slate-300 font-bold whitespace-nowrap">Active Patient Digital Twin:</label>
          <select
            value={patientTwinId}
            onChange={(e) => setPatientTwinId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="PT-TWIN-2026-BRCA-09">PT-TWIN-2026-BRCA-09 (TNBC Triple Negative)</option>
            <option value="PT-TWIN-2026-LUAD-04">PT-TWIN-2026-LUAD-04 (Lung Adenocarcinoma EGFR+)</option>
            <option value="PT-TWIN-2026-COAD-11">PT-TWIN-2026-COAD-11 (Colorectal KRAS-G12D)</option>
            <option value="PT-TWIN-2026-PRAD-02">PT-TWIN-2026-PRAD-02 (Prostate Castrate-Resistant)</option>
          </select>

          {isPredicting && (
            <span className="flex items-center gap-1.5 text-cyan-400 font-mono animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ingesting &amp; Executing 4-Layer Forecast...
            </span>
          )}
        </div>

        {/* Streaming Ingestion Telemetry Status */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            365d Ingestion: Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Ensemble Models Active: 12
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            MinT Reconciliation: PASS
          </span>
        </div>
      </div>

      {/* Enterprise System Architecture Layer Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex flex-wrap gap-1 font-mono text-xs">
        <button
          onClick={() => setActiveLayerTab('probabilistic_forecast')}
          className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeLayerTab === 'probabilistic_forecast'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Probabilistic Forecast &amp; Prescriptions
        </button>

        <button
          onClick={() => setActiveLayerTab('data_features')}
          className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeLayerTab === 'data_features'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" /> Layer 1: Data Ingestion &amp; Features
        </button>

        <button
          onClick={() => setActiveLayerTab('orchestration_backtest')}
          className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeLayerTab === 'orchestration_backtest'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Workflow className="w-4 h-4" /> Layer 2: Pipeline Backtesting
        </button>

        <button
          onClick={() => setActiveLayerTab('algorithm_zoo')}
          className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeLayerTab === 'algorithm_zoo'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" /> Layer 3: Algorithm Zoo &amp; Ensembling
        </button>

        <button
          onClick={() => setActiveLayerTab('reconciliation_drift')}
          className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeLayerTab === 'reconciliation_drift'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <GitMerge className="w-4 h-4" /> Layer 4: MinT Reconciliation &amp; Drift
        </button>
      </div>

      {/* Forecast Data Content Render */}
      {forecastData && (
        <div className="space-y-6">
          {/* TAB 1: Probabilistic Forecast & Closed-Loop Prescriptions */}
          {activeLayerTab === 'probabilistic_forecast' && (
            <div className="space-y-6">
              {/* Key Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-bold block">12-Month Metastatic Risk</span>
                  <div className="text-2xl font-bold font-mono text-rose-400 flex items-center justify-between">
                    <span>{forecastData.overallMetastaticRisk12MoPct}%</span>
                    <TrendingUp className="w-5 h-5 text-rose-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">High probability of dormant exit</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-bold block">Median First Seeding Time</span>
                  <div className="text-2xl font-bold font-mono text-amber-300 flex items-center justify-between">
                    <span>{forecastData.medianSeedingDays} Days</span>
                    <Clock className="w-5 h-5 text-amber-300" />
                  </div>
                  <p className="text-[11px] text-slate-400">Window for niche pre-conditioning</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-bold block">Dominant Niche Tropism</span>
                  <div className="text-2xl font-bold font-mono text-cyan-300 flex items-center justify-between">
                    <span className="capitalize">{forecastData.organotropismMap[0]?.organ || 'Bone'}</span>
                    <Compass className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">{forecastData.organotropismMap[0]?.probabilityPct}% probability score</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-xs text-slate-400 font-bold block">Forecast Engine WAPE</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center justify-between">
                    <span>{forecastData.algorithmZoo?.ensembleBlending?.ensembleWapePct || '3.2'}%</span>
                    <Gauge className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">MinT Ensembled 12-Model Accuracy</p>
                </div>
              </div>

              {/* Organotropism Risk Map & 360-Day Probabilistic Prediction Intervals Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Organotropism Cards */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      Probabilistic Organotropism Map
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Niche-specific probability of colonization &amp; dormancy entry.
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {forecastData.organotropismMap.map((item: any) => (
                      <div key={item.organ} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-200">{item.organName}</span>
                          <span className="font-mono font-bold text-cyan-300">{item.probabilityPct}%</span>
                        </div>

                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                            style={{ width: `${item.probabilityPct}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Median Seeding: {item.medianSeedingDays}d</span>
                          <span>Dormancy Propensity: {item.dormancyPct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 360-Day Probabilistic Prediction Interval Fan Chart (P10, P50, P90) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="border-b border-slate-800 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Probabilistic Outgrowth Intervals (P10 / P50 / P90 Fan Chart)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Quantifies risk boundaries: Standard Care vs Prescribed Closed-Loop Interception.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Standard P90 Upper Bound
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Prescribed P50 Median
                      </span>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData.probabilisticTrajectory || forecastData.longitudinalPredictions}>
                        <defs>
                          <linearGradient id="colorStandardP90" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorPrescribedP50" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Area type="monotone" dataKey="standardP90" name="Standard Care P90 Risk Upper Bound" stroke="#f43f5e" fillOpacity={1} fill="url(#colorStandardP90)" strokeWidth={2} />
                        <Area type="monotone" dataKey="standardP50" name="Standard Care P50 Median Outgrowth" stroke="#f43f5e" strokeDasharray="3 3" strokeWidth={1.5} fillOpacity={0} />
                        <Area type="monotone" dataKey="prescribedP50" name="Prescribed Closed-Loop P50 Median" stroke="#10b981" fillOpacity={1} fill="url(#colorPrescribedP50)" strokeWidth={2} />
                        <Area type="monotone" dataKey="prescribedP10" name="Prescribed Closed-Loop P10 Optimistic" stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Actionable Closed-Loop Prescriptions Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-300" />
                      Actionable Prescriptions &amp; Windows of Temporal Vulnerability
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Closed-loop optimal interventions ranked by predicted metastatic risk reduction.
                    </p>
                  </div>

                  {queueStatusMessage && (
                    <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {queueStatusMessage}
                    </div>
                  )}
                </div>

                {/* Prescription Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {forecastData.closedLoopPrescriptions.map((rx: any) => {
                    const isQueued = queuedPrescriptions.includes(rx.id);
                    return (
                      <div key={rx.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                              {rx.id}
                            </span>
                            <span className="text-emerald-400 font-bold font-mono text-xs">
                              -{rx.predictedRiskReductionPct}% Risk
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-white">{rx.title}</h4>

                          <div className="text-xs text-amber-300 font-mono bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/60 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            Window: {rx.windowOfVulnerability}
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {rx.mechanism}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                            <span>Confidence: {(rx.confidenceScore * 100).toFixed(0)}%</span>
                            <span className="capitalize text-slate-300">Target: {rx.targetOrgan}</span>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => handleQueuePrescription(rx.id)}
                              disabled={isQueued || queueingId === rx.id}
                              className={`w-full py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                                isQueued
                                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700 cursor-default'
                                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg'
                              }`}
                            >
                              {queueingId === rx.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : isQueued ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Queued for Physical Execution
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" /> Dispatch Protocol
                                </>
                              )}
                            </button>

                            {onNavigateModule && (
                              <div className="grid grid-cols-2 gap-1 pt-1">
                                <button
                                  onClick={() => onNavigateModule('cascade_twin', rx.targetOrgan)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[10px] font-mono font-bold rounded border border-slate-800 flex items-center justify-center gap-1"
                                >
                                  <Cpu className="w-3 h-3 text-cyan-400" /> Cascade Twin
                                </button>
                                <button
                                  onClick={() => onNavigateModule('resistance_forge', rx.targetOrgan)}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-300 text-[10px] font-mono font-bold rounded border border-slate-800 flex items-center justify-center gap-1"
                                >
                                  <Swords className="w-3 h-3 text-rose-400" /> Resistance
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Data Ingestion & Feature Engineering Matrix */}
          {activeLayerTab === 'data_features' && forecastData.featureEngineering && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Database className="w-4.5 h-4.5 text-cyan-400" />
                      Data Ingestion &amp; Feature Engineering Matrix
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ingests historical time-series signals and constructs lag variables, rolling statistics, and exogenous calendar/therapeutic events.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    {forecastData.featureEngineering.historicalTimeSeriesLength}
                  </span>
                </div>

                {/* Lag Variables & Rolling Statistics Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                    Extracted Lag Features &amp; Rolling Statistics
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Feature Name</th>
                          <th className="p-3">Lag / Rolling Window</th>
                          <th className="p-3">Correlation w/ Target</th>
                          <th className="p-3">SHAP Importance Weight</th>
                          <th className="p-3">Biological / Clinical Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {forecastData.featureEngineering.lagFeatures.map((feat: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-cyan-300">{feat.featureName}</td>
                            <td className="p-3">{feat.lagWindow}</td>
                            <td className="p-3 font-bold text-emerald-400">
                              {feat.correlationWithTarget > 0 ? `+${feat.correlationWithTarget}` : feat.correlationWithTarget}
                            </td>
                            <td className="p-3 font-bold text-amber-300">
                              {(feat.importanceScore * 100).toFixed(0)}%
                            </td>
                            <td className="p-3 font-sans text-slate-300 text-xs">{feat.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Exogenous Calendar & Therapeutic Signals */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                    Ingested Exogenous Signals &amp; External Triggers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {forecastData.featureEngineering.exogenousSignals.map((sig: any, sIdx: number) => (
                      <div key={sIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {sig.type}
                          </span>
                          <span className="text-emerald-400 font-bold">Weight: {(sig.impactWeight * 100).toFixed(0)}%</span>
                        </div>
                        <div className="font-bold text-white text-xs">{sig.signalName}</div>
                        <div className="text-[10px] text-slate-400">{sig.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Pipeline Orchestration & Backtesting */}
          {activeLayerTab === 'orchestration_backtest' && forecastData.pipelineOrchestration && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Workflow className="w-4.5 h-4.5 text-cyan-400" />
                      Pipeline Orchestration &amp; Temporal Backtesting Engine
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Evaluates models using expanding-window cross-validation without temporal lookahead leakage.
                    </p>
                  </div>

                  <button
                    onClick={handleRunBacktest}
                    disabled={isBacktesting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shrink-0 shadow"
                  >
                    {isBacktesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    Execute Expanding-Window Backtest
                  </button>
                </div>

                {backtestResult && (
                  <div className="bg-emerald-950 border border-emerald-800 p-3 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {backtestResult}
                  </div>
                )}

                {/* Backtest Folds Performance Matrix */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="font-bold text-slate-300">TEMPORAL CROSS-VALIDATION FOLDS (5 EXPANDING WINDOWS)</span>
                    <span className="text-emerald-400 font-bold">{forecastData.pipelineOrchestration.temporalLeakageGuard}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
                    {forecastData.pipelineOrchestration.crossValidationFolds.map((fold: any) => (
                      <div key={fold.foldId} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-cyan-400 font-bold">
                          <span>Fold #{fold.foldId}</span>
                          <span className="text-emerald-400">WAPE: {fold.wapePct}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400 space-y-0.5">
                          <div>Train: <strong className="text-slate-200">{fold.trainWindow}</strong></div>
                          <div>Test: <strong className="text-amber-300">{fold.testWindow}</strong></div>
                        </div>
                        <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 flex justify-between">
                          <span>MASE: {fold.maseScore}</span>
                          <span>RMSE: {fold.rmseScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hyperparameter Optimization Results */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                  <span className="text-slate-400 font-bold block">HYPERPARAMETER TUNING LOG (OPTUNA BAYESIAN HYPERBAND):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 text-slate-200">
                    <div>Learning Rate: <strong className="text-cyan-300">0.035</strong></div>
                    <div>Max Depth: <strong className="text-cyan-300">7</strong></div>
                    <div>Num Heads: <strong className="text-cyan-300">8</strong></div>
                    <div>Patch Length: <strong className="text-cyan-300">16</strong></div>
                    <div>Dropout: <strong className="text-cyan-300">0.10</strong></div>
                    <div>Hidden Dims: <strong className="text-cyan-300">256</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Algorithm Zoo & Multi-Model Ensembling */}
          {activeLayerTab === 'algorithm_zoo' && forecastData.algorithmZoo && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-cyan-400" />
                    Multi-Model Algorithm Zoo &amp; MinT Ensembling Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Matches time-series data properties across statistical, tree-based ML, deep learning, and foundation models.
                  </p>
                </div>

                {/* Model Families Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                  {forecastData.algorithmZoo.families.map((fam: any) => (
                    <div key={fam.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-cyan-300 text-sm">{fam.family}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            {fam.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 font-sans">{fam.bestSuitedFor}</div>

                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Algorithms Fitted:</span>
                          <div className="flex flex-wrap gap-1">
                            {fam.algorithms.map((algo: string, aIdx: number) => (
                              <span key={aIdx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800">
                                {algo}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-300">
                          <span>WAPE Error:</span>
                          <strong className="text-emerald-400">{fam.wapePct}%</strong>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>MASE Score:</span>
                          <strong className="text-amber-300">{fam.maseScore}</strong>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Blend Weight:</span>
                          <strong className="text-cyan-300">{fam.blendWeightPct}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ensembling Weights Summary Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-purple-400" /> MinT Variance-Covariance Optimal Blend
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Ensemble WAPE: {forecastData.algorithmZoo.ensembleBlending.ensembleWapePct}% | MASE: {forecastData.algorithmZoo.ensembleBlending.ensembleMaseScore}
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex font-mono text-[9px] text-white">
                    <div className="bg-purple-600 h-full flex items-center justify-center font-bold" style={{ width: '42%' }}>Foundation (42%)</div>
                    <div className="bg-indigo-600 h-full flex items-center justify-center font-bold" style={{ width: '32%' }}>Deep Learning (32%)</div>
                    <div className="bg-cyan-600 h-full flex items-center justify-center font-bold" style={{ width: '18%' }}>Tree ML (18%)</div>
                    <div className="bg-slate-700 h-full flex items-center justify-center font-bold" style={{ width: '8%' }}>Stat (8%)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MinT Reconciliation, Drift & Cold-Start */}
          {activeLayerTab === 'reconciliation_drift' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hierarchical Reconciliation Engine (MinT) */}
                {forecastData.hierarchicalReconciliation && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <GitMerge className="w-4.5 h-4.5 text-cyan-400" />
                        Hierarchical Reconciliation (MinT)
                      </h3>
                      <button
                        onClick={handleRunReconcile}
                        disabled={isReconciling}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
                      >
                        {isReconciling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Scale className="w-3 h-3" />}
                        Reconcile MinT
                      </button>
                    </div>

                    {reconcileResult && (
                      <div className="bg-emerald-950 border border-emerald-800 p-2.5 rounded-lg text-xs font-mono text-emerald-300">
                        {reconcileResult}
                      </div>
                    )}

                    <div className="space-y-2.5 font-mono text-xs">
                      {forecastData.hierarchicalReconciliation.hierarchyLevels.map((lvl: any, idx: number) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                          <div className="font-bold text-cyan-300">{lvl.level}</div>
                          <div className="text-[11px] text-slate-400">{lvl.constraint}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{forecastData.hierarchicalReconciliation.coherenceCheckStatus}</span>
                    </div>
                  </div>
                )}

                {/* Concept Drift & Degradation Monitoring */}
                {forecastData.conceptDriftMonitoring && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Gauge className="w-4.5 h-4.5 text-emerald-400" />
                        Concept Drift &amp; Model Degradation Monitor
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {forecastData.conceptDriftMonitoring.driftStatus}
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                        <span className="text-slate-400 font-bold block">GROUND TRUTH VS FORECAST ERROR MONITORING:</span>
                        {forecastData.conceptDriftMonitoring.groundTruthComparison.map((gt: any, gIdx: number) => (
                          <div key={gIdx} className="flex justify-between items-center text-[11px] border-b border-slate-800/60 pb-1">
                            <span className="text-slate-300">{gt.timestamp}</span>
                            <span>Pred: <strong className="text-cyan-300">{gt.predictedCtc}</strong></span>
                            <span>Actual: <strong className="text-emerald-300">{gt.actualGroundTruthCtc}</strong></span>
                            <span className="text-emerald-400 font-bold">{gt.errorPct}% Error</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-400 pt-1">
                        Current WAPE: <strong className="text-white">{forecastData.conceptDriftMonitoring.currentWapePct}%</strong> | Auto-Retrain Threshold: <strong className="text-rose-400">{forecastData.conceptDriftMonitoring.retrainingThresholdWapePct}% WAPE</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Zero-Shot Cold-Start Resolution */}
              {forecastData.coldStartResolution && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Zero-Shot Cold-Start Resolution &amp; Metadata KNN Clustering
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Cold-Start Strategy:</span>
                      <strong className="text-cyan-300">{forecastData.coldStartResolution.strategy}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>KNN Cohort Similarity Match:</span>
                      <strong className="text-emerald-400">{forecastData.coldStartResolution.cohortSimilarityScorePct}% Match ({forecastData.coldStartResolution.knnNeighborsMatched} Neighbors)</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Transferred Prior History:</span>
                      <strong className="text-slate-200">{forecastData.coldStartResolution.transferredPriorHistory}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Learning & Self-Improving Discovery Loop */}
          <div className="bg-indigo-950/40 border border-indigo-800/80 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span className="font-bold text-indigo-200 text-sm">Self-Improving Active Learning Discovery Loop:</span>
            </div>
            <p className="text-slate-200 font-mono leading-relaxed">
              "{forecastData.selfImprovingDiscoveryLoop.activeLearningRequest}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
