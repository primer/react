import {clsx} from 'clsx'
import React from 'react'
import {Button} from '../Button'
import {Link} from '../Link'
import classes from './Blankslate.module.css'

export type BlankslateProps = React.PropsWithChildren<{
  /**
   * Add a border around this component
   */
  border?: boolean

  /**
   * Constrain the maximum width of this component
   */
  narrow?: boolean

  /**
   * Increase the padding of this component
   */
  spacious?: boolean

  className?: string
}>

/**
 * Blankslate is used as placeholder to tell users why content is missing.
 * @primerid blankslate
 * @primerstatus draft
 * @primera11yreviewed false
 */
export function Blankslate({border, children, narrow, spacious, className}: BlankslateProps) {
  return (
    <div className={classes.Container}>
      <div
        className={clsx(classes.Blankslate, className)}
        data-border={border}
        data-narrow={narrow}
        data-spacious={spacious}
      >
        {children}
      </div>
    </div>
  )
}

export type VisualProps = React.PropsWithChildren

/**
 * Used to display an icon or image at the top of a Blankslate.
 * @alias Blankslate.Visual
 * @primerparentid blankslate
 */
export function Visual({children}: VisualProps) {
  return <span className={clsx('Blankslate-Visual', classes.Visual)}>{children}</span>
}

export type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>

/**
 * The title (heading) of the Blankslate.
 * @alias Blankslate.Heading
 * @primerparentid blankslate
 */
export function Heading({as: Component = 'h2', children}: HeadingProps) {
  return <Component className={clsx('Blankslate-Heading', classes.Heading)}>{children}</Component>
}

export type DescriptionProps = React.PropsWithChildren

/**
 * An optional description for the Blankslate when the title needs supplemental information.
 * @alias Blankslate.Description
 * @primerparentid blankslate
 */
export function Description({children}: DescriptionProps) {
  return <p className={clsx('Blankslate-Description', classes.Description)}>{children}</p>
}

export type PrimaryActionProps = React.PropsWithChildren<{
  /** Link to complete primary action */
  href: string
}>

/**
 * The primary action to take in response to the messaging in Blankslate.
 * @alias Blankslate.PrimaryAction
 * @primerparentid blankslate
 */
export function PrimaryAction({children, href}: PrimaryActionProps) {
  return (
    <div className={clsx('Blankslate-Action', classes.Action)}>
      <Button as="a" href={href} variant="primary">
        {children}
      </Button>
    </div>
  )
}

export type SecondaryActionProps = React.PropsWithChildren<{
  /** Link to complete secondary action */
  href: string
}>

/**
 * The secondary action to take in response to the messaging in Blankslate.
 * @alias Blankslate.SecondaryAction
 * @primerparentid blankslate
 */
export function SecondaryAction({children, href}: SecondaryActionProps) {
  return (
    <div className={clsx('Blankslate-Action', classes.Action)}>
      <Link href={href}>{children}</Link>
    </div>
  )
}
