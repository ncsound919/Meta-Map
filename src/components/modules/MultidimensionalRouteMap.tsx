import React from 'react';
import { RouteFlowStep, OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { GitMerge, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

interface MultidimensionalRouteMapProps {
  routes: RouteFlowStep[];
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const MultidimensionalRouteMap: React.FC<MultidimensionalRouteMapProps> = ({
  routes,
  selectedOrgan,
  selectedCancerType
}) => {
  const filteredRoutes = routes.filter((r) => {
    const matchesOrgan = selectedOrgan === 'all' || r.destinationOrgan === selectedOrgan;
    const matchesCancer = selectedCancerType === 'all' || r.sourcePrimary === selectedCancerType;
    return matchesOrgan && matchesCancer;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Multidimensional Metastatic Dissemination Route Maps
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Circulatory, lymphatic, and peritoneal flow dynamics linking primary cancer origins to distant organ preferences
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRoutes.map((rt, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Primary Cancer Origin */}
              <div className="md:col-span-3 bg-slate-850 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Primary Origin</span>
                <span className="font-bold text-sm text-white">{rt.sourcePrimary}</span>
              </div>

              {/* Pathway Dissemination Channel */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-2 text-center bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
                  <span>{rt.pathway}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">{rt.frequencyPct}% Frequency</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3 h-3 text-slate-400" /> {rt.medianLatencyYears} Years Latency
                  </span>
                </div>
              </div>

              {/* Destination Organ */}
              <div className="md:col-span-2 bg-slate-850 p-3 rounded-lg border border-cyan-800/50 text-center">
                <span className="text-[10px] text-cyan-400 font-mono block">Target Organ Niche</span>
                <span className="font-bold text-sm text-cyan-200 capitalize">
                  {rt.destinationOrgan.replace('_', ' ')}
                </span>
              </div>

              {/* Key Adhesion Molecules */}
              <div className="md:col-span-3 bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block font-mono mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-cyan-400" /> Adhesion / Tropism Anchors:
                </span>
                <div className="flex flex-wrap gap-1">
                  {rt.keyAdhesionMolecules.map((mol, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 text-[10px] font-mono">
                      {mol}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs bg-slate-900 rounded-xl border border-slate-800">
            No dissemination routes match the selected organ or cancer filters.
          </div>
        )}
      </div>
    </div>
  );
};
