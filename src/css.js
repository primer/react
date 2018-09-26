// eslint-disable-next-line no-unused
import preval from 'preval.macro'

export const utilities = preval`
  const {renderSource} = require('../lib/render-sass')
  module.exports = renderSource('@import "primer-utilities/index.scss";')
`

export const markdown = preval`
  const {renderSource} = require('../lib/render-sass')
  module.exports = renderSource('@import "primer-markdown/index.scss";')
`
