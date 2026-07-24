import React from 'react'
import {cn} from '../../internal/cn'
import {type ButtonProps} from '../Button/Button'
import {buttonBaseClassName, buttonVariants} from '../Button/styles'
import {Spinner} from '../Spinner'

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'>,
    Pick<
      ButtonProps,
      'block' | 'leadingVisual' | 'loading' | 'loadingAnnouncement' | 'size' | 'trailingVisual' | 'variant'
    > {
  href: string
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  {
    block,
    children,
    className,
    href,
    leadingVisual,
    loading,
    loadingAnnouncement,
    onClick,
    size,
    trailingVisual,
    variant,
    ...anchorProps
  },
  ref,
) {
  const click = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <a
      {...anchorProps}
      ref={ref}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(buttonBaseClassName, buttonVariants({block, size, variant}), className)}
      data-component="LinkButton"
      href={href}
      onClick={click}
    >
      {loading ? <Spinner aria-hidden="true" size="small" srText={null} /> : leadingVisual}
      {children}
      {!loading && trailingVisual}
      {loading && <span className="sr-only">{loadingAnnouncement ?? 'Loading'}</span>}
    </a>
  )
})
