import React from 'react';
import { ShieldAlert, AlertTriangle, Lock, DollarSign, TrendingDown, Compass } from 'lucide-react';

interface CascadeTwinArchTabsProps {
  activeArchTab: 'ingestion' | 'solvers' | 'interoperability' | 'security' | 'economics';
  emergencyStopLatched: boolean;
  setEmergencyStopLatched: (val: boolean) => void;
  flowRate: number;
  showToast: (msg: string) => void;
}

export const CascadeTwinArchTabs: React.FC<CascadeTwinArchTabsProps> = ({
  activeArchTab,
  emergencyStopLatched,
  setEmergencyStopLatched,
  flowRate,
  showToast
}) => {
  if (activeArchTab === 'security') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Emergency Stop & Hardware Interlock */}
          <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Bidirectional Writeback Safety Interlock
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Prevents physical hardware damage, laser thermal overdrive, or drug pump over-infusion
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                emergencyStopLatched ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {emergencyStopLatched ? 'E-STOP TRIPPED' : 'INTERLOCK ARMED'}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Safety Limits Table */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 block font-bold">ENFORCED HARDWARE RATE LIMITS:</span>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Max Optogenetic Laser Power:</span>
                  <span className="text-amber-400 font-bold">25.0 µW/mm² (Current: 15.0 µW)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Max Microfluidic Flow Rate:</span>
                  <span className="text-cyan-300 font-bold">300.0 µL/min (Current: {flowRate} µL)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Air-Gap Safety Relay:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE HARDWARE LIMITER</span>
                </div>
              </div>

              {/* Interactive Emergency E-STOP Button */}
              <button
                onClick={() => {
                  setEmergencyStopLatched(!emergencyStopLatched);
                  showToast(emergencyStopLatched ? "Emergency stop reset. Physical chip interlock armed." : "CRITICAL: Physical microfluidic E-STOP tripped! Actuators isolated!");
                }}
                className={`w-full py-3 rounded-xl font-bold font-mono text-xs transition-all shadow-xl flex items-center justify-center gap-2 ${
                  emergencyStopLatched
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                {emergencyStopLatched ? 'RESET PHYSICAL HARDWARE INTERLOCK' : 'TRIP EMERGENCY STOP (E-STOP) AIR-GAP RELAY'}
              </button>
            </div>
          </div>

          {/* Encryption & HIPAA Zero-Trust Enclave */}
          <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" /> Zero-Trust Security &amp; IP Protection Enclave
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Centralized digital twins contain sensitive patient genomic data &amp; proprietary process IP
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">In-Transit Encryption Protocol:</span>
                  <span className="text-cyan-300 font-bold">TLS 1.3 + mTLS HSM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">At-Rest Data Storage:</span>
                  <span className="text-emerald-400 font-bold">AES-256-GCM Zero-Knowledge</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">HIPAA Compliance Audit:</span>
                  <span className="text-indigo-300 font-bold">100% Validated (Zero PII)</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                <strong className="text-rose-300">Air-Gapped Privacy Isolation:</strong> Patient genetic profiles and 3D organoid CAD blueprints are cryptographically signed with hardware security keys (mTLS HSM) before transmitting over edge-to-cloud streams.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeArchTab === 'economics') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {/* Compute CapEx/OpEx vs Assay ROI */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Compute CapEx / OpEx Savings
              </h4>
              <p className="text-[10px] text-slate-400">Digital twin simulation vs. physical wet-lab assay costs</p>
            </div>

            <div className="space-y-2 font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">DIGITAL TWIN SIM COST</span>
                  <span className="text-lg font-extrabold text-emerald-400">$0.0004 / Run</span>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded font-bold">99.99% SAVINGS</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">PHYSICAL LAB ASSAY COST</span>
                  <span className="text-lg font-extrabold text-rose-400">$1,850.00 / Chip</span>
                </div>
                <span className="text-[10px] text-rose-300 bg-rose-500/20 px-2 py-1 rounded font-bold">HIGH COST</span>
              </div>
            </div>
          </div>

          {/* Digital Asset Maintenance Debt Index */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-400" /> Digital Asset Maintenance Debt Index
              </h4>
              <p className="text-[10px] text-slate-400">Tracks retooling &amp; model drift recalibration overhead</p>
            </div>

            <div className="space-y-3 font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Model Debt Rating:</span>
                  <span className="text-emerald-400 font-bold">Low (0.12 / 1.0)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-full w-[12%]" />
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Model Freshness Rating:</span>
                  <span className="text-cyan-300 font-bold">98.8% Active</span>
                </div>
                <p className="text-[10px] text-slate-400">Scheduled auto-recalibration prevents state drift</p>
              </div>
            </div>
          </div>

          {/* Clinical Lead Time KPI Advantage */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" /> Clinical Lead Time KPI Advantage
              </h4>
              <p className="text-[10px] text-slate-400">Time-to-hypothesis &amp; early therapeutic interception</p>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] text-slate-400 block font-bold">LEAD TIME ADVANTAGE:</span>
              <div className="text-2xl font-extrabold text-indigo-300">24.5 Days Sooner</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Closed-loop digital twin hypothesis testing identifies effective drug combinations 24.5 days prior to traditional cell culture outgrowth.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
