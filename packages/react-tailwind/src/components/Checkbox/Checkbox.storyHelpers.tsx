import React from 'react'
import {FormControl} from '../FormControl'
import {Checkbox, type CheckboxProps} from './Checkbox'

interface CheckboxFieldProps extends Omit<CheckboxProps, 'aria-describedby' | 'className' | 'id'> {
  caption?: React.ReactNode
  label?: React.ReactNode
  leadingVisual?: React.ReactNode
  visuallyHidden?: boolean
}

export function CheckboxField({
  caption,
  label = 'Default label',
  leadingVisual,
  visuallyHidden,
  ...checkboxProps
}: CheckboxFieldProps) {
  const id = React.useId()
  const captionId = caption ? `${id}-caption` : undefined

  return (
    <FormControl layout="horizontal">
      <Checkbox
        {...checkboxProps}
        aria-describedby={captionId}
        className="mt-0.5"
        id={id}
        value={checkboxProps.value ?? 'default'}
      />
      {leadingVisual ? (
        <FormControl.LeadingVisual className="self-center text-default">{leadingVisual}</FormControl.LeadingVisual>
      ) : null}
      <div className="min-w-0">
        {/* eslint-disable-next-line primer-react/direct-slot-children -- The wrapper groups the horizontal label and caption. */}
        <FormControl.Label
          className={checkboxProps.disabled ? 'font-normal text-disabled' : 'font-normal'}
          htmlFor={id}
          visuallyHidden={visuallyHidden}
        >
          {label}
        </FormControl.Label>
        {/* eslint-disable-next-line primer-react/direct-slot-children -- The wrapper groups the horizontal label and caption. */}
        {caption ? <FormControl.Caption id={captionId}>{caption}</FormControl.Caption> : null}
      </div>
    </FormControl>
  )
}
