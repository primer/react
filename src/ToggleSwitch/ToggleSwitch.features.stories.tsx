import React from 'react'
import ToggleSwitch from './ToggleSwitch'
import {Box, Text} from '..'
import {action} from '@storybook/addon-actions'

export default {
  title: 'Components/ToggleSwitch/Features',
}

export const Small = () => (
  <Box
    display="grid"
    gridTemplateColumns="max-content auto"
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch size="small" aria-labelledby="toggle" />
  </Box>
)

export const WithCaption = () => (
  <Box display="flex" alignItems={'start'}>
    <Box flexGrow={1}>
      <Text fontSize={2} fontWeight="bold" id="switchLabel" display="block">
        Notifications
      </Text>
      <Text color="fg.subtle" fontSize={1} id="switchCaption" display="block">
        Notifications will be delivered via email and the GitHub notification center
      </Text>
    </Box>
    <ToggleSwitch aria-labelledby="switchLabel" aria-describedby="switchCaption" />
  </Box>
)

export const Disabled = () => (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch disabled aria-labelledby="toggle" />
  </Box>
)

export const Checked = () => (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch checked aria-labelledby="toggle" />
  </Box>
)

export const CheckedDisabled = () => (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch checked disabled aria-labelledby="toggle" />
  </Box>
)

export const Loading = () => (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch loading aria-labelledby="toggle" />
  </Box>
)

export const LabelEnd = () => (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch statusLabelPosition="end" aria-labelledby="toggle" />
  </Box>
)

export const Controlled = () => {
  const [isOn, setIsOn] = React.useState(false)

  const onClick = React.useCallback(() => {
    setIsOn(!isOn)
  }, [setIsOn, isOn])

  const handleSwitchChange = (on: boolean) => {
    action(`new switch "on" state: ${on}`)
  }

  return (
    <>
      <Box display="flex" maxWidth="300px">
        <Box flexGrow={1} fontSize={2} fontWeight="bold" id="switchLabel">
          Notifications
        </Box>
        <ToggleSwitch onClick={onClick} onChange={handleSwitchChange} checked={isOn} aria-labelledby="switchLabel" />
      </Box>
      <p>The switch is {isOn ? 'on' : 'off'}</p>
    </>
  )
}
