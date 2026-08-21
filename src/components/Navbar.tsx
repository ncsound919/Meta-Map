import React from 'react';
import { 
  Dna, 
  Layers, 
  Activity, 
  GitMerge, 
  GitBranch, 
  TrendingUp, 
  Network, 
  Database, 
  Play, 
  Sparkles,
  Filter,
  Globe,
  ShieldAlert,
  Cpu,
  Film,
  Brain,
  HelpCircle,
  Swords,
  Microscope,
  Stethoscope,
  Heart,
  Calculator,
  FileCheck2,
  Server
} from 'lucide-react';
import { OrganSite, PrimaryCancerType } from '../types/metastasis';

interface NavbarProps {
  activeModule: string;
  setActiveModule: (mod: string) => void;
  selectedOrgan: OrganSite | 'all';
  setSelectedOrgan: (organ: OrganSite | 'all') => void;
  selectedCancerType: PrimaryCancerType | 'all';
  setSelectedCancerType: (cancer: PrimaryCancerType | 'all') => void;
  onOpenLabModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  selectedOrgan,
  setSelectedOrgan,
  selectedCancerType,
  setSelectedCancerType,
  onOpenLabModal
}) => {
  const modules = [
    { id: 'hpc_compute', name: 'HPC Compute Backend', icon: Server },
    { id: 'clinical_ingestion', name: 'Clinical Data Hub', icon: Database },
    { id: 'proactive_interception', name: 'Proactive Interception', icon: Stethoscope },
    { id: 'model_validation', name: 'Validation & EKF Twin', icon: FileCheck2 },
    { id: 'immune_grid', name: 'Immune Interaction Grid', icon: ShieldAlert },
    { id: 'colonization_sandbox', name: 'Colonization Sandbox', icon: Sparkles },
    { id: 'sim_pipeline', name: 'Simulation Pipeline', icon: Cpu },
    { id: 'circulatory_sim', name: 'Circulatory Simulator', icon: Heart },
    { id: 'tumor_evolution_math', name: 'Tumor Evolution Math', icon: Calculator },
    { id: 'atlas', name: 'Metastasis Atlas', icon: Globe },
    { id: 'living_cinema', name: 'Living Cell Cinema', icon: Film },
    { id: 'cascade_twin', name: 'Cascade Twin Simulator', icon: Cpu },
    { id: 'forecast_engine', name: 'Forecast Engine', icon: Brain },
    { id: 'causal_oracle', name: 'Causal Oracle', icon: HelpCircle },
    { id: 'resistance_forge', name: 'Resistance Forge', icon: Swords },
    { id: 'ontology', name: 'Ontology & Graph', icon: Network },
    { id: 'bottleneck', name: 'Bottlenecks & Gaps', icon: ShieldAlert },
    { id: 'pairs', name: 'Primary–Met Pairs', icon: Layers },
    { id: 'single_cell', name: 'Single-Cell Navigator', icon: Activity },
    { id: 'network', name: 'Pathway & Networks', icon: Network },
    { id: 'trajectory', name: 'Lineage & Barcodes', icon: GitBranch },
    { id: 'clinical', name: 'Clinical & Survival', icon: TrendingUp },
    { id: 'routes', name: 'Dissemination Routes', icon: GitMerge },
    { id: 'matrix', name: 'Multi-Omics Matrix', icon: Database },
    { id: 'workflow', name: 'Workflow Engine', icon: Play },
    { id: 'ai_assistant', name: 'AI Co-Pilot', icon: Sparkles }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      {/* Top Banner / Branding */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">MetaMap</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                Metastasis Portal
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                ISO 15189 / GLP LAB-GRADE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-Omics, Organotropism & Metastatic Niche Intelligence
            </p>
          </div>
        </div>

        {/* Global Filters & Lab Modal Button */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-slate-400 px-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filters:</span>
          </div>

          {/* Organ Filter */}
          <select
            value={selectedOrgan}
            onChange={(e) => setSelectedOrgan(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">All Destination Organs</option>
            <option value="bone">Bone Niche</option>
            <option value="liver">Liver Niche</option>
            <option value="brain">Brain Niche</option>
            <option value="lung">Lung Niche</option>
            <option value="lymph_node">Lymph Node</option>
            <option value="peritoneum">Peritoneum</option>
          </select>

          {/* Cancer Type Filter */}
          <select
            value={selectedCancerType}
            onChange={(e) => setSelectedCancerType(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">All Primary Cancers</option>
            <option value="Breast (BRCA)">Breast (BRCA)</option>
            <option value="Colorectal (COAD/READ)">Colorectal (COAD/READ)</option>
            <option value="Lung Non-Small (LUAD/LUSC)">Lung Non-Small (LUAD/LUSC)</option>
            <option value="Prostate (PRAD)">Prostate (PRAD)</option>
            <option value="Melanoma (SKCM)">Melanoma (SKCM)</option>
            <option value="Pancreatic (PAAD)">Pancreatic (PAAD)</option>
          </select>

          {/* Lab-Grade SOP Calibration Trigger */}
          {onOpenLabModal && (
            <button
              onClick={onOpenLabModal}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Microscope className="w-3.5 h-3.5" /> Lab-Grade SOP Suite
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-slate-800/80">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{m.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
