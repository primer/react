import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {variant, borderColor} from 'styled-system'
import theme from './theme'
import {COMMON, get} from './constants'

const outlineStyles = css`
  margin-top: -1px; // offsets the 1px border
  margin-bottom: -1px; // offsets the 1px border
  color: ${get('colors.gray.6')};
  border: ${get('borders.1')} ${get('colors.blackfade15')};
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

const Label = styled('span')`
  display: inline-block;
  font-weight: 600;
  color: ${get('colors.white')};
  border-radius: ${get('radii.3')};
  &:hover {
    text-decoration: none;
  }
  ${sizeVariant}
  ${COMMON} ${props => (props.dropshadow ? 'box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12)' : '')};
  ${props => (props.outline ? outlineStyles : '')}; // must be last to override other values
`

Label.defaultProps = {
  theme,
  bg: 'gray.5',
  variant: 'medium'
}

Label.propTypes = {
  dropshadow: PropTypes.bool,
  outline: PropTypes.bool,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  ...COMMON.propTypes
}

export default Label
