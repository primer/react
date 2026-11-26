import {globSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {parseArgs} from 'node:util'
import prettier from '@prettier/sync'
import {register} from 'tsx/esm/api'
import ts from 'typescript'
import type {ComponentDocs, ComponentProp} from '../src/docs/components'

const {values} = parseArgs({options: {check: {type: 'boolean'}, write: {type: 'boolean'}}})
const checkOnly = Boolean(values.check) && !values.write
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(packageRoot, 'src')
const BARRELS = ['', '/experimental', '/deprecated', '/next'].map(x => `@primer/react${x}`)
const ANCHOR_ATTRS = new Set('download hrefLang media ping rel target type referrerPolicy'.split(' '))
const PRIMER_DEP_RE = /\/node_modules\/(?:@primer\/(?:behaviors|octicons-react)|@github\/relative-time-element)\//
const REACT_EL_RE = /\b(?:React\.)?ReactElement<any(?:,\s*string\s*\|\s*JSXElementConstructor<any>)?>/g

type TextEdit = {readonly start: number; readonly end: number; readonly replacement: string}
type CompTarget = {name: string; type: ts.Type; sym?: ts.Symbol; anchor: ts.Node}
type PropMeta = {syms: Set<ts.Symbol>; decls: ts.Declaration[]; req: Set<ts.Type>; required: boolean; types: ts.Type[]}
type SyncCtx = {sf: ts.SourceFile; docDir: string; edits: TextEdit[]; fail: (target: string, msg: string) => undefined}

const configFile = ts.readConfigFile(path.join(packageRoot, 'tsconfig.build.json'), ts.sys.readFile)
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, packageRoot)
const program = ts.createProgram({rootNames: parsedConfig.fileNames, options: parsedConfig.options})
const checker = program.getTypeChecker()
const q = JSON.stringify
const fileOf = (n: ts.Node) => n.getSourceFile().fileName
const inSrc = (n: ts.Node) => fileOf(n).startsWith(`${srcDir}/`)
const resolveAlias = (sym: ts.Symbol) => (sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym)
const declOf = (sym: ts.Symbol, fallback: ts.Node) => sym.valueDeclaration ?? sym.declarations?.[0] ?? fallback
const isInternalProp = (name: string) => name === '__SLOT__' || name === 'key' || /^(?:_|data-)/.test(name)

const entryExports = new Map(
  BARRELS.map(imp => {
    const sf = program.getSourceFile(path.join(srcDir, imp.slice('@primer/react'.length), 'index.ts'))
    const mod = sf && checker.getSymbolAtLocation(sf)
    return [imp, new Map((mod ? checker.getExportsOfModule(mod) : []).map(e => [e.getName(), resolveAlias(e)]))]
  }),
)

function unwrapMemo(type: ts.Type, anchor: ts.Node): ts.Type {
  const prop = !type.getCallSignatures().length ? type.getProperty('type') : undefined
  return prop ? checker.getTypeOfSymbolAtLocation(prop, anchor) : type
}
const isCallable = (t: ts.Type, a: ts.Node): boolean =>
  Boolean(unwrapMemo(t, a).getCallSignatures().length || unwrapMemo(t, a).getConstructSignatures().length) ||
  (t.isIntersection() && t.types.some(m => isCallable(m, a)))

function resolveTarget(importPath: string, rawName: string, fallback?: ts.Node): CompTarget | undefined {
  const [head, ...rest] = (rawName === 'Column options' ? 'Column' : rawName).split('.')
  const sym = entryExports.get(importPath)?.get(head)
  const anchor = sym?.valueDeclaration ?? sym?.declarations?.[0] ?? fallback
  if (!sym || !anchor) return undefined
  if (!rest.length && !(sym.flags & ts.SymbolFlags.Value)) {
    const isType = Boolean(fallback && sym.flags & ts.SymbolFlags.Type)
    return isType ? {name: rawName, type: checker.getDeclaredTypeOfSymbol(sym), sym, anchor} : undefined
  }
  if (!(sym.flags & ts.SymbolFlags.Value)) return undefined
  let cur: ts.Type | undefined = checker.getTypeOfSymbolAtLocation(sym, anchor)
  let curSym: ts.Symbol | undefined = sym
  for (const part of rest) {
    const p: ts.Symbol | undefined = cur?.getProperty(part)
    curSym = p && resolveAlias(p)
    cur = p && checker.getTypeOfSymbolAtLocation(p, declOf(p, anchor))
  }
  return cur && (fallback || isCallable(cur, anchor)) ? {name: rawName, type: cur, sym: curSym, anchor} : undefined
}

