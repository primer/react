import classnames from 'classnames'
import * as History from 'history'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Box from './Box'
import {COMMON, FLEX, get, SystemCommonProps, SystemFlexProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const SELECTED_CLASS = 'selected'

const Wrapper = styled.li`
  display: inline-block;
  white-space: nowrap;
  list-style: none;
  &::after {
    padding-right: 0.5em;
    padding-left: 0.5em;
    color: ${get('colors.gray.2')};
    font-size: ${get('fontSizes.1')};
    content: '/';
  }
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    &::after {
      content: none;
    }
  }
`

const BreadcrumbBase = styled.nav<SystemFlexProps & SystemCommonProps & SxProp>`
  display: flex;
  justify-content: space-between;
  ${COMMON};
  ${FLEX};
  ${sx};
`

export type BreadcrumbProps = ComponentProps<typeof BreadcrumbBase>

function Breadcrumb({className, children, theme, ...rest}: React.PropsWithChildren<BreadcrumbProps>) {
  const classes = classnames(className, 'Breadcrumb')
  const wrappedChildren = React.Children.map(children, child => <Wrapper theme={theme}>{child}</Wrapper>)
  return (
    <BreadcrumbBase className={classes} aria-label="breadcrumb" theme={theme} {...rest}>
      <Box as="ol" my={0} pl={0}>
        {wrappedChildren}
      </Box>
    </BreadcrumbBase>
  )
}

type StyledBreadcrumbItemProps = {
  to?: History.LocationDescriptor
  selected?: boolean
} & SystemCommonProps &
  SxProp

const BreadcrumbItem = styled.a.attrs<StyledBreadcrumbItemProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(props.selected && SELECTED_CLASS, props.className),
  'aria-current': props.selected ? 'page' : null
}))<StyledBreadcrumbItemProps>`
  color: ${get('colors.blue.5')};
  display: inline-block;
  font-size: ${get('fontSizes.1')};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &.selected {
    color: ${get('colors.gray.7')};
    pointer-events: none;
  }
  ${COMMON}
  ${sx};
`

Breadcrumb.defaultProps = {
  theme
}

Breadcrumb.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes
}

Breadcrumb.displayName = 'Breadcrumb'

BreadcrumbItem.defaultProps = {
  theme
}

BreadcrumbItem.propTypes = {
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...sx.propTypes,
  ...COMMON.propTypes
}

BreadcrumbItem.displayName = 'Breadcrumb.Item'

export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbItem>
export default Object.assign(Breadcrumb, {Item: BreadcrumbItem})
