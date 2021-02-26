import classnames from 'classnames'
import * as History from 'history'
import React from 'react'
import styled from 'styled-components'
import {COMMON, FLEX, get, SystemBorderProps, SystemCommonProps, SystemFlexProps} from './constants'
import Flex, {FlexProps} from './Flex'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const ITEM_CLASS = 'SubNav-item'
const SELECTED_CLASS = 'selected'

const SubNavBase = styled.nav<SystemFlexProps & SystemCommonProps & SxProp>`
  display: flex;
  justify-content: space-between;

  .SubNav-body {
    display: flex;
    margin-bottom: -1px;

    > * {
      margin-left: ${get('space.2')};
    }

    > *:first-child {
      margin-left: 0;
    }
  }

  .SubNav-actions {
    align-self: center;
  }

  ${COMMON};
  ${FLEX};
  ${sx};
`

export type SubNavProps = {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & ComponentProps<typeof SubNavBase>

function SubNav({actions, className, children, label, ...rest}: SubNavProps) {
  const classes = classnames(className, 'SubNav')
  return (
    <SubNavBase className={classes} aria-label={label} {...rest}>
      <div className="SubNav-body">{children}</div>
      {actions && <div className="SubNav-actions">{actions}</div>}
    </SubNavBase>
  )
}

export type SubNavLinksProps = FlexProps

function SubNavLinks(props: SubNavLinksProps) {
  return <Flex {...props} />
}

type StyledSubNavLinkProps = {
  to?: History.LocationDescriptor
  selected?: boolean
} & SystemCommonProps &
  SxProp &
  SystemBorderProps

const SubNavLink = styled.a.attrs<StyledSubNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))<StyledSubNavLinkProps>`
  padding-left: ${get('space.3')};
  padding-right: ${get('space.3')};
  font-weight: ${get('fontWeights.semibold')};
  font-size: ${get('fontSizes.1')};
  line-height: 20px; //custom value for SubNav
  min-height: 34px; //custom value for SubNav
  color: ${get('colors.text.primary')};
  text-align: center;
  text-decoration: none;
  border-top: 1px solid ${get('colors.border.primary')};
  border-bottom: 1px solid ${get('colors.border.primary')};
  border-right: 1px solid ${get('colors.border.primary')};
  display: flex;
  align-items: center;

  &:first-of-type {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
    border-left: 1px solid ${get('colors.border.primary')};
  }

  &:last-of-type {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  &:hover,
  &:focus {
    text-decoration: none;
    background-color: ${get('colors.bg.canvasInset')};
    transition: 0.2s ease;

    .SubNav-octicon {
      color: ${get('colors.icon.secondary')};
    }
  }

  &.selected {
    color: ${get('colors.text.inverse')};
    background-color: ${get('colors.bg.infoInverse')};
    border: 0;
    .SubNav-octicon {
      color: ${get('colors.icon.secondary')};
    }
  }

  ${COMMON};
  ${sx};
`

SubNav.defaultProps = {theme}

SubNavLink.defaultProps = {theme}

SubNavLink.displayName = 'SubNav.Link'

SubNavLinks.displayName = 'SubNav.Links'

export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
export default Object.assign(SubNav, {Link: SubNavLink, Links: SubNavLinks})
