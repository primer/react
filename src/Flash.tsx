import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const variants = variant({
  variants: {
    default: {
      color: 'alert.info.text',
      backgroundColor: 'alert.info.bg',
      borderColor: 'alert.info.border',
      svg: {
        color: 'alert.info.icon'
      }
    },
    success: {
      color: 'alert.success.text',
      backgroundColor: 'alert.success.bg',
      borderColor: 'alert.success.border',
      svg: {
        color: 'alert.success.icon'
      }
    },
    danger: {
      color: 'alert.error.text',
      backgroundColor: 'alert.error.bg',
      borderColor: 'alert.error.border',
      svg: {
        color: 'alert.error.icon'
      }
    },
    warning: {
      color: 'alert.warn.text',
      backgroundColor: 'alert.warn.bg',
      borderColor: 'alert.warn.border',
      svg: {
        color: 'alert.warn.icon'
      }
    }
  }
})

const Flash = styled.div<
  {
    variant?: 'default' | 'warning' | 'success' | 'danger'
    full?: boolean
  } & SystemCommonProps &
    SxProp
>`
  position: relative;
  color: ${get('colors.text.primary')};
  padding: ${get('space.3')};
  border-style: solid;
  border-width: ${props => (props.full ? '1px 0px' : '1px')};
  border-radius: ${props => (props.full ? '0' : get('radii.2'))};
  margin-top: ${props => (props.full ? '-1px' : '0')};

  p:last-child {
    margin-bottom: 0;
  }

  svg {
    margin-right: ${get('space.2')};
  }

  ${COMMON};
  ${variants};
  ${sx};
`

Flash.defaultProps = {
  variant: 'default'
}

export type FlashProps = ComponentProps<typeof Flash>
export default Flash