function discoverSubs(prefix: string, compType: ts.Type, anchor: ts.Node, out = new Map<string, CompTarget>()) {
  for (const prop of compType.getProperties()) {
    const name = prop.getName()
    if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) continue
    const type = checker.getTypeOfSymbolAtLocation(prop, declOf(prop, anchor))
    const fullName = `${prefix}.${name}`
    if (!isCallable(type, anchor) || out.has(fullName)) continue
    out.set(fullName, {name: fullName, type, sym: resolveAlias(prop), anchor})
    discoverSubs(fullName, type, anchor, out)
  }
  return out
}

function isForwardRef(type: ts.Type, sym: ts.Symbol | undefined, anchor: ts.Node): boolean {
  const t = unwrapMemo(type, anchor)
  const name = t.getSymbol()?.getName() ?? t.aliasSymbol?.getName()
  if (name === 'ForwardRefExoticComponent' || name === 'ForwardRefComponent') return true
  if (t.getCallSignatures().some(s => fileOf(s.getDeclaration()).endsWith('/modern-polymorphic.ts'))) return true
  if (t.isIntersection() && t.types.some(m => isForwardRef(m, undefined, anchor))) return true
  return Boolean(sym?.declarations?.some(d => /\b(?:fixedForwardRef|forwardRef)\s*\(/.test(d.getText())))
}

function extractTargetProps(t: CompTarget, isIface: boolean) {
  const isPoly = (sig: ts.Signature) =>
    fileOf(sig.getDeclaration()).endsWith('/utils/polymorphic.ts') && Boolean(sig.getTypeParameters()?.length)
  const sigs = isIface ? [] : unwrapMemo(t.type, t.anchor).getCallSignatures()
  const params = sigs.filter(sig => !isPoly(sig)).flatMap(sig => sig.parameters.slice(0, 1))
  const paramTypes = isIface ? [t.type] : params.map(p => checker.getTypeOfSymbolAtLocation(p, declOf(p, t.anchor)))
  const flat = paramTypes.flatMap(pt => (pt.isUnion() ? pt.types : [pt]))
  const branches = flat.filter(bt => !(bt.flags & ts.TypeFlags.Never) && checker.typeToString(bt) !== 'never')
  const leaves = (bt: ts.Type): ts.Type[] =>
    !bt.getProperties().length && bt.isIntersection() ? bt.types.flatMap(leaves) : [bt]
  let hasStringIndex = false
  const props = new Map<string, PropMeta>()
  for (const branch of branches) {
    const seen = new Set<string>()
    for (const bt of leaves(branch)) {
      if (checker.getIndexTypeOfType(bt, ts.IndexKind.String)) hasStringIndex = true
      for (const sym of bt.getProperties()) {
        const pt = checker.getTypeOfSymbolAtLocation(sym, declOf(sym, t.anchor))
        if (pt.flags & (ts.TypeFlags.Never | ts.TypeFlags.Undefined)) continue
        const name = sym.getName()
        const cur = props.get(name) ?? {syms: new Set(), decls: [], req: new Set(), required: false, types: []}
        if (!seen.has(name)) cur.types.push(pt)
        seen.add(name)
        if (!(sym.flags & ts.SymbolFlags.Optional)) cur.req.add(branch)
        cur.syms.add(sym)
        for (const d of sym.declarations ?? []) if (!cur.decls.includes(d)) cur.decls.push(d)
        cur.required = cur.req.size === branches.length
        props.set(name, cur)
      }
    }
  }
  return {props, hasStringIndex}
}

const quoteDefault = (str: string) => (str === '' ? '""' : `'${str.replace(/'/g, "\\'")}'`)
const normalizeDefault = (v: string) =>
  /^(['"]).*\1$/.test(v.trim()) ? v.trim().slice(1, -1).replace(/\\'/g, "'") : v.trim()
const literalToDefault = (expr: ts.Expression): string | undefined => {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return quoteDefault(expr.text)
  const raw = expr.getText().replace(/\s+/g, '')
  return /^(?:true|false|null|\[\]|\{\}|-?\d+(?:\.\d+)?)$/.test(raw) ? raw : undefined
}

function findComponentFns(sym?: ts.Symbol, seen = new Set<ts.Symbol>()): ts.FunctionLikeDeclaration[] {
  const resolved = sym && resolveAlias(sym)
  if (!sym || !resolved || seen.has(sym) || seen.has(resolved)) return []
  seen.add(sym).add(resolved)
  const out: ts.FunctionLikeDeclaration[] = []
  const addSym = (s?: ts.Symbol) => out.push(...findComponentFns(s, seen))
  const visit = (n?: ts.Node): void => {
    if (!n) return
    if (ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n)) out.push(n)
    else if (ts.isVariableDeclaration(n) || ts.isPropertyAssignment(n)) visit(n.initializer)
    else if (ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isParenthesizedExpression(n)) visit(n.expression)
    else if (ts.isShorthandPropertyAssignment(n)) addSym(checker.getShorthandAssignmentValueSymbol(n))
    else if (ts.isIdentifier(n) || ts.isPropertyAccessExpression(n)) addSym(checker.getSymbolAtLocation(n))
    else if (ts.isCallExpression(n)) {
      const firstOnly = /^(?:[\w.]+\.)?assign$|^asSlot$/.test(n.expression.getText())
      for (const arg of firstOnly ? n.arguments.slice(0, 1) : n.arguments) visit(arg)
    }
  }
  for (const d of resolved.declarations ?? []) visit(d)
  return out
}

function extractImplMeta(sym?: ts.Symbol) {
  const defaults = new Map<string, string>()
  const discarded = new Set<string>()
  for (const fn of findComponentFns(sym).reverse()) {
    const bound = new Set<string>()
    const p = fn.parameters.at(0)?.name
    let rest = p && ts.isIdentifier(p) ? p.text : undefined
    const body = fn.body?.getText() ?? ''
    for (const el of p && ts.isObjectBindingPattern(p) ? p.elements : []) {
      if (el.dotDotDotToken && ts.isIdentifier(el.name)) rest = el.name.text
      const k = !el.dotDotDotToken ? (el.propertyName ?? el.name) : undefined
      if (!k || (!ts.isIdentifier(k) && !ts.isStringLiteral(k))) continue
      bound.add(k.text)
      const lit = el.initializer && literalToDefault(el.initializer)
      if (lit) defaults.set(k.text, lit)
      if (el.propertyName && el.name.getText() === `_${k.text}` && !new RegExp(`\\b_${k.text}\\b`).test(body))
        discarded.add(k.text)
    }
    const isRest = (a: ts.JsxAttributeLike) =>
      ts.isJsxSpreadAttribute(a) && ts.isIdentifier(a.expression) && a.expression.text === rest
    const visitJsx = (n: ts.Node): void => {
      if (ts.isJsxOpeningLikeElement(n) && n.attributes.properties.some(isRest)) {
        for (const a of n.attributes.properties) {
          if (isRest(a)) break
          if (!ts.isJsxAttribute(a) || !ts.isIdentifier(a.name) || bound.has(a.name.text)) continue
          const expr = a.initializer && ts.isJsxExpression(a.initializer) ? a.initializer.expression : a.initializer
          const lit = !a.initializer ? 'true' : expr && literalToDefault(expr)
          if (lit) defaults.set(a.name.text, lit)
        }
      }
      ts.forEachChild(n, visitJsx)
    }
    if (rest && fn.body) visitJsx(fn.body)
  }
  return {defaults, discarded}
}

const tagText = (t: ts.JSDocTag) =>
  (typeof t.comment === 'string' ? t.comment : (ts.getTextOfJSDocComment(t.comment) ?? '')).trim()
const getTsStringUnion = (types: ReadonlyArray<ts.Type>) => {
  const noUndef = (m: ts.Type) => !(m.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Never))
  const list = types.flatMap(t => (t.isUnion() ? t.types : [t])).filter(noUndef)
  return list.length > 0 && list.every(m => m.isStringLiteral()) ? new Set(list.map(m => m.value)) : undefined
}
const parseStringUnion = (text: string) => {
  const parts = text.split('|').flatMap(p => (p.trim() ? [p.trim()] : []))
  const ok = parts.length > 0 && parts.every(p => /^'[^']*'$|^"[^"]*"$/.test(p))
  return ok ? new Set(parts.map(p => p.slice(1, -1))) : undefined
}

