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
  small: 'w-[296px]',
  medium: 'w-[320px]',
  large: 'w-[480px]',
  xlarge: 'w-[640px]',
} as const

const heightClassNames = {
  small: 'h-[480px]',
  large: 'h-[640px]',
  auto: 'h-auto',
} as const satisfies Record<DialogHeight, string>

const sizeClassName = 'min-w-[296px] max-w-[calc(100dvw-64px)] max-h-[calc(100dvh-64px)]'

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
      namedWidth ? widthClassNames[width] : 'w-[var(--dialog-width)]',
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
    center: 'data-[starting-style]:scale-50',
    left: 'h-dvh max-h-none rounded-l-none data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
    right:
      'h-dvh max-h-none rounded-r-none data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
    bottom:
      'h-auto w-dvw max-w-dvw rounded-b-none data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
    fullscreen: 'h-full max-h-dvh w-full max-w-dvw grow rounded-none data-[starting-style]:scale-50',
  },
  regular: {
    center: 'md:data-[starting-style]:scale-50',
    left: 'md:h-dvh md:max-h-none md:rounded-l-none md:data-[starting-style]:-translate-x-full md:data-[ending-style]:-translate-x-full',
    right:
      'md:h-dvh md:max-h-none md:rounded-r-none md:data-[starting-style]:translate-x-full md:data-[ending-style]:translate-x-full',
    bottom:
      'md:h-auto md:w-dvw md:max-w-dvw md:rounded-b-none md:data-[starting-style]:translate-y-full md:data-[ending-style]:translate-y-full',
    fullscreen:
      'md:h-full md:max-h-dvh md:w-full md:max-w-dvw md:grow md:rounded-none md:data-[starting-style]:scale-50',
  },
  narrow: {
    center: 'max-md:data-[starting-style]:scale-50',
    left: 'max-md:h-dvh max-md:max-h-none max-md:rounded-l-none max-md:data-[starting-style]:-translate-x-full max-md:data-[ending-style]:-translate-x-full',
    right:
      'max-md:h-dvh max-md:max-h-none max-md:rounded-r-none max-md:data-[starting-style]:translate-x-full max-md:data-[ending-style]:translate-x-full',
    bottom:
      'max-md:h-auto max-md:w-dvw max-md:max-w-dvw max-md:rounded-b-none max-md:data-[starting-style]:translate-y-full max-md:data-[ending-style]:translate-y-full',
    fullscreen:
      'max-md:h-full max-md:max-h-dvh max-md:w-full max-md:max-w-dvw max-md:grow max-md:rounded-none max-md:data-[starting-style]:scale-50',
  },
} as const satisfies Record<Range, Record<DialogPositionValue, string>>

const viewportPositionClassNames = {
  all: {center: '', left: 'justify-start p-0', right: 'justify-end p-0', bottom: 'items-end p-0', fullscreen: 'p-0'},
  regular: {
    center: '',
    left: 'md:justify-start md:p-0',
    right: 'md:justify-end md:p-0',
    bottom: 'md:items-end md:p-0',
    fullscreen: 'md:p-0',
  },
  narrow: {
    center: '',
    left: 'max-md:justify-start max-md:p-0',
    right: 'max-md:justify-end max-md:p-0',
    bottom: 'max-md:items-end max-md:p-0',
    fullscreen: 'max-md:p-0',
  },
} as const satisfies Record<Range, Record<DialogPositionValue, string>>

// The viewport's padding provides the offset, matching the 64px gap of a top- or bottom-aligned Primer dialog.
const viewportAlignClassNames = {
  all: {top: 'items-start pt-16 pb-0', center: '', bottom: 'items-end pt-0 pb-16'},
  regular: {top: 'md:items-start md:pt-16 md:pb-0', center: '', bottom: 'md:items-end md:pt-0 md:pb-16'},
  narrow: {
    top: 'max-md:items-start max-md:pt-16 max-md:pb-0',
    center: '',
    bottom: 'max-md:items-end max-md:pt-0 max-md:pb-16',
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
