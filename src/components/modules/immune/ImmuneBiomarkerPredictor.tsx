import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Dna,
  Activity,
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart3,
  FlaskConical,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export interface BiomarkerProfile {
  cancerType: string;
  tmb: number; // mut / Mb (1-60)
  msiStatus: 'MSI-H' | 'MSS';
  pdl1Cps: number; // 0 - 100
  gepScore: number; // -1.5 to +1.5
  cytScore: number; // 10 - 400
  tumorPurity: number; // 20 - 95%
  clonalHeterogeneity: number; // 10 - 80% (MATH)
}

export const CANCER_PRESETS: { [key: string]: Partial<BiomarkerProfile> } = {
  'NSCLC (Adenocarcinoma - Smoker)': {
    cancerType: 'NSCLC',
    tmb: 14.5,
    msiStatus: 'MSS',
    pdl1Cps: 65,
    gepScore: 0.42,
    cytScore: 180,
    tumorPurity: 70,
    clonalHeterogeneity: 32
  },
  'Melanoma (Cutaneous UV-Driven)': {
    cancerType: 'Melanoma',
    tmb: 28.0,
    msiStatus: 'MSS',
    pdl1Cps: 40,
    gepScore: 0.85,
    cytScore: 290,
    tumorPurity: 75,
    clonalHeterogeneity: 25
  },
  'Colorectal (Lynch Syndrome / MSI-H)': {
    cancerType: 'Colorectal',
    tmb: 42.0,
    msiStatus: 'MSI-H',
    pdl1Cps: 80,
    gepScore: 1.15,
    cytScore: 350,
    tumorPurity: 65,
    clonalHeterogeneity: 18
  },
  'Pancreatic (PDAC - Stroma Rich)': {
    cancerType: 'Pancreatic Adenocarcinoma',
    tmb: 2.1,
    msiStatus: 'MSS',
    pdl1Cps: 2,
    gepScore: -0.92,
    cytScore: 35,
    tumorPurity: 35,
    clonalHeterogeneity: 58
  }
};

