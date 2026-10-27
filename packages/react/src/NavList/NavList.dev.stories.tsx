import type {Meta} from '@storybook/react-vite'
import {within, userEvent} from 'storybook/test'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'
import {ArrowRightIcon, ArrowLeftIcon, BookIcon, FileDirectoryIcon} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Components/NavList/Dev',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export const WithBadExampleOfSubNavAndTrailingAction = () => {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item>
            <NavList.LeadingVisual>
              <FileDirectoryIcon />
            </NavList.LeadingVisual>
            Item 1
            <NavList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
          </NavList.Item>
          <NavList.Item>
            Item 2
            <NavList.TrailingAction as="a" href="#" label="Some action" icon={ArrowRightIcon} />
          </NavList.Item>
          <NavList.Item>
            Item 3
            <NavList.TrailingAction label="This is not supported and should not render!!!!!" icon={BookIcon} />
            <NavList.SubNav>
              <NavList.Item href="#">
                Sub item 1
                <NavList.TrailingAction label="Another action" icon={BookIcon} />
              </NavList.Item>
            </NavList.SubNav>
          </NavList.Item>
        </NavList>
      </PageLayout.Pane>
    </PageLayout>
  )
}

WithBadExampleOfSubNavAndTrailingAction.storyName = 'With SubNav and Trailing Action (Bad example, do not copy)'

export default meta

export const WithGroupTitleAndHeading = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Group title="Group 1">
          <NavList.GroupHeading>Hello</NavList.GroupHeading>
          <NavList.Item aria-current="true" href="#">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#">Item 1B</NavList.Item>
          <NavList.Item href="#">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Group 2">
          <NavList.Item href="#">Item 2A</NavList.Item>
          <NavList.Item href="#">Item 2B</NavList.Item>
          <NavList.Item href="#">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

/**
 * A collapsed parent item whose sub-nav contains the current item shows an
 * active indicator. NavList auto-expands sub-navs that contain the current
 * item, so the play function collapses it to surface the collapsed-parent
 * active styling for visual regression coverage. This exercises the CSS that
 * replaced `:has(~ .SubGroup [data-active])` with the parent's `data-active`.
 */
export const CollapsedSubNavWithCurrentItem = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item>
          Item with current sub-item
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Current sub-item
            </NavList.Item>
            <NavList.Item href="#">Other sub-item</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

CollapsedSubNavWithCurrentItem.storyName = 'Collapsed SubNav With Current Item'
CollapsedSubNavWithCurrentItem.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const parentButton = await canvas.findByRole('button', {name: /Item with current sub-item/i})
  await userEvent.click(parentButton)
}
