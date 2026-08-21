import React, { useState } from 'react';
import { SurvivalCohort, OrganSite } from '../../types/metastasis';
import { TrendingUp, ShieldAlert, Pill, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ClinicalOutcomeVisualizationProps {
  cohorts: SurvivalCohort[];
  selectedOrgan: OrganSite | 'all';
}

export const ClinicalOutcomeVisualization: React.FC<ClinicalOutcomeVisualizationProps> = ({
  cohorts,
  selectedOrgan
}) => {
  const filteredCohorts = cohorts.filter((c) => {
    return selectedOrgan === 'all' || c.organSite === selectedOrgan;
  });

  const [activeCohort, setActiveCohort] = useState<SurvivalCohort>(
    filteredCohorts[0] || cohorts[0]
  );

  // Combine high and low risk curve points into Recharts data
  const chartData = activeCohort
    ? activeCohort.highRiskCurve.map((hrPoint, i) => {
        const lrPoint = activeCohort.lowRiskCurve[i] || { survivalRate: 100 };
        return {
          month: hrPoint.months,
          HighRisk: hrPoint.survivalRate,
          LowRisk: lrPoint.survivalRate,
          atRiskHigh: hrPoint.atRisk,
          atRiskLow: lrPoint.atRisk
        };
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Clinical Outcome & Metastasis Risk Visualization (Kaplan–Meier)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Survival curves and hazard ratios stratified by organ site of metastasis, dormancy status, and molecular features
          </p>
        </div>

        {/* Cohort Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Cohort Stratification:</span>
          <select
            value={activeCohort?.id || ''}
            onChange={(e) => {
              const found = cohorts.find(c => c.id === e.target.value);
              if (found) setActiveCohort(found);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            {filteredCohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCohort && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Kaplan–Meier Plot */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100">{activeCohort.title}</h3>
                <p className="text-xs text-slate-400">
                  Stratified by: <span className="text-cyan-300 font-medium">{activeCohort.stratifiedBy}</span> (N = {activeCohort.sampleCount})
                </p>
              </div>

              {/* Statistical Metrics Pills */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  HR = {activeCohort.hazardRatio}
                </span>
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  p = {activeCohort.pValue}
                </span>
              </div>
            </div>

            {/* Recharts Stepped Line Chart */}
            <div className="w-full h-[360px] bg-slate-950/80 rounded-lg p-2 border border-slate-800/80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Time Post-Metastasis (Months)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Survival Probability (%)', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="stepAfter"
                    dataKey="HighRisk"
                    name="High Metastatic Risk / High Tropism"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="LowRisk"
                    name="Low Metastatic Risk Signature"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#06b6d4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* At Risk Table */}
            <div className="mt-4 border-t border-slate-800 pt-3 text-xs font-mono">
              <span className="text-slate-400 text-[11px] font-bold block mb-1">Patients at Risk:</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="py-1">Month</th>
                      {chartData.map((d, i) => (
                        <th key={i} className="py-1 px-2">{d.month}m</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-rose-400 border-t border-slate-800/60">
                      <td className="py-1 font-bold">High Risk</td>
                      {chartData.map((d, i) => (
                        <td key={i} className="py-1 px-2">{d.atRiskHigh}</td>
                      ))}
                    </tr>
                    <tr className="text-cyan-400">
                      <td className="py-1 font-bold">Low Risk</td>
                      {chartData.map((d, i) => (
                        <td key={i} className="py-1 px-2">{d.atRiskLow}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Translational & CeDR Therapy Profile */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                Targeted Therapy Vulnerabilities (CeDR Atlas)
              </h3>
              <p className="text-xs text-slate-400">
                Predicted IC50 therapeutic sensitivity in metastatic lesions stratified by organ tropism
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-slate-200 mb-1">
                    <span>Denosumab (Anti-RANKL)</span>
                    <span className="text-emerald-400 font-mono">0.12 µM</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    High efficacy in Bone Metastases by inhibiting osteoclast differentiation and RANKL-mediated tumor migration.
                  </p>
                </div>

                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-slate-200 mb-1">
                    <span>Cabozantinib (c-MET / VEGFR2)</span>
                    <span className="text-emerald-400 font-mono">0.45 µM</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Effective against Liver & Bone Metastases targeting HGF/MET microenvironment crosstalk.
                  </p>
                </div>

                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-slate-200 mb-1">
                    <span>Lapatinib + Everolimus</span>
                    <span className="text-emerald-400 font-mono">0.28 µM</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Crosses Blood-Brain barrier to target astrocyte-co-opted HER2+ Brain Metastases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
