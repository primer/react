import Breadcrumbs from '.'

export default {
  title: 'Components/Breadcrumbs/Dev',
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
