import React, { useState } from 'react';
import { MetMapCellLine, OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { Globe, Search, ShieldAlert, Dna, Activity, ChevronRight, Pill } from 'lucide-react';

interface MetastasisAtlasBrowserProps {
  cellLines: MetMapCellLine[];
  selectedOrgan: OrganSite | 'all';
  setSelectedOrgan: (organ: OrganSite | 'all') => void;
  selectedCancerType: PrimaryCancerType | 'all';
}

export const MetastasisAtlasBrowser: React.FC<MetastasisAtlasBrowserProps> = ({
  cellLines,
  selectedOrgan,
  setSelectedOrgan,
  selectedCancerType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCellLine, setSelectedCellLine] = useState<MetMapCellLine | null>(
    cellLines[0] || null
  );

  // Filter cell lines
  const filteredLines = cellLines.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.driverMutations.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.cancerType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrgan = selectedOrgan === 'all' || c.organTropismScores[selectedOrgan] >= 30;
    const matchesCancer = selectedCancerType === 'all' || c.cancerType === selectedCancerType;

    return matchesSearch && matchesOrgan && matchesCancer;
  });

  const organsList: Array<{ id: OrganSite; name: string; color: string; desc: string }> = [
    { id: 'bone', name: 'Bone Niche', color: 'from-amber-600 to-yellow-500', desc: 'Osteolytic / Osteoblastic remodeling, RANKL/OPG signaling' },
    { id: 'liver', name: 'Liver Niche', color: 'from-emerald-600 to-teal-500', desc: 'Kupffer cell crosstalk, HGF/c-MET, fatty acid oxidation' },
    { id: 'brain', name: 'Brain Niche', color: 'from-purple-600 to-indigo-500', desc: 'Blood-Brain barrier co-option, astrocyte interactions, L1CAM' },
    { id: 'lung', name: 'Lung Niche', color: 'from-cyan-600 to-blue-500', desc: 'Capillary entrapment, fibronectin deposition, CXCR4/CXCL12' },
    { id: 'lymph_node', name: 'Lymph Node', color: 'from-pink-600 to-rose-500', desc: 'Sentinel lymphatic drainage, immune tolerance priming' },
    { id: 'peritoneum', name: 'Peritoneum', color: 'from-orange-600 to-amber-500', desc: 'Direct mesothelial seeding, ascites fluid dynamics' }
  ];

  return (
    <div className="space-y-6">
      {/* Organ Tropism Map Selection Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Interactive Organotropic Metastasis Atlas
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Select a target organ niche to view specific metastasis potential
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {organsList.map((org) => {
            const isSelected = selectedOrgan === org.id;
            return (
              <button
                key={org.id}
                onClick={() => setSelectedOrgan(isSelected ? 'all' : org.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/40 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${org.color} flex items-center justify-center text-white mb-2 shadow-sm`}>
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-100 mb-0.5">{org.name}</h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {org.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: MetMap Dataset Search & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MetMap Cell Line List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Dna className="w-4 h-4 text-cyan-400" />
                MetMap Metastatic Cell Line Potential
              </h3>
              <p className="text-xs text-slate-400">
                In vivo barcoded metastatic potential scores across organ sites
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search cell line, mutation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full sm:w-48"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredLines.map((line) => {
              const isSelected = selectedCellLine?.id === line.id;
              return (
                <div
                  key={line.id}
                  onClick={() => setSelectedCellLine(line)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/30'
                      : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{line.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                        {line.cancerType}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      line.emtStatus === 'Mesenchymal'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : line.emtStatus === 'Hybrid EMT'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}>
                      {line.emtStatus}
                    </span>
                  </div>

                  {/* Organ Scores Mini Bars */}
                  <div className="grid grid-cols-6 gap-1.5 text-[9px] mb-2">
                    {(['bone', 'liver', 'brain', 'lung', 'lymph_node', 'peritoneum'] as OrganSite[]).map((org) => {
                      const score = line.organTropismScores[org] || 0;
                      return (
                        <div key={org} className="bg-slate-900 p-1 rounded text-center border border-slate-800">
                          <span className="block text-slate-400 capitalize truncate">{org.replace('_', ' ')}</span>
                          <span className={`font-bold ${score >= 70 ? 'text-cyan-400' : score >= 40 ? 'text-amber-400' : 'text-slate-500'}`}>
                            {score}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span className="truncate max-w-[280px]">
                      Drivers: <span className="text-slate-300 font-mono text-[10px]">{line.driverMutations.join(', ')}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              );
            })}

            {filteredLines.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No MetMap cell lines match the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* MetMap Cell Line Deep Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          {selectedCellLine ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{selectedCellLine.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {selectedCellLine.barcodedLineageCount} Barcoded Lineages
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Origin: <span className="text-slate-200">{selectedCellLine.primarySite}</span> ({selectedCellLine.cancerType})
                </p>
              </div>

              {/* Organ Tropism Scores Chart */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Metastatic Tropism Profile (0-100 Score)
                </h4>
                <div className="space-y-2 bg-slate-850 p-3 rounded-lg border border-slate-800">
                  {(['bone', 'liver', 'brain', 'lung', 'lymph_node', 'peritoneum'] as OrganSite[]).map((org) => {
                    const score = selectedCellLine.organTropismScores[org] || 0;
                    return (
                      <div key={org} className="space-y-0.5">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize font-medium text-slate-300">{org.replace('_', ' ')}</span>
                          <span className="font-mono text-cyan-400 font-bold">{score} / 100</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              score >= 80
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                : score >= 50
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : 'bg-slate-700'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Driver Mutations */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Key Driver Alterations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCellLine.driverMutations.map((mut, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                      {mut}
                    </span>
                  ))}
                </div>
              </div>

              {/* CeDR Drug Sensitivities */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-emerald-400" />
                  CeDR Metastatic Drug Vulnerabilities
                </h4>
                <div className="space-y-1.5">
                  {selectedCellLine.cedrDrugSensitivities.map((ds, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-850 border border-slate-800 text-xs">
                      <div>
                        <span className="font-medium text-slate-200 block">{ds.drug}</span>
                        <span className="text-[10px] text-slate-400">Target: {ds.target}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400">{ds.ic50_uM} µM</span>
                        <span className="text-[9px] block text-slate-500">IC50</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a cell line from the MetMap atlas to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
