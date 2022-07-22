import React, {ForwardedRef, forwardRef, useContext} from 'react'
import {SxProp} from '../sx'
import InputLabel from '../_InputLabel'
import {MarkdownEditorSlot} from './MarkdownEditor'
import {MarkdownEditorContext} from './MarkdownEditorContext'

type LabelProps = SxProp & {
  visuallyHidden?: boolean
  children: React.ReactNode
}

const Legend = forwardRef<HTMLLegendElement, LabelProps>(({sx, ...props}, ref) => {
  // using context and definining a Slot in the same component causes an infinite loop, so these must be separate
  const {disabled, required} = useContext(MarkdownEditorContext)

  return (
    <InputLabel
      as="legend"
      ref={ref as ForwardedRef<HTMLLabelElement>}
      disabled={disabled}
      required={required}
      {...props}
      sx={{cursor: 'default', mb: 1, ...sx}}
    />
  )
})

export const Label = forwardRef<HTMLLegendElement, LabelProps>(({...props}, ref) => (
  <MarkdownEditorSlot name="Label">
    <Legend ref={ref} {...props} />
  </MarkdownEditorSlot>
))
Label.displayName = 'MarkdownEditor.Label'
