import React from 'react'
import {Dialog, Box, Text} from '..'
import {COMMON, FLEX, LAYOUT} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {behavesAsComponent, checkExports} from '../utils/testing'
expect.extend(toHaveNoViolations)

const comp = (
  <Dialog isOpen onDismiss={() => null} aria-labelledby="header">
    <Dialog.Header id="header">Title</Dialog.Header>
    <Box p={3}>
      <Text fontFamily="sans-serif">Some content</Text>
    </Box>
  </Dialog>
)

describe('Dialog', () => {
  // because Dialog returns a React fragment the as and sx tests fail always, so they are skipped
  behavesAsComponent(Dialog, [COMMON, LAYOUT], () => comp, {skipAs: true, skipSx: true})

  checkExports('Dialog', {
    default: Dialog,
  })

  describe('Dialog.Header', () => {
    behavesAsComponent(Dialog.Header, [COMMON, FLEX, LAYOUT])
  })

  it('should have no axe violations', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    const {container} = HTMLRender(comp)
    // eslint-disable-next-line no-console
    console.warn.mockRestore()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
