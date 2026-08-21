import re

filepath = 'src/components/modules/MetastasisSimulationPipelineModule.tsx'
with open(filepath, 'r') as f:
    text = f.read()

# Fix 1: Stage 1
old1 = """<Slider
  label="P1: INVASION & EMT"
  min={0.5}
  max={10.0}
  step={0.5}
  value={mmpConcentration}
  onChange={setMmpConcentration}
  valueDisplay={<>STAGE 1</span>
              </div>"""

new1 = """<div className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-2">
                <span className="text-slate-400">P1: INVASION & EMT</span>
                <span className="text-cyan-400 font-bold px-2 py-0.5 bg-cyan-900/40 rounded">STAGE 1</span>
              </div>"""

text = text.replace(old1, new1)

# Fix 2: Stage 2
old2 = """<Slider
  label="P2: INTRAVASATION"
  min={0}
  max={72}
  step={2}
  value={simTimeHours}
  onChange={setSimTimeHours}
  valueDisplay={<>STAGE 2</span>
              </div>"""

new2 = """<div className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-2">
                <span className="text-slate-400">P2: INTRAVASATION</span>
                <span className="text-indigo-400 font-bold px-2 py-0.5 bg-indigo-900/40 rounded">STAGE 2</span>
              </div>"""

text = text.replace(old2, new2)

# Fix 3: Stage 2 Micro-Engine
old3 = """<Slider
  label="<Zap className="w-3.5 h-3.5 text-indigo-400" /> MICRO-ENGINE: CTC HEMODYNAMIC SURVIVAL SOLVER"
  min={10}
  max={100}
  step={5}
  value={nkCellActivity}
  onChange={setNkCellActivity}
  valueDisplay={<>Lattice Boltzmann CFD</span>
                </div>"""

new3 = """<div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" /> MICRO-ENGINE: CTC HEMODYNAMIC SURVIVAL SOLVER
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">Lattice Boltzmann CFD</span>
                </div>"""

text = text.replace(old3, new3)

# Fix 4: Stage 3 Micro-Engine
old4 = """<Slider
  label="<Zap className="w-3.5 h-3.5 text-emerald-400" /> MICRO-ENGINE: EXTRAVASATION & NICHE SOLVER"
  min={0.1}
  max={1.0}
  step={0.05}
  value={integrinAffinity}
  onChange={setIntegrinAffinity}
  valueDisplay={<>Integrin Kinetics & LOX</span>
                </div>"""

new4 = """<div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> MICRO-ENGINE: EXTRAVASATION & NICHE SOLVER
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">Integrin Kinetics & LOX</span>
                </div>"""

text = text.replace(old4, new4)

# Fix 5: Endothelial
old5 = """<strong className="text-emerald-300">{integrinAffinity.toFixed(2)}</>}
/>

                  <Slider
  label="Endothelial Permeability:"
  min={0.5}
  max={3.0}
  step={0.1}
  value={endothelialPermeability}
  onChange={setEndothelialPermeability}
  valueDisplay={<>{endothelialPermeability.toFixed(1)}x</>}
/>"""

new5 = """<strong className="text-emerald-300">{integrinAffinity.toFixed(2)}</strong>
                    </div>
                    <Slider
                      label=""
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={integrinAffinity}
                      onChange={setIntegrinAffinity}
                      valueDisplay={""}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono">
                      <span>Endothelial Permeability:</span>
                      <strong className="text-amber-300">{endothelialPermeability.toFixed(1)}x</strong>
                    </div>
                    <Slider
                      label=""
                      min={0.5}
                      max={3.0}
                      step={0.1}
                      value={endothelialPermeability}
                      onChange={setEndothelialPermeability}
                      valueDisplay={""}
                    />"""
text = text.replace(old5, new5)

# Fix 6: SISTEM
old6 = """<Slider
  label="{clone.cloneId}"
  min={0.00001}
  max={0.00080}
  step={0.00005}
  value={mutationRate}
  onChange={setMutationRate}
  valueDisplay={<>{(clone.fraction * 100).toFixed(0)}% Pop</span>
                      </div>"""

new6 = """<div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-white font-bold">{clone.cloneId}</span>
                        <span className="text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded">{(clone.fraction * 100).toFixed(0)}% Pop</span>
                      </div>"""
text = text.replace(old6, new6)

with open(filepath, 'w') as f:
    f.write(text)

