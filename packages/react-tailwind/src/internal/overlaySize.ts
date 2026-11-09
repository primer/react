import type {
  OverlayHeight,
  OverlayMaxHeight,
  OverlayMaxWidth,
  OverlaySizeProps,
  OverlayWidth,
} from '../utils/types/size'
import {cn} from './cn'

export const overlayWidthClassNames = {
  small: 'primer:w-64',
  medium: 'primer:w-80',
  large: 'primer:w-[30rem]',
  xlarge: 'primer:w-[40rem]',
  xxlarge: 'primer:w-[60rem]',
  auto: 'primer:w-auto',
} as const satisfies Record<OverlayWidth, string>

export const overlayHeightClassNames = {
  xsmall: 'primer:h-48',
  small: 'primer:h-64',
  medium: 'primer:h-80',
  large: 'primer:h-[27rem]',
  xlarge: 'primer:h-[37.5rem]',
  auto: 'primer:h-auto',
  initial: 'primer:h-auto',
  'fit-content': 'primer:h-fit',
} as const satisfies Record<OverlayHeight, string>

export const overlayMaxHeightClassNames = {
  xsmall: 'primer:max-h-[min(12rem,100dvh)]',
  small: 'primer:max-h-[min(16rem,100dvh)]',
  medium: 'primer:max-h-[min(20rem,100dvh)]',
  large: 'primer:max-h-[min(27rem,100dvh)]',
  xlarge: 'primer:max-h-[min(37.5rem,100dvh)]',
  'fit-content': 'primer:max-h-fit',
} as const satisfies Record<OverlayMaxHeight, string>

export const overlayMaxWidthClassNames = {
  small: 'primer:max-w-64',
  medium: 'primer:max-w-80',
  large: 'primer:max-w-[30rem]',
  xlarge: 'primer:max-w-[40rem]',
  xxlarge: 'primer:max-w-[60rem]',
} as const satisfies Record<OverlayMaxWidth, string>

const availableOverlayWidthClassNames = {
  small: 'primer:w-[min(--spacing(64),var(--available-width,100vw))]',
  medium: 'primer:w-[min(--spacing(80),var(--available-width,100vw))]',
  large: 'primer:w-[min(30rem,var(--available-width,100vw))]',
  xlarge: 'primer:w-[min(40rem,var(--available-width,100vw))]',
  xxlarge: 'primer:w-[min(60rem,var(--available-width,100vw))]',
  auto: 'primer:w-auto',
} as const satisfies Record<OverlayWidth, string>

export function overlayAvailableWidthClassName(width?: OverlayWidth) {
  return width && availableOverlayWidthClassNames[width]
}

/** Classes for the shared overlay size scale; unset constraints leave the surface's own sizing in place. */
export function overlaySizeClassName({height, maxHeight, maxWidth, width}: OverlaySizeProps) {
  return cn(
    width && overlayWidthClassNames[width],
    height && overlayHeightClassNames[height],
    maxHeight && overlayMaxHeightClassNames[maxHeight],
    maxWidth && overlayMaxWidthClassNames[maxWidth],
  )
}
