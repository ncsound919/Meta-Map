import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('mmHg</strong>\n</div>', 'mmHg</>}\n/>')

with open(filepath, 'w') as f:
    f.write(text)

