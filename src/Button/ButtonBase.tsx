import {SystemStyleObject} from '@styled-system/css'
import styled from 'styled-components'
import {compose, fontSize, FontSizeProps, variant} from 'styled-system'
import {COMMON, LAYOUT, SystemCommonProps, SystemLayoutProps, get} from '../constants'

export const buttonSystemProps = compose(fontSize, COMMON, LAYOUT)

export type ButtonSystemProps = FontSizeProps & SystemCommonProps & SystemLayoutProps

const variants: Record<string, SystemStyleObject> = {
  small: {
    p: '4px 12px',
    fontSize: 0
  },
  medium: {
    p: '6px 16px',
    fontSize: 1
  },
  large: {
    p: '10px 20px',
    fontSize: 2
  }
}

export type ButtonBaseProps = {
  as?: 'button' | 'a' | 'summary' | 'input' | string | React.ElementType
  variant?: keyof typeof variants
}

const ButtonBase = styled.button.attrs<ButtonBaseProps>(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))<ButtonBaseProps>`
  position: relative;
  display: inline-block;
  font-family: inherit;
  font-weight: ${get('fontWeights.bold')};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: ${get('radii.2')};
  appearance: none;
  text-decoration: none;
  text-align: center;

  &:hover {
    /* needed to override link styles */
    text-decoration: none;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: default;
  }

  &:disabled svg {
    opacity: 0.6;
  }

  ${variant({variants})};
`

ButtonBase.defaultProps = {
  variant: 'medium'
}

export default ButtonBase
