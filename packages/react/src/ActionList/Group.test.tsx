import {describe, it, expect, vi} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import BaseStyles from '../BaseStyles'
import {ActionList} from '.'
import {ActionMenu} from '..'

describe('ActionList.Group', () => {
  it('should throw an error when ActionList.GroupHeading has an `as` prop when it is used within ActionMenu context', async () => {
    expect(() =>
      HTMLRender(
        <BaseStyles>
          <ActionMenu open={true}>
            <ActionMenu.Button>Trigger</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Group>
                  <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
                </ActionList.Group>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </BaseStyles>,
      ),
    ).toThrow(
      "Looks like you are trying to set a heading level to a menu role. Group headings for menu type action lists are for representational purposes, and rendered as divs. Therefore they don't need a heading level.",
    )
  })

  it('should render the ActionList.GroupHeading component as a heading with the given heading level', async () => {
    const container = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const heading = container.getByRole('heading', {level: 2})
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Group Heading')
  })
  it('should throw an error if ActionList.GroupHeading is used without an `as` prop when no role is specified (for list role)', async () => {
    expect(() =>
      HTMLRender(
        <ActionList>
          <ActionList.Heading as="h1">Heading</ActionList.Heading>
          <ActionList.Group>
            <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
          </ActionList.Group>
        </ActionList>,
      ),
    ).toThrow(
      "You are setting a heading for a list, that requires a heading level. Please use 'as' prop to set a proper heading level.",
    )
  })
  it('should render the ActionList.GroupHeading component as a span (not a heading tag) when role is specified as listbox', async () => {
    const container = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const label = container.getByText('Group Heading')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toEqual('SPAN')
  })
  it('should render the ActionList.GroupHeading component as a span with role="presentation" and aria-hidden="true" when role is specified as listbox', async () => {
    const container = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const label = container.getByText('Group Heading')
    const wrapper = label.parentElement
    expect(wrapper).toHaveAttribute('role', 'presentation')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })
  it('should label the list with the group heading id', async () => {
    const {container, getByText} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = getByText('Group Heading')
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
  })
  it('should NOT label the list with the group heading id when role is specified', async () => {
    const {container, getByText} = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = getByText('Group Heading')
    expect(list).not.toHaveAttribute('aria-labelledby', heading.id)
  })

  it('should label the list with aria-label if it is specified', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group aria-label="Animals" data-test-id="ActionList.Group">
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    expect(list).toHaveAttribute('aria-label', 'Animals')
  })

  it('should support a custom `className` on the outermost element', () => {
    const Element = () => {
      return (
        <ActionList>
          <ActionList.Group>
            <ActionList.GroupHeading as="h2" className="test-class-name">
              Test
            </ActionList.GroupHeading>
          </ActionList.Group>
        </ActionList>
      )
    }
    expect(HTMLRender(<Element />).container.querySelector('h2')).toHaveClass('test-class-name')
  })
})
