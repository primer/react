import React, {MouseEventHandler, useCallback, useEffect} from 'react'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import {Box, Spinner, Text} from '.'
import {get} from './constants'
import {useProvidedStateOrCreate} from './hooks'
import sx, {BetterSystemStyleObject, SxProp} from './sx'
import VisuallyHidden from './_VisuallyHidden'
import {useTheme} from './ThemeProvider'

const TRANSITION_DURATION = '80ms'
const EASE_OUT_QUAD_CURVE = 'cubic-bezier(0.5, 1, 0.89, 1)'

type SwitchProps = {
  /** The id of the DOM node that describes the switch */
  ['aria-describedby']?: string
  /** The id of the DOM node that labels the switch */
  ['aria-labelledby']: string
  /** Uncontrolled - whether the switch is turned on */
  defaultOn?: boolean
  /** Whether the switch is ready for user input */
  disabled?: boolean
  /** Whether the switch's value is being calculated */
  isLoading?: boolean
  /** Whether the switch is turned on */
  on?: boolean
  /** The callback that is called when the switch is toggled on or off */
  onChange?: (on: boolean) => void
  /** The callback that is called when the switch is clicked */
  onClick?: MouseEventHandler
  /** Size of the switch */
  size?: 'small' | 'medium'
  /** Whether the "on" and "off" labels should appear before or after the switch.
   * **This should only be changed when the switch's alignment needs to be adjusted.** For example: It needs to be left-aligned because the label appears above it and the caption appears below it.
   */
  statusLabelPosition?: 'start' | 'end'
} & SxProp

const sizeVariants = variant({
  prop: 'size',
  variants: {
    small: {
      height: '24px',
      width: '48px'
    }
  }
})

type SwitchButtonProps = {
  disabled?: boolean
  on: boolean
  size?: SwitchProps['size']
  isHighContrast: boolean
} & SxProp

type InnerIconProps = {size?: SwitchProps['size']}

const CircleIcon: React.FC<InnerIconProps> = ({size}) => (
  <svg
    width={size === 'small' ? '12' : '16'}
    height={size === 'small' ? '12' : '16'}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" d="M8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
  </svg>
)
const LineIcon: React.FC<InnerIconProps> = ({size}) => (
  <svg
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
  border: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  appearance: none;
  text-decoration: none;
  padding: 0;
  transition-property: ${props => (props.disabled ? 'none' : 'background-color, border-color')};
  transition-duration: ${TRANSITION_DURATION};
  transition-timing-function: ${EASE_OUT_QUAD_CURVE};
  background: ${props => {
    if (props.disabled && props.on) {
      return get('colors.canvas.subtle')
    }

    return props.on ? get('colors.accent.subtle') : get('colors.canvas.default')
  }};
  border-radius: 6px;
  display: block;
  height: 32px;
  width: 64px;
  position: relative;
  outline-offset: 1px;

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

  &:after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }

  ${props => {
    if (!props.isHighContrast) {
      return css`
        &:after {
          border-style: solid;
          border-width: 1px;
          border-color: ${props.on && !props.disabled ? get('colors.accent.fg') : get('colors.border.subtle')};
          opacity: ${props.disabled ? '0.5' : props.on ? '0.2' : '1'};
        }
      `
    } else {
      return css`
        border-style: solid;
        border-color: ${props.on && !props.disabled ? get('colors.accent.fg') : get('colors.border.subtle')};
        border-width: 1px;
        outline-offset: 2px;

        .Toggle-knob {
          left: -1px;
          top: -1px;
          bottom: -1px;
          transform: translateX(${props.on ? 'calc(100% + 1px)' : '0'});
        }
      `
    }
  }}

  ${props => {
    if (!props.disabled) {
      if (props.on) {
        return css`
          &:hover,
          &:focus:focus-visible {
            :after {
              background-color: ${get('colors.accent.muted')};
              opacity: 0.2;
            }
          }

          &:active,
          &:active:focus-visible {
            :after {
              background-color: ${get('colors.accent.muted')};
              opacity: 0.5;
            }
          }
        `
      } else {
        return css`
          &:hover,
          &:focus:focus-visible {
            .Toggle-knob {
              background-color: ${get('colors.btn.hoverBg')};
              border-color: ${get('colors.border.default')};
            }
          }

          &:active,
          &:active:focus-visible {
            .Toggle-knob {
              background-color: ${get('colors.btn.activeBg')};
            }
          }
        `
      }
    }
  }}

  &:disabled {
    cursor: not-allowed;
  }

  ${sx}
  ${sizeVariants}
