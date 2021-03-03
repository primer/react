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
      <BorderBox ref={containerProps.ref as React.RefObject<HTMLDivElement>} m={4} p={4}>
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

export const MultipleFocusTraps = () => {
  const [trapEnabled1, setTrapEnabled1] = React.useState(false)
  const [trapEnabled2, setTrapEnabled2] = React.useState(false)
  const {containerProps: containerProps1} = useFocusTrap({disabled: !trapEnabled1})
  const {containerProps: containerProps2} = useFocusTrap({disabled: !trapEnabled2})

  const keyListener = React.useCallback(
    event => {
      if (event.key === '1') {
        setTrapEnabled1(!trapEnabled1)
      }
      if (event.key === '2') {
        setTrapEnabled2(!trapEnabled2)
      }
    },
    [trapEnabled1, trapEnabled2]
  )

  useEffect(() => {
    document.addEventListener('keypress', keyListener)
    return () => {
      document.removeEventListener('keypress', keyListener)
    }
  }, [keyListener])

  return (

    <Flex flexDirection="column" alignItems="flex-start">
      <Button>Apple</Button>
      <Button>Banana</Button>
      <Button>Cantaloupe</Button>
      <BorderBox ref={containerProps1.ref as React.RefObject<HTMLDivElement>} m={4} p={4}>
        <h3>Trap zone! Press SPACE to {trapEnabled1 ? "deactivate" : "activate"}.</h3>
        <Flex flexDirection="column" alignItems="flex-start">
          <Button>Durian</Button>
          <Button>Elderberry</Button>
          <Button>Fig</Button>
        </Flex>
      </BorderBox>
      <Button>Grapefruit</Button>
      <Button>Honeydew</Button>
      <Button>Jackfruit</Button>
      <BorderBox ref={containerProps2.ref as React.RefObject<HTMLDivElement>} m={4} p={4}>
        <h3>Trap zone! Press SPACE to {trapEnabled2 ? "deactivate" : "activate"}.</h3>
        <Flex flexDirection="column" alignItems="flex-start">
          <Button>Kiwi</Button>
          <Button>Lemon</Button>
          <Button>Mango</Button>
        </Flex>
      </BorderBox>
      <Button>Nectarine</Button>
      <Button>Orange</Button>
      <Button>Peach</Button>
    </Flex>
  )
}