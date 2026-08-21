import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# Fix the dangling closing tags
text = text.replace('468:   468	  valueDisplay={<>{(emtSwitchProbability * 100).toFixed(0)}%</strong>', '468:   468	  valueDisplay={<>{(emtSwitchProbability * 100).toFixed(0)}%</>}')
text = text.replace('valueDisplay={<>{(emtSwitchProbability * 100).toFixed(0)}%</strong>', 'valueDisplay={<>{(emtSwitchProbability * 100).toFixed(0)}%</>}')

text = text.replace('1126:  1126	          )}\n', '1126:  1126	          )}\n') # nothing here

text = text.replace('  917\t          )}\n', '  917\t          )}\n')
# Looking closely at the compile output, it complained about:
# 917|            )}
# 1024|           )}
# 1229|           )}
# All saying: The character "}" is not valid inside a JSX element
# Oh, that's because there is no opening `{`!
text = text.replace('            )}\n\n          {/* Stage 2 Solver Outputs */}', '            </div>\n\n          {/* Stage 2 Solver Outputs */}')
text = text.replace('            )}\n\n          {/* Stage 3 Solver Outputs */}', '            </div>\n\n          {/* Stage 3 Solver Outputs */}')
text = text.replace('            )}\n\n          {/* Stage 4 Solver Outputs */}', '            </div>\n\n          {/* Stage 4 Solver Outputs */}')
text = text.replace('            )}\n          </div>\n        )}', '            </div>\n          </div>\n        )}')

with open(filepath, 'w') as f:
    f.write(text)

