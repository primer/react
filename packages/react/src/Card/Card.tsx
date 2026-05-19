import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import classes from './Card.module.css'
import {warning} from '../utils/warning'

type BaseCardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  /**
   * Provide an optional className to add to the outermost element rendered by
   * the Card
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
   * The contents of the card. Provide either `Card.*` subcomponents (for
   * example `Card.Heading`, `Card.Description`, `Card.Metadata`) or any
   * custom content.
   *
   * A card with no children will not render — at least one meaningful
   * child is required.
   */
  children: React.ReactNode
}

/**
 * Card rendered as a `<div>` — the default. Use this variant when the Card
 * is inside an `<li>` of a list of cards: the surrounding list already
 * provides grouping, so no additional landmark is needed. Do **not** use
 * `Card.Heading` in this context — screen readers handle list items and
 * headings as separate navigation modes, and combining them produces a
 * confusing experience.
 */
type DivCardProps = BaseCardProps & {
  as?: 'div'
}

/**
 * Card rendered as a `<section>` — use this variant for standalone Cards
 * that are **not** part of a list of cards. The `<section>` becomes a
 * labelled region landmark for screen-reader users, so an accessible name
 * is required via either `aria-label` or `aria-labelledby` (typically
 * referencing the id of the `Card.Heading`).
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
   * The descriptive text for the card. Rendered inside a `<p>` element so
   * should be flowing text content.
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
   * The interactive control(s) to render in the top-right corner of the card,
   * typically a single `IconButton` or `ActionMenu` trigger. When a card
   * contains a menu, make sure the control's accessible name includes enough
   * context to distinguish it from other cards (for example,
   * `Options for Project Alpha` rather than just `Options`).
   */
  children: React.ReactNode
}

type MetadataProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * The metadata content to render at the bottom of the card. Accepts any
   * content, including plain text, icons, and other Primer components (for
   * example a `Label`, `Octicon`, or any combination). Avoid using
   * `RelativeTime` until its outstanding accessibility issues are resolved.
   */
  children: React.ReactNode
}

const CardImpl = forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  const {children, className, padding = 'normal', borderRadius = 'large', as = 'div', ...rest} = props
  // Widen the local element type so JSX doesn't intersect the intrinsic prop
  // types for `div` and `section` (which would force the ref back to
  // `HTMLDivElement`). The runtime element is still `as`.
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

  // `React.Children.toArray` already filters out `null`, `undefined`, `false`,
  // and `true`, so if the resulting array is empty there is nothing
  // meaningful to render. The component should not render in that case.
  const isEmpty = !hasSlotChildren && childArray.length === 0

  warning(
    isEmpty,
    'The <Card> component was rendered with no children and will not render. Provide either Card subcomponents (Card.Heading, Card.Description, etc.) or custom content.',
  )

  // When rendered as a <section>, the Card must have an accessible name so
  // screen-reader users can identify the labelled region.
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
 * Accessibility:
 * - Use only on **standalone** Cards (those rendered with `as="section"`).
 *   When the Card is inside an `<li>` in a list of cards, the surrounding
 *   list already provides grouping; adding a heading produces a confusing
 *   experience for screen-reader users, who handle list items and headings
 *   as separate navigation modes.
 * - Pair with `aria-labelledby` on the parent `Card` (referencing the
 *   heading's `id`) so the section landmark uses the visible heading as
 *   its accessible name.
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
 * Renders an interactive control (or controls) positioned at the top-right
 * corner of the card. `Card.Menu` is intended for a single action trigger
 * such as an `IconButton` or `ActionMenu` anchor.
 *
 * Accessibility:
 * - The trigger's accessible name should include enough context to
 *   distinguish it from triggers in other cards (for example,
 *   `"More options for Project Alpha"` rather than just `"More options"`),
 *   because lists of cards often share identical control labels.
 * - Avoid placing multiple interactive controls inside `Card.Menu`.
 *   If a card needs multiple actions, expose them inside an `ActionMenu`
 *   overlay so they remain reachable in a predictable focus order.
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
