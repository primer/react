import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {
  COMMON,
  FLEX,
  get,
  SystemFlexProps,
  SystemCommonProps,
  SystemTypographyProps,
  SystemBorderProps
} from './constants'
import {ComponentProps} from './utils/types'
import theme from './theme'
import Flex, {FlexProps} from './Flex'
import sx, {SxProp} from './sx'
import * as History from 'history'

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

type StyledSubNavProps = {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & ComponentProps<typeof SubNavBase>

function SubNav({actions, className, children, label, theme, ...rest}: StyledSubNavProps) {
  const classes = classnames(className, 'SubNav')
  return (
    <SubNavBase className={classes} aria-label={label} {...rest}>
      <div className="SubNav-body">{children}</div>
      {actions && <div className="SubNav-actions">{actions}</div>}
    </SubNavBase>
  )
}

const SubNavLinks = (props: FlexProps) => <Flex {...props} />

type StyledSubNavLinkProps = {
  to?: History.LocationDescriptor
  selected?: boolean
} & SystemCommonProps &
  SxProp &
  SystemTypographyProps &
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
  color: ${get('colors.gray.9')};
  text-align: center;
  text-decoration: none;
  border-top: 1px solid ${get('colors.gray.2')};
  border-bottom: 1px solid ${get('colors.gray.2')};
  border-right: 1px solid ${get('colors.gray.2')};
  display: flex;
  align-items: center;

  &:first-of-type {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
    border-left: 1px solid ${get('colors.gray.2')};
  }

  &:last-of-type {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  &:hover,
  &:focus {
    text-decoration: none;
    background-color: ${get('colors.gray.1')};
    transition: 0.2s ease;

    .SubNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  &.selected {
    color: ${get('colors.white')};
    background-color: ${get('colors.blue.5')};
    border: 0;
    .SubNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  ${COMMON};
  ${sx};
`

SubNav.defaultProps = {
  theme
}

SubNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...sx.propTypes
}

SubNavLink.defaultProps = {
  theme
}

SubNavLink.propTypes = {
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes,
  ...sx.propTypes
}
SubNavLink.displayName = 'SubNav.Link'

SubNavLinks.propTypes = {
  ...Flex.propTypes
}
SubNavLinks.displayName = 'SubNav.Links'

export type SubNavProps = ComponentProps<typeof SubNavLink>
export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
export type SubNavLinksProps = ComponentProps<typeof SubNavLinks>

export default Object.assign(SubNav, {Link: SubNavLink, Links: SubNavLinks})
