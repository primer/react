import {
  Banner as BannerImpl,
  BannerActions,
  BannerDescription,
  BannerPrimaryAction,
  BannerSecondaryAction,
} from './Banner'
import type {
  BannerProps,
  BannerActionsProps,
  BannerDescriptionProps,
  BannerPrimaryActionProps,
  BannerSecondaryActionProps,
} from './Banner'

export const Banner = Object.assign(BannerImpl, {
  Actions: BannerActions,
  Description: BannerDescription,
  PrimaryAction: BannerPrimaryAction,
  SecondaryAction: BannerSecondaryAction,
})

export type {
  BannerProps,
  BannerActionsProps,
  BannerDescriptionProps,
  BannerPrimaryActionProps,
  BannerSecondaryActionProps,
}
