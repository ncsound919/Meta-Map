import React from 'react';
import { Terminal } from 'lucide-react';

interface PipelineCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  oxygenHypoxiaThreshold: number;
  emtSwitchProbability: number;
  loxMatrixStiffnessKpa: number;
  shearStressDynCm2: number;
  generatedPhysiCellXML: string;
}

export const PipelineCodeExportModal: React.FC<PipelineCodeExportModalProps> = ({
  isOpen,
  onClose,
  oxygenHypoxiaThreshold,
  emtSwitchProbability,
  loxMatrixStiffnessKpa,
  shearStressDynCm2,
  generatedPhysiCellXML
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base font-mono">
              PhysiCell Configuration XML Script Export
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono font-bold text-sm px-2 py-1 rounded bg-slate-800"
          >
            ✕ Close
          </button>
        </div>

        <p className="text-xs text-slate-300 font-mono">
          Executable PhysiCell configuration XML grounded with your configured biophysical slider values (Hypoxia: {oxygenHypoxiaThreshold} mmHg, EMT: {emtSwitchProbability}, LOX: {loxMatrixStiffnessKpa} kPa, Shear: {shearStressDynCm2} dyn/cm²):
        </p>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
          {generatedPhysiCellXML}
        </pre>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => navigator.clipboard.writeText(generatedPhysiCellXML)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg font-mono transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};
