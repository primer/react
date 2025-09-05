import Breadcrumbs from '.'

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
        sx={{
          minWidth: '120px',
          maxWidth: '180px',
          fontSize: 'inherit',
          border: '1px dashed var(--borderColor-muted)',
          '&:focus': {
            border: '1px solid var(--borderColor-accent-emphasis)',
          },
        }}
        aria-label="Edit document name"
      />
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
