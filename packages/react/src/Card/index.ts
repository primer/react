import {CardImpl, CardIcon, CardImage, CardHeading, CardDescription, CardMenu, CardMetadata} from './Card'
import type {
  CardProps,
  CardIconProps,
  CardImageProps,
  CardHeadingProps,
  CardDescriptionProps,
  CardMenuProps,
  CardMetadataProps,
} from './Card'

const Card = Object.assign(CardImpl, {
  Icon: CardIcon,
  Image: CardImage,
  Heading: CardHeading,
  Description: CardDescription,
  Menu: CardMenu,
  Metadata: CardMetadata,
})

export {Card}
export type {
  CardProps,
  CardIconProps,
  CardImageProps,
  CardHeadingProps,
  CardDescriptionProps,
  CardMenuProps,
  CardMetadataProps,
}
