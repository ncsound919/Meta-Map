import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# Fix the broken slider replacements
text = text.replace('</>}</>\n/>', '</span>\n</div>')
text = text.replace('</>}\n/>', '</span>\n</div>')
text = text.replace('</>}', '</span>')
text = text.replace('/>\n                  </div>', '</div>')

with open(filepath, 'w') as f:
    f.write(text)

