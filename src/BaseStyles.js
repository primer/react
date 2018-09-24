/* global preval */
import {injectGlobal} from 'emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'

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
