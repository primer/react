import {clsx} from 'clsx'
import {forwardRef, useMemo, type JSX} from 'react'
import type React from 'react'
import {ButtonBase} from '../Button'
import Link from '../Link'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
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
          data-component="Blankslate"
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
    <span {...rest} className={clsx('Blankslate-Visual', classes.Visual, className)} data-component="Blankslate.Visual">
      {children}
    </span>
  )
}

type BlankslateHeadingProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function Heading({as: Component = 'h2', children, className, ...rest}: BlankslateHeadingProps) {
  return (
    <Component
      {...rest}
      className={clsx('Blankslate-Heading', classes.Heading, className)}
      data-component="Blankslate.Heading"
    >
      {children}
    </Component>
  )
}

type BlankslateDescriptionProps = React.HTMLAttributes<HTMLElement>

function Description({children, className, ...rest}: BlankslateDescriptionProps) {
  return (
    <p
      {...rest}
      className={clsx('Blankslate-Description', classes.Description, className)}
      data-component="Blankslate.Description"
    >
      {children}
    </p>
  )
}

type BlankslateActionVariant = 'primary' | 'secondary'

type BlankslateActionElementProps =
  | {
      as?: 'button'
      href?: never
    }
  | {
      as?: 'a'
      href: string
    }

type BlankslateActionProps = React.PropsWithChildren<
  BlankslateActionElementProps & {
    className?: string

    /**
     * Specify the visual treatment of the action
     */
    variant?: BlankslateActionVariant
  }
>

type BlankslateActionInternalProps = BlankslateActionProps & {
  dataComponent?: string
}

const ActionBase = forwardRef<HTMLAnchorElement | HTMLButtonElement, BlankslateActionInternalProps>(
  (
    {as, children, className, dataComponent = 'Blankslate.Action', href, variant = 'primary', ...props},
    forwardedRef,
  ): JSX.Element => {
    const {size} = useBlankslate()
    const Component = as ?? (href ? 'a' : 'button')
    const anchorRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>
    const buttonRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>

    return (
      <div className={clsx('Blankslate-Action', classes.Action)} data-component={dataComponent}>
        {variant === 'primary' ? (
          Component === 'a' ? (
            <ButtonBase
              {...props}
              as="a"
              className={className}
              href={href}
              ref={anchorRef}
              size={size === 'small' ? 'small' : undefined}
              variant="primary"
            >
              {children}
            </ButtonBase>
          ) : (
            <ButtonBase
              {...props}
              as="button"
              className={className}
              ref={buttonRef}
              size={size === 'small' ? 'small' : undefined}
              variant="primary"
            >
              {children}
            </ButtonBase>
          )
        ) : Component === 'a' ? (
          <Link {...props} as="a" className={className} href={href} ref={anchorRef}>
            {children}
          </Link>
        ) : (
          <Link {...props} as="button" className={className} ref={buttonRef}>
            {children}
          </Link>
        )}
      </div>
    )
  },
)

const Action = ActionBase as PolymorphicForwardRefComponent<'button', BlankslateActionProps>

Action.displayName = 'Blankslate.Action'

type BlankslatePrimaryActionProps = BlankslateActionElementProps

const PrimaryAction = forwardRef(
  (props: BlankslatePrimaryActionProps, forwardedRef: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>) => {
    return <ActionBase {...props} dataComponent="Blankslate.PrimaryAction" ref={forwardedRef} variant="primary" />
  },
) as PolymorphicForwardRefComponent<'button', BlankslatePrimaryActionProps>

PrimaryAction.displayName = 'Blankslate.PrimaryAction'

type BlankslateSecondaryActionProps = BlankslateActionElementProps

const SecondaryAction = forwardRef(
  (props: BlankslateSecondaryActionProps, forwardedRef: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>) => {
    return <ActionBase {...props} dataComponent="Blankslate.SecondaryAction" ref={forwardedRef} variant="secondary" />
  },
) as PolymorphicForwardRefComponent<'button', BlankslateSecondaryActionProps>

SecondaryAction.displayName = 'Blankslate.SecondaryAction'

export {Blankslate, Visual, Heading, Description, Action, PrimaryAction, SecondaryAction}
export type {
  BlankslateProps,
  BlankslateVisualProps,
  BlankslateHeadingProps,
  BlankslateDescriptionProps,
  BlankslateActionProps,
  BlankslatePrimaryActionProps,
  BlankslateSecondaryActionProps,
}
