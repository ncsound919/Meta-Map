import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('kPa</span>\n</div>', 'kPa</>}\n/>')

with open(filepath, 'w') as f:
    f.write(text)

