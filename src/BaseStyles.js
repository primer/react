import React from 'react'
import {injectGlobal} from 'emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'
// eslint-disable-next-line no-unused
import preval from 'preval.macro'

injectGlobal(preval`
  const {renderFile} = require('../lib/render-sass.js')
  const path = require.resolve('./primer-components.scss')
  module.exports = renderFile(path)
`)

const BaseStyles = withSystemProps(
  {
    is: 'div',
    color: 'gray.9',
    fontFamily: 'normal',
    lineHeight: 'default'
  },
  TYPOGRAPHY
)

export default BaseStyles

export const UtilityCSS = preval`
  const {renderSource} = require('../lib/render-sass')
  module.exports = renderSource('@import "primer-utilities/index.scss";')
`

export const MarkdownCSS = preval`
  const {renderSource} = require('../lib/render-sass')
  module.exports = renderSource('@import "primer-markdown/index.scss";')
`
