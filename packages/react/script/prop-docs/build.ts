import ts from 'typescript'
import generate from '@babel/generator'
import {parse} from '@babel/parser'
import traverse from '@babel/traverse'
import type {ArrowFunctionExpression, Identifier, FunctionDeclaration} from '@babel/types'
import {pascalCase, kebabCase} from 'change-case'
import glob from 'fast-glob'
import fs from 'fs'
import prettier from '@prettier/sync'

// TODO: figure out how use ESM instead of CJS for this
const docgen = require('react-docgen-typescript')

const storyPrefix = {
  draft: 'drafts-',
  experimental: 'experimental-',
  deprecated: 'deprecated-',
  alpha: '',
  beta: '',
  stable: '',
}

const docgenOptions = {
  // Gets components cast with `as PolymorphicForwardRefComponent` into the docs, but only the `as` prop is picked up
  // customComponentTypes: ['ForwardRefComponent', 'PolymorphicForwardRefComponent'],
  propFilter: (prop, _component) => {
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
  shouldExtractValuesFromUnion: true,
  skipChildrenPropWithoutDoc: false,
  shouldRemoveUndefinedFromOptional: true,
  componentNameResolver: (exp: ts.Symbol, source: ts.SourceFile) => {
    const nameFromAlias = exp.getJsDocTags().find(tag => tag.name === 'alias')?.text[0].text
    // const defaultExportName = source.statements.find(s => ts.isExportAssignment(s))?.expression.getText()

    // If `@alias` is defined, use that as the component name
    if (nameFromAlias) {
      return nameFromAlias
    }

    // Otherwise, parse out the `displayName` property of the component
    // Stolen from https://github.com/styleguidist/react-docgen-typescript/pull/449
    //
    // TODO: fix this to work when `displayName` is set consecutively
    // Works:
    // ```tsx
    // const Component = () => <div />
    // Component.displayName = 'Component'
    // const Subcomponent = () => <div />
    // Subcomponent.displayName = 'Component.Subcomponent'
    // ```
    //
    // Breaks:
    // ```tsx
    // const Component = () => <div />
    // const Subcomponent = () => <div />
    // Component.displayName = 'Component'
    // Subcomponent.displayName = 'Component.Subcomponent'
    // ```
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
            (expr.left as ts.PropertyAccessExpression).name.escapedText === 'displayName'
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
          (expr.left as ts.PropertyAccessExpression).name.escapedText === 'displayName' &&
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
  },
}

// Parse a file for docgen info
const files = glob.sync(
  // Glob for testing
  // [
  //   './packages/react/src/Avatar/*.tsx',
  //   './packages/react/src/ActionMenu/*.tsx',
  //   './packages/react/src/DataTable/*.tsx',
  //   '!./packages/react/src/**/*.stories.tsx',
  //   '!./packages/react/src/**/*.test.tsx',
  // ],
  ['./packages/react/src/**/*.tsx', '!./packages/react/src/**/*.stories.tsx', '!./packages/react/src/**/*.test.tsx'],
  {
    absolute: true,
  },
)

const docgenOutput = docgen.withCustomConfig('./tsconfig.json', docgenOptions).parse(files)

const printSkippedComponents = () => {
  console.log('COMPONENTS SKIPPED:')

  files.forEach(file => {
    if (!docgenOutput.map(({filePath}) => filePath).includes(file)) {
      console.log(file)
    }
  })

  console.log('\n')
}

const printSkippedProps = () => {
  console.log('PROPS NOT DOCUMENTED:')

  docgenOutput.forEach(({props, filePath, displayName}) => {
    if (Object.keys(props).length === 0) {
      console.log(`${filePath} - ${displayName}`)
    }
  })

  console.log('\n')
}

const rawPropTypeNameWhitelist = [
  'ReactNode',
  'string & ReactNode',
  'ReactNode & string',
  'BetterSystemStyleObject',
  'boolean',
  'boolean | ResponsiveValue<boolean>',
  'ResponsiveValue<boolean> | boolean',
]

// TODO: parse `ResponsiveValue` type
// TODO: figure out how to deal with types like `Viewport | Viewport[]` and `ItemInput | ItemInput[]`
const getTypeName = (type, propName) => {
  if (type.name !== 'enum') {
    return type.name
  }

  if (rawPropTypeNameWhitelist.includes(type.raw)) {
    return type.raw
  }

  return type.value.map(({value}) => value).join(' | ')
}

// TODO: update the `.replace` regex that will work for cases like ActionList
// where the file is named `List.tsx` and the component is named `ActionList`.
const getStoryData = docgenData => {
  const {displayName, filePath, tags} = docgenData
  const {alias, primerstatus, primerstories} = tags

  // Get path to default story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.stories.tsx
  const defaultStoryFilepath = filePath.replace(/\.tsx$/, '.stories.tsx')
  const componentName = alias || displayName

  // Get the default story id
  const defaultStoryId = `${storyPrefix[primerstatus]}components-${String(componentName).toLowerCase()}--default`

  // Get source code for default story
  const {Default: defaultStoryCode} = getStorySourceCode(defaultStoryFilepath)

  // Get path to feature story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.features.stories.tsx
  const featureStoryFilepath = filePath.replace(/\.tsx$/, '.features.stories.tsx')
  const exampleStoryFilepath = filePath.replace(/\.tsx$/, '.examples.stories.tsx')

  // Get source code for each feature story
  const featureStorySourceCode = getStorySourceCode(featureStoryFilepath)
  const exampleStorySourceCode = getStorySourceCode(exampleStoryFilepath)

  // Populate source code for each feature story
  // if stories are not defined in *.docs.json, fill feature stories as default
  const stories = (
    primerstories && primerstories.split(' ').length > 0
      ? primerstories.split(' ').map(id => ({id}))
      : getStoryIds({status: primerstatus, name: componentName}, Object.keys(featureStorySourceCode))
  )
    // Filter out the default story
    .filter(({id}) => id !== defaultStoryId)
    .map(({id}) => {
      const storyName = getStoryName(id)
      const code = id.includes('-features--') ? featureStorySourceCode[storyName] : exampleStorySourceCode[storyName]

      if (!code) {
        throw new Error(
          `Invalid story id "${id}" parsed from ${filePath}. No story named "${storyName}" found in ${featureStoryFilepath}`,
        )
      }

      return {id, code}
    })

  // Add default story to the beginning of the array
  if (defaultStoryCode) {
    stories.unshift({
      id: defaultStoryId,
      code: defaultStoryCode,
    })
  }

  if (stories.length === 0) {
    console.log(
      `No stories found for ${componentName}. Checked for: \n Default story path: ${defaultStoryFilepath}. \n Feature story path: ${featureStoryFilepath}. \n Example story path: ${exampleStoryFilepath}`,
    )
  }

  return stories
}

// TODO: investigate if there is a smarter way to determine the import path
const getImportPath = (status, deprecated) => {
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

const formatComponentJson = ({description, displayName, filePath, props: propsData, tags}) => {
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

  // TODO: don't render everything for subcomponents, just:
  // - name
  // - props
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

// TODO: clean this up to just use a single `.reduce`
const transformArray = (docgenOutputData: any[]): any[] => {
  return docgenOutputData
    .map(outputDatum => {
      const {alias, primerid, primerparentid} = outputDatum.tags

      const subComponents = docgenOutputData.filter(({tags}) => tags.primerparentid && tags.primerparentid === primerid)

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

// write raw docgen output to file
fs.writeFile(
  glob.sync('./packages/react/script/prop-docs/docgen-output.json')[0],
  JSON.stringify(docgenOutput, null, 2),
  err => {
    if (err) {
      console.error(err)
    } else {
      console.log(
        `Components.json generated at: ${glob.sync('./packages/react/script/prop-docs/docgen-output.json')[0]}`,
      )
    }
  },
)

// write formatted docgen output to file ([schema](https://github.com/primer/react/blob/main/packages/react/script/components-json/component.schema.json))
fs.writeFile(
  glob.sync('./packages/react/script/prop-docs/components.json')[0],
  JSON.stringify(
    {
      schemaVersion: 2,
      components: transformArray(docgenOutput),
    },
    null,
    2,
  ),
  err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Components.json generated at: ${glob.sync('./packages/react/script/prop-docs/components.json')[0]}`)
    }
  },
)

// log debugging info

printSkippedComponents()
printSkippedProps()

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------

/**
 * Returns an object mapping story names to their source code
 *
 * @example
 * getStorySourceCode('src/components/Button/Button.stories.tsx')
 * // {Default: '<Button>Button</Button>'}
 */
function getStorySourceCode(filepath: string) {
  if (!fs.existsSync(filepath)) {
    return {}
  }

  const code = fs.readFileSync(filepath, 'utf-8')

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const stories: Record<string, string> = {}

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const varDeclaration = path.node.declaration

      let id: Identifier
      let func: ArrowFunctionExpression | FunctionDeclaration

      if (varDeclaration?.type === 'VariableDeclaration') {
        id = varDeclaration.declarations[0].id as Identifier
        const init = varDeclaration.declarations[0].init
        if (init?.type === 'ArrowFunctionExpression') func = init
        else return // not a function = not story
      } else if (varDeclaration?.type === 'FunctionDeclaration') {
        id = varDeclaration.id as Identifier
        func = varDeclaration
      } else {
        return // not a function = not story
      }

      const code = prettier
        .format(generate(func).code, {
          parser: 'typescript',
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
        })
        .trim()
        .replace(/;$/, '')
        .replace(/^;/, '')

      const name = id.name
      stories[name] = code
    },
  })

  return stories
}

function getStoryName(id: string) {
  const parts = id.split('--')
  return pascalCase(parts[parts.length - 1])
}

function getStoryIds(docs: any, storyNames: string[]) {
  const ids = storyNames.map(
    storyName =>
      `${storyPrefix[docs.status]}components-${String(docs.name).toLowerCase()}-features--${kebabCase(storyName)}`,
  )

  return ids.map(id => ({id}))
}
