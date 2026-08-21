import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# I see it now. 
# <strong className="text-indigo-300">{nkCellActivity}%</>}
# />

text = text.replace('%</>}\n/>', '%</strong>\n</div>')

with open(filepath, 'w') as f:
    f.write(text)

