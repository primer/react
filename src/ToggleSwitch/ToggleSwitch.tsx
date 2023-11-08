import React, {MouseEventHandler, useCallback, useEffect} from 'react'
import {useId} from '../hooks/useId'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import Box from '../Box'
import Spinner from '../Spinner'
import Text from '../Text'
import {get} from '../constants'
import {useProvidedStateOrCreate} from '../hooks'
import sx, {BetterSystemStyleObject, SxProp} from '../sx'
import {CellAlignment} from '../DataTable/column'
import VisuallyHidden from '../_VisuallyHidden'

const TRANSITION_DURATION = '80ms'
const EASE_OUT_QUAD_CURVE = 'cubic-bezier(0.5, 1, 0.89, 1)'

export interface ToggleSwitchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, SxProp {
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
  /** If the switch is in the loading state, this value controls the amount of delay in milliseconds before
   * the word "Loading" is announced to screen readers. Default: 2000. */
  loadingLabelDelay?: number
}

const sizeVariants = variant({
  prop: 'size',
  variants: {
    small: {
      height: '24px',
      width: '48px',
    },
  },
})

type SwitchButtonProps = {
  disabled?: boolean
  checked?: boolean
  size?: ToggleSwitchProps['size']
} & SxProp

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

const SwitchButton = styled.button<SwitchButtonProps>`
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  appearance: none;
  text-decoration: none;
  padding: 0;
  transition-property: background-color, border-color;
  transition-duration: ${TRANSITION_DURATION};
  transition-timing-function: ${EASE_OUT_QUAD_CURVE};
  border-radius: ${get('radii.2')};
  border-style: solid;
  border-width: 1px;
  display: block;
  height: 32px;
  width: 64px;
  outline-offset: 3px;
  position: relative;
  overflow: hidden;

  @media (pointer: coarse) {
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      top: 50%;
      min-height: 44px;
    }
  }

  @media (prefers-reduced-motion) {
    transition: none;

    * {
      transition: none;
    }
  }

  &:hover,
  &:focus:focus-visible {
    background-color: ${get('colors.switchTrack.hoverBg')};
  }

  &:active,
  &:active:focus-visible {
    background-color: ${get('colors.switchTrack.activeBg')};
  }

  ${props => {
    if (props['aria-disabled']) {
      return css`
        @media (forced-colors: active) {
          border-color: GrayText;
        }

        background-color: ${get('colors.switchTrack.disabledBg')};
        border-color: transparent;
        cursor: not-allowed;
        transition-property: none;
      `
    }

    if (props.checked) {
      return css`
        background-color: ${get('colors.switchTrack.checked.bg')};
        border-color: transparent;

        &:hover,
        &:focus:focus-visible {
          background-color: ${get('colors.switchTrack.checked.hoverBg')};
        }

        &:active,
        &:active:focus-visible {
          background-color: ${get('colors.switchTrack.checked.activeBg')};
        }
      `
    } else {
      return css`
        background-color: ${get('colors.switchTrack.bg')};
        border-color: transparent;

        &:active {
          background-color: ${get('colors.switchTrack.activeBg')};
        }
      `
    }
  }}

  ${sx}
  ${sizeVariants}
`
const ToggleKnob = styled.div<{checked?: boolean}>`
  background-color: ${get('colors.switchKnob.bg')};
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props['aria-disabled'] ? get('colors.switchTrack.disabledBg') : get('colors.switchKnob.border')};
  border-radius: calc(${get('radii.2')} - 1px); /* -1px to account for 1px border around the control */
  width: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  transition-property: transform;
  transition-duration: ${TRANSITION_DURATION};
  transition-timing-function: ${EASE_OUT_QUAD_CURVE};
  transform: ${props => `translateX(${props.checked ? '100%' : '0px'})`};
  z-index: 1;

  @media (prefers-reduced-motion) {
    transition: none;
  }

  ${props => {
    if (props['aria-disabled']) {
      return css`
        @media (forced-colors: active) {
          color: GrayText;
        }

        border-color: ${get('colors.switchTrack.disabledBg')};
      `
    }

    if (props.checked) {
      return css`
        border-color: ${get('colors.switchKnob.checked.border')};
      `
    }
  }}
`

const hiddenTextStyles: BetterSystemStyleObject = {
  visibility: 'hidden',
  height: 0,
}

