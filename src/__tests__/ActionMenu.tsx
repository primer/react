import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionMenu} from '../ActionMenu'
import {COMMON} from '../constants'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {ThemeProvider} from 'styled-components'
import {BaseStyles} from '..'
import getRandomValues from 'get-random-values'

expect.extend(toHaveNoViolations)

function SimpleActionMenu(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <ActionMenu
          items={[
            {text: 'New file'},
            ActionMenu.Divider,
            {text: 'Copy link'},
            {text: 'Edit file'},
            {text: 'Delete file', variant: 'danger'}
          ]}
        />
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('ActionMenu', () => {
  behavesAsComponent({Component: ActionMenu, systemPropArray: [COMMON], options: {skipAs: true, skipSx: true}})

  checkExports('ActionMenu', {
    default: undefined,
    ActionMenu
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
