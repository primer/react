import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
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
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})

describe('ActionList.Item', () => {
  behavesAsComponent({
    Component: ActionList.Item
  })
})
