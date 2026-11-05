'use client'

import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {Button} from '../Button'
import {LinkButton} from '../LinkButton'

const blankslate = cva('grid justify-items-center p-8 text-center', {
  variants: {
    size: {
      small: 'p-4',
      medium: 'p-8 @max-[34rem]:p-5',
      large: 'p-8 @max-[34rem]:p-5',
    },
    border: {true: 'rounded-md border border-default', false: ''},
    narrow: {true: 'mx-auto max-w-[485px]', false: ''},
    spacious: {true: '', false: ''},
  },
  compoundVariants: [
    {size: 'small', spacious: true, className: 'px-7 py-11'},
    {size: ['medium', 'large'], spacious: true, className: 'px-10 py-20 @max-[34rem]:px-7 @max-[34rem]:py-11'},
  ],
  defaultVariants: {size: 'medium', border: false, narrow: false, spacious: false},
})
const BlankslateSizeContext = React.createContext<'small' | 'medium' | 'large'>('medium')
export interface BlankslateProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Draws a border around the blankslate. */
  border?: boolean
  /** Constrains the content to a narrower column. */
  narrow?: boolean
  /** Increases the vertical padding, for a blankslate that fills a large empty region. */
  spacious?: boolean
  /** Overall scale of the visual, heading, and spacing. */
  size?: 'small' | 'medium' | 'large'
}
export const Blankslate = React.forwardRef<HTMLDivElement, BlankslateProps>(function Blankslate(
  {border = false, className, narrow = false, size = 'medium', spacious = false, ...rest},
  ref,
) {
  return (
    <BlankslateSizeContext.Provider value={size}>
      <div className="@container" data-component="Blankslate.Container">
        <div
          {...rest}
          ref={ref}
          className={cn(blankslate({size, border, narrow, spacious}), className)}
          data-border={border ? '' : undefined}
          data-component="Blankslate"
          data-narrow={narrow ? '' : undefined}
          data-size={size}
          data-spacious={spacious ? '' : undefined}
        />
      </div>
    </BlankslateSizeContext.Provider>
  )
})
export const BlankslateVisual = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  function BlankslateVisual({className, ...rest}, ref) {
    const size = React.useContext(BlankslateSizeContext)
    return (
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        className={cn(
          'mb-2 inline-flex text-muted [&_svg]:w-full',
          size === 'small' ? 'max-w-6' : 'max-w-8 @max-[34rem]:max-w-6',
          className,
        )}
        data-component="Blankslate.Visual"
      />
    )
  },
)
export interface BlankslateHeadingProps extends React.ComponentPropsWithoutRef<'h2'> {
  /** Heading element to render, so the heading fits the surrounding document outline. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
export function BlankslateHeading({as: Heading = 'h2', className, ...rest}: BlankslateHeadingProps) {
  const size = React.useContext(BlankslateSizeContext)
  return (
    <Heading
      {...rest}
      className={cn(
        'm-0 mb-1 text-center text-balance font-semibold',
        size === 'large'
          ? 'mt-2 text-title-large @max-[34rem]:mt-0 @max-[34rem]:text-title-small'
          : size === 'medium'
            ? 'text-title-medium @max-[34rem]:text-title-small'
            : 'text-title-small',
        className,
      )}
      data-component="Blankslate.Heading"
    />
  )
}
export const BlankslateDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  function BlankslateDescription({className, ...rest}, ref) {
    const size = React.useContext(BlankslateSizeContext)
    return (
      <p
        {...rest}
        ref={ref}
        className={cn(
          'm-0 text-center text-balance [color:var(--fgColor-muted)]',
          size === 'small'
            ? 'text-body-medium'
            : size === 'large'
              ? 'mb-2 text-body-large @max-[34rem]:text-body-medium'
              : 'text-body-large @max-[34rem]:text-body-medium',
          className,
        )}
        data-component="Blankslate.Description"
      />
    )
  },
)
type PrimaryActionProps =
  | ({href: string} & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({href?: undefined} & React.ButtonHTMLAttributes<HTMLButtonElement>)

export function BlankslatePrimaryAction({children, className, href, ...rest}: PrimaryActionProps) {
  const size = React.useContext(BlankslateSizeContext)
  const classes = cn(className)
  return (
    <div
      className={cn(
        'mt-4 @max-[34rem]:mt-2 @max-[34rem]:first-of-type:mt-4 @max-[34rem]:last-of-type:mb-1',
        size === 'small'
          ? 'text-body-medium last-of-type:mb-3'
          : 'text-body-large last-of-type:mb-4 @max-[34rem]:text-body-medium',
      )}
      data-component="Blankslate.PrimaryAction"
    >
      {href ? (
        <LinkButton
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          className={classes}
          href={href}
          size={size === 'small' ? 'small' : 'medium'}
          variant="primary"
        >
          {children}
        </LinkButton>
      ) : (
        <Button
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={classes}
          type="button"
          size={size === 'small' ? 'small' : 'medium'}
          variant="primary"
        >
          {children}
        </Button>
      )}
    </div>
  )
}
export function BlankslateSecondaryAction({
  children,
  className,
  href,
}: React.PropsWithChildren<{href: string; className?: string}>) {
  const size = React.useContext(BlankslateSizeContext)
  return (
    <div
      className={cn(
        'mt-4 @max-[34rem]:mt-2 @max-[34rem]:first-of-type:mt-4 @max-[34rem]:last-of-type:mb-1',
        size === 'small'
          ? 'text-body-medium last-of-type:mb-3'
          : 'text-body-large last-of-type:mb-4 @max-[34rem]:text-body-medium',
      )}
      data-component="Blankslate.SecondaryAction"
    >
      <a className={cn('text-accent underline', className)} href={href}>
        {children}
      </a>
    </div>
  )
}
