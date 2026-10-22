import {page} from 'vitest/browser'
import {expect, it, describe} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import {ActionList} from '.'
import {implementsClassName} from '../utils/testing'
import classes from './ActionList.module.css'

describe('ActionList.Description', () => {
  implementsClassName(ActionList.Description, classes.Description)
  it('should render the description as inline without truncation by default', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1<ActionList.Description>Item 1 description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = page.getByText('Item 1 description', {exact: true})
    expect(description.element().tagName).toBe('SPAN')
    await expect.element(description).toHaveStyle('flex-basis: auto')
    await expect.element(description).not.toHaveStyle('overflow: ellipsis')
    await expect.element(description).not.toHaveStyle('white-space: nowrap')
  })
  it('should render the description as `Truncate` when truncate is true', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1<ActionList.Description truncate>Item 1 description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = page.getByText('Item 1 description', {exact: true})
    expect(description.element().tagName).toBe('DIV')
    // For button-semantic items, the native title is suppressed in favor of
    // a keyboard-accessible Tooltip rendered by the parent Item.
    await expect.element(description).toHaveAttribute('title', '')
    await expect.element(description).toHaveStyle('flex-basis: auto')
    await expect.element(description).toHaveStyle('text-overflow: ellipsis')
    await expect.element(description).toHaveStyle('overflow: hidden')
    await expect.element(description).toHaveStyle('white-space: nowrap')
  })
  it('should render the description in a new line when variant is block', () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1<ActionList.Description variant="block">Item 1 description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = page.getByText('Item 1 description', {exact: true})
    expect(description.element().tagName).toBe('SPAN')
    expect(description.element().parentElement?.parentElement).toHaveAttribute(
      'data-component',
      'ActionList.Item--DividerContainer',
    )
  })
  it('should support a custom `className`', () => {
    const Element = () => {
      return (
        <ActionList>
          <ActionList.Item>
            Item 1<ActionList.Description className="test-class-name">Item 1 description</ActionList.Description>
          </ActionList.Item>
        </ActionList>
      )
    }
    expect(
      HTMLRender(<Element />).container.querySelector('span[data-component="ActionList.Description"]'),
    ).toHaveClass('test-class-name')
  })
})
