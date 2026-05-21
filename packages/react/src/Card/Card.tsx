import {clsx} from 'clsx'
import React, {type ForwardedRef, createContext, forwardRef, useContext} from 'react'
import classes from './Card.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import {useId} from '../hooks/useId'

type CardContextValue = {titleId?: string}
const CardContext = createContext<CardContextValue>({})

type CardAs = 'div' | 'section'

export type CardProps<As extends CardAs = 'div'> = PolymorphicProps<
  As,
  'div',
  {
    /** Optional className for the root element. */
    className?: string

    /** Internal padding. @default 'normal' */
    padding?: 'none' | 'condensed' | 'normal'

    /** Border radius. @default 'large' */
    borderRadius?: 'medium' | 'large'

    /**
     * Card contents. Provide either `Card.*` subcomponents (e.g. `Card.Heading`,
     * `Card.Description`, `Card.Metadata`) or custom content.
     */
    children: React.ReactNode
  }
>

type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type HeadingProps = React.ComponentPropsWithoutRef<'h3'> & {
  /**
   * The heading level to render. Defaults to 'h3'.
   */
  as?: HeadingLevel
  children: React.ReactNode
}

type DescriptionProps = React.ComponentPropsWithoutRef<'p'> & {
  /**
   * Card description. Rendered as a `<p>`, so keep it to flowing text.
   */
  children: React.ReactNode
}

type IconProps = {
  /**
   * An Octicon or custom SVG icon to render
   */
  icon: React.ElementType
  /**
   * Accessible label for the icon. When omitted, the icon is treated as decorative.
   */
  'aria-label'?: string
  className?: string
}

type ImageProps = React.ComponentPropsWithoutRef<'img'> & {
  /**
   * The image source URL
   */
  src: string
  /**
   * Alt text for accessibility
   */
  alt?: string
}

type ActionProps = {
  /** Interactive control for the top-right corner of the card. */
  children: React.ReactNode
}

type MetadataProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * Metadata row at the bottom of the card. Any content works: text, icons,
   * a `Label`, an `Octicon`.
   */
  children: React.ReactNode
}

function CardComponent<As extends CardAs>(
  props: CardProps<As>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: ForwardedRef<any>,
) {
  const {
    children,
    className,
    padding = 'normal',
    borderRadius = 'large',
    as = 'div',
    ...rest
  } = props as CardProps<CardAs>
  const Component = as as React.ElementType
  const generatedId = useId()
  const titleId = as === 'section' ? generatedId : undefined

  // Auto-wire aria-labelledby when as="section" unless consumer provides their own
  if (as === 'section' && !('aria-label' in props) && !('aria-labelledby' in props)) {
    ;(rest as Record<string, unknown>)['aria-labelledby'] = titleId
  }

  let icon: React.ReactNode = null
  let image: React.ReactNode = null
  let heading: React.ReactNode = null
  let description: React.ReactNode = null
  let metadata: React.ReactNode = null
  let menu: React.ReactNode = null

  const childArray = React.Children.toArray(children)

  for (const child of childArray) {
    if (!React.isValidElement(child)) continue

    if (child.type === CardIcon) {
      icon = child
    } else if (child.type === CardImage) {
      image = child
    } else if (child.type === CardHeading) {
      heading = child
    } else if (child.type === CardDescription) {
      description = child
    } else if (child.type === CardMetadata) {
      metadata = child
    } else if (child.type === CardAction) {
      menu = child
    }
  }

  const hasSlotChildren = icon || image || heading || description || metadata || menu

  const isEmpty = !hasSlotChildren && childArray.length === 0

  if (isEmpty) {
    return null
  }

  if (!hasSlotChildren) {
    return (
      <CardContext.Provider value={{titleId}}>
        <Component
          ref={ref}
          className={clsx(classes.Card, className)}
          data-component="Card"
          data-padding={padding}
          data-border-radius={borderRadius}
          {...rest}
        >
          {children}
        </Component>
      </CardContext.Provider>
    )
  }

  return (
    <CardContext.Provider value={{titleId}}>
      <Component
        ref={ref}
        className={clsx(classes.Card, className)}
        data-component="Card"
        data-padding={padding}
        data-border-radius={borderRadius}
        {...rest}
      >
        {(image || icon) && (
          <div className={clsx(classes.CardHeader, image && classes.CardHeaderEdgeToEdge)}>{image || icon}</div>
        )}
        <div className={classes.CardBody}>
          <div className={classes.CardContent}>
            {heading}
            {description}
          </div>
          {metadata ? <div className={classes.CardMetadataContainer}>{metadata}</div> : null}
        </div>
        {menu ? <div className={classes.CardAction}>{menu}</div> : null}
      </Component>
    </CardContext.Provider>
  )
}

CardComponent.displayName = 'Card'

const CardImpl = fixedForwardRef(CardComponent)

function CardIcon({icon: IconComponent, 'aria-label': ariaLabel, className}: IconProps) {
  return (
    <span
      className={clsx(classes.CardIcon, className)}
      data-component="Card.Icon"
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <IconComponent />
    </span>
  )
}

CardIcon.displayName = 'Card.Icon'

function CardImage({src, alt = '', className, ...rest}: ImageProps) {
  return (
    <img {...rest} src={src} alt={alt} className={clsx(classes.CardImage, className)} data-component="Card.Image" />
  )
}

CardImage.displayName = 'Card.Image'

/**
 * Heading shown at the top of a Card.
 *
 * When the parent Card uses `as="section"`, the heading's `id` is
 * automatically wired to the section's `aria-labelledby`.
 */
const CardHeading = forwardRef<HTMLHeadingElement, HeadingProps>(function CardHeading(
  {as: Component = 'h3', children, className, id, ...rest},
  ref,
) {
  const {titleId} = useContext(CardContext)
  return (
    <Component
      {...rest}
      ref={ref}
      id={id ?? titleId}
      className={clsx(classes.CardHeading, className)}
      data-component="Card.Heading"
    >
      {children}
    </Component>
  )
})

CardHeading.displayName = 'Card.Heading'

const CardDescription = forwardRef<HTMLParagraphElement, DescriptionProps>(function CardDescription(
  {children, className, ...rest},
  ref,
) {
  return (
    <p {...rest} ref={ref} className={clsx(classes.CardDescription, className)} data-component="Card.Description">
      {children}
    </p>
  )
})

CardDescription.displayName = 'Card.Description'

/**
 * Top-right slot for a single interactive control.
 *
 * Give the control a label that names the card (e.g. `"More options for
 * Project Alpha"`, not just `"More options"`) so users can tell which card
 * the action applies to when several cards are visible.
 */
function CardAction({children}: ActionProps) {
  return <div data-component="Card.Action">{children}</div>
}

CardAction.displayName = 'Card.Action'

const CardMetadata = forwardRef<HTMLDivElement, MetadataProps>(function CardMetadata(
  {children, className, ...rest},
  ref,
) {
  return (
    <div {...rest} ref={ref} className={clsx(classes.CardMetadataItem, className)} data-component="Card.Metadata">
      {children}
    </div>
  )
})

CardMetadata.displayName = 'Card.Metadata'

export {CardImpl, CardIcon, CardImage, CardHeading, CardDescription, CardAction, CardMetadata}
export type {HeadingProps as CardHeadingProps}
export type {DescriptionProps as CardDescriptionProps}
export type {IconProps as CardIconProps}
export type {ImageProps as CardImageProps}
export type {ActionProps as CardActionProps}
export type {MetadataProps as CardMetadataProps}
