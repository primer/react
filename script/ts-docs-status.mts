import path from 'node:path'
import glob from 'fast-glob'
import {compareTSDocsForComponent} from '@primer/doc-gen'

const rootDir = path.resolve(import.meta.dirname, '..')
const componentDocsFiles = glob.sync(path.join(rootDir, 'packages/react/src/**/*.docs.json'))

console.log('| Component Name | Passing Props (Count) | Passing Props | Broken Props (Count) | Broken Props |')
console.log('|----------------|-----------------------|---------------|----------------------|--------------|')

for (const componentDocFile of componentDocsFiles) {
  const {docs, propCompareResults} = compareTSDocsForComponent(componentDocFile)

  const passingProps: string[] = []
  const brokenProps: string[] = []

  for (const [propName, propResult] of Object.entries(propCompareResults)) {
    if (
      propResult.missingInDocs ||
      propResult.missingInTS ||
      propResult.mismatchedDefaultValue ||
      propResult.mismatchedRequired ||
      // Ignore for now since this is likely to cause some noise in the short-term
      // propResult.mismatchedType ||
      propResult.missingJSDoc
    ) {
      brokenProps.push(propName)
    } else {
      passingProps.push(propName)
    }
  }

  console.log(
    `| ${docs.name} | ${passingProps.length} | ${passingProps.join(', ')} | ${brokenProps.length} | ${brokenProps.join(', ')} |`,
  )
}
