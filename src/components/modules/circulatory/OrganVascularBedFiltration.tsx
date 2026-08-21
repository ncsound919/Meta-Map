import React, { useState, useMemo } from 'react';
import {
  Activity,
  Layers,
  Zap,
  Droplets,
  Heart,
  Shield,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  TrendingUp,
  BarChart3,
  Dna,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { OrganSite } from '../../../types/metastasis';

export interface VascularBedSpec {
  id: OrganSite;
  name: string;
  fractionalCardiacOutput: number; // % of CO (e.g., Lungs 100%, Liver 27%, Kidneys 20%, Brain 15%, Bones 5%)
  capillaryDiameterUm: number; // micrometers (e.g., 6.5 to 15 um)
  sinusoidalPoreSizeNm: number; // fenestration size in nm
  endothelialType: 'continuous_tight_junctions' | 'fenestrated_diaphragm' | 'discontinuous_sinusoidal';
  meanTransitTimeSec: number; // transit time in seconds
  wallShearRateS1: number; // s^-1
  glycocalyxThicknessNm: number; // nm
  filtrationTrappingEfficiency: number; // % baseline for 20um CTC
  clusterDisruptionRisk: number; // %
  description: string;
  molecularTropismLigands: string[];
}

export const ORGAN_VASCULAR_BEDS: VascularBedSpec[] = [
  {
    id: 'lung',
    name: 'Pulmonary Capillary Bed',
    fractionalCardiacOutput: 100,
    capillaryDiameterUm: 6.8,
    sinusoidalPoreSizeNm: 5,
    endothelialType: 'continuous_tight_junctions',
    meanTransitTimeSec: 1.8,
    wallShearRateS1: 1200,
    glycocalyxThicknessNm: 500,
    filtrationTrappingEfficiency: 92,
    clusterDisruptionRisk: 78,
    description: 'First obligatory hemodynamic filter for all systemic venous drainage. Extremely narrow capillary diameters (6-7 µm) force CTC deformation, high mechanical arrest, and fragmentation.',
    molecularTropismLigands: ['ICAM-1', 'VCAM-1', 'CXCL12', 'Carbonic Anhydrase IX']
  },
  {
    id: 'liver',
    name: 'Hepatic Sinusoidal Network (Dual Inflow)',
    fractionalCardiacOutput: 27,
    capillaryDiameterUm: 12.5,
    sinusoidalPoreSizeNm: 150,
    endothelialType: 'discontinuous_sinusoidal',
    meanTransitTimeSec: 4.2,
    wallShearRateS1: 350,
    glycocalyxThicknessNm: 120,
    filtrationTrappingEfficiency: 85,
    clusterDisruptionRisk: 30,
    description: 'Dual vascular inflow (75% portal vein, 25% hepatic artery). Fenestrated discontinuous sinusoidal endothelium with Space of Disse allows direct tumor cell contact with hepatocytes and Kupffer cells.',
    molecularTropismLigands: ['Claudin-1', 'E-Selectin', 'Fibronection', 'CXCL12 (CXCR4 receptor)']
  },
  {
    id: 'bone',
    name: 'Bone Marrow Sinusoids & Endosteum',
    fractionalCardiacOutput: 6,
    capillaryDiameterUm: 14.0,
    sinusoidalPoreSizeNm: 280,
    endothelialType: 'discontinuous_sinusoidal',
    meanTransitTimeSec: 6.5,
    wallShearRateS1: 180,
    glycocalyxThicknessNm: 80,
    filtrationTrappingEfficiency: 76,
    clusterDisruptionRisk: 18,
    description: 'Low-shear sluggish sinusoidal plexus with high-affinity vascular niches. Rich in Osteopontin, RANKL, and CXCL12, acting as a fertile soil for CTC dormancy and colonization.',
    molecularTropismLigands: ['CXCL12 (SDF-1)', 'Osteopontin', 'Integrin αvβ3', 'Cadherin-11', 'RANKL']
  },
  {
    id: 'brain',
    name: 'Cerebral Microvasculature (Blood-Brain Barrier)',
    fractionalCardiacOutput: 15,
    capillaryDiameterUm: 7.2,
    sinusoidalPoreSizeNm: 1,
    endothelialType: 'continuous_tight_junctions',
    meanTransitTimeSec: 2.1,
    wallShearRateS1: 1450,
    glycocalyxThicknessNm: 600,
    filtrationTrappingEfficiency: 68,
    clusterDisruptionRisk: 85,
    description: 'Continuous non-fenestrated endothelium reinforced with Claudin-5/Occludin tight junctions, thick pericyte coverage, and astrocyte end-feet forming the formidable Blood-Brain Barrier.',
    molecularTropismLigands: ['ALCAM (CD166)', 'Integrin αvβ8', 'ST6GALNAC5', 'L1CAM', 'MMP-9']
  },
  {
    id: 'lymph_node',
    name: 'Lymph Node Subcapsular Sinuses',
    fractionalCardiacOutput: 4,
    capillaryDiameterUm: 16.5,
    sinusoidalPoreSizeNm: 350,
    endothelialType: 'discontinuous_sinusoidal',
    meanTransitTimeSec: 8.5,
    wallShearRateS1: 60,
    glycocalyxThicknessNm: 50,
    filtrationTrappingEfficiency: 88,
    clusterDisruptionRisk: 10,
    description: 'Ultra-low shear lymphatic conduits lined by LYVE-1+ sinusoidal endothelial cells and subcapsular sinus CD169+ macrophages.',
    molecularTropismLigands: ['CCL21 (CCR7)', 'LYVE-1', 'Podoplanin', 'Hyaluronan (CD44)']
  },
  {
    id: 'peritoneum',
    name: 'Peritoneal Mesothelial Microcirculation',
    fractionalCardiacOutput: 3.5,
    capillaryDiameterUm: 10.0,
    sinusoidalPoreSizeNm: 100,
    endothelialType: 'fenestrated_diaphragm',
    meanTransitTimeSec: 3.2,
    wallShearRateS1: 220,
    glycocalyxThicknessNm: 180,
    filtrationTrappingEfficiency: 70,
    clusterDisruptionRisk: 22,
    description: 'Peritoneal submesothelial capillary loops with high permeability, milky spots (falciform / omental lymphoid aggregates), and ascites hydrostatic filtration.',
    molecularTropismLigands: ['Mesothelin', 'MUC16 (CA125)', 'Integrin α5β1', 'ICAM-1']
  }
];

export const OrganVascularBedFiltration: React.FC = () => {
  const [selectedOrganId, setSelectedOrganId] = useState<OrganSite>('lung');
  const [ctcDiameterUm, setCtcDiameterUm] = useState<number>(18.0); // CTC diameter (12 - 30 um)
  const [ctcDeformabilityKpa, setCtcDeformabilityKpa] = useState<number>(0.85); // 0.2 to 2.5 kPa
  const [clusterUnitCount, setClusterUnitCount] = useState<number>(1); // 1 = Single, 2-10 = Cluster
  const [systemicBloodPressure, setSystemicBloodPressure] = useState<number>(120); // mmHg systolic

  const currentBed = useMemo(
    () => ORGAN_VASCULAR_BEDS.find((b) => b.id === selectedOrganId) || ORGAN_VASCULAR_BEDS[0],
    [selectedOrganId]
  );

  // Effective cluster size in micrometers
  const effectiveDiameterUm = useMemo(() => {
    if (clusterUnitCount === 1) return ctcDiameterUm;
    return Math.round(ctcDiameterUm * Math.pow(clusterUnitCount, 0.42));
  }, [ctcDiameterUm, clusterUnitCount]);

  // Size ratio and mechanical occlusion probability
  const occlusionKinetics = useMemo(() => {
    const sizeRatio = effectiveDiameterUm / currentBed.capillaryDiameterUm;
    // Mechanical steric trapping probability: Sigmoid function
    const stericScore = 1 / (1 + Math.exp(-2.8 * (sizeRatio - 1.1) / Math.max(0.2, ctcDeformabilityKpa)));
    const trappingProb = Math.min(99.5, Math.max(2.0, stericScore * 100));

    // Hydrodynamic shear survival during bed transit:
    // Shear stress tau = mu * gamma. High shear rate + high deformability = lower shear survival without cluster protection
    const shearDmgCoeff = (currentBed.wallShearRateS1 / 1000) * (clusterUnitCount === 1 ? 1.4 : 0.65);
    const survivalProb = Math.max(5, Math.min(98, 100 * Math.exp(-0.25 * shearDmgCoeff)));

    // Extravasation permissiveness based on endothelial fenestration
    const fenestrationScore = currentBed.sinusoidalPoreSizeNm > 100 ? 90 : currentBed.sinusoidalPoreSizeNm > 50 ? 60 : 25;

    // Colonization readiness score
    const colonizationScore = Math.round((trappingProb * 0.4) + (survivalProb * 0.3) + (fenestrationScore * 0.3));

    return {
      sizeRatio: sizeRatio.toFixed(2),
      trappingProb: Math.round(trappingProb),
      survivalProb: Math.round(survivalProb),
      colonizationScore
    };
  }, [effectiveDiameterUm, currentBed, ctcDeformabilityKpa, clusterUnitCount]);

  // Comparative chart data for all organ beds
  const comparisonData = useMemo(() => {
    return ORGAN_VASCULAR_BEDS.map((bed) => {
      const ratio = effectiveDiameterUm / bed.capillaryDiameterUm;
      const steric = 1 / (1 + Math.exp(-2.8 * (ratio - 1.1) / Math.max(0.2, ctcDeformabilityKpa)));
      const trap = Math.min(99.5, Math.max(2.0, steric * 100));
      const shearDmg = (bed.wallShearRateS1 / 1000) * (clusterUnitCount === 1 ? 1.4 : 0.65);
      const surv = Math.max(5, Math.min(98, 100 * Math.exp(-0.25 * shearDmg)));

      return {
        name: bed.name.split(' ')[0],
        fullName: bed.name,
        organId: bed.id,
        trappingProb: Math.round(trap),
        shearSurvival: Math.round(surv),
        cardiacFlow: bed.fractionalCardiacOutput
      };
    });
  }, [effectiveDiameterUm, ctcDeformabilityKpa, clusterUnitCount]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Organ-Specific Microvascular Bed Filtration & Steric Arrest Engine
              </h3>
              <p className="text-xs text-slate-400">
                Hemodynamic transit time distributions, pore cutoffs, glycocalyx barriers, and mechanical size-exclusion across 6 microvascular niches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold bg-rose-950 text-rose-300 border border-rose-800">
              SIZE RATIO: {occlusionKinetics.sizeRatio}x CAPILLARY BORE
            </span>
          </div>
        </div>

        {/* Organ Bed Selection Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
          {ORGAN_VASCULAR_BEDS.map((bed) => {
            const isSelected = selectedOrganId === bed.id;
            return (
              <button
                key={bed.id}
                onClick={() => setSelectedOrganId(bed.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400 font-bold">{bed.fractionalCardiacOutput}% CO</span>
                  <span className="text-cyan-400 font-bold">Ø {bed.capillaryDiameterUm}µm</span>
                </div>
                <div className="font-bold text-xs text-white line-clamp-1">{bed.name.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-500 font-mono line-clamp-1">{bed.endothelialType.replace(/_/g, ' ')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Biomechanical Slider Controls & Microvascular Anatomy */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" /> CTC Biomechanics & Inflow Settings
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Hydrodynamic Inflow</span>
          </div>

          <div className="space-y-4">
            {/* CTC Single Cell Diameter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Individual CTC Diameter:</span>
                <span className="text-rose-400 font-bold">{ctcDiameterUm} µm</span>
              </div>
              <input
                type="range"
                min="12"
                max="30"
                step="0.5"
                value={ctcDiameterUm}
                onChange={(e) => setCtcDiameterUm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>RBC (7.5 µm)</span>
                <span>Small CTC (15 µm)</span>
                <span>Giant CTC (30 µm)</span>
              </div>
            </div>

            {/* Cluster Size */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Cluster Cellularity:</span>
                <span className="text-purple-400 font-bold">
                  {clusterUnitCount === 1 ? 'Single Cell (1x)' : `${clusterUnitCount}-Cell Cluster (~${effectiveDiameterUm} µm)`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 3, 6, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setClusterUnitCount(count)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      clusterUnitCount === count
                        ? 'bg-purple-950 border border-purple-500 text-purple-200'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {count === 1 ? 'Single' : `${count}-Cells`}
                  </button>
                ))}
              </div>
            </div>

            {/* Cytoskeletal Deformability */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Cytoskeletal Elastic Modulus (Young's E):</span>
                <span className="text-cyan-400 font-bold">{ctcDeformabilityKpa} kPa</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={ctcDeformabilityKpa}
                onChange={(e) => setCtcDeformabilityKpa(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Ultra-Deformable (0.2 kPa)</span>
                <span>Rigid / Keratin-Dense (2.5 kPa)</span>
              </div>
            </div>
          </div>

          {/* Selected Vascular Bed Micro-Architecture Details */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white">{currentBed.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                {currentBed.endothelialType.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{currentBed.description}</p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">CAPILLARY BORE</span>
                <span className="text-white font-bold">{currentBed.capillaryDiameterUm} µm</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">FENESTRATION PORE</span>
                <span className="text-emerald-400 font-bold">{currentBed.sinusoidalPoreSizeNm} nm</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">WALL SHEAR RATE</span>
                <span className="text-amber-400 font-bold">{currentBed.wallShearRateS1} s⁻¹</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">MEAN TRANSIT TIME</span>
                <span className="text-purple-400 font-bold">{currentBed.meanTransitTimeSec} sec</span>
              </div>
            </div>

            {/* Molecular Tropism Receptors */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Enriched Endothelial Ligands:</span>
              <div className="flex flex-wrap gap-1">
                {currentBed.molecularTropismLigands.map((ligand, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-rose-900/60"
                  >
                    {ligand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Hemodynamic Filtration Analytics & Trapping Probabilities */}
        <div className="xl:col-span-7 space-y-6">
          {/* Real-time Computed Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">STERIC OCCLUSION</span>
              <div className="text-xl font-bold font-mono text-rose-400">{occlusionKinetics.trappingProb}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Arrest Probability</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">SHEAR SURVIVAL</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{occlusionKinetics.survivalProb}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Transit Viability</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">CARDIAC SHARE</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{currentBed.fractionalCardiacOutput}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Perfusion Inflow</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">METASTASIS POTENCY</span>
              <div className="text-xl font-bold font-mono text-purple-400">{occlusionKinetics.colonizationScore}/100</div>
              <span className="text-[9px] text-slate-500 font-mono">Organ Colonization</span>
            </div>
          </div>

          {/* Cross-Organ Trapping Efficiency Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  Multi-Organ Mechanical Filtration vs. Hydrodynamic Survival Profile
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ø {effectiveDiameterUm}µm CTC Inoculum</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="trappingProb" name="Steric Arrest Prob (%)" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.organId === selectedOrganId ? '#fb7185' : '#e11d48'}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="shearSurvival" name="Shear Transit Survival (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cardiacFlow" name="Fractional Cardiac Flow (% CO)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biological Interpretation */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Biomechanical Principle: The Paget-Ewing Synthesis</span>
              <p className="leading-relaxed">
                James Ewing’s purely hemodynamic theory explains organ seeding via microvascular entrapment and cardiac output distribution,
                while Stephen Paget’s "Seed and Soil" hypothesis dictates organ-specific molecular compatibility.
                {currentBed.id === 'lung' && ' The lungs represent the primary steric sieve, filtering >90% of venous CTCs due to extreme capillary narrowing.'}
                {currentBed.id === 'bone' && ' Bone marrow sinusoids feature sluggish blood flow and large fenestrations, providing optimal conditions for adhesive arrest and dormant niche entry.'}
                {currentBed.id === 'liver' && ' The liver acts as the primary drainage filter for GI malignancies via the portal vein, where fenestrations expose hepatocytes directly.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
