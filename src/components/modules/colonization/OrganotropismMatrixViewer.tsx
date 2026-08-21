import React, { useState } from 'react';
import {
  Globe,
  Bone,
  Brain,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Database
} from 'lucide-react';
import { PrimaryCancerType, OrganSite } from '../../../types/metastasis';

interface OrganotropismMatrixViewerProps {
  selectedOrgan: string;
  onSelectOrgan: (organ: OrganSite) => void;
  selectedCancerType: string;
}

interface TropismProfile {
  cancerType: string;
  primaryLabel: string;
  boneScore: number;
  brainScore: number;
  liverScore: number;
  lungScore: number;
  peritoneumScore: number;
  keyDrivers: {
    bone: string[];
    brain: string[];
    liver: string[];
    lung: string[];
  };
  dominantPhenotype: string;
}

export const OrganotropismMatrixViewer: React.FC<OrganotropismMatrixViewerProps> = ({
  selectedOrgan,
  onSelectOrgan,
  selectedCancerType
}) => {
  const [activeCancerFilter, setActiveCancerFilter] = useState<string>('all');

  const tropismProfiles: TropismProfile[] = [
    {
      cancerType: 'breast_tnbc',
      primaryLabel: 'Triple-Negative Breast (TNBC)',
      boneScore: 40,
      brainScore: 85,
      liverScore: 60,
      lungScore: 90,
      peritoneumScore: 15,
      keyDrivers: {
        bone: ['PTHrP', 'IL-6', 'Runx2'],
        brain: ['L1CAM', 'COX2', 'HBEGF', 'Cx43', 'PCDH7'],
        liver: ['Claudin-2', 'CXCR4'],
        lung: ['Tenascin-C', 'Periostin', 'S100A8/A9', 'VCAM-1']
      },
      dominantPhenotype: 'High Lung & Brain Propensity (Neurovascular Co-option)'
    },
    {
      cancerType: 'breast_er_pos',
      primaryLabel: 'ER+ / Luminal Breast',
      boneScore: 95,
      brainScore: 25,
      liverScore: 45,
      lungScore: 50,
      peritoneumScore: 10,
      keyDrivers: {
        bone: ['RANKL', 'OPN', 'CXCR4', 'IL-11', 'Jagged1'],
        brain: ['HER2 (if mutated)', 'EGFR'],
        liver: ['Claudin-2', 'IGF-1R'],
        lung: ['LOX', 'Fibronectin']
      },
      dominantPhenotype: 'Dominant Osteolytic Endosteal Niche Tropism'
    },
    {
      cancerType: 'pancreatic_pdac',
      primaryLabel: 'Pancreatic Ductal (PDAC)',
      boneScore: 15,
      brainScore: 5,
      liverScore: 95,
      lungScore: 55,
      peritoneumScore: 80,
      keyDrivers: {
        bone: ['Rare / late'],
        brain: ['Extremely rare'],
        liver: ['Claudin-2', 'HGF/c-MET', 'Galectin-3', 'Macrophage MIF'],
        lung: ['KRAS G12D', 'IL-6']
      },
      dominantPhenotype: 'Portal Venous Seeding & Desmoplastic Hepatic Niche'
    },
    {
      cancerType: 'nsclc_lung',
      primaryLabel: 'Non-Small Cell Lung (NSCLC)',
      boneScore: 70,
      brainScore: 90,
      liverScore: 50,
      lungScore: 75,
      peritoneumScore: 10,
      keyDrivers: {
        bone: ['PTHrP', 'DKK1', 'RANKL'],
        brain: ['EGFR L858R', 'ALK fusion', 'MET amp', 'Claudin-5 loss'],
        liver: ['c-MET', 'AXL'],
        lung: ['Contralateral intra-pulmonary lymphatics']
      },
      dominantPhenotype: 'CNS & Skeletal Dominant Dissemination'
    },
    {
      cancerType: 'colorectal_crc',
      primaryLabel: 'Colorectal Adenocarcinoma (CRC)',
      boneScore: 20,
      brainScore: 10,
      liverScore: 92,
      lungScore: 65,
      peritoneumScore: 70,
      keyDrivers: {
        bone: ['MMP-7', 'CXCR4'],
        brain: ['Late stage progression'],
        liver: ['Claudin-2', 'Gas6/AXL', 'CEA', 'Integrin αvβ6'],
        lung: ['CAV1', 'Periostin']
      },
      dominantPhenotype: 'Enteric Portal Drainage & Peritoneal Carcinomatosis'
    },
    {
      cancerType: 'prostate_prad',
      primaryLabel: 'Prostate Adenocarcinoma (PRAD)',
      boneScore: 98,
      brainScore: 5,
      liverScore: 30,
      lungScore: 40,
      peritoneumScore: 5,
      keyDrivers: {
        bone: ['ET-1', 'BMP-2/4', 'PSA', 'TGF-β', 'Wnt-induced Osteoblastic Sclerosis'],
        brain: ['Very rare'],
        liver: ['Late AR-negative / Neuroendocrine transition'],
        lung: ['CXCR4', 'Integrin αvβ3']
      },
      dominantPhenotype: 'Osteoblastic Sclerotic Bone Lesion Predominance'
    },
    {
      cancerType: 'melanoma_skcm',
      primaryLabel: 'Cutaneous Melanoma (SKCM)',
      boneScore: 50,
      brainScore: 92,
      liverScore: 60,
      lungScore: 85,
      peritoneumScore: 20,
      keyDrivers: {
        bone: ['Osteopontin', 'MMP-2'],
        brain: ['BRAF V600E', 'Pleiotrophin', 'SerpinB2', 'L1CAM'],
        liver: ['c-KIT', 'MET'],
        lung: ['CCR4', 'VEGFR-1', 'Tenascin-C']
      },
      dominantPhenotype: 'Extreme Multi-Organ & Intracranial Tropism'
    }
  ];

  const filteredProfiles = activeCancerFilter === 'all'
    ? tropismProfiles
    : tropismProfiles.filter(p => p.cancerType.includes(activeCancerFilter));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-rose-500 text-white font-bold';
    if (score >= 60) return 'bg-amber-500/80 text-white font-semibold';
    if (score >= 40) return 'bg-cyan-500/60 text-white';
    if (score >= 20) return 'bg-slate-700 text-slate-300';
    return 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Seed-and-Soil Organotropism & Tropism Matrix</h3>
            <p className="text-xs text-slate-400">
              Paget’s Seed-and-Soil compatibility index across 7 major human solid malignancies and organ microenvironments.
            </p>
          </div>
        </div>

        {/* Quick Organ Filter Links */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => onSelectOrgan('bone')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedOrgan === 'bone' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bone
          </button>
          <button
            onClick={() => onSelectOrgan('brain')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedOrgan === 'brain' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Brain
          </button>
          <button
            onClick={() => onSelectOrgan('liver')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedOrgan === 'liver' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Liver
          </button>
          <button
            onClick={() => onSelectOrgan('lung')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedOrgan === 'lung' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lung
          </button>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <tr>
              <th className="p-3">Primary Cancer Subtype</th>
              <th className="p-3 text-center">Bone Niche</th>
              <th className="p-3 text-center">Brain Niche</th>
              <th className="p-3 text-center">Liver Niche</th>
              <th className="p-3 text-center">Lung Niche</th>
              <th className="p-3 text-center">Peritoneum</th>
              <th className="p-3">Dominant Tropism Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filteredProfiles.map((p) => (
              <tr key={p.cancerType} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3 font-sans font-bold text-white whitespace-nowrap">
                  {p.primaryLabel}
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getScoreColor(p.boneScore)}`}>
                    {p.boneScore}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getScoreColor(p.brainScore)}`}>
                    {p.brainScore}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getScoreColor(p.liverScore)}`}>
                    {p.liverScore}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getScoreColor(p.lungScore)}`}>
                    {p.lungScore}%
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getScoreColor(p.peritoneumScore)}`}>
                    {p.peritoneumScore}%
                  </span>
                </td>
                <td className="p-3 text-[11px] text-slate-300 font-sans">
                  <div className="font-semibold text-cyan-300">{p.dominantPhenotype}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {selectedOrgan === 'bone' && `Drivers: ${p.keyDrivers.bone.join(', ')}`}
                    {selectedOrgan === 'brain' && `Drivers: ${p.keyDrivers.brain.join(', ')}`}
                    {selectedOrgan === 'liver' && `Drivers: ${p.keyDrivers.liver.join(', ')}`}
                    {selectedOrgan === 'lung' && `Drivers: ${p.keyDrivers.lung.join(', ')}`}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
