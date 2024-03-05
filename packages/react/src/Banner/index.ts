import {
  Banner as BannerImpl,
  BannerContent,
  BannerTitle,
  BannerActions,
  BannerDescription,
  BannerPrimaryAction,
  BannerSecondaryAction,
} from './Banner'
import type {
  BannerProps,
  BannerContentProps,
  BannerTitleProps,
  BannerActionsProps,
  BannerDescriptionProps,
  BannerPrimaryActionProps,
  BannerSecondaryActionProps,
} from './Banner'

export const Banner = Object.assign(BannerImpl, {
  Content: BannerContent,
  Actions: BannerActions,
  Title: BannerTitle,
  Description: BannerDescription,
  PrimaryAction: BannerPrimaryAction,
  SecondaryAction: BannerSecondaryAction,
})

export type {
  BannerProps,
  BannerContentProps,
  BannerTitleProps,
  BannerActionsProps,
  BannerDescriptionProps,
  BannerPrimaryActionProps,
  BannerSecondaryActionProps,
}
