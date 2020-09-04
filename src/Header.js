import styled, {css} from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {get, COMMON, TYPOGRAPHY, BORDER} from './constants'
import Box from './Box'

const Header = styled(Box)`
  z-index: 32; /* FIXME: Check z-index*/
  display: flex;
  padding: ${get('space.3')};
  font-size: ${get('fontSizes.1')};
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.whitefade70')};
  background-color: ${get('colors.bg.grayDark')};
  align-items: center;
  flex-wrap: nowrap;

  ${COMMON};
  ${BORDER};
`

Header.Item = styled(Box)`
  display: flex;
  margin-right: ${get('space.3')};
  align-self: stretch;
  align-items: center;
  flex-wrap: nowrap;

  ${props =>
    props.full &&
    css`
      flex: auto;
    `};

  ${COMMON};
  ${BORDER};
`

Header.Link = styled.a.attrs(props => {
  const isReactRouter = typeof props.to === 'string'
  if (isReactRouter) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {'aria-current': 'page'}
  } else {
    return {}
  }
})`
  font-weight: ${get('fontWeights.bold')};
  color: ${get('colors.text.white')};
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;

  /* TODO: Add props.selected styles */

  &:hover,
  &:focus {
    color: ${get('colors.whitefade70')};
  }

  ${COMMON};
  ${BORDER};
  ${TYPOGRAPHY}
`

Header.defaultProps = {
  theme
}

Header.Item.propTypes = {
  full: PropTypes.bool
}

Header.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}

export default Header
