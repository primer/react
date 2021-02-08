import styled, {css} from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {BORDER, COMMON, get, SystemCommonProps, SystemTypographyProps, SystemBorderProps, TYPOGRAPHY} from './constants'
import {ComponentProps} from './utils/types'
import sx, {SxProp} from './sx'

type StyledHeaderItemProps = {full?: boolean} & SystemCommonProps & SxProp 
type StyledHeaderProps = SystemCommonProps & SxProp
type StyledHeaderLinkProps = SystemCommonProps & SxProp & SystemTypographyProps & SystemBorderProps & {to?: boolean}

const Header = styled.div<StyledHeaderProps>`
  z-index: 32;
  display: flex;
  padding: ${get('space.3')};
  font-size: ${get('fontSizes.1')};
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.whitefade70')};
  background-color: ${get('colors.bg.grayDark')};
  align-items: center;
  flex-wrap: nowrap;

  ${COMMON}
  ${BORDER}
  ${sx};
`
const HeaderItem = styled.div<StyledHeaderItemProps>`
  display: flex;
  margin-right: ${get('space.3')};
  align-self: stretch;
  align-items: center;
  flex-wrap: nowrap;

  ${({full}) =>
    full &&
    css`
      flex: auto;
    `};

  ${COMMON};
  ${BORDER};
  ${sx};
`

HeaderItem.displayName = 'Header.Item'

const HeaderLink = styled.a.attrs(({to}: StyledHeaderLinkProps) => {
  const isReactRouter = typeof to === 'string'
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

  &:hover,
  &:focus {
    color: ${get('colors.whitefade70')};
  }

  ${COMMON};
  ${BORDER};
  ${TYPOGRAPHY};
  ${sx};
`

HeaderLink.displayName = 'Header.Link'

Header.propTypes = {
  ...sx.propTypes,
  ...COMMON.propTypes,
  ...BORDER.propTypes
}

Header.defaultProps = {
  theme
}

HeaderItem.propTypes = {
  full: PropTypes.bool,
  ...COMMON.propTypes,
  ...BORDER.propTypes,
  ...sx.propTypes
}

HeaderItem.defaultProps = {
  theme
}

HeaderLink.propTypes = {
  href: PropTypes.string,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...BORDER.propTypes,
  ...TYPOGRAPHY.propTypes,
  ...sx.propTypes
}

HeaderLink.defaultProps = {
  theme
}

export type HeaderProps = ComponentProps<typeof Header>
export type HeaderLinkProps = ComponentProps<typeof HeaderLink>
export type HeaderItemProps = ComponentProps<typeof HeaderItem>
export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
