import fs from 'fs'
import path from 'path'
import type {DocsFile} from './types'
import {parseTypeInfo, type TSParsedComponentInfo, type TSPropInfo} from './ts-utils'

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
        docProp?.defaultValue !== undefined && tsProp?.defaultValue !== undefined
          ? docProp.defaultValue !== tsProp.defaultValue
          : false,
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
  for (const [propName, result] of Object.entries(comparison)) {
    const tsProp = parsedTSInfo.props[propName]
    const docProp = docs.props.find(p => p.name === propName)

    console.log(`Prop: ${propName}`)
    console.table([
      {
        Rule: 'Type',
        TS: tsProp?.type,
        Docs: docProp?.type,
      },
      {
        Rule: 'Required',
        TS: tsProp?.required,
        Docs: docProp?.required,
      },
      {
        Rule: 'Default Value',
        TS: tsProp?.defaultValue,
        Docs: docProp?.defaultValue,
      },
      {
        Rule: 'Description',
        TS: tsProp?.description,
        Docs: docProp?.description,
      },
    ])
    console.log('\n')
  }
}

export async function main() {
  const [action, docsPath] = process.argv.slice(2)
  const verbose = process.argv.includes('-v')

  if (action !== 'update' && action !== 'validate') {
    throw new Error(`Invalid action: ${action}. Expected 'update' or 'validate'.`)
  }

  let componentDocsFile = docsPath

  if (fs.statSync(docsPath).isDirectory()) {
    const foundDocsFile = fs.readdirSync(docsPath).find(f => f.endsWith('docs.json'))
    if (foundDocsFile) {
      componentDocsFile = path.join(docsPath, foundDocsFile)
    }
  }

  const fileContent = fs.readFileSync(componentDocsFile, 'utf-8')
  const docs: DocsFile = JSON.parse(fileContent)
  const componentEntry = path.dirname(componentDocsFile)

  const parsedTSInfo = await parseTypeInfo(componentEntry, docs.name)

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
      ['Missing in TS']: error.missingInTS ? 'x' : undefined,
      ['Missing in Docs']: error.missingInDocs ? 'x' : undefined,
      ['Wrong Types']: error.mismatchedType ? 'x' : undefined,
      ['Wrong Required']: error.mismatchedRequired ? 'x' : undefined,
      ['Wrong Default Value']: error.mismatchedDefaultValue ? 'x' : undefined,
      ['Missing JSDoc']: error.missingJSDoc ? 'x' : undefined,
    })),
  )

  if (verbose) {
    logVerboseComparison(results, docs, parsedTSInfo)
  }
}
