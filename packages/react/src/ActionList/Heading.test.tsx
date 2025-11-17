import {describe, it, expect, vi} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import BaseStyles from '../BaseStyles'
import {ActionList} from '.'
import {ActionMenu} from '..'

describe('ActionList.Heading', () => {
  it('should render the ActionList.Heading component as a heading with the given heading level', async () => {
    const container = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
      </ActionList>,
    )
    const heading = container.getByRole('heading', {level: 1})
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Heading')
  })

  it('should label the action list with the heading id', async () => {
    const {container, getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )
    const list = container.querySelector('ul')
    const heading = getByRole('heading', {level: 1})
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
  })

  it('should throw an error when ActionList.Heading is used within ActionMenu context', async () => {
    expect(() =>
      HTMLRender(
        <BaseStyles>
          <ActionMenu open={true}>
            <ActionMenu.Button>Trigger</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Heading as="h1">Heading</ActionList.Heading>
                <ActionList.Item>Item</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </BaseStyles>,
      ),
    ).toThrow(
      "ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.",
    )
  })

  it('should support a custom `className` on the outermost element', () => {
    const actionList = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h2" className="test-class-name">
          Filter by
        </ActionList.Heading>
      </ActionList>,
    )
    expect(actionList.container.querySelector('h2')).toHaveClass('test-class-name')
  })
})
