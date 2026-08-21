import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# I see it now. 
# <strong className="text-amber-300">{mutationRate.toFixed(5)} / div</strong>
# </div>

# We lost the closing tag for `<div className="space-y-1 text-xs">` in line 1170.
# Wait, line 1174 is `</div>`. Then line 1177 is `<div className="grid...`. It means `space-y-1 text-xs` is closed at 1174?
# Wait! In line 1170:
# <div className="space-y-1 text-xs">
#   <div className="flex justify-between text-slate-400 font-mono">
#     <span>Somatic Mutation Rate (μ_SISTEM):</span>
#     <strong className="text-amber-300">{mutationRate.toFixed(5)} / div</strong>
# </div>
#
# It is missing the closing `</div>` for the flex div AND it's missing the actual Slider! Because the Slider was deleted!

old = """<div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono">
                    <span>Somatic Mutation Rate (μ_SISTEM):</span>
                    <strong className="text-amber-300">{mutationRate.toFixed(5)} / div</strong>
</div>"""

new = """<div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono">
                    <span>Somatic Mutation Rate (μ_SISTEM):</span>
                    <strong className="text-amber-300">{mutationRate.toFixed(5)} / div</strong>
                  </div>
                  <Slider
                    label=""
                    min={0.00001}
                    max={0.00080}
                    step={0.00005}
                    value={mutationRate}
                    onChange={setMutationRate}
                    valueDisplay={""}
                  />
                </div>"""

text = text.replace(old, new)

with open(filepath, 'w') as f:
    f.write(text)

