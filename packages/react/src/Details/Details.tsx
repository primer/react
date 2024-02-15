import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const Details = styled.details<SxProp>`
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
