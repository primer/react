import React from 'react'
import Dialog from '../Dialog'
import Box from '../Box'
import Text from '../Text'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
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
  it('should have no axe violations', async () => {
    const {container} = HTMLRender(comp)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders consistently', () => {
    expect(comp).toMatchSnapshot()
  })
})
