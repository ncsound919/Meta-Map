import re

filepath = 'src/components/modules/TumorEvolutionMathEngineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

old_str = """<Slider
  label="Selection s:</span>
                      <strong className="text-emerald-400">+{clone.fitnessS * 100}%</strong>
                    </div>"""

new_str = """<div className="space-y-1 text-[10px] font-mono mt-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Selection s:</span>
                      <strong className="text-emerald-400">+{clone.fitnessS * 100}%</strong>
                    </div>"""

text = text.replace(old_str, new_str)

with open(filepath, 'w') as f:
    f.write(text)

