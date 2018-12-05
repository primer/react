import React from 'react'
import styled from 'styled-components'
import theme from './theme'
import {TYPOGRAPHY, COMMON, proto} from './constants'

const Text = styled(proto)`
  ${TYPOGRAPHY}
  ${COMMON}
`

Text.defaultProps = {
  is: 'span',
  theme
}

Text.propTypes ={
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes
}

export default Text
