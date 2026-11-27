import {extractSourceProps, getTSProgram} from '@primer/doc-gen'
import {readFileSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import ts from 'typescript'

const workspace = fileURLToPath(new URL('../', import.meta.url))
const repo = path.resolve(workspace, '../..')
const src = path.join(workspace, 'src')
const suffix = '.docs.ts'
const statuses = new Set(['stable', 'draft', 'alpha', 'beta', 'deprecated'])

type Literal = string | boolean | Array<Literal> | LiteralObject
interface LiteralObject {
  [key: string]: Literal | undefined
}

interface Table {
  name: string
  props: Map<string, LiteralObject>
}

interface DefaultBehaviorMetadata {
  id: string
  overriddenBy: Array<string>
}

interface UsageGuidelineMetadata {
  id: string
  guidance: string
  check: string
}

interface Metadata extends Table {
  importPath: string
  subcomponents: Array<Table>
  relatedTypes: Array<Table>
  builtInBehaviors: Array<{id: string}>
  defaultBehaviors: Array<DefaultBehaviorMetadata>
  usageGuidelines: Array<UsageGuidelineMetadata>
}

interface Finding {
  kind: 'missing' | 'invalid' | 'unresolved'
  subject: string
  message: string
}

function isWithin(directory: string, file: string) {
  const relative = path.relative(directory, file)
  return relative !== '' && !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`)
}

export function selectDocs(args: ReadonlyArray<string>) {
  if (args.length > 1 || args[0]?.startsWith('-')) {
    throw new Error('Expected zero arguments or one repo-relative or package-relative src/**/*.docs.ts path.')
  }
  const input = args.at(0)
  if (
    input !== undefined &&
    (path.isAbsolute(input) || !input.endsWith(suffix) || input.split(/[\\/]/).includes('..'))
  ) {
    throw new Error(`Unsupported docs path: ${input}`)
  }
  const files = readdirSync(src, {recursive: true, withFileTypes: true})
    .filter(entry => {
      return entry.isFile() && entry.name.endsWith(suffix)
    })
    .map(entry => {
      return path.join(entry.parentPath, entry.name)
    })
  if (input === undefined) {
    return files.sort()
  }
  const match = [path.resolve(workspace, input), path.resolve(repo, input)].find(file => files.includes(file))
  if (match) {
    return [match]
  }
  throw new Error(`No regular typed docs file in the package src directory: ${input}`)
}

function literal(node: ts.Expression): Literal {
  if (ts.isStringLiteralLike(node)) {
    return node.text
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) {
    return node.kind === ts.SyntaxKind.TrueKeyword
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(literal)
  }
  if (ts.isObjectLiteralExpression(node)) {
    const fields = new Map<string, Literal>()
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop) || !(ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
        throw new Error('Only literal properties are supported in defineComponent metadata.')
      }
      if (fields.has(prop.name.text)) {
        throw new Error(`Duplicate metadata key: ${prop.name.text}`)
      }
      fields.set(prop.name.text, literal(prop.initializer))
    }
    return Object.fromEntries(fields)
  }
  throw new Error(`Unsupported metadata expression: ${ts.SyntaxKind[node.kind]}`)
}

function object(value: Literal | undefined, subject: string): LiteralObject {
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${subject}: expected an object.`)
  }
  return value
}

function string(value: Literal | undefined, subject: string) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${subject}: expected a nonempty string.`)
  }
  return value
}

function array(value: Literal | undefined, subject: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${subject}: expected an array.`)
  }
  return value
}

function table(value: LiteralObject, findings: Array<Finding>): Table {
  const name = string(value.name, 'name')
  const props = new Map<string, LiteralObject>()
  for (const entry of array(value.props, `${name}.props`)) {
    const prop = object(entry, `${name}.props entry`)
    const propName = string(prop.name, `${name}.props entry name`)
    if (props.has(propName)) {
      findings.push({kind: 'invalid', subject: `${name}.${propName}`, message: 'Duplicate prop entry.'})
      continue
    }
    props.set(propName, prop)
  }
  return {name, props}
}

