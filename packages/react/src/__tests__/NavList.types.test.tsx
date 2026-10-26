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
