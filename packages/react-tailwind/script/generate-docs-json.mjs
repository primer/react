import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getTSProgram, parseTypeInfo, readElementTag, simplifyReactType} from '@primer/doc-gen'
import glob from 'fast-glob'
import {storyNameFromExport, toId} from 'storybook/internal/csf'
import ts from 'typescript'

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Region props come from the `RegionProps<Names>` mapped type, which carries no per-property JSDoc. */
function regionDescription(region, child) {
  return `Supplies the ${region} region. Takes precedence over a matching ${child ? `\`${child}\` ` : ''}child.`
}

/**
 * TypeScript is the source of truth for a prop's type, but the checker only sees the flattened
 * props object. Region names are declared in syntax it has already erased, so they are read from
 * the source text as well.
 */
function readRegions(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const regions = new Map()

  const visit = node => {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
      const names = []
      for (const clause of node.heritageClauses ?? []) {
        for (const type of clause.types) {
          if (type.expression.getText() !== 'RegionProps') continue
          for (const argument of type.typeArguments ?? []) {
            for (const literal of argument.types ?? [argument]) {
              if (ts.isLiteralTypeNode(literal) && ts.isStringLiteral(literal.literal)) names.push(literal.literal.text)
            }
          }
        }
      }
      if (names.length > 0) regions.set(node.name.text, names)
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return regions
}

/** Utility types that keep the props of their first argument. */
const PROPS_WRAPPERS = new Set([
  'NonNullable',
  'Omit',
  'Partial',
  'Pick',
  'PropsWithChildren',
  'PropsWithRef',
  'PropsWithoutRef',
  'Readonly',
  'Required',
])

/** React's helpers that read the props of an element type, such as `ComponentPropsWithoutRef<'a'>`. */
const PROPS_OF_ELEMENT = new Set(['ComponentProps', 'ComponentPropsWithRef', 'ComponentPropsWithoutRef'])

function rightmostName(name) {
  if (ts.isIdentifier(name)) return name.text
  return ts.isQualifiedName(name) ? name.right.text : name.name.text
}

const MDN_ELEMENTS = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/'

function htmlPassthrough(element) {
  return {element, url: `${MDN_ELEMENTS}${element}#attributes`}
}

/**
 * A polymorphic component's props type covers any element, so its `as` default is what decides which element it
 * renders. Only a plain tag counts; a component or a custom element default has no single MDN page to point to.
 */
