import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'

const variants = variant({
  scale: 'flash'
})

const Flash = styled.div<
  {
    variant?: 'default' | 'warning' | 'success' | 'danger'
    full?: boolean
  } & SystemCommonProps &
    SxProp
>`
  position: relative;
  color: ${get('colors.text.grayDark')};
  padding: ${get('space.3')};
  border-style: solid;
  border-width: ${props => (props.full ? '1px 0px' : '1px')};
  border-radius: ${props => (props.full ? '0' : get('radii.2'))};
  margin-top: ${props => (props.full ? '-1px' : '0')};

  p:last-child {
    margin-bottom: 0;
  }

  svg {
    color: ${props => get(`flashIcon.${props.variant}`)(props.theme)};
    margin-right: ${get('space.2')};
  }

  ${COMMON};
  ${variants};
  ${sx};
`

Flash.defaultProps = {
  variant: 'default'
}

export default Flash
