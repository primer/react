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
            'inline-flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border border-[var(--control-borderColor-emphasis)] bg-default shadow-resting-xs outline-none data-[checked]:border-2 data-[checked]:border-[var(--control-checked-bgColor-rest)] data-[checked]:bg-[var(--control-checked-fgColor-rest)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--control-borderColor-disabled)] data-[disabled]:bg-[var(--control-bgColor-disabled)] data-[disabled]:opacity-100 data-[checked]:data-[disabled]:border-[var(--control-checked-bgColor-disabled)] data-[checked]:data-[disabled]:bg-[var(--control-checked-fgColor-disabled)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            className(state),
          )
      : cn(
          'inline-flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border border-[var(--control-borderColor-emphasis)] bg-default shadow-resting-xs outline-none data-[checked]:border-2 data-[checked]:border-[var(--control-checked-bgColor-rest)] data-[checked]:bg-[var(--control-checked-fgColor-rest)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--control-borderColor-disabled)] data-[disabled]:bg-[var(--control-bgColor-disabled)] data-[disabled]:opacity-100 data-[checked]:data-[disabled]:border-[var(--control-checked-bgColor-disabled)] data-[checked]:data-[disabled]:bg-[var(--control-checked-fgColor-disabled)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          className,
        )

  return (
    <BaseRadio.Root {...rest} ref={ref} data-component="Radio" className={mergedClassName}>
      <BaseRadio.Indicator className="hidden" />
    </BaseRadio.Root>
  )
})

Radio.displayName = 'Radio'
