import re

filepath = 'src/components/modules/immune/InterventionScenarioSim.tsx'
with open(filepath, 'r') as f:
    content = f.read()

pattern = re.compile(
    r'<div className="space-y-1">\s*<div className="flex justify-between text-xs font-mono">\s*<span className="text-slate-300">(.*?)</span>\s*<span[^>]*>(.*?)</span>\s*</div>\s*<input\s+type="range"\s+min="([^"]+)"\s+max="([^"]+)"\s+value=\{([^}]+)\}\s+onChange=\{\(e\)\s*=>\s*handleParamChange\(([^,]+),\s*Number\(e.target.value\)\)\}\s+className="[^"]+"\s*/>\s*</div>',
    re.DOTALL
)

def repl(m):
    return (
        f'<Slider\n'
        f'  label="{m.group(1).strip()}"\n'
        f'  min={{{m.group(3)}}}\n'
        f'  max={{{m.group(4)}}}\n'
        f'  step={{1}}\n'
        f'  value={{{m.group(5)}}}\n'
        f'  onChange={{(val) => handleParamChange({m.group(6)}, val)}}\n'
        f'  valueDisplay={{<>{m.group(2).strip()}</>}}\n'
        f'/>'
    )

new_content, count = pattern.subn(repl, content)
if count > 0:
    new_content = "import { Slider } from '../../../ui/Slider';\n" + new_content
    with open(filepath, 'w') as f:
        f.write(new_content)
print(f"Replaced {count}")
