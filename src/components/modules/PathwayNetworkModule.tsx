import React, { useState } from 'react';
import { NetworkGeneNode, NetworkEdge, OrganSite } from '../../types/metastasis';
import { Network, Share2, Layers, Filter } from 'lucide-react';

interface PathwayNetworkModuleProps {
  nodes: NetworkGeneNode[];
  edges: NetworkEdge[];
  selectedOrgan: OrganSite | 'all';
}

export const PathwayNetworkModule: React.FC<PathwayNetworkModuleProps> = ({
  nodes,
  edges,
  selectedOrgan
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNode, setActiveNode] = useState<NetworkGeneNode | null>(nodes[0] || null);

  const filteredNodes = nodes.filter((n) => {
    const matchesOrgan = selectedOrgan === 'all' || n.associatedOrgans.includes(selectedOrgan);
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesOrgan && matchesCat;
  });

  const validNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target));

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Pathway & Protein–Protein Interaction Network (STRING / Cytoscape Layout)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interconnected molecular drivers of organotropic seed-and-soil signaling, EMT, niche remodeling, and dormancy
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <span className="text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Pathways</option>
            <option value="EMT">EMT & Motility</option>
            <option value="Organotropism Homing">Organotropism Homing</option>
            <option value="Niche Remodeling">Niche Remodeling</option>
            <option value="Immune Checkpoint">Immune Checkpoint</option>
            <option value="Driver">Dormancy Master Driver</option>
            <option value="Metabolic Adaptor">Metabolic Adaptor</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Canvas Graph */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Metastatic Signaling Network Graph ({filteredNodes.length} Genes, {filteredEdges.length} Interactions)
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-400" /> Activation
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-rose-400" /> Inhibition
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-400" /> Phosphorylation
              </span>
            </div>
          </div>

          <div className="w-full h-[440px] bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 700 500">
              {/* Edges */}
              {filteredEdges.map((edge, idx) => {
                const sNode = nodes.find(n => n.id === edge.source);
                const tNode = nodes.find(n => n.id === edge.target);
                if (!sNode || !tNode) return null;

                const isActivation = edge.type === 'activation';
                const isInhibition = edge.type === 'inhibition';
                const strokeColor = isActivation ? '#10b981' : isInhibition ? '#f43f5e' : '#f59e0b';

                return (
                  <g key={idx}>
                    <line
                      x1={sNode.x || 300}
                      y1={sNode.y || 250}
                      x2={tNode.x || 300}
                      y2={tNode.y || 250}
                      stroke={strokeColor}
                      strokeWidth={edge.weight * 2.5}
                      strokeOpacity="0.7"
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                const isUp = node.log2FC > 0;
                const fillColor = isUp ? '#06b6d4' : '#f43f5e';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 300}, ${node.y || 250})`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setActiveNode(node)}
                  >
                    {isSelected && (
                      <circle r="26" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-pulse" />
                    )}
                    <circle
                      r="18"
                      fill="#0f172a"
                      stroke={fillColor}
                      strokeWidth={isSelected ? '3' : '2'}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      className="fill-slate-100 text-[10px] font-bold font-mono pointer-events-none"
                    >
                      {node.label.length > 8 ? `${node.label.slice(0, 6)}..` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Gene Inspector */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          {activeNode ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  {activeNode.category}
                </span>
                <h3 className="font-bold text-lg text-white mt-1.5">{activeNode.label} ({activeNode.id})</h3>
              </div>

              {/* Expression Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Primary Lesion Exp</span>
                  <span className="font-mono font-bold text-slate-200">{activeNode.expressionPrimary} TPM</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Metastasis Niche Exp</span>
                  <span className="font-mono font-bold text-cyan-400">{activeNode.expressionMetastasis} TPM</span>
                </div>
              </div>

              <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-300 font-medium">Differential Shift:</span>
                <span className={`font-mono font-bold text-sm ${activeNode.log2FC > 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {activeNode.log2FC > 0 ? `+${activeNode.log2FC}` : activeNode.log2FC} Log2FC
                </span>
              </div>

              {/* Associated Tropism Organs */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Linked Organ Niche Tropism:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.associatedOrgans.map((org, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 capitalize font-medium">
                      {org.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Click a gene node on the network canvas to view signaling details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
