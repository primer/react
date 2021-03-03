import styled, {css} from 'styled-components'
import {borderColor, BorderColorProps, variant} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const outlineStyles = css`
  margin-top: -1px; // offsets the 1px border
  margin-bottom: -1px; // offsets the 1px border
  color: ${get('colors.gray.6')};
  border: ${get('borderWidths.1')} solid ${get('colors.blackfade15')};
  box-shadow: none;
  ${borderColor};
  ${COMMON};
  background-color: transparent;
`

const sizeVariant = variant({
  variants: {
    small: {
      fontSize: 0,
      lineHeight: '16px',
      padding: '0px 8px'
    },
    medium: {
      fontSize: 0,
      lineHeight: '20px',
      padding: '0 8px'
    },
    large: {
      fontSize: 0,
      lineHeight: '24px',
      padding: '0 12px'
    },
    // corresponds to StateLabel fontSize/lineHeight/padding
    xl: {
      fontSize: 1,
      lineHeight: '16px',
      padding: '8px 12px'
    }
  }
})

const Label = styled.span<
  {
    variant?: 'small' | 'medium' | 'large' | 'xl'
    dropshadow?: boolean
    outline?: boolean
  } & BorderColorProps &
    SystemCommonProps &
    SxProp
>`
  display: inline-block;
  font-weight: ${get('fontWeights.semibold')};
  color: ${get('colors.white')};
  border-radius: ${get('radii.3')};

  &:hover {
    text-decoration: none;
  }

  ${sizeVariant}
  ${COMMON}
  ${props => (props.dropshadow ? 'box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12)' : '')}
  ${props => (props.outline ? outlineStyles : '')} // must be last to override other values
  ${sx}
`

Label.defaultProps = {
  theme,
  bg: 'gray.5',
  variant: 'medium'
}

export type LabelProps = ComponentProps<typeof Label>
export default Label
