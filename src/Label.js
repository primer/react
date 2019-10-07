import PropTypes from 'prop-types'
import styled from 'styled-components'
import {variant} from 'styled-system'
import theme, {colors} from './theme'
import {COMMON} from './constants'

const outlineStyles = `
  margin-top: -1px; // offsets the 1px border
  margin-bottom: -1px; // offsets the 1px border
  font-weight: 400;
  color: ${colors.gray[6]};
  background-color: transparent;
  border: ${theme.borders[1]} ${colors.blackfade15};
  box-shadow: none;
`

const sizeVariant = variant({
  prop: 'size',
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
  line-height: ${theme.lineHeights.condensedUltra};
  color: ${colors.white};
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
  size: 'medium'
}

Label.propTypes = {
  dropshadow: PropTypes.bool,
  outline: PropTypes.bool,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Label
