import fs from 'fs'
import path from 'path'
import type {DocsFile} from './types'
import {getTSProgram, parseTypeInfo, updateJSDocsForProp, type TSParsedComponentInfo, type TSPropInfo} from './ts-utils'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

interface PropCompareError {
  name: string
  missingInTS?: boolean
  missingInDocs?: boolean
  missingJSDoc?: boolean
  mismatchedType?: boolean
  mismatchedDefaultValue?: boolean
  mismatchedRequired?: boolean
}

function compareProps(docs: DocsFile, parsedTSInfo: TSParsedComponentInfo): Record<string, PropCompareError> {
  const propResults: Record<string, PropCompareError> = {}

  const allProps = new Set<string>([...docs.props.map(p => p.name), ...Object.keys(parsedTSInfo.props)])

  for (const propName of allProps.keys()) {
    const docProp = docs.props.find(p => p.name === propName)
    const tsProp: TSPropInfo | undefined = parsedTSInfo.props[propName]

    const propSummary: PropCompareError = {
      name: propName,
      missingInTS: tsProp ? false : true,
      missingInDocs: docProp ? false : true,
      mismatchedType: docProp?.type && tsProp?.type && docProp.type !== tsProp.type ? true : false,
      mismatchedRequired: (docProp?.required && !tsProp?.required) || (tsProp?.required && !docProp?.required),
      mismatchedDefaultValue:
        docProp?.defaultValue !== undefined &&
        docProp?.defaultValue !== '' &&
        docProp?.defaultValue !== tsProp?.defaultValue,
      missingJSDoc: docProp?.description && tsProp?.description === undefined ? true : false,
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

    console.log(`Prop: ${propName}`)
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

export async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command('validate [path]', 'Validate the docs.json and TS prop-types for your Component match')
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
    })
    .help('h')
    .alias('h', 'help')
    .parse()

  const {verbose, fix, path: componentPath} = argv

  if (!componentPath || typeof componentPath !== 'string') {
    console.error('Error: Component path is required.')
    process.exit(1)
  }

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
  const program = getTSProgram()

  const parsedTSInfo = await parseTypeInfo(componentEntry, docs.name, program)

  // A few things that we want to check for here
  // Do all of the props in the docs.json file match props that we have access to
  // Are there any props in the source-code that have a mis-matched type or required prop
  // Are any props missing their JSDoc tags for description or default value

  // for the `validate` action, we just want to log and show an error
  // for the `update` action we want to write the update to file

  const results = compareProps(docs, parsedTSInfo)

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

  if (verbose) {
    logVerboseComparison(results, docs, parsedTSInfo)
  }

  if (fix) {
    console.log(`Fixing descriptions for ${docs.name}`)

    for (const [propName, summary] of Object.entries(results)) {
      const tsProp = parsedTSInfo.props[propName]
      const docProp = docs.props.find(p => p.name === propName)

      if ((summary.missingJSDoc || summary.mismatchedDefaultValue) && tsProp && docProp) {
        await updateJSDocsForProp(tsProp, docProp, path.resolve(componentEntry))
        console.log(`Updated JSDoc for ${propName}`)
      }
    }
  }
}
