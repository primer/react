'use client'

import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {isPartOf, resolveRegions} from '../../internal/regions'
import type {RegionProps} from '../../utils/types'

const card = cva(
  'primer:relative primer:overflow-hidden primer:border-thin primer:border-default primer:bg-default primer:shadow-[var(--shadow-resting-small)] primer:auto-rows-[max-content_auto]',
  {
    variants: {
      padding: {none: 'primer:p-0', condensed: 'primer:p-4', normal: 'primer:p-6'},
      borderRadius: {medium: 'primer:rounded-md', large: 'primer:rounded-lg'},
      layout: {default: 'primer:grid primer:gap-4', compact: 'primer:flex primer:items-start primer:gap-2'},
    },
    defaultVariants: {padding: 'normal', borderRadius: 'large', layout: 'default'},
    compoundVariants: [{layout: 'compact', padding: 'normal', class: 'primer:p-4'}],
  },
)
const CardContext = React.createContext<{
  layout: 'default' | 'compact'
}>({layout: 'default'})
export interface CardProps
  extends React.HTMLAttributes<HTMLElement>,
    RegionProps<'icon' | 'image' | 'heading' | 'description' | 'metadata' | 'action'> {
  /** Element to render. Use `section` when the card is a labelled region of the page. */
  as?: 'div' | 'section'
  /** Inner spacing of the card. */
  padding?: 'none' | 'condensed' | 'normal'
  /** Corner radius of the card. */
  borderRadius?: 'medium' | 'large'
  /** Use `compact` to lay the card out in a row rather than stacked. */
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
            'primer:block primer:h-auto primer:w-full',
            layout === 'compact' && 'primer:w-auto primer:shrink-0',
            image && padding === 'normal' && 'primer:-mx-6 primer:-mt-6 primer:w-[calc(100%+3rem)]',
            image && padding === 'condensed' && 'primer:-mx-4 primer:-mt-4 primer:w-[calc(100%+2rem)]',
          )}
        >
          {header}
        </div>
      ) : null}
      <div className={cn('primer:grid primer:gap-4', layout === 'compact' && 'primer:flex-1')}>
        <div className="primer:grid primer:gap-2">
          {labelledHeading}
          {description}
          {customChildren}
        </div>
        {metadata ? (
          <div className="primer:flex primer:items-center primer:gap-4 primer:text-sm primer:leading-[21px] primer:text-muted">
            {metadata}
          </div>
        ) : null}
      </div>
      {action ? <div className="primer:absolute primer:right-4 primer:top-4 primer:z-1">{action}</div> : null}
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
  /** Icon component to render. */
  icon: React.ElementType
  /** Accessible name for the icon. Leave unset when the icon is decorative. */
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
        'primer:flex primer:items-center primer:justify-start primer:text-muted',
        layout === 'default' && 'primer:size-8 primer:justify-center primer:rounded-md primer:bg-muted',
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
  /** Source of the image. */
  src: string
}
export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(function CardImage(
  {alt = '', className, ...rest},
  ref,
) {
  return (
    <img
      {...rest}
      ref={ref}
      alt={alt}
      className={cn('primer:block primer:h-auto primer:w-full', className)}
      data-component="Card.Image"
    />
  )
})
export interface CardHeadingProps extends React.ComponentPropsWithoutRef<'h3'> {
  /** Heading element to render, so the card heading fits the surrounding document outline. */
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
        'primer:m-0 primer:font-semibold primer:text-default',
        layout === 'compact'
          ? 'primer:relative primer:-top-1 primer:text-sm primer:leading-[21px]'
          : 'primer:text-[16px] primer:leading-6',
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
        className={cn('primer:m-0 primer:text-sm primer:leading-[21px] primer:text-muted', className)}
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
        className={cn('primer:flex primer:items-center primer:gap-2 primer:text-xs primer:leading-[19.5px]', className)}
        data-component="Card.Metadata"
      />
    )
  },
)
