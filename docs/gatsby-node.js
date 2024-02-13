const defines = require('../packages/react/babel-defines')
const docgen = require('react-docgen-typescript')
const globby = require('globby')

exports.onCreateWebpackConfig = ({actions, plugins, loaders, getConfig}) => {
  const config = getConfig()
  // Add our `__DEV__` and `process.env.NODE_ENV` defines
  config.plugins.push(plugins.define(defines[process.env.NODE_ENV || 'development']))

  config.module.rules = [
    ...config.module.rules,
    // Create a custom configuration.
    {
      // The new configuration is based off the original...
      ...loaders.js(),
      test: /\.jsx?$/,
      exclude: modulePath => /node_modules/.test(modulePath),
      // ...except that we want to run Primer React through webpack as well.
      // By default, Gatsby won't use the define plugin we added above on Primer React.
      include: modulePath => /@primer\/components/.test(modulePath),
    },
  ]

  // Polyfill `path` and stub `fs` for use in the browser
  // https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#webpack-5-node-configuration-changed-nodefs-nodepath-
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      path: require.resolve('path-browserify'),
    },
    fallback: {
      ...config.resolve.fallback,
      fs: false,
    },
  }

  actions.replaceWebpackConfig(config)
}

exports.sourceNodes = ({actions, createNodeId, createContentDigest}) => {
  const {createNode} = actions

  // Extract component metadata from source files
  const files = globby.sync(['../packages/react/src/**/*.tsx'], {absolute: true})
  const data = docgen.parse(files, {
    savePropValueAsString: true,
    propFilter: prop => {
      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        const hasPropAdditionalDescription = prop.declarations.find(declaration => {
          return !declaration.fileName.includes('node_modules')
        })

        return Boolean(hasPropAdditionalDescription)
      }

      return true
    },
  })

  const components = data.map(component => {
    return {
      name: component.displayName,
      description: component.description,
      props: Object.values(component.props)
        .map(prop => {
          return {
            name: prop.name,
            description: prop.description,
            defaultValue: prop.defaultValue ? prop.defaultValue.value : '',
            required: prop.required,
            type: prop.type.name,
          }
        })
        // Move required props to beginning of the list
        .sort((a, b) => {
          if (a.required && !b.required) return -1
          if (!a.required && b.required) return 1
          return 0
        }),
    }
  })

  // Add component metadata to GraphQL API
  for (const component of components) {
    const nodeContent = JSON.stringify(component)
    const nodeMeta = {
      id: createNodeId(component.name),
      parent: null,
      children: [],
      internal: {
        type: `ComponentMetadata`,
        mediaType: `text/html`,
        content: nodeContent,
        contentDigest: createContentDigest(component),
      },
    }
    const node = Object.assign({}, component, nodeMeta)
    createNode(node)
  }
}
