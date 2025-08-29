import fs from 'fs'
import path from 'path'
import type {AuthoredDocsFile, AuthoredDocsPropInfo, DocsFile} from './types'
import {getTSProgram, parseTypeInfo, updateJSDocsForProp, type TSParsedComponentInfo, type TSPropInfo} from './ts-utils'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

export interface PropCompareError {
  name: string
  missingInTS?: boolean
  missingInDocs?: boolean
  missingJSDoc?: boolean
  mismatchedType?: boolean
  mismatchedDefaultValue?: boolean
  mismatchedRequired?: boolean
}

export function createComparisonSummary(
  docsProps: AuthoredDocsPropInfo[],
  parsedTSInfo: TSParsedComponentInfo,
): Record<string, PropCompareError> {
  const propResults: Record<string, PropCompareError> = {}

  const allProps = new Set<string>([...docsProps.map(p => p.name), ...Object.keys(parsedTSInfo.props)])

  for (const propName of allProps.keys()) {
    const docProp = docsProps.find(p => p.name === propName)
    const tsProp: TSPropInfo | undefined = parsedTSInfo.props[propName]

    const propSummary: PropCompareError = {
      name: propName,
      missingInTS: tsProp ? false : true,
      missingInDocs: docProp ? false : true,
      mismatchedType:
        (docProp?.type === undefined && tsProp?.type === undefined) ||
        (docProp?.type && tsProp?.type && docProp.type !== tsProp.type)
          ? true
          : false,
      mismatchedRequired: (docProp?.required && !tsProp?.required) || (tsProp?.required && !docProp?.required),
      mismatchedDefaultValue:
        docProp?.defaultValue !== undefined &&
        docProp.defaultValue !== '' &&
        docProp.defaultValue !== tsProp?.defaultValue,
      missingJSDoc: docProp?.description && !tsProp?.description ? true : false,
    }

    propResults[propName] = propSummary
  }

  return propResults
}

function logVerboseComparison(
  comparison: Record<string, PropCompareError>,
  docs: DocsFile,
  parsedTSInfo: TSParsedComponentInfo,
) {
  for (const [propName, summary] of Object.entries(comparison)) {
    const tsProp = parsedTSInfo.props[propName]
    const docProp = docs.props.find(p => p.name === propName)

    // eslint-disable-next-line no-console
    console.log(`Prop: ${propName}`)
    // eslint-disable-next-line no-console
    console.table([
      {
        Rule: 'Type',
        Match: summary.mismatchedType ? '❌' : '✅',
        TS: tsProp?.type,
        Docs: docProp?.type,
      },
      {
        Rule: 'Required',
        Match: summary.mismatchedRequired ? '❌' : '✅',
        TS: tsProp?.required,
        Docs: docProp?.required,
      },
      {
        Rule: 'Default Value',
        Match: summary.mismatchedDefaultValue ? '❌' : '✅',
        TS: tsProp?.defaultValue,
        Docs: docProp?.defaultValue,
      },
      {
        Rule: 'Description',
        Match: summary.missingJSDoc ? '❌' : '✅',
        TS: tsProp?.description,
        Docs: docProp?.description,
      },
    ])
  }
}

function logPropComparison(results: Record<string, PropCompareError>) {
  // eslint-disable-next-line no-console
  console.table(
    Object.entries(results).map(([propName, error]) => ({
      Prop: propName,
      ['Missing in TS']: error.missingInTS ? '❌' : undefined,
      ['Missing in Docs']: error.missingInDocs ? '❌' : undefined,
      ['Mismatched Types']: error.mismatchedType ? '❌' : undefined,
      ['Mismatched Required']: error.mismatchedRequired ? '❌' : undefined,
      ['Mismatched Default Value']: error.mismatchedDefaultValue ? '❌' : undefined,
      ['Mismatched JSDoc']: error.missingJSDoc ? '❌' : undefined,
    })),
  )
}

export function processDocsFile(docsFilePath: string): DocsFile {
  const fileContent = fs.readFileSync(docsFilePath, 'utf-8')
  const authoredDocs: AuthoredDocsFile = JSON.parse(fileContent)
  const printAllSummary = process.env.SHOW_ALL === '1'

  // Check and return early so we don't spend time creating a ts-program when it's not needed
  const hasInheritedProps = authoredDocs.props.some(p => p.derive)
  if (!hasInheritedProps && !printAllSummary) {
    return authoredDocs
  }

  const parsedTSInfo = parseTypeInfo(path.dirname(docsFilePath), authoredDocs.name)

  if (printAllSummary) {
    const summary = createComparisonSummary(authoredDocs.props, parsedTSInfo)
    logPropComparison(summary)
  }

  authoredDocs.props = authoredDocs.props.map(({derive, ...rest}) => {
    const tsInfo = parsedTSInfo.props[rest.name]

    if (derive && tsInfo) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {source, propSymbol, ...restTSInfo} = tsInfo

      return {
        ...rest,
        ...restTSInfo,
      }
    }

    return rest
  })

  return authoredDocs
}

