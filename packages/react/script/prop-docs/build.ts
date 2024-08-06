// TODO: correctly write all the types

import ts from 'typescript'
import glob from 'fast-glob'
import fs from 'fs'
import {getStoryData} from './story-parsing-helpers'
import type {Component, ComponentDoc, PropItem, PropItemType} from './types'
// TODO: figure out how use ESM instead of CJS for this
const docgen = require('react-docgen-typescript')

const files = glob.sync(
  [
    './packages/react/src/**/*.tsx',
    '!./packages/react/src/**/*.stories.tsx',
    '!./packages/react/src/**/*.test.tsx',
    '!./packages/react/src/**/*.figma.tsx',
  ],
  {
    absolute: true,
  },
)

const docgenOutput = docgen
  .withCustomConfig('./tsconfig.json', {
    propFilter: (prop: PropItem, _component: Component) => {
      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        // TODO: figure out how to choose which props we want to document.
        // This will filter out ALL props that are defined by a package from `node_modules`,
        // but we might want to document props like `className` or `children`.
        // I think this might also be what's breaking components that use `ComponentProps<P>`.
        const hasPropAdditionalDescription = prop.declarations.find(declaration => {
          return !declaration.fileName.includes('node_modules')
        })

        return Boolean(hasPropAdditionalDescription)
      }

      return true
    },
    // `shouldIncludeExpression` would include the expression data in the docgen output
    // but that `JSON.stringify` to choke on circular references
    // shouldIncludeExpression: true,
    shouldExtractValuesFromUnion: true,
    skipChildrenPropWithoutDoc: false,
    shouldRemoveUndefinedFromOptional: true,
    componentNameResolver: (exp: ts.Symbol, source: ts.SourceFile) => {
      const aliasJSDocTag = exp.getJsDocTags().find(tag => tag.name === 'alias')?.text?.[0]?.text
      const expressionName = exp.getName()
      const componentDisplayNameProperty = getTextValueOfFunctionProperty(exp, source, 'displayName')
      const supportedComponentTypes = [
        'default',
        '__function',
        'Stateless',
        'StyledComponentClass',
        'StyledComponent',
        'FunctionComponent',
        'StatelessComponent',
        'ForwardRefExoticComponent',
        'MemoExoticComponent',
        // `ForwardRefComponent` and `PolymorphicForwardRefComponent` are the types
        // for components cast with `as PolymorphicForwardRefComponent`
        'ForwardRefComponent',
        'PolymorphicForwardRefComponent',
      ]

      // If `@alias` JSDoc tag is set, use that as the component name
      if (aliasJSDocTag) {
        return aliasJSDocTag
      }

      // If the component function has a `displayName` property, use that as the component name
      if (componentDisplayNameProperty) {
        return componentDisplayNameProperty || ''
      }

      // If the name of the function is not one of the default React component names, use the name of the function
      if (!supportedComponentTypes.includes(expressionName)) {
        return expressionName
      }

      // If none of those apply, return a falsy value which makes `react-docgen-typescript`
      // use its internal logic to determine the component name
      return undefined
    },
  })
  .parse(files)

// -----------------------------------------------------------------------------
// Write JSON files for:
// 1. Raw docgen output
// 2. Component API data formatted to follow the components [schema](https://github.com/primer/react/blob/main/packages/react/script/components-json/component.schema.json)
// -----------------------------------------------------------------------------
/**
 * Writes raw docgen output to a JSON file
 */
fs.writeFile(
  glob.sync('./packages/react/script/prop-docs/docgen-output.json')[0],
  JSON.stringify(docgenOutput, null, 2),
  err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `Components.json generated at: ${glob.sync('./packages/react/script/prop-docs/docgen-output.json')[0]}`,
      )
    }
  },
)

/**
 * Writes formatted docgen output to a JSON file following the components [schema](https://github.com/primer/react/blob/main/packages/react/script/components-json/component.schema.json)
 */
