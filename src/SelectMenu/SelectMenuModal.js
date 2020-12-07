import React from 'react'
import PropTypes from 'prop-types'
import styled, {keyframes, css} from 'styled-components'
import {COMMON, get} from '../constants'
import {width} from 'styled-system'
import theme from '../theme'
import sx from '../sx'

const animateModal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
`

const modalStyles = css`
  position: relative;
  z-index: 99; // Needs to be higher than .details-overlay's z-index: 80.
  display: flex;
  ${(props) => (props.filter ? 'height: 80%' : '')};
  max-height: ${(props) => (props.filter ? 'none' : '66%')};
  margin: auto 0;
  ${(props) => (props.filter ? 'margin-top: 0' : '')};
  overflow: hidden; // Enables border radius on scrollable child elements
  pointer-events: auto;
  flex-direction: column;
  background-color: ${get('colors.white')};
  border-radius: ${get('radii.2')};
  box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
  animation: ${animateModal} 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards;

  @media (min-width: ${get('breakpoints.0')}) {
    height: auto;
    max-height: 350px;
    margin: ${get('space.1')} 0 ${get('space.3')} 0;
    font-size: ${get('fontSizes.0')};
    border: ${get('borderWidths.1')} solid ${get('colors.border.grayDark')};
    border-radius: ${get('radii.2')};
    box-shadow: 0 1px 5px ${get('colors.blackfade15')};
  }
`

const modalWrapperStyles = css`
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
    background-color: ${get('colors.blackfade50')};

    @media (min-width: ${get('breakpoints.0')}) {
      display: none;
    }
  }

  @media (min-width: ${get('breakpoints.0')}) {
    position: absolute;
    top: auto;
    right: ${(props) => (props.align === 'right' ? '0' : 'auto')};
    bottom: auto;
    left: auto;
    padding: 0;
  }
`

const Modal = styled.div`
  ${modalStyles}
  ${width}
`

const ModalWrapper = styled.div`
  ${modalWrapperStyles}
  ${COMMON}
  ${sx};
`
const SelectMenuModal = React.forwardRef(({children, theme, width, ...rest}, forwardedRef) => {
  return (
    <ModalWrapper theme={theme} {...rest} role="menu" ref={forwardedRef}>
      <Modal theme={theme} width={width}>
        {children}
      </Modal>
    </ModalWrapper>
  )
})

SelectMenuModal.defaultProps = {
  align: 'left',
  theme,
  width: '300px',
}

SelectMenuModal.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  theme: PropTypes.object,
  width: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
  ...COMMON.propTypes,
  ...sx.propTypes,
}

SelectMenuModal.displayName = 'SelectMenu.Modal'

export default SelectMenuModal
