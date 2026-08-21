import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

old = """<div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono">
                      <span>NK Cytotoxic Immunity:</span>
                      <strong className="text-indigo-300">{nkCellActivity}%</strong>
</div>
                </div>"""

new = """<div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono">
                      <span>NK Cytotoxic Immunity:</span>
                      <strong className="text-indigo-300">{nkCellActivity}%</strong>
                    </div>
                    <Slider
                      label=""
                      min={10}
                      max={100}
                      step={5}
                      value={nkCellActivity}
                      onChange={setNkCellActivity}
                      valueDisplay={""}
                    />
                  </div>"""

text = text.replace(old, new)

with open(filepath, 'w') as f:
    f.write(text)

