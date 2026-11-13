import type React from 'react'
import {cn} from '../../internal/cn'
import type {CSSPropertiesWithCustomProperties, ResponsiveValue} from '../../utils/types'

/** A named dialog width (`small` 296px, `medium` 320px, `large` 480px, `xlarge` 640px) or any CSS width. */
export type DialogWidth = 'small' | 'medium' | 'large' | 'xlarge' | Exclude<React.CSSProperties['width'], undefined>

/** A named dialog height (`small` 480px, `large` 640px), or `auto` to fit the content. */
export type DialogHeight = 'small' | 'large' | 'auto'

export type DialogPositionValue = 'center' | 'left' | 'right' | 'bottom' | 'fullscreen'

/** Where the dialog sits in the viewport. A responsive object varies it between narrow and regular viewports. */
export type DialogPosition = ResponsiveValue<DialogPositionValue>

/** Vertical alignment of a centered dialog. */
export type DialogAlign = 'top' | 'center' | 'bottom'

type DataAttributes = Record<`data-${string}`, string | undefined>

const widthClassNames = {
  small: 'primer:w-[296px]',
  medium: 'primer:w-[320px]',
  large: 'primer:w-[480px]',
  xlarge: 'primer:w-[640px]',
} as const

const heightClassNames = {
  small: 'primer:h-[480px]',
  large: 'primer:h-[640px]',
  auto: 'primer:h-auto',
} as const satisfies Record<DialogHeight, string>

const sizeClassName = 'primer:min-w-[min(296px,100%)] primer:max-w-[calc(100dvw-64px)] primer:max-h-[calc(100dvh-64px)]'

function isNamedWidth(width: DialogWidth): width is keyof typeof widthClassNames {
  return width === 'small' || width === 'medium' || width === 'large' || width === 'xlarge'
}

/** Sizes a dialog surface. Custom widths go through `--dialog-width` so narrow positions can still override them. */
export function getDialogSize({height, width}: {height: DialogHeight; width: DialogWidth}) {
  const namedWidth = isNamedWidth(width)
  const style: CSSPropertiesWithCustomProperties | undefined = namedWidth
    ? undefined
    : {'--dialog-width': typeof width === 'number' ? `${width}px` : width}
  const dataAttributes: DataAttributes = {
    'data-height': height,
    'data-width': namedWidth ? width : undefined,
  }

  return {
    className: cn(
      sizeClassName,
      namedWidth ? widthClassNames[width] : 'primer:w-[var(--dialog-width)]',
      heightClassNames[height],
    ),
    dataAttributes,
    style,
  }
}

/*
 * A position without a narrow value applies at every width. Otherwise `regular` applies from the `md` breakpoint
 * and `narrow` below it, so the two never compete. Every class is written out for Tailwind's scanner.
 */
type Range = 'all' | 'regular' | 'narrow'

const popupPositionClassNames = {
  all: {
    center: 'primer:data-[starting-style]:scale-50',
    left: 'primer:h-dvh primer:max-h-none primer:rounded-l-none primer:data-[starting-style]:-translate-x-full primer:data-[ending-style]:-translate-x-full',
    right:
      'primer:h-dvh primer:max-h-none primer:rounded-r-none primer:data-[starting-style]:translate-x-full primer:data-[ending-style]:translate-x-full',
    bottom:
      'primer:h-auto primer:w-dvw primer:max-w-dvw primer:rounded-b-none primer:data-[starting-style]:translate-y-full primer:data-[ending-style]:translate-y-full',
    fullscreen:
      'primer:h-full primer:max-h-dvh primer:w-full primer:max-w-dvw primer:grow primer:rounded-none primer:data-[starting-style]:scale-50',
  },
  regular: {
    center: 'primer:md:data-[starting-style]:scale-50',
    left: 'primer:md:h-dvh primer:md:max-h-none primer:md:rounded-l-none primer:md:data-[starting-style]:-translate-x-full primer:md:data-[ending-style]:-translate-x-full',
    right:
      'primer:md:h-dvh primer:md:max-h-none primer:md:rounded-r-none primer:md:data-[starting-style]:translate-x-full primer:md:data-[ending-style]:translate-x-full',
    bottom:
      'primer:md:h-auto primer:md:w-dvw primer:md:max-w-dvw primer:md:rounded-b-none primer:md:data-[starting-style]:translate-y-full primer:md:data-[ending-style]:translate-y-full',
    fullscreen:
      'primer:md:h-full primer:md:max-h-dvh primer:md:w-full primer:md:max-w-dvw primer:md:grow primer:md:rounded-none primer:md:data-[starting-style]:scale-50',
  },
  narrow: {
    center: 'primer:max-md:data-[starting-style]:scale-50',
    left: 'primer:max-md:h-dvh primer:max-md:max-h-none primer:max-md:rounded-l-none primer:max-md:data-[starting-style]:-translate-x-full primer:max-md:data-[ending-style]:-translate-x-full',
    right:
      'primer:max-md:h-dvh primer:max-md:max-h-none primer:max-md:rounded-r-none primer:max-md:data-[starting-style]:translate-x-full primer:max-md:data-[ending-style]:translate-x-full',
    bottom:
      'primer:max-md:h-auto primer:max-md:w-dvw primer:max-md:max-w-dvw primer:max-md:rounded-b-none primer:max-md:data-[starting-style]:translate-y-full primer:max-md:data-[ending-style]:translate-y-full',
    fullscreen:
      'primer:max-md:h-full primer:max-md:max-h-dvh primer:max-md:w-full primer:max-md:max-w-dvw primer:max-md:grow primer:max-md:rounded-none primer:max-md:data-[starting-style]:scale-50',
  },
} as const satisfies Record<Range, Record<DialogPositionValue, string>>

