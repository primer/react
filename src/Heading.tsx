import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const Heading = styled.h2<SxProp>`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  margin: 0;
  ${sx};
`

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
