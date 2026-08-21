import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sliders,
  Shield,
  ShieldAlert,
  Droplets,
  Heart,
  TrendingDown,
  TrendingUp,
  Download,
  Flame,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  Settings2,
  Wind
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { OrganSite, PrimaryCancerType } from '../../../types/metastasis';

interface CirculatoryMicrodynamicsProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

interface Particle {
  id: number;
  type: 'ctc_single' | 'ctc_cluster' | 'rbc' | 'platelet' | 'neutrophil';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  health: number; // 0-100%
  clusterSize?: number;
  isCloaked?: boolean;
  isArrested?: boolean;
  shearAccumulated: number;
}

export const CirculatoryMicrodynamicsStage: React.FC<CirculatoryMicrodynamicsProps> = ({
  selectedOrgan,
  selectedCancerType
}) => {
  // Simulator Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [cardiacOutputLpm, setCardiacOutputLpm] = useState<number>(5.0); // 3.0 to 8.0 L/min
  const [meanArterialPressureMmHg, setMeanArterialPressureMmHg] = useState<number>(95);
  const [bloodViscosityCp, setBloodViscosityCp] = useState<number>(3.5); // cP (mPa.s)
  
  // Vessel Microgeometry & Flow Parameters
  const [vesselCompartment, setVesselCompartment] = useState<'aorta' | 'arteriole' | 'capillary' | 'venule' | 'organ_microvasculature'>('capillary');
  const [targetOrganSite, setTargetOrganSite] = useState<OrganSite>(selectedOrgan !== 'all' ? selectedOrgan : 'bone');
  const [vesselDiameterUm, setVesselDiameterUm] = useState<number>(8.0); // Capillary = 8um, arteriole = 40um, etc.
  const [wallShearStressDyn, setWallShearStressDyn] = useState<number>(12.5); // dyn/cm2
  
  // CTC Biomechanical Parameters
  const [ctcInflowRate, setCtcInflowRate] = useState<number>(120); // cells/min
  const [ctcClusterFraction, setCtcClusterFraction] = useState<number>(35); // % clusters
  const [clusterMeanSize, setClusterMeanSize] = useState<number>(4); // 2-10 cells
  const [plateletCloakingLevel, setPlateletCloakingLevel] = useState<number>(75); // % cloaked
  const [membraneDeformabilityKpa, setMembraneDeformabilityKpa] = useState<number>(0.8); // 0.2 to 2.5 kPa
  const [selectinIntegrinAffinity, setSelectinIntegrinAffinity] = useState<number>(0.85);

  // Pharmacological Interventions
  const [activeIntervention, setActiveIntervention] = useState<'none' | 'antiplatelet_aspirin' | 'anti_integrin' | 'shear_stabilizer' | 'vasodilator'>('none');

  // Simulation Computed Telemetry
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalDisseminated, setTotalDisseminated] = useState<number>(850);
  const [totalSurviving, setTotalSurviving] = useState<number>(142);
  const [totalArrestedOrgan, setTotalArrestedOrgan] = useState<number>(68);
  const [totalDestroyedShear, setTotalDestroyedShear] = useState<number>(540);
  const [totalKilledImmune, setTotalKilledImmune] = useState<number>(100);

  // Time-series telemetry history
  const [telemetryHistory, setTelemetryHistory] = useState<Array<{
    timeSec: number;
    singleCtcSurvival: number;
    clusterSurvival: number;
    shearStress: number;
    organArrestRate: number;
  }>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Derived fluid mechanics calculations
  const effectiveShearStress = (
    (wallShearStressDyn * (bloodViscosityCp / 3.5) * (cardiacOutputLpm / 5.0)) *
    (activeIntervention === 'vasodilator' ? 0.7 : 1.0)
  ).toFixed(1);

  const clusterProtectionMultiplier = (
    (1.0 + (clusterMeanSize - 1) * 0.45) *
    (plateletCloakingLevel / 50.0) *
    (activeIntervention === 'antiplatelet_aspirin' ? 0.4 : 1.0) *
    (activeIntervention === 'shear_stabilizer' ? 1.5 : 1.0)
  ).toFixed(2);

  const mechanicalArrestProbability = Math.min(
    98,
    Math.max(
      10,
      Math.round(
        (Math.max(0, 15 - vesselDiameterUm) / 10) * 60 +
        (1 / membraneDeformabilityKpa) * 15 +
        selectinIntegrinAffinity * 30 * (activeIntervention === 'anti_integrin' ? 0.25 : 1.0)
      )
    )
  );

  const calculatedHalfLifeSec = (
    (240 / Math.max(1, Number(effectiveShearStress))) *
    Number(clusterProtectionMultiplier)
  ).toFixed(1);

  // Initialize Canvas Particles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        id: i,
        type: 'rbc',
        x: Math.random() * 600,
        y: 40 + Math.random() * 120,
        vx: 2.5 + Math.random() * 1.5,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 6,
        health: 100,
        shearAccumulated: 0
      });
    }
    for (let i = 40; i < 65; i++) {
      particles.push({
        id: i,
        type: 'platelet',
        x: Math.random() * 600,
        y: 35 + Math.random() * 130,
        vx: 3.0 + Math.random() * 2.0,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 2.5,
        health: 100,
        shearAccumulated: 0
      });
    }
    for (let i = 65; i < 75; i++) {
      const isCluster = Math.random() < ctcClusterFraction / 100;
      particles.push({
        id: i,
        type: isCluster ? 'ctc_cluster' : 'ctc_single',
        x: Math.random() * 600,
        y: 50 + Math.random() * 100,
        vx: 1.8 + Math.random() * 1.2,
        vy: (Math.random() - 0.5) * 0.3,
        radius: isCluster ? 12 : 8,
        health: 100,
        clusterSize: isCluster ? clusterMeanSize : 1,
        isCloaked: Math.random() < plateletCloakingLevel / 100,
        shearAccumulated: 0
      });
    }
    particlesRef.current = particles;
  }, [ctcClusterFraction, clusterMeanSize, plateletCloakingLevel]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1) * simSpeed;
      lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw Vessel Walls (Endothelial Glycocalyx Layer)
      const topWallY = 30;
      const bottomWallY = height - 30;

      // Endothelium top
      const gradTop = ctx.createLinearGradient(0, 0, 0, topWallY);
      gradTop.addColorStop(0, '#1e293b');
      gradTop.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, width, topWallY);

      // Endothelial cells top
      ctx.fillStyle = '#334155';
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.ellipse(x + 16, topWallY - 4, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();
      }

      // Endothelium bottom
      const gradBot = ctx.createLinearGradient(0, bottomWallY, 0, height);
      gradBot.addColorStop(0, '#0f172a');
      gradBot.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradBot;
      ctx.fillRect(0, bottomWallY, width, height - bottomWallY);

      // Endothelial cells bottom
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.ellipse(x + 16, bottomWallY + 4, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();
      }

      // Update and Draw Particles
      particlesRef.current.forEach((p) => {
        if (!isPlaying) {
          // just draw static
        } else {
          // Poiseuille Parabolic velocity profile: v(y) = v_max * (1 - ((y - y_mid) / R)^2)
          const midY = height / 2;
          const radiusY = (bottomWallY - topWallY) / 2;
          const normDist = Math.min(1, Math.abs(p.y - midY) / radiusY);
          const poiseuilleFactor = Math.max(0.15, 1.0 - normDist * normDist);

          // RBC Margination: Stiff CTCs get pushed toward vessel walls, flexible RBCs stay centered
          if (p.type === 'ctc_single' || p.type === 'ctc_cluster') {
            const marginationBias = (p.y < midY ? -0.3 : 0.3) * (1 / membraneDeformabilityKpa);
            p.vy += marginationBias * dt * 2.0;
          }

          p.x += (p.vx * poiseuilleFactor * (cardiacOutputLpm / 5.0) * 80) * dt;
          p.y += p.vy;

          // Wall Collisions
          if (p.y - p.radius < topWallY) {
            p.y = topWallY + p.radius;
            p.vy = Math.abs(p.vy) * 0.5;
            if (p.type === 'ctc_single' || p.type === 'ctc_cluster') {
              p.shearAccumulated += Number(effectiveShearStress) * 0.1;
              p.health = Math.max(0, p.health - p.shearAccumulated * 0.05);
            }
          }
          if (p.y + p.radius > bottomWallY) {
            p.y = bottomWallY - p.radius;
            p.vy = -Math.abs(p.vy) * 0.5;
            if (p.type === 'ctc_single' || p.type === 'ctc_cluster') {
              p.shearAccumulated += Number(effectiveShearStress) * 0.1;
              p.health = Math.max(0, p.health - p.shearAccumulated * 0.05);
            }
          }

          // Wrap around screen
          if (p.x > width + 30) {
            p.x = -20;
            p.y = topWallY + 20 + Math.random() * (bottomWallY - topWallY - 40);
            p.health = 100;
            p.shearAccumulated = 0;
          }
        }

        // Draw particle based on type
        if (p.type === 'rbc') {
          // Biconcave Erythrocyte
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius, p.radius * 0.65, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        } else if (p.type === 'platelet') {
          // Platelet
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ctc_single') {
          // Monomeric CTC
          const isAlive = p.health > 15;
          ctx.save();
          if (!isAlive) ctx.globalAlpha = 0.35;

          // Platelet Cloak Ring
          if (p.isCloaked && isAlive) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // CTC Body
          ctx.fillStyle = isAlive ? '#ec4899' : '#64748b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = isAlive ? '#f43f5e' : '#475569';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Nucleus
          ctx.fillStyle = isAlive ? '#881337' : '#334155';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Health bar
          if (p.health < 90) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x - 8, p.y - p.radius - 6, 16, 2.5);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(p.x - 8, p.y - p.radius - 6, 16 * (p.health / 100), 2.5);
          }

          ctx.restore();
        } else if (p.type === 'ctc_cluster') {
          // Multicellular CTC Cluster
          const isAlive = p.health > 15;
          ctx.save();
          if (!isAlive) ctx.globalAlpha = 0.35;

          // Protective Platelet & Fibrin Cloak
          if (p.isCloaked && isAlive) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius + 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          const subCount = p.clusterSize || 4;
          for (let s = 0; s < subCount; s++) {
            const angle = (s / subCount) * Math.PI * 2;
            const subX = p.x + Math.cos(angle) * (p.radius * 0.5);
            const subY = p.y + Math.sin(angle) * (p.radius * 0.5);

            ctx.fillStyle = isAlive ? '#8b5cf6' : '#475569';
            ctx.beginPath();
            ctx.arc(subX, subY, p.radius * 0.55, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = isAlive ? '#c084fc' : '#334155';
            ctx.stroke();

            ctx.fillStyle = isAlive ? '#4c1d95' : '#1e293b';
            ctx.beginPath();
            ctx.arc(subX, subY, p.radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`${subCount}x-CTC`, p.x - 14, p.y + p.radius + 10);
          ctx.restore();
        }
      });

      // Overlay Flow Indicators
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, 10, 190, 48);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(10, 10, 190, 48);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`FLOW: ${effectiveShearStress} dyn/cm² | ${cardiacOutputLpm} L/min`, 16, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`VESSEL: ${vesselCompartment.toUpperCase()} (Ø ${vesselDiameterUm} μm)`, 16, 40);
      ctx.fillText(`TARGET: ${targetOrganSite.toUpperCase()} NICHE`, 16, 52);

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, simSpeed, effectiveShearStress, cardiacOutputLpm, vesselCompartment, vesselDiameterUm, targetOrganSite, membraneDeformabilityKpa]);

  // Periodic Telemetry Update
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) return;

      setElapsedSeconds((prev) => prev + 1);

      const newInflow = Math.round(ctcInflowRate / 60);
      const survivalRateSingle = Math.max(0.01, 0.45 - Number(effectiveShearStress) * 0.02);
      const survivalRateCluster = Math.min(0.85, 0.75 - Number(effectiveShearStress) * 0.008 * (1 / Math.max(1, clusterMeanSize)));

      const arrested = Math.round((newInflow * mechanicalArrestProbability) / 100);
      const destroyedShear = Math.round(newInflow * (1 - survivalRateSingle));

      setTotalDisseminated((prev) => prev + newInflow);
      setTotalSurviving((prev) => prev + Math.max(1, Math.round(newInflow * survivalRateCluster)));
      setTotalArrestedOrgan((prev) => prev + arrested);
      setTotalDestroyedShear((prev) => prev + destroyedShear);

      setTelemetryHistory((prev) => {
        const nextPoint = {
          timeSec: prev.length * 2,
          singleCtcSurvival: Math.round(survivalRateSingle * 100),
          clusterSurvival: Math.round(survivalRateCluster * 100),
          shearStress: parseFloat(effectiveShearStress),
          organArrestRate: mechanicalArrestProbability
        };
        return [...prev.slice(-24), nextPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, ctcInflowRate, effectiveShearStress, clusterMeanSize, mechanicalArrestProbability]);

  const handleSelectOrganPreset = (organ: OrganSite) => {
    setTargetOrganSite(organ);
    if (organ === 'bone') {
      setVesselDiameterUm(9.0);
      setWallShearStressDyn(8.5);
      setVesselCompartment('organ_microvasculature');
    } else if (organ === 'brain') {
      setVesselDiameterUm(5.5);
      setWallShearStressDyn(18.0);
      setVesselCompartment('capillary');
    } else if (organ === 'liver') {
      setVesselDiameterUm(12.0);
      setWallShearStressDyn(3.5);
      setVesselCompartment('organ_microvasculature');
    } else if (organ === 'lung') {
      setVesselDiameterUm(7.0);
      setWallShearStressDyn(14.0);
      setVesselCompartment('capillary');
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">WALL SHEAR STRESS (τw)</span>
          <span className="text-lg font-bold text-rose-400 font-mono">{effectiveShearStress} <span className="text-xs font-normal text-slate-500">dyn/cm²</span></span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">CLUSTER ADVANTAGE</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">{clusterProtectionMultiplier}x <span className="text-xs font-normal text-slate-500">Survival</span></span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">MECHANICAL ARREST %</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{mechanicalArrestProbability}% <span className="text-xs font-normal text-slate-500">Filtration</span></span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">HALF-LIFE (T1/2)</span>
          <span className="text-lg font-bold text-amber-400 font-mono">{calculatedHalfLifeSec} <span className="text-xs font-normal text-slate-500">sec</span></span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">TOTAL DISSEMINATED</span>
          <span className="text-lg font-bold text-slate-200 font-mono">{totalDisseminated.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">ORGAN SEEDED</span>
          <span className="text-lg font-bold text-purple-400 font-mono">{totalArrestedOrgan.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Interactive Stage: 2D Vessel Canvas & Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Microvascular Particle Physics Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Live Intravascular Fluid & Cell Dynamics Canvas</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> RBC
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" /> Single CTC
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> CTC Cluster
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Platelet Cloak
                </span>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090d16]">
              <canvas
                ref={canvasRef}
                width={720}
                height={280}
                className="w-full h-64 block"
              />
              <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
                Poiseuille Parabolic Gradient • Non-Newtonian Flow
              </div>
            </div>

            {/* Organ Capillary Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Organ Vascular Bed Presets:</span>
                <span className="font-mono text-cyan-400 font-bold">{targetOrganSite.toUpperCase()} NICHE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bone', label: 'Bone Sinusoids', diam: '9 μm', shear: '8.5 dyn' },
                  { id: 'brain', label: 'Brain Capillaries', diam: '5.5 μm', shear: '18 dyn' },
                  { id: 'liver', label: 'Liver Sinusoids', diam: '12 μm', shear: '3.5 dyn' },
                  { id: 'lung', label: 'Pulmonary Sheets', diam: '7 μm', shear: '14 dyn' }
                ].map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrganPreset(org.id as OrganSite)}
                    className={`p-2 rounded-xl text-left border text-xs font-mono transition-all ${
                      targetOrganSite === org.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold">{org.label}</div>
                    <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                      <span>Ø {org.diam}</span>
                      <span>{org.shear}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Series Telemetry Charts */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Real-Time Survival & Organ Arrest Kinetics
              </h4>
              <span className="text-xs font-mono text-slate-400">Live 48s Window</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeSec" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: '% Survival / Rate', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="clusterSurvival" name="CTC Cluster Survival %" stroke="#c084fc" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="singleCtcSurvival" name="Single CTC Survival %" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="organArrestRate" name="Capillary Arrest %" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Parameter Sliders & Biomechanical Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Biomechanical Parameters</h3>
            </div>

            {/* Cardiac Output */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Cardiac Output (CO):</span>
                <span className="font-mono font-bold text-cyan-400">{cardiacOutputLpm.toFixed(1)} L/min</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="8.0"
                step="0.2"
                value={cardiacOutputLpm}
                onChange={(e) => setCardiacOutputLpm(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 rounded h-1.5"
              />
            </div>

            {/* Vessel Diameter */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Capillary Lumen Caliber (Ø):</span>
                <span className="font-mono font-bold text-rose-400">{vesselDiameterUm.toFixed(1)} μm</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="25.0"
                step="0.5"
                value={vesselDiameterUm}
                onChange={(e) => setVesselDiameterUm(parseFloat(e.target.value))}
                className="w-full accent-rose-500 bg-slate-950 rounded h-1.5"
              />
            </div>

            {/* Cluster Fraction */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>CTC Cluster Proportion:</span>
                <span className="font-mono font-bold text-purple-400">{ctcClusterFraction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={ctcClusterFraction}
                onChange={(e) => setCtcClusterFraction(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 rounded h-1.5"
              />
            </div>

            {/* Platelet Cloaking */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Platelet / Fibrin Cloaking:</span>
                <span className="font-mono font-bold text-emerald-400">{plateletCloakingLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={plateletCloakingLevel}
                onChange={(e) => setPlateletCloakingLevel(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 rounded h-1.5"
              />
            </div>

            {/* Membrane Deformability */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Cell Deformability Modulus (E):</span>
                <span className="font-mono font-bold text-amber-400">{membraneDeformabilityKpa} kPa</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={membraneDeformabilityKpa}
                onChange={(e) => setMembraneDeformabilityKpa(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 rounded h-1.5"
              />
            </div>
          </div>

          {/* Pharmacological Interventions Panel */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Therapeutic Interventions</h3>
            </div>

            <div className="space-y-2">
              {[
                { id: 'none', label: 'No Treatment (Baseline Control)', desc: 'Standard untreated hemodynamic transit.' },
                { id: 'antiplatelet_aspirin', label: 'Anti-Platelet (Low-dose Aspirin / Ticagrelor)', desc: 'Strips platelet-fibrin shield; exposes CTCs to shear destruction.' },
                { id: 'anti_integrin', label: 'Anti-αvβ3 / VCAM-1 Integrin Blocker', desc: 'Prevents firm endothelial arrest & transendothelial migration.' },
                { id: 'shear_stabilizer', label: 'Poloxamer Membrane Protectant', desc: 'Stabilizes lipid membrane against shear stress cytolysis.' },
                { id: 'vasodilator', label: 'Microvascular Vasodilator (Nitric Oxide donor)', desc: 'Increases vessel lumen Ø, decreasing capillary mechanical trap.' }
              ].map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setActiveIntervention(tx.id as any)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    activeIntervention === tx.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs flex justify-between items-center">
                    <span>{tx.label}</span>
                    {activeIntervention === tx.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{tx.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
