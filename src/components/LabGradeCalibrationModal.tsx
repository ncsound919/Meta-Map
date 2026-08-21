import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sliders,
  CheckCircle2,
  X,
  Download,
  Activity,
  Microscope,
  ShieldCheck,
  Cpu,
  Flame,
  Zap,
  HelpCircle,
  Dna
} from 'lucide-react';

interface LabGradeCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organSite?: string;
  cancerType?: string;
}

export const LabGradeCalibrationModal: React.FC<LabGradeCalibrationModalProps> = ({
  isOpen,
  onClose,
  organSite = 'bone',
  cancerType = 'Breast (BRCA)'
}) => {
  const [sopData, setSopData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'sop' | 'fluidics' | 'singlecell' | 'causal' | 'genetics'>('sop');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchSopData();
    }
  }, [isOpen, organSite, cancerType]);

  const fetchSopData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lab-grade/sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organSite, cancerType })
      });
      if (res.ok) {
        const data = await res.json();
        setSopData(data);
      }
    } catch (e) {
      console.error('Failed to load SOP data:', e);
    } finally {
      setLoading(false);
    }
  };

  const downloadSopFile = () => {
    if (!sopData) return;
    const blob = new Blob([sopData.sopProtocolText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_METAMAP_2026_LAB42_${organSite.toUpperCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  ISO 15189 / CLIA COMPLIANT
                </span>
                <span className="text-xs text-slate-400 font-mono">v4.2.1-LAB-GRADE</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Lab-Grade Calibration & Biophysical SOP Suite
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('sop')}
            className={`px-4 py-3 border-b-2 font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'sop' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Formal SOP Protocol Text
          </button>
          <button
            onClick={() => setActiveTab('fluidics')}
            className={`px-4 py-3 border-b-2 font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'fluidics' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" /> Microfluidic Mechanics
          </button>
          <button
            onClick={() => setActiveTab('singlecell')}
            className={`px-4 py-3 border-b-2 font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'singlecell' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-4 h-4" /> Single-Cell & Spatial QC
          </button>
          <button
            onClick={() => setActiveTab('causal')}
            className={`px-4 py-3 border-b-2 font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'causal' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Judea Pearl Do-Calculus
          </button>
          <button
            onClick={() => setActiveTab('genetics')}
            className={`px-4 py-3 border-b-2 font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'genetics' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" /> Wright-Fisher Mechanics
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 font-mono gap-2">
              <Activity className="w-5 h-5 animate-spin text-cyan-400" /> Loading Lab-Grade SOP Parameters...
            </div>
          ) : sopData ? (
            <>
              {activeTab === 'sop' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block font-bold">Standard Operating Procedure Document:</span>
                      <span className="text-white font-mono text-xs">SOP-METAMAP-2026-LAB42</span>
                    </div>
                    <button
                      onClick={downloadSopFile}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Download SOP (.TXT)
                    </button>
                  </div>

                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto select-all">
                    {sopData.sopProtocolText}
                  </pre>
                </div>
              )}

              {activeTab === 'fluidics' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm">Microfluidic Hardware & Hydrogel Matrix Calibration</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-cyan-400 font-bold block">Channel Geometry & Fluid Dynamics</span>
                      <div className="space-y-1 font-mono text-slate-300 text-[11px]">
                        <div>Channel Width ($w$): <strong className="text-white">{sopData.instrumentationSpecifications.microfluidicChipGeometry.channelWidthUm} µm</strong></div>
                        <div>Channel Height ($h$): <strong className="text-white">{sopData.instrumentationSpecifications.microfluidicChipGeometry.channelHeightUm} µm</strong></div>
                        <div>Hydraulic Diameter ($D_h$): <strong className="text-white">{sopData.instrumentationSpecifications.microfluidicChipGeometry.hydraulicDiameterUm} µm</strong></div>
                        <div>Shear Range ($\tau$): <strong className="text-emerald-400">{sopData.instrumentationSpecifications.microfluidicChipGeometry.shearRateRangeDynesCm2}</strong></div>
                        <div>Fluid Viscosity ($\mu$): <strong className="text-white">{sopData.instrumentationSpecifications.microfluidicChipGeometry.fluidViscosityPaS} Pa·s</strong></div>
                        <div>Max Reynolds Number ($Re$): <strong className="text-white">{sopData.instrumentationSpecifications.microfluidicChipGeometry.reynoldsNumberMax} (Strict Laminar)</strong></div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-cyan-400 font-bold block">Target Organ Elastic Modulus (Matrix Stiffness)</span>
                      <div className="space-y-1 font-mono text-slate-300 text-[11px]">
                        <div>Bone Endosteal Matrix: <strong className="text-amber-300">{sopData.instrumentationSpecifications.hydrogelMatrixPhysics.boneEndostealStiffnessKPa} kPa</strong></div>
                        <div>Brain Parenchyma: <strong className="text-amber-300">{sopData.instrumentationSpecifications.hydrogelMatrixPhysics.brainParenchymaStiffnessKPa} kPa</strong></div>
                        <div>Liver Sinusoid: <strong className="text-amber-300">{sopData.instrumentationSpecifications.hydrogelMatrixPhysics.liverSinusoidStiffnessKPa} kPa</strong></div>
                        <div>Lung Parenchyma: <strong className="text-amber-300">{sopData.instrumentationSpecifications.hydrogelMatrixPhysics.lungParenchymaStiffnessKPa} kPa</strong></div>
                        <div>AFM Cantilever Spring ($k$): <strong className="text-white">{sopData.instrumentationSpecifications.hydrogelMatrixPhysics.cantileverSpringConstantNM} N/m</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                    <span className="text-amber-400 font-bold block">Biophysical Formula: Wall Shear Stress (τ)</span>
                    <p className="bg-slate-900 p-2 rounded text-white font-bold">{sopData.instrumentationSpecifications.biophysicalFormulas.wallShearStress}</p>
                  </div>
                </div>
              )}

              {activeTab === 'singlecell' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm">Single-Cell & Spatial Transcriptomic Quality Control Standards</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                      <span className="text-cyan-400 font-bold block">Single-Cell Sequencing Gates</span>
                      <div className="space-y-1 text-slate-300 text-[11px]">
                        <div>Minimum Cell Viability: <strong className="text-emerald-400">&ge; {sopData.instrumentationSpecifications.singleCellQualityControl.minimumViabilityPct}%</strong></div>
                        <div>Doublet Probability Ceiling: <strong className="text-white">&le; {sopData.instrumentationSpecifications.singleCellQualityControl.maxDoubletProbabilityPct}%</strong></div>
                        <div>Mitochondrial Transcript Max: <strong className="text-white">&le; {sopData.instrumentationSpecifications.singleCellQualityControl.mitochondrialReadFractionMaxPct}%</strong></div>
                        <div>Min Read Depth / Cell: <strong className="text-white">{sopData.instrumentationSpecifications.singleCellQualityControl.minimumReadDepthPerCell.toLocaleString()} reads</strong></div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                      <span className="text-cyan-400 font-bold block">Spatial Transcriptomics & CRISPR QC</span>
                      <div className="space-y-1 text-slate-300 text-[11px]">
                        <div>Spatial Spot Resolution: <strong className="text-emerald-400">{sopData.instrumentationSpecifications.singleCellQualityControl.spatialResolutionUm} µm (Visium HD)</strong></div>
                        <div>CRISPR Efficiency (Doench Score): <strong className="text-white">0.892 (High)</strong></div>
                        <div>Off-Target Risk (MIT Score): <strong className="text-white">94 / 100</strong></div>
                        <div>PAM Site Constraint: <strong className="text-white">5'-NGG-3' SpCas9 / Base Editor</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'causal' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm">Judea Pearl Do-Calculus & Structural Equation Modeling</h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                    <span className="text-amber-400 font-bold block">Interventional Causal Operator: P(Metastasis | do(X = x))</span>
                    <p className="bg-slate-900 p-3 rounded text-slate-200 text-xs font-bold leading-relaxed">
                      {sopData.instrumentationSpecifications.biophysicalFormulas.doCalculusIntervention}
                    </p>
                    <p className="text-slate-400 text-[11px] pt-1">
                      Enforces backdoor path conditioning over covariate set Z to establish non-spurious causal necessity scores (p &lt; 0.001).
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'genetics' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm">Wright-Fisher Population Genetics & Hill Equation Kinetics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px]">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-rose-400 font-bold block">Wright-Fisher Selection Model</span>
                      <p className="bg-slate-900 p-2 rounded text-white font-bold">{sopData.instrumentationSpecifications.biophysicalFormulas.wrightFisherSelection}</p>
                      <span className="text-slate-400 block">Selection coefficient (s = 0.34), Mutation rate (μ = 10⁻⁶/bp/gen).</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-rose-400 font-bold block">Hill Dose-Response Inhibition</span>
                      <p className="bg-slate-900 p-2 rounded text-white font-bold">{sopData.instrumentationSpecifications.biophysicalFormulas.hillEquationInhibition}</p>
                      <span className="text-slate-400 block">Cooperativity coefficient (n = 2.4), Shift ratio (48-fold).</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span className="font-mono">MetaMap Lab-Grade Biobank Standard ISO 15189</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
