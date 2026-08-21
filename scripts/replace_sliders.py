import re
import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # More relaxed pattern
    # <div className="space-y-1 text-xs">
    #   <div className="flex justify-between text-slate-300">
    #     <span>Mutation Rate (μ per division):</span>
    #     <span className="font-mono font-bold text-indigo-400">{somaticMutationRate.toFixed(5)}</span>
    #   </div>
    #   <input
    #     type="range"
    #     min="0.00001"
    #     max="0.00100"
    #     step="0.00005"
    #     value={somaticMutationRate}
    #     onChange={(e) => setSomaticMutationRate(parseFloat(e.target.value))}
    #     className="w-full accent-indigo-500 bg-slate-950 rounded h-1.5"
    #   />
    # </div>
    
    # We will just find all input type="range" and their context using a simpler logic.
    pattern = re.compile(
        r'<div[^>]*className="[^"]*space-y-[1234][^"]*"[^>]*>\s*<div[^>]*className="flex justify-between[^"]*"[^>]*>\s*<span[^>]*>(.*?)</span>\s*<span[^>]*>(.*?)</span>\s*</div>\s*<input\s+type="range"\s+min="([^"]+)"\s+max="([^"]+)"\s+step="([^"]+)"\s+value=\{([^}]+)\}\s+onChange=\{\(.*?\)\s*=>\s*([a-zA-Z0-9_]+)\(.*?\}\s+className="[^"]+"\s*/>\s*(<p[^>]*>.*?</p>)?\s*</div>',
        re.DOTALL
    )

    def repl(m):
        label = m.group(1).strip()
        value_display = m.group(2).strip()
        min_val = m.group(3)
        max_val = m.group(4)
        step_val = m.group(5)
        value_var = m.group(6)
        setter = m.group(7)
        optional_p = m.group(8) or ""

        slider_str = (
            f'<Slider\n'
            f'  label="{label}"\n'
            f'  min={{{min_val}}}\n'
            f'  max={{{max_val}}}\n'
            f'  step={{{step_val}}}\n'
            f'  value={{{value_var}}}\n'
            f'  onChange={{{setter}}}\n'
            f'  valueDisplay={{<>{value_display}</>}}\n'
            f'/>'
        )
        if optional_p:
             return f'<div className="space-y-1">\n  {slider_str}\n  {optional_p}\n</div>'
        return slider_str

    new_content, count = pattern.subn(repl, content)

    if count > 0:
        if "import { Slider }" not in new_content:
            depth = len(filepath.split('/')) - 3
            if depth < 0: depth = 0
            dots = "../" * depth if depth > 0 else "./"
            import_statement = f"import {{ Slider }} from '{dots}ui/Slider';\n"
            
            new_content = re.sub(r'(import React[^;]+;)', r'\1\n' + import_statement, new_content, count=1)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath} - replaced {count} sliders")
    else:
        # Check if there are still input type=range
        if 'type="range"' in content:
            print(f"WARNING: Missed sliders in {filepath}")

files = [
  'src/components/modules/BottleneckResolverModule.tsx',
  'src/components/modules/CascadeTwinSimulator.tsx',
  'src/components/modules/LivingMetastasisCinema.tsx',
  'src/components/modules/CausalMetastasisOracle.tsx',
  'src/components/modules/ResistanceForgeModule.tsx',
  'src/components/modules/ClinicalProactiveInterceptionModule.tsx',
  'src/components/modules/MetastasisSimulationPipelineModule.tsx',
  'src/components/modules/TumorEvolutionMathEngineModule.tsx',
  'src/components/modules/circulatory/Windkessel0DViewer.tsx',
  'src/components/modules/circulatory/WavePropagation1DViewer.tsx',
  'src/components/modules/circulatory/MultiphysicsCFD3DViewer.tsx',
  'src/components/modules/circulatory/BenchtopMockLoopViewer.tsx',
  'src/components/modules/circulatory/CirculatoryMicrodynamicsStage.tsx',
  'src/components/modules/circulatory/OrganVascularBedFiltration.tsx',
  'src/components/modules/circulatory/ExtravasationAdhesionKinetics.tsx',
  'src/components/modules/circulatory/BifurcationHemodynamicsSimulator.tsx',
  'src/components/modules/circulatory/PlateletImmuneCloakingEngine.tsx',
  'src/components/modules/circulatory/WholeBodyMetastaticPerfusionNetwork.tsx',
  'src/components/modules/circulatory/MicroconstrictionNuclearDeformation.tsx',
  'src/components/modules/colonization/BoneNicheEngine.tsx',
  'src/components/modules/colonization/BrainNicheEngine.tsx',
  'src/components/modules/colonization/LiverNicheEngine.tsx',
  'src/components/modules/colonization/LungNicheEngine.tsx',
  'src/components/modules/immune/InterventionScenarioSim.tsx',
  'src/components/modules/immune/ImmuneBiomarkerPredictor.tsx',
  'src/components/modules/ModelValidationBacktestingSuite.tsx',
  'src/components/modules/MetastasisHpcComputeViewer.tsx'
]

for f in files:
    if os.path.exists(f):
        process_file(f)