export const ImmuneBiomarkerPredictor: React.FC = () => {
  const [profile, setProfile] = useState<BiomarkerProfile>({
    cancerType: 'NSCLC',
    tmb: 14.5,
    msiStatus: 'MSS',
    pdl1Cps: 65,
    gepScore: 0.42,
    cytScore: 180,
    tumorPurity: 70,
    clonalHeterogeneity: 32
  });

  const handlePreset = (presetName: string) => {
    const p = CANCER_PRESETS[presetName];
    if (p) {
      setProfile((prev) => ({ ...prev, ...p }));
    }
  };

  // Algorithmic ML Immuno-Predictive Scoring
  const predictions = useMemo(() => {
    const { tmb, msiStatus, pdl1Cps, gepScore, cytScore, clonalHeterogeneity } = profile;

    // 1. TMB bonus
    const tmbScore = Math.min(100, (tmb / 20) * 45);

    // 2. MSI bonus
    const msiBonus = msiStatus === 'MSI-H' ? 40 : 0;

    // 3. PD-L1 bonus
    const pdl1Score = Math.min(100, (pdl1Cps / 50) * 35);

    // 4. GEP (Gene Expression Profile) bonus (-1.5 to +1.5)
    const gepNorm = ((gepScore + 1.5) / 3.0) * 35;

    // 5. Cytolytic Score bonus
    const cytNorm = (cytScore / 400) * 20;

    // 6. Heterogeneity penalty
    const hetPenalty = (clonalHeterogeneity / 80) * 25;

    // Aggregate IO Response Score (0 to 100)
    const rawScore = tmbScore * 0.25 + msiBonus + pdl1Score * 0.25 + gepNorm * 0.25 + cytNorm * 0.15 - hetPenalty;
    const ioScore = Math.max(5, Math.min(95, Math.round(rawScore)));

    // RECIST ORR
    const orr = Math.min(85, Math.round(ioScore * 0.78 + (msiStatus === 'MSI-H' ? 25 : 0)));

    // Median PFS (months)
    const mpfs = (Math.max(1.8, (ioScore / 100) * 24.5)).toFixed(1);

    // 2-Year OS (%)
    const os24 = Math.min(92, Math.round(20 + ioScore * 0.7));

    // Matching landmark clinical trial
    let matchedTrial = 'KEYNOTE-042 (Pembro vs Chemo in PD-L1+ NSCLC)';
    if (profile.cancerType.includes('Melanoma')) {
      matchedTrial = 'CheckMate-067 (Nivolumab + Ipilimumab in Advanced Melanoma)';
    } else if (msiStatus === 'MSI-H') {
      matchedTrial = 'KEYNOTE-177 (Pembrolizumab in MSI-H Metastatic CRC)';
    } else if (profile.cancerType.includes('Pancreatic') || ioScore < 25) {
      matchedTrial = 'IMvigor210 / Keynote-158 Low TMB Subcohort (Chemo/IO Combinations)';
    }

    return {
      ioScore,
      orr,
      mpfs,
      os24,
      matchedTrial
    };
  }, [profile]);

  // Projected Kaplan-Meier Survival Curve
  const kmData = useMemo(() => {
    const data = [];
    const { ioScore } = predictions;
    const decayRate = 0.08 - (ioScore / 100) * 0.055;

    for (let month = 0; month <= 36; month += 3) {
      const ioSurvival = Math.max(10, Math.round(100 * Math.exp(-decayRate * month)));
      const chemoControlSurvival = Math.max(5, Math.round(100 * Math.exp(-0.075 * month)));
      data.push({
        month: `M${month}`,
        ioSurvival,
        chemoControlSurvival
      });
    }
    return data;
  }, [predictions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Immune Biomarker & Multi-Omic Response Predictor</h3>
              <p className="text-xs text-slate-400">
                Integrates TMB, MSI, PD-L1 CPS, 18-gene GEP signature, CYT index, and clonal MATH heterogeneity to forecast immunotherapy responsiveness.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              IO PREDICTIVE SCORE: {predictions.ioScore}/100
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400">Load Genomic Archetype:</span>
          {Object.keys(CANCER_PRESETS).map((preset) => (
            <button
              key={preset}
              onClick={() => handlePreset(preset)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column: Multi-Omic Input Tuners & Predictive Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Multi-Omic Parameter Sliders */}
        <div className="xl:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Multi-Omic Patient Profile
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Molecular Diagnostic Panel</span>
          </div>

          <div className="space-y-3.5">
            {/* TMB */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Tumor Mutational Burden (TMB)</span>
                <span className="text-emerald-400 font-bold">{profile.tmb} mut/Mb</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="0.5"
                value={profile.tmb}
                onChange={(e) => setProfile((p) => ({ ...p, tmb: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Low (&lt;6)</span>
                <span>FDA High Threshold (≥10)</span>
                <span>Hypermutated (&gt;30)</span>
              </div>
            </div>

            {/* MSI Status */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Microsatellite Instability (MSI) Status</span>
                <span className="text-purple-400 font-bold">{profile.msiStatus}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setProfile((p) => ({ ...p, msiStatus: 'MSS' }))}
                  className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all ${
                    profile.msiStatus === 'MSS'
                      ? 'bg-slate-800 border border-slate-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  MSS / pMMR (Stable)
                </button>
                <button
                  onClick={() => setProfile((p) => ({ ...p, msiStatus: 'MSI-H' }))}
                  className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all ${
                    profile.msiStatus === 'MSI-H'
                      ? 'bg-purple-950 border border-purple-500 text-purple-200 font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  MSI-H / dMMR (Instability)
                </button>
              </div>
            </div>

            {/* PD-L1 Combined Positive Score (CPS) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">PD-L1 Combined Positive Score (CPS / TPS)</span>
                <span className="text-cyan-400 font-bold">CPS {profile.pdl1Cps}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profile.pdl1Cps}
                onChange={(e) => setProfile((p) => ({ ...p, pdl1Cps: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* GEP Score (18-Gene T-cell Inflamed Signature) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">T-Cell-Inflamed GEP Score (Ayers 18-gene)</span>
                <span className="text-amber-400 font-bold">{profile.gepScore > 0 ? `+${profile.gepScore}` : profile.gepScore}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.05"
                value={profile.gepScore}
                onChange={(e) => setProfile((p) => ({ ...p, gepScore: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Cytolytic Index (CYT = GZMA * PRF1) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Cytolytic Index (CYT: GZMA + PRF1)</span>
                <span className="text-pink-400 font-bold">{profile.cytScore} AU</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                value={profile.cytScore}
                onChange={(e) => setProfile((p) => ({ ...p, cytScore: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

            {/* Clonal Heterogeneity (MATH) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Clonal Heterogeneity (MATH Score)</span>
                <span className="text-rose-400 font-bold">{profile.clonalHeterogeneity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={profile.clonalHeterogeneity}
                onChange={(e) => setProfile((p) => ({ ...p, clonalHeterogeneity: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Predictive Efficacy Endpoints & Kaplan-Meier Curve */}
        <div className="xl:col-span-6 space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">PREDICTED ORR</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{predictions.orr}%</div>
              <span className="text-[9px] text-slate-500 font-mono">RECIST 1.1</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">MEDIAN PFS</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{predictions.mpfs} mo</div>
              <span className="text-[9px] text-slate-500 font-mono">Progression-Free</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">2-YEAR OS</span>
              <div className="text-xl font-bold font-mono text-indigo-400">{predictions.os24}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Overall Survival</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">IO SCORE</span>
              <div className="text-xl font-bold font-mono text-purple-400">{predictions.ioScore}/100</div>
              <span className="text-[9px] text-slate-500 font-mono">Immunogenic Index</span>
            </div>
          </div>

          {/* Kaplan-Meier Projected Survival Plot */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  Projected 36-Month Kaplan-Meier Overall Survival
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Cox Proportional Hazard Model</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kmData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="stepAfter"
                    dataKey="ioSurvival"
                    name="Targeted Immuno-Oncology Regimen"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="chemoControlSurvival"
                    name="Standard Cytotoxic Chemotherapy"
                    stroke="#64748b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Landmark Trial Benchmark */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Matched Landmark Trial Reference:
              </span>
              <span className="text-cyan-300 font-bold">{predictions.matchedTrial}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