function validatePassthrough(value: Literal | undefined, subject: string) {
  if (value !== undefined) {
    const passthrough = object(value, subject)
    if (typeof passthrough.element !== 'string' || typeof passthrough.url !== 'string') {
      throw new Error(`${subject}: expected string element and url fields.`)
    }
  }
}

function tables(value: Literal | undefined, subject: 'subcomponents' | 'relatedTypes', findings: Array<Finding>) {
  const names = new Set<string>()
  return array(value, subject).map(entry => {
    const data = object(entry, subject)
    const result = table(data, findings)
    if ((subject === 'subcomponents' || data.displayName !== undefined) && typeof data.displayName !== 'string') {
      throw new Error(`${result.name}.displayName: expected a string.`)
    }
    if (subject === 'subcomponents') {
      validatePassthrough(data.passthrough, `${result.name}.passthrough`)
    }
    if (names.has(result.name)) {
      throw new Error(`${subject}: duplicate table ${result.name}.`)
    }
    names.add(result.name)
    return result
  })
}

function validateOptionalRelated(value: Literal | undefined, subject: string) {
  if (value !== undefined) {
    for (const item of array(value, subject)) {
      string(item, subject)
    }
  }
}

function readBuiltInBehaviors(value: Literal | undefined, findings: Array<Finding>, componentName: string) {
  if (value === undefined) {
    return []
  }
  const items: Array<{id: string}> = []
  for (const [index, entry] of array(value, 'builtInBehaviors').entries()) {
    const item = object(entry, `builtInBehaviors[${index}]`)
    const id = string(item.id, `builtInBehaviors[${index}].id`)
    if (typeof item.description !== 'string' || item.description.length === 0) {
      findings.push({
        kind: 'invalid',
        subject: `${componentName}.builtInBehaviors.${id}.description`,
        message: 'Expected a nonempty string.',
      })
    }
    validateOptionalRelated(item.related, `${componentName}.builtInBehaviors.${id}.related`)
    items.push({id})
  }
  return items
}

function readDefaultBehaviors(value: Literal | undefined, findings: Array<Finding>, componentName: string) {
  if (value === undefined) {
    return []
  }
  const items: Array<DefaultBehaviorMetadata> = []
  for (const [index, entry] of array(value, 'defaultBehaviors').entries()) {
    const item = object(entry, `defaultBehaviors[${index}]`)
    const id = string(item.id, `defaultBehaviors[${index}].id`)
    if (typeof item.description !== 'string' || item.description.length === 0) {
      findings.push({
        kind: 'invalid',
        subject: `${componentName}.defaultBehaviors.${id}.description`,
        message: 'Expected a nonempty string.',
      })
    }
    const overriddenBy: Array<string> = []
    const rawOverrides = array(item.overriddenBy, `${componentName}.defaultBehaviors.${id}.overriddenBy`)
    if (rawOverrides.length === 0) {
      findings.push({
        kind: 'invalid',
        subject: `${componentName}.defaultBehaviors.${id}.overriddenBy`,
        message: 'Expected at least one prop reference.',
      })
    }
    for (const ref of rawOverrides) {
      overriddenBy.push(string(ref, `${componentName}.defaultBehaviors.${id}.overriddenBy`))
    }
    validateOptionalRelated(item.related, `${componentName}.defaultBehaviors.${id}.related`)
    items.push({id, overriddenBy})
  }
  return items
}

