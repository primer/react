import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../../theme'
import {ActionList} from '../../deprecated/ActionList'
import {behavesAsComponent, checkExports} from '../../utils/testing'
import {BaseStyles, ThemeProvider} from '../..'
expect.extend(toHaveNoViolations)

function SimpleActionList(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <ActionList
          role="listbox"
          aria-label="Select an item"
          items={[
            {text: 'New file', role: 'option'},
            ActionList.Divider,
            {text: 'Copy link', role: 'option'},
            {text: 'Edit file', role: 'option'},
            {text: 'Delete file', variant: 'danger', role: 'option'}
          ]}
        />
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('ActionList', () => {
  behavesAsComponent({
    Component: ActionList,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionList items={[]} />
  })

  checkExports('deprecated/ActionList', {
    default: undefined,
    ActionList
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionList />)
    /**
     * Axe is throwing an issue because there are <ul role="listbox"> without <li role="option"> as direct children
     * This is because we have a group structure inside the listbox:
     * <ul role="listbox">
     *  <li role="presentation">
     *    <ul role="group">
     *      <li role="option">Option 1</li>
     *    </ul>
     *  </li>
     * </ul>
     * We have consulted and agreed with our a11y consultant (@jscholes) about this solution.
     */
    const results = await axe(container, {
      rules: {
        'aria-required-parent': {enabled: false},
        'aria-required-children': {enabled: false}
      }
    })
    expect(results).toHaveNoViolations()
  })
})

describe('ActionList.Item', () => {
  behavesAsComponent({
    Component: ActionList.Item
  })
})
