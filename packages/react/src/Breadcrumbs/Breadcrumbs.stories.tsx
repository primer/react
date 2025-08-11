import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const Default = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowWrap = () => (
  <Breadcrumbs overflow="wrap">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenu = () => (
  <Breadcrumbs overflow="menu">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuHideRoot = () => (
  <Breadcrumbs overflow="menu" hideRoot={true}>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuShowRoot = () => (
  <Breadcrumbs overflow="menu" hideRoot={false}>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuFewItems = () => (
  <Breadcrumbs overflow="menu">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuManyItems = () => (
  <Breadcrumbs overflow="menu">
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 1</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 2</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 3</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 4</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 5</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 6</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 7</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Level 8</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuLongWords = () => (
  <Breadcrumbs overflow="menu">
    <Breadcrumbs.Item href="#">SupercalifragilisticexpialidociousRepository</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">AnticonstitutionnellementConfiguration</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">PneumonoultramicroscopicsilicovolcanoconiosisDocumentation</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      HippopotomonstrosesquippedaliophobiaCurrentPage
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuLongWordsHideRoot = () => (
  <Breadcrumbs overflow="menu" hideRoot={true}>
    <Breadcrumbs.Item href="#">SupercalifragilisticexpialidociousRepository</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">AnticonstitutionnellementConfiguration</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">PneumonoultramicroscopicsilicovolcanoconiosisDocumentation</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      HippopotomonstrosesquippedaliophobiaCurrentPage
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuLongWordsShowRoot = () => (
  <Breadcrumbs overflow="menu" hideRoot={false}>
    <Breadcrumbs.Item href="#">SupercalifragilisticexpialidociousRepository</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">AnticonstitutionnellementConfiguration</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">PneumonoultramicroscopicsilicovolcanoconiosisDocumentation</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      HippopotomonstrosesquippedaliophobiaCurrentPage
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
