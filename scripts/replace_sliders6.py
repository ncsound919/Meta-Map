import re
import os

files = [
  'src/components/modules/circulatory/ExtravasationAdhesionKinetics.tsx',
  'src/components/modules/circulatory/BifurcationHemodynamicsSimulator.tsx',
  'src/components/modules/immune/ImmuneBiomarkerPredictor.tsx',
  'src/components/modules/ModelValidationBacktestingSuite.tsx'
]

def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # match <div class="flex..."><span...>(.*?)</span><strong or span...>(.*?)</strong></div>
    pattern = re.compile(
        r'<div[^>]*className="[^"]*space-y-[1234][^"]*"[^>]*>\s*<div[^>]*className="flex justify-between[^"]*"[^>]*>\s*<span[^>]*>(.*?)</span>\s*<(?:span|strong)[^>]*>(.*?)</(?:span|strong)>\s*</div>\s*<input\s+type="range"\s+min="([^"]+)"\s+max="([^"]+)"(?:\s+step="([^"]+)")?\s+value=\{([^}]+)\}\s+onChange=\{\(.*?\)\s*=>\s*([a-zA-Z0-9_]+)\(.*?\}\s+className="[^"]+"\s*/>\s*(<div[^>]*>.*?</div>)?\s*</div>',
        re.DOTALL
    )

    def repl(m):
        label = m.group(1).strip()
        value_display = m.group(2).strip()
        min_val = m.group(3)
        max_val = m.group(4)
        step_val = m.group(5) if m.group(5) else "1"
        value_var = m.group(6)
        setter = m.group(7)
        optional_div = m.group(8) or ""

        slider_str = (
            f'<Slider\n'
            f'  label="{label}"\n'
            f'  min={{{min_val}}}\n'
            f'  max={{{max_val}}}\n'
            f'  step={{{step_val}}}\n'
            f'  value={{{value_var}}}\n'
            f'  onChange={{{setter}}}\n'
            f'  valueDisplay={{<>{value_display}</>}}\n'
            f'/>'
        )
        if optional_div:
             return f'<div className="space-y-1">\n  {slider_str}\n  {optional_div}\n</div>'
        return slider_str

    new_content, count = pattern.subn(repl, content)

    if count > 0:
        if "import { Slider }" not in new_content:
            depth = len(filepath.split('/')) - 3
            if depth < 0: depth = 0
            dots = "../" * depth if depth > 0 else "./"
            import_statement = f"import {{ Slider }} from '{dots}ui/Slider';\n"
            
            new_content = re.sub(r'(import React[^;]+;)', r'\1\n' + import_statement, new_content, count=1)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath} - replaced {count} sliders")

for f in files:
    process_file(f)

