import {
  Banner as BannerImpl,
  BannerTitle,
  BannerDescription,
  BannerPrimaryAction,
  BannerSecondaryAction,
} from './Banner'
import type {
  BannerProps,
  BannerTitleProps,
  BannerDescriptionProps,
  BannerPrimaryActionProps,
  BannerSecondaryActionProps,
} from './Banner'

export const Banner = Object.assign(BannerImpl, {
  Title: BannerTitle,
  Description: BannerDescription,
  PrimaryAction: BannerPrimaryAction,
  SecondaryAction: BannerSecondaryAction,
})

export type {
  BannerProps,
  BannerTitleProps,
  BannerDescriptionProps,
  BannerPrimaryActionProps,
  BannerSecondaryActionProps,
}
