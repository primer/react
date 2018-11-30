import styled from 'styled-components'
import {TYPOGRAPHY, COMMON} from './constants'

const BaseStyles = styled.div`
 ${TYPOGRAPHY} ${COMMON}
`

BaseStyles.defaultProps = {
  color: 'gray.9',
  fontFamily: 'normal',
  lineHeight: 'default'
}

BaseStyles.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes
}
export default BaseStyles
