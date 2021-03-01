import * as History from 'history'
import styled, {css} from 'styled-components'
import {BORDER, COMMON, get, SystemBorderProps, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

type StyledHeaderItemProps = {full?: boolean} & SystemCommonProps & SxProp
type StyledHeaderProps = SystemBorderProps & SystemCommonProps & SxProp
type StyledHeaderLinkProps = {to?: History.LocationDescriptor} & SystemCommonProps &
  SxProp &
  SystemTypographyProps &
  SystemBorderProps

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

const HeaderLink = styled.a.attrs<StyledHeaderLinkProps>(({to}) => {
  const isReactRouter = typeof to === 'string'
  if (isReactRouter) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {'aria-current': 'page'}
  } else {
    return {}
  }
})<StyledHeaderLinkProps>`
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

Header.defaultProps = {theme}

HeaderItem.defaultProps = {theme}

HeaderLink.defaultProps = {theme}

export type HeaderProps = ComponentProps<typeof Header>
export type HeaderLinkProps = ComponentProps<typeof HeaderLink>
export type HeaderItemProps = ComponentProps<typeof HeaderItem>
export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
