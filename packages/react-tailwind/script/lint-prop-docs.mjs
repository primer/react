import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import glob from 'fast-glob'
import ts from 'typescript'

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Region props are declared through the `RegionProps<Names>` mapped type so every compound
 * component spells them the same way, and a mapped type cannot carry per-property JSDoc.
 * `lint:region-props` already guarantees they match the regions the component resolves, and
 * the docs generator gives them a canonical description, so they are documented by
 * construction rather than by hand.
 */
const REGION_PROPS_HELPER = 'RegionProps'

/** Props whose meaning is fixed by React itself rather than by the component. */
const INHERENTLY_DOCUMENTED = new Set(['children', 'className', 'style', 'ref', 'key'])

function isPropsTypeName(name) {
  return name.endsWith('Props')
}

/** Reads the region names out of an `extends RegionProps<'a' | 'b'>` clause. */
function readRegionNames(node) {
  const names = new Set()
  const heritage = node.heritageClauses ?? []
  for (const clause of heritage) {
    for (const type of clause.types) {
      if (type.expression.getText() !== REGION_PROPS_HELPER) continue
      for (const argument of type.typeArguments ?? []) {
        for (const literal of argument.types ?? [argument]) {
          if (ts.isLiteralTypeNode(literal) && ts.isStringLiteral(literal.literal)) {
            names.add(literal.literal.text)
          }
        }
      }
    }
  }
  return names
}

function hasDescription(member, source) {
  const jsDoc = ts.getJSDocCommentsAndTags(member)
  for (const doc of jsDoc) {
    const comment = doc.comment
    if (typeof comment === 'string' && comment.trim().length > 0) return true
    if (Array.isArray(comment) && comment.length > 0) return true
  }
  // A single-line `/** ... */` directly above the member is captured above; fall back to a
  // leading comment range so `//`-style descriptions are not silently accepted.
  const leading = ts.getLeadingCommentRanges(source.text, member.pos) ?? []
  return leading.some(range => source.text.slice(range.pos, range.end).startsWith('/**'))
}

/** Collects every own property declared by an exported `*Props` type in one file. */
/** Collects the `*Props` type declarations in a file, keyed by name. */
function readPropsDeclarations(source) {
  const declarations = new Map()
  const visit = node => {
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && isPropsTypeName(node.name.text)) {
      declarations.set(node.name.text, node)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return declarations
}

/**
 * A props type reaches consumers when it is exported, or when an exported type composes it.
 * `SelectPanelProps` is an intersection over a local `SelectPanelBaseProps`, so requiring
 * `export` alone would let that whole surface skip the check; conversely an internal helper
 * component's props are not public and should not be required to carry documentation.
 */
function findPublicTypes(declarations) {
  const isExported = node => node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
  const publicNames = new Set()
  const queue = []

  for (const [name, node] of declarations) {
    if (isExported(node)) {
      publicNames.add(name)
      queue.push(node)
    }
  }

  while (queue.length > 0) {
    const node = queue.pop()
    const referenced = []
    const collect = child => {
      if (ts.isTypeReferenceNode(child) && ts.isIdentifier(child.typeName)) referenced.push(child.typeName.text)
      if (ts.isExpressionWithTypeArguments(child) && ts.isIdentifier(child.expression)) {
        referenced.push(child.expression.text)
      }
      ts.forEachChild(child, collect)
    }
    ts.forEachChild(node, collect)

    for (const name of referenced) {
      if (publicNames.has(name) || !declarations.has(name)) continue
      publicNames.add(name)
      queue.push(declarations.get(name))
    }
  }

  return publicNames
}

/** Collects every own property declared by a publicly reachable `*Props` type in one file. */
export function readProps(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const declarations = readPropsDeclarations(source)
  const publicNames = findPublicTypes(declarations)
  const results = []

  for (const name of publicNames) {
    const node = declarations.get(name)
    if (!node) continue

    if (ts.isInterfaceDeclaration(node)) {
      for (const region of readRegionNames(node)) {
        results.push({type: name, name: region, documented: true, viaRegionHelper: true})
      }
    }

    const members = ts.isInterfaceDeclaration(node)
      ? node.members
      : ts.isTypeLiteralNode(node.type)
        ? node.type.members
        : ts.isIntersectionTypeNode(node.type) || ts.isUnionTypeNode(node.type)
          ? node.type.types.flatMap(part => (ts.isTypeLiteralNode(part) ? part.members : []))
          : []

    for (const member of members) {
      if (!ts.isPropertySignature(member) || !member.name) continue
      const propName = member.name.getText().replace(/['"]/g, '')
      results.push({
        type: name,
        name: propName,
        documented: hasDescription(member, source) || INHERENTLY_DOCUMENTED.has(propName),
        viaRegionHelper: false,
      })
    }
  }

  return results
}

export function collect() {
  // Shared vocabulary types are part of the public surface too, and they appear inlined in
  // many components' generated docs.
  const files = glob.sync('src/{base,components,utils/types}/**/*.{ts,tsx}', {
    absolute: true,
    cwd: packageDirectory,
    ignore: ['**/*.d.ts', '**/*.stories.*', '**/*.storyHelpers.*', '**/*.test.*'],
  })

  const undocumented = []
  let total = 0

  for (const file of files.sort()) {
    for (const prop of readProps(file)) {
      total += 1
      if (prop.documented) continue
      undocumented.push(`${path.relative(packageDirectory, file)}#${prop.type}.${prop.name}`)
    }
  }

  return {total, undocumented: undocumented.sort()}
}

if (import.meta.filename === process.argv[1]) {
  const {total, undocumented} = collect()

  if (undocumented.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`${undocumented.length} prop(s) are missing a JSDoc description:`)
    for (const entry of undocumented) {
      // eslint-disable-next-line no-console
      console.error(`  ${entry}`)
    }
    process.exitCode = 1
  } else {
    // eslint-disable-next-line no-console
    console.log(`Every prop is documented (${total} checked).`)
  }
}
