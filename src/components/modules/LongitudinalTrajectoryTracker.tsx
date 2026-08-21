import React, { useState } from 'react';
import { LineageClonalNode, OrganSite } from '../../types/metastasis';
import { GitBranch, Clock, ArrowRight, Dna } from 'lucide-react';

interface LongitudinalTrajectoryTrackerProps {
  clones: LineageClonalNode[];
  selectedOrgan: OrganSite | 'all';
}

export const LongitudinalTrajectoryTracker: React.FC<LongitudinalTrajectoryTrackerProps> = ({
  clones,
  selectedOrgan
}) => {
  const [selectedClone, setSelectedClone] = useState<LineageClonalNode>(clones[0] || null);

  const filteredClones = clones.filter((c) => {
    if (selectedOrgan === 'all') return true;
    return c.metastaticRoutes.some(r => r.targetOrgan === selectedOrgan);
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Longitudinal Trajectory & Lineage Tracking (In Vivo Barcoding)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Clonal branching, timing, and organ destination routes derived from high-throughput cellular barcoding (MetMap paradigm)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Branching Clonal Tree Visualizer */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2 mb-4">
            <Dna className="w-4 h-4 text-cyan-400" />
            Subclonal Branching & Migration Tree
          </h3>

          <div className="space-y-3">
            {filteredClones.map((clone) => {
              const isSelected = selectedClone?.id === clone.id;
              const isChild = !!clone.parentCloneId;

              return (
                <div
                  key={clone.id}
                  onClick={() => setSelectedClone(clone)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isChild ? 'ml-6 border-l-4 border-l-cyan-500' : ''
                  } ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 ring-1 ring-cyan-500/40 shadow-md'
                      : 'bg-slate-850/70 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{clone.cloneName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono border border-slate-800">
                        {clone.frequencyPrimary}% Primary Freq
                      </span>
                    </div>
                  </div>

                  {/* Routes */}
                  <div className="space-y-1.5 mb-2">
                    {clone.metastaticRoutes.map((rt, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded border border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Target Organ:</span>
                          <span className="font-bold text-cyan-300 capitalize">{rt.targetOrgan.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono">
                          <span className="text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {rt.timingWeeks} wks
                          </span>
                          <span className="text-emerald-400 font-bold">
                            Score: {rt.migrationScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono">
                    Acquired Mutations: <span className="text-slate-300">{clone.acquiredMutations.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Clonal Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          {selectedClone ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedClone.id}</span>
                <h3 className="font-bold text-base text-white mt-1">{selectedClone.cloneName}</h3>
              </div>

              <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ancestral Level:</span>
                  <span className="font-bold text-slate-200">
                    {selectedClone.parentCloneId ? `Derived Subclone (${selectedClone.parentCloneId})` : 'Trunk Ancestor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Tumor Clonal Proportion:</span>
                  <span className="font-mono font-bold text-cyan-400">{selectedClone.frequencyPrimary}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2">Dissemination Destinations</h4>
                <div className="space-y-2">
                  {selectedClone.metastaticRoutes.map((rt, idx) => (
                    <div key={idx} className="p-3 bg-slate-850 rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 capitalize">{rt.targetOrgan.replace('_', ' ')} Niche</span>
                        <span className="text-emerald-400 font-mono font-bold">In Vivo Potential: {rt.migrationScore}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>Latency to Outgrowth:</span>
                        <span className="text-amber-300 font-mono font-bold">{rt.timingWeeks} Weeks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a barcoded subclone to inspect lineage routes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
