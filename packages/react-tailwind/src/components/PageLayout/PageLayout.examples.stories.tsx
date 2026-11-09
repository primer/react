import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ArrowLeftIcon, FilterIcon} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Breadcrumbs} from '../Breadcrumbs'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {StoryNotice} from '../../internal/StoryNotice.storyHelpers'
import {LinkButton} from '../LinkButton'
import {NavList} from '../NavList'
import {PageLayout} from './PageLayout'

const meta = {title: 'React Tailwind/Layout/PageLayout/Examples', component: PageLayout} satisfies Meta<
  typeof PageLayout
>
export default meta
type Story = StoryObj<typeof meta>

const Placeholder = ({height, label}: {height: number; label: string}) => (
  <div
    className="box-border grid place-items-center rounded-md border-thin border-muted bg-inset px-6 py-1"
    style={{height}}
  >
    {label}
  </div>
)

function useCurrentHash() {
  const [currentHash, setCurrentHash] = React.useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )

  React.useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return currentHash
}

const ResponsiveNotice = ({children}: React.PropsWithChildren) => (
  <StoryNotice className="hidden md:block">{children}</StoryNotice>
)

const Navigation = ({currentHash, filters}: {currentHash: string; filters?: React.ReactNode}) => (
  <>
    <NavList aria-label="Pages">
      <NavList.List>
        <NavList.Item
          href="#fruits"
          aria-current={!currentHash || currentHash === '#index' || currentHash === '#fruits' ? 'page' : undefined}
        >
          Fruits
        </NavList.Item>
        <NavList.Item href="#vegetables" aria-current={currentHash === '#vegetables' ? 'page' : undefined}>
          Vegetables
        </NavList.Item>
        <NavList.Item href="#animals" aria-current={currentHash === '#animals' ? 'page' : undefined}>
          Animals
        </NavList.Item>
      </NavList.List>
    </NavList>
    {filters ? <div className="mt-4 hidden md:block">{filters}</div> : null}
  </>
)

const DetailContent = ({currentHash}: {currentHash: string}) => {
  const label =
    currentHash === '#vegetables'
      ? 'Vegetables page content'
      : currentHash === '#animals'
        ? 'Animals page content'
        : 'Fruits page content'
  return <Placeholder height={640} label={label} />
}

export const ParentDetail: Story = {
  render: () => {
    const currentHash = useCurrentHash()
    return (
      <>
        <ResponsiveNotice>
          Resize your browser window to see the responsive behavior of the parent-detail pattern.
        </ResponsiveNotice>
        <PageLayout containerWidth="full">
          <PageLayout.Header hidden={{narrow: currentHash === '#index', regular: true, wide: true}}>
            <LinkButton href="#index" leadingVisual={ArrowLeftIcon} variant="invisible">
              Pages
            </LinkButton>
          </PageLayout.Header>
          <PageLayout.Pane
            aria-label="Side pane"
            hidden={{narrow: currentHash !== '#index', regular: false, wide: false}}
            position="start"
          >
            <Navigation currentHash={currentHash} />
          </PageLayout.Pane>
          <PageLayout.Content hidden={{narrow: currentHash === '#index', regular: false, wide: false}}>
            <DetailContent currentHash={currentHash} />
          </PageLayout.Content>
        </PageLayout>
      </>
    )
  },
}
ParentDetail.storyName = 'Parent-detail (w/ back arrow)'

export const ParentDetailBreadcrumb: Story = {
  render: () => {
    const currentHash = useCurrentHash()
    const breadcrumb = currentHash === '#vegetables' ? 'Vegetables' : currentHash === '#animals' ? 'Animals' : 'Fruits'
    return (
      <>
        <ResponsiveNotice>
          Resize your browser window to see the responsive behavior of the parent-detail pattern.
        </ResponsiveNotice>
        <PageLayout containerWidth="full">
          <PageLayout.Header hidden={{narrow: currentHash === '#index', regular: true, wide: true}}>
            <div className="flex items-center justify-between gap-4">
              <Breadcrumbs>
                <Breadcrumbs.Item href="#index">Pages</Breadcrumbs.Item>
                <Breadcrumbs.Item selected>{breadcrumb}</Breadcrumbs.Item>
              </Breadcrumbs>
              <LinkButton href="#new-fruit">New fruit</LinkButton>
            </div>
          </PageLayout.Header>
          <PageLayout.Pane
            aria-label="Side pane"
            hidden={{narrow: currentHash !== '#index', regular: false, wide: false}}
            position="start"
          >
            <Navigation currentHash={currentHash} />
          </PageLayout.Pane>
          <PageLayout.Content hidden={{narrow: currentHash === '#index', regular: false, wide: false}}>
            <DetailContent currentHash={currentHash} />
          </PageLayout.Content>
        </PageLayout>
      </>
    )
  },
}
ParentDetailBreadcrumb.storyName = 'Parent-detail (w/ breadcrumbs)'

