import React from 'react'
import {Meta} from '@storybook/react'
import {within, userEvent} from '@storybook/testing-library'
import {expect} from '@storybook/jest'
import {Template} from './features.stories'

export default {
  title: 'Drafts/Components/UnderlineNav/Interactions'
} as Meta

const SelectAMenuItem = () => {
  return <Template initialSelectedIndex={1} />
}

SelectAMenuItem.parameters = {
  viewport: {
    viewports: {
      narrowScreen: {
        name: 'Narrow Screen',
        styles: {
          width: '800px',
          height: '100%'
        }
      }
    },
    defaultViewport: 'narrowScreen'
  },
  // disables Chromatic's snapshotting on a story level - chromatic doesn't respect storybook viewport changes
  chromatic: {disableSnapshot: true}
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SelectAMenuItem.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(2000)
  const canvas = within(canvasElement)
  const firstItem = canvas.getByText('Code').closest('a') as HTMLAnchorElement
  firstItem.focus()
  await userEvent.keyboard('{ArrowRight}')
  await delay(500)
  await userEvent.keyboard('{ArrowRight}')
  await delay(500)
  await userEvent.keyboard('{ArrowRight}')
  await delay(500)
  await userEvent.keyboard('{ArrowRight}')
  await delay(500)
  await userEvent.keyboard('{ArrowRight}')
  await delay(500)
  await userEvent.keyboard('{ArrowRight}')
  await delay(500)
  // current focus element
  const activeElement = document.activeElement
  // check if the active element is the more button
  expect(activeElement).toHaveTextContent('More')
  // Open the more Menu
  activeElement && userEvent.click(activeElement)
  userEvent.keyboard('{ArrowDown}')
  await delay(500)
  userEvent.keyboard('{ArrowDown}')
  await delay(500)
  let menuItem = canvas.getByText('Settings').closest('a') as HTMLAnchorElement
  userEvent.click(menuItem)

  expect(activeElement).toHaveFocus()
  menuItem = canvas.getByText('Settings').closest('a') as HTMLAnchorElement

  expect(menuItem).toHaveAttribute('aria-current', 'page')
  const lastListItem = canvas.getByRole('list').children[5]
  const menuListItem = canvas.getByText('Settings').closest('li') as HTMLLIElement
  // expect Settings be the last element on the list.
  expect(lastListItem).toEqual(menuListItem)
}

const KeepSelectedItemVisible = () => {
  return <Template initialSelectedIndex={7} />
}

KeepSelectedItemVisible.parameters = {
  // disables Chromatic's snapshotting on a story level
  chromatic: {disableSnapshot: true}
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
KeepSelectedItemVisible.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const canvas = within(canvasElement)
  await delay(2000)
  const selectedItem = canvas.getByText('Settings').closest('a') as HTMLAnchorElement
  expect(selectedItem).toHaveAttribute('aria-current', 'page')
  // change viewport
  canvasElement.style.width = '900px'
  await delay(1000)
  expect(selectedItem).toHaveAttribute('aria-current', 'page')
  canvasElement.style.width = '800px'
  await delay(1000)
  expect(selectedItem).toHaveAttribute('aria-current', 'page')
  canvasElement.style.width = '700px'
  await delay(1000)
  expect(selectedItem).toHaveAttribute('aria-current', 'page')
  canvasElement.style.width = '600px'
  await delay(1000)
  expect(selectedItem).toHaveAttribute('aria-current', 'page')
  canvasElement.style.width = '500px'
}

export {SelectAMenuItem, KeepSelectedItemVisible}
