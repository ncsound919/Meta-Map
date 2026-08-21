import re

filepath = 'src/components/modules/circulatory/CirculatoryMicrodynamicsStage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

pattern = re.compile(
    r'<div className="space-y-1 text-xs">\s*<label[^>]*>\s*<span>(.*?)</span>\s*<span[^>]*>(.*?)</span>\s*</label>\s*<input\s+id="[^"]*"\s+type="range"\s+min="([^"]+)"\s+max="([^"]+)"\s+step="([^"]+)"\s+value=\{([^}]+)\}\s+onChange=\{\(e\)\s*=>\s*([a-zA-Z0-9_]+)\(.*?\)\}\s+className="[^"]+"\s*/>\s*</div>',
    re.DOTALL
)

def repl(m):
    return (
        f'<Slider\n'
        f'  label="{m.group(1).strip()}"\n'
        f'  min={{{m.group(3)}}}\n'
        f'  max={{{m.group(4)}}}\n'
        f'  step={{{m.group(5)}}}\n'
        f'  value={{{m.group(6)}}}\n'
        f'  onChange={{{m.group(7)}}}\n'
        f'  valueDisplay={{<>{m.group(2).strip()}</>}}\n'
        f'/>'
    )

new_content, count = pattern.subn(repl, content)
if count > 0:
    new_content = "import { Slider } from '../../ui/Slider';\n" + new_content
    with open(filepath, 'w') as f:
        f.write(new_content)
print(f"Replaced {count}")
