import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Shield,
  Layers
} from 'lucide-react';
import { OrganSite } from '../../../types/metastasis';

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 360;

interface LiveNicheCanvasProps {
  selectedOrgan: string;
  onStatsUpdate?: (stats: { dormant: number; active: number; stroma: number; ecmStiffness: number }) => void;
}

interface CellAgent {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'dormant_dtc' | 'active_met' | 'stroma' | 'immune' | 'vessel';
  energy: number;
  age: number;
  state: string;
}

export const LiveNicheCanvas: React.FC<LiveNicheCanvasProps> = ({
  selectedOrgan,
  onStatsUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [cells, setCells] = useState<CellAgent[]>([]);
  const [therapyActive, setTherapyActive] = useState<boolean>(false);
  const [inflammationFlare, setInflammationFlare] = useState<boolean>(false);
  const [stats, setStats] = useState({ dormant: 12, active: 3, stroma: 24, ecmStiffness: 5.2 });

  const interventionRef = useRef({ therapyActive, inflammationFlare });

  useEffect(() => {
    interventionRef.current = { therapyActive, inflammationFlare };
  }, [therapyActive, inflammationFlare]);

  // Initialize cells based on selected organ
  useEffect(() => {
    const initialCells: CellAgent[] = [];

    // Vessel / boundary markers
    for (let i = 0; i < 6; i++) {
      initialCells.push({
        id: `vessel-${i}`,
        x: 40 + i * 110,
        y: 40 + Math.sin(i) * 15,
        vx: 0,
        vy: 0,
        radius: 14,
        type: 'vessel',
        energy: 100,
        age: 0,
        state: 'Endothelial Capillary'
      });
    }

    // Resident stroma (organ specific)
    const stromaCount = 20;
    for (let i = 0; i < stromaCount; i++) {
      initialCells.push({
        id: `stroma-${i}`,
        x: Math.random() * 600 + 50,
        y: Math.random() * 320 + 80,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 8 + Math.random() * 5,
        type: 'stroma',
        energy: 100,
        age: 0,
        state: selectedOrgan === 'bone' ? 'Osteoblast/Osteoclast' :
               selectedOrgan === 'brain' ? 'Reactive Astrocyte' :
               selectedOrgan === 'liver' ? 'Hepatic Stellate / Kupffer' :
               'Type II Pneumocyte / Macrophage'
      });
    }

    // Dormant DTCs
    for (let i = 0; i < 10; i++) {
      initialCells.push({
        id: `dtc-${i}`,
        x: Math.random() * 500 + 100,
        y: Math.random() * 260 + 90,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 6,
        type: 'dormant_dtc',
        energy: 80,
        age: 0,
        state: 'G0/G1 Quiescent (p27+)'
      });
    }

    // Active Micrometastases
    for (let i = 0; i < 2; i++) {
      initialCells.push({
        id: `active-${i}`,
        x: Math.random() * 400 + 150,
        y: Math.random() * 200 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 9,
        type: 'active_met',
        energy: 95,
        age: 0,
        state: 'Ki-67+ Proliferating'
      });
    }

    setCells(initialCells);
  }, [selectedOrgan]);

  // Main Canvas Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isRunning) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Extracellular Matrix Fibers & Gradient Field
        ctx.strokeStyle = selectedOrgan === 'bone' ? 'rgba(245, 158, 11, 0.15)' :
                          selectedOrgan === 'brain' ? 'rgba(99, 102, 241, 0.15)' :
                          selectedOrgan === 'liver' ? 'rgba(16, 185, 129, 0.15)' :
                          'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + Math.sin(Date.now() * 0.001 + x) * 10, canvas.height);
          ctx.stroke();
        }

        // Draw Capillary Lumen Bar at Top
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.fillRect(0, 20, canvas.width, 40);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 60);
        ctx.lineTo(canvas.width, 60);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.font = '10px monospace';
        ctx.fillText('ENDOTHELIAL EXTRAVASATION INTERFACE / VASCULAR LUMEN', 20, 36);

        // Update and Render Cells
        setCells((prevCells) => {
          let dormantCount = 0;
          let activeCount = 0;
          let stromaCount = 0;

          const updated = prevCells.map((cell) => {
            let nextX = cell.x + cell.vx;
            let nextY = cell.y + cell.vy;
            let nextType = cell.type;
            let nextState = cell.state;
            let nextRadius = cell.radius;

            // Boundary collision
            if (nextX < 15 || nextX > canvas.width - 15) cell.vx *= -1;
            if (nextY < 65 || nextY > canvas.height - 15) cell.vy *= -1;

            // Inflammation trigger: dormant cells awaken
            if (interventionRef.current.inflammationFlare && cell.type === 'dormant_dtc' && Math.random() < 0.008) {
              nextType = 'active_met';
              nextState = 'Awakened (Inflammation Flare)';
              nextRadius = 9;
            }

            // Therapy trigger: active metastases arrested or cleared
            if (interventionRef.current.therapyActive && cell.type === 'active_met' && Math.random() < 0.012) {
              nextType = 'dormant_dtc';
              nextState = 'Arrested by Interception Rx';
              nextRadius = 6;
            }

            if (nextType === 'dormant_dtc') dormantCount++;
            if (nextType === 'active_met') activeCount++;
            if (nextType === 'stroma') stromaCount++;

            // Draw Cell
            ctx.save();
            ctx.beginPath();
            ctx.arc(nextX, nextY, nextRadius, 0, Math.PI * 2);

            if (nextType === 'dormant_dtc') {
              ctx.fillStyle = '#38bdf8';
              ctx.shadowColor = '#38bdf8';
              ctx.shadowBlur = 10;
              ctx.fill();

              // Halo
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
              ctx.stroke();
            } else if (nextType === 'active_met') {
              ctx.fillStyle = '#f43f5e';
              ctx.shadowColor = '#f43f5e';
              ctx.shadowBlur = 15;
              ctx.fill();

              // Pulsing halo
              ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
              ctx.lineWidth = 2;
              ctx.stroke();
            } else if (nextType === 'stroma') {
              ctx.fillStyle = selectedOrgan === 'bone' ? '#f59e0b' :
                              selectedOrgan === 'brain' ? '#818cf8' :
                              selectedOrgan === 'liver' ? '#10b981' :
                              '#a855f7';
              ctx.shadowColor = ctx.fillStyle;
              ctx.shadowBlur = 4;
              ctx.fill();
            } else if (nextType === 'vessel') {
              ctx.fillStyle = '#ef4444';
              ctx.fill();
            }

            ctx.restore();

            return {
              ...cell,
              x: Math.max(15, Math.min(canvas.width - 15, nextX)),
              y: Math.max(65, Math.min(canvas.height - 15, nextY)),
              type: nextType,
              state: nextState,
              radius: nextRadius
            };
          });

          const currentStiffness = selectedOrgan === 'bone' ? 150 :
                                  selectedOrgan === 'brain' ? 0.6 :
                                  selectedOrgan === 'liver' ? 6.5 : 3.8;

          setStats({
            dormant: dormantCount,
            active: activeCount,
            stroma: stromaCount,
            ecmStiffness: currentStiffness
          });

          if (onStatsUpdate) {
            onStatsUpdate({
              dormant: dormantCount,
              active: activeCount,
              stroma: stromaCount,
              ecmStiffness: currentStiffness
            });
          }

          return updated;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, selectedOrgan]); // Removed therapyActive and inflammationFlare

  const handleAddDtc = () => {
    setCells((prev) => [
      ...prev,
      {
        id: `dtc-${Date.now()}-${Math.random()}`,
        x: Math.random() * 500 + 100,
        y: Math.random() * 200 + 80,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 6,
        type: 'dormant_dtc',
        energy: 80,
        age: 0,
        state: 'Extravasated DTC'
      }
    ]);
  };

  const handleResetCanvas = () => {
    setTherapyActive(false);
    setInflammationFlare(false);
    // trigger re-init
    setCells((prev) => prev.filter(c => c.type === 'vessel' || c.type === 'stroma'));
    for (let i = 0; i < 8; i++) {
      handleAddDtc();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Real-Time Cellular Niche Dynamics Canvas
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                LIVE PHYSICS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 2D multi-agent simulation of DTC arrest, stromal matrix remodeling, and dormancy awakening.
            </p>
          </div>
        </div>

        {/* Live Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span> Dormant DTC ({stats.dormant})
          </span>
          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span> Active Met ({stats.active})
          </span>
          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Stroma ({stats.stroma})
          </span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full block"
          style={{ height: 'auto' }}
        />

        {/* Overlay Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-md">
            Organ Niche: <strong className="text-white uppercase">{selectedOrgan}</strong>
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-md">
            Tissue Stiffness: <strong className="text-cyan-300">{stats.ecmStiffness} kPa</strong>
          </span>
          {therapyActive && (
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500 backdrop-blur-md flex items-center gap-1 animate-pulse">
              <Shield className="w-3 h-3" /> Niche Interception Active
            </span>
          )}
          {inflammationFlare && (
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-950/90 text-rose-300 border border-rose-500 backdrop-blur-md flex items-center gap-1 animate-bounce">
              <Flame className="w-3 h-3" /> Inflammatory Surge
            </span>
          )}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isRunning
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause Loop' : 'Resume Loop'}
          </button>

          <button
            type="button"
            onClick={handleAddDtc}
            className="px-3 py-1.5 rounded-lg border border-cyan-700/80 bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Inject Extravasating DTC
          </button>

          <button
            type="button"
            aria-pressed={inflammationFlare}
            onClick={() => setInflammationFlare(!inflammationFlare)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              inflammationFlare
                ? 'bg-rose-950 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            {inflammationFlare ? 'Inflammation Active' : 'Trigger Cytokine Surge'}
          </button>

          <button
            type="button"
            aria-pressed={therapyActive}
            onClick={() => setTherapyActive(!therapyActive)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              therapyActive
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            {therapyActive ? 'Rx Interception Active' : 'Apply Niche-Disruptor Rx'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetCanvas}
          className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Niche
        </button>
      </div>
    </div>
  );
};
