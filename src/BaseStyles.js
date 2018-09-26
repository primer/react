import {injectGlobal} from 'emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'
// eslint-disable-next-line no-unused
import sass from 'sass.macro'

injectGlobal(sass`
  @import "./primer-components.scss";
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
