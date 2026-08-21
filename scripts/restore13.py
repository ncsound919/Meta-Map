import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# I see what's happening. I replaced some sliders with raw code that's completely broken because I over-substituted.
# In particular: 
# <strong className="text-emerald-300">{integrinAffinity.toFixed(2)}</strong>
# </div>
# <Slider label="" min={0.1} max={1.0} step={0.05} value={integrinAffinity} onChange={setIntegrinAffinity} valueDisplay={""} />

text = text.replace('valueDisplay={""}\n                      </div>\n\n                    <div className="space-y-1">', 'valueDisplay={""}\n                    />\n                  </div>\n\n                  <div className="space-y-1">')
text = text.replace('</>}</>\n', '</span>\n')
text = text.replace('</>}\n/>', '</span>\n</div>\n')


with open(filepath, 'w') as f:
    f.write(text)

