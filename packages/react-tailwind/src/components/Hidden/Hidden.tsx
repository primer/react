import type {ComponentPropsWithoutRef} from 'react'
import {forwardRef} from 'react'
import {cn} from '../../internal/cn'

type Viewport = 'narrow' | 'regular' | 'wide'

const hiddenAtViewport: Record<Viewport, string> = {
  narrow: 'max-md:hidden',
  regular: 'md:max-lg:hidden',
  wide: 'lg:hidden',
}

export interface HiddenProps extends ComponentPropsWithoutRef<'div'> {
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
