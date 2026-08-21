import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Maximize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface FlowParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'ctc' | 'rbc' | 'cluster';
  branchTarget: 1 | 2;
  stagnated: boolean;
  age: number;
}

export const BifurcationHemodynamicsSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [bifurcationAngleDeg, setBifurcationAngleDeg] = useState<number>(45); // 30 to 90 degrees
  const [flowSplitRatio, setFlowSplitRatio] = useState<number>(50); // % into Branch A vs Branch B
  const [inflowVelocityCmS, setInflowVelocityCmS] = useState<number>(18.0); // cm/s
  const [parentVesselRadiusUm, setParentVesselRadiusUm] = useState<number>(50); // um
  const [stenosisApexSeverity, setStenosisApexSeverity] = useState<number>(0); // 0 to 70% plaque / stenosis

  const [stats, setStats] = useState({
    totalInflow: 0,
    branchAParticles: 0,
    branchBParticles: 0,
    apexImpingements: 0,
    stagnationTrapped: 0
  });

  const particlesRef = useRef<FlowParticle[]>([]);
  const animRef = useRef<number | null>(null);
  const countersRef = useRef({ total: 0, a: 0, b: 0, apex: 0, trapped: 0 });

  // Murray's Law daughter branch radii: r0^3 = r1^3 + r2^3
  const daughterRadii = useMemo(() => {
    const r0 = parentVesselRadiusUm;
    const splitA = flowSplitRatio / 100;
    const splitB = 1 - splitA;
    const r1 = Math.round(r0 * Math.cbrt(splitA));
    const r2 = Math.round(r0 * Math.cbrt(splitB));
    return { r1, r2 };
  }, [parentVesselRadiusUm, flowSplitRatio]);

  // Init canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const forkX = w * 0.42;
      const forkY = h * 0.5;

      const angleRad = (bifurcationAngleDeg * Math.PI) / 180;
      const halfAngle = angleRad * 0.5;

      // Draw Vessel Geometry
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Draw Parent Vessel Lumen
      const r0 = parentVesselRadiusUm * 0.75;
      const r1 = daughterRadii.r1 * 0.75;
      const r2 = daughterRadii.r2 * 0.75;

      // Lumen background gradient (Shear stress map)
      ctx.beginPath();
      // Parent top
      ctx.moveTo(20, forkY - r0);
      ctx.lineTo(forkX, forkY - r0);
      // Branch 1 (top)
      const topEndX = w - 30;
      const topEndY = forkY - r0 - Math.tan(halfAngle) * (w - 30 - forkX);
      ctx.lineTo(topEndX, topEndY);
      ctx.lineTo(topEndX, topEndY + r1 * 2);
      // Apex inner corner
      const apexX = forkX + 25 + stenosisApexSeverity * 0.4;
      const apexY = forkY;
      ctx.lineTo(apexX, apexY);
      // Branch 2 (bottom)
      const botEndY = forkY + r0 + Math.tan(halfAngle) * (w - 30 - forkX);
      ctx.lineTo(topEndX, botEndY - r2 * 2);
      ctx.lineTo(topEndX, botEndY);
      ctx.lineTo(forkX, forkY + r0);
      ctx.lineTo(20, forkY + r0);
      ctx.closePath();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Highlight Apex Impingement & Stagnation Recirculation Zone (Low WSS / High Metastatic Adhesion)
      ctx.beginPath();
      ctx.arc(apexX, apexY, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spawn new particles periodically
      if (frame % 4 === 0 && particlesRef.current.length < 80) {
        const randType = Math.random();
        const type = randType > 0.8 ? 'cluster' : randType > 0.5 ? 'ctc' : 'rbc';
        const startY = forkY - r0 * 0.8 + Math.random() * r0 * 1.6;
        const target: 1 | 2 = startY < forkY ? 1 : 2;

        particlesRef.current.push({
          id: Date.now() + Math.random(),
          x: 25,
          y: startY,
          vx: (inflowVelocityCmS / 10) * (1.8 + Math.random() * 0.5),
          vy: 0,
          type,
          branchTarget: target,
          stagnated: false,
          age: 0
        });
        countersRef.current.total++;
      }

      // Update & Draw Flow Particles
      const active: FlowParticle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.age++;

        // Physics behavior at bifurcation
        if (p.x < forkX) {
          // Straight flow in parent vessel with Poiseuille parabolic profile
          const distFromCenter = Math.abs(p.y - forkY);
          const poiseuilleSpeedFactor = 1 - Math.pow(distFromCenter / (r0 + 1), 2);
          p.vx = (inflowVelocityCmS / 8) * Math.max(0.4, poiseuilleSpeedFactor);
          p.vy = 0;
        } else {
          // Fork dynamics
          const dxToApex = apexX - p.x;
          const dyToApex = apexY - p.y;
          const distToApex = Math.sqrt(dxToApex * dxToApex + dyToApex * dyToApex);

          // Direct apex impact
          if (distToApex < 15 && !p.stagnated) {
            countersRef.current.apex++;
            if (p.type === 'cluster' || p.type === 'ctc') {
              p.stagnated = true;
              countersRef.current.trapped++;
            }
          }

          if (p.stagnated) {
            p.vx *= 0.1;
            p.vy *= 0.1;
          } else {
            // Deflect into Branch 1 or Branch 2
            if (p.branchTarget === 1) {
              p.vy = -Math.tan(halfAngle) * p.vx * 0.9;
            } else {
              p.vy = Math.tan(halfAngle) * p.vx * 0.9;
            }
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.beginPath();
        let radius = 3.5;
        if (p.type === 'cluster') {
          radius = 7;
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#9333ea';
          ctx.shadowBlur = 8;
        } else if (p.type === 'ctc') {
          radius = 5;
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#e11d48';
          ctx.shadowBlur = 6;
        } else {
          radius = 3;
          ctx.fillStyle = '#64748b';
          ctx.shadowBlur = 0;
        }

        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Count outcomes when exiting
        if (p.x >= topEndX) {
          if (p.branchTarget === 1) countersRef.current.a++;
          else countersRef.current.b++;
        } else if (p.age < 350) {
          active.push(p);
        }
      }

      particlesRef.current = active;

      if (frame % 20 === 0) {
        setStats({
          totalInflow: countersRef.current.total,
          branchAParticles: countersRef.current.a,
          branchBParticles: countersRef.current.b,
          apexImpingements: countersRef.current.apex,
          stagnationTrapped: countersRef.current.trapped
        });
      }

      if (isRunning) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, bifurcationAngleDeg, flowSplitRatio, inflowVelocityCmS, parentVesselRadiusUm, stenosisApexSeverity, daughterRadii]);

  const resetSim = () => {
    particlesRef.current = [];
    countersRef.current = { total: 0, a: 0, b: 0, apex: 0, trapped: 0 };
    setStats({
      totalInflow: 0,
      branchAParticles: 0,
      branchBParticles: 0,
      apexImpingements: 0,
      stagnationTrapped: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Microvascular Bifurcation & Hydrodynamic Skimming Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Models Murray's law scaling, Zweifach-Fung plasma skimming, stagnation apex impingement, and CTC cluster entrapment at vascular branch points.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={resetSim}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Live Canvas View */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={820}
            height={360}
            className="w-full h-[360px] block"
          />

          {/* Live HUD Counters */}
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur border border-slate-700/80 p-3 rounded-xl text-xs font-mono space-y-1">
            <div className="text-white font-bold flex justify-between gap-4">
              <span>Parent Inflow Radius:</span>
              <span className="text-cyan-400">{parentVesselRadiusUm} µm</span>
            </div>
            <div className="text-slate-300 flex justify-between gap-4">
              <span>Branch A Radius (Murray):</span>
              <span className="text-emerald-400">{daughterRadii.r1} µm ({flowSplitRatio}%)</span>
            </div>
            <div className="text-slate-300 flex justify-between gap-4">
              <span>Branch B Radius (Murray):</span>
              <span className="text-purple-400">{daughterRadii.r2} µm ({100 - flowSplitRatio}%)</span>
            </div>
            <div className="text-rose-400 font-bold flex justify-between gap-4 border-t border-slate-700/60 pt-1">
              <span>Apex Mechanical Arrests:</span>
              <span className="text-white">{stats.stagnationTrapped}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur border border-slate-700/80 p-2.5 rounded-xl text-[10px] font-mono flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> CTC Cluster
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Single CTC
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> RBC
            </span>
          </div>
        </div>
      </div>

      {/* Geometry Sliders & Bifurcation Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Bifurcation Angle:</span>
            <span className="text-purple-400 font-bold">{bifurcationAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="30"
            max="90"
            value={bifurcationAngleDeg}
            onChange={(e) => setBifurcationAngleDeg(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Flow Split Ratio (Branch A):</span>
            <span className="text-emerald-400 font-bold">{flowSplitRatio}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={flowSplitRatio}
            onChange={(e) => setFlowSplitRatio(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Inflow Velocity:</span>
            <span className="text-cyan-400 font-bold">{inflowVelocityCmS} cm/s</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="40.0"
            step="1.0"
            value={inflowVelocityCmS}
            onChange={(e) => setInflowVelocityCmS(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Apex Plaque Stenosis:</span>
            <span className="text-rose-400 font-bold">{stenosisApexSeverity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={stenosisApexSeverity}
            onChange={(e) => setStenosisApexSeverity(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
        </div>
      </div>
    </div>
  );
};
