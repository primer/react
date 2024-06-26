import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import theme from '../../theme'
import {ActionList} from '../../deprecated/ActionList'
import {behavesAsComponent, checkExports} from '../../utils/testing'
import {BaseStyles, ThemeProvider} from '../..'

function SimpleActionList(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <ActionList
          items={[
            {text: 'New file'},
            ActionList.Divider,
            {text: 'Copy link'},
            {text: 'Edit file'},
            {text: 'Delete file', variant: 'danger'},
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
    toRender: () => <ActionList items={[]} />,
  })

  checkExports('deprecated/ActionList', {
    default: undefined,
    ActionList,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionList />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })
})

describe('ActionList.Item', () => {
  behavesAsComponent({
    Component: ActionList.Item,
  })
})