fs.writeFile(
  glob.sync('./packages/react/script/prop-docs/components.json')[0],
  JSON.stringify(
    {
      schemaVersion: 2,
      components: docgenArrayToComponentsObj(docgenOutput),
    },
    null,
    2,
  ),
  err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } else {
      // eslint-disable-next-line no-console
      console.log(`Components.json generated at: ${glob.sync('./packages/react/script/prop-docs/components.json')[0]}`)
    }
  },
)

// -----------------------------------------------------------------------------
// Log components and props that were not documented
// -----------------------------------------------------------------------------
printSkippedComponents()
printSkippedProps()

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------
/**
 * Returns the value of the `displayName` property of a function.
 * Stolen from https://github.com/styleguidist/react-docgen-typescript/pull/449
 * @todo fix this to work when `displayName` is set consecutively and there is no `@alias` JSDoc tag.
   Works:
   ```tsx
   const Component = () => <div />
   Component.displayName = 'Component'
   const Subcomponent = () => <div />
   Subcomponent.displayName = 'Component.Subcomponent'
   ```
   Breaks:
   ```tsx
   const Component = () => <div />
   const Subcomponent = () => <div />
   Component.displayName = 'Component'
   Subcomponent.displayName = 'Component.Subcomponent'
   ```
 *
 */
function getTextValueOfFunctionProperty(exp: ts.Symbol, source: ts.SourceFile, propertyName: string) {
  const [textValue] = source.statements
    .filter(statement => ts.isExpressionStatement(statement))
    .filter(statement => {
      const expr = (statement as ts.ExpressionStatement).expression as ts.BinaryExpression

      const locals = Array.from((source as any).locals as [string, ts.Symbol][])
      const hasOneLocalExport = locals.filter(local => !!local[1].exports).length === 1

      if (hasOneLocalExport) {
        return (
          expr.left &&
          (expr.left as ts.PropertyAccessExpression).name &&
          (expr.left as ts.PropertyAccessExpression).name.escapedText === propertyName
        )
      }

      /**
       * Ensure the .displayName is for the currently processing function.
       *
       * This avoids the following situations:
       *
       *  - A file has multiple functions, one has `.displayName`, and all
       *    functions ends up with that same `.displayName` value.
       *
       *  - A file has multiple functions, each with a different
       *    `.displayName`, but the first is applied to all of them.
       */
      const flowNodeNameEscapedText = (statement as any)?.flowNode?.node?.name?.escapedText as
        | false
        | ts.__String
        | undefined

      return (
        expr.left &&
        (expr.left as ts.PropertyAccessExpression).name &&
        (expr.left as ts.PropertyAccessExpression).name.escapedText === propertyName &&
        flowNodeNameEscapedText === exp.escapedName
      )
    })
    .filter(statement => {
      return ts.isStringLiteral(((statement as ts.ExpressionStatement).expression as ts.BinaryExpression).right)
    })
    .map(statement => {
      return (((statement as ts.ExpressionStatement).expression as ts.BinaryExpression).right as ts.Identifier).text
    })

  return textValue || ''
}

/**
 * Returns our desired type names using raw type data from `react-docgen-typescript`
 * @todo parse `ResponsiveValue` type
 * @todo figure out how to deal with types like `Viewport | Viewport[]` and `ItemInput | ItemInput[]`
 */
function getTypeName(type: PropItemType, _propName: string) {
  const rawPropTypeNameWhitelist = [
    'ReactNode',
    'string & ReactNode',
    'ReactNode & string',
    'BetterSystemStyleObject',
    'boolean',
    'boolean | ResponsiveValue<boolean>',
    'ResponsiveValue<boolean> | boolean',
  ]

  if (type.name !== 'enum') {
    return type.name
  }

  if (type.raw && rawPropTypeNameWhitelist.includes(type.raw)) {
    return type.raw
  }

  return type.value.map(({value}) => value).join(' | ')
}

