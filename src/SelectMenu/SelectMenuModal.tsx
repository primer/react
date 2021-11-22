import React from 'react'
import styled, {css, keyframes} from 'styled-components'
import {width, WidthProps} from 'styled-system'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

type StyledModalProps = {
  filter?: boolean
} & WidthProps

type StyledModalWrapperProps = {
  align?: 'left' | 'right'
} & SxProp

const animateModal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
`

const modalStyles = css<StyledModalProps>`
  position: relative;
  z-index: 99; // Needs to be higher than .details-overlay's z-index: 80.
  display: flex;
  ${props => (props.filter ? 'height: 80%' : '')};
  max-height: ${props => (props.filter ? 'none' : '66%')};
  margin: auto 0;
  ${props => (props.filter ? 'margin-top: 0' : '')};
  overflow: hidden; // Enables border radius on scrollable child elements
  pointer-events: auto;
  flex-direction: column;
  background-color: ${get('colors.canvas.overlay')};
  border-radius: ${get('radii.2')};
  box-shadow: ${get('shadows.shadow.small')};
  animation: ${animateModal} 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards;

  @media (min-width: ${get('breakpoints.0')}) {
    height: auto;
    max-height: 350px;
    margin: ${get('space.1')} 0 ${get('space.3')} 0;
    font-size: ${get('fontSizes.0')};
    border: ${get('borderWidths.1')} solid ${get('colors.border.default')};
    border-radius: ${get('radii.2')};
    box-shadow: ${get('shadows.shadow.small')};
  }
`

const modalWrapperStyles = css<StyledModalWrapperProps>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  padding: ${get('space.3')};
  pointer-events: none;
  flex-direction: column;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    content: '';
    background-color: ${get('colors.primer.canvas.backdrop')};

    @media (min-width: ${get('breakpoints.0')}) {
      display: none;
    }
  }

  @media (min-width: ${get('breakpoints.0')}) {
    position: absolute;
    top: auto;
    right: ${props => (props.align === 'right' ? '0' : 'auto')};
    bottom: auto;
    left: auto;
    padding: 0;
  }
`

const Modal = styled.div<StyledModalProps>`
  ${modalStyles}
  ${width}
`

const ModalWrapper = styled.div<StyledModalWrapperProps>`
  ${modalWrapperStyles}
  ${sx};
`

type SelectMenuModalInternalProps = Pick<StyledModalProps, 'width'> & ComponentProps<typeof ModalWrapper>

const SelectMenuModal = React.forwardRef<HTMLDivElement, SelectMenuModalInternalProps>(
  ({children, theme, width: widthProp, ...rest}, forwardedRef) => {
    return (
      <ModalWrapper theme={theme} {...rest} role="menu" ref={forwardedRef}>
        <Modal theme={theme} width={widthProp}>
          {children}
        </Modal>
      </ModalWrapper>
    )
  }
)

SelectMenuModal.defaultProps = {
  align: 'left',
  width: '300px'
}

SelectMenuModal.displayName = 'SelectMenu.Modal'

export type SelectMenuModalProps = ComponentProps<typeof SelectMenuModal>
export default SelectMenuModal
