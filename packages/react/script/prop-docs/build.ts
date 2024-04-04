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
      const hasPropAdditionalDescription = prop.declarations.find(declaration => {
        return !declaration.fileName.includes('node_modules')
      })

      return Boolean(hasPropAdditionalDescription)
    }

    return true
  },
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

const formatComponentJson = ({description, displayName, props, tags}) => {
  const {alias, primerid, primerstatus, primera11yreviewed, primerstories = '', primerparentid} = tags

  return {
    id: primerid, // TODO: consider auto-generating an ID if one is not present by parsing `displayName`
    description,
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
      const {id, primerparentid} = outputDatum.tags

      const subComponents = docgenOutputData.filter(({tags}) => tags.primerparentid && tags.primerparentid === id)

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
