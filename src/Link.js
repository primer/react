import PropTypes from 'prop-types'
import styled from 'styled-components'
import {TYPOGRAPHY, COMMON, Base} from './constants'
import theme from './theme'
import {style} from 'styled-system'

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

const hoverColor = style({
  prop: 'hoverColor',
  cssProperty: 'color',
  key: 'colors'
})

const Link = styled(Base)`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    ${hoverColor};
  }
  ${props => (props.is === 'button' ? buttonStyles : '')};
  ${TYPOGRAPHY} ${COMMON};
`

Link.defaultProps = {
  is: 'a',
  theme,
  color: 'blue.5'
}

Link.propTypes = {
  href: PropTypes.string,
  is: PropTypes.oneOf(['a', 'button', 'input', 'summary']),
  theme: PropTypes.object,
  underline: PropTypes.bool,
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes
}

export default Link
