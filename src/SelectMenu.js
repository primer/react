import React from 'react'
import styled, {keyframes} from 'styled-components'
import {COMMON, TYPOGRAPHY, get} from './constants'
import Button from './Button'
import TextInput from './TextInput'
import theme from './theme'
import StyledOcticon from './StyledOcticon'
import {Octoface} from '@primer/octicons-react'
import {modalStyles, wrapperStyles, listStyles, listItemStyles, tabStyles, tabWrapperStyles} from './SelectMenuStyles'

const SelectMenu = styled.details`
  ${wrapperStyles}
  ${COMMON}
`

const ModalWrapper = styled.div`
  ${modalStyles}
`

SelectMenu.Summary = ({children, ...rest}) => <Button as='summary' {...rest}>{children}</Button>

SelectMenu.Modal = ({children, filter, theme}) => {
  return (
    <ModalWrapper theme={theme}>
      <details-menu class='modal' role='menu'>
        {children}
      </details-menu>
    </ModalWrapper>
  )
}

SelectMenu.Modal.defaultProps = {
  theme
}

SelectMenu.Header = styled.header`
  display: flex;
  flex: none; // fixes header from getting squeezed in Safari iOS
  padding: ${get('space.3')}px;

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')}px;
    padding-bottom: ${get('space.2')}px;
  }
`

SelectMenu.Header.defaultProps = {
  theme
}

SelectMenu.Title = styled.h3`
  flex: auto;
  font-size: ${get('fontSizes.1')}px;
  font-weight: ${get('fontWeights.bold')};
  margin: 0;
  ${COMMON}
  ${TYPOGRAPHY}

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: inherit;
  }
`

SelectMenu.Title.defaultProps = {
  theme
}

const StyledForm = styled.form`
  padding: ${get('space.3')}px;
  margin: 0;
  border-top: ${get('borders.1')} ${get('colors.borders.gray')}; 

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')}px;
  }
`

SelectMenu.Filter = (props) => {
  return (
    <StyledForm>
      <TextInput width="100%" block type="text" {...props}/> 
    </StyledForm>
  )
}

SelectMenu.Item = styled.button.attrs(props => ({
  role: 'menuitem',
  className: 'SelectMenu--list-item'
}))`
  ${listItemStyles}
`
SelectMenu.List = styled.div`
  ${listStyles}
`
SelectMenu.List.defaultProps = {
  theme
}

SelectMenu.Tabs = styled.nav`
  ${tabWrapperStyles}
`

SelectMenu.Tab = styled.button.attrs(props => ({
  className: 'SelectMenuTab',
  "aria-selected": props.selected
}))`
  ${tabStyles}
`

SelectMenu.Footer = styled.footer`
  padding: ${get('space.2')}px ${get('space.3')}px;
  font-size: ${get('fontSizes.0')}px;
  color: ${get('colors.gray.5')};
  text-align: center;
  border-top: ${get('borders.1')} ${get('colors.borders.gray')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.1')}px ${get('space.2')}px;
  }
`

SelectMenu.Divider = styled.div`
  padding: ${get('space.1')}px ${get('space.3')}px;
  margin: 0;
  font-size: ${get('fontSizes.0')}px;
  font-weight: ${get('fontWeights.bold')};
  color: ${get('colors.gray.5')};
  background-color: ${get('colors.gray.1')};
  border-top: ${get('borders.1')} ${get('colors.borders.gray')};
  border-bottom: ${get('borders.1')} ${get('colors.borders.gray')};

  &:first-child {
    border-top: 0;
  }

  &:last-child {
    border-bottom: 0;
  }
`

const pulseKeyframes = keyframes`
  0% {
    opacity: 0.3;
  }

  10% {
    opacity: 1;
  }

  100% {
    opacity: 0.3;
  }
`

const Animation = styled.div`
  padding: ${get('space.4')}px ${get('space.3')}px;
  text-align: center;
  background-color: ${get('colors.white')};
  animation-name: ${pulseKeyframes};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`

SelectMenu.Loading = () => {
  return (
    <Animation>
      <StyledOcticon size={32} icon={Octoface}/>
    </Animation>
  )
}
export default SelectMenu