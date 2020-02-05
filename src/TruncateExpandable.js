import styled from 'styled-components'
import Truncate from './Truncate'

const TruncateExpandable = styled(Truncate)`
  &:hover {
    max-width: 10000px !important;
  }
`

export default TruncateExpandable
