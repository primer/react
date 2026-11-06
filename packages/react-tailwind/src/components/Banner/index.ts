import {
  Banner as BannerRoot,
  BannerActions,
  BannerDescription,
  BannerPrimaryAction,
  BannerSecondaryAction,
  BannerTitle,
} from './Banner'

export const Banner = Object.assign(BannerRoot, {
  Actions: BannerActions,
  Description: BannerDescription,
  PrimaryAction: BannerPrimaryAction,
  SecondaryAction: BannerSecondaryAction,
  Title: BannerTitle,
})

export {
  BannerActions,
  BannerDescription,
  BannerPrimaryAction,
  BannerSecondaryAction,
  BannerTitle,
  type BannerActionsProps,
  type BannerPrimaryActionProps,
  type BannerProps,
  type BannerSecondaryActionProps,
  type BannerTitleProps,
  type BannerVariant,
} from './Banner'
