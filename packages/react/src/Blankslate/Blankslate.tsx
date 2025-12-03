import {clsx} from 'clsx'
import {useMemo} from 'react'
import type React from 'react'
import {Button} from '../Button'
import Link from '../Link'
import {Provider, useBlankslate} from './BlankslateContext'
import classes from './Blankslate.module.css'

type BlankslateProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Add a border around this component
   */
  border?: boolean

  /**
   * Provide an optional class name to be applied to the container element
   */
  className?: string

  /**
   * Constrain the maximum width of this component
   */
  narrow?: boolean

  /**
   * Increase the padding of this component
   */
  spacious?: boolean

  /**
   * Specify the size of this component
   */
  size?: 'small' | 'medium' | 'large'
}

function Blankslate({border, children, narrow, spacious, className, size = 'medium', ...rest}: BlankslateProps) {
  const value = useMemo(() => {
    return {
      size,
    }
  }, [size])

  return (
    <Provider value={value}>
      <div {...rest} className={classes.Container}>
        <div
          className={clsx(classes.Blankslate, className)}
          data-border={border ? '' : undefined}
          data-narrow={narrow ? '' : undefined}
          data-spacious={spacious ? '' : undefined}
          data-size={size}
        >
          {children}
        </div>
      </div>
    </Provider>
  )
}

type BlankslateVisualProps = React.HTMLAttributes<HTMLElement>

function Visual({children, className, ...rest}: BlankslateVisualProps) {
  return (
    <span {...rest} className={clsx('Blankslate-Visual', classes.Visual, className)}>
      {children}
    </span>
  )
}

type BlankslateHeadingProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function Heading({as: Component = 'h2', children, className, ...rest}: BlankslateHeadingProps) {
  return (
    <Component {...rest} className={clsx('Blankslate-Heading', classes.Heading, className)}>
      {children}
    </Component>
  )
}

type BlankslateDescriptionProps = React.HTMLAttributes<HTMLElement>

function Description({children, className, ...rest}: BlankslateDescriptionProps) {
  return (
    <p {...rest} className={clsx('Blankslate-Description', classes.Description, className)}>
      {children}
    </p>
  )
}

type BlankslatePrimaryActionProps =
  | (React.PropsWithChildren<{
      href?: never
    }> &
      React.ComponentPropsWithoutRef<'button'>)
  | React.PropsWithChildren<{
      href: string
    }>

function PrimaryAction({children, href, ...props}: BlankslatePrimaryActionProps) {
  const {size} = useBlankslate()
  return (
    <div className={clsx('Blankslate-Action', classes.Action)}>
      <Button
        {...props}
        as={href ? 'a' : 'button'}
        href={href}
        variant="primary"
        size={size === 'small' ? 'small' : undefined}
      >
        {children}
      </Button>
    </div>
  )
}

type BlankslateSecondaryActionProps = React.PropsWithChildren<{
  href: string
}>

function SecondaryAction({children, href}: BlankslateSecondaryActionProps) {
  return (
    <div className={clsx('Blankslate-Action', classes.Action)}>
      <Link href={href}>{children}</Link>
    </div>
  )
}

export {Blankslate, Visual, Heading, Description, PrimaryAction, SecondaryAction}
export type {
  BlankslateProps,
  BlankslateVisualProps,
  BlankslateHeadingProps,
  BlankslateDescriptionProps,
  BlankslatePrimaryActionProps,
  BlankslateSecondaryActionProps,
}
