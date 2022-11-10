import React from 'react'
import {Meta} from '@storybook/react'
import {within, userEvent} from '@storybook/testing-library'
import {expect} from '@storybook/jest'
import {OverflowTemplate} from './features.stories'

export default {
  title: 'Drafts/Components/UnderlineNav/Interactions'
} as Meta

const SelectAMenuItem = () => {
  return <OverflowTemplate initialSelectedIndex={1} />
}

const KeyboardNavigation = () => {
  return <OverflowTemplate initialSelectedIndex={1} />
}

KeyboardNavigation.storyName = 'Keyboard navigation'
KeyboardNavigation.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(2000)
  canvasElement.style.width = '800px'
  const canvas = within(canvasElement)
  const firstItem = canvas.getByRole('link', {name: 'Code'})
  firstItem.focus()

  await userEvent.tab()
  await delay(500)
  await userEvent.tab()
  await delay(500)
  await userEvent.tab()
  await delay(500)
  await userEvent.tab()
  await delay(500)
  await userEvent.tab()
  await delay(500)
  await userEvent.tab()
  await delay(500)
  // current focus element
  let activeElement = document.activeElement
  // check if the active element is the more button
  expect(activeElement).toHaveTextContent('More')
  // Open the more Menu
  activeElement && userEvent.click(activeElement)
  await userEvent.tab()
  await delay(500)
  await userEvent.tab()
  await delay(500)
  let menuItem = canvas.getByRole('link', {name: 'Settings &nbsp;(10)'})
  userEvent.click(menuItem)

  expect(activeElement).toHaveFocus()
  menuItem = canvas.getByRole('link', {name: 'Settings &nbsp;(10)'})

  expect(menuItem).toHaveAttribute('aria-current', 'page')
  const lastListItem = canvas.getByRole('list').children[5]
  const menuListItem = canvas.getByText('Settings').closest('li') as HTMLLIElement
  // expect Settings be the last element on the list.
  expect(lastListItem).toEqual(menuListItem)
  userEvent.tab({shift: true})
  await delay(500)
  userEvent.tab({shift: true})
  await delay(500)
  userEvent.tab({shift: true})
  await delay(500)
  userEvent.tab({shift: true})
  await delay(500)
  // current focus element
  activeElement = document.activeElement
  userEvent.keyboard('{Enter}')
  expect(activeElement).toHaveTextContent('Pull Requests')
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SelectAMenuItem.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  canvasElement.style.width = '800px'
  await delay(2000)
  const canvas = within(canvasElement)
  const moreBtn = canvas.getByRole('button', {name: 'More Repository items'})
  userEvent.hover(moreBtn)
  await delay(1000)
  userEvent.click(moreBtn)

  await delay(1000)
  let menuItem = canvas.getByRole('link', {name: 'Settings &nbsp;(10)'})
  userEvent.click(menuItem)

  expect(moreBtn).toHaveFocus()
  menuItem = canvas.getByRole('link', {name: 'Settings &nbsp;(10)'})

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
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const canvas = within(canvasElement)
  // await delay(2000)
  const selectedItem = canvas.getByRole('link', {name: 'Settings &nbsp;(10)'})
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

export {KeyboardNavigation, SelectAMenuItem, KeepSelectedItemVisible}
