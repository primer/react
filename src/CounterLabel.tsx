import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledCounterLabelProps = {
  scheme?: 'gray' | 'gray-light'
} & SystemCommonProps &
  SxProp

const colorStyles = ({scheme, ...props}: StyledCounterLabelProps) => {
  return {
    color:
      scheme === 'gray-light'
        ? get('colors.gray.9')(props)
        : scheme === 'gray'
        ? get('colors.white')(props)
        : get('colors.gray.6')(props)
  }
}

const bgStyles = ({scheme, ...props}: StyledCounterLabelProps) => {
  return {
    backgroundColor:
      scheme === 'gray-light'
        ? get('colors.blackfade15')(props)
        : scheme === 'gray'
        ? get('colors.gray.5')(props)
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
