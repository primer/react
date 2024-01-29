import React, {useState} from 'react'
import ToggleSwitch, {ToggleSwitchProps} from './ToggleSwitch'
import {Box, Text} from '..'
import {action} from '@storybook/addon-actions'
import ToggleSwitchStoryWrapper from './ToggleSwitchStoryWrapper'
import {StoryFn} from '@storybook/react'

export default {
  title: 'Components/ToggleSwitch/Features',
}

export const Small = () => (
  <ToggleSwitchStoryWrapper>
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch size="small" aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
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
  <ToggleSwitchStoryWrapper>
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch disabled aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const Checked = () => (
  <ToggleSwitchStoryWrapper>
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch checked aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const CheckedDisabled = () => (
  <ToggleSwitchStoryWrapper>
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch checked disabled aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const Loading = () => (
  <ToggleSwitchStoryWrapper>
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch loading aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

type LoadingWithDelayProps = {
  loadingDelay: number
}

export const LoadingWithDelay: StoryFn<ToggleSwitchProps & LoadingWithDelayProps> = args => {
  const {loadingDelay, loadingLabelDelay} = args

  const [isLoading, setIsLoading] = useState(false)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  const handleToggleClick = () => {
    setIsLoading(true)

    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setTimeoutId(setTimeout(() => setIsLoading(false), loadingDelay) as unknown as number)
  }

  return (
    <ToggleSwitchStoryWrapper>
      <Text id="toggle" fontWeight={'bold'} fontSize={1}>
        Toggle label
      </Text>
      <ToggleSwitch
        loading={isLoading}
        loadingLabelDelay={loadingLabelDelay}
        aria-labelledby="toggle"
        onClick={handleToggleClick}
      />
    </ToggleSwitchStoryWrapper>
  )
}

LoadingWithDelay.args = {
  loadingDelay: 5000,
  loadingLabelDelay: 2000,
}
LoadingWithDelay.argTypes = {
  loadingDelay: {
    control: {
      type: 'number',
    },
  },
  loadingLabelDelay: {
    control: {
      type: 'number',
    },
  },
}

export const LabelEnd = () => (
  <ToggleSwitchStoryWrapper>
    <Text id="toggle" fontWeight={'bold'} fontSize={1}>
      Toggle label
    </Text>
    <ToggleSwitch statusLabelPosition="end" aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
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