function readUsageGuidelines(value: Literal | undefined, findings: Array<Finding>, componentName: string) {
  if (value === undefined) {
    return []
  }
  const items: Array<UsageGuidelineMetadata> = []
  for (const [index, entry] of array(value, 'usageGuidelines').entries()) {
    const item = object(entry, `usageGuidelines[${index}]`)
    const id = string(item.id, `usageGuidelines[${index}].id`)
    const guidance = typeof item.guidance === 'string' ? item.guidance : ''
    const check = typeof item.check === 'string' ? item.check : ''
    if (guidance !== 'do' && guidance !== 'dont') {
      findings.push({
        kind: 'invalid',
        subject: `${componentName}.usageGuidelines.${id}.guidance`,
        message: 'Expected "do" or "dont".',
      })
    }
    if (check !== 'runtime' && check !== 'review') {
      findings.push({
        kind: 'invalid',
        subject: `${componentName}.usageGuidelines.${id}.check`,
        message: 'Expected "runtime" or "review".',
      })
    }
    if (typeof item.description !== 'string' || item.description.length === 0) {
      findings.push({
        kind: 'invalid',
        subject: `${componentName}.usageGuidelines.${id}.description`,
        message: 'Expected a nonempty string.',
      })
    }
    validateOptionalRelated(item.related, `${componentName}.usageGuidelines.${id}.related`)
    items.push({id, guidance, check})
  }
  return items
}

function readDocs(source: ts.SourceFile, findings: Array<Finding>): Metadata {
  const assignment = source.statements.find(ts.isExportAssignment)
  if (
    !assignment ||
    assignment.isExportEquals ||
    !ts.isCallExpression(assignment.expression) ||
    !ts.isIdentifier(assignment.expression.expression) ||
    assignment.expression.expression.text !== 'defineComponent' ||
    assignment.expression.arguments.length !== 1
  ) {
    throw new Error('Expected a default export of defineComponent with one literal object argument.')
  }
  const docs = object(literal(assignment.expression.arguments[0]), 'defineComponent argument')
  string(docs.id, 'id')
  if (typeof docs.status !== 'string' || !statuses.has(docs.status)) {
    throw new Error('Invalid component status.')
  }
  if (typeof docs.a11yReviewed !== 'boolean' && typeof docs.a11yReviewed !== 'string') {
    throw new Error('a11yReviewed: expected a boolean or string.')
  }
  if (array(docs.stories, 'stories').some(story => typeof story !== 'string')) {
    throw new Error('stories: expected strings.')
  }
  validatePassthrough(docs.passthrough, 'passthrough')
  const mainTable = table(docs, findings)
  return {
    ...mainTable,
    importPath: string(docs.importPath, 'importPath'),
    subcomponents: tables(docs.subcomponents, 'subcomponents', findings),
    relatedTypes: docs.relatedTypes === undefined ? [] : tables(docs.relatedTypes, 'relatedTypes', findings),
    builtInBehaviors: readBuiltInBehaviors(docs.builtInBehaviors, findings, mainTable.name),
    defaultBehaviors: readDefaultBehaviors(docs.defaultBehaviors, findings, mainTable.name),
    usageGuidelines: readUsageGuidelines(docs.usageGuidelines, findings, mainTable.name),
  }
}

function validateGuardrails(docs: Metadata, documentedComponents: Map<string, Table>, findings: Array<Finding>) {
  const seenIds = new Set<string>()
  const checkUniqueId = (section: string, id: string) => {
    if (seenIds.has(id)) {
      findings.push({
        kind: 'invalid',
        subject: `${docs.name}.${section}.${id}`,
        message: 'Duplicate guardrail id.',
      })
    } else {
      seenIds.add(id)
    }
  }

  for (const behavior of docs.builtInBehaviors) {
    checkUniqueId('builtInBehaviors', behavior.id)
  }

  for (const behavior of docs.defaultBehaviors) {
    checkUniqueId('defaultBehaviors', behavior.id)
    for (const ref of behavior.overriddenBy) {
      const lastDot = ref.lastIndexOf('.')
      const exists =
        lastDot === -1
          ? docs.props.has(ref)
          : Boolean(documentedComponents.get(ref.slice(0, lastDot))?.props.has(ref.slice(lastDot + 1)))
      if (!exists) {
        findings.push({
          kind: 'invalid',
          subject: `${docs.name}.defaultBehaviors.${behavior.id}.overriddenBy`,
          message: `Unknown prop reference "${ref}".`,
        })
      }
    }
  }

  let sawDont = false
  for (const guideline of docs.usageGuidelines) {
    checkUniqueId('usageGuidelines', guideline.id)
    if (guideline.guidance === 'dont') {
      sawDont = true
    } else if (guideline.guidance === 'do' && sawDont) {
      findings.push({
        kind: 'invalid',
        subject: `${docs.name}.usageGuidelines.${guideline.id}`,
        message: "Place 'do' guidelines before 'dont' guidelines.",
      })
    }
  }
}

