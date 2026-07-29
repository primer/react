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
  'inline-flex min-h-5 items-center whitespace-nowrap rounded-full border-0 px-2 py-0 text-xs font-semibold leading-[var(--text-body-lineHeight-small)] no-underline shadow-[0_0_0_1px_transparent]',
  {
    variants: {
      variant: {
        auburn:
          'bg-label-auburn-rest text-label-auburn-rest data-[interactive=true]:hover:bg-label-auburn-hover data-[interactive=true]:hover:text-label-auburn-hover data-[interactive=true]:active:bg-label-auburn-active data-[interactive=true]:active:text-label-auburn-active',
        blue: 'bg-label-blue-rest text-label-blue-rest data-[interactive=true]:hover:bg-label-blue-hover data-[interactive=true]:hover:text-label-blue-hover data-[interactive=true]:active:bg-label-blue-active data-[interactive=true]:active:text-label-blue-active',
        brown:
          'bg-label-brown-rest text-label-brown-rest data-[interactive=true]:hover:bg-label-brown-hover data-[interactive=true]:hover:text-label-brown-hover data-[interactive=true]:active:bg-label-brown-active data-[interactive=true]:active:text-label-brown-active',
        coral:
          'bg-label-coral-rest text-label-coral-rest data-[interactive=true]:hover:bg-label-coral-hover data-[interactive=true]:hover:text-label-coral-hover data-[interactive=true]:active:bg-label-coral-active data-[interactive=true]:active:text-label-coral-active',
        cyan: 'bg-label-cyan-rest text-label-cyan-rest data-[interactive=true]:hover:bg-label-cyan-hover data-[interactive=true]:hover:text-label-cyan-hover data-[interactive=true]:active:bg-label-cyan-active data-[interactive=true]:active:text-label-cyan-active',
        gray: 'bg-label-gray-rest text-label-gray-rest data-[interactive=true]:hover:bg-label-gray-hover data-[interactive=true]:hover:text-label-gray-hover data-[interactive=true]:active:bg-label-gray-active data-[interactive=true]:active:text-label-gray-active',
        green:
          'bg-label-green-rest text-label-green-rest data-[interactive=true]:hover:bg-label-green-hover data-[interactive=true]:hover:text-label-green-hover data-[interactive=true]:active:bg-label-green-active data-[interactive=true]:active:text-label-green-active',
        indigo:
          'bg-label-indigo-rest text-label-indigo-rest data-[interactive=true]:hover:bg-label-indigo-hover data-[interactive=true]:hover:text-label-indigo-hover data-[interactive=true]:active:bg-label-indigo-active data-[interactive=true]:active:text-label-indigo-active',
        lemon:
          'bg-label-lemon-rest text-label-lemon-rest data-[interactive=true]:hover:bg-label-lemon-hover data-[interactive=true]:hover:text-label-lemon-hover data-[interactive=true]:active:bg-label-lemon-active data-[interactive=true]:active:text-label-lemon-active',
        lime: 'bg-label-lime-rest text-label-lime-rest data-[interactive=true]:hover:bg-label-lime-hover data-[interactive=true]:hover:text-label-lime-hover data-[interactive=true]:active:bg-label-lime-active data-[interactive=true]:active:text-label-lime-active',
        olive:
          'bg-label-olive-rest text-label-olive-rest data-[interactive=true]:hover:bg-label-olive-hover data-[interactive=true]:hover:text-label-olive-hover data-[interactive=true]:active:bg-label-olive-active data-[interactive=true]:active:text-label-olive-active',
        orange:
          'bg-label-orange-rest text-label-orange-rest data-[interactive=true]:hover:bg-label-orange-hover data-[interactive=true]:hover:text-label-orange-hover data-[interactive=true]:active:bg-label-orange-active data-[interactive=true]:active:text-label-orange-active',
        pine: 'bg-label-pine-rest text-label-pine-rest data-[interactive=true]:hover:bg-label-pine-hover data-[interactive=true]:hover:text-label-pine-hover data-[interactive=true]:active:bg-label-pine-active data-[interactive=true]:active:text-label-pine-active',
        pink: 'bg-label-pink-rest text-label-pink-rest data-[interactive=true]:hover:bg-label-pink-hover data-[interactive=true]:hover:text-label-pink-hover data-[interactive=true]:active:bg-label-pink-active data-[interactive=true]:active:text-label-pink-active',
        plum: 'bg-label-plum-rest text-label-plum-rest data-[interactive=true]:hover:bg-label-plum-hover data-[interactive=true]:hover:text-label-plum-hover data-[interactive=true]:active:bg-label-plum-active data-[interactive=true]:active:text-label-plum-active',
        purple:
          'bg-label-purple-rest text-label-purple-rest data-[interactive=true]:hover:bg-label-purple-hover data-[interactive=true]:hover:text-label-purple-hover data-[interactive=true]:active:bg-label-purple-active data-[interactive=true]:active:text-label-purple-active',
        red: 'bg-label-red-rest text-label-red-rest data-[interactive=true]:hover:bg-label-red-hover data-[interactive=true]:hover:text-label-red-hover data-[interactive=true]:active:bg-label-red-active data-[interactive=true]:active:text-label-red-active',
        teal: 'bg-label-teal-rest text-label-teal-rest data-[interactive=true]:hover:bg-label-teal-hover data-[interactive=true]:hover:text-label-teal-hover data-[interactive=true]:active:bg-label-teal-active data-[interactive=true]:active:text-label-teal-active',
        yellow:
          'bg-label-yellow-rest text-label-yellow-rest data-[interactive=true]:hover:bg-label-yellow-hover data-[interactive=true]:hover:text-label-yellow-hover data-[interactive=true]:active:bg-label-yellow-active data-[interactive=true]:active:text-label-yellow-active',
      },
      interactive: {
        true: 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        false: '',
      },
    },
    defaultVariants: {variant: 'gray', interactive: false},
  },
)
export interface IssueLabelProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. */
  as?: React.ElementType
  /** Custom hex colour, for a label whose colour is chosen by the user rather than from `variant`. */
  fillColor?: `#${string}`
  /** Named colour for the label. */
  variant?: IssueLabelVariant
  /** Makes the label a link to the given URL. */
  href?: string
}
function readableColor(color: string) {
  const value = color.slice(1)
  const channels =
    /^[\da-f]{3,4}$/i.test(value) && (value.length === 3 || value.length === 4)
      ? value
          .slice(0, 3)
          .split('')
          .map(channel => Number.parseInt(channel.repeat(2), 16))
      : /^[\da-f]{6}([\da-f]{2})?$/i.test(value)
        ? [0, 2, 4].map(offset => Number.parseInt(value.slice(offset, offset + 2), 16))
        : null

  if (!channels) throw new Error(`Invalid IssueLabel fillColor: "${color}"`)

  const luminance = channels
    .map(channel => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0)

  return luminance > 0.179 ? '#000' : '#fff'
}
export const IssueLabel = React.forwardRef<HTMLElement, IssueLabelProps>(function IssueLabel(
  {as, className, fillColor, href, style, variant = 'gray', ...rest},
  ref,
) {
  const Component = as ?? (href ? 'a' : rest.onClick ? 'button' : 'span')
  const interactive = Component === 'a' || Component === 'button' || Boolean(rest.onClick)
  return (
    <Component
      {...rest}
      ref={ref}
      href={href}
      type={Component === 'button' ? 'button' : undefined}
      className={cn(issueLabel({variant, interactive}), className)}
      data-component="IssueLabel"
      data-interactive={interactive ? 'true' : undefined}
      data-variant={fillColor ? undefined : variant}
      style={fillColor ? {...style, backgroundColor: fillColor, color: readableColor(fillColor)} : style}
    />
  )
})
