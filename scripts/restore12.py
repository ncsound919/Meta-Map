import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('/>\n            )}', '</div>\n            )}')
text = text.replace('%</>}\n/>', '%</strong>\n</div>')
text = text.replace('valueDisplay={""}\n                    />\n                  </div>', 'valueDisplay={""}\n                    />\n                  </div>')

# Actually, the parsing errors in 990:
# <strong className="text-indigo-300">{nkCellActivity}%</>}
text = text.replace('%</>}\n/>\n                  </div>', '%</strong>\n</div>')
text = text.replace('%</>}\n/>', '%</strong>\n</div>')
text = text.replace(')}', ')}') # wait, I need to check line 914

with open(filepath, 'w') as f:
    f.write(text)

