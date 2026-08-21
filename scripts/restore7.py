import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('</>}\n/>', '</>}\n/>\n')
text = text.replace('/>\n  <p className="text-[10px] text-slate-400">', '/>\n  <p className="text-[10px] text-slate-400">')

# Wait, if line 451 is `<>{oxygenHypoxiaThreshold} mmHg</>}` and 452 is `/>`, that is correct Slider syntax.
# Why did it complain about `/>\n  <p`? Oh, it was complaining about `</span>\n</div>` earlier! I fixed that!
