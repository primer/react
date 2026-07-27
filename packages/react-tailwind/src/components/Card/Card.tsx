'use client'

import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {isPartOf, resolveRegions} from '../../internal/regions'
import type {RegionProps} from '../../utils/types'

const card = cva(
  'relative overflow-hidden border border-default bg-default shadow-[var(--shadow-resting-small)] auto-rows-[max-content_auto]',
  {
    variants: {
      padding: {none: 'p-0', condensed: 'p-4', normal: 'p-6'},
      borderRadius: {medium: 'rounded-md', large: 'rounded-lg'},
      layout: {default: 'grid gap-4', compact: 'flex items-start gap-2'},
    },
    defaultVariants: {padding: 'normal', borderRadius: 'large', layout: 'default'},
    compoundVariants: [{layout: 'compact', padding: 'normal', class: 'p-4'}],
  },
)
const CardContext = React.createContext<{
  layout: 'default' | 'compact'
}>({layout: 'default'})
export interface CardProps
  extends React.HTMLAttributes<HTMLElement>,
    RegionProps<'icon' | 'image' | 'heading' | 'description' | 'metadata' | 'action'> {
  as?: 'div' | 'section'
  padding?: 'none' | 'condensed' | 'normal'
  borderRadius?: 'medium' | 'large'
  layout?: 'default' | 'compact'
  children?: React.ReactNode
}

function CardComponent(
  {
    action: actionProp,
    as: Component = 'div',
    borderRadius = 'large',
    children,
    className,
    description: descriptionProp,
    heading: headingProp,
    icon: iconProp,
    image: imageProp,
    layout = 'default',
    metadata: metadataProp,
    padding = 'normal',
    ...rest
  }: CardProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const generatedTitleId = React.useId()
  const {
    regions: {icon, image, heading, description, metadata, action},
    rest: customChildren,
  } = resolveRegions(
    children,
    {
      icon: {match: isPartOf(CardIcon)},
      image: {match: isPartOf(CardImage)},
      heading: {match: isPartOf(CardHeading)},
      description: {match: isPartOf(CardDescription)},
      metadata: {match: isPartOf(CardMetadata)},
      action: {match: isPartOf(CardAction)},
    },
    {
      icon: iconProp,
      image: imageProp,
      heading: headingProp,
      description: descriptionProp,
      metadata: metadataProp,
      action: actionProp,
    },
  )
  const hasSlotChildren = Boolean(icon || image || heading || description || metadata || action)

  if (!hasSlotChildren && customChildren.length === 0) return null

  const titleId =
    Component === 'section' && React.isValidElement<{id?: string}>(heading)
      ? (heading.props.id ?? generatedTitleId)
      : undefined
  const labelledHeading =
    titleId && React.isValidElement<{id?: string}>(heading) && !heading.props.id
      ? React.cloneElement(heading, {id: titleId})
      : heading
  const header = image || icon
  const content = hasSlotChildren ? (
    <>
      {header ? (
        <div
          className={cn(
            'block h-auto w-full',
            layout === 'compact' && 'w-auto shrink-0',
            image && padding === 'normal' && '-mx-6 -mt-6 w-[calc(100%+3rem)]',
            image && padding === 'condensed' && '-mx-4 -mt-4 w-[calc(100%+2rem)]',
          )}
        >
          {header}
        </div>
      ) : null}
      <div className={cn('grid gap-4', layout === 'compact' && 'flex-1')}>
        <div className="grid gap-2">
          {labelledHeading}
          {description}
          {customChildren}
        </div>
        {metadata ? <div className="flex items-center gap-4 text-sm leading-[21px] text-muted">{metadata}</div> : null}
      </div>
      {action ? <div className="absolute right-4 top-4 z-1">{action}</div> : null}
    </>
  ) : (
    children
  )

  return (
    <CardContext.Provider value={{layout}}>
      <Component
        {...rest}
        ref={ref as React.Ref<never>}
        className={cn(card({padding, borderRadius, layout}), className)}
        data-border-radius={borderRadius}
        data-component="Card"
        data-layout={layout}
        data-padding={padding}
        {...(titleId && !rest['aria-label'] && !rest['aria-labelledby'] ? {'aria-labelledby': titleId} : {})}
      >
        {content}
      </Component>
    </CardContext.Provider>
  )
}

export const Card = React.forwardRef(CardComponent)
Card.displayName = 'Card'

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
        'flex items-center justify-start text-muted',
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
  const {layout} = React.useContext(CardContext)
  return (
    <Heading
      {...rest}
      ref={ref}
      className={cn(
        'm-0 font-semibold text-default',
        layout === 'compact' ? 'relative -top-1 text-sm leading-[21px]' : 'text-[16px] leading-6',
        className,
      )}
      data-component="Card.Heading"
      id={id}
    />
  )
})
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  function CardDescription({className, ...rest}, ref) {
    return (
      <p
        {...rest}
        ref={ref}
        className={cn('m-0 text-sm leading-[21px] text-muted', className)}
        data-component="Card.Description"
      />
    )
  },
)
export function CardAction({children}: React.PropsWithChildren) {
  return <div data-component="Card.Action">{children}</div>
}
export const CardMetadata = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function CardMetadata({className, ...rest}, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn('flex items-center gap-2 text-xs leading-[19.5px]', className)}
        data-component="Card.Metadata"
      />
    )
  },
)
;('use client')
