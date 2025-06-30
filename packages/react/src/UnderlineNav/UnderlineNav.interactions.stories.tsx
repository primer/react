import type {Meta} from '@storybook/react-vite'
import {within, userEvent, expect} from 'storybook/test'
import {OverflowTemplate} from './UnderlineNav.features.stories'

export default {
  title: 'Components/UnderlineNav/Interactions',
} as Meta

const SelectAMenuItem = () => {
  return <OverflowTemplate initialSelectedIndex={1} />
}

const KeyboardNavigation = () => {
  return <OverflowTemplate initialSelectedIndex={1} />
}

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

KeyboardNavigation.storyName = 'Keyboard navigation'
KeyboardNavigation.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  canvasElement.style.width = '800px'

  await delay(1000)

  // Code
  const firstItem = canvas.getByRole('link', {name: 'Code'})
  firstItem.focus()

  // Issues
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Issues')

  // Pull Requests
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Pull Requests')

  // Discussions
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Discussions')

  // Actions
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Actions')

  // Projects
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Projects')

  // More
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('More')

  // Click to open menu
  await delay()
  userEvent.click(document.activeElement as Element)

  // Insights
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Insights')

  // Settings
  await delay()
  userEvent.tab()
  expect(document.activeElement).toHaveTextContent('Settings')

  // Click to navigate
  await delay()
  let menuItem = canvas.getByRole('link', {name: 'Settings (10)'})
  userEvent.click(menuItem)

  await delay()
  menuItem = canvas.getByRole('link', {name: 'Settings (10)'})

  const lastListItem = canvas.getByRole('list').children[5]
  const menuListItem = canvas.getByText('Settings').closest('li') as HTMLLIElement

  // expect Settings be the last element on the list.
  expect(lastListItem).toEqual(menuListItem)

  // Settings
  userEvent.tab({shift: true})

  // Actions
  await delay()
  userEvent.tab({shift: true})

  // Discussions
  await delay()
  userEvent.tab({shift: true})

  // Pull Requests
  await delay()
  userEvent.tab({shift: true})
  expect(document.activeElement).toHaveTextContent('Pull Requests')
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SelectAMenuItem.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  canvasElement.style.width = '800px'

  await delay(1000)

  const moreBtn = canvas.getByRole('button', {name: 'More Repository items'})
  userEvent.hover(moreBtn)

  await delay()
  userEvent.click(moreBtn)

  await delay()
  let menuItem = canvas.getByRole('link', {name: 'Settings (10)'})
  userEvent.click(menuItem)
  expect(moreBtn).toHaveFocus()

  await delay()
  menuItem = canvas.getByRole('link', {name: 'Settings (10)'})
  expect(menuItem).toHaveAttribute('aria-current', 'page')

  const lastListItem = canvas.getByRole('list').children[5]
  const menuListItem = canvas.getByText('Settings').closest('li') as HTMLLIElement
  // expect Settings be the last element on the list.
  expect(lastListItem).toEqual(menuListItem)
}

const KeepSelectedItemVisible = () => {
  return <OverflowTemplate initialSelectedIndex={7} />
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
KeepSelectedItemVisible.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  // await delay(2000)
  const selectedItem = canvas.getByRole('link', {name: 'Settings (10)'})
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
  await delay(1000)
  const lastListItem = canvas.getByRole('list').children[2].children[0]
  const menuListItem = canvas.getByRole('link', {name: 'Settings (10)'})
  // expect Settings be the last element on the list.
  expect(lastListItem).toEqual(menuListItem)
}

export {KeyboardNavigation, SelectAMenuItem, KeepSelectedItemVisible}
