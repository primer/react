import React from 'react'
import styled from 'styled-components'
import {COMMON, TYPOGRAPHY, get} from './constants'
import Button from './Button'
import Box from './Box'
import TextInput from './TextInput'
import theme from './theme'
import StyledOcticon from './StyledOcticon'
import {Octoface, Check} from '@primer/octicons-react'
import Animations from './Animations'
import {modalStyles, wrapperStyles, dividerStyles, footerStyles, listStyles, listItemStyles, tabStyles, tabWrapperStyles} from './SelectMenuStyles'

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

const StyledItem = styled.button.attrs(props => ({
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

SelectMenu.Item = ({children,...rest}) => {
  return (
    <StyledItem {...rest}>
      <StyledOcticon className='SelectMenu-selected' icon={Check}/>
      {children}
    </StyledItem>
  )
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
  ${footerStyles}
`

SelectMenu.Divider = styled.div`
  ${dividerStyles}
`

SelectMenu.Loading = () => {
  return (
    <Box bg='white' py={4} px={3} css='text-align: center'>
      <Animations.Pulse>
        <StyledOcticon size={32} icon={Octoface}/>
      </Animations.Pulse>
    </Box>
  )
}
export default SelectMenu