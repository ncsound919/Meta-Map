import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('Hours</span>\n</div>', 'Hours</strong>\n</div>')
text = text.replace('%</span>\n</div>', '%</strong>\n</div>')
text = text.replace('/ div</span>\n</div>', '/ div</strong>\n</div>')

with open(filepath, 'w') as f:
    f.write(text)

