import styled from 'styled-components'
import {addDocumentedProps, PropTypes} from './PropsDocs'
import {COMMON, LAYOUT} from './constants'
import theme from './theme'

const Box = styled.div`
  ${LAYOUT}
  ${COMMON}
`

Box.defaultProps = {theme}

addDocumentedProps(Box, {
  system: [COMMON, LAYOUT],
  own: {
    theme: PropTypes.object.hidden
  }
})

export default Box