function readAsDefault(props) {
  const value = props.find(prop => prop.name === 'as')?.defaultValue
  return /^(['"`])([a-z][a-z0-9]*)\1$/.exec(value ?? '')?.[2]
}

/** Every member must lead to the same place, or the base is genuinely undetermined. */
function agreed(results) {
  const [first] = results
  return first && results.every(result => result?.element === first.element && result.url === first.url)
    ? first
    : undefined
}

/**
 * The props a component does not use itself go somewhere: a DOM element or a Base UI part, often by way of another
 * of this package's components. Props declared in this package are already documented in full, so the walk goes
 * through them and stops at the first boundary a reader has to look up elsewhere.
 *
 * The walk starts from the component's definition rather than from a props type's name, so it follows inline
 * types such as `forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>`, parts that are Base UI
 * parts outright, and props borrowed with `typeof`.
 *
 * The props type decides when it names an element. A polymorphic props type such as
 * `HTMLAttributes<HTMLElement>` covers every element, so the implementation decides instead, the same way it decides
 * a prop's default: first the default of its `as` prop, then the element its remaining props are spread onto.
 */
function createPassthroughResolver(program) {
  const checker = program.getTypeChecker()
  const results = new Map()

  // Memoized per node; a node already on the path resolves to nothing, which breaks cycles.
  const once = (node, resolve) => {
    if (!node) return undefined
    if (results.has(node)) return results.get(node)
    results.set(node, undefined)
    const result = resolve(node)
    results.set(node, result)
    return result
  }

  const symbolOf = node => {
    const symbol = checker.getSymbolAtLocation(node)
    return symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
  }

  const definitionOf = symbol => {
    const node = symbol?.valueDeclaration ?? symbol?.declarations?.[0]
    // `Component.Part = Implementation`
    if (
      node &&
      ts.isPropertyAccessExpression(node) &&
      ts.isBinaryExpression(node.parent) &&
      node.parent.left === node
    ) {
      return node.parent.right
    }
    return node
  }

  const isOwnSource = node => {
    const source = node.getSourceFile()
    return !source.isDeclarationFile && !source.fileName.includes('/node_modules/')
  }

  // `BaseDialog.Popup.Props`, `typeof BaseTabs.List`, and `Field.Control` all start from a Base UI import.
  const baseUiPart = name => {
    const path = []
    let head = name
    while (ts.isQualifiedName(head) || ts.isPropertyAccessExpression(head)) {
      path.unshift(rightmostName(head))
      head = ts.isQualifiedName(head) ? head.left : head.expression
    }
    if (!ts.isIdentifier(head)) return undefined
    const specifier = checker.getSymbolAtLocation(head)?.declarations?.[0]
    if (!specifier || !ts.isImportSpecifier(specifier)) return undefined
    const module = /^@base-ui\/react\/([a-z-]+)$/.exec(
      ts.findAncestor(specifier, ts.isImportDeclaration).moduleSpecifier.text,
    )
    if (!module) return undefined

    const parts = path.at(-1) === 'Props' ? path.slice(0, -1) : path
    const anchor = parts.length > 0 ? parts.join('').toLowerCase() : 'api-reference'
    return {
      element: [(specifier.propertyName ?? specifier.name).text, ...parts].join('.'),
      url: `https://base-ui.com/react/components/${module[1]}#${anchor}`,
    }
  }

  const fromComponentName = name => baseUiPart(name) ?? fromComponent(definitionOf(symbolOf(name)))

  const fromComponent = start =>
    once(start, node => {
      if (!isOwnSource(node)) return undefined
      if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
        return fromProps(node.parameters[0]?.type) ?? fromImplementation(node)
      }
      // `{as: Component = 'div'}`
      if (ts.isBindingElement(node)) {
        return node.initializer && ts.isStringLiteralLike(node.initializer) ? fromTag(node.initializer.text) : undefined
      }
      if (ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) return fromComponent(node.initializer)
      if (ts.isShorthandPropertyAssignment(node)) {
        return fromComponent(definitionOf(checker.getShorthandAssignmentValueSymbol(node)))
      }
      if (
        ts.isParenthesizedExpression(node) ||
        ts.isAsExpression(node) ||
        ts.isSatisfiesExpression(node) ||
        ts.isNonNullExpression(node)
      ) {
        return fromComponent(node.expression)
      }
      // `forwardRef<Element, Props>(render)` names its props even when `render` does not; `memo(Component)` and
      // `assign(Root, parts)` lead with the component.
      if (ts.isCallExpression(node)) {
        const forwardsRef = rightmostName(node.expression) === 'forwardRef'
        return (forwardsRef ? fromProps(node.typeArguments?.[1]) : undefined) ?? fromComponent(node.arguments[0])
      }
      if (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node)) return fromComponentName(node)
      return undefined
    })

  const fromProps = start =>
    once(start, node => {
      if (ts.isParenthesizedTypeNode(node)) return fromProps(node.type)
      if (ts.isIntersectionTypeNode(node)) return node.types.map(fromProps).find(Boolean)
      if (ts.isUnionTypeNode(node)) return agreed(node.types.map(fromProps))
      if (!ts.isTypeReferenceNode(node) && !ts.isExpressionWithTypeArguments(node)) return undefined

      const name = ts.isTypeReferenceNode(node) ? node.typeName : node.expression
      const last = rightmostName(name)
      const [first, second] = node.typeArguments ?? []
      if (PROPS_WRAPPERS.has(last)) return fromProps(first)
      if (PROPS_OF_ELEMENT.has(last)) return fromElementType(first)
      // `DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>`
      if (last === 'DetailedHTMLProps') return fromProps(first) ?? fromElementInterface(second)
      // `AnchorHTMLAttributes<HTMLAnchorElement>`, `HTMLProps<HTMLDivElement>`, `SVGProps<SVGSVGElement>`
      if (/HTMLAttributes$|^HTMLProps$|^SVG(Props|Attributes)$/.test(last)) return fromElementInterface(first)

      const baseUi = baseUiPart(name)
      if (baseUi) return baseUi
      const declaration = definitionOf(symbolOf(name))
      if (!declaration || !isOwnSource(declaration)) return undefined
      if (ts.isInterfaceDeclaration(declaration)) {
        return (declaration.heritageClauses ?? []).flatMap(clause => clause.types.map(fromProps)).find(Boolean)
      }
      if (ts.isTypeAliasDeclaration(declaration)) return fromProps(declaration.type)
      return undefined
    })

  const fromTag = tag => (/^[a-z][a-z0-9]*$/.test(tag) ? htmlPassthrough(tag) : undefined)

  const fromImplementation = component => {
    const [parameter] = component.parameters
    if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return undefined
    const bindings = parameter.name.elements
    const as = bindings.find(binding => (binding.propertyName ?? binding.name).getText() === 'as')
    const rest = bindings.find(binding => binding.dotDotDotToken)
    return (
      (as && fromComponent(as)) ?? (rest && ts.isIdentifier(rest.name) ? fromSpread(component, rest.name) : undefined)
    )
  }

  // `<div {...rest} />`: the first element the remaining props are spread onto.
  const fromSpread = (component, rest) => {
    const target = checker.getSymbolAtLocation(rest)
    let element
    const visit = node => {
      if (element) return
      if (
        ts.isJsxSpreadAttribute(node) &&
        ts.isIdentifier(node.expression) &&
        checker.getSymbolAtLocation(node.expression) === target
      ) {
        element = node.parent.parent
        return
      }
      ts.forEachChild(node, visit)
    }
    if (component.body) visit(component.body)
    if (!element) return undefined
    const {tagName} = element
    return ts.isIdentifier(tagName) && /^[a-z]/.test(tagName.text) ? fromTag(tagName.text) : fromComponentName(tagName)
  }

  const fromElementInterface = node => {
    const tag = node && ts.isTypeReferenceNode(node) ? readElementTag(rightmostName(node.typeName)) : undefined
    return tag ? htmlPassthrough(tag) : undefined
  }

  // The argument of `ComponentProps<...>`: a tag, `typeof Component`, or a type parameter that defaults to one.
  const fromElementType = start =>
    once(start, node => {
      if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) return htmlPassthrough(node.literal.text)
      if (ts.isTypeQueryNode(node)) return fromComponentName(node.exprName)
      if (ts.isUnionTypeNode(node)) return agreed(node.types.map(fromElementType))
      if (!ts.isTypeReferenceNode(node)) return undefined
      const declaration = definitionOf(symbolOf(node.typeName))
      if (declaration && ts.isTypeParameterDeclaration(declaration)) return fromElementType(declaration.default)
      if (declaration && ts.isTypeAliasDeclaration(declaration) && isOwnSource(declaration)) {
        return fromElementType(declaration.type)
      }
      return undefined
    })

  return symbol => fromComponent(definitionOf(symbol))
}

