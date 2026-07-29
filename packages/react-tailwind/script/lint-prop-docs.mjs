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
export function readProps(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const results = []

  const visit = node => {
    const isExported = node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)

    if (ts.isInterfaceDeclaration(node) && isExported && isPropsTypeName(node.name.text)) {
      const regions = readRegionNames(node)
      for (const name of regions) {
        results.push({type: node.name.text, name, documented: true, viaRegionHelper: true})
      }
      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || !member.name) continue
        const name = member.name.getText().replace(/['"]/g, '')
        results.push({
          type: node.name.text,
          name,
          documented: hasDescription(member, source) || INHERENTLY_DOCUMENTED.has(name),
          viaRegionHelper: false,
        })
      }
    }

    if (ts.isTypeAliasDeclaration(node) && isExported && isPropsTypeName(node.name.text)) {
      const members = ts.isTypeLiteralNode(node.type)
        ? node.type.members
        : ts.isIntersectionTypeNode(node.type)
          ? node.type.types.flatMap(part => (ts.isTypeLiteralNode(part) ? part.members : []))
          : []
      for (const member of members) {
        if (!ts.isPropertySignature(member) || !member.name) continue
        const name = member.name.getText().replace(/['"]/g, '')
        results.push({
          type: node.name.text,
          name,
          documented: hasDescription(member, source) || INHERENTLY_DOCUMENTED.has(name),
          viaRegionHelper: false,
        })
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return results
}

export function collect() {
  const files = glob.sync('src/components/**/*.{ts,tsx}', {
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
  const baselinePath = path.join(packageDirectory, 'prop-docs-baseline.json')
  const {total, undocumented} = collect()
  const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')).undocumented : []
  const known = new Set(baseline)

  const added = undocumented.filter(entry => !known.has(entry))
  const fixed = baseline.filter(entry => !undocumented.includes(entry))

  if (process.argv.includes('--update-baseline')) {
    fs.writeFileSync(
      baselinePath,
      `${JSON.stringify(
        {
          $comment:
            'Props still missing a JSDoc description. This list may only shrink; lint:prop-docs fails on additions and on stale entries.',
          undocumented,
        },
        null,
        2,
      )}\n`,
    )
    // eslint-disable-next-line no-console
    console.log(`Recorded ${undocumented.length} undocumented props of ${total}.`)
    process.exit(0)
  }

  if (added.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`${added.length} prop(s) added without a JSDoc description:`)
    // eslint-disable-next-line no-console
    for (const entry of added) console.error(`  ${entry}`)
  }

  if (fixed.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`${fixed.length} baseline entr(ies) are now documented. Run with --update-baseline to record it:`)
    // eslint-disable-next-line no-console
    for (const entry of fixed) console.error(`  ${entry}`)
  }

  if (added.length > 0 || fixed.length > 0) process.exit(1)

  // eslint-disable-next-line no-console
  console.log(
    `Prop descriptions checked: ${total - undocumented.length}/${total} documented, ${baseline.length} known gaps.`,
  )
}
