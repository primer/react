import PropTypes from 'prop-types'
import {color} from 'styled-system'
import styled from 'react-emotion'
import {withSystemProps} from './system-props'
import theme, {colors} from './theme'

const sizeMap = {
  small: `padding 0.125em ${theme.space[1]}px; font-size: ${theme.fontSizes[0]}px;`,
  medium: `padding: 3px ${theme.space[1]}px; font-size: ${theme.fontSizes[0]}px;`,
  large: `padding: 4px ${theme.space[2]}px; ${theme.fontSizes[1]}px;`,
  xl: `padding: ${theme.space[1]}px; ${theme.space[2]}px; ${theme.fontSizes[2]}px;`
}

const outlineStyles = `
  margin-top: -1px; // offsets the 1px border
  margin-bottom: -1px; // offsets the 1px border
  font-weight: 400;
  color: ${colors.gray[6]};
  background-color: transparent;
  border: ${theme.borders[1]} ${colors.blackfade15};
  box-shadow: none;
`

const styledLabel = styled('span')`
  display: inline-block;
  font-weight: 600;
  line-height: ${theme.lineHeights.condensedUltra};
  color: ${colors.white};
  border-radius: 2px;
  &:hover {
    text-decoration: none;
  }
  ${color} //eslint-disable-line
  ${props => (props.dropshadow ? 'box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12)' : '')};
  ${props => (props.outline ? outlineStyles : '')}; // must be last to override other values
  ${props => sizeMap[props.size]};
`

styledLabel.defaultProps = {
  theme,
  bg: 'gray.5',
  size: 'medium'
}

styledLabel.propTypes = {
  dropshadow: PropTypes.bool,
  outline: PropTypes.bool
}

export default withSystemProps(styledLabel, ['space'])
