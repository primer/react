import {cleanup, render, screen} from '@testing-library/react'
import type React from 'react'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it} from 'vitest'
import {ActionList} from '../components/ActionList/ActionList'
import {Card, CardHeading} from '../components/Card/Card'
import {FormControl} from '../components/FormControl/FormControl'
import {NavList} from '../components/NavList/NavList'
import {PageLayout} from '../components/PageLayout/PageLayout'
import {TreeView} from '../components/TreeView/TreeView'
import {isPartOf, regionElements, resolveRegions} from './regions'

/**
 * Every compound component that identifies children by role exposes one element prop per
 * region. These cases hold the contract uniform so a consumer's wrapper never has to be
 * recognizable by identity.
 */
interface RegionCase {
  name: string
  region: string
  /** Renders the component with the region supplied as an element prop. */
  viaProp: (node: React.ReactNode) => React.ReactElement
  /** Renders the component with the region supplied both as a prop and as a matching child. */
  viaBoth?: (node: React.ReactNode) => React.ReactElement
}

const Marker = () => <span data-testid="from-prop">prop</span>

const cases: RegionCase[] = [
  {
    name: 'PageLayout',
    region: 'header',
    viaProp: node => <PageLayout header={node}>body</PageLayout>,
    viaBoth: node => (
      <PageLayout header={node}>
        <PageLayout.Header>from child</PageLayout.Header>
      </PageLayout>
    ),
  },
  {
    name: 'PageLayout',
    region: 'sidebar',
    viaProp: node => <PageLayout sidebar={node}>body</PageLayout>,
  },
  {
    name: 'PageLayout',
    region: 'footer',
    viaProp: node => <PageLayout footer={node}>body</PageLayout>,
  },
  {
    name: 'Card',
    region: 'heading',
    viaProp: node => <Card heading={node} />,
    viaBoth: node => (
      <Card heading={node}>
        <CardHeading>from child</CardHeading>
      </Card>
    ),
  },
  {
    name: 'Card',
    region: 'description',
    viaProp: node => <Card description={node} />,
  },
  {
    name: 'Card',
    region: 'action',
    viaProp: node => <Card action={node} />,
  },
  {
    name: 'FormControl',
    region: 'label',
    viaProp: node => <FormControl label={node} />,
  },
  {
    name: 'FormControl',
    region: 'caption',
    viaProp: node => <FormControl caption={node} />,
  },
  {
    name: 'NavList',
    region: 'heading',
    viaProp: node => <NavList heading={node} aria-label="Navigation" />,
    viaBoth: node => (
      <NavList heading={node} aria-label="Navigation">
        <NavList.Heading>from child</NavList.Heading>
      </NavList>
    ),
  },
  {
    name: 'NavList.Item',
    region: 'leadingVisual',
    viaProp: node => (
      <NavList aria-label="Navigation">
        <NavList.Item href="#" leadingVisual={node}>
          item
        </NavList.Item>
      </NavList>
    ),
    viaBoth: node => (
      <NavList aria-label="Navigation">
        <NavList.Item href="#" leadingVisual={node}>
          <NavList.LeadingVisual>from child</NavList.LeadingVisual>
          item
        </NavList.Item>
      </NavList>
    ),
  },
  {
    name: 'NavList.Item',
    region: 'trailingAction',
    viaProp: node => (
      <NavList aria-label="Navigation">
        <NavList.Item href="#" trailingAction={node}>
          item
        </NavList.Item>
      </NavList>
    ),
  },
  {
    name: 'ActionList.Item',
    region: 'leadingVisual',
    viaProp: node => (
      <ActionList>
        <ActionList.Item leadingVisual={node}>item</ActionList.Item>
      </ActionList>
    ),
    viaBoth: node => (
      <ActionList>
        <ActionList.Item leadingVisual={node}>
          <ActionList.LeadingVisual>from child</ActionList.LeadingVisual>
          item
        </ActionList.Item>
      </ActionList>
    ),
  },
  {
    name: 'ActionList.Item',
    region: 'trailingAction',
    viaProp: node => (
      <ActionList>
        <ActionList.Item trailingAction={node}>item</ActionList.Item>
      </ActionList>
    ),
  },
  {
    name: 'ActionList.LinkItem',
    region: 'trailingVisual',
    viaProp: node => (
      <ActionList>
        <ActionList.LinkItem href="#" trailingVisual={node}>
          item
        </ActionList.LinkItem>
      </ActionList>
    ),
  },
  {
    name: 'ActionList.Group',
    region: 'heading',
    viaProp: node => (
      <ActionList>
        <ActionList.Group heading={node}>
          <ActionList.Item>item</ActionList.Item>
        </ActionList.Group>
      </ActionList>
    ),
  },
  {
    name: 'ActionList.GroupHeading',
    region: 'trailingAction',
    viaProp: node => (
      <ActionList>
        <ActionList.Group>
          <ActionList.GroupHeading trailingAction={node}>group</ActionList.GroupHeading>
          <ActionList.Item>item</ActionList.Item>
        </ActionList.Group>
      </ActionList>
    ),
  },
  {
    name: 'TreeView.Item',
    region: 'leadingVisual',
    viaProp: node => (
      <TreeView aria-label="File tree">
        <TreeView.Item id="a" leadingVisual={node}>
          item
        </TreeView.Item>
      </TreeView>
    ),
    viaBoth: node => (
      <TreeView aria-label="File tree">
        <TreeView.Item id="a" leadingVisual={node}>
          <TreeView.LeadingVisual>from child</TreeView.LeadingVisual>
          item
        </TreeView.Item>
      </TreeView>
    ),
  },
]

