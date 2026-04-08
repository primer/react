import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import classes from './Card.module.css'

export type CardProps = React.ComponentPropsWithoutRef<'div'> & {
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
}

type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type HeadingProps = React.ComponentPropsWithoutRef<'h3'> & {
  /**
   * The heading level to render. Defaults to 'h3'.
   */
  as?: HeadingLevel
  children: React.ReactNode
}

type DescriptionProps = React.ComponentPropsWithoutRef<'p'> & {
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
  children: React.ReactNode
}

type MetadataProps = React.ComponentPropsWithoutRef<'div'> & {
  children: React.ReactNode
}

const CardImpl = forwardRef<HTMLDivElement, CardProps>(function Card(
  {children, className, padding = 'normal', ...rest},
  ref,
) {
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

  if (!hasSlotChildren) {
    return (
      <div ref={ref} className={clsx(classes.Card, className)} data-padding={padding} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={clsx(classes.Card, className)} data-padding={padding} {...rest}>
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
    </div>
  )
})

const CardIcon = ({icon: IconComponent, 'aria-label': ariaLabel, className}: IconProps) => {
  return (
    <span
      className={clsx(classes.CardIcon, className)}
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
  return <img src={src} alt={alt} className={clsx(classes.CardImage, className)} {...rest} />
}

CardImage.displayName = 'Card.Image'

const CardHeading = forwardRef<HTMLHeadingElement, HeadingProps>(function CardHeading(
  {as: Component = 'h3', children, className, ...rest},
  ref,
) {
  return (
    <Component ref={ref} className={clsx(classes.CardHeading, className)} {...rest}>
      {children}
    </Component>
  )
})

const CardDescription = forwardRef<HTMLParagraphElement, DescriptionProps>(function CardDescription(
  {children, className, ...rest},
  ref,
) {
  return (
    <p ref={ref} className={clsx(classes.CardDescription, className)} {...rest}>
      {children}
    </p>
  )
})

const CardMenu = ({children}: MenuProps) => {
  return <>{children}</>
}

CardMenu.displayName = 'Card.Menu'

const CardMetadata = forwardRef<HTMLDivElement, MetadataProps>(function CardMetadata(
  {children, className, ...rest},
  ref,
) {
  return (
    <div ref={ref} className={clsx(classes.CardMetadataItem, className)} {...rest}>
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
