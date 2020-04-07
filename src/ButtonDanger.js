import React from 'react'
import styled from 'styled-components'
import ButtonBase, {ButtonText} from './ButtonBase'
import {get} from './constants'
import {makeShadow} from './utils/shadow'
import {Platform} from './primitives'

const StyledText = styled(ButtonText)`
  color: ${get('buttons.danger.color.default')};
`

const ButtonDanger = styled(ButtonBase).attrs(({children, variant}) => ({
  ...(Platform.OS !== 'web' && {
    children: <StyledText variant={variant}>{children}</StyledText>,
    name: 'ButtonDanger',
  }),
}))`
  color: ${get('buttons.danger.color.default')};
  border: 1px solid ${get('buttons.danger.border.default')};
  background-color: ${get('buttons.danger.bg.default')};
  ${makeShadow(get('buttons.danger.shadow.default'))}

  &:hover {
    color: ${get('buttons.danger.color.hover')};
    background-color: ${get('buttons.danger.bg.hover')};
    border-color: ${get('buttons.danger.border.hover')};
    ${makeShadow(get('buttons.danger.shadow.hover'))}
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    ${makeShadow(get('buttons.danger.shadow.focus'))}
  }

  &:active {
    color: ${get('buttons.danger.color.active')};
    background-color: ${get('buttons.danger.bg.active')};
    ${makeShadow(get('buttons.danger.shadow.active'))}
    border-color: ${get('buttons.danger.border.active')};
  }

  &:disabled {
    color: ${get('buttons.danger.color.disabled')};
    background-color: ${get('buttons.danger.bg.disabled')};
    border: 1px solid ${get('buttons.danger.border.default')};
  }
`

export default ButtonDanger
