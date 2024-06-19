import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import {PageLayout} from './PageLayout'
import {Placeholder} from '../Placeholder'
import {ActionList, Box, Breadcrumbs, Button, Flash, LinkButton, NavList} from '..'
import {ArrowLeftIcon, FilterIcon} from '@primer/octicons-react'
import {Dialog} from '../drafts'

export default {
  title: 'Components/PageLayout/Examples',
  component: PageLayout,
} as Meta<typeof PageLayout>

/////////////////////////////////////////////////////////////////
// Sidebar as index of links to detail pages
/////////////////////////////////////////////////////////////////

export const ParentDetail: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const [currentHash, setCurrentHash] = React.useState(window.location.hash)

  // Fake routing to mimic the behavior of a single page application
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Flash
        sx={{
          display: 'none',
          '@media screen and (min-width: 768px)': {
            display: 'block',
          },
        }}
      >
        Resize your browser window to see the responsive behavior of the parent-detail pattern.
      </Flash>
      <PageLayout containerWidth="full">
        <PageLayout.Header
          hidden={{
            narrow: currentHash === '#index',
            regular: true,
            wide: true,
          }}
        >
          <LinkButton href="#index" leadingVisual={ArrowLeftIcon} variant="invisible">
            Pages
          </LinkButton>
        </PageLayout.Header>
        <PageLayout.Pane
          position="start"
          hidden={{
            narrow: currentHash !== '#index',
            regular: false,
            wide: false,
          }}
        >
          <NavList>
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
          </NavList>
        </PageLayout.Pane>
        <PageLayout.Content
          hidden={{
            narrow: currentHash === '#index',
            regular: false,
            wide: false,
          }}
        >
          {!currentHash || currentHash === '#index' || currentHash === '#fruits' ? (
            <Placeholder height={640} label="Fruits page content" />
          ) : null}
          {currentHash === '#vegetables' ? <Placeholder height={640} label="Vegetables page content" /> : null}
          {currentHash === '#animals' ? <Placeholder height={640} label="Animals page content" /> : null}
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

ParentDetail.storyName = 'Parent-detail (w/ back arrow)'

