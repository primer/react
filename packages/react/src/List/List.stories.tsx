import type {StoryObj} from '@storybook/react-vite'
import {List, Item, Label, Description} from '../List'
import './listbox-element'

export default {
  title: 'Components/List/Default',
}

export const Default = () => {
  return (
    <>
      <List>
        <Item>
          <Label>Item 1</Label>
        </Item>
        <Item>
          <Label>Item 2</Label>
        </Item>
        <Item>
          <Label>Item 3</Label>
        </Item>
      </List>
    </>
  )
}

export const WithDescription = () => {
  return (
    <>
      <List>
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
    </>
  )
}

export const WithBlockDescription = () => {
  return (
    <>
      <List layout="block">
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
    </>
  )
}

export const Selection = () => {
  return (
    <>
      <ui-listbox style={{display: 'grid'}}>
        <ui-option>Option 1</ui-option>
        <ui-option>Option 2</ui-option>
        <ui-option>Option 3</ui-option>
      </ui-listbox>
    </>
  )
}

export const Menu = () => {
  return 'TODO'
}

export const Tree = () => {
  return 'TODO'
}

export const ListStory: StoryObj = {
  name: 'List',
  render: () => 'TODO',
}

export const Group = () => {
  return 'hi'
}

export const Disabled = () => {
  return 'hi'
}

export const Async = () => {
  return 'hi'
}

export const Truncation = () => {
  return 'hi'
}