function getExpectedDefault(name: string, prop: PropMeta, implDefaults: ReadonlyMap<string, string>) {
  const impl = implDefaults.get(name)
  const hasNull = prop.types.some(t => (t.isUnion() ? t.types : [t]).some(m => Boolean(m.flags & ts.TypeFlags.Null)))
  if (impl) return impl === 'null' && !hasNull ? undefined : impl
  for (const tag of prop.decls.flatMap(d => ts.getJSDocTags(d))) {
    const raw = tag.tagName.text === 'default' || tag.tagName.text === 'defaultValue' ? tagText(tag) : ''
    if (!raw || raw.includes('\n')) continue
    if (/^(?:true|false|-?\d+(?:\.\d+)?)$/.test(raw)) return raw
    if (/^(['"]).*\1$/.test(raw)) return quoteDefault(raw.slice(1, -1))
    if (getTsStringUnion(prop.types)?.has(raw)) return `'${raw}'`
  }
  return undefined
}

const normalizeTypeString = (str: string) =>
  str.replace(REACT_EL_RE, 'React.ReactElement').replace(/(?<![.\w])(ReactNode|ElementType)\b/g, 'React.$1')

function formatTypeParts(node: ts.TypeNode, seen = new Set<ts.Node>()): string[] {
  if (ts.isParenthesizedTypeNode(node)) return formatTypeParts(node.type, seen)
  if (ts.isUnionTypeNode(node)) {
    const members = node.types.filter(m => m.kind !== ts.SyntaxKind.UndefinedKeyword)
    return [...new Set(members.flatMap(m => formatTypeParts(m, seen)))]
  }
  const idx = ts.isIndexedAccessTypeNode(node) && ts.isLiteralTypeNode(node.indexType) ? node.indexType.literal : null
  if (ts.isIndexedAccessTypeNode(node) && idx && ts.isStringLiteral(idx)) {
    const prop = checker.getTypeFromTypeNode(node.objectType).getProperty(idx.text)
    const decl = prop?.declarations?.find(ts.isPropertySignature)
    if (decl?.type && inSrc(decl) && !seen.has(decl)) return formatTypeParts(decl.type, new Set([...seen, decl]))
  }
  const raw = node.getText().replace(/\s+/g, ' ').trim()
  return [normalizeTypeString(raw.replace(/^"(.*)"$/, "'$1'"))]
}

function formatPropType(prop: PropMeta): string {
  const tsU = getTsStringUnion(prop.types)
  const decl = prop.decls.find((d): d is ts.PropertySignature => ts.isPropertySignature(d) && inSrc(d))
  const ast = decl?.type ? formatTypeParts(decl.type).join(' | ') : ''
  if (ast && !/\b(?:Component|Function|Object)\b/.test(ast) && (!tsU || parseStringUnion(ast)?.size === tsU.size)) {
    return ast
  }
  if (tsU) return [...tsU].map(quoteDefault).join(' | ')
  const raw = checker.typeToString(
    checker.getNonNullableType(prop.types[0]),
    undefined,
    ts.TypeFormatFlags.NoTruncation,
  )
  return normalizeTypeString(raw.replace(/"([^"\\]*)"/g, "'$1'"))
}

function extractDescription(prop: PropMeta): string {
  let doc = ''
  for (const sym of prop.syms) doc ||= ts.displayPartsToString(sym.getDocumentationComment(checker)).trim()
  doc = doc.replace(/\s*\n\s*/g, ' ')
  const dep = prop.decls.flatMap(d => ts.getJSDocTags(d)).find(t => t.tagName.text === 'deprecated')
  if (doc) return dep && !/^deprecated\b/i.test(doc) ? `Deprecated. ${doc}` : doc
  const note = dep ? tagText(dep).replace(/\s*\n\s*/g, ' ') : ''
  return dep ? (note ? `Deprecated. ${note}` : 'Deprecated.') : ''
}

function isOwnPublicProp(name: string, prop: PropMeta, docDir: string, discarded: ReadonlySet<string>): boolean {
  if (isInternalProp(name) || name === 'ref') return false
  const {decls} = prop
  if (decls.length > 0 && decls.every(d => ts.isMethodDeclaration(d) || ts.isMethodSignature(d))) return false
  if (decls.some(ts.isGetAccessorDeclaration) && !decls.some(ts.isSetAccessorDeclaration)) return false
  if (discarded.has(name) && !extractDescription(prop)) return false
  const ownDecls = decls.filter(d => fileOf(d).startsWith(`${docDir}/`))
  if (!ownDecls.length && !decls.some(d => PRIMER_DEP_RE.test(fileOf(d)))) return false
  const isLinkAlias = (d: ts.Declaration) =>
    ts.isTypeAliasDeclaration(d.parent.parent) && /^Link(?:Button)?Props$/.test(d.parent.parent.name.text)
  return !(ANCHOR_ATTRS.has(name) && ownDecls.length > 0 && ownDecls.every(isLinkAlias))
}

const getProp = (o: ts.ObjectLiteralExpression | undefined, k: string) =>
  o?.properties.find((p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p) && p.name.getText() === k)
const getArrayProp = (o: ts.ObjectLiteralExpression | undefined, k: string) => {
  const init = getProp(o, k)?.initializer
  return init && ts.isArrayLiteralExpression(init) ? init : undefined
}
function serializeProp(p: ComponentProp, multiline = false): string {
  const kv = [`name: ${q(p.name)}`, `type: ${q(p.type)}`, `description: ${q(p.description)}`, `required: ${p.required}`]
  if (p.defaultValue !== undefined) kv.push(`defaultValue: ${q(p.defaultValue)}`)
  return multiline ? `{\n${kv.join(',\n')}\n}` : `{${kv.join(', ')}}`
}

function syncProps(ctx: SyncCtx, t: CompTarget, docProps: ComponentProp[], arrayNode?: ts.ArrayLiteralExpression) {
  const {sf, docDir, edits, fail} = ctx
  const isIface = !isCallable(t.type, t.anchor)
  const {props: tsProps, hasStringIndex} = extractTargetProps(t, isIface)
  const canRef = isIface || isForwardRef(t.type, t.sym, t.anchor)
  const {defaults, discarded} = extractImplMeta(isIface ? undefined : t.sym)
  const documented = new Set(docProps.map(p => p.name))
  const kept = docProps.map(dp => {
    if (isInternalProp(dp.name)) return fail(t.name, `internal prop "${dp.name}" must not be documented`)
    if (dp.name === 'ref') return canRef ? dp : fail(t.name, 'unknown prop "ref" (component does not forward refs)')
    const tp = tsProps.get(dp.name)
    if (!tp && ((hasStringIndex && !tsProps.size) || (dp.name === 'href' && tsProps.has('as')))) return dp
    if (!tp) return fail(t.name, `unknown prop "${dp.name}"`)
    let next = dp
    if (dp.required !== tp.required) {
      fail(t.name, `prop "${dp.name}" required is ${dp.required}, expected ${tp.required}`)
      next = {...next, required: tp.required}
    }
    const def = getExpectedDefault(dp.name, tp, defaults)
    if (dp.defaultValue !== undefined && def && normalizeDefault(dp.defaultValue) !== normalizeDefault(def)) {
      fail(t.name, `prop "${dp.name}" defaultValue is ${q(dp.defaultValue)}, expected ${q(def)}`)
      next = {...next, defaultValue: def}
    }
    const docU = parseStringUnion(dp.type)
    const tsU = getTsStringUnion(tp.types)
    const uDrift = docU && tsU && (docU.size !== tsU.size || ![...docU].every(v => tsU.has(v)))
    const fmt = /\b(?:Component|Function|Object)\b/.test(dp.type) || uDrift ? formatPropType(tp) : dp.type
    if (fmt !== dp.type) {
      fail(t.name, `prop "${dp.name}" type is ${q(dp.type)}, expected ${q(fmt)}`)
      next = {...next, type: fmt}
    }
    return next
  })

  const added: ComponentProp[] = []
  for (const [name, tp] of tsProps) {
    if (documented.has(name) || !isOwnPublicProp(name, tp, docDir, discarded)) continue
    if (arrayNode) fail(t.name, `missing prop "${name}"`)
    const def = getExpectedDefault(name, tp, defaults)
    const base = {name, type: formatPropType(tp), description: extractDescription(tp), required: tp.required}
    added.push(def ? {...base, defaultValue: def} : base)
  }

  if (arrayNode && (kept.some((r, i) => r !== docProps[i]) || added.length > 0)) {
    const items = kept.flatMap((r, i) => {
      if (!r) return []
      const el = arrayNode.elements[i]
      if (r === docProps[i]) return [sf.text.slice(el.getFullStart(), el.getEnd()).trim()]
      const lead = sf.text.slice(el.getFullStart(), el.getStart(sf)).trim()
      const body = serializeProp(r, el.getText(sf).includes('\n'))
      return [lead ? `${lead}\n${body}` : body]
    })
    items.push(...added.map(p => serializeProp(p)))
    const replacement = items.length ? `[\n${items.join(',\n')}\n]` : '[]'
    edits.push({start: arrayNode.getStart(sf), end: arrayNode.getEnd(), replacement})
  }
  return added
}

function syncFile(relPath: string, doc: ComponentDocs | undefined, errors: string[]) {
  const filePath = path.join(packageRoot, relPath)
  const sf = program.getSourceFile(filePath)
  const exp = sf?.statements.find(ts.isExportAssignment)?.expression
  const arg = exp && ts.isCallExpression(exp) ? exp.arguments.at(0) : undefined
  const root = arg && ts.isObjectLiteralExpression(arg) ? arg : undefined
  const importNode = getProp(root, 'importPath')?.initializer
  const propsNode = getArrayProp(root, 'props')
  const subsNode = getArrayProp(root, 'subcomponents')
  if (!doc || !sf || !importNode || !propsNode || !subsNode) {
    errors.push(`${relPath}: file: missing default export defineComponent({...})`)
    return 'invalid' as const
  }
  const edits: TextEdit[] = []
  const fail = (target: string, msg: string): undefined => void errors.push(`${relPath}: ${target}: ${msg}`)
  const candidates = [doc.importPath, `@primer/react${doc.status === 'stable' ? '' : `/${doc.status}`}`, ...BARRELS]
  const activeImport = candidates.find(imp => Boolean(resolveTarget(imp, doc.name)))
  if (!activeImport) {
    fail(doc.name, `not exported as a component from ${doc.importPath}`)
    return 'unchanged' as const
  }
  if (activeImport !== doc.importPath) {
    fail(doc.name, `not exported from ${doc.importPath} (exported from ${activeImport})`)
    edits.push({start: importNode.getStart(sf), end: importNode.getEnd(), replacement: q(activeImport)})
  }
  const rootComp = resolveTarget(activeImport, doc.name)!
  const ctx: SyncCtx = {sf, docDir: path.dirname(filePath), edits, fail}
  syncProps(ctx, rootComp, doc.props, propsNode)

  const discovered = discoverSubs(doc.name, rootComp.type, rootComp.anchor)
  for (const sub of doc.subcomponents) {
    const comp = !sub.name.includes('.') && sub.name !== doc.name ? resolveTarget(activeImport, sub.name) : undefined
    if (comp) discoverSubs(sub.name, comp.type, comp.anchor, discovered)
  }
  const documentedSubs = new Set(doc.subcomponents.map(sub => sub.name))
  const elems = subsNode.elements
  for (const [subName, subTarget] of discovered) {
    if (documentedSubs.has(subName)) continue
    fail(subName, 'missing subcomponent')
    const created = syncProps(ctx, subTarget, []).map(p => serializeProp(p))
    const pfx = `${subName.split('.')[0]}.`
    const sibs = doc.subcomponents.map((x, i) => ({n: x.name, i})).filter(x => x.n.startsWith(pfx))
    const nextSib = sibs.every((x, i) => i === 0 || sibs[i - 1].n <= x.n) ? sibs.find(x => subName < x.n)?.i : undefined
    const at = nextSib ?? (sibs.length ? sibs.at(-1)!.i + 1 : elems.length)
    const pos = at < elems.length ? elems[at].getStart(sf) : subsNode.getEnd() - 1
    const pre = at >= elems.length && elems.length > 0 && !elems.hasTrailingComma ? ',' : ''
    const suf = at < elems.length || elems.hasTrailingComma ? ',' : ''
    const item = `{name: ${q(subName)}, displayName: ${q(subName)}, props: [${created.join(', ')}]}`
    edits.push({start: pos, end: pos, replacement: `${pre}${item}${suf}`})
  }
  for (const [i, sub] of doc.subcomponents.entries()) {
    const subEl = elems.at(i)
    const target = discovered.get(sub.name) ?? resolveTarget(activeImport, sub.name, rootComp.anchor)
    const arr = subEl && ts.isObjectLiteralExpression(subEl) ? getArrayProp(subEl, 'props') : undefined
    if (!target) fail(sub.name, 'unknown subcomponent')
    else syncProps(ctx, target, sub.props, arr)
  }
  if (checkOnly || !edits.length) return 'unchanged' as const
  const raw = readFileSync(filePath, 'utf8')
  const sortedEdits = [...edits].reverse().sort((a, b) => b.start - a.start || b.end - a.end)
  const patched = sortedEdits.reduce((acc, e) => acc.slice(0, e.start) + e.replacement + acc.slice(e.end), raw)
  const formatted = prettier.format(patched, {...(prettier.resolveConfig(filePath) ?? {}), filepath: filePath})
  if (formatted === raw) return 'unchanged' as const
  writeFileSync(filePath, formatted, 'utf8')
  return 'updated' as const
}

const errors: string[] = []
const updatedFiles: string[] = []
let verifiedCount = 0

const loader = register({namespace: 'primer-sync-component-docs', tsconfig: false})
try {
  for (const relPath of globSync('src/**/*.docs.ts', {cwd: packageRoot}).sort()) {
    const url = pathToFileURL(path.join(packageRoot, relPath)).href
    const mod = (await loader.import(url, import.meta.url)) as {default?: ComponentDocs}
    const status = syncFile(relPath, mod.default, errors)
    if (status !== 'invalid') verifiedCount += 1
    if (status === 'updated') updatedFiles.push(relPath)
  }
} finally {
  await loader.unregister()
}

const plural = (n: number) => (n === 1 ? '' : 's')
if (checkOnly && errors.length > 0) {
  const msg = `Found ${errors.length} component docs drift error${plural(errors.length)}.`
  process.stderr.write(`${errors.join('\n')}\n\n${msg} Run \`npm run docs:sync -w @primer/react\` to sync.\n`)
  process.exit(1)
}
if (checkOnly) process.stdout.write(`Verified ${verifiedCount} component docs files with 0 drift errors.\n`)
else if (updatedFiles.length > 0) {
  const lines = updatedFiles.map(r => `Updated ${r}`).join('\n')
  process.stdout.write(`${lines}\nSynced ${updatedFiles.length} component docs file${plural(updatedFiles.length)}.\n`)
} else process.stdout.write(`All ${verifiedCount} component docs files are already in sync.\n`)
