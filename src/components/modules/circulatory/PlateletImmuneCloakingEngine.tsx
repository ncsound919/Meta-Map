import React, { useState, useMemo } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Droplets,
  Heart,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FlaskConical,
  TrendingUp,
  BarChart3,
  Dna,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const PlateletImmuneCloakingEngine: React.FC = () => {
  // Biomechanical & Hematologic Parameters
  const [plateletCountKUl, setPlateletCountKUl] = useState<number>(320); // 50 to 600 k/uL
  const [tissueFactorExpression, setTissueFactorExpression] = useState<number>(75); // % (0-100)
  const [shearRateS1, setShearRateS1] = useState<number>(850); // 100 to 2500 s^-1
  const [nkCytotoxicPressure, setNkCytotoxicPressure] = useState<number>(65); // % NK cytolytic activity
  const [fibrinogenLevelMgDl, setFibrinogenLevelMgDl] = useState<number>(300); // 100 to 600 mg/dL

  // Pharmacological Antiplatelet / Anticoagulant Regimen
  const [therapeuticRegimen, setTherapeuticRegimen] = useState<
    'none' | 'aspirin_cox1' | 'clopidogrel_p2y12' | 'lmwh_enoxaparin' | 'eptifibatide_gpiibiiia' | 'tgfb_inhibitor'
  >('none');

  // Computational Model of Platelet Corona & Evasion Dynamics
  const calculations = useMemo(() => {
    let effectivePlatelets = plateletCountKUl;
    let effectiveTF = tissueFactorExpression;
    let effectiveGPIIbIIIa = 1.0;
    let effectiveFibrin = fibrinogenLevelMgDl / 300;
    let effectiveTGFbSuppression = 1.0;

    // Apply therapeutic inhibitor mechanisms
    if (therapeuticRegimen === 'aspirin_cox1') {
      effectivePlatelets *= 0.65; // Inhibits TxA2 synthesis
    } else if (therapeuticRegimen === 'clopidogrel_p2y12') {
      effectivePlatelets *= 0.45; // Blocks ADP-mediated amplification
    } else if (therapeuticRegimen === 'lmwh_enoxaparin') {
      effectiveTF *= 0.2; // Inhibits Factor Xa & thrombin generation
      effectiveFibrin *= 0.3;
    } else if (therapeuticRegimen === 'eptifibatide_gpiibiiia') {
      effectiveGPIIbIIIa = 0.1; // Blocks fibrinogen cross-linking to alpha_IIb_beta_3
    } else if (therapeuticRegimen === 'tgfb_inhibitor') {
      effectiveTGFbSuppression = 0.2; // Restores NK cell NKG2D expression
    }

    // 1. Platelet Shield Coverage Density (% CTC surface cloaked)
    // Governed by TF thrombin cleavage, shear-induced vWF-GP1b-IX binding, and GPIIb/IIIa crosslinking
    const tfThrombinDrive = (effectiveTF / 100) * effectiveFibrin;
    const plateletAvailability = Math.min(1.5, effectivePlatelets / 250);
    const shearAssistedBinding = shearRateS1 > 1800 ? 0.75 : shearRateS1 > 500 ? 1.15 : 0.85;

    const cloakCoveragePct = Math.min(
      99,
      Math.max(
        5,
        Math.round(75 * tfThrombinDrive * plateletAvailability * effectiveGPIIbIIIa * shearAssistedBinding)
      )
    );

    // 2. Physical Shear Shielding (% reduction in hemodynamic membrane strain)
    const shearShieldingFactor = Math.min(95, Math.round(cloakCoveragePct * 0.92));

    // 3. NK-Cell Cytolytic Killing Evasion (% evasion of Perforin/Granzyme & FasL)
    // Platelets provide steric hindrance, transfer MHC-I (pseudo-self), and secrete TGF-beta
    const tgfbSuppressionStrength = (cloakCoveragePct / 100) * effectiveTGFbSuppression * 85;
    const mhcTransferShield = cloakCoveragePct * 0.75;
    const rawEvasion = (mhcTransferShield * 0.5 + tgfbSuppressionStrength * 0.5);
    const nkEvasionPct = Math.min(98, Math.max(3, Math.round(rawEvasion * (100 / Math.max(20, nkCytotoxicPressure)))));

    // 4. Circulatory Half-Life (minutes in intravascular circulation)
    // Baseline naked CTC half-life is ~12-18 min. Fully cloaked CTCs can survive 90-180+ min.
    const ctcHalfLifeMin = Math.round(15 + (cloakCoveragePct / 100) * 145 * (nkEvasionPct / 100));

    // 5. Endothelial Tethering / Extravasation Competence (P-selectin on platelets binds PSGL-1/CD44)
    const extravasationTetheringScore = Math.min(95, Math.round((cloakCoveragePct * 0.85) + 10));

    // 6. Overall Metastatic Viability Index (0-100)
    const overallViabilityIndex = Math.round(
      (shearShieldingFactor * 0.3) + (nkEvasionPct * 0.45) + (extravasationTetheringScore * 0.25)
    );

    return {
      cloakCoveragePct,
      shearShieldingFactor,
      nkEvasionPct,
      ctcHalfLifeMin,
      extravasationTetheringScore,
      overallViabilityIndex
    };
  }, [
    plateletCountKUl,
    tissueFactorExpression,
    shearRateS1,
    nkCytotoxicPressure,
    fibrinogenLevelMgDl,
    therapeuticRegimen
  ]);

  // 120-Minute Survival Time-Series ODE Curve (Naked CTC vs. Platelet-Cloaked CTC)
  const survivalTimeCourseData = useMemo(() => {
    const data = [];
    // Naked CTC decay constant (fast clearance by shear & NK cells)
    const kNaked = 0.085 * (nkCytotoxicPressure / 50);
    // Cloaked CTC decay constant (protected by platelet shell)
    const kCloaked = Math.max(0.005, kNaked * (1 - calculations.overallViabilityIndex / 105));

    for (let t = 0; t <= 120; t += 10) {
      const nakedSurvival = Math.round(100 * Math.exp(-kNaked * t));
      const cloakedSurvival = Math.round(100 * Math.exp(-kCloaked * t));
      const nkEliminated = Math.max(0, 100 - cloakedSurvival);

      data.push({
        timeMin: `${t}m`,
        cloakedSurvival,
        nakedSurvival,
        nkEliminated
      });
    }
    return data;
  }, [calculations, nkCytotoxicPressure]);

  // Radar Multi-Axis Protection Profile
  const radarData = useMemo(() => {
    return [
      { subject: 'Platelet Corona', score: calculations.cloakCoveragePct, fullMark: 100 },
      { subject: 'Shear Shielding', score: calculations.shearShieldingFactor, fullMark: 100 },
      { subject: 'NK Lysis Evasion', score: calculations.nkEvasionPct, fullMark: 100 },
      { subject: 'P-Selectin Tether', score: calculations.extravasationTetheringScore, fullMark: 100 },
      { subject: 'MHC-I Pseudo-Self', score: Math.round(calculations.cloakCoveragePct * 0.88), fullMark: 100 },
      { subject: 'Metastatic Competence', score: calculations.overallViabilityIndex, fullMark: 100 }
    ];
  }, [calculations]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Intravascular Platelet Cloaking & NK Cytolytic Evasion Engine
              </h3>
              <p className="text-xs text-slate-400">
                Models the protective microthrombus corona: Tissue Factor (TF) thrombin cleavage, vWF/GPIIbIIIa cross-linking, TGF-β immunosuppression, and MHC-I mimicry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold border ${
                calculations.overallViabilityIndex > 70
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : calculations.overallViabilityIndex > 40
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}
            >
              CTC VIABILITY: {calculations.overallViabilityIndex}/100
            </span>
          </div>
        </div>

        {/* 4 Multi-Layer Defense Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>1. Microthrombus Shield</span>
              <span className="text-[10px] text-slate-400">{calculations.cloakCoveragePct}% Cloaked</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Platelets form a dense protective shell via αIIbβ3 integrins and fibrin scaffolds, preventing shear destruction.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>2. MHC-I Pseudo-Self</span>
              <span className="text-[10px] text-slate-400">Immune Masking</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Activated platelets deposit normal MHC Class I molecules onto CTCs, disguising tumor neoantigens from immune recognition.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>3. TGF-β Immunoparalysis</span>
              <span className="text-[10px] text-slate-400">NKG2D Suppressed</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Platelet degranulation releases high concentrations of TGF-β1, downregulating NKG2D activating receptors on NK cells.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-purple-400 font-bold">
              <span>4. Endothelial Arrest</span>
              <span className="text-[10px] text-slate-400">P-Selectin Bridge</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Platelet P-selectin facilitates rapid deceleration, rolling, and stable arrest on vascular endothelial niches.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Biomechanical & Pharmacological Controls */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Microenvironmental & Hematologic Controls
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Thrombo-Immunology</span>
          </div>

          <div className="space-y-4">
            {/* Platelet Count */}
            <Slider
  label="Circulating Platelet Count:"
  min={50}
  max={600}
  step={10}
  value={plateletCountKUl}
  onChange={setPlateletCountKUl}
  valueDisplay={<>{plateletCountKUl} k/µL</>}
/>

            {/* Shear Stress */}
            <Slider
  label="Local Vascular Shear Rate (γ̇):"
  min={100}
  max={2500}
  step={50}
  value={shearRateS1}
  onChange={setShearRateS1}
  valueDisplay={<>{shearRateS1} s⁻¹</>}
/>
          </div>

          {/* Pharmacological Anti-Metastatic Interventions */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Antiplatelet & Anticoagulant Interventions:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'None (Untreated Control)' },
                { id: 'aspirin_cox1', label: 'Aspirin (COX-1 / TxA2-i)' },
                { id: 'clopidogrel_p2y12', label: 'Clopidogrel (P2Y12-i)' },
                { id: 'lmwh_enoxaparin', label: 'LMWH Enoxaparin (FXa-i)' },
                { id: 'eptifibatide_gpiibiiia', label: 'Eptifibatide (αIIbβ3-i)' },
                { id: 'tgfb_inhibitor', label: 'Galunisertib (TGF-β-i)' }
              ].map((drug) => (
                <button
                  key={drug.id}
                  onClick={() => setTherapeuticRegimen(drug.id as any)}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all text-left ${
                    therapeuticRegimen === drug.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {drug.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Time-Series Survival ODE & Multi-Vector Radar Profile */}
        <div className="xl:col-span-7 space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">PLATELET CORONA</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{calculations.cloakCoveragePct}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Surface Shield</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">NK LYSIS EVASION</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{calculations.nkEvasionPct}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Immunoprotection</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">CIRCULATORY t1/2</span>
              <div className="text-xl font-bold font-mono text-purple-400">{calculations.ctcHalfLifeMin} min</div>
              <span className="text-[9px] text-slate-500 font-mono">Intravascular Survival</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">METASTASIS RISK</span>
              <div className="text-xl font-bold font-mono text-rose-400">{calculations.overallViabilityIndex}/100</div>
              <span className="text-[9px] text-slate-500 font-mono">Overall Potency</span>
            </div>
          </div>

          {/* 120-Minute Survival Area Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  120-Minute Intravascular CTC Survival: Naked vs. Platelet-Cloaked
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Euler ODE Clearance Model</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={survivalTimeCourseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeMin" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="cloakedSurvival"
                    name="Platelet-Cloaked CTC Survival (%)"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="nakedSurvival"
                    name="Naked CTC Baseline Survival (%)"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biomechanical Interpretation */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Clinical Translation: The Metastasis-Coagulation Axis</span>
              <p className="leading-relaxed">
                Trousseau's syndrome and cancer-associated hypercoagulability are not merely passive paraneoplastic complications, but active drivers of metastatic dissemination.
                By coating themselves in activated platelets and fibrin, CTCs escape Natural Killer cell immunosurveillance and physical shear lysis.
                Targeting this cloaking mechanism via anticoagulation (LMWH) or antiplatelet agents (P2Y12 antagonists) dramatically truncates intravascular survival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