const ToggleSwitch = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ToggleSwitchProps>>(
  function ToggleSwitch(props, ref) {
    const {
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      defaultChecked,
      disabled,
      loading,
      checked,
      onChange,
      onClick,
      size = 'medium',
      statusLabelPosition = 'start',
      loadingLabelDelay = 2000,
      sx: sxProp,
      ...rest
    } = props
    const isControlled = typeof checked !== 'undefined'
    const [isOn, setIsOn] = useProvidedStateOrCreate<boolean>(checked, onChange, Boolean(defaultChecked))
    const acceptsInteraction = !disabled && !loading

    const [loadingLabelTimeoutId, setLoadingLabelTimeoutId] = React.useState<number | null>(null)
    const [isLoadingLabelVisible, setIsLoadingLabelVisible] = React.useState(false)
    const loadingLabelId = useId('loadingLabel')

    const resetLoadingLabel = useCallback(() => {
      if (loadingLabelTimeoutId) {
        clearTimeout(loadingLabelTimeoutId)
        setLoadingLabelTimeoutId(null)
      }

      if (isLoadingLabelVisible) {
        setIsLoadingLabelVisible(false)
      }
    }, [loadingLabelTimeoutId, isLoadingLabelVisible])

    const handleToggleClick: MouseEventHandler = useCallback(
      e => {
        if (disabled || loading) return

        if (!isControlled) {
          setIsOn(!isOn)
          resetLoadingLabel()
        }
        onClick && onClick(e)
      },
      [disabled, isControlled, loading, onClick, setIsOn, isOn, resetLoadingLabel],
    )

    useEffect(() => {
      if (onChange && isControlled && !disabled) {
        onChange(Boolean(checked))
      }
    }, [onChange, checked, isControlled, disabled])

    if (loading) {
      if (!loadingLabelTimeoutId) {
        setLoadingLabelTimeoutId(
          setTimeout(() => {
            setLoadingLabelTimeoutId(null)
            setIsLoadingLabelVisible(true)
          }, loadingLabelDelay) as unknown as number,
        )
      }
    } else {
      resetLoadingLabel()
    }

    return (
      <Box
        display="inline-flex"
        alignItems="center"
        flexDirection={statusLabelPosition === 'start' ? 'row' : 'row-reverse'}
        sx={sxProp}
        {...rest}
      >
        {isLoadingLabelVisible ? (
          <VisuallyHidden>
            <span aria-live="polite" id={loadingLabelId}>
              Loading
            </span>
          </VisuallyHidden>
        ) : null}
        {loading ? <Spinner size="small" /> : null}
        <Text
          color={acceptsInteraction ? 'fg.default' : 'fg.muted'}
          fontSize={size === 'small' ? 0 : 1}
          mx={2}
          aria-hidden="true"
          sx={{position: 'relative', cursor: 'pointer'}}
          onClick={handleToggleClick}
        >
          <Box textAlign="right" sx={isOn ? null : hiddenTextStyles}>
            On
          </Box>
          <Box textAlign="right" sx={isOn ? hiddenTextStyles : null}>
            Off
          </Box>
        </Text>
        <SwitchButton
          ref={ref}
          onClick={handleToggleClick}
          aria-labelledby={ariaLabelledby}
          aria-describedby={`${ariaDescribedby} ${loadingLabelId}`}
          aria-pressed={isOn}
          checked={isOn}
          size={size}
          aria-disabled={!acceptsInteraction}
        >
          <Box aria-hidden="true" display="flex" alignItems="center" width="100%" height="100%" overflow="hidden">
            <Box
              flexGrow={1}
              flexShrink={0}
              flexBasis="50%"
              color={acceptsInteraction ? 'switchTrack.checked.fg' : 'switchTrack.checked.disabledFg'}
              lineHeight="0"
              sx={{
                transform: `translateX(${isOn ? '0' : '-100%'})`,
                transitionProperty: 'transform',
                transitionDuration: TRANSITION_DURATION,
              }}
            >
              <LineIcon size={size} />
            </Box>
            <Box
              flexGrow={1}
              flexShrink={0}
              flexBasis="50%"
              color={acceptsInteraction ? 'switchTrack.fg' : 'switchTrack.disabledFg'}
              lineHeight="0"
              sx={{
                transform: `translateX(${isOn ? '100%' : '0'})`,
                transitionProperty: 'transform',
                transitionDuration: TRANSITION_DURATION,
              }}
            >
              <CircleIcon size={size} />
            </Box>
          </Box>
          <ToggleKnob aria-hidden="true" aria-disabled={!acceptsInteraction} checked={isOn} />
        </SwitchButton>
      </Box>
    )
  },
)

if (__DEV__) {
  ToggleSwitch.displayName = 'ToggleSwitch'
}

export default ToggleSwitch