function resolveExport(checker: ts.TypeChecker, symbol: ts.Symbol | undefined, valueOnly: boolean) {
  if (!symbol) {
    return undefined
  }
  if (valueOnly) {
    let alias = symbol
    const seen = new Set<ts.Symbol>()
    while (alias.flags & ts.SymbolFlags.Alias) {
      if (
        seen.has(alias) ||
        alias.declarations?.some(declaration => {
          if (ts.isExportSpecifier(declaration)) {
            return declaration.isTypeOnly || declaration.parent.parent.isTypeOnly
          }
          if (ts.isImportSpecifier(declaration)) {
            return declaration.isTypeOnly || declaration.parent.parent.isTypeOnly
          }
          return ts.isImportClause(declaration) && declaration.isTypeOnly
        })
      ) {
        return undefined
      }
      seen.add(alias)
      const next = checker.getImmediateAliasedSymbol(alias)
      if (!next) {
        return undefined
      }
      alias = next
    }
    return alias.valueDeclaration ? alias : undefined
  }
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
}

function reactReturn(type: ts.Type): boolean {
  const alias = type.aliasSymbol
  const symbol = type.getSymbol()
  const reactType = alias?.name === 'ReactNode' ? alias : symbol
  if (
    reactType &&
    ['ReactNode', 'ReactElement', 'Element'].includes(reactType.name) &&
    reactType.declarations?.some(declaration => {
      return /[/\\]node_modules[/\\](?:@types[/\\])?react[/\\]/.test(declaration.getSourceFile().fileName)
    })
  ) {
    return true
  }
  if (type.isUnion()) {
    return type.types.every(member => reactReturn(member))
  }
  return Boolean(type.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined))
}

function componentSignatures(checker: ts.TypeChecker, type: ts.Type) {
  const calls = type.getCallSignatures()
  if (calls.length && calls.every(signature => reactReturn(signature.getReturnType()))) {
    return calls
  }
  const constructors = type.getConstructSignatures()
  if (
    constructors.length &&
    constructors.every(signature => {
      const instance = signature.getReturnType()
      const render = instance.getProperty('render')
      return (
        instance.getProperty('props') &&
        instance.getProperty('setState') &&
        render &&
        checker
          .getTypeOfSymbol(render)
          .getCallSignatures()
          .some(method => reactReturn(method.getReturnType()))
      )
    })
  ) {
    return constructors
  }
  return []
}

function hidden(checker: ts.TypeChecker, symbol: ts.Symbol) {
  return (
    symbol.name.startsWith('_private') ||
    symbol.getJsDocTags(checker).some(tag => tag.name === 'internal') ||
    symbol.getDeclarations()?.some(declaration => {
      return Boolean(ts.getCombinedModifierFlags(declaration) & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected))
    })
  )
}

type PropFields = Pick<
  ReturnType<typeof extractSourceProps>[number],
  'type' | 'required' | 'description' | 'defaultValue'
>

