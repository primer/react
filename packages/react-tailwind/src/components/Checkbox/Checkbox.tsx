'use client'

import {Checkbox as BaseCheckbox} from '@base-ui/react/checkbox'
import React from 'react'
import {mergeClassName} from '../../internal/mergeClassName'
import {CheckboxGlyph, checkboxClassName, checkboxGlyphRevealClassName} from '../../internal/selectionVisuals'
import {cn} from '../../internal/cn'
import {useFormControlForwardedProps} from '../FormControl/useFormControlForwardedProps'

export interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseCheckbox.Root.Props['className']
}

/** A styled checkbox primitive. Pair with a native label or FormControl.Label. */
export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox({className, ...rest}, ref) {
  const forwardedProps = useFormControlForwardedProps(rest)

  return (
    <BaseCheckbox.Root
      {...forwardedProps}
      ref={ref}
      data-component="Checkbox"
      className={mergeClassName(checkboxClassName, className)}
    >
      <BaseCheckbox.Indicator
        className={cn(
          'flex [clip-path:inset(0)] motion-safe:delay-80 data-[starting-style]:[clip-path:inset(var(--base-size-16)_0_0_0)] data-[ending-style]:[clip-path:inset(var(--base-size-16)_0_0_0)] motion-safe:data-[ending-style]:delay-0',
          checkboxGlyphRevealClassName,
        )}
        render={(props, state) => (
          <span {...props}>
            <CheckboxGlyph indeterminate={state.indeterminate} />
          </span>
        )}
      />
    </BaseCheckbox.Root>
  )
})

Checkbox.displayName = 'Checkbox'
