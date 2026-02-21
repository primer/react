import {useState} from 'react'
import Breadcrumbs, {useBreadcrumbsResponsive, BreadcrumbsOverflowMenu} from '.'
import TextInput from '../TextInput'
import classes from './Breadcrumbs.dev.stories.module.css'
import overflowClasses from './Breadcrumbs.module.css'

export default {
  title: 'Components/Breadcrumbs/Dev',
}

export const DynamicChildren = () => {
  const [items, setItems] = useState([
    {id: 1, href: '#', name: 'Home'},
    {id: 2, href: '#', name: 'Docs'},
    {id: 3, href: '#', name: 'Components'},
  ])

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    const names = ['Advanced', 'Examples', 'Guides', 'API', 'Tutorials', 'Reference']
    const randomName = names[Math.floor(Math.random() * names.length)]
    setItems([...items, {id: newId, href: '#', name: `${randomName}-${newId}`}])
  }

  const removeItem = () => {
    if (items.length > 1) {
      setItems(items.slice(0, -1))
    }
  }

  const addMultipleItems = () => {
    const newItems = [
      {id: Date.now() + 1, href: '#', name: 'Category'},
      {id: Date.now() + 2, href: '#', name: 'Subcategory'},
      {id: Date.now() + 3, href: '#', name: 'Item'},
      {id: Date.now() + 4, href: '#', name: 'Details'},
      {id: Date.now() + 5, href: '#', name: 'Specifications'},
    ]
    setItems([...items, ...newItems])
  }

  const reset = () => {
    setItems([
      {id: 1, href: '#', name: 'Home'},
      {id: 2, href: '#', name: 'Docs'},
      {id: 3, href: '#', name: 'Components'},
    ])
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
        <button type="button" onClick={addItem} style={{padding: '4px 8px'}}>
          Add Item
        </button>
        <button type="button" onClick={removeItem} style={{padding: '4px 8px'}}>
          Remove Item
        </button>
        <button type="button" onClick={addMultipleItems} style={{padding: '4px 8px'}}>
          Add Many Items
        </button>
        <button type="button" onClick={reset} style={{padding: '4px 8px'}}>
          Reset
        </button>
      </div>

      <div>
        <h4 id="dynamic-breadcrumbs-heading" style={{margin: '0 0 8px 0'}}>
          Dynamic breadcrumbs
        </h4>
        <Breadcrumbs overflow="menu-with-root">
          {items.map((item, index) => (
            <Breadcrumbs.Item key={item.id} href={item.href} selected={index === items.length - 1}>
              {item.name}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
      </div>

      <div style={{marginTop: '16px', fontSize: '12px'}}>
        Current items: {items.length} | Try adding/removing items to see how overflow behavior changes
      </div>
    </div>
  )
}

export const OverflowMenuNarrowContainer = () => (
  <div style={{width: '350px', border: '1px solid #ccc', padding: '8px'}}>
    <Breadcrumbs overflow="menu">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </div>
)

// Wrapper components to test that BreadcrumbsItem works when wrapped
const StyledWrapper = ({children}: {children: React.ReactNode}) => (
  <span style={{padding: '2px', border: '1px dotted #999'}}>{children}</span>
)

const ConditionalWrapper = ({children, condition}: {children: React.ReactNode; condition: boolean}) => {
  return condition ? <strong>{children}</strong> : <>{children}</>
}

const DataAttributeWrapper = ({children}: {children: React.ReactNode}) => (
  <span data-testid="wrapper" className="custom-wrapper">
    {children}
  </span>
)

export const WrappedBreadcrumbItemsWithOverflow = () => (
  <Breadcrumbs overflow="menu">
    <StyledWrapper>
      <Breadcrumbs.Item href="#">Wrapped Home</Breadcrumbs.Item>
    </StyledWrapper>
    <ConditionalWrapper condition={false}>
      <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    </ConditionalWrapper>
    <DataAttributeWrapper>
      <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    </DataAttributeWrapper>
    <StyledWrapper>
      <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    </StyledWrapper>
    <ConditionalWrapper condition={true}>
      <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    </ConditionalWrapper>
    <DataAttributeWrapper>
      <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    </DataAttributeWrapper>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const WithEditableNameInput = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Documents</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Project Alpha</Breadcrumbs.Item>
    <Breadcrumbs.Item>
      <TextInput
        defaultValue="Untitled Document"
        size="small"
        className={classes.EditableTextInput}
        aria-label="Edit document name"
      />
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

/**
 * Demonstrates using `responsive={false}` to disable automatic overflow behavior.
 * All items are rendered as-is without any overflow menu, regardless of container width.
 */
export const ResponsiveFalse = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
    <div>
      <h4 style={{margin: '0 0 8px 0'}}>With responsive=false (no overflow menu)</h4>
      <div style={{width: '300px', border: '1px solid #ccc', padding: '8px'}}>
        <Breadcrumbs responsive={false} overflow="menu">
          <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" selected>
            Current Page
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
    </div>

    <div>
      <h4 style={{margin: '0 0 8px 0'}}>With responsive=true (default, shows overflow menu)</h4>
      <div style={{width: '300px', border: '1px solid #ccc', padding: '8px'}}>
        <Breadcrumbs responsive={true} overflow="menu">
          <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" selected>
            Current Page
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
    </div>
  </div>
)

/**
 * Demonstrates using the `useBreadcrumbsResponsive` hook for manual control.
 * This enables SSR-friendly conditional rendering patterns.
 */
export const UseBreadcrumbsResponsiveHook = () => {
  const children = [
    <Breadcrumbs.Item key="home" href="#">
      Home
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="category" href="#">
      Category
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="subcategory" href="#">
      Subcategory
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="product" href="#">
      Product
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="details" href="#">
      Details
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="specifications" href="#">
      Specifications
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="reviews" href="#" selected>
      Reviews
    </Breadcrumbs.Item>,
  ]

  const {visibleItems, menuItems, showRoot, rootItem, containerRef} = useBreadcrumbsResponsive({
    children,
    overflow: 'menu-with-root',
  })

  // This is a simplified example - in real usage, you would use the hook
  // to conditionally render different layouts for mobile vs desktop

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Hook return values:</h4>
        <pre style={{background: '#f6f8fa', padding: '12px', borderRadius: '6px', fontSize: '12px'}}>
          {JSON.stringify(
            {
              visibleItemsCount: visibleItems.length,
              menuItemsCount: menuItems.length,
              showRoot,
              hasRootItem: !!rootItem,
              hasContainerRef: !!containerRef,
            },
            null,
            2,
          )}
        </pre>
      </div>

      <div>
        <h4 style={{margin: '0 0 8px 0'}}>Manual rendering using hook data:</h4>
        <nav
          ref={containerRef as React.RefObject<HTMLElement>}
          aria-label="Breadcrumbs"
          className={overflowClasses.BreadcrumbsBase}
          data-overflow="menu-with-root"
        >
          <ol className={overflowClasses.BreadcrumbsList}>
            {showRoot && rootItem && (
              <li className={overflowClasses.BreadcrumbsItem}>
                {rootItem}
                <ItemSeparator />
              </li>
            )}
            {menuItems.length > 0 && (
              <li className={overflowClasses.BreadcrumbsItem}>
                <BreadcrumbsOverflowMenu items={menuItems} aria-label={`${menuItems.length} more items`} />
                <ItemSeparator />
              </li>
            )}
            {visibleItems.map((item, index) => (
              <li key={index} className={overflowClasses.BreadcrumbsItem}>
                {item}
                <ItemSeparator />
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div style={{fontSize: '12px', color: '#57606a'}}>
        <p>
          The <code>useBreadcrumbsResponsive</code> hook allows you to get the computed visible/menu items and manually
          render the breadcrumbs. This is useful for SSR scenarios where you want to conditionally render different
          versions for mobile and desktop.
        </p>
      </div>
    </div>
  )
}

// Helper component for stories
const ItemSeparator = () => (
  <span className={overflowClasses.ItemSeparator}>
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" fill="currentcolor" />
    </svg>
  </span>
)

/**
 * Demonstrates using the BreadcrumbsOverflowMenu component standalone.
 */
export const StandaloneBreadcrumbsOverflowMenu = () => {
  const items = [
    <Breadcrumbs.Item key="1" href="#">
      Home
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="2" href="#">
      Products
    </Breadcrumbs.Item>,
    <Breadcrumbs.Item key="3" href="#">
      Category
    </Breadcrumbs.Item>,
  ]

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <h4 style={{margin: 0}}>BreadcrumbsOverflowMenu as a standalone component:</h4>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        <span>Click the menu:</span>
        <BreadcrumbsOverflowMenu items={items} aria-label="3 hidden breadcrumb items" />
      </div>
      <p style={{fontSize: '12px', color: '#57606a', margin: 0}}>
        The <code>BreadcrumbsOverflowMenu</code> component can be used standalone when building custom breadcrumb
        layouts with the <code>useBreadcrumbsResponsive</code> hook.
      </p>
    </div>
  )
}
