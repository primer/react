const withNextPages = require('@primer/next-pages/plugin')
const configure = require('@primer/blueprints/lib/config')
const {join} = require('path')

module.exports = configure(withNextPages({
  webpack(config, {dev}) {
    config.resolve.alias = {
      [__dirname + '$']: join(__dirname, 'src/index.js'),
      [join(__dirname, 'css$')]: join(__dirname, 'src/css.js')
    }
    return config
  }
}))