/**
 * Update the .docs.json file for the component to pull props from TypeScript
 * Since we're only writing back the JSDoc & default values, we're only going to remove those if there are conflicts
 * Remove the others if they're the same
 */
async function updateDocsFileForProp(docsFilePath: string, propSummary: PropCompareError): Promise<void> {
  const currentDocsFile = await fs.promises.readFile(docsFilePath, 'utf-8')
  const authoredDocs: AuthoredDocsFile = JSON.parse(currentDocsFile)

  authoredDocs.props = authoredDocs.props.map(p => {
    const overrides: Partial<AuthoredDocsPropInfo> = {
      description: undefined,
      defaultValue: undefined,
    }

    if (!propSummary.mismatchedRequired) {
      overrides.required = undefined
    }

    if (!propSummary.mismatchedType) {
      overrides.type = undefined
    }

    // Split these up so we retain the original prop order, unless we're removing something
    return {
      ...p,
      ...overrides,
    }
  })

  await fs.promises.writeFile(docsFilePath, `${JSON.stringify(authoredDocs, null, 2)}\n`, 'utf-8')
}

export function compareTSDocsForComponent(componentPath: string) {
  let componentDocsFile = componentPath

  if (fs.statSync(componentPath).isDirectory()) {
    const foundDocsFile = fs.readdirSync(componentPath).find(f => f.endsWith('docs.json'))
    if (foundDocsFile) {
      componentDocsFile = path.join(componentPath, foundDocsFile)
    }
  }

  const fileContent = fs.readFileSync(componentDocsFile, 'utf-8')
  const docs: DocsFile = JSON.parse(fileContent)
  const componentEntry = path.dirname(componentDocsFile)
  const program = getTSProgram(componentEntry)

  const parsedTSInfo = parseTypeInfo(componentEntry, docs.name, program)

  const results = createComparisonSummary(docs.props, parsedTSInfo)

  return {
    propCompareResults: results,
    parsedTSInfo,
    docs,
    componentDocsFile,
    componentDir: componentEntry,
    subComponents: docs.subcomponents
      ?.map(subCompInfo => {
        const parsedTS = Object.values(parsedTSInfo.subComponents ?? {}).find(
          tsComp => tsComp.componentName === subCompInfo.name,
        )

        if (parsedTS) {
          return {
            componentName: subCompInfo.name,
            parsedTSInfo: parsedTS,
            docs: subCompInfo,
            propCompareResults: createComparisonSummary(subCompInfo.props, parsedTS),
          }
        }
      })
      .filter(Boolean),
  }
}

export async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command('validate [path]', 'Validate the docs.json and TS prop-types for your Component match')
    .positional('path', {
      describe: 'Path to the component directory or docs.json file',
      type: 'string',
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
    })
    .help('h')
    .strictCommands()
    .alias('h', 'help')
    .parse()

  const {verbose, fix, path: componentPath} = argv

  if (!componentPath || typeof componentPath !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Error: Component path is required.')
    process.exit(1)
  }

  const {propCompareResults, parsedTSInfo, docs, componentDocsFile, componentDir, subComponents} =
    compareTSDocsForComponent(componentPath)

  // eslint-disable-next-line no-console
  console.log(`${docs.name}`)
  logPropComparison(propCompareResults)

  for (const subCompInfo of subComponents ?? []) {
    if (!subCompInfo) {
      continue
    }

    // eslint-disable-next-line no-console
    console.log(`\n${subCompInfo.componentName}`)
    logPropComparison(subCompInfo.propCompareResults)
  }

  if (verbose) {
    logVerboseComparison(propCompareResults, docs, parsedTSInfo)
  }

  if (fix) {
    // eslint-disable-next-line no-console
    console.log(`Fixing descriptions for ${docs.name}`)

    // Sort props by file & location so we can write updates from the bottom up
    // This preserves their original location in the file prior to being overridden
    const groupedPropsBySourceFile = Object.entries(propCompareResults).reduce<
      Record<string, Array<{name: string; location: number}>>
    >((acc, [propName]) => {
      const tsProp = parsedTSInfo.props[propName]
      const sourceFile = tsProp?.source?.fileName

      if (sourceFile) {
        acc[sourceFile] = [
          ...(acc[sourceFile] ?? []),
          {
            name: propName,
            location: tsProp.propSymbol.valueDeclaration?.getStart() ?? 0,
          },
        ]
      }

      return acc
    }, {})

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_sourceFile, props] of Object.entries(groupedPropsBySourceFile)) {
      for (const {name: propName} of props.sort((a, b) => b.location - a.location)) {
        const tsProp = parsedTSInfo.props[propName]
        const docProp = docs.props.find(p => p.name === propName)
        const summary = propCompareResults[propName]

        if (tsProp && docProp) {
          if (summary.missingJSDoc || summary.mismatchedDefaultValue) {
            await updateJSDocsForProp(tsProp, docProp, path.resolve(componentDir))
          }

          if (!summary.missingInTS) {
            await updateDocsFileForProp(componentDocsFile, summary)
          }
        }

        // eslint-disable-next-line no-console
        console.log(`Updated JSDoc for ${propName}`)
      }
    }
  }
}