`

const hiddenTextStyles: BetterSystemStyleObject = {
  visibility: 'hidden',
  height: 0
}

const Switch: React.FC<SwitchProps> = ({
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  defaultOn,
  disabled,
  isLoading,
  on: onProp,
  onChange,
  onClick,
  size,
  statusLabelPosition,
  sx: sxProp
}) => {
  const isControlled = typeof defaultOn === 'undefined' && typeof onProp !== 'undefined'
  const {theme, colorScheme} = useTheme()
  const [onState, setOnState] = useProvidedStateOrCreate<boolean>(onProp, onChange, Boolean(defaultOn))
  const acceptsInteraction = !disabled && !isLoading
  const handleToggleClick: MouseEventHandler = useCallback(
    e => {
      if (!isControlled) {
        setOnState(!onState)
      }
      onClick && onClick(e)
    },
    [onClick, isControlled, onState, setOnState]
  )

  useEffect(() => {
    if (onChange && isControlled) {
      onChange(Boolean(onProp))
    }
  }, [onChange, onProp, isControlled])

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      flexDirection={statusLabelPosition === 'start' ? 'row' : 'row-reverse'}
      mb={4}
      sx={sxProp}
    >
      {isLoading ? <Spinner size="small" /> : null}
      <Text
        color={acceptsInteraction ? 'fg.default' : 'fg.muted'}
        fontSize={size === 'small' ? 0 : 1}
        mx={2}
        aria-hidden="true"
        sx={{position: 'relative'}}
      >
        <Box textAlign="right" sx={onState ? null : hiddenTextStyles}>
          On
        </Box>
        <Box textAlign="right" sx={onState ? hiddenTextStyles : null}>
          Off
        </Box>
      </Text>
      <SwitchButton
        onClick={handleToggleClick}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-checked={onState}
        aria-disabled={!acceptsInteraction}
        role="switch"
        on={onState}
        size={size}
        disabled={!acceptsInteraction}
        isHighContrast={Boolean(colorScheme?.includes('high_contrast'))}
      >
        <VisuallyHidden>{onState ? 'On' : 'Off'}</VisuallyHidden>
        <Box aria-hidden="true" display="flex" alignItems="center" width="100%" height="100%" overflow="hidden">
          <Box
            flexGrow={1}
            flexShrink={0}
            flexBasis="50%"
            color={acceptsInteraction ? 'accent.fg' : 'fg.subtle'}
            lineHeight="0"
            sx={{
              transform: `translateX(${onState ? '0' : '-100%'})`,
              transitionProperty: 'transform',
              transitionDuration: TRANSITION_DURATION,
              '> svg': {
                fill: 'currentcolor'
              }
            }}
          >
            <LineIcon size={size} />
          </Box>
          <Box
            flexGrow={1}
            flexShrink={0}
            flexBasis="50%"
            color={acceptsInteraction ? 'fg.default' : 'fg.subtle'}
            lineHeight="0"
            sx={{
              transform: `translateX(${onState ? '100%' : '0'})`,
              transitionProperty: 'transform',
              transitionDuration: TRANSITION_DURATION,
            }}
          >
            <CircleIcon size={size} />
          </Box>
        </Box>
        <Box
          aria-hidden="true"
          borderWidth="1"
          borderStyle="solid"
          backgroundColor={onState ? (acceptsInteraction ? 'accent.emphasis' : 'neutral.emphasis') : 'btn.bg'}
          borderColor={
            onState
              ? acceptsInteraction
                ? 'accent.emphasis'
                : 'neutral.emphasis'
              : acceptsInteraction
              ? 'border.default'
              : 'border.subtle'
          }
          borderRadius="6px"
          width="50%"
          position="absolute"
          top="0"
          bottom="0"
          zIndex={1}
          boxShadow={
            acceptsInteraction
              ? `${theme?.shadows.btn.shadow}, ${!onState && theme?.shadows.btn.insetShadow}`
              : undefined
          }
          className="Toggle-knob"
          sx={{
            transitionProperty: 'transform',
            transitionDuration: TRANSITION_DURATION,
            transitionTimingFunction: EASE_OUT_QUAD_CURVE,
            transform: `translateX(${onState ? '100%' : '0'})`
          }}
        />
      </SwitchButton>
    </Box>
  )
}

Switch.defaultProps = {
  statusLabelPosition: 'start',
  size: 'medium'
}

export default Switch
