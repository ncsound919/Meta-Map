import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

text = text.replace('mmHg</span>\n</div>\n', 'mmHg</>}\n/>\n')
text = text.replace('%</strong>\n</div>\n', '%</>}\n/>\n')
text = text.replace('kPa</span>\n</div>\n', 'kPa</>}\n/>\n')
text = text.replace('dyn/cm²</span>\n</div>\n', 'dyn/cm²</>}\n/>\n')

text = text.replace('valueDisplay={""}\n                    </div>\n\n                  <div className="space-y-1">', 'valueDisplay={""}\n                    />\n                  </div>\n\n                  <div className="space-y-1">')

with open(filepath, 'w') as f:
    f.write(text)

