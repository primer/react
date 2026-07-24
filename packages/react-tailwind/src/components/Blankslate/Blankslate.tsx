import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {Button} from '../Button'
import {LinkButton} from '../LinkButton'

const blankslate = cva('grid justify-items-center p-8 text-center', {
  variants: {
    size: {small: 'p-4', medium: 'p-8', large: 'p-8'},
    border: {true: 'rounded-md border-thin border-default', false: ''},
    narrow: {true: 'mx-auto max-w-[485px]', false: ''},
    spacious: {true: 'px-10 py-20 max-sm:px-7 max-sm:py-11', false: ''},
  },
  defaultVariants: {size: 'medium', border: false, narrow: false, spacious: false},
})
const BlankslateSizeContext = React.createContext<'small' | 'medium' | 'large'>('medium')
export interface BlankslateProps extends React.ComponentPropsWithoutRef<'div'> {
  border?: boolean
  narrow?: boolean
  spacious?: boolean
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
    return (
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        className={cn('mb-2 inline-flex max-w-8 text-muted [&_svg]:w-full', className)}
        data-component="Blankslate.Visual"
      />
    )
  },
)
export interface BlankslateHeadingProps extends React.ComponentPropsWithoutRef<'h2'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
export function BlankslateHeading({as: Heading = 'h2', className, ...rest}: BlankslateHeadingProps) {
  const size = React.useContext(BlankslateSizeContext)
  return (
    <Heading
      {...rest}
      className={cn(
        'm-0 text-center font-semibold',
        size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg',
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
        className={cn('m-0 mt-1 text-center text-muted', size === 'small' ? 'text-base' : 'text-lg', className)}
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
  const classes = cn(
    'mt-4 rounded-md bg-accent-emphasis px-3 py-1.5 font-semibold text-on-emphasis no-underline',
    size === 'small' && 'text-sm',
    className,
  )
  return (
    <div data-component="Blankslate.PrimaryAction">
      {href ? (
        <LinkButton
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          className={classes}
          href={href}
          variant="primary"
        >
          {children}
        </LinkButton>
      ) : (
        <Button
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={classes}
          type="button"
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
  return (
    <div className="mt-4" data-component="Blankslate.SecondaryAction">
      <a className={cn('text-accent underline', className)} href={href}>
        {children}
      </a>
    </div>
  )
}
