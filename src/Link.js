import {addDocumentedProps, PropTypes} from './PropsDocs'
import styled from 'styled-components'
import {system} from 'styled-system'
import {COMMON, TYPOGRAPHY, get} from './constants'
import theme from './theme'
import elementType from './utils/elementType'

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
`

Link.defaultProps = {
  muted: false,
  theme,
  underline: false
}

addDocumentedProps(Link, {
  system: [COMMON, TYPOGRAPHY],
  own: {
    as: elementType.desc("Can be 'a', 'button', 'input', or 'summary'"),
    href: PropTypes.string.desc('URL to be used for the Link'),
    muted: PropTypes.bool.desc('Uses light gray for Link color, and blue on hover'),
    theme: PropTypes.object.hidden,
    underline: PropTypes.bool.desc('Adds underline to the Link')
  }
})

export default Link
