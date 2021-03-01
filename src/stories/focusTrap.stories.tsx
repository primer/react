/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useEffect} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, BorderBox, Button} from '..'
import {useFocusTrap} from '../hooks/useFocusTrap'
import Flex from '../Flex'

export default {
  title: 'Hooks/useFocusTrap',
  decorators: [
    Story => {
      return (
        <BaseStyles>
          <Story />
        </BaseStyles>
      )
    }
  ]
} as Meta

export const FocusTrap = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerProps} = useFocusTrap({disabled: !trapEnabled})

  const spaceListener = React.useCallback(
    event => {
      if (event.key === ' ') {
        setTrapEnabled(!trapEnabled)
      }
    },
    [trapEnabled]
  )

  useEffect(() => {
    document.addEventListener('keypress', spaceListener)
    return () => {
      document.removeEventListener('keypress', spaceListener)
    }
  }, [spaceListener])

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Button>Apple</Button>
      <Button>Banana</Button>
      <Button>Cantaloupe</Button>
      <BorderBox {...containerProps} m={4} p={4}>
        <h3>Trap zone! Press SPACE to {trapEnabled ? "deactivate" : "activate"}.</h3>
        <Flex flexDirection="column" alignItems="flex-start">
          <Button>Durian</Button>
          <Button>Elderberry</Button>
          <Button>Fig</Button>
        </Flex>
      </BorderBox>
      <Button>Grapefruit</Button>
      <Button>Honeydew</Button>
      <Button>Jackfruit</Button>
    </Flex>
  )
}