describe('region props', () => {
  afterEach(cleanup)

  for (const {name, region, viaProp} of cases) {
    it(`${name} renders a custom component supplied through the \`${region}\` prop`, () => {
      render(viaProp(<Marker />))
      expect(screen.getByTestId('from-prop')).toBeInTheDocument()
    })
  }

  for (const {name, region, viaBoth} of cases) {
    if (!viaBoth) continue
    it(`${name} prefers the \`${region}\` prop over a matching child`, () => {
      render(viaBoth(<Marker />))
      expect(screen.getByTestId('from-prop')).toBeInTheDocument()
      expect(screen.queryByText('from child')).not.toBeInTheDocument()
    })
  }

  for (const {name, region, viaProp} of cases) {
    it(`${name} resolves the \`${region}\` prop during server rendering`, () => {
      expect(renderToString(viaProp(<Marker />))).toContain('from-prop')
    })
  }
})

describe('resolveRegions', () => {
  const A = ({children}: {children?: React.ReactNode}) => <i>{children}</i>
  const B = ({children}: {children?: React.ReactNode}) => <b>{children}</b>

  it('keeps the first match for a singular region and lets duplicates fall to rest', () => {
    const {regions, rest} = resolveRegions(
      <>
        <A>first</A>
        <A>second</A>
        <span>plain</span>
      </>,
      {a: {match: isPartOf(A)}},
    )

    expect(regions.a).toBeDefined()
    expect(rest).toHaveLength(2)
  })

  it('collects every match for a multiple region in authored order', () => {
    const {matched} = resolveRegions(
      <>
        <A>one</A>
        <B>b</B>
        <A>two</A>
      </>,
      {a: {match: isPartOf(A), multiple: true}},
    )

    expect(matched.a.map(child => child.props.children)).toEqual(['one', 'two'])
  })

  it('unwraps fragments so grouped parts stay discoverable', () => {
    const {regions} = resolveRegions(
      <>
        <>
          <A>nested</A>
        </>
      </>,
      {a: {match: isPartOf(A)}},
    )

    expect(regions.a).toBeDefined()
  })

  it('leaves matches in rest when a region is kept in place', () => {
    const {matched, rest} = resolveRegions(<A>kept</A>, {a: {match: isPartOf(A), keep: true}})

    expect(matched.a).toHaveLength(1)
    expect(rest).toHaveLength(1)
  })

  it('preserves authored order of unmatched children', () => {
    const {rest} = resolveRegions(
      <>
        <span>one</span>
        <A>match</A>
        <span>two</span>
      </>,
      {a: {match: isPartOf(A)}},
    )

    expect(rest.map(child => (child as React.ReactElement<{children: string}>).props.children)).toEqual(['one', 'two'])
  })

  it('treats a null override as absent so the matched child still wins', () => {
    const {regions} = resolveRegions(<A>child</A>, {a: {match: isPartOf(A)}}, {a: null})

    expect(regions.a).toBeDefined()
  })
})

describe('regionElements', () => {
  const A = ({label}: {label?: string}) => <i>{label}</i>

  it('returns the matched children when no override is supplied', () => {
    const matched = [<A key="a" label="matched" />]
    expect(regionElements(undefined, matched)).toBe(matched)
  })

  it('normalizes an override into a list of elements', () => {
    const result = regionElements<{label?: string}>(
      <>
        <A label="one" />
        <A label="two" />
      </>,
      [],
    )

    expect(result.map(child => child.props.label)).toEqual(['one', 'two'])
  })
})

/**
 * `github-ui` builds compound components on top of Primer that place their own part types into
 * a Primer parent's regions. Upstream that needs `PageLayout`'s private `_slotsConfig` prop and
 * a copied `__SLOT__` symbol; here the wrapper resolves its own parts and forwards them, which
 * leaves consumer call sites unchanged.
 */
describe('wrapper forwarding', () => {
  afterEach(cleanup)

  // eslint-disable-next-line primer-react/direct-slot-children -- the wrapper owns the region, which is the pattern under test
  const WrapperHeader = ({children}: {children?: React.ReactNode}) => <PageLayout.Header>{children}</PageLayout.Header>
  const WrapperSidebar = ({children}: {children?: React.ReactNode}) => (
    <PageLayout.Sidebar>{children}</PageLayout.Sidebar>
  )

  function WrapperLayout({children}: {children?: React.ReactNode}) {
    const {
      regions: {header, sidebar},
      rest,
    } = resolveRegions(children, {
      header: {match: isPartOf(WrapperHeader)},
      sidebar: {match: isPartOf(WrapperSidebar)},
    })
    return (
      <PageLayout header={header} sidebar={sidebar}>
        {rest}
      </PageLayout>
    )
  }

  const tree = (
    <WrapperLayout>
      <WrapperHeader>HEAD</WrapperHeader>
      <WrapperSidebar>SIDE</WrapperSidebar>
      <PageLayout.Content>BODY</PageLayout.Content>
    </WrapperLayout>
  )

  it('places a wrapper’s own part types without a private config prop or a marker', () => {
    const {container} = render(tree)
    const root = container.querySelector('[data-component="PageLayout"]')

    expect(root?.querySelector('[data-component="PageLayout.Sidebar"]')).not.toBeNull()
    expect(root?.querySelector('[data-component="PageLayout.Header"]')).not.toBeNull()
    expect(root?.getAttribute('data-has-sidebar')).toBe('true')
    // PageLayout hoists the sidebar ahead of the header, as it does for its own parts.
    expect(root?.textContent).toBe('SIDEHEADBODY')
  })

  it('hoists the same way during server rendering', () => {
    const html = renderToString(tree)
    expect(html).toContain('data-has-sidebar="true"')
    expect(html.indexOf('SIDE')).toBeLessThan(html.indexOf('HEAD'))
  })
})
