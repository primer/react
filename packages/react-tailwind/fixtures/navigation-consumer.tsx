import React from 'react'
import {Breadcrumbs, Link, NavList, PageHeader, UnderlineNav} from '@primer/react-tailwind'
import {Breadcrumbs as SubpathBreadcrumbs, type BreadcrumbsItemProps} from '@primer/react-tailwind/Breadcrumbs'
import {Link as SubpathLink, type LinkProps} from '@primer/react-tailwind/Link'
import {NavList as SubpathNavList, type NavListItemProps} from '@primer/react-tailwind/NavList'
import {PageHeader as SubpathPageHeader, type ParentLinkProps} from '@primer/react-tailwind/PageHeader'
import {UnderlineNav as SubpathUnderlineNav, type UnderlineNavItemProps} from '@primer/react-tailwind/UnderlineNav'

type RouterLinkProps = {
  to: string
  preload?: 'intent' | 'none'
  reloadDocument?: boolean
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>

const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function RouterLink(
  {children, to, preload, reloadDocument, ...props},
  ref,
) {
  return (
    <a {...props} href={to} ref={ref} data-preload={preload} data-reload={reloadDocument}>
      {children}
    </a>
  )
})

const ObjectRouterLink = React.forwardRef<
  HTMLAnchorElement,
  {to: {pathname: string}; replace: boolean} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>
>(function ObjectRouterLink({children, to, replace, ...props}, ref) {
  return (
    <a {...props} href={to.pathname} ref={ref} data-replace={replace}>
      {children}
    </a>
  )
})

const anchorRef = React.createRef<HTMLAnchorElement>()
const buttonRef = React.createRef<HTMLButtonElement>()
const elementRef = React.createRef<HTMLElement>()

const routerLinkProps: LinkProps<typeof RouterLink> = {
  as: RouterLink,
  to: '/issues',
  preload: 'intent',
  ref: anchorRef,
  onClick: event => {
    const anchor: HTMLAnchorElement = event.currentTarget
    void anchor.href
  },
}
const routerBreadcrumbProps: BreadcrumbsItemProps<typeof RouterLink> = {
  as: RouterLink,
  to: '/issues',
  reloadDocument: true,
  ref: anchorRef,
}
const routerNavProps: UnderlineNavItemProps<typeof RouterLink> = {
  as: RouterLink,
  to: '/issues',
  preload: 'intent',
  ref: anchorRef,
  onClick: event => {
    const anchor: HTMLAnchorElement = event.currentTarget
    void anchor.href
  },
}
const routerListProps: NavListItemProps<typeof RouterLink> = {
  as: RouterLink,
  to: '/settings',
  reloadDocument: true,
  ref: anchorRef,
}
const routerParentProps: ParentLinkProps<typeof RouterLink> = {
  as: RouterLink,
  to: '/projects',
  preload: 'intent',
  ref: anchorRef,
}

const defaultLinkProps: React.ComponentProps<typeof Link> = {href: '/issues', ref: elementRef}
const defaultBreadcrumbProps: React.ComponentProps<typeof Breadcrumbs.Item> = {href: '/issues', ref: elementRef}
const defaultNavProps: React.ComponentProps<typeof UnderlineNav.Item> = {href: '/issues', ref: elementRef}
const defaultListProps: React.ComponentProps<typeof NavList.Item> = {href: '/settings', ref: anchorRef}
const defaultParentProps: React.ComponentProps<typeof PageHeader.ParentLink> = {href: '/projects', ref: elementRef}
const inferredLegacyLink: React.ComponentProps<typeof Link> & {to: string} = {as: RouterLink, to: '/issues'}
const inferredLegacyBreadcrumb: React.ComponentProps<typeof Breadcrumbs.Item> & {to: string} = {
  as: RouterLink,
  to: '/issues',
}
const inferredLegacyUnderline: React.ComponentProps<typeof UnderlineNav.Item> & {to: string} = {
  as: RouterLink,
  to: '/issues',
}
const inferredLegacyList: React.ComponentProps<typeof NavList.Item> = {as: RouterLink, to: '/settings'}
const inferredLegacyParent: React.ComponentProps<typeof PageHeader.ParentLink> & {to: string} = {
  as: RouterLink,
  to: '/projects',
}

