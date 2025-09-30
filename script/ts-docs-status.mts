import path from 'node:path'
import glob from 'fast-glob'
import {compareTSDocsForComponent} from '@primer/doc-gen'

const rootDir = path.resolve(import.meta.dirname, '..')
const componentDocsFiles = glob.sync(path.join(rootDir, 'packages/react/src/**/*.docs.json'))

const componentSummary: Array<{
  name: string
  brokenProps: string[]
  passingProps: string[]
}> = []

for (const componentDocFile of componentDocsFiles) {
  const {docs, propCompareResults, subComponents} = compareTSDocsForComponent(componentDocFile)

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

  componentSummary.push({
    name: docs.name,
    passingProps,
    brokenProps,
  })

  for (const subCompInfo of subComponents ?? []) {
    const subPassingProps: string[] = []
    const brokenPassingProps: string[] = []

    if (!subCompInfo) {
      continue
    }

    for (const [propName, propResult] of Object.entries(subCompInfo?.propCompareResults ?? {})) {
      if (
        propResult.missingInDocs ||
        propResult.missingInTS ||
        propResult.mismatchedDefaultValue ||
        propResult.mismatchedRequired ||
        // Ignore for now since this is likely to cause some noise in the short-term
        // propResult.mismatchedType ||
        propResult.missingJSDoc
      ) {
        subPassingProps.push(propName)
      } else {
        brokenPassingProps.push(propName)
      }
    }

    componentSummary.push({
      name: subCompInfo.componentName,
      passingProps,
      brokenProps,
    })
  }
}

const {passingPropsCount, totalPropsCount, passingCompsCount} = componentSummary.reduce(
  (acc, comp) => {
    acc.passingPropsCount += comp.passingProps.length
    acc.totalPropsCount += comp.passingProps.length + comp.brokenProps.length
    if (comp.brokenProps.length === 0) {
      acc.passingCompsCount += 1
    }
    return acc
  },
  {passingPropsCount: 0, totalPropsCount: 0, passingCompsCount: 0},
)

// eslint-disable-next-line no-console
console.log(`

## Component Documentation Status

**Status by component count**

![Status by component count](https://geps.dev/progress/${Math.floor((passingCompsCount / componentSummary.length) * 100)})

**Status by prop count**

![Status by prop count](https://geps.dev/progress/${Math.floor((passingPropsCount / totalPropsCount) * 100)})

<details>
  <summary>Detailed Component Summary</summary>

| Component Name | Passing Props (Count) | Passing Props | Broken Props (Count) | Broken Props |
|----------------|-----------------------|---------------|----------------------|--------------|
${componentSummary
  .map(
    component =>
      `| ${[
        component.name,
        component.passingProps.length,
        component.passingProps.join(', '),
        component.brokenProps.length,
        component.brokenProps.join(', '),
      ].join(' | ')} |`,
  )
  .join('\n')}
</details>
`)