/**
 * A default value is runtime behavior, so it is read from the function that implements the component rather than
 * from its props type. The checker follows the export through re-exports, aliases, `forwardRef`, and the parts
 * object passed to `assign`, so a part never borrows the default of a sibling that happens to share a prop name.
 */
function createDefaultsReader(program) {
  const checker = program.getTypeChecker()

  const implementationOfSymbol = (symbol, seen) => {
    if (!symbol) return undefined
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    return implementation(target.valueDeclaration ?? target.declarations?.[0], seen)
  }

  const implementation = (node, seen = new Set()) => {
    if (!node || seen.has(node)) return undefined
    seen.add(node)

    if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) return node
    // `Component.Part = PartImplementation`
    if (ts.isPropertyAccessExpression(node) && ts.isBinaryExpression(node.parent) && node.parent.left === node) {
      return implementation(node.parent.right, seen)
    }
    if (ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) return implementation(node.initializer, seen)
    if (ts.isShorthandPropertyAssignment(node)) {
      return implementationOfSymbol(checker.getShorthandAssignmentValueSymbol(node), seen)
    }
    if (
      ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isNonNullExpression(node) ||
      ts.isExportAssignment(node)
    ) {
      return implementation(node.expression, seen)
    }
    // `forwardRef(render)`, `memo(Component)`, and `assign(Root, parts)` all lead with the implementation.
    if (ts.isCallExpression(node)) return implementation(node.arguments[0], seen)
    if (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node)) {
      return implementationOfSymbol(checker.getSymbolAtLocation(node), seen)
    }
    if (ts.isExportSpecifier(node) || ts.isImportSpecifier(node)) {
      return implementationOfSymbol(checker.getSymbolAtLocation(node.name), seen)
    }
    return undefined
  }

  // A default written as a named constant, such as `position = defaultPosition`, documents the constant's value.
  const literalText = (expression, seen = new Set()) => {
    let node = expression
    while (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
      node = node.expression
    }
    if (isLiteral(node)) return node.getText()
    if (!(ts.isIdentifier(node) || ts.isPropertyAccessExpression(node)) || seen.has(node)) return undefined
    seen.add(node)
    let symbol = checker.getSymbolAtLocation(node)
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
    const declaration = symbol?.valueDeclaration
    if (!declaration) return undefined
    if (ts.isVariableDeclaration(declaration) && ts.getCombinedNodeFlags(declaration) & ts.NodeFlags.Const) {
      return declaration.initializer ? literalText(declaration.initializer, seen) : undefined
    }
    if (ts.isPropertyAssignment(declaration) || ts.isEnumMember(declaration)) {
      return declaration.initializer ? literalText(declaration.initializer, seen) : undefined
    }
    return undefined
  }

  const defaultsOf = fn => {
    if (!fn) return undefined
    const propsType = fn.parameters[0] ? checker.getTypeAtLocation(fn.parameters[0]) : undefined
    const own = new Map()
    for (const pattern of propsBindingPatterns(fn)) {
      for (const element of pattern.elements) {
        if (!element.initializer || !ts.isIdentifier(element.name)) continue
        const name = (element.propertyName ?? element.name).getText().replace(/['"]/g, '')
        if (own.has(name)) continue
        const value = literalText(element.initializer)
        // Only a JSDoc `@default` declared beside the implementation can drift from it; a shared props type is
        // free to describe a different component's default.
        const declaredIn = propsType?.getProperty(name)?.declarations?.[0]?.getSourceFile()
        own.set(name, {
          value: value ?? element.initializer.getText(),
          resolved: value !== undefined,
          local: declaredIn === fn.getSourceFile(),
        })
      }
    }
    return own
  }

  return function readDefaults(indexPath, exportName, partName) {
    const source = program.getSourceFile(indexPath)
    const moduleSymbol = source && checker.getSymbolAtLocation(source)
    if (!moduleSymbol) return undefined

    const exported = checker.getExportsOfModule(moduleSymbol).find(symbol => symbol.name === exportName)
    if (!exported) return undefined
    if (!partName) return defaultsOf(implementationOfSymbol(exported))

    const component = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
    const declaration = component.valueDeclaration ?? component.declarations?.[0]
    if (!declaration) return undefined
    const part = checker.getTypeOfSymbolAtLocation(component, declaration).getProperty(partName)
    return defaultsOf(implementationOfSymbol(part))
  }
}

/** Values a reader can take at face value: primitives, and objects or arrays made only of them. */
function isLiteral(node) {
  if (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isNumericLiteral(node) ||
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    node.kind === ts.SyntaxKind.NullKeyword
  ) {
    return true
  }
  if (ts.isPrefixUnaryExpression(node)) return ts.isNumericLiteral(node.operand)
  if (ts.isArrayLiteralExpression(node)) return node.elements.every(isLiteral)
  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.every(property => ts.isPropertyAssignment(property) && isLiteral(property.initializer))
  }
  return false
}