const legacyLinkProps: LinkProps & {to: string} = {as: RouterLink, to: '/issues'}
const legacyBreadcrumbProps: BreadcrumbsItemProps & {to: string} = {as: RouterLink, to: '/issues'}
const legacyUnderlineProps: UnderlineNavItemProps & {to: string} = {as: RouterLink, to: '/issues'}
const legacyListProps: NavListItemProps = {as: RouterLink, to: '/settings'}
const legacyParentProps: ParentLinkProps & {to: string} = {as: RouterLink, to: '/projects'}

function LegacyWrappers(props: {
  link: LinkProps & {to: string}
  breadcrumb: BreadcrumbsItemProps & {to: string}
  underline: UnderlineNavItemProps & {to: string}
  item: NavListItemProps
  parent: ParentLinkProps & {to: string}
}) {
  return (
    <>
      <Link {...props.link}>Issues</Link>
      <Breadcrumbs>
        <Breadcrumbs.Item {...props.breadcrumb}>Issues</Breadcrumbs.Item>
      </Breadcrumbs>
      <UnderlineNav>
        <UnderlineNav.Item {...props.underline}>Issues</UnderlineNav.Item>
      </UnderlineNav>
      <NavList aria-label="Settings">
        <NavList.Item {...props.item}>Settings</NavList.Item>
        <NavList.GroupExpand
          items={[{as: RouterLink, to: '/more', text: 'More'}]}
          renderItem={({
            text,
            leadingVisual: _leading,
            trailingVisual: _trailing,
            trailingAction: _action,
            ...item
          }) => <NavList.Item {...item}>{text}</NavList.Item>}
        />
      </NavList>
      <PageHeader>
        <PageHeader.ParentLink {...props.parent}>Projects</PageHeader.ParentLink>
      </PageHeader>
    </>
  )
}

export function NavigationConsumer() {
  return (
    <>
      <LegacyWrappers
        link={legacyLinkProps}
        breadcrumb={legacyBreadcrumbProps}
        underline={legacyUnderlineProps}
        item={legacyListProps}
        parent={legacyParentProps}
      />
      <LegacyWrappers
        link={inferredLegacyLink}
        breadcrumb={inferredLegacyBreadcrumb}
        underline={inferredLegacyUnderline}
        item={inferredLegacyList}
        parent={inferredLegacyParent}
      />
      <Link {...defaultLinkProps}>Issues</Link>
      <Link
        as={RouterLink}
        to="/direct"
        onClick={event => {
          const anchor: HTMLAnchorElement = event.currentTarget
          void anchor.href
        }}
      >
        Direct router
      </Link>
      <SubpathLink {...routerLinkProps}>Issues</SubpathLink>
      <Link as="button" type="button" ref={buttonRef} onClick={event => event.currentTarget.disabled}>
        Button
      </Link>
      <Breadcrumbs>
        <Breadcrumbs.Item {...defaultBreadcrumbProps}>Issues</Breadcrumbs.Item>
        <SubpathBreadcrumbs.Item {...routerBreadcrumbProps} selected>
          Current issue
        </SubpathBreadcrumbs.Item>
        <Breadcrumbs.Item as="button" type="button" ref={buttonRef}>
          Select
        </Breadcrumbs.Item>
      </Breadcrumbs>
      <UnderlineNav>
        <UnderlineNav.Item {...defaultNavProps}>Issues</UnderlineNav.Item>
        <UnderlineNav.Item
          as={RouterLink}
          to="/direct"
          onClick={event => {
            const anchor: HTMLAnchorElement = event.currentTarget
            void anchor.href
          }}
        >
          Direct router
        </UnderlineNav.Item>
        <SubpathUnderlineNav.Item {...routerNavProps} counter={3}>
          Pull requests
        </SubpathUnderlineNav.Item>
        <UnderlineNav.Item as="button" type="button" ref={buttonRef} onClick={event => event.currentTarget.disabled}>
          Select
        </UnderlineNav.Item>
      </UnderlineNav>
      <NavList aria-label="Settings">
        <NavList.Item {...defaultListProps}>General</NavList.Item>
        <SubpathNavList.Item {...routerListProps}>Security</SubpathNavList.Item>
        <NavList.Item as={ObjectRouterLink} to={{pathname: '/rules'}} replace ref={anchorRef}>
          Rules
        </NavList.Item>
        <NavList.Item as="button" type="button" ref={buttonRef} onClick={event => event.currentTarget.disabled}>
          Preferences
        </NavList.Item>
      </NavList>
      <PageHeader>
        <PageHeader.ParentLink {...defaultParentProps}>Projects</PageHeader.ParentLink>
        <SubpathPageHeader.ParentLink {...routerParentProps} hidden={{narrow: false}}>
          Issues
        </SubpathPageHeader.ParentLink>
        <PageHeader.ParentLink
          as="button"
          type="button"
          ref={buttonRef}
          onClick={event => event.currentTarget.disabled}
        >
          Back
        </PageHeader.ParentLink>
      </PageHeader>
    </>
  )
}

