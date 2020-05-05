import React from 'react'
import Dialog from '../Dialog'
import Box from '../Box'
import Text from '../Text'
import {COMMON, FLEX, LAYOUT} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {behavesAsComponent} from '../utils/testing'
expect.extend(toHaveNoViolations)

const comp = (
  <Dialog isOpen onDismiss={() => null}>
    <Dialog.Header>Title</Dialog.Header>
    <Box p={3}>
      <Text fontFamily="sans-serif">Some content</Text>
    </Box>
  </Dialog>
)

describe('Dialog', () => {
  // @reach/dialog does a bunch of stuff with the DOM,
  // making the standard suite of tests very hard to implement
  //
  // behavesAsComponent(Dialog, [COMMON, LAYOUT], () => comp)

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
