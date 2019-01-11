import styled, {createGlobalStyle} from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; }
  table { border-collapse: collapse; }
`
const Base = (props) => {
  return (
    <div {...props}>
      <GlobalStyle/>
      {props.children}
    </div>
  )
}
const BaseStyles = styled(Base)`
  ${TYPOGRAPHY} ${COMMON};
`

BaseStyles.defaultProps = {
  color: 'gray.9',
  fontFamily: 'normal',
  lineHeight: 'default',
  theme
}

BaseStyles.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  theme: PropTypes.object
}
export default BaseStyles
