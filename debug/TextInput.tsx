import React, {forwardRef} from 'react'
import styled from 'styled-components'

// Props that are not passed through to Input:
type NonPassthroughProps = {
  className?: string
  icon?: React.ComponentType<{className?: string}>
}

const Input = styled.input``

// Note: using ComponentProps instead of ComponentPropsWithoutRef here would cause a type issue where `css` is a required prop.
type TextInputInternalProps = NonPassthroughProps &
  Omit<React.ComponentPropsWithoutRef<typeof Input>, keyof NonPassthroughProps>

// this has empty props - using TextInputInternalProps
export const TextInput1 = forwardRef<HTMLInputElement, TextInputInternalProps>((props, ref) => {
  return <Input ref={ref} {...props} />
})

// this has props - using NonPassthroughProps
export const TextInput2 = forwardRef<HTMLInputElement, NonPassthroughProps>((props, ref) => {
  return <Input ref={ref} {...props} />
})
