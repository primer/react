import React, {useState} from 'react'
import {useSafeTimeout} from '..'
import ToggleSwitch from './ToggleSwitch'
import {action} from 'storybook/actions'
import ToggleSwitchStoryWrapper from './ToggleSwitchStoryWrapper'
import {clsx} from 'clsx'
import styles from './ToggleSwitch.features.stories.module.css'

export default {
  title: 'Components/ToggleSwitch/Features',
}

export const Small = () => (
  <ToggleSwitchStoryWrapper>
    <span id="toggle" className={styles.ToggleLabel}>
      Toggle label
    </span>
    <ToggleSwitch size="small" aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const WithCaption = () => (
  <div className={styles.Row}>
    <div className={styles.ColGrow}>
      <span className={styles.SwitchLabel} id="switchLabel">
        Notifications
      </span>
      <span className={styles.SwitchCaption} id="switchCaption">
        Notifications will be delivered via email and the GitHub notification center
      </span>
    </div>
    <ToggleSwitch aria-labelledby="switchLabel" aria-describedby="switchCaption" />
  </div>
)

export const Disabled = () => (
  <ToggleSwitchStoryWrapper>
    <span id="toggle" className={styles.ToggleLabel}>
      Toggle label
    </span>
    <ToggleSwitch disabled aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const Checked = () => (
  <ToggleSwitchStoryWrapper>
    <span id="toggle" className={styles.ToggleLabel}>
      Toggle label
    </span>
    <ToggleSwitch checked aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const CheckedDisabled = () => (
  <ToggleSwitchStoryWrapper>
    <span id="toggle" className={styles.ToggleLabel}>
      Toggle label
    </span>
    <ToggleSwitch checked disabled aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

export const Loading = () => (
  <ToggleSwitchStoryWrapper>
    <span id="toggle" className={styles.ToggleLabel}>
      Toggle label
    </span>
    <ToggleSwitch loading aria-labelledby="toggle" />
  </ToggleSwitchStoryWrapper>
)

type LoadingWithDelayProps = {
  loadingDelay: number
  loadingLabelDelay: number
}

export const LoadingWithDelay = (args: LoadingWithDelayProps) => {
  const {loadingDelay, loadingLabelDelay} = args

  const [isLoading, setIsLoading] = useState(false)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)
  const [toggleState, setToggleState] = useState(false)

  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()

  const handleToggleClick = () => {
    setIsLoading(true)

    if (timeoutId) {
      safeClearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setTimeoutId(safeSetTimeout(() => setIsLoading(false), loadingDelay) as unknown as number)
  }

  return (
    <ToggleSwitchStoryWrapper>
      <span id="toggle" style={{fontWeight: 'bold', fontSize: 'var(--base-size-14)'}}>
        Enable feature
      </span>
      <ToggleSwitch
        loading={isLoading}
        loadingLabel={`${toggleState ? 'Enabling' : 'Disabling'} feature`}
        loadingLabelDelay={loadingLabelDelay}
        aria-labelledby="toggle"
        onClick={handleToggleClick}
        onChange={(on: boolean) => setToggleState(on)}
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
    <span id="toggle" className={styles.ToggleLabel}>
      Toggle label
    </span>
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
      <div className={styles.Row} style={{maxWidth: '300px'}}>
        <span className={clsx(styles.ColGrow, styles.SwitchLabel)} id="switchLabel">
          Notifications
        </span>
        <ToggleSwitch onClick={onClick} onChange={handleSwitchChange} checked={isOn} aria-labelledby="switchLabel" />
      </div>
      <p>The switch is {isOn ? 'on' : 'off'}</p>
    </>
  )
}
