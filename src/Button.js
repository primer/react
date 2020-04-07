import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import systemPropTypes from '@styled-system/prop-types'
import {COMMON, get} from './constants'
import {makeShadow} from './utils/shadow'
import {Platform} from './primitives'
import theme from './theme'
import ButtonBase, {ButtonText} from './ButtonBase'

const StyledText = styled(ButtonText)`
  color: ${get('buttons.default.color.default')};
`

const Button = styled(ButtonBase).attrs(({variant, children}) => ({
  ...(Platform.OS !== 'web' && {
    children: <StyledText variant={variant}>{children}</StyledText>,
    name: 'Button',
  }),
}))`
  color: ${get('buttons.default.color.default')};
  background-color: ${get('buttons.default.bg.default')};
  border: 1px solid ${get('buttons.default.border.default')};
  ${makeShadow(get('buttons.default.shadow.default'))}

  &:hover {
    background-color: ${get('buttons.default.bg.hover')};
    border-color: ${get('buttons.default.border.hover')};
    ${makeShadow(get('buttons.default.shadow.hover'))}
  }

  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    ${makeShadow(get('buttons.default.shadow.focus'))}
  }

  &:active {
    background-color: ${get('buttons.default.bg.active')};
    ${makeShadow(get('buttons.default.shadow.active'))}
    border-color: ${get('buttons.default.border.active')};
  }

  &:disabled {
    color: ${get('buttons.default.color.disabled')};
    background-color: ${get('buttons.default.bg.disabled')};
    border-color: ${get('buttons.default.border.disabled')};
  }
`

Button.defaultProps = {
  theme
}

Button.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...systemPropTypes.layout
}

export default Button
