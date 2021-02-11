import styled from 'styled-components'
import theme from './theme'
import {COMMON, SystemCommonProps} from './constants'
import {ComponentProps} from './utils/types'
import sx, {SxProp} from './sx'

type StyledDetailsProps = {
  open?: boolean
} & SystemCommonProps &
  SxProp

const Details = styled.details<StyledDetailsProps>`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${COMMON}
  ${sx};
`

Details.displayName = 'Details'

Details.defaultProps = {
  theme
}

Details.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes
}

export type DetailsProps = ComponentProps<typeof Details>
export default Details
