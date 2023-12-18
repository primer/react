import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {AlertIcon, CheckIcon, InfoIcon, StopIcon} from '@primer/octicons-react'

const variants = variant({
  variants: {
    default: {
      color: 'fg.default',
      backgroundColor: 'accent.subtle',
      borderColor: 'accent.muted',
      '[data-component="leadingVisual"]': {
        color: 'accent.fg',
      },
    },
    success: {
      color: 'fg.default',
      backgroundColor: 'success.subtle',
      borderColor: 'success.muted',
      '[data-component="leadingVisual"]': {
        color: 'success.fg',
      },
    },
    danger: {
      color: 'fg.default',
      backgroundColor: 'danger.subtle',
      borderColor: 'danger.muted',
      '[data-component="leadingVisual"]': {
        color: 'danger.fg',
      },
    },
    warning: {
      color: 'fg.default',
      backgroundColor: 'attention.subtle',
      borderColor: 'attention.muted',
      '[data-component="leadingVisual"]': {
        color: 'attention.fg',
      },
    },
  },
})

type StyledFlashProps = {
  variant?: 'default' | 'warning' | 'success' | 'danger'
  full?: boolean
  renderDefaultVisual?: boolean
} & SxProp

const StyledFlash = styled.div<StyledFlashProps>`
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

  [data-component='leadingVisual'] {
    margin-right: ${get('space.2')};
  }

  ${variants};
  ${sx};
`

export type FlashProps = ComponentProps<typeof StyledFlash>

const Flash = React.forwardRef(function Flash({as, children, variant = 'default', renderDefaultVisual, ...rest}, ref) {
  const defaultLeadingVisuals = {
    default: InfoIcon,
    danger: StopIcon,
    success: CheckIcon,
    warning: AlertIcon,
  }

  const DefaultVisual = defaultLeadingVisuals[variant]

  return (
    <StyledFlash ref={ref} as={as} variant={variant} {...rest}>
      {renderDefaultVisual && (
        <span data-component="leadingVisual">
          <DefaultVisual />
        </span>
      )}
      {children}
    </StyledFlash>
  )
}) as PolymorphicForwardRefComponent<'div', StyledFlashProps>

if (__DEV__) {
  Flash.displayName = 'Flash'
}

export default Flash
