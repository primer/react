import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Breadcrumbs} from './Breadcrumbs'

const meta = {
  title: 'React Tailwind/Navigation/Breadcrumbs/Features',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>
export default meta

type Story = StoryObj<typeof meta>

const items = ['Home', 'Products', 'Category', 'Subcategory', 'Item', 'Details', 'Current Page'].map((item, index) => (
  <Breadcrumbs.Item key={item} href="#" selected={index === 6}>
    {item}
  </Breadcrumbs.Item>
))
const render = (overflow: 'menu' | 'menu-with-root' | 'wrap', spacious = false) => (
  <Breadcrumbs overflow={overflow} variant={spacious ? 'spacious' : 'normal'}>
    {items}
  </Breadcrumbs>
)

export const OverflowWrap: Story = {render: () => render('wrap')}
export const OverflowMenu: Story = {
  render: () => render('menu'),
}
export const OverflowMenuOpen: Story = {
  render: () => render('menu'),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('button', {name: /more breadcrumb items/})
    await userEvent.click(trigger)
    await expect(await within(document.body).findByRole('menuitem', {name: 'Home'})).toBeVisible()
  },
}
export const OverflowMenuWithRoot: Story = {
  render: () => (
    <Breadcrumbs overflow="menu-with-root">
      <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">collaboration-workflows-flex</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        global-navigation-reviewers
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
export const SpaciousVariantWithOverflowMenu: Story = {render: () => render('menu', true)}
export const SpaciousVariantWithOverflowWrap: Story = {render: () => render('wrap', true)}
export const TwoItemsWithOverflowMenu: Story = {
  render: () => (
    <Breadcrumbs overflow="menu">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
export const TwoItemsWithOverflowMenuWithRoot: Story = {
  render: () => (
    <Breadcrumbs overflow="menu-with-root">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
