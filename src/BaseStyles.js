import styled from 'react-emotion'
import {injectGlobal} from 'emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'

injectGlobal(preval`
  const render = require('../lib/render-sass.js')
  const path = require.resolve('./primer-components.scss')
  const source = require('fs').readFileSync(path, 'utf8')
  module.exports = render(source)
`)

const BaseStyles = withSystemProps({
  is: 'div',
  color: 'gray.9',
  fontFamily: 'normal',
  lineHeight: 'default',
  m: 0
}, TYPOGRAPHY)

export default BaseStyles
