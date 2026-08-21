import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('%</strong>\n</div>', '%</>}\n/>')
text = text.replace('kPa</strong>\n</div>', 'kPa</>}\n/>')
text = text.replace('/ div</strong>\n</div>', '/ div</>}\n/>')

with open(filepath, 'w') as f:
    f.write(text)

