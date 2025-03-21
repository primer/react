import {render as HTMLRender} from '@testing-library/react'
import React from 'react'
import {ActionList} from '.'

describe('ActionList.Description', () => {
  it('should render the description as inline without truncation by default', () => {
    const {getByText} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1<ActionList.Description>Item 1 description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = getByText('Item 1 description')
    expect(description.tagName).toBe('SPAN')
    expect(description).toHaveStyleRule('flex-basis', 'auto')
    expect(description).not.toHaveStyleRule('overflow', 'ellipsis')
    expect(description).not.toHaveStyleRule('white-space', 'nowrap')
  })
  it('should render the description as `Truncate` when truncate is true', () => {
    const {getByText} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1<ActionList.Description truncate>Item 1 description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = getByText('Item 1 description')
    expect(description.tagName).toBe('DIV')
    expect(description).toHaveAttribute('title', 'Item 1 description')
    expect(description).toHaveStyleRule('flex-basis', '0')
    expect(description).toHaveStyleRule('text-overflow', 'ellipsis')
    expect(description).toHaveStyleRule('overflow', 'hidden')
    expect(description).toHaveStyleRule('white-space', 'nowrap')
  })
  it('should render the description in a new line when variant is block', () => {
    const {getByText} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1<ActionList.Description variant="block">Item 1 description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = getByText('Item 1 description')
    expect(description.tagName).toBe('SPAN')
    expect(description.parentElement).toHaveAttribute('data-component', 'ActionList.Item--DividerContainer')
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