// TODO: update this story so it works when going 2 levels deep: parent -> detail -> child
export const ParentDetailBreadcrumb: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const [currentHash, setCurrentHash] = React.useState(window.location.hash)

  //
  // START story utilities
  //
  const getSecondBreadcrumbLabel = () => {
    switch (currentHash) {
      case '#fruits':
      case '#index':
      case '#new-fruit':
        return 'Fruits'
      case '#vegetables':
        return 'Vegetables'
      case '#animals':
        return 'Animals'
      default:
        return 'Detail'
    }
  }
  // END story utilities

  // Fake routing to mimic the behavior of a single page application
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Flash
        sx={{
          display: 'none',
          '@media screen and (min-width: 768px)': {
            display: 'block',
          },
        }}
      >
        Resize your browser window to see the responsive behavior of the parent-detail pattern.
      </Flash>
      <PageLayout containerWidth="full">
        <PageLayout.Header
          hidden={{
            narrow: currentHash === '#index',
            regular: true,
            wide: true,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Breadcrumbs>
              <Breadcrumbs.Item href="#index">Pages</Breadcrumbs.Item>
              <Breadcrumbs.Item
                href={currentHash === '#new-fruit' ? '#fruits' : undefined}
                selected={['#new-fruit', '#index'].includes(currentHash)}
              >
                {getSecondBreadcrumbLabel()}
              </Breadcrumbs.Item>
              {currentHash === '#new-fruit' ? <Breadcrumbs.Item selected>Child</Breadcrumbs.Item> : null}
            </Breadcrumbs>
            {!currentHash || currentHash === '#index' || currentHash === '#fruits' ? (
              <LinkButton href="#new-fruit">New fruit</LinkButton>
            ) : null}
          </Box>
        </PageLayout.Header>
        <PageLayout.Pane
          position="start"
          hidden={{
            narrow: currentHash !== '#index',
            regular: false,
            wide: false,
          }}
        >
          <NavList>
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
          </NavList>
        </PageLayout.Pane>
        <PageLayout.Content
          hidden={{
            narrow: currentHash === '#index',
            regular: false,
            wide: false,
          }}
        >
          {!currentHash || currentHash === '#index' || currentHash === '#fruits' ? (
            <Placeholder height={640} label="Fruits page content" />
          ) : null}
          {currentHash === '#vegetables' ? <Placeholder height={640} label="Vegetables page content" /> : null}
          {currentHash === '#animals' ? <Placeholder height={640} label="Animals page content" /> : null}
          {currentHash === '#new-fruit' ? <Placeholder height={640} label="New fruit page content" /> : null}
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

ParentDetailBreadcrumb.storyName = 'Parent-detail (w/ breadcrumbs)'

/////////////////////////////////////////////////////////////////
// Sidebar as set of filter options
/////////////////////////////////////////////////////////////////

export const FilterBottomSheet: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const [currentHash, setCurrentHash] = React.useState(window.location.hash)
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const onDialogClose = React.useCallback(() => setIsOpen(false), [])

  // Fake routing to mimic the behavior of a single page application
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Flash
        sx={{
          display: 'none',
          '@media screen and (min-width: 768px)': {
            display: 'block',
          },
        }}
      >
        Resize your browser window to see the responsive behavior of the filter sidebar pattern.
      </Flash>

      <PageLayout containerWidth="full">
        <PageLayout.Header
          hidden={{
            narrow: false,
            regular: true,
            wide: true,
          }}
        >
          <Button ref={buttonRef} onClick={() => setIsOpen(true)} leadingVisual={FilterIcon}>
            Filter
          </Button>
          {isOpen && (
            <Dialog title="Filter" onClose={onDialogClose} position={{narrow: 'bottom'}}>
              <ActionList>
                <ActionList.LinkItem href="#red">Red</ActionList.LinkItem>
                <ActionList.LinkItem href="#blue">Vegetables</ActionList.LinkItem>
                <ActionList.LinkItem href="#green">Animals</ActionList.LinkItem>
              </ActionList>
            </Dialog>
          )}
        </PageLayout.Header>
        <PageLayout.Pane
          position="start"
          hidden={{
            narrow: true,
            regular: false,
            wide: false,
          }}
        >
          <NavList>
            <NavList.Item
              href="#red"
              aria-current={!currentHash || currentHash === '#index' || currentHash === '#red' ? 'page' : undefined}
            >
              Red
            </NavList.Item>
            <NavList.Item href="#blue" aria-current={currentHash === '#blue' ? 'page' : undefined}>
              Blue
            </NavList.Item>
            <NavList.Item href="#green" aria-current={currentHash === '#green' ? 'page' : undefined}>
              Green
            </NavList.Item>
          </NavList>
        </PageLayout.Pane>
        <PageLayout.Content>
          {!currentHash || currentHash === '#index' || currentHash === '#red' ? (
            <Placeholder height={640} label="Red things" />
          ) : null}
          {currentHash === '#blue' ? <Placeholder height={640} label="Blue things" /> : null}
          {currentHash === '#green' ? <Placeholder height={640} label="Green things" /> : null}
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

FilterBottomSheet.storyName = 'Filters (btm sheet on narrow)'

export const FilterActionMenu: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const [currentHash, setCurrentHash] = React.useState(window.location.hash)
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const onDialogClose = React.useCallback(() => setIsOpen(false), [])

  // Fake routing to mimic the behavior of a single page application
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Flash
        sx={{
          display: 'none',
          '@media screen and (min-width: 768px)': {
            display: 'block',
          },
        }}
      >
        Resize your browser window to see the responsive behavior of the filter sidebar pattern.
      </Flash>

      <PageLayout containerWidth="full">
        <PageLayout.Header
          hidden={{
            narrow: false,
            regular: true,
            wide: true,
          }}
        >
          <Button ref={buttonRef} onClick={() => setIsOpen(true)} leadingVisual={FilterIcon}>
            Filter
          </Button>
          {isOpen && (
            <Dialog title="Filter" onClose={onDialogClose} position={{narrow: 'bottom'}}>
              <ActionList>
                <ActionList.LinkItem href="#red">Red</ActionList.LinkItem>
                <ActionList.LinkItem href="#blue">Vegetables</ActionList.LinkItem>
                <ActionList.LinkItem href="#green">Animals</ActionList.LinkItem>
              </ActionList>
            </Dialog>
          )}
        </PageLayout.Header>
        <PageLayout.Pane
          position="start"
          hidden={{
            narrow: true,
            regular: false,
            wide: false,
          }}
        >
          <NavList>
            <NavList.Item
              href="#red"
              aria-current={!currentHash || currentHash === '#index' || currentHash === '#red' ? 'page' : undefined}
            >
              Red
            </NavList.Item>
            <NavList.Item href="#blue" aria-current={currentHash === '#blue' ? 'page' : undefined}>
              Blue
            </NavList.Item>
            <NavList.Item href="#green" aria-current={currentHash === '#green' ? 'page' : undefined}>
              Green
            </NavList.Item>
          </NavList>
        </PageLayout.Pane>
        <PageLayout.Content>
          {!currentHash || currentHash === '#index' || currentHash === '#red' ? (
            <Placeholder height={640} label="Red things" />
          ) : null}
          {currentHash === '#blue' ? <Placeholder height={640} label="Blue things" /> : null}
          {currentHash === '#green' ? <Placeholder height={640} label="Green things" /> : null}
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

FilterActionMenu.storyName = 'Filters (action menu on narrow)'

export const FiltersBottomSheetTwoLevels: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const [currentHash, setCurrentHash] = React.useState(window.location.hash)
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  //
  // START story utilities
  //
  const filterableItems = {
    animals: [
      {
        name: 'Blue Tang Fish',
        color: 'blue',
      },
      {
        name: 'Poison Dart Frogs',
        color: 'blue',
      },
      {
        name: 'Scarlet Macaws',
        color: 'red',
      },
      {
        name: 'Foxes',
        color: 'red',
      },
      {
        name: 'Iguanas',
        color: 'green',
      },
      {
        name: 'Parakeets',
        color: 'green',
      },
    ],
    vegetables: [
      {
        name: 'Blue Corn',
        color: 'blue',
      },
      {
        name: 'Blue Potatoes',
        color: 'blue',
      },
      {
        name: 'Red Bell Peppers',
        color: 'red',
      },
      {
        name: 'Tomatoes',
        color: 'red',
      },
      {
        name: 'Broccoli',
        color: 'green',
      },
      {
        name: 'String Beans',
        color: 'green',
      },
    ],
    fruits: [
      {
        name: 'Blueberries',
        color: 'blue',
      },
      {
        name: 'Damson Plums',
        color: 'blue',
      },
      {
        name: 'Apples',
        color: 'red',
      },
      {
        name: 'Strawberries',
        color: 'red',
      },
      {
        name: 'Kiwis',
        color: 'green',
      },
      {
        name: 'Barlett Pears',
        color: 'green',
      },
    ],
  }

  const categories = [
    {
      hash: '#fruits',
      name: 'Fruits',
    },
    {
      hash: '#vegetables',
      name: 'Vegetables',
    },
    {
      hash: '#animals',
      name: 'Animals',
    },
  ]

  type HashObject = {hash: string; filter: string}

  const parseHash = (str?: string): HashObject => {
    if (!str) return {hash: '', filter: ''}

    const [hash, filter] = str.split('&')
    const filterValue = filter ? filter.split('=')[1] : ''

    return {
      hash,
      filter: filterValue,
    }
  }

  const generateHref = (hash?: string, filter?: string): string => {
    const {hash: currentHash, filter: currentFilter} = parseHash(window.location.hash)

    const finalHash = hash || currentHash || '#fruits'
    const finalFilter = filter || currentFilter || ''

    return `${finalHash}${finalFilter ? `&filter=${finalFilter}` : ''}`
  }

  const handleFilterChange = (filter: string) => {
    window.location.href = generateHref(undefined, filter)
  }

  const onDialogClose = React.useCallback(() => setIsOpen(false), [])

  const getFilteredItems = (category: keyof typeof filterableItems) =>
    filterableItems[category].filter(item =>
      currentHash.includes('filter') ? currentHash.includes(`filter=${item.color}`) : true,
    )
  // END story utilities

  // Fake routing to mimic the behavior of a single page application
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Flash
        sx={{
          display: 'none',
          '@media screen and (min-width: 768px)': {
            display: 'block',
          },
        }}
      >
        Resize your browser window to see the responsive behavior of the filter sidebar pattern.
      </Flash>

      <PageLayout containerWidth="full">
        <PageLayout.Header
          hidden={{
            narrow: currentHash.includes('#index'),
            regular: true,
            wide: true,
          }}
        >
          <Button ref={buttonRef} onClick={() => setIsOpen(true)} leadingVisual={FilterIcon}>
            Filter
          </Button>
          {isOpen && (
            <Dialog title="Filter" onClose={onDialogClose} position={{narrow: 'bottom'}}>
              <ActionList>
                <ActionList.Group>
                  <ActionList.GroupHeading>Categories</ActionList.GroupHeading>
                  {categories.map(category => (
                    <ActionList.LinkItem
                      key={category.hash}
                      href={category.hash}
                      active={
                        (category.hash === '#fruits' && !currentHash) ||
                        currentHash.includes('#index') ||
                        currentHash.includes(category.hash)
                      }
                    >
                      {category.name}
                    </ActionList.LinkItem>
                  ))}
                </ActionList.Group>
                <ActionList.Divider />
                <ActionList.Group selectionVariant="single">
                  <ActionList.GroupHeading>Colors</ActionList.GroupHeading>
                  <ActionList.Item
                    onSelect={() => {
                      handleFilterChange('red')
                    }}
                    selected={currentHash.includes('filter=red')}
                  >
                    Red
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={() => {
                      handleFilterChange('blue')
                    }}
                    selected={currentHash.includes('filter=blue')}
                  >
                    Blue
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={() => {
                      handleFilterChange('green')
                    }}
                    selected={currentHash.includes('filter=green')}
                  >
                    Green
                  </ActionList.Item>
                </ActionList.Group>
              </ActionList>
            </Dialog>
          )}
        </PageLayout.Header>
        <PageLayout.Pane
          position="start"
          hidden={{
            narrow: !currentHash.includes('#index'),
            regular: false,
            wide: false,
          }}
        >
          <NavList>
            <NavList.Item
              href={generateHref('#fruits')}
              aria-current={
                !currentHash || currentHash.includes('#index') || currentHash.includes('#fruits') ? 'page' : undefined
              }
            >
              Fruits
            </NavList.Item>
            <NavList.Item
              href={generateHref('#vegetables')}
              aria-current={currentHash.includes('#vegetables') ? 'page' : undefined}
            >
              Vegetables
            </NavList.Item>
            <NavList.Item
              href={generateHref('#animals')}
              aria-current={currentHash.includes('#animals') ? 'page' : undefined}
            >
              Animals
            </NavList.Item>
          </NavList>
          <Box
            sx={{
              display: 'none',
              '@media (min-width: 768px)': {
                display: 'block',
              },
            }}
          >
            <ActionList>
              <ActionList.Group selectionVariant="single">
                <ActionList.GroupHeading as="h4">Filters</ActionList.GroupHeading>
                <ActionList.Item
                  onSelect={() => {
                    handleFilterChange('red')
                  }}
                  selected={currentHash.includes('filter=red')}
                >
                  Red
                </ActionList.Item>
                <ActionList.Item
                  onSelect={() => {
                    handleFilterChange('blue')
                  }}
                  selected={currentHash.includes('filter=blue')}
                >
                  Blue
                </ActionList.Item>
                <ActionList.Item
                  onSelect={() => {
                    handleFilterChange('green')
                  }}
                  selected={currentHash.includes('filter=green')}
                >
                  Green
                </ActionList.Item>
              </ActionList.Group>
            </ActionList>
          </Box>
        </PageLayout.Pane>
        <PageLayout.Content
          hidden={{
            narrow: currentHash.includes('#index'),
            regular: false,
            wide: false,
          }}
        >
          {!currentHash || currentHash.includes('#index') || currentHash.includes('#fruits')
            ? getFilteredItems('fruits').map(item => <Placeholder key={item.name} height={48} label={item.name} />)
            : null}
          {currentHash.includes('#vegetables')
            ? getFilteredItems('vegetables').map(item => <Placeholder key={item.name} height={48} label={item.name} />)
            : null}
          {currentHash.includes('#animals')
            ? getFilteredItems('animals').map(item => <Placeholder key={item.name} height={48} label={item.name} />)
            : null}
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

FiltersBottomSheetTwoLevels.storyName = 'Filters w/ 2 levels (btm sheet on narrow)'

//
// TODO: uncomment this story if we decide we want to allow this pattern for seperate sets of filters
//
// export const ResponsiveNavCombo2: Story = () => {
//   const [currentHash, setCurrentHash] = React.useState(window.location.hash)
//   const [isOpen, setIsOpen] = React.useState(false)

//   const categories = [
//     {
//       hash: '#fruits',
//       name: 'Fruits',
//     },
//     {
//       hash: '#vegetables',
//       name: 'Vegetables',
//     },
//     {
//       hash: '#animals',
//       name: 'Animals',
//     },
//   ]
//   const selectedCategory = currentHash ? categories.find(option => currentHash.includes(option.hash)) : categories[0]

//   const buttonRef = React.useRef<HTMLButtonElement>(null)

//   const onDialogClose = React.useCallback(() => setIsOpen(false), [])
//   const getFilteredItems = (category: keyof typeof filterableItems) =>
//     filterableItems[category].filter(item =>
//       currentHash.includes('filter') ? currentHash.includes(`filter=${item.color}`) : true,
//     )

//   // Fake routing to mimic the behavior of a single page application
//   React.useEffect(() => {
//     const handleHashChange = () => {
//       setCurrentHash(window.location.hash)
//     }
//     window.addEventListener('hashchange', handleHashChange)
//     return () => {
//       window.removeEventListener('hashchange', handleHashChange)
//     }
//   }, [])

//   return (
//     <>
//       {/* <Flash variant="warning">
//         Filters only work when you open the canvas in a new tab without the Storybook chrome.
//       </Flash> */}
//       <PageLayout containerWidth="full">
//         <PageLayout.Header
//           hidden={{
//             narrow: currentHash.includes('#index'),
//             regular: true,
//             wide: true,
//           }}
//         >
//           <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
//             <ActionMenu>
//               <ActionMenu.Button>
//                 <Box sx={{color: 'fg.muted', display: 'inline-block'}}>Category:</Box>&nbsp;{selectedCategory?.name}
//               </ActionMenu.Button>
//               <ActionMenu.Overlay>
//                 <ActionList>
//                   {categories.map(category => (
//                     <ActionList.LinkItem href={category.hash}>{category.name}</ActionList.LinkItem>
//                   ))}
//                 </ActionList>
//               </ActionMenu.Overlay>
//             </ActionMenu>

//             <Button ref={buttonRef} onClick={() => setIsOpen(true)} leadingVisual={FilterIcon}>
//               Filter
//             </Button>
//             {isOpen && (
//               <Dialog title="Filter" onClose={onDialogClose} position={{narrow: 'bottom'}}>
//                 <ActionList selectionVariant="single">
//                   <ActionList.Item
//                     onSelect={() => {
//                       handleFilterChange('red')
//                     }}
//                     selected={currentHash.includes('filter=red')}
//                   >
//                     Red
//                   </ActionList.Item>
//                   <ActionList.Item
//                     onSelect={() => {
//                       handleFilterChange('blue')
//                     }}
//                     selected={currentHash.includes('filter=blue')}
//                   >
//                     Blue
//                   </ActionList.Item>
//                   <ActionList.Item
//                     onSelect={() => {
//                       handleFilterChange('green')
//                     }}
//                     selected={currentHash.includes('filter=green')}
//                   >
//                     Green
//                   </ActionList.Item>
//                 </ActionList>
//               </Dialog>
//             )}
//           </Box>
//         </PageLayout.Header>
//         <PageLayout.Pane
//           position="start"
//           hidden={{
//             narrow: !currentHash.includes('#index'),
//             regular: false,
//             wide: false,
//           }}
//         >
//           <NavList>
//             <NavList.Item
//               href={generateHref('#fruits')}
//               aria-current={
//                 !currentHash || currentHash.includes('#index') || currentHash.includes('#fruits') ? 'page' : undefined
//               }
//             >
//               Fruits
//             </NavList.Item>
//             <NavList.Item
//               href={generateHref('#vegetables')}
//               aria-current={currentHash.includes('#vegetables') ? 'page' : undefined}
//             >
//               Vegetables
//             </NavList.Item>
//             <NavList.Item
//               href={generateHref('#animals')}
//               aria-current={currentHash.includes('#animals') ? 'page' : undefined}
//             >
//               Animals
//             </NavList.Item>
//           </NavList>
//           <Box
//             sx={{
//               display: 'none',
//               '@media (min-width: 768px)': {
//                 display: 'block',
//               },
//             }}
//           >
//             <ActionList>
//               <ActionList.Group selectionVariant="single">
//                 <ActionList.GroupHeading as="h4">Filters</ActionList.GroupHeading>
//                 <ActionList.Item
//                   onSelect={() => {
//                     handleFilterChange('red')
//                   }}
//                   selected={currentHash.includes('filter=red')}
//                 >
//                   Red
//                 </ActionList.Item>
//                 <ActionList.Item
//                   onSelect={() => {
//                     handleFilterChange('blue')
//                   }}
//                   selected={currentHash.includes('filter=blue')}
//                 >
//                   Blue
//                 </ActionList.Item>
//                 <ActionList.Item
//                   onSelect={() => {
//                     handleFilterChange('green')
//                   }}
//                   selected={currentHash.includes('filter=green')}
//                 >
//                   Green
//                 </ActionList.Item>
//               </ActionList.Group>
//             </ActionList>
//           </Box>
//         </PageLayout.Pane>
//         <PageLayout.Content
//           hidden={{
//             narrow: currentHash.includes('#index'),
//             regular: false,
//             wide: false,
//           }}
//         >
//           {!currentHash || currentHash.includes('#index') || currentHash.includes('#fruits')
//             ? getFilteredItems('fruits').map(item => <Placeholder height={48} label={item.name} />)
//             : null}
//           {currentHash.includes('#vegetables')
//             ? getFilteredItems('vegetables').map(item => <Placeholder height={48} label={item.name} />)
//             : null}
//           {currentHash.includes('#animals')
//             ? getFilteredItems('animals').map(item => <Placeholder height={48} label={item.name} />)
//             : null}
//         </PageLayout.Content>
//       </PageLayout>
//     </>
//   )
// }

// ResponsiveNavCombo2.storyName = 'Responsive nav combo - action menu + btm sheet'

/////////////////////////////////////////////////////////////////
// Sidebar with a mix of detail page links and filter options
/////////////////////////////////////////////////////////////////

export const ParentDetailPlusFilters: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const [currentHash, setCurrentHash] = React.useState(window.location.hash)
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  //
  // START story utilities
  //
  const filterableItems = {
    animals: [
      {
        name: 'Blue Tang Fish',
        color: 'blue',
      },
      {
        name: 'Poison Dart Frogs',
        color: 'blue',
      },
      {
        name: 'Scarlet Macaws',
        color: 'red',
      },
      {
        name: 'Foxes',
        color: 'red',
      },
      {
        name: 'Iguanas',
        color: 'green',
      },
      {
        name: 'Parakeets',
        color: 'green',
      },
    ],
    vegetables: [
      {
        name: 'Blue Corn',
        color: 'blue',
      },
      {
        name: 'Blue Potatoes',
        color: 'blue',
      },
      {
        name: 'Red Bell Peppers',
        color: 'red',
      },
      {
        name: 'Tomatoes',
        color: 'red',
      },
      {
        name: 'Broccoli',
        color: 'green',
      },
      {
        name: 'String Beans',
        color: 'green',
      },
    ],
    fruits: [
      {
        name: 'Blueberries',
        color: 'blue',
      },
      {
        name: 'Damson Plums',
        color: 'blue',
      },
      {
        name: 'Apples',
        color: 'red',
      },
      {
        name: 'Strawberries',
        color: 'red',
      },
      {
        name: 'Kiwis',
        color: 'green',
      },
      {
        name: 'Barlett Pears',
        color: 'green',
      },
    ],
  }

  type HashObject = {hash: string; filter: string}

  const parseHash = (str?: string): HashObject => {
    if (!str) return {hash: '', filter: ''}

    const [hash, filter] = str.split('&')
    const filterValue = filter ? filter.split('=')[1] : ''

    return {
      hash,
      filter: filterValue,
    }
  }

  const generateHref = (hash?: string, filter?: string): string => {
    const {hash: currentHash, filter: currentFilter} = parseHash(window.location.hash)

    const finalHash = hash || currentHash || '#fruits'
    const finalFilter = filter || currentFilter || ''

    return `${finalHash}${finalFilter ? `&filter=${finalFilter}` : ''}`
  }

  const handleFilterChange = (filter: string) => {
    window.location.href = generateHref(undefined, filter)
  }

  const onDialogClose = React.useCallback(() => setIsOpen(false), [])

  const getFilteredItems = (category: keyof typeof filterableItems) =>
    filterableItems[category].filter(item =>
      currentHash.includes('filter') ? currentHash.includes(`filter=${item.color}`) : true,
    )
  // END story utilities

  // Fake routing to mimic the behavior of a single page application
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <Flash
        sx={{
          display: 'none',
          '@media screen and (min-width: 768px)': {
            display: 'block',
          },
        }}
      >
        Resize your browser window to see the responsive behavior of the sidebar patterns.
      </Flash>

      <PageLayout containerWidth="full">
        <PageLayout.Header
          hidden={{
            narrow: currentHash.includes('#index'),
            regular: true,
            wide: true,
          }}
        >
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <LinkButton href={generateHref('#index')} leadingVisual={ArrowLeftIcon} variant="invisible">
              Categories
            </LinkButton>

            <Button ref={buttonRef} onClick={() => setIsOpen(true)} leadingVisual={FilterIcon}>
              Filter
            </Button>
            {isOpen && (
              <Dialog title="Filter" onClose={onDialogClose} position={{narrow: 'bottom'}}>
                <ActionList selectionVariant="single">
                  <ActionList.Item
                    onSelect={() => {
                      handleFilterChange('red')
                    }}
                    selected={currentHash.includes('filter=red')}
                  >
                    Red
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={() => {
                      handleFilterChange('blue')
                    }}
                    selected={currentHash.includes('filter=blue')}
                  >
                    Blue
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={() => {
                      handleFilterChange('green')
                    }}
                    selected={currentHash.includes('filter=green')}
                  >
                    Green
                  </ActionList.Item>
                </ActionList>
              </Dialog>
            )}
          </Box>
        </PageLayout.Header>
        <PageLayout.Pane
          position="start"
          hidden={{
            narrow: !currentHash.includes('#index'),
            regular: false,
            wide: false,
          }}
        >
          <NavList>
            <NavList.Item
              href={generateHref('#fruits')}
              aria-current={
                !currentHash || currentHash.includes('#index') || currentHash.includes('#fruits') ? 'page' : undefined
              }
            >
              Fruits
            </NavList.Item>
            <NavList.Item
              href={generateHref('#vegetables')}
              aria-current={currentHash.includes('#vegetables') ? 'page' : undefined}
            >
              Vegetables
            </NavList.Item>
            <NavList.Item
              href={generateHref('#animals')}
              aria-current={currentHash.includes('#animals') ? 'page' : undefined}
            >
              Animals
            </NavList.Item>
          </NavList>
          <Box
            sx={{
              display: 'none',
              '@media (min-width: 768px)': {
                display: 'block',
              },
            }}
          >
            <ActionList>
              <ActionList.Group selectionVariant="single">
                <ActionList.GroupHeading as="h4">Filters</ActionList.GroupHeading>
                <ActionList.Item
                  onSelect={() => {
                    handleFilterChange('red')
                  }}
                  selected={currentHash.includes('filter=red')}
                >
                  Red
                </ActionList.Item>
                <ActionList.Item
                  onSelect={() => {
                    handleFilterChange('blue')
                  }}
                  selected={currentHash.includes('filter=blue')}
                >
                  Blue
                </ActionList.Item>
                <ActionList.Item
                  onSelect={() => {
                    handleFilterChange('green')
                  }}
                  selected={currentHash.includes('filter=green')}
                >
                  Green
                </ActionList.Item>
              </ActionList.Group>
            </ActionList>
          </Box>
        </PageLayout.Pane>
        <PageLayout.Content
          hidden={{
            narrow: currentHash.includes('#index'),
            regular: false,
            wide: false,
          }}
        >
          {!currentHash || currentHash.includes('#index') || currentHash.includes('#fruits')
            ? getFilteredItems('fruits').map(item => <Placeholder key={item.name} height={48} label={item.name} />)
            : null}
          {currentHash.includes('#vegetables')
            ? getFilteredItems('vegetables').map(item => <Placeholder key={item.name} height={48} label={item.name} />)
            : null}
          {currentHash.includes('#animals')
            ? getFilteredItems('animals').map(item => <Placeholder key={item.name} height={48} label={item.name} />)
            : null}
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

ParentDetailPlusFilters.storyName = 'Parent-detail + filters (filters as btm sheet on narrow)'
