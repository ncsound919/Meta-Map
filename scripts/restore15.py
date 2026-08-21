import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# I see what's happening. The replacements missed some things. Let me just replace the entire component with a known good state or fix it manually.
# Let's fix line 991-995: 
text = text.replace('%</>}\n/>\n                  </div>', '%</strong>\n                  </div>')

# Fix line 1171-1175
text = text.replace('/ div</span>\n</div>', '/ div</strong>\n</div>')

# Fix the extra `)}` closing tags at 917, 1024, 1229 by counting them.
# The `)}` are probably caused by the Tabs rendering block:
# {activeStageTab === 'stage1' && ( ... )}

with open(filepath, 'w') as f:
    f.write(text)

