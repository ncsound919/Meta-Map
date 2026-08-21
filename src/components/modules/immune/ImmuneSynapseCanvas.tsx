import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Crosshair,
  Info,
  Maximize2
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'granzyme' | 'perforin' | 'antigen' | 'antibody' | 'atp';
  life: number;
  maxLife: number;
}

export const ImmuneSynapseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [antiPd1Active, setAntiPd1Active] = useState<boolean>(true);
  const [antiCtla4Active, setAntiCtla4Active] = useState<boolean>(false);
  const [antiCd47Active, setAntiCd47Active] = useState<boolean>(false);
  const [synapseStrength, setSynapseStrength] = useState<number>(85); // 0-100%
  const [tumorLysisScore, setTumorLysisScore] = useState<number>(62);

  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Trigger burst of lytic vesicles (Granzyme B & Perforin)
  const triggerDegranulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = canvas.width * 0.35;
    const startY = canvas.height * 0.5;

    for (let i = 0; i < 25; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x: startX + (Math.random() - 0.5) * 20,
        y: startY + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#f43f5e' : '#38bdf8', // Red Granzyme or Cyan Perforin
        type: Math.random() > 0.5 ? 'granzyme' : 'perforin',
        life: 0,
        maxLife: 60 + Math.random() * 40
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.02;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const midY = canvas.height * 0.5;
      const tCellX = canvas.width * 0.28;
      const tumorX = canvas.width * 0.72;

      // 1. Draw T-Cell Membrane (Left)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(tCellX - 100, midY, 150, 180, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 116, 144, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      // T-Cell Label
      ctx.fillStyle = '#67e8f9';
      ctx.font = 'bold 13px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CD8+ CYTOTOXIC T CELL', tCellX - 120, midY - 140);
      ctx.restore();

      // 2. Draw Tumor Cell Membrane (Right)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(tumorX + 100, midY, 150, 180, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(159, 18, 57, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Tumor Cell Label
      ctx.fillStyle = '#fda4af';
      ctx.font = 'bold 13px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('METASTATIC TUMOR CLONE', tumorX + 120, midY - 140);
      ctx.restore();

      // 3. Synaptic Cleft (The gap in the center)
      const cleftX = (tCellX + tumorX) / 2;

      // Draw TCR <--> pMHC-I Synapse (Signal 1)
      const tcrY = midY - 50;
      ctx.save();
      // TCR
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(tCellX - 10, tcrY - 8, 35, 16);
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillText('TCR', tCellX - 25, tcrY + 4);

      // pMHC-I
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(tumorX - 25, tcrY - 8, 35, 16);
      ctx.fillStyle = '#ffe4e6';
      ctx.fillText('pMHC-I', tumorX + 15, tcrY + 4);

      // Neoantigen peptide in between
      ctx.beginPath();
      ctx.arc(cleftX, tcrY, 6 + Math.sin(time * 4) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Connecting energy glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(tCellX + 25, tcrY);
      ctx.lineTo(tumorX - 25, tcrY);
      ctx.stroke();
      ctx.restore();

      // Draw PD-1 <--> PD-L1 Axis (Inhibitory Checkpoint)
      const pd1Y = midY + 40;
      ctx.save();
      // PD-1
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(tCellX - 10, pd1Y - 8, 35, 16);
      ctx.fillStyle = '#f3e8ff';
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillText('PD-1', tCellX - 25, pd1Y + 4);

      // PD-L1
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(tumorX - 25, pd1Y - 8, 35, 16);
      ctx.fillStyle = '#fce7f3';
      ctx.fillText('PD-L1', tumorX + 15, pd1Y + 4);

      if (antiPd1Active) {
        // Anti-PD-1 Antibody (Y-shaped) Blocking the interaction!
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Y shape
        ctx.moveTo(cleftX - 8, pd1Y - 10);
        ctx.lineTo(cleftX, pd1Y);
        ctx.lineTo(cleftX + 8, pd1Y - 10);
        ctx.moveTo(cleftX, pd1Y);
        ctx.lineTo(cleftX, pd1Y + 12);
        ctx.stroke();

        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.fillText('Anti-PD-1 mAb', cleftX, pd1Y + 24);
      } else {
        // Inhibitory SHP-2 Recruitment Signal
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(tCellX + 25, pd1Y);
        ctx.lineTo(tumorX - 25, pd1Y);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.fillText('SHP-2 Brake', cleftX, pd1Y - 12);
      }
      ctx.restore();

      // 4. Update and Render Lytic Granules & Particles
      if (isRunning && Math.random() < (antiPd1Active ? 0.35 : 0.08)) {
        triggerDegranulation();
      }

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        // Check if granzyme reaches tumor membrane
        if (p.x >= tumorX - 20 && p.x <= tumorX + 80) {
          // Pore lysis impact
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
          ctx.fill();
        }

        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Filter dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, antiPd1Active, antiCtla4Active, antiCd47Active]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Interactive Immune Synapse & Degranulation Physics</h3>
            <p className="text-xs text-slate-400">
              Real-time biophysical visualization of TCR : pMHC-I signaling, PD-1 checkpoint brake engagement, and perforin pore-mediated cytolysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause Canvas' : 'Play Canvas'}
          </button>
          <button
            onClick={triggerDegranulation}
            className="px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-rose-950"
          >
            <Zap className="w-3.5 h-3.5" /> Degranulate Vesicles
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          className="w-full h-[380px] block"
        />

        {/* Live Overlay Indicators */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 p-2.5 rounded-lg text-[11px] font-mono space-y-1">
          <div className="text-cyan-400 font-bold">Signal 1: TCR ↔ Neoantigen ↔ MHC-I</div>
          <div className="text-slate-400">Degranulation Flux: {antiPd1Active ? 'Active (High)' : 'Arrested (SHP-2)'}</div>
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700 p-2.5 rounded-lg text-[11px] font-mono space-y-1">
          <div className="text-rose-400 font-bold">Tumor Apoptosis Inducer</div>
          <div className="text-slate-400">Granzyme B + Perforin Pores</div>
        </div>
      </div>

      {/* Interactive Checkpoint Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => setAntiPd1Active(!antiPd1Active)}
          className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
            antiPd1Active
              ? 'bg-cyan-500/10 border-cyan-500/60 ring-1 ring-cyan-500/40 text-cyan-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs font-mono">Anti-PD-1 / Anti-PD-L1 mAb</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
              antiPd1Active ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-800 text-slate-500'
            }`}>
              {antiPd1Active ? 'INFUSED' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Blocks SHP-2 recruitment; unleashes full cytolytic vesicle release into the synaptic cleft.
          </p>
        </button>

        <button
          onClick={() => setAntiCtla4Active(!antiCtla4Active)}
          className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
            antiCtla4Active
              ? 'bg-purple-500/10 border-purple-500/60 ring-1 ring-purple-500/40 text-purple-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs font-mono">Anti-CTLA-4 (Ipilimumab)</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
              antiCtla4Active ? 'bg-purple-950 text-purple-300' : 'bg-slate-800 text-slate-500'
            }`}>
              {antiCtla4Active ? 'INFUSED' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Prevents B7 trans-endocytosis on APCs; boosts CD28 costimulation and Treg depletion.
          </p>
        </button>

        <button
          onClick={() => setAntiCd47Active(!antiCd47Active)}
          className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
            antiCd47Active
              ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40 text-amber-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs font-mono">Anti-CD47 "Don't Eat Me"</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
              antiCd47Active ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-500'
            }`}>
              {antiCd47Active ? 'INFUSED' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Unleashes macrophage SIRP-alpha clearance of metastatic tumor cells.
          </p>
        </button>
      </div>
    </div>
  );
};
