import {render as HTMLRender} from '@testing-library/react'
import React from 'react'
import theme from '../theme'
import {ActionList} from '.'
import {BaseStyles, ThemeProvider, ActionMenu} from '..'
import {behavesAsComponent} from '../utils/testing'

describe('ActionList.Heading', () => {
  behavesAsComponent({
    Component: ActionList.Heading,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionList.Heading as="h1" />,
  })

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
    const spy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    expect(() =>
      HTMLRender(
        <ThemeProvider theme={theme}>
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
          </BaseStyles>
        </ThemeProvider>,
      ),
    ).toThrow(
      "ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.",
    )
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
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
