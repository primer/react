import {Radio as BaseRadio} from '@base-ui/react/radio'
import React from 'react'
import {cn} from '../../internal/cn'

export interface RadioProps<Value = string>
  extends Omit<BaseRadio.Root.Props<Value>, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseRadio.Root.Props<Value>['className']
}

/** A styled radio primitive for use inside RadioGroup. */
export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio({className, ...rest}, ref) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseRadio.Root.State) =>
          cn(
            'inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-default bg-default shadow-resting-xs outline-none data-[checked]:border-accent-emphasis data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            className(state),
          )
      : cn(
          'inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-default bg-default shadow-resting-xs outline-none data-[checked]:border-accent-emphasis data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          className,
        )

  return (
    <BaseRadio.Root {...rest} ref={ref} data-component="Radio" className={mergedClassName}>
      <BaseRadio.Indicator className="size-2 rounded-full bg-accent-emphasis" />
    </BaseRadio.Root>
  )
})

Radio.displayName = 'Radio'
