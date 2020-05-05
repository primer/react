import PropTypes from 'prop-types'
import styled from 'styled-components'
import {system} from 'styled-system'
import {COMMON, TYPOGRAPHY, get} from './constants'
import theme from './theme'
import elementType from './utils/elementType'
import sx from './sx'

const buttonStyles = {
  display: 'inline-block',
  padding: '0',
  fontSize: 'inherit',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundColor: 'transparent',
  border: '0',
  appearance: 'none'
}

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
})

const Link = styled.a.attrs(props => ({
  color: props.color ? props.color : props.muted ? 'gray.6' : 'blue.5'
}))`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: ${props => (props.muted ? 'none' : 'underline')};
    ${props => (props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.blue.5')(theme)}` : '')};
  }
  ${props => (props.as === 'button' ? buttonStyles : '')};
  ${TYPOGRAPHY} ${COMMON};
  ${sx};
`

Link.defaultProps = {
  theme
}

Link.propTypes = {
  as: elementType,
  href: PropTypes.string,
  muted: PropTypes.bool,
  theme: PropTypes.object,
  underline: PropTypes.bool,
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default Link
