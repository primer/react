/** Sizes for buttons and other form controls. */
export type ControlSize = 'small' | 'medium' | 'large'

/** Sizes for avatars and avatar-shaped loading placeholders. */
export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge'

/** Sizes for token components. */
export type TokenSize = 'small' | 'medium' | 'large' | 'xlarge'

/** Sizes for body text. */
export type TextSize = 'small' | 'medium' | 'large'

/** Widths on the shared overlay size scale. */
export type OverlayWidth = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'auto'

/** Heights on the shared overlay size scale. */
export type OverlayHeight = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'auto' | 'initial' | 'fit-content'

/** Maximum heights on the shared overlay size scale. */
export type OverlayMaxHeight = Exclude<OverlayHeight, 'auto' | 'initial'>

/** Maximum widths on the shared overlay size scale. */
export type OverlayMaxWidth = Exclude<OverlayWidth, 'auto'>

/** Popover widths, read from the `--overlay-width-*` design tokens. */
export type PopoverWidth = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'auto'

/** Popover heights, read from the `--overlay-height-*` design tokens. */
export type PopoverHeight = 'small' | 'medium' | 'large' | 'xlarge' | 'fit-content' | 'auto'

/** Size constraints for a floating surface, on the shared overlay size scale. */
export interface OverlaySizeProps {
  /** Height of the surface. */
  height?: OverlayHeight
  /** Largest height the surface may grow to before its content scrolls. */
  maxHeight?: OverlayMaxHeight
  /** Largest width the surface may grow to. */
  maxWidth?: OverlayMaxWidth
  /** Width of the surface. */
  width?: OverlayWidth
}
