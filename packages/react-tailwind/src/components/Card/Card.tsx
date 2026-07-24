import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const card = cva('relative grid gap-4 overflow-hidden border-thin border-default bg-default shadow-sm', {
  variants: {
    padding: {none: 'p-0', condensed: 'p-3', normal: 'p-4'},
    borderRadius: {medium: 'rounded-md', large: 'rounded-lg'},
    layout: {default: '', compact: 'flex items-start gap-3'},
  },
  defaultVariants: {padding: 'normal', borderRadius: 'large', layout: 'default'},
})
const CardContext = React.createContext<{titleId?: string; layout: 'default' | 'compact'}>({layout: 'default'})
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section'
  padding?: 'none' | 'condensed' | 'normal'
  borderRadius?: 'medium' | 'large'
  layout?: 'default' | 'compact'
}
export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  {as: Component = 'div', borderRadius = 'large', className, layout = 'default', padding = 'normal', ...rest},
  ref,
) {
  const titleId = React.useId()
  return (
    <CardContext.Provider value={{titleId: Component === 'section' ? titleId : undefined, layout}}>
      <Component
        {...rest}
        ref={ref as React.Ref<never>}
        className={cn(card({padding, borderRadius, layout}), className)}
        data-border-radius={borderRadius}
        data-component="Card"
        data-layout={layout}
        data-padding={padding}
      />
    </CardContext.Provider>
  )
})
export interface CardIconProps {
  icon: React.ElementType
  'aria-label'?: string
  className?: string
}
export function CardIcon({icon: Icon, className, 'aria-label': ariaLabel}: CardIconProps) {
  const {layout} = React.useContext(CardContext)
  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(
        'flex shrink-0 items-center text-muted',
        layout === 'default' && 'size-8 justify-center rounded-md bg-muted',
        className,
      )}
      data-component="Card.Icon"
      role={ariaLabel ? 'img' : undefined}
    >
      <Icon />
    </span>
  )
}
export interface CardImageProps extends React.ComponentPropsWithoutRef<'img'> {
  src: string
}
export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(function CardImage(
  {alt = '', className, ...rest},
  ref,
) {
  return (
    <img {...rest} ref={ref} alt={alt} className={cn('block h-auto w-full', className)} data-component="Card.Image" />
  )
})
export interface CardHeadingProps extends React.ComponentPropsWithoutRef<'h3'> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
export const CardHeading = React.forwardRef<HTMLHeadingElement, CardHeadingProps>(function CardHeading(
  {as: Heading = 'h3', className, id, ...rest},
  ref,
) {
  const {layout, titleId} = React.useContext(CardContext)
  return (
    <Heading
      {...rest}
      ref={ref}
      className={cn(
        'm-0 font-semibold text-default',
        layout === 'compact' ? 'relative -top-1 text-base' : 'text-lg',
        className,
      )}
      data-component="Card.Heading"
      id={id ?? titleId}
    />
  )
})
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  function CardDescription({className, ...rest}, ref) {
    return (
      <p {...rest} ref={ref} className={cn('m-0 text-base text-muted', className)} data-component="Card.Description" />
    )
  },
)
export function CardAction({children}: React.PropsWithChildren) {
  return (
    <div className="absolute right-4 top-4 z-1" data-component="Card.Action">
      {children}
    </div>
  )
}
export const CardMetadata = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function CardMetadata({className, ...rest}, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn('flex items-center gap-2 text-sm text-muted', className)}
        data-component="Card.Metadata"
      />
    )
  },
)
