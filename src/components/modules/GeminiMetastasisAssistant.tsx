import React, { useState } from 'react';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { Sparkles, Dna, ArrowRight, RefreshCw, Lightbulb, TestTube } from 'lucide-react';

interface GeminiMetastasisAssistantProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const GeminiMetastasisAssistant: React.FC<GeminiMetastasisAssistantProps> = ({
  selectedOrgan,
  selectedCancerType
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    hypothesis: string;
    keyTargets: string[];
    suggestedExperiments: string[];
  } | null>(null);

  const handleGenerate = async (queryPrompt?: string) => {
    const finalPrompt = queryPrompt || prompt;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/hypothesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          organSite: selectedOrgan === 'all' ? 'Bone & Liver' : selectedOrgan,
          primaryCancer: selectedCancerType === 'all' ? 'Breast & Colorectal Cancer' : selectedCancerType,
          selectedGenes: ['RANKL', 'c-MET', 'L1CAM', 'CXCR4', 'NR2F1']
        })
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              AI Metastasis Research Co-Pilot & Hypothesis Engine (Gemini 2.5 Flash)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generates mechanistic hypotheses for organotropism, immune evasion in metastatic niches, and drug sensitivity combinations
          </p>
        </div>

        {/* Active Context Indicators */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            Primary: {selectedCancerType === 'all' ? 'Pan-Cancer' : selectedCancerType.split(' ')[0]}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-purple-300 border border-slate-700 capitalize">
            Niche: {selectedOrgan === 'all' ? 'All Organs' : selectedOrgan}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Query Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Metastatic Hypothesis Query Prompt
          </h3>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. What signaling pathways regulate the transition from dormant micro-metastasis to proliferative outgrowth in the bone endosteal niche?"
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
          />

          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Synthesizing Multi-Omic Literature...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Mechanistic Hypothesis
              </>
            )}
          </button>

          {/* Quick Preset Prompts */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Preset Research Prompts:</span>
            <div className="space-y-1.5">
              {[
                'Why does breast cancer specifically colonize bone over liver?',
                'How do reactive astrocytes facilitate brain metastatic vascular co-option?',
                'What immune checkpoint combination targets liver metastatic Kupffer cells?'
              ].map((qs, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(qs);
                    handleGenerate(qs);
                  }}
                  className="w-full text-left text-[11px] p-2 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors border border-slate-800 flex items-center justify-between"
                >
                  <span className="truncate">{qs}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Response Output */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          {response ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold">AI Synthesis Result</span>
                <h3 className="font-bold text-base text-white mt-0.5">
                  Mechanistic Hypothesis for Metastatic Niche Adaptation
                </h3>
              </div>

              {/* Hypothesis Body */}
              <div className="bg-slate-850 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2 font-sans whitespace-pre-line">
                {response.hypothesis}
              </div>

              {/* Key Targets */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1">
                  <Dna className="w-3.5 h-3.5 text-cyan-400" /> Key Target Vulnerabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {response.keyTargets.map((tg, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Validation Protocols */}
              <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1 mb-2">
                  <TestTube className="w-4 h-4" /> Recommended Preclinical Validation:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {response.suggestedExperiments.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
              <p>Enter a prompt or select a preset query to generate AI research hypotheses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