/** The props parameter's destructuring, whether in the signature or as `const {...} = props` in the body. */
function propsBindingPatterns(node) {
  const props = node.parameters[0]?.name
  if (!props) return []
  if (ts.isObjectBindingPattern(props)) return [props]
  if (!ts.isIdentifier(props) || !node.body || !ts.isBlock(node.body)) return []

  const patterns = []
  for (const statement of node.body.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      const {initializer, name} = declaration
      if (
        ts.isObjectBindingPattern(name) &&
        initializer &&
        ts.isIdentifier(initializer) &&
        initializer.text === props.text
      ) {
        patterns.push(name)
      }
    }
  }
  return patterns
}

/** Runtime names a component directory exports, in source order. Type-only and default exports are skipped. */
function readRuntimeExports(indexPath) {
  if (!fs.existsSync(indexPath)) return []
  const source = ts.createSourceFile(indexPath, fs.readFileSync(indexPath, 'utf8'), ts.ScriptTarget.Latest, true)
  const names = []
  for (const statement of source.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? (ts.getModifiers(statement) ?? []) : []
    const declared =
      modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) &&
      !modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword)
    if (declared && ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text)
      }
    } else if (
      declared &&
      (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) &&
      statement.name
    ) {
      names.push(statement.name.text)
    } else if (ts.isExportDeclaration(statement) && !statement.isTypeOnly && statement.exportClause) {
      if (!ts.isNamedExports(statement.exportClause)) continue
      for (const element of statement.exportClause.elements) {
        if (!element.isTypeOnly) names.push(element.name.text)
      }
    }
  }
  return names
}

