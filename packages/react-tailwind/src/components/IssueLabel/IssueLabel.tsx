import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

export type IssueLabelVariant =
  | 'auburn'
  | 'blue'
  | 'brown'
  | 'coral'
  | 'cyan'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'lemon'
  | 'lime'
  | 'olive'
  | 'orange'
  | 'pine'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow'
const issueLabel = cva(
  'inline-flex min-h-5 items-center rounded-full px-2 text-sm font-semibold leading-5 no-underline shadow-[0_0_0_1px_transparent]',
  {
    variants: {
      variant: {
        auburn: 'bg-label-auburn text-default',
        blue: 'bg-label-blue text-default',
        brown: 'bg-label-brown text-default',
        coral: 'bg-label-coral text-default',
        cyan: 'bg-label-cyan text-default',
        gray: 'bg-label-gray text-default',
        green: 'bg-label-green text-default',
        indigo: 'bg-label-indigo text-default',
        lemon: 'bg-label-lemon text-default',
        lime: 'bg-label-lime text-default',
        olive: 'bg-label-olive text-default',
        orange: 'bg-label-orange text-default',
        pine: 'bg-label-pine text-default',
        pink: 'bg-label-pink text-default',
        plum: 'bg-label-plum text-default',
        purple: 'bg-label-purple text-default',
        red: 'bg-label-red text-default',
        teal: 'bg-label-teal text-default',
        yellow: 'bg-label-yellow text-default',
      },
      interactive: {
        true: 'cursor-pointer hover:brightness-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-accent-emphasis',
        false: '',
      },
    },
    defaultVariants: {variant: 'gray', interactive: false},
  },
)
export interface IssueLabelProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  fillColor?: `#${string}`
  variant?: IssueLabelVariant
  href?: string
}
function readableColor(color: string) {
  const value = color.slice(1)
  if (!/^[\da-f]{6}$/i.test(value)) return '#ffffff'
  const [r, g, b] = [0, 2, 4].map(offset => Number.parseInt(value.slice(offset, offset + 2), 16))
  return r * 0.2126 + g * 0.7152 + b * 0.0722 > 140 ? '#24292f' : '#ffffff'
}
export const IssueLabel = React.forwardRef<HTMLElement, IssueLabelProps>(function IssueLabel(
  {as, className, fillColor, href, style, variant = 'gray', ...rest},
  ref,
) {
  const Component = as ?? (href ? 'a' : 'span')
  const interactive = Component === 'a' || Component === 'button' || Boolean(rest.onClick)
  return (
    <Component
      {...rest}
      ref={ref}
      href={href}
      className={cn(issueLabel({variant, interactive}), className)}
      data-component="IssueLabel"
      data-variant={fillColor ? undefined : variant}
      style={fillColor ? {backgroundColor: fillColor, color: readableColor(fillColor), ...style} : style}
    />
  )
})
