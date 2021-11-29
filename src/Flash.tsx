import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const variants = variant({
  variants: {
    default: {
      color: 'fg.default',
      backgroundColor: 'accent.subtle',
      borderColor: 'accent.muted',
      svg: {
        color: 'accent.fg'
      }
    },
    success: {
      color: 'fg.default',
      backgroundColor: 'success.subtle',
      borderColor: 'success.muted',
      svg: {
        color: 'success.fg'
      }
    },
    danger: {
      color: 'fg.default',
      backgroundColor: 'danger.subtle',
      borderColor: 'danger.muted',
      svg: {
        color: 'danger.fg'
      }
    },
    warning: {
      color: 'fg.default',
      backgroundColor: 'attention.subtle',
      borderColor: 'attention.muted',
      svg: {
        color: 'attention.fg'
      }
    }
  }
})

const Flash = styled.div<
  {
    variant?: 'default' | 'warning' | 'success' | 'danger'
    full?: boolean
  } & SxProp
>`
  position: relative;
  color: ${get('colors.fg.default')};
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

  ${variants};
  ${sx};
`

Flash.defaultProps = {
  variant: 'default'
}

export type FlashProps = ComponentProps<typeof Flash>
export default Flash
