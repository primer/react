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
  inactive,
  labelWrap,
  leadingVisual,
  size,
  variant = 'default',
}: ButtonClassNameOptions) {
  return cn(
    buttonVariants({block, size, variant}),
    variant === 'link' &&
      'inline-flex h-auto min-w-fit rounded-none border-0 p-0 [font-size:inherit] text-[var(--fgColor-link)] shadow-none',
    count !== undefined &&
      leadingVisual &&
      !children &&
      (size === 'small' ? 'px-1' : size === 'large' ? 'px-3' : 'px-2'),
    labelWrap && [
      'h-auto min-w-fit whitespace-normal',
      size === 'small' ? 'min-h-7' : size === 'large' ? 'min-h-10' : 'min-h-8',
    ],
    inactive &&
      'cursor-auto border-[var(--button-inactive-bgColor)] bg-[var(--button-inactive-bgColor)] text-[var(--button-inactive-fgColor)] shadow-none hover:border-[var(--button-inactive-bgColor)] hover:bg-[var(--button-inactive-bgColor)]',
    '[&:has([data-kbd-chord])]:pr-1.5',
    size === 'large' && '[&:has([data-kbd-chord])]:pr-2',
    '[&_[data-kbd-chord]]:transition-colors [&_[data-kbd-chord]]:duration-[80ms]',
    variant === 'default' &&
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-default-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-default-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-default-fgColor-rest)]',
    variant === 'primary' &&
      '[&_[data-component=leadingVisual]]:text-inherit [&_[data-component=trailingVisual]]:text-inherit [&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-primary-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-primary-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-primary-fgColor-rest)]',
    variant === 'danger' &&
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-danger-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-danger-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-danger-fgColor-rest)]',
    variant === 'invisible' &&
      '[&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-invisible-borderColor-rest)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-invisible-bgColor-rest)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-invisible-fgColor-rest)]',
    inactive &&
      '[&_[data-component=leadingVisual]]:text-inherit [&_[data-component=trailingVisual]]:text-inherit [&_[data-component=ButtonCounter]]:text-inherit [&_[data-kbd-chord]]:border-[var(--buttonKeybindingHint-inactive-borderColor)] [&_[data-kbd-chord]]:bg-[var(--buttonKeybindingHint-inactive-bgColor)] [&_[data-kbd-chord]]:text-[var(--buttonKeybindingHint-inactive-fgColor)]',
    className,
  )
}
