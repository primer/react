import {describe, it, expect, vi} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ActionList} from '.'

describe('ActionList', () => {
  it('should warn when selected is provided without a selectionVariant on parent', async () => {
    // we expect console.warn to be called, so we spy on that in the test
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => vi.fn())

    HTMLRender(
      <ActionList showDividers role="listbox" aria-label="Select a project">
        <ActionList.Item role="option" selected={true}>
          Primer React
        </ActionList.Item>
      </ActionList>,
    )

    expect(spy).toHaveBeenCalledWith(
      'Warning:',
      'For Item to be selected, ActionList or ActionList.Group should have a selectionVariant defined.',
    )

    spy.mockRestore()
  })

  it('should be navigatable with arrow keys for certain roles', async () => {
    HTMLRender(
      <ActionList role="listbox" aria-label="Select a project">
        <ActionList.Item role="option">Option 1</ActionList.Item>
        <ActionList.Item role="option">Option 2</ActionList.Item>
        <ActionList.Item role="option" disabled>
          Option 3
        </ActionList.Item>
        <ActionList.Item role="option">Option 4</ActionList.Item>
        <ActionList.Item role="option" inactiveText="Unavailable due to an outage">
          Option 5
        </ActionList.Item>
      </ActionList>,
    )

    await userEvent.tab() // tab into the story, this should focus on the first button
    expect(document.activeElement).toHaveTextContent('Option 1')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 2')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 3')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 4')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveAccessibleName('Option 5')
    expect(document.activeElement).toHaveAccessibleDescription('Unavailable due to an outage')

    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toHaveTextContent('Option 4')
  })

  it('should support a custom `className` on the outermost element', () => {
    const Element = () => {
      return (
        <ActionList className="test-class-name">
          <ActionList.Item>Item</ActionList.Item>
        </ActionList>
      )
    }
    expect(HTMLRender(<Element />).container.querySelector('ul')).toHaveClass('test-class-name')
  })

  it('divider should support a custom `className`', () => {
    const Element = () => {
      return (
        <ActionList>
          <ActionList.Item>Item</ActionList.Item>
          <ActionList.Divider className="test-class-name" />
        </ActionList>
      )
    }
    expect(HTMLRender(<Element />).container.querySelector('li[aria-hidden="true"]')).toHaveClass('test-class-name')
  })

  it('list and its sub-components support classname', () => {
    const {container} = HTMLRender(
      <ActionList className="list">
        <ActionList.Heading as="h2" className="heading">
          Heading
        </ActionList.Heading>
        <ActionList.Item className="item">
          Item
          <ActionList.TrailingAction label="action" className="trailing_action">
            Trailing Action
          </ActionList.TrailingAction>
        </ActionList.Item>
        <ActionList.Divider className="divider" />
        <ActionList.Item className="link" href="//github.com" title="anchor" aria-keyshortcuts="d">
          Link Item
        </ActionList.Item>
        <ActionList.Group className="group">
          <ActionList.GroupHeading as="h2" className="group_heading">
            Group Heading
          </ActionList.GroupHeading>
          <ActionList.Item className="item">
            <ActionList.TrailingVisual className="trailing">Trailing Visual</ActionList.TrailingVisual>
            <ActionList.LeadingVisual className="leading">Leading Visual</ActionList.LeadingVisual>
            <ActionList.Description className="description">Description</ActionList.Description>
          </ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    expect(container.querySelector('.list')).toBeInTheDocument()
    expect(container.querySelector('.heading')).toBeInTheDocument()
    expect(container.querySelector('.item')).toBeInTheDocument()
    expect(container.querySelector('.trailing_action')).toBeInTheDocument()
    expect(container.querySelector('.divider')).toBeInTheDocument()
    expect(container.querySelector('.link')).toBeInTheDocument()
    expect(container.querySelector('.group')).toBeInTheDocument()
    expect(container.querySelector('.group_heading')).toBeInTheDocument()
    expect(container.querySelector('.trailing')).toBeInTheDocument()
    expect(container.querySelector('.leading')).toBeInTheDocument()
    expect(container.querySelector('.description')).toBeInTheDocument()
  })

  it('should not be navigatable with arrow keys if `disableFocusZone` is true', async () => {
    const {container} = HTMLRender(
      <ActionList role="listbox" aria-label="Select a project" disableFocusZone={true}>
        <ActionList.Item role="option">Option 1</ActionList.Item>
        <ActionList.Item role="option">Option 2</ActionList.Item>
        <ActionList.Item role="option" disabled>
          Option 3
        </ActionList.Item>
        <ActionList.Item role="option">Option 4</ActionList.Item>
        <ActionList.Item role="option" inactiveText="Unavailable due to an outage">
          Option 5
        </ActionList.Item>
      </ActionList>,
    )

    await userEvent.tab() // tab into the story, this should focus on the first button
    expect(document.activeElement).toHaveTextContent('Option 1')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 1')

    expect(container.querySelector('li[aria-disabled="true"]')?.nextElementSibling).toHaveTextContent('Option 4')
    expect(container.querySelector('li[aria-disabled="true"]')?.nextElementSibling).toHaveAttribute('tabindex', '0')
  })

  it('sets title correctly for Description component', () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Option 1<ActionList.Description truncate>Simple string description</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
          Option 2
          <ActionList.Description truncate>
            <span>Complex</span> content
          </ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
          Option 3
          <ActionList.Description>
            <span>Non-truncated</span> content
          </ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const descriptions = container.querySelectorAll('[data-component="ActionList.Description"]')

    expect(descriptions[0]).toHaveAttribute('title', 'Simple string description')
    expect(descriptions[1]).toHaveAttribute('title', 'Complex content')
    expect(descriptions[2]).not.toHaveAttribute('title')
  })

  it('should support size prop on Item', () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item href="//github.com" size="large">
          Large Link Item
        </ActionList.Item>
        <ActionList.Item href="//github.com" size="medium">
          Medium Link Item
        </ActionList.Item>
        <ActionList.Item href="//github.com">Default Link Item</ActionList.Item>
      </ActionList>,
    )

    const linkElements = container.querySelectorAll('a')
    expect(linkElements[0]).toHaveAttribute('data-size', 'large')
    expect(linkElements[1]).toHaveAttribute('data-size', 'medium')
    expect(linkElements[2]).toHaveAttribute('data-size', 'medium') // default should be medium
  })
})
