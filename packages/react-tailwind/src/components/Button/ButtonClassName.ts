import type React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import type {ButtonVisual} from './ButtonVisual'
import {buttonVariants} from './styles'

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'invisible' | 'link'

interface ButtonClassNameOptions {
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
      (size === 'small' ? 'px-1' : size === 'large' ? 'px-3' : 'px-2'),
    labelWrap && [
      'h-auto min-w-fit whitespace-normal',
      size === 'small' ? 'min-h-7' : size === 'large' ? 'min-h-10' : 'min-h-8',
    ],
    '[&:has([data-kbd-chord])]:pr-1.5',
    size === 'large' && '[&:has([data-kbd-chord])]:pr-2',
    '[&_[data-kbd-chord]]:transition-colors [&_[data-kbd-chord]]:duration-[80ms]',
    // Counters and keybinding hints follow the button's state from the root, like Primer's `.CounterLabel` and
    // `[data-kbd-chord]` rules. Disabled selectors outrank hover and pressed ones.
    '[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-component=ButtonCounter]]:text-inherit',
    variant === 'default' && [
      '[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-default-bgColor-rest)]',
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-default-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-default-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-default-fgColor-rest)]',
      '[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-default-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-default-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-default-fgColor-disabled)]',
    ],
    variant === 'primary' && [
      '[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-primary-bgColor-rest)] [&_[data-component=ButtonCounter]]:text-[var(--button-primary-fgColor-rest)]!',
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-primary-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-primary-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-primary-fgColor-rest)]',
      '[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-primary-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-primary-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-primary-fgColor-disabled)]',
    ],
    variant === 'danger' && [
      '[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-rest)] [&_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-rest)]',
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-rest)]',
      !inactive &&
        'hover:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-hover)] hover:[&_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-hover)] active:[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-hover)] active:[&_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-hover)]',
      !inactive &&
        'hover:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-hover)] hover:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-hover)] hover:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-hover)] active:[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-active)] active:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-active)] active:[&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-active)]',
      '[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-danger-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-component=ButtonCounter]]:text-[var(--buttonCounter-danger-fgColor-disabled)]',
      '[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-disabled)]',
    ],
    variant === 'invisible' && [
      '[&_[data-component=ButtonCounter]]:bg-[var(--buttonCounter-invisible-bgColor-rest)]',
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-invisible-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-invisible-fgColor-rest)]',
      !inactive &&
        'hover:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-hover)] active:[&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-active)]',
      '[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-invisible-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-invisible-fgColor-disabled)]',
    ],
    inactive &&
      '[&_[data-component=ButtonCounter]]:text-inherit! [&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-inactive-borderColor)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-inactive-bgColor)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-inactive-fgColor)]',
    className,
  )
}
