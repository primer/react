import PropTypes from 'prop-types'
import styled from 'styled-components'
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'
import { system, style} from 'styled-system'

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
    scale: 'colors',
  }
})

const Link = styled.a`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    ${hoverColor};
  }
  ${props => (props.is === 'button' ? buttonStyles : '')};
  ${TYPOGRAPHY} ${COMMON};
`

Link.defaultProps = {
  theme,
  color: 'blue.5'
}

Link.propTypes = {
  as: PropTypes.oneOf(['a', 'button', 'input', 'summary']),
  href: PropTypes.string,
  theme: PropTypes.object,
  underline: PropTypes.bool,
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes
}

export default Link