/** Each value a module exports, keyed by its exported name, with the symbol it resolves to and its type. */
function readExportedValues(checker, filePath) {
  const source = program.getSourceFile(filePath)
  const moduleSymbol = source && checker.getSymbolAtLocation(source)
  const values = new Map()
  for (const symbol of moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : []) {
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    if (target.flags & ts.SymbolFlags.Value)
      values.set(symbol.name, {symbol: target, type: checker.getTypeOfSymbol(target)})
  }
  return values
}

/** A component can be called; constants, contexts, and plain objects cannot. */
function isComponentType(type) {
  return type !== undefined && type.getCallSignatures().length > 0
}

/** A component's parts are its callable properties, such as `ActionList.Item`. */
function readParts(checker, type) {
  if (!type) return []
  return type.getProperties().flatMap(property => {
    const partType = checker.getTypeOfSymbol(property)
    return isComponentType(partType) ? [{name: property.name, symbol: property, type: partType}] : []
  })
}

/** Follows a path of parts, such as `['GroupHeading', 'TrailingAction']`, and reports whether every step exists. */
function hasPart(checker, type, segments) {
  let current = type
  for (const segment of segments) {
    current = readParts(checker, current).find(part => part.name === segment)?.type
    if (!current) return false
  }
  return true
}

/** Story ids are derived with Storybook's own `toId`, so they cannot drift from what it registers. */
function readStoryIds(directory) {
  const ids = []
  for (const file of glob.sync('*.stories.tsx', {cwd: directory, absolute: true}).sort()) {
    const text = fs.readFileSync(file, 'utf8')
    const title = /title:\s*'([^']+)'/.exec(text)?.[1]
    if (!title) continue
    for (const match of text.matchAll(/^export const (\w+)\s*[:=]/gm)) {
      if (match[1] === 'default') continue
      ids.push({id: toId(title, storyNameFromExport(match[1]))})
    }
  }
  return ids.length > 0 ? ids : undefined
}

const defaultConflicts = []
const opaqueDefaults = []
const elementConflicts = []

/**
 * The implementation's default is what actually happens; a JSDoc `@default` covers props it only forwards, and
 * defaults computed at runtime that no literal can show.
 */
