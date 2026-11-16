'use client'

import {Checkbox as BaseCheckbox} from '@base-ui/react/checkbox'
import React from 'react'
import {mergeClassName} from '../../internal/mergeClassName'
import {CheckboxGlyph, checkboxClassName, checkboxGlyphRevealClassName} from '../../internal/selectionVisuals'
import {cn} from '../../internal/cn'
import {markFormControlInput} from '../../internal/formControlParts'
import {useFormControlChoiceForwardedProps} from '../FormControl/useFormControlForwardedProps'

export interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseCheckbox.Root.Props['className']
}

/** A styled checkbox primitive. Pair with a native label or FormControl.Label. */
export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox({className, ...rest}, ref) {
  const forwardedProps = useFormControlChoiceForwardedProps(rest)

  return (
    <BaseCheckbox.Root
      {...forwardedProps}
      ref={ref}
      data-component="Checkbox"
      className={mergeClassName(checkboxClassName, className)}
    >
      <BaseCheckbox.Indicator
        className={cn(
          'primer:flex primer:[clip-path:inset(0)] primer:motion-safe:delay-80 primer:data-[starting-style]:[clip-path:inset(var(--base-size-16)_0_0_0)] primer:data-[ending-style]:[clip-path:inset(var(--base-size-16)_0_0_0)] primer:motion-safe:data-[ending-style]:delay-0',
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

markFormControlInput(Checkbox, {baseUiAccessibleLabel: true})
