import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {forwardRef} from 'react'
import {cn} from '../../internal/cn'
import type {Viewport} from '../../utils/types'

// These are named Primer viewport ranges, not Tailwind's size breakpoints:
// narrow is below md (48rem), regular is md through below 2xl (87.5rem), and
// wide begins at 2xl. Keep the utilities literal so Tailwind can emit them.
const hiddenAtViewport: Record<Viewport, string> = {
  narrow: 'max-md:hidden',
  regular: 'md:max-2xl:hidden',
  wide: '2xl:hidden',
}

export interface HiddenProps extends Omit<ComponentPropsWithoutRef<'div'>, 'data-component'> {
  children: ReactNode
  when: Viewport | readonly Viewport[]
}

export const Hidden = forwardRef<HTMLDivElement, HiddenProps>(function Hidden({className, when, ...rest}, ref) {
  const viewports: readonly Viewport[] = typeof when === 'string' ? [when] : when

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        viewports.map(viewport => hiddenAtViewport[viewport]),
        className,
      )}
      data-component="Hidden"
    />
  )
})
