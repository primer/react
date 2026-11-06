import type {
  OverlayHeight,
  OverlayMaxHeight,
  OverlayMaxWidth,
  OverlaySizeProps,
  OverlayWidth,
} from '../utils/types/size'
import {cn} from './cn'

export const overlayWidthClassNames = {
  small: 'w-64',
  medium: 'w-80',
  large: 'w-[30rem]',
  xlarge: 'w-[40rem]',
  xxlarge: 'w-[60rem]',
  auto: 'w-auto',
} as const satisfies Record<OverlayWidth, string>

export const overlayHeightClassNames = {
  xsmall: 'h-48',
  small: 'h-64',
  medium: 'h-80',
  large: 'h-[27rem]',
  xlarge: 'h-[37.5rem]',
  auto: 'h-auto',
  initial: 'h-auto',
  'fit-content': 'h-fit',
} as const satisfies Record<OverlayHeight, string>

export const overlayMaxHeightClassNames = {
  xsmall: 'max-h-[min(12rem,100dvh)]',
  small: 'max-h-[min(16rem,100dvh)]',
  medium: 'max-h-[min(20rem,100dvh)]',
  large: 'max-h-[min(27rem,100dvh)]',
  xlarge: 'max-h-[min(37.5rem,100dvh)]',
  'fit-content': 'max-h-fit',
} as const satisfies Record<OverlayMaxHeight, string>

export const overlayMaxWidthClassNames = {
  small: 'max-w-64',
  medium: 'max-w-80',
  large: 'max-w-[30rem]',
  xlarge: 'max-w-[40rem]',
  xxlarge: 'max-w-[60rem]',
} as const satisfies Record<OverlayMaxWidth, string>

/** Classes for the shared overlay size scale; unset constraints leave the surface's own sizing in place. */
export function overlaySizeClassName({height, maxHeight, maxWidth, width}: OverlaySizeProps) {
  return cn(
    width && overlayWidthClassNames[width],
    height && overlayHeightClassNames[height],
    maxHeight && overlayMaxHeightClassNames[maxHeight],
    maxWidth && overlayMaxWidthClassNames[maxWidth],
  )
}
