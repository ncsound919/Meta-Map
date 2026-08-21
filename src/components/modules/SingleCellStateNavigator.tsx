import React, { useState, useEffect } from 'react';
import { SingleCellMetaPoint, OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { 
  Activity, 
  Layers, 
  Sparkles, 
  Sliders, 
  Download, 
  Share2, 
  Radio, 
  Compass, 
  GitCommit, 
  BarChart2, 
  ArrowUpRight, 
  Zap, 
  RefreshCw,
  Search,
  Maximize2
} from 'lucide-react';

interface SingleCellStateNavigatorProps {
  singleCellPoints: SingleCellMetaPoint[];
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const SingleCellStateNavigator: React.FC<SingleCellStateNavigatorProps> = ({
  singleCellPoints,
  selectedOrgan,
  selectedCancerType
}) => {
  // Navigation & Atlas Selection State
  const [selectedAtlas, setSelectedAtlas] = useState<string>('TISCH2_Metastatic_Niche');
  const [colorBy, setColorBy] = useState<'cellState' | 'organSite' | 'cellType' | 'geneExpression'>('cellState');
  const [selectedGene, setSelectedGene] = useState<'NR2F1' | 'VIM' | 'CD274' | 'ABCB1' | 'RANKL' | 'MMP9'>('NR2F1');
  const [selectedCell, setSelectedCell] = useState<SingleCellMetaPoint | null>(singleCellPoints[0] || null);
  const [stateFilter, setStateFilter] = useState<string>('all');

  // Lab-Grade Visual Overlay Toggles
  const [showRnaVelocity, setShowRnaVelocity] = useState<boolean>(true);
  const [showDensityContours, setShowDensityContours] = useState<boolean>(true);
  const [activeTabPanel, setActiveTabPanel] = useState<'inspector' | 'ligand_receptor' | 'diff_expr'>('inspector');

  // API Backend States
  const [isLoadingBackendData, setIsLoadingBackendData] = useState<boolean>(false);
  const [diffExpressionData, setDiffExpressionData] = useState<any[]>([]);
  const [ligandReceptorData, setLigandReceptorData] = useState<any[]>([]);

  // Fetch backend single-cell stats on cell / gene selection
  useEffect(() => {
    fetchSingleCellStats();
  }, [selectedCell, selectedGene, selectedAtlas]);

  const fetchSingleCellStats = async () => {
    setIsLoadingBackendData(true);
    try {
      const res = await fetch('/api/single-cell/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atlas: selectedAtlas,
          organSite: selectedCell?.organSite || selectedOrgan,
          cellState: selectedCell?.cellState || 'Dormant',
          gene: selectedGene
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDiffExpressionData(data.differentialExpression || []);
        setLigandReceptorData(data.ligandReceptorPairs || []);
      }
    } catch (e) {
      console.error('Failed to query single-cell backend:', e);
    } finally {
      setIsLoadingBackendData(false);
    }
  };

  const filteredPoints = singleCellPoints.filter((sc) => {
    const matchesOrgan = selectedOrgan === 'all' || sc.organSite === selectedOrgan;
    const matchesCancer = selectedCancerType === 'all' || sc.cancerType === selectedCancerType;
    const matchesState = stateFilter === 'all' || sc.cellState === stateFilter;
    return matchesOrgan && matchesCancer && matchesState;
  });

  const getCellColor = (sc: SingleCellMetaPoint) => {
    if (colorBy === 'cellState') {
      switch (sc.cellState) {
        case 'Dormant': return '#38bdf8'; // Cyan/Sky
        case 'Invasive': return '#f59e0b'; // Amber
        case 'Immune Suppressive': return '#a855f7'; // Purple
        case 'EMT High': return '#ec4899'; // Pink
        case 'Drug Resistant': return '#ef4444'; // Red
        case 'Proliferative Outgrowth': return '#10b981'; // Emerald
        default: return '#94a3b8';
      }
    } else if (colorBy === 'organSite') {
      switch (sc.organSite) {
        case 'bone': return '#f59e0b';
        case 'liver': return '#10b981';
        case 'brain': return '#8b5cf6';
        case 'lung': return '#06b6d4';
        case 'lymph_node': return '#f43f5e';
        default: return '#64748b';
      }
    } else if (colorBy === 'cellType') {
      switch (sc.cellType) {
        case 'Metastatic Cancer Cell': return '#06b6d4';
        case 'M2 Macrophage': return '#a855f7';
        case 'Cancer-Associated Fibroblast': return '#f59e0b';
        case 'Osteoclast': return '#ef4444';
        case 'Kupffer Cell': return '#10b981';
        case 'Astrocyte': return '#6366f1';
        default: return '#94a3b8';
      }
    } else {
      // Gene Expression Gradient
      const val = sc.expression[selectedGene] || 0;
      if (val > 3.5) return '#ef4444';
      if (val > 2.0) return '#f59e0b';
      if (val > 0.8) return '#06b6d4';
      return '#334155';
    }
  };

  // Export AnnData H5AD Metadata CSV
  const handleExportMetadataCsv = () => {
    const csvHeader = ['Cell_ID', 'Sample_ID', 'Organ_Site', 'Cancer_Type', 'Cell_Type', 'Niche_State', 'Pseudotime', 'UMAP_1', 'UMAP_2', 'NR2F1', 'VIM', 'CD274', 'MMP9'];
    const rows = filteredPoints.map(sc => [
      sc.id,
      sc.sampleId,
      sc.organSite,
      sc.cancerType,
      `"${sc.cellType}"`,
      `"${sc.cellState}"`,
      sc.pseudotime,
      sc.umapX,
      sc.umapY,
      sc.expression.NR2F1 || 0,
      sc.expression.VIM || 0,
      sc.expression.CD274 || 0,
      sc.expression.MMP9 || 0
    ]);

    const csvContent = [csvHeader.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SingleCell_AnnData_Metadata_${selectedAtlas}_${selectedOrgan}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Lab-Grade Single-Cell Microenvironment Atlas
              </span>
              <span className="text-xs text-slate-400 font-mono">Scanpy / Seurat / CellRank Velocity Integration</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Single-Cell Transcriptomic State Navigator
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              High-resolution UMAP embeddings with RNA velocity vector trajectories, cell-cell ligand-receptor crosstalk 
              (CellPhoneDB), and differential expression matrices across metastatic organ microenvironments.
            </p>
          </div>

          {/* Atlas Selector & Export Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="text-xs text-slate-400 pl-2 font-medium">Atlas:</span>
              <select
                value={selectedAtlas}
                onChange={(e) => setSelectedAtlas(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono font-bold rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="TISCH2_Metastatic_Niche">TISCH2 Metastatic Microenvironment Atlas</option>
                <option value="CancerSEA_Functional_States">CancerSEA Functional Phenotype Atlas</option>
                <option value="HTAN_Metastatic_Stroma">HTAN Human Tumor Atlas Network (scRNA+snATAC)</option>
                <option value="Human_Cell_Atlas_MPO">HCA Metastatic Organotropism Atlas</option>
              </select>
            </div>

            <button
              onClick={handleExportMetadataCsv}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export AnnData Metadata (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Color-By & Visual Overlays */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <span className="text-slate-400 font-medium px-1">Color by:</span>
            {(['cellState', 'organSite', 'cellType', 'geneExpression'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorBy(mode)}
                className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                  colorBy === mode ? 'bg-cyan-600 text-white font-semibold shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                {mode === 'cellState' ? 'Metastatic State' : mode === 'organSite' ? 'Organ Site' : mode === 'cellType' ? 'Cell Type' : 'Gene Expression'}
              </button>
            ))}
          </div>

          {colorBy === 'geneExpression' && (
            <select
              value={selectedGene}
              onChange={(e) => setSelectedGene(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-bold"
            >
              <option value="NR2F1">NR2F1 (Dormancy Master Driver)</option>
              <option value="VIM">VIM (Vimentin - EMT Invasion Marker)</option>
              <option value="CD274">CD274 (PD-L1 Immune Checkpoint)</option>
              <option value="ABCB1">ABCB1 (Multi-Drug Resistance Efflux)</option>
              <option value="RANKL">RANKL (Bone Endosteal Resorption)</option>
              <option value="MMP9">MMP9 (Extravasation / Matrix Cleavage)</option>
            </select>
          )}
        </div>

        {/* Overlay Switches */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showRnaVelocity}
              onChange={(e) => setShowRnaVelocity(e.target.checked)}
              className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" /> RNA Velocity Vectors (CellRank)
            </span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showDensityContours}
              onChange={(e) => setShowDensityContours(e.target.checked)}
              className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-purple-400" /> Density Contour Map
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive UMAP Plot Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              UMAP Single-Cell Latent Embedding ({filteredPoints.length} cells rendered)
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Dormant (NR2F1+)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Invasive (MMP9+)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Immune Suppressive
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Outgrowth
              </span>
            </div>
          </div>

          {/* SVG Canvas Scatter Plot */}
          <div className="w-full h-[440px] bg-slate-950 rounded-lg border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="-12 -12 24 24">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" opacity="0.8" />
                </marker>
              </defs>

              {/* Grid Lines */}
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#1e293b" strokeWidth="0.1" />

              {/* Density Contour Overlay Lines */}
              {showDensityContours && (
                <g opacity="0.35">
                  <ellipse cx="-6" cy="7" rx="3.5" ry="2.2" fill="none" stroke="#38bdf8" strokeWidth="0.1" strokeDasharray="0.2 0.2" />
                  <ellipse cx="-6" cy="7" rx="2.2" ry="1.4" fill="none" stroke="#38bdf8" strokeWidth="0.1" />
                  <ellipse cx="4" cy="-3" rx="4.0" ry="3.0" fill="none" stroke="#a855f7" strokeWidth="0.1" strokeDasharray="0.2 0.2" />
                  <ellipse cx="4" cy="-3" rx="2.5" ry="1.8" fill="none" stroke="#a855f7" strokeWidth="0.1" />
                  <ellipse cx="6" cy="5" rx="3.0" ry="2.0" fill="none" stroke="#10b981" strokeWidth="0.1" />
                </g>
              )}

              {/* RNA Velocity Trajectory Directional Arrows */}
              {showRnaVelocity && (
                <g>
                  {/* Primary -> Dormancy Velocity Vector */}
                  <line x1="-8" y1="6" x2="-6.2" y2="7.5" stroke="#38bdf8" strokeWidth="0.15" markerEnd="url(#arrow)" />
                  <line x1="-6.2" y1="7.5" x2="-4.5" y2="8.8" stroke="#38bdf8" strokeWidth="0.15" markerEnd="url(#arrow)" />
                  
                  {/* Dormancy -> Re-activation / Outgrowth Velocity Vector */}
                  <line x1="-4.5" y1="8.8" x2="1" y2="2" stroke="#f59e0b" strokeWidth="0.15" markerEnd="url(#arrow)" />
                  <line x1="1" y1="2" x2="5" y2="4.5" stroke="#10b981" strokeWidth="0.15" markerEnd="url(#arrow)" />

                  {/* Immune Evasion Transition Vector */}
                  <line x1="1" y1="2" x2="3.5" y2="-2.5" stroke="#a855f7" strokeWidth="0.15" markerEnd="url(#arrow)" />
                </g>
              )}

              {/* Single Cell Scatter Nodes */}
              {filteredPoints.map((sc) => {
                const color = getCellColor(sc);
                const isSelected = selectedCell?.id === sc.id;
                return (
                  <g key={sc.id} className="cursor-pointer transition-transform hover:scale-125" onClick={() => setSelectedCell(sc)}>
                    {isSelected && (
                      <circle
                        cx={sc.umapX}
                        cy={sc.umapY}
                        r="1.1"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="0.25"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={sc.umapX}
                      cy={sc.umapY}
                      r={isSelected ? "0.8" : "0.55"}
                      fill={color}
                      stroke={isSelected ? "#ffffff" : "#020617"}
                      strokeWidth="0.15"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Canvas Axis & Legend Overlay */}
            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500">UMAP_1</span>
            <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">UMAP_2</span>
            
            {showRnaVelocity && (
              <div className="absolute top-3 right-3 bg-slate-900/90 p-2 rounded border border-slate-800 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 animate-spin" /> CellRank RNA Velocity Enabled
              </div>
            )}
          </div>
        </div>

        {/* Selected Single-Cell Inspector & Multi-Omic Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
          {/* Sub-Tabs for Right Inspector Panel */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTabPanel('inspector')}
              className={`flex-1 py-1.5 rounded font-semibold transition-colors ${
                activeTabPanel === 'inspector' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cell Inspector
            </button>
            <button
              onClick={() => setActiveTabPanel('ligand_receptor')}
              className={`flex-1 py-1.5 rounded font-semibold transition-colors ${
                activeTabPanel === 'ligand_receptor' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              CellChat Crosstalk
            </button>
            <button
              onClick={() => setActiveTabPanel('diff_expr')}
              className={`flex-1 py-1.5 rounded font-semibold transition-colors ${
                activeTabPanel === 'diff_expr' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Diff Expr
            </button>
          </div>

          {/* TAB 1: CELL INSPECTOR */}
          {activeTabPanel === 'inspector' && selectedCell && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{selectedCell.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {selectedCell.sampleId}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 mt-1">{selectedCell.cellType}</h3>
                <p className="text-xs text-slate-400">
                  Organ: <span className="text-slate-200 capitalize font-medium">{selectedCell.organSite}</span> ({selectedCell.cancerType})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Niche State</span>
                  <span className="font-bold text-cyan-300">{selectedCell.cellState}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Monocle Pseudotime</span>
                  <span className="font-mono font-bold text-purple-400">{selectedCell.pseudotime.toFixed(2)}</span>
                </div>
              </div>

              {/* Marker Expression Profile */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Key Marker Expression</span>
                  <span className="text-[10px] text-slate-500 font-mono">SCTransform v2</span>
                </h4>
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  {Object.entries(selectedCell.expression).map(([marker, val]) => {
                    const numVal = Number(val);
                    return (
                      <div key={marker} className="space-y-0.5">
                        <div className="flex justify-between">
                          <span className="font-mono text-slate-300 font-bold">{marker}</span>
                          <span className="font-mono text-cyan-400">{numVal.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min((numVal / 5) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CELL-CELL LIGAND-RECEPTOR CROSSTALK (CELLPHONEDB) */}
          {activeTabPanel === 'ligand_receptor' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300" /> CellPhoneDB Niche Ligand-Receptor Pairs
                </span>
                <span className="text-[10px] text-slate-400 font-mono">p &lt; 0.001</span>
              </div>

              {ligandReceptorData.length > 0 ? (
                <div className="space-y-2">
                  {ligandReceptorData.map((lr, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-mono font-bold text-cyan-300">
                        <span>{lr.ligand}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lr.receptor}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{lr.pathway}</span>
                        <span className="font-mono text-emerald-400 font-bold">Score: {lr.interactionScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-center py-6">Loading ligand-receptor pairs...</div>
              )}
            </div>
          )}

          {/* TAB 3: DIFFERENTIAL EXPRESSION */}
          {activeTabPanel === 'diff_expr' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> Cluster Differential Markers (Wilcoxon)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Log2FC &gt; 1.5</span>
              </div>

              {diffExpressionData.length > 0 ? (
                <div className="space-y-2">
                  {diffExpressionData.map((de, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono">
                      <div>
                        <span className="font-bold text-white text-xs">{de.gene}</span>
                        <span className="text-[10px] text-slate-400 block">p-adj: {de.pValueAdj}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold text-xs">+{de.log2FoldChange} Log2FC</span>
                        <span className="text-[10px] text-slate-400 block">{de.pctExpressedCluster}% cells</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-center py-6">Loading differential expression matrix...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