function acceptsElement(_element: React.ReactElement) {}

acceptsElement(
  // @ts-expect-error Router destinations remain required.
  <Link as={RouterLink}>Issues</Link>,
)
acceptsElement(
  // @ts-expect-error Router-specific props are not valid on the default anchor.
  <Link to="/issues">Issues</Link>,
)
acceptsElement(
  // @ts-expect-error A router link does not accept a button ref.
  <SubpathLink as={RouterLink} to="/issues" ref={buttonRef}>
    Issues
  </SubpathLink>,
)
acceptsElement(
  // @ts-expect-error An explicit non-default element requires the corresponding as prop.
  <Link<'button'> type="button">Button</Link>,
)
acceptsElement(
  // @ts-expect-error A button does not accept an anchor destination.
  <Link as="button" href="/issues">
    Button
  </Link>,
)
acceptsElement(
  // @ts-expect-error Breadcrumb router destinations remain required.
  <Breadcrumbs.Item as={RouterLink}>Issues</Breadcrumbs.Item>,
)
acceptsElement(
  // @ts-expect-error Invalid router-specific prop values are rejected.
  <SubpathBreadcrumbs.Item as={RouterLink} to="/issues" preload="invalid">
    Issues
  </SubpathBreadcrumbs.Item>,
)
acceptsElement(
  // @ts-expect-error A router breadcrumb does not accept a button ref.
  <Breadcrumbs.Item as={RouterLink} to="/issues" ref={buttonRef}>
    Issues
  </Breadcrumbs.Item>,
)
acceptsElement(
  // @ts-expect-error Navigation router destinations remain required.
  <UnderlineNav.Item as={RouterLink}>Issues</UnderlineNav.Item>,
)
acceptsElement(
  // @ts-expect-error Custom router props are not allowed on the default anchor.
  <UnderlineNav.Item preload="intent">Issues</UnderlineNav.Item>,
)
acceptsElement(
  // @ts-expect-error A router navigation item does not accept a button ref.
  <SubpathUnderlineNav.Item as={RouterLink} to="/issues" ref={buttonRef}>
    Issues
  </SubpathUnderlineNav.Item>,
)
acceptsElement(
  // @ts-expect-error NavList router destinations remain required.
  <NavList.Item as={RouterLink}>Settings</NavList.Item>,
)
acceptsElement(
  // @ts-expect-error Router-specific options are not valid on the default item.
  <NavList.Item preload="intent">Settings</NavList.Item>,
)
acceptsElement(
  // @ts-expect-error An object destination must keep the router's required shape.
  <NavList.Item as={ObjectRouterLink} to="/rules" replace>
    Rules
  </NavList.Item>,
)
acceptsElement(
  // @ts-expect-error A native button ref cannot point at an anchor.
  <NavList.Item as="button" ref={anchorRef}>
    Preferences
  </NavList.Item>,
)
acceptsElement(
  // @ts-expect-error ParentLink router destinations remain required.
  <PageHeader.ParentLink as={RouterLink}>Projects</PageHeader.ParentLink>,
)
acceptsElement(
  // @ts-expect-error ParentLink rejects invalid router-specific props.
  <PageHeader.ParentLink as={RouterLink} to="/projects" preload="invalid">
    Projects
  </PageHeader.ParentLink>,
)
acceptsElement(
  // @ts-expect-error A router parent link does not accept a button ref.
  <PageHeader.ParentLink as={RouterLink} to="/projects" ref={buttonRef}>
    Projects
  </PageHeader.ParentLink>,
)
acceptsElement(
  // @ts-expect-error A button parent link does not accept an anchor destination.
  <PageHeader.ParentLink as="button" href="/projects">
    Projects
  </PageHeader.ParentLink>,
)
