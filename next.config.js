const withMDX = require('@zeit/next-mdx')({
  extension: /.mdx?$/
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx']
})


module.exports = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /.mdx?$/,
      use: [
        defaultLoaders.babel,
        '@mdx-js/loader',
      ]
    })

    return config
  }
}