function reportFields(findings: Array<Finding>, documented: Table, suggestions: Map<string, PropFields>) {
  for (const [name, prop] of documented.props) {
    const suggested = suggestions.get(name)
    for (const field of ['type', 'description', 'required', 'defaultValue'] as const) {
      const subject = `${documented.name}.${name}.${field}`
      const value = prop[field]
      if (value === undefined && suggested?.[field] !== undefined) {
        findings.push({kind: 'missing', subject, message: `Add ${JSON.stringify(suggested[field])}.`})
      } else if (
        value !== undefined ? typeof value !== (field === 'required' ? 'boolean' : 'string') : field !== 'defaultValue'
      ) {
        findings.push({
          kind: 'invalid',
          subject,
          message: `Expected a ${field === 'required' ? 'boolean' : 'string'}${value === undefined ? '; no usable source value' : ''}.`,
        })
      }
    }
  }
}

interface PropView {
  type: ts.Type
  location: ts.Node
}

export function lintSource(
  program: ts.Program,
  source: ts.SourceFile,
  entries: ReadonlyMap<string, string>,
  sourceRoot: string,
  extractProps: typeof extractSourceProps,
): Array<Finding> {
  const findings: Array<Finding> = []
  let docs: Metadata
  try {
    const syntaxError = program.getSyntacticDiagnostics(source).at(0)
    if (syntaxError) {
      throw new Error(ts.flattenDiagnosticMessageText(syntaxError.messageText, '\n'))
    }
    docs = readDocs(source, findings)
  } catch (error) {
    return [{kind: 'invalid', subject: '', message: error instanceof Error ? error.message : String(error)}]
  }
  const checker = program.getTypeChecker()
  const entryFile = entries.get(docs.importPath)
  if (!entryFile) {
    return [...findings, {kind: 'invalid', subject: docs.name, message: `Unsupported importPath: ${docs.importPath}.`}]
  }
  const entry = program.getSourceFile(entryFile)
  const module = entry && checker.getSymbolAtLocation(entry)
  if (!module) {
    return [
      ...findings,
      {kind: 'unresolved', subject: docs.name, message: `Cannot resolve source entrypoint for ${docs.importPath}.`},
    ]
  }
  const exports = new Map(checker.getExportsOfModule(module).map(symbol => [symbol.name, symbol]))
  const reachableTypes = new Map<string, Set<ts.Symbol>>()
  const propViews = new Map<string, Array<PropView> | undefined>()

  function unresolved(subject: string, message: string) {
    findings.push({kind: 'unresolved', subject, message})
  }

  function related(type: ts.Type, seen = new Set<ts.Type>()) {
    if (seen.has(type)) {
      return
    }
    seen.add(type)
    const symbol = type.aliasSymbol ?? type.getSymbol()
    if (symbol?.declarations?.some(declaration => isWithin(sourceRoot, declaration.getSourceFile().fileName))) {
      const symbols = reachableTypes.get(symbol.name) ?? new Set()
      symbols.add(symbol)
      reachableTypes.set(symbol.name, symbols)
    }
    if (type.isUnionOrIntersection()) {
      for (const member of type.types) {
        related(member, seen)
      }
    }
    const arguments_ =
      type.aliasTypeArguments ??
      (type.flags & ts.TypeFlags.Object && (type as ts.ObjectType).objectFlags & ts.ObjectFlags.Reference
        ? checker.getTypeArguments(type as ts.TypeReference)
        : [])
    for (const argument of arguments_) {
      related(argument, seen)
    }
  }

  function compare(documented: Table, views: Array<PropView> | undefined) {
    const suggestions = new Map<string, PropFields>()
    if (!views) {
      reportFields(findings, documented, suggestions)
      return
    }
    const branches = views.flatMap(({type, location}) => {
      return (type.isUnion() ? type.types : [type]).map(branch => ({type: branch, location}))
    })
    if (branches.some(({type}) => !(type.flags & (ts.TypeFlags.Object | ts.TypeFlags.Intersection)))) {
      unresolved(documented.name, 'A props signature is not a concrete object; coverage was not compared.')
      reportFields(findings, documented, suggestions)
      return
    }
    if (branches.some(({type}) => checker.getIndexInfosOfType(type).length)) {
      unresolved(documented.name, 'Index signatures are not checked.')
    }
    const variants = branches.map(({type, location}) => {
      const props = new Map<string, PropFields & {sourceType: ts.Type}>()
      for (const prop of extractProps(checker, type, location)) {
        if (!prop.source || !isWithin(sourceRoot, prop.source.fileName) || hidden(checker, prop.propSymbol)) {
          continue
        }
        const sourceType = checker.getTypeOfSymbolAtLocation(prop.propSymbol, location)
        related(sourceType)
        const verified =
          !(
            sourceType.flags &
            (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never | ts.TypeFlags.Undefined)
          ) &&
          prop.propSymbol
            .getDeclarations()
            ?.every(declaration => isWithin(sourceRoot, declaration.getSourceFile().fileName))
        props.set(prop.name, {
          sourceType,
          type: verified ? prop.type : undefined,
          required: prop.required,
          description: prop.description || undefined,
          defaultValue: prop.defaultValue,
        })
      }
      return props
    })
    const names = [...new Set(variants.flatMap(variant => [...variant.keys()]))].sort()
    for (const name of names) {
      const fields = variants.map(props => {
        return props.get(name)
      })
      const first = fields.at(0)
      // Do not let the choice or order of an overload determine the emitted contract.
      if (
        !first?.type ||
        fields.some(field => {
          return (
            !field ||
            field.required !== first.required ||
            field.type !== first.type ||
            !checker.isTypeAssignableTo(field.sourceType, first.sourceType) ||
            !checker.isTypeAssignableTo(first.sourceType, field.sourceType)
          )
        })
      ) {
        if (!documented.props.has(name)) {
          unresolved(
            `${documented.name}.${name}`,
            'No agreed usable type and requiredness across public prop variants.',
          )
        }
        continue
      }
      const suggestion = {
        type: first.type,
        required: first.required,
        description: fields.every(field => field?.description === first.description) ? first.description : undefined,
        defaultValue: fields.every(field => field?.defaultValue === first.defaultValue)
          ? first.defaultValue
          : undefined,
      }
      suggestions.set(name, suggestion)
      if (!documented.props.has(name)) {
        findings.push({
          kind: 'missing',
          subject: `${documented.name}.${name}`,
          message: `Add prop ${JSON.stringify({name, ...suggestion})}.${suggestion.description === undefined ? ' No unambiguous source JSDoc description.' : ''}`,
        })
      }
    }
    reportFields(findings, documented, suggestions)
  }

  function value(name: string) {
    const [head, ...members] = name.split('.')
    const target = resolveExport(checker, exports.get(head), true)
    const location = target?.valueDeclaration
    if (!target || !location || hidden(checker, target) || !isWithin(sourceRoot, location.getSourceFile().fileName)) {
      return undefined
    }
    let type = checker.getTypeOfSymbolAtLocation(target, location)
    for (const member of members) {
      const symbol = type.getProperty(member)
      if (!symbol || hidden(checker, symbol)) {
        return undefined
      }
      type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration ?? location)
    }
    return {type, location}
  }

  const documentedComponents = new Map([docs, ...docs.subcomponents].map(item => [item.name, item]))
  validateGuardrails(docs, documentedComponents, findings)
  const visited = new Set<string>()
  function visit(name: string, parents = new Set<ts.Type>()) {
    if (visited.has(name)) {
      return
    }
    visited.add(name)
    const resolved = value(name)
    const documented = documentedComponents.get(name)
    if (!resolved) {
      unresolved(name, `Cannot verify a source-defined public value at ${docs.importPath}.`)
      return
    }
    const {type, location} = resolved
    const signatures = componentSignatures(checker, type)
    if (!signatures.length) {
      unresolved(name, `No directly verifiable React component signature at ${docs.importPath}.`)
      return
    }
    const views = signatures.flatMap(signature => {
      const parameter = signature.getParameters().at(0)
      return parameter
        ? [{type: checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration ?? location), location}]
        : []
    })
    if (views.length && views.length !== signatures.length) {
      propViews.set(name, undefined)
      unresolved(name, 'Only some signatures take props; coverage was not compared.')
    } else {
      propViews.set(name, views)
    }
    if (!documented) {
      findings.push({
        kind: 'missing',
        subject: name,
        message: 'Add a subcomponent table for this public callable member.',
      })
      compare({name, props: new Map()}, propViews.get(name))
    }
    if (parents.has(type)) {
      unresolved(name, 'Recursive public members were not traversed again.')
      return
    }
    const next = new Set([...parents, type])
    for (const member of type.getProperties()) {
      if (!/^[A-Z]/.test(member.name) || hidden(checker, member)) {
        continue
      }
      const memberName = `${name}.${member.name}`
      const memberType = checker.getTypeOfSymbolAtLocation(member, member.valueDeclaration ?? location)
      if (componentSignatures(checker, memberType).length) {
        visit(memberName, next)
      } else {
        const present = checker.getNonNullableType(memberType)
        if (present.getCallSignatures().length || present.getConstructSignatures().length) {
          unresolved(memberName, 'Callable member could not be verified as a React component.')
        }
      }
    }
  }

  for (const [name, documented] of documentedComponents) {
    visit(name)
    compare(documented, propViews.get(name))
  }
  for (const documented of docs.relatedTypes) {
    const exported = resolveExport(checker, exports.get(documented.name), false)
    const reachable = reachableTypes.get(documented.name)
    const symbol = exported ?? (reachable?.size === 1 ? [...reachable][0] : undefined)
    const location = symbol?.declarations?.find(declaration =>
      isWithin(sourceRoot, declaration.getSourceFile().fileName),
    )
    if (
      !symbol ||
      !location ||
      hidden(checker, symbol) ||
      !(symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias))
    ) {
      unresolved(documented.name, 'Related type is not an unambiguous public export or named public prop type.')
      compare(documented, undefined)
      continue
    }
    compare(documented, [{type: checker.getDeclaredTypeOfSymbol(symbol), location}])
  }
  return findings.sort((a, b) => {
    return a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : a.kind.localeCompare(b.kind, 'en')
  })
}

