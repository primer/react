import {render as HTMLRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import React from 'react'
import theme from '../theme'
import {ActionList} from '.'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider} from '..'
import {FeatureFlags} from '../FeatureFlags'

function SimpleActionList(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <ActionList>
          <ActionList.Item>New file</ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item>Copy link</ActionList.Item>
          <ActionList.Item>Edit file</ActionList.Item>
          <ActionList.Item variant="danger">Delete file</ActionList.Item>
          <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="d">
            Link Item
          </ActionList.LinkItem>
        </ActionList>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('ActionList', () => {
  behavesAsComponent({
    Component: ActionList,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionList />,
  })

  checkExports('ActionList', {
    default: undefined,
    ActionList,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionList />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should throw when selected is provided without a selectionVariant on parent', async () => {
    // we expect console.error to be called, so we suppress that in the test
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    expect(() => {
      HTMLRender(
        <ActionList showDividers role="listbox" aria-label="Select a project">
          <ActionList.Item role="option" selected={true}>
            Primer React
          </ActionList.Item>
        </ActionList>,
      )
    }).toThrow('For Item to be selected, ActionList or ActionList.Group needs to have a selectionVariant defined')

    mockError.mockRestore()
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
    expect(document.activeElement).not.toHaveTextContent('Option 3') // option 3 is disabled
    expect(document.activeElement).toHaveTextContent('Option 4')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveAccessibleName('Unavailable due to an outage')

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
    expect(HTMLRender(<FeatureFlagElement />).container.querySelector('ul')).toHaveClass('test-class-name')
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
    expect(HTMLRender(<FeatureFlagElement />).container.querySelector('li[aria-hidden="true"]')).toHaveClass(
      'test-class-name',
    )
    expect(HTMLRender(<Element />).container.querySelector('li[aria-hidden="true"]')).toHaveClass('test-class-name')
  })
})
