import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Layers,
  FlaskConical,
  Flame,
  Info,
  Maximize2,
  TrendingDown,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface Agent {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'cd8_tcell' | 'tumor_sensitive' | 'tumor_pdl1' | 'tumor_b2m_null' | 'treg' | 'm2_tam';
  health: number; // 0-100
  exhaustion: number; // 0-100
  age: number;
}

export const SpatialAgentSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [antiPd1Active, setAntiPd1Active] = useState<boolean>(true);
  const [tregDepleted, setTregDepleted] = useState<boolean>(false);
  const [biteActive, setBiteActive] = useState<boolean>(false);
  const [stingBoost, setStingBoost] = useState<boolean>(false);

  // Stats Counters
  const [stats, setStats] = useState({
    tumorCount: 45,
    cd8Count: 30,
    tregCount: 12,
    lysisEvents: 0,
    b2mEscapePct: 15
  });

  const agentsRef = useRef<Agent[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lysisCountRef = useRef<number>(0);

  // Initialize Cellular Agents
  const initAgents = () => {
    const agents: Agent[] = [];
    const width = 800;
    const height = 450;

    // 1. Seed Tumor Clones in the center
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 120;
      const randType = Math.random();
      let type: Agent['type'] = 'tumor_sensitive';
      if (randType > 0.65) type = 'tumor_pdl1';
      else if (randType > 0.85) type = 'tumor_b2m_null';

      agents.push({
        id: i,
        x: width * 0.5 + Math.cos(angle) * dist,
        y: height * 0.5 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 6 + Math.random() * 2,
        type,
        health: 100,
        exhaustion: 0,
        age: 0
      });
    }

    // 2. Seed CD8+ T-cells in the periphery
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 180 + Math.random() * 100;
      agents.push({
        id: 100 + i,
        x: width * 0.5 + Math.cos(angle) * dist,
        y: height * 0.5 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 5,
        type: 'cd8_tcell',
        health: 100,
        exhaustion: 10,
        age: 0
      });
    }

    // 3. Seed Suppressive Tregs & M2 TAMs
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 80;
      agents.push({
        id: 200 + i,
        x: width * 0.5 + Math.cos(angle) * dist,
        y: height * 0.5 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 5.5,
        type: i % 2 === 0 ? 'treg' : 'm2_tam',
        health: 100,
        exhaustion: 0,
        age: 0
      });
    }

    agentsRef.current = agents;
    lysisCountRef.current = 0;
  };

  useEffect(() => {
    initAgents();
  }, []);

  // Influx T cells
  const injectTILs = () => {
    const width = 800;
    const height = 450;
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 220 + Math.random() * 50;
      agentsRef.current.push({
        id: Date.now() + i,
        x: width * 0.5 + Math.cos(angle) * dist,
        y: height * 0.5 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 5,
        type: 'cd8_tcell',
        health: 100,
        exhaustion: 0,
        age: 0
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      // Draw background chemokine gradient (CXCL9/CXCL10)
      const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 300);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.3)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Tumor core boundary ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      const agents = agentsRef.current;
      const newAgents: Agent[] = [];

      // Process Agent Interactions & Kinetics
      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        a.age++;

        // Chemotaxis towards center for T-cells
        if (a.type === 'cd8_tcell') {
          const dx = centerX - a.x;
          const dy = centerY - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const chemotaxisSpeed = (stingBoost ? 0.35 : 0.18) / Math.max(dist, 10);
          a.vx += dx * chemotaxisSpeed;
          a.vy += dy * chemotaxisSpeed;

          // Drag / speed cap
          const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
          if (speed > 2.2) {
            a.vx = (a.vx / speed) * 2.2;
            a.vy = (a.vy / speed) * 2.2;
          }
        }

        // Move
        a.x += a.vx;
        a.y += a.vy;

        // Boundary bounce
        if (a.x < a.radius) { a.x = a.radius; a.vx *= -1; }
        if (a.x > canvas.width - a.radius) { a.x = canvas.width - a.radius; a.vx *= -1; }
        if (a.y < a.radius) { a.y = a.radius; a.vy *= -1; }
        if (a.y > canvas.height - a.radius) { a.y = canvas.height - a.radius; a.vy *= -1; }

        // Interaction checks with neighbors
        for (let j = i + 1; j < agents.length; j++) {
          const b = agents[j];
          const cdx = b.x - a.x;
          const cdy = b.y - a.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < a.radius + b.radius + 6) {
            // Case 1: CD8+ T Cell meets Tumor Cell
            if (a.type === 'cd8_tcell' && b.type.startsWith('tumor')) {
              let canKill = false;

              if (b.type === 'tumor_sensitive') {
                canKill = a.exhaustion < 80;
              } else if (b.type === 'tumor_pdl1') {
                canKill = antiPd1Active && a.exhaustion < 80;
                if (!antiPd1Active) a.exhaustion += 2.5; // PD-1 engages brake
              } else if (b.type === 'tumor_b2m_null') {
                // Resistant unless BiTE is active!
                canKill = biteActive;
              }

              if (canKill) {
                b.health -= 35;
                if (b.health <= 0) {
                  lysisCountRef.current++;
                  // Render death spark
                  ctx.beginPath();
                  ctx.arc(b.x, b.y, 14, 0, Math.PI * 2);
                  ctx.fillStyle = 'rgba(244, 63, 94, 0.6)';
                  ctx.fill();
                }
              }
            }

            // Case 2: Treg or M2 TAM paralyzes CD8+ T Cell
            if ((a.type === 'treg' || a.type === 'm2_tam') && b.type === 'cd8_tcell') {
              if (!tregDepleted) {
                b.exhaustion = Math.min(100, b.exhaustion + 1.2);
              }
            }
          }
        }

        // Draw Agents
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);

        if (a.type === 'cd8_tcell') {
          const isExhausted = a.exhaustion > 70;
          ctx.fillStyle = isExhausted ? '#64748b' : '#38bdf8';
          ctx.shadowColor = isExhausted ? 'transparent' : '#0284c7';
          ctx.shadowBlur = 8;
        } else if (a.type === 'tumor_sensitive') {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#e11d48';
          ctx.shadowBlur = 6;
        } else if (a.type === 'tumor_pdl1') {
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#db2777';
          ctx.shadowBlur = 6;
        } else if (a.type === 'tumor_b2m_null') {
          ctx.fillStyle = '#a855f7'; // Purple escape clone
          ctx.shadowColor = '#9333ea';
          ctx.shadowBlur = 8;
        } else if (a.type === 'treg') {
          ctx.fillStyle = tregDepleted ? 'rgba(251, 113, 133, 0.2)' : '#fb7185';
          ctx.shadowBlur = 0;
        } else if (a.type === 'm2_tam') {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Keep surviving agents
        if (a.health > 0) {
          newAgents.push(a);
        }
      }

      agentsRef.current = newAgents;

      // Update counters every 15 frames
      if (frame % 15 === 0) {
        const tumors = newAgents.filter((a) => a.type.startsWith('tumor'));
        const b2m = newAgents.filter((a) => a.type === 'tumor_b2m_null');
        setStats({
          tumorCount: tumors.length,
          cd8Count: newAgents.filter((a) => a.type === 'cd8_tcell').length,
          tregCount: newAgents.filter((a) => a.type === 'treg' || a.type === 'm2_tam').length,
          lysisEvents: lysisCountRef.current,
          b2mEscapePct: tumors.length > 0 ? Math.round((b2m.length / tumors.length) * 100) : 0
        });
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, antiPd1Active, tregDepleted, biteActive, stingBoost]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Spatial Multi-Agent Tumor-Immune Co-Evolution Sandbox</h3>
            <p className="text-xs text-slate-400">
              Live biophysical agent simulation modeling chemotaxis, PD-1/PD-L1 exhaustion, B2M antigen-loss clonal selection, and therapeutic shocks.
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
            onClick={initAgents}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Colony
          </button>
          <button
            onClick={injectTILs}
            className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-950"
          >
            <Zap className="w-3.5 h-3.5" /> + Adoptive TIL Influx
          </button>
        </div>
      </div>

      {/* Live Agent Canvas */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          className="w-full h-[420px] block"
        />

        {/* Live HUD Counters */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur border border-slate-700/80 p-3 rounded-xl text-xs font-mono space-y-1.5">
          <div className="text-cyan-400 font-bold flex items-center justify-between gap-4">
            <span>CD8+ Effector Infiltrates:</span>
            <span className="text-white">{stats.cd8Count}</span>
          </div>
          <div className="text-rose-400 font-bold flex items-center justify-between gap-4">
            <span>Remaining Tumor Clones:</span>
            <span className="text-white">{stats.tumorCount}</span>
          </div>
          <div className="text-purple-400 font-bold flex items-center justify-between gap-4">
            <span>B2M-Null Escape Variant:</span>
            <span className="text-white">{stats.b2mEscapePct}%</span>
          </div>
          <div className="text-emerald-400 font-bold flex items-center justify-between gap-4 border-t border-slate-700/60 pt-1">
            <span>Total Lytic Events:</span>
            <span className="text-white">{stats.lysisEvents}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur border border-slate-700/80 p-2.5 rounded-xl text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> CD8+ T Cell
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Sensitive Tumor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> PD-L1+ Clone
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> B2M-Null Escape
          </span>
        </div>
      </div>

      {/* Intervention Shock Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <button
          onClick={() => setAntiPd1Active(!antiPd1Active)}
          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all space-y-1 ${
            antiPd1Active
              ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold">Anti-PD-1 mAb</span>
            <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-700">
              {antiPd1Active ? 'INFUSED' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Unblocks cytotoxic killing of PD-L1+ pink tumor variants.
          </p>
        </button>

        <button
          onClick={() => setBiteActive(!biteActive)}
          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all space-y-1 ${
            biteActive
              ? 'bg-purple-500/10 border-purple-500/60 text-purple-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold">Bispecific BiTE Engager</span>
            <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-700">
              {biteActive ? 'INFUSED' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Forces MHC-independent killing of purple B2M-null escape clones.
          </p>
        </button>

        <button
          onClick={() => setTregDepleted(!tregDepleted)}
          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all space-y-1 ${
            tregDepleted
              ? 'bg-rose-500/10 border-rose-500/60 text-rose-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold">Anti-CTLA-4 / Treg Depletion</span>
            <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-700">
              {tregDepleted ? 'DEPLETED' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Neutralizes Treg suppressive contact inhibition on CD8+ T cells.
          </p>
        </button>

        <button
          onClick={() => setStingBoost(!stingBoost)}
          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all space-y-1 ${
            stingBoost
              ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold">STING Agonist Shock</span>
            <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-700">
              {stingBoost ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Drives massive CXCL9/10 chemotactic acceleration toward the tumor core.
          </p>
        </button>
      </div>
    </div>
  );
};