// TODO: investigate if there is a smarter way to determine the import path
function getImportPath(status: string, deprecated: boolean) {
  if (status === 'deprecated' || deprecated) {
    return '@primer/react/deprecated'
  }

  // TODO: eventually all `draft` components should be moved to `experimental`
  if (status === 'draft') {
    return '@primer/react/drafts'
  }

  if (status === 'experimental') {
    return '@primer/react/experimental'
  }

  return '@primer/react'
}

/**
 * Converts an item from the docgen output array to the component JSON [schema](https://github.com/primer/react/blob/main/packages/react/script/components-json/component.schema.json)
 */
function formatComponentJson(docgenOutputItem: ComponentDoc) {
  const {description, displayName, filePath, props: propsData, tags} = docgenOutputItem
  const {alias, deprecated, primerdocsid, primerid, primerstatus, primera11yreviewed, primerparentid} = tags

  const componentName = alias || displayName
  const stories = primerparentid ? [] : getStoryData({description, displayName, filePath, propsData, tags})
  const props = Object.keys(propsData).map(propName => {
    const {type, required, description, defaultValue} = propsData[propName]

    return {
      name: propName,
      type: getTypeName(type, propName),
      required,
      description,
      defaultValue: defaultValue ? defaultValue.value : '',
    }
  })
  const importPath = getImportPath(primerstatus, deprecated)

  return {
    // `filePath` is just used for debugging. It may not actually be necessary.
    // filePath,
    ...(!primerparentid ? {id: primerid} : {}),
    ...(!primerparentid ? {docsId: primerdocsid} : {}),
    name: componentName,
    ...(!primerparentid ? {status: primerstatus} : {}),
    ...(!primerparentid ? {a11yReviewed: primera11yreviewed === 'true'} : {}),
    // TODO: decide whether or not we want a `description` field
    // description,
    ...(!primerparentid ? {stories} : {}),
    ...(!primerparentid ? {importPath} : {}),
    props,
  }
}

/**
 * Converts the docgen output to an array of components
 * @todo clean this up to just use a single `.reduce`
 */
function docgenArrayToComponentsObj(docgenOutputData: any[]) {
  return docgenOutputData
    .map(outputDatum => {
      const {primerid, primerparentid} = outputDatum.tags

      const subComponents = docgenOutputData.filter(({tags}) => tags.primerparentid && tags.primerparentid === primerid)

      // This uses the `@primerid` and `@primerparentid` JSDoc tags to determine if the
      // item is a component. If it's not a component, we skip it.
      // TODO: make this smart enough to know when we just have a parsing error, but the
      // component ID is actually there.
      if (!primerparentid && !primerid) {
        // console.error(
        //   `Component with the name ${
        //     alias || outputDatum.displayName
        //   } is missing an id. Use the '@primerid' JSDoc tag to add one. Not added to components.json. \n File path: ${
        //     outputDatum.filePath
        //   } \n\n`,
        // )
        return
      }

      if (primerid && !primerparentid) {
        return {
          [primerid]: {
            ...formatComponentJson(outputDatum),
            subcomponents: subComponents.map(formatComponentJson),
          },
        }
      }
    })
    .filter(Boolean)
    .reduce((acc, val) => Object.assign(acc, val), {})
}

function printSkippedComponents() {
  // eslint-disable-next-line no-console
  console.log('COMPONENTS SKIPPED:')

  for (const file of files) {
    if (!docgenOutput.map(({filePath}) => filePath).includes(file)) {
      // eslint-disable-next-line no-console
      console.log(file)
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n')
}

function printSkippedProps() {
  // eslint-disable-next-line no-console
  console.log('PROPS NOT DOCUMENTED:')

  for (const {props, filePath, displayName} of docgenOutput) {
    if (Object.keys(props).length === 0) {
      // eslint-disable-next-line no-console
      console.log(`${filePath} - ${displayName}`)
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n')
}
