import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import Button from '../NewButton'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider, SSRProvider} from '..'
expect.extend(toHaveNoViolations)

function SimpleButton(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          <Button onClick={alert('start')}>Default</Button>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('Button', () => {
  behavesAsComponent({
    Component: Button,
    options: {skipSx: true},
    toRender: () => <Button />
  })

  checkExports('NewButton', {
    default: Button
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleButton />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
