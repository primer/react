import {type SxProp, Text as PrimerText, type TextProps as PrimerTextProps, Box} from '@primer/react'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes} from 'react'

type TextProps = PrimerTextProps & SxProp

const Text: ForwardRefExoticComponent<TextProps & RefAttributes<HTMLSpanElement>> = forwardRef<
  HTMLSpanElement,
  TextProps
>((props, ref) => {
  return <Box as={PrimerText} ref={ref} {...props} />
})

export {Text, type TextProps}
