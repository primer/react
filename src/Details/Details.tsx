import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import {DetailsProps as GetDetailsProps} from '../hooks/useDetails'

const Details = styled.details<SxProp & GetDetailsProps>`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${sx};
`

Details.displayName = 'Details'

export type DetailsProps = ComponentProps<typeof Details>
export default Details