const viewportPositionClassNames = {
  all: {
    center: '',
    left: 'primer:justify-start primer:p-0',
    right: 'primer:justify-end primer:p-0',
    bottom: 'primer:items-end primer:p-0',
    fullscreen: 'primer:p-0',
  },
  regular: {
    center: '',
    left: 'primer:md:justify-start primer:md:p-0',
    right: 'primer:md:justify-end primer:md:p-0',
    bottom: 'primer:md:items-end primer:md:p-0',
    fullscreen: 'primer:md:p-0',
  },
  narrow: {
    center: '',
    left: 'primer:max-md:justify-start primer:max-md:p-0',
    right: 'primer:max-md:justify-end primer:max-md:p-0',
    bottom: 'primer:max-md:items-end primer:max-md:p-0',
    fullscreen: 'primer:max-md:p-0',
  },
} as const satisfies Record<Range, Record<DialogPositionValue, string>>

// The viewport's padding provides the offset, matching the 64px gap of a top- or bottom-aligned Primer dialog.
const viewportAlignClassNames = {
  all: {
    top: 'primer:items-start primer:pt-16 primer:pb-0',
    center: '',
    bottom: 'primer:items-end primer:pt-0 primer:pb-16',
  },
  regular: {
    top: 'primer:md:items-start primer:md:pt-16 primer:md:pb-0',
    center: '',
    bottom: 'primer:md:items-end primer:md:pt-0 primer:md:pb-16',
  },
  narrow: {
    top: 'primer:max-md:items-start primer:max-md:pt-16 primer:max-md:pb-0',
    center: '',
    bottom: 'primer:max-md:items-end primer:max-md:pt-0 primer:max-md:pb-16',
  },
} as const satisfies Record<Range, Record<DialogAlign, string>>

/** Places a dialog in its viewport. `wide` follows `regular`, as in Primer React. */
export function getDialogPosition({align, position}: {align?: DialogAlign; position: DialogPosition}) {
  const regular = typeof position === 'string' ? position : (position.regular ?? 'center')
  const narrow = typeof position === 'string' ? undefined : position.narrow
  const ranges: Array<[Range, DialogPositionValue]> =
    narrow === undefined || narrow === regular
      ? [['all', regular]]
      : [
          ['regular', regular],
          ['narrow', narrow],
        ]
  const dataAttributes: DataAttributes =
    typeof position === 'string'
      ? {'data-position-regular': position}
      : Object.fromEntries(Object.entries(position).map(([viewport, value]) => [`data-position-${viewport}`, value]))
  dataAttributes['data-align'] = align

  return {
    dataAttributes,
    popupClassName: cn(ranges.map(([range, value]) => popupPositionClassNames[range][value])),
    viewportClassName: cn(
      ranges.map(([range, value]) => [
        viewportPositionClassNames[range][value],
        value === 'center' && align && viewportAlignClassNames[range][align],
      ]),
    ),
  }
}
