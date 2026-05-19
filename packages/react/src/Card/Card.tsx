import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import classes from './Card.module.css'
import {warning} from '../utils/warning'

type BaseCardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  /**
   * Optional className for the root element.
   */
  className?: string

  /**
   * Controls the internal padding of the Card.
   * @default 'normal'
   */
  padding?: 'none' | 'condensed' | 'normal'

  /**
   * Controls the border radius of the Card.
   * @default 'large'
   */
  borderRadius?: 'medium' | 'large'

  /**
   * The card contents. Provide either `Card.*` subcomponents (e.g.
   * `Card.Heading`, `Card.Description`, `Card.Metadata`) or custom content.
   * Empty cards do not render.
   */
  children: React.ReactNode
}

/**
 * The default Card. Use this inside `<li>` when rendering a list of cards:
 * the list already groups them, so the Card itself doesn't need to be a
 * landmark. Don't use `Card.Heading` here.
 */
type DivCardProps = BaseCardProps & {
  as?: 'div'
}

/**
 * Renders the Card as a `<section>`. Use this for a standalone Card that
 * isn't part of a list. The `<section>` is a region landmark, so it needs
 * an accessible name via `aria-label` or `aria-labelledby` (the latter
 * usually points at `Card.Heading`).
 */
type SectionCardProps = BaseCardProps & {
  as: 'section'
} & ({'aria-label': string} | {'aria-labelledby': string})

export type CardProps = DivCardProps | SectionCardProps

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

type MenuProps = {
  /**
   * Interactive control in the top-right of the card, usually an `IconButton`
   * or `ActionMenu` trigger. Give the control a label that names the card
   * (e.g. `"Options for Project Alpha"`, not just `"Options"`) so it's
   * distinguishable when several cards are on screen.
   */
  children: React.ReactNode
}

type MetadataProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * Metadata row at the bottom of the card. Any content works: text, icons,
   * a `Label`, an `Octicon`. Skip `RelativeTime` for now; it has open
   * accessibility issues.
   */
  children: React.ReactNode
}

const CardImpl = forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  const {children, className, padding = 'normal', borderRadius = 'large', as = 'div', ...rest} = props
  // Use ElementType so JSX doesn't intersect the intrinsic prop types of
  // `div` and `section` (which would pin the ref back to `HTMLDivElement`).
  const Component = as as React.ElementType

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
    } else if (child.type === CardMenu) {
      menu = child
    }
  }

  const hasSlotChildren = icon || image || heading || description || metadata || menu

  // `React.Children.toArray` already drops `null`/`undefined`/`false`/`true`,
  // so an empty array means we have nothing to render.
  const isEmpty = !hasSlotChildren && childArray.length === 0

  warning(
    isEmpty,
    'The <Card> component was rendered with no children and will not render. Provide either Card subcomponents (Card.Heading, Card.Description, etc.) or custom content.',
  )

  warning(
    as === 'section' && !('aria-label' in props) && !('aria-labelledby' in props),
    'The <Card> component used with `as="section"` requires either `aria-label` or `aria-labelledby` so screen-reader users can identify the labelled region. Typically `aria-labelledby` should reference the id of the `Card.Heading`.',
  )

  if (isEmpty) {
    return null
  }

  if (!hasSlotChildren) {
    return (
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
    )
  }

  return (
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
      {menu ? <div className={classes.CardMenu}>{menu}</div> : null}
    </Component>
  )
})

const CardIcon = ({icon: IconComponent, 'aria-label': ariaLabel, className}: IconProps) => {
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

const CardImage = ({src, alt = '', className, ...rest}: ImageProps) => {
  return (
    <img src={src} alt={alt} className={clsx(classes.CardImage, className)} data-component="Card.Image" {...rest} />
  )
}

CardImage.displayName = 'Card.Image'

/**
 * Heading shown at the top of a Card.
 *
 * Only use this on a standalone Card (`as="section"`); don't use it inside
 * an `<li>`, where the surrounding list already provides grouping.
 *
 * Give it an `id` and reference that id from the parent Card's
 * `aria-labelledby` so the section landmark uses the heading as its
 * accessible name.
 */
const CardHeading = forwardRef<HTMLHeadingElement, HeadingProps>(function CardHeading(
  {as: Component = 'h3', children, className, ...rest},
  ref,
) {
  return (
    <Component ref={ref} className={clsx(classes.CardHeading, className)} data-component="Card.Heading" {...rest}>
      {children}
    </Component>
  )
})

const CardDescription = forwardRef<HTMLParagraphElement, DescriptionProps>(function CardDescription(
  {children, className, ...rest},
  ref,
) {
  return (
    <p ref={ref} className={clsx(classes.CardDescription, className)} data-component="Card.Description" {...rest}>
      {children}
    </p>
  )
})

/**
 * Top-right slot for a single interactive control, usually an `IconButton`
 * or `ActionMenu` trigger.
 *
 * Give the control a label that names the card (e.g. `"More options for
 * Project Alpha"`, not just `"More options"`) so users can tell which card
 * the action applies to when several cards are visible.
 *
 * For more than one action, put them inside an `ActionMenu` rather than
 * cramming multiple controls into `Card.Menu`.
 */
const CardMenu = ({children}: MenuProps) => {
  return <div data-component="Card.Menu">{children}</div>
}

CardMenu.displayName = 'Card.Menu'

const CardMetadata = forwardRef<HTMLDivElement, MetadataProps>(function CardMetadata(
  {children, className, ...rest},
  ref,
) {
  return (
    <div ref={ref} className={clsx(classes.CardMetadataItem, className)} data-component="Card.Metadata" {...rest}>
      {children}
    </div>
  )
})

export {CardImpl, CardIcon, CardImage, CardHeading, CardDescription, CardMenu, CardMetadata}
export type {HeadingProps as CardHeadingProps}
export type {DescriptionProps as CardDescriptionProps}
export type {IconProps as CardIconProps}
export type {ImageProps as CardImageProps}
export type {MenuProps as CardMenuProps}
export type {MetadataProps as CardMetadataProps}
