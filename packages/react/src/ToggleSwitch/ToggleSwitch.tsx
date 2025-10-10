import type {MouseEventHandler} from 'react'
import React, {useCallback, useEffect} from 'react'
import {clsx} from 'clsx'
import Spinner from '../Spinner'
import {useProvidedStateOrCreate, useId} from '../hooks'
import VisuallyHidden from '../_VisuallyHidden'
import type {CellAlignment} from '../DataTable/column'
import {AriaStatus} from '../live-region'
import useSafeTimeout from '../hooks/useSafeTimeout'
import classes from './ToggleSwitch.module.css'

export interface ToggleSwitchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The id of the DOM node that labels the switch */
  ['aria-labelledby']: string
  /** Uncontrolled - whether the switch is turned on */
  defaultChecked?: boolean
  /** Whether the switch is ready for user input */
  disabled?: boolean
  /** Whether the switch's value is being calculated */
  loading?: boolean
  /** Whether the switch is turned on */
  checked?: boolean
  /** The callback that is called when the switch is toggled on or off */
  onChange?: (checked: boolean) => void
  /** The callback that is called when the switch is clicked */
  onClick?: MouseEventHandler
  /** Size of the switch */
  size?: 'small' | 'medium'
  /** Whether the "on" and "off" labels should appear before or after the switch.
   * **This should only be changed when the switch's alignment needs to be adjusted.** For example: It needs to be left-aligned because the label appears above it and the caption appears below it.
   */
  statusLabelPosition?: CellAlignment
  /**
   * If the switch is in the loading state, this value controls the amount of delay in milliseconds before
   * the `loadingLabel` is announced to screen readers.
   * @default 2000
   */
  loadingLabelDelay?: number
  /** The text to describe what is loading. It should be descriptive and not verbose.
   * This is primarily used for AT (screen readers) to convey what is currently loading.
   */
  loadingLabel?: string
  /** type of button to account for behavior when added to a form*/
  buttonType?: 'button' | 'submit' | 'reset'
  /** Text to display when the toggle switch is in the 'on' position. Defaults to 'On'. Only customize this label if there is a more specific label for the context. For example, you might use 'Show' if the setting is 'Show images'. */
  buttonLabelOn?: string
  /** Text to display when the toggle switch is in the 'off' position. Defaults to 'Off'. Only customize this label if there is a more specific label for the context. For example, you might use 'Hide' if the setting is 'Show images'. */
  buttonLabelOff?: string
}

type InnerIconProps = {size?: ToggleSwitchProps['size']}

const CircleIcon: React.FC<React.PropsWithChildren<InnerIconProps>> = ({size}) => (
  <svg
    aria-hidden="true"
    width={size === 'small' ? '12' : '16'}
    height={size === 'small' ? '12' : '16'}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" d="M8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
  </svg>
)

const LineIcon: React.FC<React.PropsWithChildren<InnerIconProps>> = ({size}) => (
  <svg
    aria-hidden="true"
    width={size === 'small' ? '12' : '16'}
    height={size === 'small' ? '12' : '16'}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 8 2Z" />
  </svg>
)

const ToggleSwitch = React.forwardRef<HTMLButtonElement, ToggleSwitchProps>(function ToggleSwitch(props, ref) {
  const {
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    defaultChecked,
    disabled,
    loading,
    checked,
    onChange,
    onClick,
    buttonType = 'button',
    size = 'medium',
    statusLabelPosition = 'start',
    loadingLabelDelay = 2000,
    loadingLabel = 'Loading',
    className,
    buttonLabelOn,
    buttonLabelOff,
    ...rest
  } = props
  const isControlled = typeof checked !== 'undefined'
  const [isOn, setIsOn] = useProvidedStateOrCreate<boolean>(checked, onChange, Boolean(defaultChecked))
  const acceptsInteraction = !disabled && !loading

  const [isLoadingLabelVisible, setIsLoadingLabelVisible] = React.useState(false)
  const loadingLabelId = useId('loadingLabel')

  const {safeSetTimeout} = useSafeTimeout()

  const handleToggleClick: MouseEventHandler = useCallback(
    e => {
      if (disabled || loading) return

      if (!isControlled) {
        setIsOn(!isOn)
      }
      onClick && onClick(e)
    },
    [disabled, isControlled, loading, onClick, setIsOn, isOn],
  )

  useEffect(() => {
    if (onChange && isControlled && !disabled) {
      onChange(Boolean(checked))
    }
  }, [onChange, checked, isControlled, disabled])

  useEffect(() => {
    if (!loading && isLoadingLabelVisible) {
      setIsLoadingLabelVisible(false)
    } else if (loading && !isLoadingLabelVisible) {
      safeSetTimeout(() => {
        setIsLoadingLabelVisible(true)
      }, loadingLabelDelay)
    }
  }, [loading, isLoadingLabelVisible, loadingLabelDelay, safeSetTimeout])

  let switchButtonDescribedBy = loadingLabelId
  if (ariaDescribedby) switchButtonDescribedBy = `${switchButtonDescribedBy} ${ariaDescribedby}`

  return (
    <div className={clsx(classes.ToggleSwitch, className)} data-status-label-position={statusLabelPosition} {...rest}>
      <VisuallyHidden>
        <AriaStatus announceOnShow id={loadingLabelId}>
          {isLoadingLabelVisible && loadingLabel}
        </AriaStatus>
      </VisuallyHidden>

      {loading ? (
        <div className={classes.LoadingSpinner} data-status-label-position={statusLabelPosition}>
          <Spinner size="small" srText={null} />
        </div>
      ) : null}

      <span
        className={classes.StatusText}
        data-size={size}
        data-disabled={!acceptsInteraction}
        aria-hidden="true"
        onClick={handleToggleClick}
      >
        <span className={classes.StatusTextItem} data-hidden={!isOn}>
          {buttonLabelOn ?? 'On'}
        </span>
        <span className={classes.StatusTextItem} data-hidden={isOn}>
          {buttonLabelOff ?? 'Off'}
        </span>
      </span>

      <button
        ref={ref}
        // eslint-disable-next-line react/button-has-type
        type={buttonType}
        className={classes.SwitchButton}
        data-size={size}
        data-checked={isOn}
        data-disabled={!acceptsInteraction}
        onClick={handleToggleClick}
        aria-labelledby={ariaLabelledby}
        aria-describedby={isLoadingLabelVisible || ariaDescribedby ? switchButtonDescribedBy : undefined}
        aria-pressed={isOn}
        aria-disabled={!acceptsInteraction}
      >
        <div className={classes.SwitchButtonContent} aria-hidden="true">
          <div
            className={`${classes.IconContainer} ${classes.LineIconContainer}`}
            data-checked={isOn}
            data-disabled={!acceptsInteraction}
          >
            <LineIcon size={size} />
          </div>
          <div
            className={`${classes.IconContainer} ${classes.CircleIconContainer}`}
            data-checked={isOn}
            data-disabled={!acceptsInteraction}
          >
            <CircleIcon size={size} />
          </div>
        </div>
        <div
          className={classes.ToggleKnob}
          data-checked={isOn}
          data-disabled={!acceptsInteraction}
          aria-hidden="true"
        />
      </button>
    </div>
  )
})

if (__DEV__) {
  ToggleSwitch.displayName = 'ToggleSwitch'
}

// @ts-ignore -- TS doesn't know about the __SLOT__ property
ToggleSwitch.__SLOT__ = Symbol('ToggleSwitch')

export default ToggleSwitch
