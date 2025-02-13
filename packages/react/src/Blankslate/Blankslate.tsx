import {clsx} from 'clsx'
import React from 'react'
import {Button} from '../Button'
import Link from '../Link'
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

function Blankslate({border, children, narrow, spacious, className}: BlankslateProps) {
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

function Visual({children}: VisualProps) {
  return <span className={clsx('Blankslate-Visual', classes.Visual)}>{children}</span>
}

export type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>

function Heading({as: Component = 'h2', children}: HeadingProps) {
  return <Component className={clsx('Blankslate-Heading', classes.Heading)}>{children}</Component>
}

export type DescriptionProps = React.PropsWithChildren

function Description({children}: DescriptionProps) {
  return <p className={clsx('Blankslate-Description', classes.Description)}>{children}</p>
}

export type PrimaryActionProps =
  | (React.PropsWithChildren<{
      href?: never
    }> &
      React.ComponentPropsWithoutRef<'button'>)
  | React.PropsWithChildren<{
      href: string
    }>

function PrimaryAction({children, href, ...props}: PrimaryActionProps) {
  return (
    <div className={clsx('Blankslate-Action', classes.Action)}>
      <Button {...props} as={href ? 'a' : 'button'} href={href} variant="primary">
        {children}
      </Button>
    </div>
  )
}

export type SecondaryActionProps = React.PropsWithChildren<{
  href: string
}>

function SecondaryAction({children, href}: SecondaryActionProps) {
  return (
    <div className={clsx('Blankslate-Action', classes.Action)}>
      <Link href={href}>{children}</Link>
    </div>
  )
}

export default Object.assign(Blankslate, {
  Visual,
  Heading,
  Description,
  PrimaryAction,
  SecondaryAction,
})