function toProp(owner, name, info, own) {
  const prop = {name, type: simplifyReactType(info.type)}
  const implemented = own?.get(name)
  const documented = info.defaultValue
  let defaultValue = documented
  if (implemented?.resolved) {
    if (documented !== undefined && implemented.local && !sameDefault(implemented.value, documented)) {
      defaultConflicts.push(`${owner}.${name}: @default ${documented}, implementation ${implemented.value}`)
    }
    defaultValue = implemented.value
  } else if (implemented && documented === undefined) {
    opaqueDefaults.push(`${owner}.${name} = ${implemented.value}`)
  }
  if (defaultValue !== undefined) prop.defaultValue = defaultValue
  if (info.required) prop.required = true
  if (info.description) prop.description = info.description
  return prop
}

/** Compares defaults as values, ignoring quote style, spacing, and trailing commas. */
function sameDefault(first, second) {
  const normalize = value =>
    String(value)
      .replace(/["`]/g, "'")
      .replace(/\s*([{}[\](),:])\s*/g, '$1')
      .replace(/,([}\]])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  return normalize(first) === normalize(second)
}

function byName(first, second) {
  return first.name.localeCompare(second.name)
}

let program
let resolvePassthrough

export function buildDocs(componentName) {
  program ??= getTSProgram(packageDirectory)
  resolvePassthrough ??= createPassthroughResolver(program)
  const checker = program.getTypeChecker()
  const readDefaults = createDefaultsReader(program)
  const directory = path.join(packageDirectory, 'src/components', componentName)
  const sources = glob
    .sync('*.{ts,tsx}', {cwd: directory, absolute: true})
    .filter(file => !/\.(test|stories|storyHelpers)\./.test(file) && !file.endsWith('index.ts'))
    .sort()

  const regions = new Map()
  for (const file of sources) {
    for (const [key, value] of readRegions(file)) if (!regions.has(key)) regions.set(key, value)
  }
  const indexPath = path.join(directory, 'index.ts')
  const exported = readExportedValues(checker, indexPath)
  const exportTypes = new Map([...exported].map(([name, value]) => [name, value.type]))
  const components = readRuntimeExports(indexPath).filter(
    name => /^[A-Z]/.test(name) && isComponentType(exportTypes.get(name)),
  )

  // A directory usually exports its namesake, plus companions such as Token's IssueLabelToken or DataTable's Table.
  // A flat alias of one of the namesake's parts, such as `StackItem` for `Stack.Item`, is not documented twice.
  // A directory that groups siblings instead, such as LiveRegion's Announce, AriaStatus, and AriaAlert, documents
  // each one and lists the names to import.
  const hasNamesake = components.includes(componentName)
  let roots = components
  if (hasNamesake) {
    const parts = readParts(checker, exportTypes.get(componentName))
    const aliases = new Set(parts.map(part => `${componentName}${part.name}`))
    const partTypes = new Set(parts.map(part => part.type))
    roots = [
      componentName,
      ...components.filter(
        name => name !== componentName && !aliases.has(name) && !partTypes.has(exportTypes.get(name)),
      ),
    ]
  }

  const parse = name => {
    try {
      return parseTypeInfo(path.relative(packageDirectory, directory), name, program)
    } catch {
      return undefined
    }
  }

  // Each documented component, followed by its parts, named the way a consumer writes them.
  const entries = []
  for (const root of roots) {
    const info = parse(root)
    if (!info) continue
    const {symbol, type} = exported.get(root)
    entries.push({name: root, root, segments: [], symbol, props: info.props, defaults: readDefaults(indexPath, root)})
    const parts = readParts(checker, type)
    for (const [part, partInfo] of Object.entries(info.subComponents ?? {})) {
      entries.push({
        name: `${root}.${part}`,
        root,
        segments: [part],
        symbol: parts.find(candidate => candidate.name === part)?.symbol,
        props: partInfo.props,
        defaults: readDefaults(indexPath, root, part),
      })
    }
  }

  // A region is usually filled by a part of the same name, such as `ActionList.LeadingVisual` for an item's
  // `leadingVisual`, by a part nested under the owner, or by one prefixed with the owner's name, such as
  // `NavList.GroupHeading` for a group's `heading`.
  const regionChild = (entry, region) => {
    const name = region[0].toUpperCase() + region.slice(1)
    const owner = entry.segments.at(-1)
    const candidates = [[...entry.segments, name], owner ? [`${owner}${name}`] : undefined, [name]].filter(Boolean)
    const found = candidates.find(segments => hasPart(checker, exportTypes.get(entry.root), segments))
    return found ? [entry.root, ...found].join('.') : undefined
  }

  // Regions are declared on the props type, named after the component or part that takes it.
  const ownRegions = entry =>
    regions.get(`${entry.root}${entry.segments.join('')}Props`) ??
    (entry.segments.length > 0 ? regions.get(`${entry.segments.at(-1)}Props`) : undefined) ??
    []

  const documented = entries.map(entry => {
    const props = Object.entries(entry.props)
      .map(([name, info]) => toProp(entry.name, name, info, entry.defaults))
      .filter(prop => prop.name !== 'key')

    for (const region of ownRegions(entry)) {
      const description = regionDescription(region, regionChild(entry, region))
      const existing = props.find(prop => prop.name === region)
      if (existing) existing.description ||= description
      else props.push({name: region, type: 'React.ReactNode', description})
    }

    const typed = entry.symbol && resolvePassthrough(entry.symbol)
    const rendered = readAsDefault(props)
    if (typed?.url.startsWith(MDN_ELEMENTS) && rendered && typed.element !== rendered) {
      elementConflicts.push(
        `${entry.name}: props type passes through to <${typed.element}>, as defaults to '${rendered}'`,
      )
    }
    const passthrough = typed ?? (rendered ? htmlPassthrough(rendered) : undefined)
    return {name: entry.name, props: props.sort(byName), ...(passthrough ? {passthrough} : {})}
  })

  const readme = path.join(directory, 'README.mdx')
  const intent = fs.existsSync(readme)
    ? new RegExp(`^# ${componentName}\\n\\n(.+?)\\n`, 'ms').exec(fs.readFileSync(readme, 'utf8'))?.[1].trim()
    : undefined

  const docs = {
    id: componentName.toLowerCase(),
    name: componentName,
    status: 'alpha',
    importPath: `@primer/react-tailwind/${componentName}`,
  }
  if (!hasNamesake || roots.length > 1) docs.exports = roots
  if (intent) docs.description = intent

  const stories = readStoryIds(directory)
  if (stories) docs.stories = stories

  // Every part is listed, even one with no props of its own, so a reader learns that it exists.
  const namesake = hasNamesake && documented[0]?.name === componentName ? documented.shift() : undefined
  if (namesake?.props.length) docs.props = namesake.props
  if (documented.length > 0) docs.subcomponents = documented
  if (namesake?.passthrough) docs.passthrough = namesake.passthrough

  return docs
}

if (import.meta.filename === process.argv[1]) {
  const only = process.argv.slice(2).filter(argument => !argument.startsWith('--'))
  const components = glob
    .sync('src/components/*/README.mdx', {cwd: packageDirectory})
    .map(file => path.basename(path.dirname(file)))
    .filter(name => only.length === 0 || only.includes(name))
    .sort()

  const unresolved = []
  for (const name of components) {
    const docs = buildDocs(name)
    if (!docs.props && !docs.subcomponents && !docs.passthrough) unresolved.push(name)
    const target = path.join(packageDirectory, 'src/components', name, `${name}.docs.json`)
    fs.writeFileSync(target, `${JSON.stringify(docs, null, 2)}\n`)
  }

  // eslint-disable-next-line no-console
  console.log(`Generated docs.json for ${components.length} component(s).`)
  if (defaultConflicts.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`  @default disagrees with the implementation:\n    ${defaultConflicts.join('\n    ')}`)
    process.exitCode = 1
  }
  if (opaqueDefaults.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`  Computed defaults need a JSDoc @default:\n    ${opaqueDefaults.join('\n    ')}`)
    process.exitCode = 1
  }
  if (elementConflicts.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `  The props type and the as default name different elements:\n    ${elementConflicts.join('\n    ')}`,
    )
    process.exitCode = 1
  }
  if (unresolved.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`  TypeScript documented nothing for: ${unresolved.join(', ')}`)
  }
}
