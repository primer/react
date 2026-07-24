import {Banner as BannerRoot, BannerActions, BannerDescription, BannerTitle} from './Banner'

export const Banner = Object.assign(BannerRoot, {
  Actions: BannerActions,
  Description: BannerDescription,
  Title: BannerTitle,
})

export {
  BannerActions,
  BannerDescription,
  BannerTitle,
  type BannerActionsProps,
  type BannerProps,
  type BannerTitleProps,
  type BannerVariant,
} from './Banner'