function publicEntries() {
  const pkg: {name: string; exports: Record<string, {types?: string} | undefined>} = JSON.parse(
    readFileSync(path.join(workspace, 'package.json'), 'utf8'),
  )
  const entries = new Map<string, string>()
  for (const key of ['.', './experimental', './deprecated', './next']) {
    const declaration = pkg.exports[key]?.types
    if (declaration?.startsWith('./dist/') && declaration.endsWith('.d.ts')) {
      entries.set(`${pkg.name}${key.slice(1)}`, path.join(src, `${declaration.slice(7, -5)}.ts`))
    }
  }
  return entries
}

function main(args: ReadonlyArray<string>) {
  const files = selectDocs(args)
  if (!files.length) {
    throw new Error('No typed component docs found.')
  }
  const entries = publicEntries()
  const program = getTSProgram(workspace)
  const counts = {missing: 0, invalid: 0, unresolved: 0}
  for (const file of files) {
    const source = program.getSourceFile(file)
    const findings = source
      ? lintSource(program, source, entries, src, extractSourceProps)
      : [{kind: 'invalid' as const, subject: '', message: 'File is not part of the TypeScript program.'}]
    for (const {kind, subject, message} of findings) {
      counts[kind]++
      process.stdout.write(`${path.relative(repo, file)} [${kind}] ${subject ? `${subject}: ` : ''}${message}\n`)
    }
  }
  process.stdout.write(
    `Checked ${files.length} typed docs: ${counts.missing} missing, ${counts.invalid} invalid, ${counts.unresolved} unresolved.\n`,
  )
  return counts.missing || counts.invalid ? 1 : 0
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`[invalid] ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  }
}
