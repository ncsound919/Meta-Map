import React, { useState } from 'react';
import { WorkflowPipeline, WorkflowRunResult } from '../../types/metastasis';
import { Play, CheckCircle2, Terminal, Clock, FileCheck, RefreshCw } from 'lucide-react';

interface WorkflowEngineProps {
  pipelines: WorkflowPipeline[];
}

export const WorkflowEngine: React.FC<WorkflowEngineProps> = ({ pipelines }) => {
  const [selectedPipe, setSelectedPipe] = useState<WorkflowPipeline>(pipelines[0] || null);
  const [activeResult, setActiveResult] = useState<WorkflowRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunPipeline = async () => {
    if (!selectedPipe) return;
    setIsRunning(true);
    setActiveResult({
      runId: `run-${Date.now()}`,
      pipelineId: selectedPipe.id,
      status: 'running',
      progress: 25,
      logs: [
        `[${new Date().toLocaleTimeString()}] Starting Galaxy-style orchestration engine...`,
        `[${new Date().toLocaleTimeString()}] Fetching MetMap & TCGA multi-omics input streams...`,
        `[${new Date().toLocaleTimeString()}] Step 1/4: ${selectedPipe.steps[0]}`
      ]
    });

    try {
      const res = await fetch('/api/metastasis/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineId: selectedPipe.id })
      });
      const data = await res.json();

      setTimeout(() => {
        setActiveResult(data);
        setIsRunning(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Cloud Workflow & Pipeline Engine (Galaxy / DNAnexus Style)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Standardized, reproducible pipelines for multi-omic batch processing, single-cell dormancy scoring, and model selection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Selection List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Available Metastasis Workflow Templates
          </h3>
          {pipelines.map((pipe) => {
            const isSelected = selectedPipe?.id === pipe.id;
            return (
              <div
                key={pipe.id}
                onClick={() => setSelectedPipe(pipe)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 ring-1 ring-cyan-500/40 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-100">{pipe.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800">
                    {pipe.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                  {pipe.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> ~{pipe.estimatedRuntimeSec}s runtime
                  </span>
                  <span className="text-cyan-400 font-bold">{pipe.steps.length} Steps</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pipeline Execution & Terminal Output */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          {selectedPipe && (
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedPipe.name}</h3>
                  <span className="text-xs text-slate-400">{selectedPipe.category} Template</span>
                </div>
                <button
                  onClick={handleRunPipeline}
                  disabled={isRunning}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      Run Workflow
                    </>
                  )}
                </button>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-1.5 bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs mb-4">
                <span className="text-slate-300 font-semibold block mb-1">Pipeline Workflow Steps:</span>
                {selectedPipe.steps.map((st, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>

              {/* Terminal Logs & Output */}
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800/80 pb-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cloud Terminal Execution Log</span>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto text-[11px] text-slate-300">
                  {activeResult ? (
                    activeResult.logs.map((lg, i) => (
                      <div key={i} className="text-cyan-300">
                        {lg}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-600 py-4 text-center">
                      Click "Run Workflow" to execute pipeline.
                    </div>
                  )}
                </div>

                {activeResult?.summaryMetrics && (
                  <div className="mt-3 border-t border-slate-800 pt-2 text-xs text-emerald-400 font-sans">
                    <span className="font-bold flex items-center gap-1 mb-1">
                      <FileCheck className="w-4 h-4" /> Execution Summary:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-200">
                      {Object.entries(activeResult.summaryMetrics).map(([k, v]) => (
                        <div key={k} className="bg-slate-900 p-1.5 rounded border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">{k}</span>
                          <span className="font-bold text-cyan-300">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
