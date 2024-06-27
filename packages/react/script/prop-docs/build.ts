const docgen = require('react-docgen-typescript')
const globby = require('globby')

const fs = require('node:fs')

const docgenOptions = {
  // savePropValueAsString: true,
  // allowSyntheticDefaultImports might let us avoid separately importing types from React
  // (e.g.: you can do `React.FC` instead of importing and using `FC` from React)
  // allowSyntheticDefaultImports: true,
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
  //TODO: figure out how we might use the `componentNameResolver` option to fix react-docgen-typescript's
  // issues with component files that have a displayName.
  //
  // When `.displayName` is set in the component file::
  // - none of the subcomponents (e.g.: ActionMenu.Anchor) are parsed by docgen
  // - the root component end up getting documented with the name of the last subcomponent's displayName (e.g.: `ActionMenu` and its props get documented with the display name 'ActionMenu.Anchor')
  //
  // This PR might have some hints: https://github.com/styleguidist/react-docgen-typescript/pull/449
}

// const noPropsWhitelist = [
//   'ButtonGroup/ButtonGroup.tsx',
//   {fileName: 'ConfirmationDialog/ConfirmationDialog.tsx', displayName: 'useConfirm'},
//   'UnderlineNav/LoadingCounter.tsx',
//   {fileName: 'components/LiveRegion.tsx', displayName: 'LiveRegion'},
//   {fileName: 'DataTable/Table.tsx', displayName: 'TableActions'},
//   {fileName: 'DataTable/Table.tsx', displayName: 'TableHead'},
//   {fileName: 'DataTable/Table.tsx', displayName: 'TableBody'},
//   {fileName: 'DataTable/Table.tsx', displayName: 'TableRow'},
// ]

// Parse a file for docgen info
const files = globby.sync(
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
const docgenOutput = docgen.parse(files, docgenOptions)

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

const formatComponentJson = ({description, displayName, filePath, props, tags}) => {
  const {alias, primerdocsid, primerid, primerstatus, primera11yreviewed, primerstories = '', primerparentid} = tags

  // TODO: add importPath
  // - default to `primer/react`
  // - drafts/ get `primer/react/drafts`
  // - deprecated/ get `primer/react/deprecated`
  return {
    // `filePath` is just used for debugging. It may not actually be necessary.
    filePath,
    id: primerid, // TODO: consider auto-generating an ID if one is not present by parsing `displayName`
    description,
    docsId: primerdocsid,
    name: primerparentid && alias ? alias : displayName,
    status: primerstatus,
    a11yReviewed: primera11yreviewed === 'true',
    stories: primerstories.split(' '),
    props: Object.keys(props).map(propName => {
      const {type, required, description, defaultValue} = props[propName]

      return {
        name: propName,
        type: type.name,
        required,
        description,
        defaultValue: defaultValue ? defaultValue.value : null,
      }
    }),
  }
}

const transformArray = (docgenOutputData: any[]): any[] => {
  return docgenOutputData
    .map(outputDatum => {
      const {primerid, primerparentid} = outputDatum.tags

      const subComponents = docgenOutputData.filter(({tags}) => tags.primerparentid && tags.primerparentid === primerid)

      if (!primerparentid) {
        return {
          ...formatComponentJson(outputDatum),
          subcomponents: subComponents.map(formatComponentJson),
        }
      }
    })
    .filter(Boolean)
}

// write raw docgen output to file
fs.writeFile(
  globby.sync('./packages/react/script/prop-docs/docgen-output.json')[0],
  JSON.stringify(docgenOutput, null, 2),
  err => {
    if (err) {
      console.error(err)
    } else {
      console.log(
        `Components.json generated at: ${globby.sync('./packages/react/script/prop-docs/docgen-output.json')[0]}`,
      )
    }
  },
)

// write formatted docgen output to file ([schema](https://github.com/primer/react/blob/main/packages/react/script/components-json/component.schema.json))
fs.writeFile(
  globby.sync('./packages/react/script/prop-docs/components.json')[0],
  JSON.stringify(transformArray(docgenOutput), null, 2),
  err => {
    if (err) {
      console.error(err)
    } else {
      console.log(
        `Components.json generated at: ${globby.sync('./packages/react/script/prop-docs/components.json')[0]}`,
      )
    }
  },
)

// log debugging info

printSkippedComponents()
printSkippedProps()