const FilterDialog = ({title = 'Filter'}: {title?: string}) => (
  <Dialog>
    <Dialog.Trigger render={<Button leadingVisual={FilterIcon}>Filter</Button>} />
    <Dialog.Content position={{narrow: 'bottom'}}>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <NavList aria-label="Filter options">
          <NavList.List>
            <NavList.Item href="#red">Red</NavList.Item>
            <NavList.Item href="#blue">Blue</NavList.Item>
            <NavList.Item href="#green">Green</NavList.Item>
          </NavList.List>
        </NavList>
      </Dialog.Body>
    </Dialog.Content>
  </Dialog>
)

const FilterNavigation = ({currentHash, nested = false}: {currentHash: string; nested?: boolean}) => (
  <Navigation
    currentHash={currentHash}
    filters={
      <NavList aria-label="Filters">
        <NavList.List>
          <NavList.Item href="#red">Red</NavList.Item>
          <NavList.Item href="#blue">Blue</NavList.Item>
          <NavList.Item href="#green">Green</NavList.Item>
          {nested ? <NavList.Item href="#all">All filters</NavList.Item> : null}
        </NavList.List>
      </NavList>
    }
  />
)

const FilterPage = ({children, nested = false}: {children?: React.ReactNode; nested?: boolean}) => {
  const currentHash = useCurrentHash()
  return (
    <>
      <ResponsiveNotice>
        Resize your browser window to see the responsive behavior of the filter sidebar pattern.
      </ResponsiveNotice>
      <PageLayout containerWidth="full">
        <PageLayout.Header hidden={{narrow: false, regular: true, wide: true}}>{children}</PageLayout.Header>
        <PageLayout.Pane aria-label="Side pane" hidden={{narrow: true, regular: false, wide: false}} position="start">
          <FilterNavigation currentHash={currentHash} nested={nested} />
        </PageLayout.Pane>
        <PageLayout.Content>
          <Placeholder
            height={640}
            label={currentHash === '#blue' ? 'Blue things' : currentHash === '#green' ? 'Green things' : 'Red things'}
          />
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

const filterableItems = {
  animals: [
    {name: 'Blue Tang Fish', color: 'blue'},
    {name: 'Poison Dart Frogs', color: 'blue'},
    {name: 'Scarlet Macaws', color: 'red'},
    {name: 'Foxes', color: 'red'},
    {name: 'Iguanas', color: 'green'},
    {name: 'Parakeets', color: 'green'},
  ],
  vegetables: [
    {name: 'Blue Corn', color: 'blue'},
    {name: 'Blue Potatoes', color: 'blue'},
    {name: 'Red Bell Peppers', color: 'red'},
    {name: 'Tomatoes', color: 'red'},
    {name: 'Broccoli', color: 'green'},
    {name: 'String Beans', color: 'green'},
  ],
  fruits: [
    {name: 'Blueberries', color: 'blue'},
    {name: 'Damson Plums', color: 'blue'},
    {name: 'Apples', color: 'red'},
    {name: 'Strawberries', color: 'red'},
    {name: 'Kiwis', color: 'green'},
    {name: 'Barlett Pears', color: 'green'},
  ],
} as const

const categories = [
  {hash: '#fruits', name: 'Fruits'},
  {hash: '#vegetables', name: 'Vegetables'},
  {hash: '#animals', name: 'Animals'},
] as const

type Category = keyof typeof filterableItems
type FilterColor = (typeof filterableItems)[Category][number]['color']

function parseHash(value: string) {
  const [hash, filter = ''] = value.split('&')
  return {hash, filter: filter.startsWith('filter=') ? filter.slice('filter='.length) : ''}
}

function generateHref(currentHash: string, hash?: string, filter?: FilterColor) {
  const current = parseHash(currentHash)
  const finalHash = hash || current.hash || '#fruits'
  const finalFilter = filter || current.filter
  return `${finalHash}${finalFilter ? `&filter=${finalFilter}` : ''}`
}

function getCurrentCategory(currentHash: string): Category {
  if (currentHash.includes('#vegetables')) return 'vegetables'
  if (currentHash.includes('#animals')) return 'animals'
  return 'fruits'
}

const FilterChoices = ({
  currentHash,
  onFilterChange,
}: {
  currentHash: string
  onFilterChange: (filter: FilterColor) => void
}) => (
  <ActionList>
    <ActionList.Group selectionVariant="single">
      <ActionList.GroupHeading>Filters</ActionList.GroupHeading>
      {(['red', 'blue', 'green'] as const).map(color => (
        <ActionList.Item
          key={color}
          onSelect={() => onFilterChange(color)}
          selected={currentHash.includes(`filter=${color}`)}
        >
          {color[0].toUpperCase() + color.slice(1)}
        </ActionList.Item>
      ))}
    </ActionList.Group>
  </ActionList>
)

const CategoryNavigation = ({currentHash}: {currentHash: string}) => (
  <NavList aria-label="Categories">
    <NavList.List>
      {categories.map(category => (
        <NavList.Item
          key={category.hash}
          href={generateHref(currentHash, category.hash)}
          aria-current={
            (!currentHash && category.hash === '#fruits') ||
            currentHash.includes('#index') ||
            currentHash.includes(category.hash)
              ? 'page'
              : undefined
          }
        >
          {category.name}
        </NavList.Item>
      ))}
    </NavList.List>
  </NavList>
)

const FilteredItems = ({currentHash}: {currentHash: string}) => {
  const currentFilter = parseHash(currentHash).filter
  return filterableItems[getCurrentCategory(currentHash)]
    .filter(item => !currentFilter || item.color === currentFilter)
    .map(item => <Placeholder key={item.name} height={48} label={item.name} />)
}

const ResponsiveFilterDialog = ({
  currentHash,
  includeCategories,
  onFilterChange,
}: {
  currentHash: string
  includeCategories?: boolean
  onFilterChange: (filter: FilterColor) => void
}) => (
  <Dialog>
    <Dialog.Trigger render={<Button leadingVisual={FilterIcon}>Filter</Button>} />
    <Dialog.Content position={{narrow: 'bottom'}}>
      <Dialog.Header>
        <Dialog.Title>Filter</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        {includeCategories ? <CategoryNavigation currentHash={currentHash} /> : null}
        <FilterChoices currentHash={currentHash} onFilterChange={onFilterChange} />
      </Dialog.Body>
    </Dialog.Content>
  </Dialog>
)

const TwoLevelFilterPage = ({parentDetail = false}: {parentDetail?: boolean}) => {
  const currentHash = useCurrentHash()
  const handleFilterChange = (filter: FilterColor) => {
    window.location.hash = generateHref(currentHash, undefined, filter)
  }

  return (
    <>
      <ResponsiveNotice>
        Resize your browser window to see the responsive behavior of the{' '}
        {parentDetail ? 'sidebar patterns' : 'filter sidebar pattern'}.
      </ResponsiveNotice>
      <PageLayout containerWidth="full">
        <PageLayout.Header hidden={{narrow: currentHash.includes('#index'), regular: true, wide: true}}>
          <div className={parentDetail ? 'flex justify-between' : undefined}>
            {parentDetail ? (
              <LinkButton href={generateHref(currentHash, '#index')} leadingVisual={ArrowLeftIcon} variant="invisible">
                Categories
              </LinkButton>
            ) : null}
            <ResponsiveFilterDialog
              currentHash={currentHash}
              includeCategories={!parentDetail}
              onFilterChange={handleFilterChange}
            />
          </div>
        </PageLayout.Header>
        <PageLayout.Pane
          aria-label="Side pane"
          hidden={{narrow: !currentHash.includes('#index'), regular: false, wide: false}}
          position="start"
        >
          <CategoryNavigation currentHash={currentHash} />
          <div className="mt-4 hidden md:block">
            <FilterChoices currentHash={currentHash} onFilterChange={handleFilterChange} />
          </div>
        </PageLayout.Pane>
        <PageLayout.Content hidden={{narrow: currentHash.includes('#index'), regular: false, wide: false}}>
          <FilteredItems currentHash={currentHash} />
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

export const FilterBottomSheet: Story = {
  render: () => (
    <FilterPage>
      <FilterDialog />
    </FilterPage>
  ),
}
FilterBottomSheet.storyName = 'Filters (btm sheet on narrow)'

export const FilterActionMenu: Story = {
  render: () => (
    <FilterPage>
      <ActionMenu>
        <ActionMenu.Button>Filter</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.CheckboxItem defaultChecked>Red</ActionMenu.CheckboxItem>
          <ActionMenu.CheckboxItem>Blue</ActionMenu.CheckboxItem>
          <ActionMenu.CheckboxItem>Green</ActionMenu.CheckboxItem>
        </ActionMenu.Content>
      </ActionMenu>
    </FilterPage>
  ),
}
FilterActionMenu.storyName = 'Filters (action menu on narrow)'

export const FiltersBottomSheetTwoLevels: Story = {
  render: () => <TwoLevelFilterPage />,
}
FiltersBottomSheetTwoLevels.storyName = 'Filters w/ 2 levels (btm sheet on narrow)'

export const ParentDetailPlusFilters: Story = {
  render: () => <TwoLevelFilterPage parentDetail />,
}
ParentDetailPlusFilters.storyName = 'Parent-detail + filters (filters as btm sheet on narrow)'
