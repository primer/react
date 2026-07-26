import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const entry = path.join(root, 'dist/index.d.ts')
const program = ts.createProgram([entry], {skipLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Bundler})
const checker = program.getTypeChecker()
const src = program.getSourceFile(entry)
const mod = checker.getSymbolAtLocation(src)

const INTEREST = new Set(['size','variant','align','alignment','side','placement','position','shape','type','severity','status','scheme','weight','tone','emphasis','direction','orientation','gap','padding','width','height','loading','disabled','inactive','block','open','defaultOpen','onOpenChange','value','defaultValue','onChange','onValueChange','selected','defaultSelected','checked','defaultChecked'])
const rows = []

function walk(sym, prefix, depth) {
  if (depth > 1) return
  const name = sym.getName()
  const decl = sym.declarations?.[0]
  if (!decl) return
  let type
  try { type = checker.getTypeOfSymbolAtLocation(sym, decl) } catch { return }
  const sigs = type.getCallSignatures()
  if (sigs.length) {
    const params = sigs[0].getParameters()
    if (params[0]) {
      let pt
      try { pt = checker.getTypeOfSymbolAtLocation(params[0], params[0].declarations?.[0] ?? decl) } catch { return }
      for (const prop of pt.getProperties()) {
        const pn = prop.getName()
        if (!INTEREST.has(pn)) continue
        let t = ''
        try { t = checker.typeToString(checker.getTypeOfSymbolAtLocation(prop, prop.declarations?.[0] ?? decl)) } catch {}
        rows.push({component: prefix + name, prop: pn, type: t.replace(/\s+/g,' ').slice(0,150)})
      }
    }
  }
  // Compound parts
  for (const child of type.getProperties()) {
    const cn = child.getName()
    if (!/^[A-Z]/.test(cn)) continue
    walk(child, prefix + name + '.', depth + 1)
  }
}

for (const exp of checker.getExportsOfModule(mod)) {
  const target = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp
  if (!/^[A-Z]/.test(exp.getName())) continue
  walk(target, '', 0)
}
console.log(JSON.stringify(rows))
