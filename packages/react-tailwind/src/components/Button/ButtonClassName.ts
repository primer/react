import type React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import type {ButtonVisual} from './ButtonVisual'
import {buttonVariants} from './styles'

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'invisible' | 'link'

interface ButtonClassNameOptions {
  autoWrapInActions?: boolean
  block?: boolean
  children?: React.ReactNode
  className?: string
  count?: number | string
  inactive?: boolean
  labelWrap?: boolean
  leadingVisual?: ButtonVisual
  size?: ControlSize
  variant?: ButtonVariant
}

export function getButtonClassName({
  autoWrapInActions = false,
  block,
  children,
  className,
  count,
  inactive = false,
  labelWrap,
  leadingVisual,
  size,
  variant = 'default',
}: ButtonClassNameOptions) {
  return cn(
    buttonVariants({block, inactive, size, variant}),
    count !== undefined &&
      leadingVisual &&
      !children &&
      (size === 'small' ? 'primer:px-1' : size === 'large' ? 'primer:px-3' : 'primer:px-2'),
    labelWrap && [
      'primer:h-auto primer:min-w-fit primer:whitespace-normal',
      size === 'small' ? 'primer:min-h-7' : size === 'large' ? 'primer:min-h-10' : 'primer:min-h-8',
    ],
    autoWrapInActions &&
      labelWrap === undefined &&
      variant !== 'link' && [
        'primer:min-w-[var(--primer-action-min-width,max-content)]',
        size === 'small'
          ? 'primer:h-[var(--primer-action-height,--spacing(7))] primer:min-h-[var(--primer-action-min-height-small,auto)]'
          : size === 'large'
            ? 'primer:h-[var(--primer-action-height,--spacing(10))] primer:min-h-[var(--primer-action-min-height-large,auto)]'
            : 'primer:h-[var(--primer-action-height,--spacing(8))] primer:min-h-[var(--primer-action-min-height-medium,auto)]',
      ],
    'primer:[&:has([data-kbd-chord])]:pr-1.5',
    size === 'large' && 'primer:[&:has([data-kbd-chord])]:pr-2',
    'primer:[&_[data-kbd-chord]]:transition-colors primer:[&_[data-kbd-chord]]:duration-[80ms]',
    // Counters and keybinding hints follow the button's state from the root, like Primer's `.CounterLabel` and
    // `[data-kbd-chord]` rules. Disabled selectors outrank hover and pressed ones.
    'primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-component=ButtonCounter]]:text-inherit',
    variant === 'default' && [
      'primer:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-default-bgColor-rest)]',
      'primer:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-default-borderColor-rest)] primer:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-default-bgColor-rest)] primer:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-default-fgColor-rest)]',
      'primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-default-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-default-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-default-fgColor-disabled)]',
    ],
    variant === 'primary' && [
      'primer:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-primary-bgColor-rest)] primer:[&_[data-component=ButtonCounter]]:text-[var(--button-primary-fgColor-rest)]!',
      'primer:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-primary-borderColor-rest)] primer:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-primary-bgColor-rest)] primer:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-primary-fgColor-rest)]',
      'primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-primary-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-primary-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-primary-fgColor-disabled)]',
    ],
    variant === 'danger' && [
      'primer:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-rest)] primer:[&_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-rest)]',
      'primer:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-rest)] primer:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-rest)] primer:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-rest)]',
      !inactive &&
        'primer:hover:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-hover)] primer:hover:[&_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-hover)] primer:active:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-hover)] primer:active:[&_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-hover)]',
      !inactive &&
        'primer:hover:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-hover)] primer:hover:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-hover)] primer:hover:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-hover)] primer:active:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-active)] primer:active:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-active)] primer:active:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-active)]',
      'primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-disabled)]',
      'primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-disabled)]',
    ],
    variant === 'invisible' && [
      'primer:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-invisible-bgColor-rest)]',
      'primer:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-invisible-borderColor-rest)] primer:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-rest)] primer:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-invisible-fgColor-rest)]',
      !inactive &&
        'primer:hover:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-hover)] primer:active:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-active)]',
      'primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-invisible-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-invisible-fgColor-disabled)]',
    ],
    inactive &&
      'primer:[&_[data-component=ButtonCounter]]:text-inherit! primer:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-inactive-borderColor)] primer:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-inactive-bgColor)] primer:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-inactive-fgColor)]',
    className,
  )
}
