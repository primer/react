import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {SelectPanel} from './SelectPanel'

export default {
  title: 'Components/SelectPanel/Composition',
  component: SelectPanel.Root,
} satisfies Meta<typeof SelectPanel.Root>

type Story = StoryObj<typeof SelectPanel.Root>

export const CustomLayout: Story = {
  render: () => (
    <SelectPanel.Root selectionMode="multiple">
      <SelectPanel.Trigger>Choose fruit</SelectPanel.Trigger>
      <SelectPanel.Overlay>
        <SelectPanel.Content>
          <SelectPanel.Header>
            <SelectPanel.Title as="h2">Fruit</SelectPanel.Title>
            <SelectPanel.CloseButton />
          </SelectPanel.Header>
          <SelectPanel.Description>Choose your favorites.</SelectPanel.Description>
          <SelectPanel.SearchInput aria-label="Filter fruit" />
          <SelectPanel.List>
            <SelectPanel.Item value="apple">Apple</SelectPanel.Item>
            <SelectPanel.Item value="orange">Orange</SelectPanel.Item>
          </SelectPanel.List>
          <SelectPanel.Footer>Selections stay open until you close the panel.</SelectPanel.Footer>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Choose fruit'}))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('option', {name: 'Apple'}))
    await expect(body.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(body.getByRole('button', {name: 'Close'}))
    await expect(canvas.getByRole('button', {name: 'Choose fruit'})).toHaveAttribute('aria-expanded', 'false')
  },
}

export const RovingFocus: Story = {
  render: () => (
    <SelectPanel.Root focusStrategy="roving">
      <SelectPanel.Trigger>Choose a color</SelectPanel.Trigger>
      <SelectPanel.Overlay overlayProps={{'aria-label': 'Colors'}}>
        <SelectPanel.CloseButton />
        <SelectPanel.SearchInput aria-label="Filter colors" />
        <SelectPanel.List aria-label="Colors">
          <SelectPanel.Item value="red">Red</SelectPanel.Item>
          <SelectPanel.Item value="blue">Blue</SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  ),
}
