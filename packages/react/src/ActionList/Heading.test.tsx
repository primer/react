import {render as HTMLRender} from '@testing-library/react'
import React from 'react'
import theme from '../theme'
import {ActionList} from '.'
import {BaseStyles, ThemeProvider, ActionMenu} from '..'
import {FeatureFlags} from '../FeatureFlags'

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
    const Element = () => {
      return (
        <ActionList>
          <ActionList.Heading as="h2" className="test-class-name">
            Filter by
          </ActionList.Heading>
        </ActionList>
      )
    }
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(HTMLRender(<FeatureFlagElement />).container.querySelector('h2')).toHaveClass('test-class-name')
    expect(HTMLRender(<Element />).container.querySelector('h2')).toHaveClass('test-class-name')
  })
})
