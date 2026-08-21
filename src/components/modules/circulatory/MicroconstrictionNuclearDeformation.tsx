import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Activity,
  Dna,
  Zap,
  Layers,
  Sparkles,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Maximize2
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
  AreaChart,
  Area
} from 'recharts';

export const MicroconstrictionNuclearDeformation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Microvascular & Biomechanical Controls
  const [capillaryPoreDiameterUm, setCapillaryPoreDiameterUm] = useState<number>(5.5); // 3.5 to 10 um
  const [nuclearDiameterUm, setNuclearDiameterUm] = useState<number>(12.0); // 8 to 16 um
  const [laminAcRatio, setLaminAcRatio] = useState<number>(1.0); // 0.2 to 2.5 (lower = softer/more fragile, higher = rigid)
  const [perfusionPressureMmHg, setPerfusionPressureMmHg] = useState<number>(25); // 5 to 60 mmHg
  const [clusterConfiguration, setClusterConfiguration] = useState<'single' | 'caterpillar_3cell' | 'dense_6cell'>('single');

  // Pharmacological / Mechanotargeting intervention
  const [activeIntervention, setActiveIntervention] = useState<
    'none' | 'cgas_inhibitor' | 'lamin_stabilizer' | 'piezo1_blocker' | 'hdac_inhibitor'
  >('none');

  // Nuclear Squeeze Physics & DNA Rupture Kinetics
  const biomechanics = useMemo(() => {
    let effectiveLamin = laminAcRatio;
    let effectiveDnaRepair = 1.0;
    let effectiveStingActivation = 1.0;

    if (activeIntervention === 'lamin_stabilizer') {
      effectiveLamin = Math.min(2.5, effectiveLamin * 1.6);
    } else if (activeIntervention === 'cgas_inhibitor') {
      effectiveStingActivation = 0.15; // blocks cGAS-STING-mediated death/senescence
    } else if (activeIntervention === 'hdac_inhibitor') {
      effectiveLamin *= 0.6; // de-condenses chromatin, softens nucleus
    }

    // Effective nuclear stiffness (Young's modulus E_n in kPa)
    const nuclearModulusKpa = (1.2 * effectiveLamin) + 0.3;

    // Geometric Confinement Ratio (D_nucleus / D_pore)
    const confinementRatio = nuclearDiameterUm / capillaryPoreDiameterUm;

    // Critical pressure needed to enter capillary pore (Laplace-like entry threshold)
    const entryPressureThresholdMmHg = Math.max(2, Math.round(14 * (confinementRatio - 0.9) * nuclearModulusKpa));

    // Entry state: can the cell squeeze through at the given perfusion pressure?
    const canPass = perfusionPressureMmHg >= entryPressureThresholdMmHg;

    // Transit Time through 100 µm constriction zone (seconds)
    const transitTimeSec = canPass
      ? Math.max(0.4, Number((3.5 * Math.pow(confinementRatio, 2.2) * (nuclearModulusKpa / (perfusionPressureMmHg / 15))).toFixed(1)))
      : 999;

    // Nuclear Envelope (NE) Rupture Probability (%)
    // High confinement + low Lamin A/C + high perfusion force = high rupture risk
    const ruptureProbability = Math.min(
      98,
      Math.max(
        2,
        Math.round(
          (Math.pow(confinementRatio, 1.8) * 22) / Math.max(0.4, effectiveLamin * 1.2)
        )
      )
    );

    // Accumulated DNA Double-Strand Breaks (DSB foci / gamma-H2AX count per cell)
    const dsbCount = Math.round(ruptureProbability * 0.45 * (confinementRatio > 1.8 ? 1.6 : 1.0));

    // Post-Transit Survival Viability (%)
    // DSBs and cGAS-STING activation trigger apoptosis or senescence unless repaired or blocked
    const postTransitViability = Math.max(
      4,
      Math.min(
        96,
        Math.round(100 - (ruptureProbability * 0.6 * effectiveStingActivation) - (dsbCount * 0.8))
      )
    );

    return {
      nuclearModulusKpa: nuclearModulusKpa.toFixed(2),
      confinementRatio: confinementRatio.toFixed(2),
      entryPressureThresholdMmHg,
      canPass,
      transitTimeSec,
      ruptureProbability,
      dsbCount,
      postTransitViability
    };
  }, [capillaryPoreDiameterUm, nuclearDiameterUm, laminAcRatio, perfusionPressureMmHg, activeIntervention]);

  // Canvas Animation of Nuclear Squeezing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let progress = 0; // 0 to 1 along constriction channel

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Draw Capillary Channel Walls
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const entryX = w * 0.32;
      const exitX = w * 0.68;
      const parentChannelH = 120;
      const poreH = capillaryPoreDiameterUm * 8; // scaled for canvas

      ctx.fillStyle = '#1e293b';
      // Top wall
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, centerY - parentChannelH / 2);
      ctx.lineTo(exitX, centerY - parentChannelH / 2);
      ctx.lineTo(exitX - 20, centerY - poreH / 2);
      ctx.lineTo(entryX + 20, centerY - poreH / 2);
      ctx.lineTo(entryX, centerY - parentChannelH / 2);
      ctx.lineTo(0, centerY - parentChannelH / 2);
      ctx.closePath();
      ctx.fill();

      // Bottom wall
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(w, h);
      ctx.lineTo(w, centerY + parentChannelH / 2);
      ctx.lineTo(exitX, centerY + parentChannelH / 2);
      ctx.lineTo(exitX - 20, centerY + poreH / 2);
      ctx.lineTo(entryX + 20, centerY + poreH / 2);
      ctx.lineTo(entryX, centerY + parentChannelH / 2);
      ctx.lineTo(0, centerY + parentChannelH / 2);
      ctx.closePath();
      ctx.fill();

      // Wall outline
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Animate Cell Position
      if (isPlaying) {
        const speed = biomechanics.canPass ? 0.006 / Math.max(0.4, biomechanics.transitTimeSec / 2) : 0.001;
        progress = (progress + speed) % 1;
      }

      const cellX = w * progress;
      const inConstriction = cellX > entryX && cellX < exitX;

      // Cell & Nuclear Deformation Geometry
      let cellRx = 28;
      let cellRy = 28;
      let nucRx = (nuclearDiameterUm * 1.5);
      let nucRy = (nuclearDiameterUm * 1.5);

      if (inConstriction) {
        // Severe elongation
        cellRx = 45;
        cellRy = Math.max(8, poreH * 0.45);
        nucRx = 36;
        nucRy = Math.max(5, poreH * 0.38);
      }

      // Draw Cytoplasm
      ctx.beginPath();
      ctx.ellipse(cellX, centerY, cellRx, cellRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = inConstriction ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Nucleus
      ctx.beginPath();
      ctx.ellipse(cellX, centerY, nucRx, nucRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = inConstriction && biomechanics.ruptureProbability > 50 ? 'rgba(168, 85, 247, 0.7)' : 'rgba(168, 85, 247, 0.45)';
      ctx.fill();
      ctx.strokeStyle = inConstriction && biomechanics.ruptureProbability > 65 ? '#ef4444' : '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Nuclear Bleb / Rupture Sparkles if high stress
      if (inConstriction && biomechanics.ruptureProbability > 45) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px monospace';
        ctx.fillText('⚡ NE RUPTURE (γ-H2AX)', cellX - 45, centerY - nucRy - 8);
      }

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, capillaryPoreDiameterUm, nuclearDiameterUm, biomechanics]);

  // Deformation & Rupture Sensitivity Curve data (Varying capillary bore)
  const boreSensitivityData = useMemo(() => {
    const data = [];
    for (let bore = 3.5; bore <= 10.0; bore += 0.5) {
      const conf = nuclearDiameterUm / bore;
      const mod = (1.2 * laminAcRatio) + 0.3;
      const rup = Math.min(98, Math.max(2, Math.round((Math.pow(conf, 1.8) * 22) / Math.max(0.4, laminAcRatio * 1.2))));
      const viab = Math.max(4, Math.min(96, Math.round(100 - (rup * 0.65))));

      data.push({
        bore: `${bore}µm`,
        ruptureProb: rup,
        viability: viab
      });
    }
    return data;
  }, [nuclearDiameterUm, laminAcRatio]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Capillary Microconstriction, Nuclear Deformation & DNA Damage Analyzer
              </h3>
              <p className="text-xs text-slate-400">
                Models the nuclear mechanical bottleneck: Kelvin-Voigt viscoelastic squeezing, Lamin A/C lamina strain, nuclear envelope (NE) rupture, and cGAS-STING cytosolic DNA sensing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-800">
              CONFINEMENT: {biomechanics.confinementRatio}x RATIO
            </span>
          </div>
        </div>

        {/* Live Canvas View */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <canvas ref={canvasRef} width={820} height={240} className="w-full h-[240px] block" />

          {/* HUD Status Overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur border border-slate-700/80 p-3 rounded-xl text-xs font-mono space-y-1">
            <div className="text-white font-bold flex justify-between gap-4">
              <span>Capillary Pore Bore:</span>
              <span className="text-cyan-400">Ø {capillaryPoreDiameterUm} µm</span>
            </div>
            <div className="text-slate-300 flex justify-between gap-4">
              <span>Nuclear Elastic Modulus (E):</span>
              <span className="text-purple-400">{biomechanics.nuclearModulusKpa} kPa</span>
            </div>
            <div className="text-amber-400 font-bold flex justify-between gap-4 border-t border-slate-700/60 pt-1">
              <span>Transit Passage:</span>
              <span className={biomechanics.canPass ? 'text-emerald-400' : 'text-rose-400'}>
                {biomechanics.canPass ? `PASS (${biomechanics.transitTimeSec}s)` : 'BLOCKED / OCCLUDED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Biomechanical Slider Controls */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Nuclear Rheology & Pore Dimensions
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Kelvin-Voigt Physics</span>
          </div>

          <div className="space-y-3.5">
            {/* Capillary Pore Bore */}
            <Slider
  label="Capillary Pore Diameter:"
  min={3.5}
  max={10.0}
  step={0.25}
  value={capillaryPoreDiameterUm}
  onChange={setCapillaryPoreDiameterUm}
  valueDisplay={<>{capillaryPoreDiameterUm} µm</>}
/>

            {/* Lamin A/C Ratio */}
            <Slider
  label="Nuclear Lamina A/C Ratio:"
  min={0.2}
  max={2.5}
  step={0.1}
  value={laminAcRatio}
  onChange={setLaminAcRatio}
  valueDisplay={<>{laminAcRatio.toFixed(1)}x</>}
/>
          </div>

          {/* Pharmacological Mechanomedicine Sandbox */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Mechanomedicine & Cytoprotective Interventions:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'None (Control)' },
                { id: 'cgas_inhibitor', label: 'H-151 (cGAS-STING-i)' },
                { id: 'lamin_stabilizer', label: 'Retinoic Acid (Lamin-↑)' },
                { id: 'hdac_inhibitor', label: 'Trichostatin A (Chromatin-Soft)' }
              ].map((drug) => (
                <button
                  key={drug.id}
                  onClick={() => setActiveIntervention(drug.id as any)}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all text-left ${
                    activeIntervention === drug.id
                      ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {drug.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sensitivity Charts & DSB Gauges */}
        <div className="xl:col-span-7 space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">NE RUPTURE PROB</span>
              <div className="text-xl font-bold font-mono text-rose-400">{biomechanics.ruptureProbability}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Envelope Blebbing</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">γ-H2AX DSB FOCI</span>
              <div className="text-xl font-bold font-mono text-amber-400">{biomechanics.dsbCount} foci</div>
              <span className="text-[9px] text-slate-500 font-mono">DNA Strand Breaks</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">TRANSIT DELAY</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{biomechanics.transitTimeSec}s</div>
              <span className="text-[9px] text-slate-500 font-mono">Capillary Squeeze</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">POST-TRANSIT VIAB</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{biomechanics.postTransitViability}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Metastatic Survival</span>
            </div>
          </div>

          {/* Pore Bore Sensitivity Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  Nuclear Rupture Risk vs. Post-Transit Survival by Capillary Pore Bore
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ø {nuclearDiameterUm}µm Nucleus</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={boreSensitivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="bore" stroke="#64748b" fontSize={11} />
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
                  <Line
                    type="monotone"
                    dataKey="ruptureProb"
                    name="Nuclear Envelope Rupture Prob (%)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="viability"
                    name="Metastatic Colonization Viability (%)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scientific Summary Footnote */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Mechanobiology of Confined Microvascular Migration</span>
              <p className="leading-relaxed">
                The nucleus is 2 to 10-fold stiffer than the surrounding cytoplasm. When tumor cells squeeze through narrow capillaries, the nuclear envelope stretches beyond its elastic limit, causing transient rupture.
                This exposes genomic DNA to cytosolic TREX1 exonucleases and triggers cGAS-STING innate immune pathways, providing a profound mechanical checkpoint against metastasis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
