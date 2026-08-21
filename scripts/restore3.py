import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('μM</span>\n/>\n', 'μM</span>\n</div>\n')
text = text.replace('Hours</span>\n/>\n', 'Hours</span>\n</div>\n')
text = text.replace('%</span>\n/>\n', '%</span>\n</div>\n')
text = text.replace('/ div</span>\n/>\n', '/ div</span>\n</div>\n')

with open(filepath, 'w') as f:
    f.write(text)

