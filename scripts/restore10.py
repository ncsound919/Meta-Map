import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('dyn/cm²</span>\n</div>', 'dyn/cm²</>}\n/>')
text = text.replace('cells / mL</span>\n</div>', 'cells / mL</>}\n/>')

with open(filepath, 'w') as f:
    f.write(text)

