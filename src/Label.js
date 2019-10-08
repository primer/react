import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import theme, {colors} from './theme'
import {COMMON, get} from './constants'

const outlineStyles = css`
  margin-top: -1px; // offsets the 1px border
  margin-bottom: -1px; // offsets the 1px border
  font-weight: 400;
  color: ${get('colors.gray.6')};
  background-color: transparent;
  border: ${get('borders.1')} ${get('colors.blackfade15')};
  box-shadow: none;
`

const sizeVariant = variant({
  variants: {
    small: {
      fontSize: 0,
      px: '0.125em',
      py: 1
    },
    medium: {
      fontSize: 0,
      px: '3px',
      py: 1
    },
    large: {
      fontSize: 1,
      px: 1,
      py: 2
    },
    xl: {
      fontSize: 2,
      px: 1,
      py: 2
    }
  }
})

const Label = styled('span')`
  display: inline-block;
  font-weight: 600;
  line-height: ${get('lineHeights.condensedUltra')};
  color: ${get('colors.white')};
  border-radius: 2px;
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
