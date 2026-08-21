import re

filepath = 'src/components/modules/MetastasisHpcComputeViewer.tsx'
with open(filepath, 'r') as f:
    content = f.read()

pattern = re.compile(
    r'<div>\s*<label className="text-xs text-slate-300 flex justify-between">\s*<span>(.*?)</span>\s*<span[^>]*>(.*?)</span>\s*</label>\s*<input\s+type="range"\s+min=\{?([^}]+)\}?\s+max=\{?([^}]+)\}?\s+step=\{?([^}]+)\}?\s+value=\{([^}]+)\}\s+onChange=\{e => ([a-zA-Z0-9_]+)\(Number\(e.target.value\)\)\}\s+className="[^"]+"\s*/>\s*</div>',
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
