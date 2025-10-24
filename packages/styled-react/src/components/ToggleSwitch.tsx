import {ToggleSwitch as PrimerToggleSwitch, type ToggleSwitchProps as PrimerToggleSwitchProps} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {StyledProps} from '../styled-props'

type ToggleSwitchProps = PrimerToggleSwitchProps & Omit<StyledProps, keyof PrimerToggleSwitchProps>

const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(function ToggleSwitch(props, ref) {
  return <Box {...props} as={PrimerToggleSwitch} ref={ref} />
})

export {ToggleSwitch, type ToggleSwitchProps}
