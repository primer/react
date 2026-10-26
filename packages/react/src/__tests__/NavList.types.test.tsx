import type {ComponentProps} from 'react'
import {NavList, type NavListItemProps} from '../NavList/NavList'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'

export function shouldRequireHrefForLinkedParents() {
  // @ts-expect-error linked parents rendered as anchors require href
  const implicitAnchor = <NavList.Item subNavToggleLabel="Toggle pages">Overview</NavList.Item>
  const explicitAnchor = (
    // @ts-expect-error explicit anchors also require href
    <NavList.Item as="a" subNavToggleLabel="Toggle pages">
      Overview
    </NavList.Item>
  )
  const undefinedHref = (
    // @ts-expect-error undefined is not a navigation destination
    <NavList.Item href={undefined} subNavToggleLabel="Toggle pages">
      Overview
    </NavList.Item>
  )
  // @ts-expect-error the exported props type also requires href for default anchors
  const props: NavListItemProps = {children: 'Overview', subNavToggleLabel: 'Toggle pages'}
  return {implicitAnchor, explicitAnchor, undefinedHref, props}
}

export function shouldAcceptLinkedParentsWithDestinations() {
  return (
    <>
      <NavList.Item href="/overview" subNavToggleLabel="Toggle pages">
        Overview
      </NavList.Item>
      <NavList.Item as="a" href="/overview" subNavToggleLabel="Toggle pages">
        Overview
      </NavList.Item>
      <NavList.Item as={ReactRouterLikeLink} to="/overview" subNavToggleLabel="Toggle pages">
        Overview
      </NavList.Item>
      <NavList.Item>Toggle-only parent</NavList.Item>
    </>
  )
}

export function shouldRequireCustomLinkNavigationProps() {
  return (
    // @ts-expect-error custom router links require their own destination prop
    <NavList.Item as={ReactRouterLikeLink} subNavToggleLabel="Toggle pages">
      Overview
    </NavList.Item>
  )
}

export function shouldForwardOptionalToggleLabel(subNavToggleLabel?: string) {
  return (
    <>
      <NavList.Item href="/overview" subNavToggleLabel={subNavToggleLabel}>
        Overview
      </NavList.Item>
      <NavList.Item as={ReactRouterLikeLink} to="/overview" subNavToggleLabel={subNavToggleLabel}>
        Overview
      </NavList.Item>
    </>
  )
}

type WrappedLinkProps = Omit<ComponentProps<typeof NavList.Item>, 'href' | 'as' | 'children'> & {
  to: string
  label: string
}

export function shouldForwardComponentProps({to, label, ...rest}: WrappedLinkProps) {
  return (
    <>
      <NavList.Item href={to} {...rest}>
        {label}
      </NavList.Item>
      <NavList.Item as={ReactRouterLikeLink} to={to} {...rest}>
        {label}
      </NavList.Item>
    </>
  )
}

type WrappedMenuItemProps = Omit<NavListItemProps, 'children'> & {href: string; label: string}

export function shouldForwardExportedProps({href, label, ...rest}: WrappedMenuItemProps) {
  return (
    <NavList.Item {...rest} as={ReactRouterLikeLink} to={href}>
      {label}
    </NavList.Item>
  )
}

export function shouldForwardPolymorphicComponentProps(
  props: ComponentProps<typeof NavList.Item>,
  {label, ...rest}: Omit<WrappedLinkProps, 'to'>,
) {
  return (
    <NavList.Item as={ReactRouterLikeLink} {...props} {...rest}>
      {label}
    </NavList.Item>
  )
}

export function shouldRejectOptionalToggleLabelWithoutDestination(subNavToggleLabel?: string) {
  return (
    // @ts-expect-error a possibly linked native parent still needs a destination
    <NavList.Item subNavToggleLabel={subNavToggleLabel}>Overview</NavList.Item>
  )
}
