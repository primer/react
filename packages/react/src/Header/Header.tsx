import type {Location, Pathname} from 'history'
import styled, {css} from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledHeaderItemProps = {full?: boolean} & SxProp
type StyledHeaderProps = SxProp
type StyledHeaderLinkProps = {to?: Location | Pathname} & SxProp

/**
 * Header is a navigation bar that has all of its items aligned vertically with consistent horizontal spacing.
 * @primerid header
 * @primerstatus alpha
 * @primera11yreviewed false
 */
const Header = styled.header<StyledHeaderProps>`
  z-index: 32;
  display: flex;
  padding: ${get('space.3')};
  font-size: ${get('fontSizes.1')};
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.header.text')};
  background-color: ${get('colors.header.bg')};
  align-items: center;
  flex-wrap: nowrap;
  overflow: auto;

  ${sx};
`

/**
 * A child of the header
 * @alias Header.Item
 * @primerparentid header
 */
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

  ${sx};
`

HeaderItem.displayName = 'Header.Item'

/**
 * A link child of the header
 * @alias Header.Link
 * @primerparentid header
 */
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
  color: ${get('colors.header.logo')};
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover,
  &:focus {
    color: ${get('colors.header.text')};
  }

  ${sx};
`

HeaderLink.displayName = 'Header.Link'

export type HeaderProps = ComponentProps<typeof Header>
export type HeaderLinkProps = ComponentProps<typeof HeaderLink>
export type HeaderItemProps = ComponentProps<typeof HeaderItem>
export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
