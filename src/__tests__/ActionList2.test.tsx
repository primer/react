import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionList} from '../ActionList2'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider} from '..'
expect.extend(toHaveNoViolations)

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
        </ActionList>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('ActionList', () => {
  behavesAsComponent({
    Component: ActionList,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionList />
  })

  checkExports('ActionList', {
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
