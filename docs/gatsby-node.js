const defines = require('../babel-defines')

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
      include: modulePath => /@primer\/components/.test(modulePath)
    }
  ]

  // Polyfill `path` and stub `fs` for use in the browser
  // https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#webpack-5-node-configuration-changed-nodefs-nodepath-
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      path: require.resolve('path-browserify')
    },
    fallback: {
      ...config.resolve.fallback,
      fs: false
    }
  }

  actions.replaceWebpackConfig(config)
}

exports.sourceNodes = ({actions, createNodeId, createContentDigest}) => {
  const {createNode} = actions
  const components = [
    {
      name: 'Foo',
      description: 'foo',
      props: [
        {
          name: 'foo',
          required: false,
          type: 'number',
          defaultValue: 2,
          description: 'foo'
        }
      ]
    },
    {
      name: 'Bar',
      description: 'foo',
      props: [
        {
          name: 'foo',
          required: false,
          type: 'number',
          defaultValue: 2,
          description: 'foo'
        }
      ]
    }
  ]

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
        contentDigest: createContentDigest(component)
      }
    }
    const node = Object.assign({}, component, nodeMeta)
    createNode(node)
  }
}
