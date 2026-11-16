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
  'primer:inline-flex primer:min-h-5 primer:items-center primer:whitespace-nowrap primer:rounded-full primer:border-0 primer:px-2 primer:py-0 primer:text-xs primer:font-semibold primer:leading-[var(--text-body-lineHeight-small)] primer:no-underline primer:shadow-[0_0_0_1px_transparent]',
  {
    variants: {
      variant: {
        auburn:
          'primer:bg-label-auburn-rest primer:text-label-auburn-rest primer:data-[interactive=true]:hover:bg-label-auburn-hover primer:data-[interactive=true]:hover:text-label-auburn-hover primer:data-[interactive=true]:active:bg-label-auburn-active primer:data-[interactive=true]:active:text-label-auburn-active',
        blue: 'primer:bg-label-blue-rest primer:text-label-blue-rest primer:data-[interactive=true]:hover:bg-label-blue-hover primer:data-[interactive=true]:hover:text-label-blue-hover primer:data-[interactive=true]:active:bg-label-blue-active primer:data-[interactive=true]:active:text-label-blue-active',
        brown:
          'primer:bg-label-brown-rest primer:text-label-brown-rest primer:data-[interactive=true]:hover:bg-label-brown-hover primer:data-[interactive=true]:hover:text-label-brown-hover primer:data-[interactive=true]:active:bg-label-brown-active primer:data-[interactive=true]:active:text-label-brown-active',
        coral:
          'primer:bg-label-coral-rest primer:text-label-coral-rest primer:data-[interactive=true]:hover:bg-label-coral-hover primer:data-[interactive=true]:hover:text-label-coral-hover primer:data-[interactive=true]:active:bg-label-coral-active primer:data-[interactive=true]:active:text-label-coral-active',
        cyan: 'primer:bg-label-cyan-rest primer:text-label-cyan-rest primer:data-[interactive=true]:hover:bg-label-cyan-hover primer:data-[interactive=true]:hover:text-label-cyan-hover primer:data-[interactive=true]:active:bg-label-cyan-active primer:data-[interactive=true]:active:text-label-cyan-active',
        gray: 'primer:bg-label-gray-rest primer:text-label-gray-rest primer:data-[interactive=true]:hover:bg-label-gray-hover primer:data-[interactive=true]:hover:text-label-gray-hover primer:data-[interactive=true]:active:bg-label-gray-active primer:data-[interactive=true]:active:text-label-gray-active',
        green:
          'primer:bg-label-green-rest primer:text-label-green-rest primer:data-[interactive=true]:hover:bg-label-green-hover primer:data-[interactive=true]:hover:text-label-green-hover primer:data-[interactive=true]:active:bg-label-green-active primer:data-[interactive=true]:active:text-label-green-active',
        indigo:
          'primer:bg-label-indigo-rest primer:text-label-indigo-rest primer:data-[interactive=true]:hover:bg-label-indigo-hover primer:data-[interactive=true]:hover:text-label-indigo-hover primer:data-[interactive=true]:active:bg-label-indigo-active primer:data-[interactive=true]:active:text-label-indigo-active',
        lemon:
          'primer:bg-label-lemon-rest primer:text-label-lemon-rest primer:data-[interactive=true]:hover:bg-label-lemon-hover primer:data-[interactive=true]:hover:text-label-lemon-hover primer:data-[interactive=true]:active:bg-label-lemon-active primer:data-[interactive=true]:active:text-label-lemon-active',
        lime: 'primer:bg-label-lime-rest primer:text-label-lime-rest primer:data-[interactive=true]:hover:bg-label-lime-hover primer:data-[interactive=true]:hover:text-label-lime-hover primer:data-[interactive=true]:active:bg-label-lime-active primer:data-[interactive=true]:active:text-label-lime-active',
        olive:
          'primer:bg-label-olive-rest primer:text-label-olive-rest primer:data-[interactive=true]:hover:bg-label-olive-hover primer:data-[interactive=true]:hover:text-label-olive-hover primer:data-[interactive=true]:active:bg-label-olive-active primer:data-[interactive=true]:active:text-label-olive-active',
        orange:
          'primer:bg-label-orange-rest primer:text-label-orange-rest primer:data-[interactive=true]:hover:bg-label-orange-hover primer:data-[interactive=true]:hover:text-label-orange-hover primer:data-[interactive=true]:active:bg-label-orange-active primer:data-[interactive=true]:active:text-label-orange-active',
        pine: 'primer:bg-label-pine-rest primer:text-label-pine-rest primer:data-[interactive=true]:hover:bg-label-pine-hover primer:data-[interactive=true]:hover:text-label-pine-hover primer:data-[interactive=true]:active:bg-label-pine-active primer:data-[interactive=true]:active:text-label-pine-active',
        pink: 'primer:bg-label-pink-rest primer:text-label-pink-rest primer:data-[interactive=true]:hover:bg-label-pink-hover primer:data-[interactive=true]:hover:text-label-pink-hover primer:data-[interactive=true]:active:bg-label-pink-active primer:data-[interactive=true]:active:text-label-pink-active',
        plum: 'primer:bg-label-plum-rest primer:text-label-plum-rest primer:data-[interactive=true]:hover:bg-label-plum-hover primer:data-[interactive=true]:hover:text-label-plum-hover primer:data-[interactive=true]:active:bg-label-plum-active primer:data-[interactive=true]:active:text-label-plum-active',
        purple:
          'primer:bg-label-purple-rest primer:text-label-purple-rest primer:data-[interactive=true]:hover:bg-label-purple-hover primer:data-[interactive=true]:hover:text-label-purple-hover primer:data-[interactive=true]:active:bg-label-purple-active primer:data-[interactive=true]:active:text-label-purple-active',
        red: 'primer:bg-label-red-rest primer:text-label-red-rest primer:data-[interactive=true]:hover:bg-label-red-hover primer:data-[interactive=true]:hover:text-label-red-hover primer:data-[interactive=true]:active:bg-label-red-active primer:data-[interactive=true]:active:text-label-red-active',
        teal: 'primer:bg-label-teal-rest primer:text-label-teal-rest primer:data-[interactive=true]:hover:bg-label-teal-hover primer:data-[interactive=true]:hover:text-label-teal-hover primer:data-[interactive=true]:active:bg-label-teal-active primer:data-[interactive=true]:active:text-label-teal-active',
        yellow:
          'primer:bg-label-yellow-rest primer:text-label-yellow-rest primer:data-[interactive=true]:hover:bg-label-yellow-hover primer:data-[interactive=true]:hover:text-label-yellow-hover primer:data-[interactive=true]:active:bg-label-yellow-active primer:data-[interactive=true]:active:text-label-yellow-active',
      },
      interactive: {
        true: 'primer:cursor-pointer primer:focus-visible:outline-2 primer:focus-visible:outline-offset-2 primer:focus-visible:outline-focus',
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
