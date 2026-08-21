import React, { useState } from 'react';
import { Database, Filter, Info } from 'lucide-react';
import { OrganSite } from '../../types/metastasis';

interface MultiOmicMatrixHeatmapProps {
  selectedOrgan: OrganSite | 'all';
}

export const MultiOmicMatrixHeatmap: React.FC<MultiOmicMatrixHeatmapProps> = ({
  selectedOrgan
}) => {
  const [activeOmic, setActiveOmic] = useState<'all' | 'RNA' | 'scATAC' | 'Proteomics' | 'Metabolomics'>('all');

  // Matrix Feature Rows across Organ Sites
  const matrixRows = [
    { gene: 'RANKL', layer: 'RNA', bone: 3.82, liver: 0.45, brain: 0.12, lung: 1.15, category: 'Bone Matrix Remodeling' },
    { gene: 'c-MET', layer: 'RNA', bone: 1.20, liver: 4.12, brain: 2.80, lung: 2.10, category: 'Liver HGF Cross-talk' },
    { gene: 'L1CAM', layer: 'RNA', bone: 0.85, liver: 1.10, brain: 4.50, lung: 2.40, category: 'Brain BBB Passage' },
    { gene: 'CXCR4', layer: 'scATAC', bone: 4.10, liver: 2.30, brain: 1.90, lung: 3.80, category: 'Endothelial Homing Peak' },
    { gene: 'TEAD4 Peak', layer: 'scATAC', bone: 4.80, liver: 1.50, brain: 2.10, lung: 1.80, category: 'Osteoclast Enhancer' },
    { gene: 'p-STAT3', layer: 'Proteomics', bone: 2.10, liver: 3.80, brain: 2.90, lung: 1.90, category: 'Kupffer Immunosuppression' },
    { gene: 'E-Cadherin', layer: 'Proteomics', bone: -3.50, liver: -1.20, brain: -2.90, lung: -2.10, category: 'EMT Loss' },
    { gene: 'Hydroxyproline', layer: 'Metabolomics', bone: 4.20, liver: 0.60, brain: 0.10, lung: 0.80, category: 'Bone Collagen Breakdown' },
    { gene: 'L-Lactate', layer: 'Metabolomics', bone: 2.80, liver: 3.50, brain: 2.70, lung: 3.10, category: 'Hypoxic Niche Adaptation' }
  ];

  const filteredRows = matrixRows.filter((r) => {
    return activeOmic === 'all' || r.layer === activeOmic;
  });

  const getHeatmapBg = (val: number) => {
    if (val > 3.0) return 'bg-cyan-600 text-white font-bold';
    if (val > 1.5) return 'bg-cyan-800 text-cyan-200';
    if (val > 0) return 'bg-slate-800 text-cyan-300';
    if (val < -2.0) return 'bg-rose-700 text-white font-bold';
    return 'bg-rose-950 text-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Multi-Omic Matrix & Heatmap Comparison (Caleydo / Gitools Layout)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-layer correlation of Bulk RNA, scATAC-seq, Proteomics, and XCMS Metabolomics across metastatic organ niches
          </p>
        </div>

        {/* Omic Layer Selector */}
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <span className="text-slate-400">Omic Layer:</span>
          {(['all', 'RNA', 'scATAC', 'Proteomics', 'Metabolomics'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveOmic(layer)}
              className={`px-2 py-1 rounded capitalize transition-colors ${
                activeOmic === layer ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase font-mono text-slate-400 bg-slate-850">
              <th className="p-3 rounded-l">Molecular Feature</th>
              <th className="p-3">Omic Layer</th>
              <th className="p-3">Functional Category</th>
              <th className={`p-3 text-center ${selectedOrgan === 'bone' ? 'bg-cyan-950 text-cyan-300 font-bold' : ''}`}>
                Bone Met (Log2FC)
              </th>
              <th className={`p-3 text-center ${selectedOrgan === 'liver' ? 'bg-cyan-950 text-cyan-300 font-bold' : ''}`}>
                Liver Met (Log2FC)
              </th>
              <th className={`p-3 text-center ${selectedOrgan === 'brain' ? 'bg-cyan-950 text-cyan-300 font-bold' : ''}`}>
                Brain Met (Log2FC)
              </th>
              <th className={`p-3 text-center ${selectedOrgan === 'lung' ? 'bg-cyan-950 text-cyan-300 font-bold' : ''} rounded-r`}>
                Lung Met (Log2FC)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-850 transition-colors">
                <td className="p-3 font-bold text-slate-100">{row.gene}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-300">
                    {row.layer}
                  </span>
                </td>
                <td className="p-3 text-slate-400 text-xs font-sans">{row.category}</td>
                <td className="p-3 text-center">
                  <span className={`inline-block w-16 py-1 rounded text-xs font-bold ${getHeatmapBg(row.bone)}`}>
                    {row.bone > 0 ? `+${row.bone}` : row.bone}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block w-16 py-1 rounded text-xs font-bold ${getHeatmapBg(row.liver)}`}>
                    {row.liver > 0 ? `+${row.liver}` : row.liver}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block w-16 py-1 rounded text-xs font-bold ${getHeatmapBg(row.brain)}`}>
                    {row.brain > 0 ? `+${row.brain}` : row.brain}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block w-16 py-1 rounded text-xs font-bold ${getHeatmapBg(row.lung)}`}>
                    {row.lung > 0 ? `+${row.lung}` : row.lung}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-lg border border-slate-800">
        <Info className="w-4 h-4 text-cyan-400" />
        <span>
          Heatmap intensity represents differential shift (Log2 Fold Change or Z-score) between metastatic niche and paired primary tissue.
        </span>
      </div>
    </div>
  );
};
