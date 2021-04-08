import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledCounterLabelProps = {
  scheme?: 'primary' | 'secondary'
} & SystemCommonProps &
  SxProp

const colorStyles = ({scheme, ...props}: StyledCounterLabelProps) => {
  return {
    color:
      scheme === 'secondary'
        ? get('colors.counter.text')(props)
        : scheme === 'primary'
        ? get('colors.counter.primary.text')(props)
        : get('colors.counter.text')(props)
  }
}

const bgStyles = ({scheme, ...props}: StyledCounterLabelProps) => {
  return {
    backgroundColor:
      scheme === 'secondary'
        ? get('colors.counter.bg')(props)
        : scheme === 'primary'
        ? get('colors.counter.primary.bg')(props)
        : get('colors.counter.bg')(props)
  }
}

const CounterLabel = styled.span<StyledCounterLabelProps>`
  display: inline-block;
  padding: 2px 5px;
  font-size: ${get('fontSizes.0')};
  font-weight: ${get('fontWeights.bold')};
  line-height: ${get('lineHeights.condensedUltra')};
  border-radius: 20px;
  ${colorStyles};
  ${bgStyles};
  ${COMMON};

  &:empty {
    display: none;
  }

  ${sx};
`

export type CounterLabelProps = ComponentProps<typeof CounterLabel>
export default CounterLabel
