import {
  Banner as BannerRoot,
  BannerActions,
  BannerDescription,
  BannerPrimaryAction,
  BannerPrimaryActionLink,
  BannerSecondaryAction,
  BannerSecondaryActionLink,
  BannerTitle,
} from './Banner'

export const Banner = Object.assign(BannerRoot, {
  Actions: BannerActions,
  Description: BannerDescription,
  PrimaryAction: BannerPrimaryAction,
  PrimaryActionLink: BannerPrimaryActionLink,
  SecondaryAction: BannerSecondaryAction,
  SecondaryActionLink: BannerSecondaryActionLink,
  Title: BannerTitle,
})

export {
  BannerActions,
  BannerDescription,
  BannerPrimaryAction,
  BannerPrimaryActionLink,
  BannerSecondaryAction,
  BannerSecondaryActionLink,
  BannerTitle,
  type BannerActionsProps,
  type BannerPrimaryActionProps,
  type BannerPrimaryActionLinkProps,
  type BannerProps,
  type BannerSecondaryActionProps,
  type BannerSecondaryActionLinkProps,
  type BannerTitleProps,
  type BannerVariant,
} from './Banner'
