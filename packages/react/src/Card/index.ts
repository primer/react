import {CardImpl, CardIcon, CardImage, CardHeading, CardDescription, CardAction, CardMetadata} from './Card'
import type {
  CardProps,
  CardIconProps,
  CardImageProps,
  CardHeadingProps,
  CardDescriptionProps,
  CardActionProps,
  CardMetadataProps,
} from './Card'

const Card = Object.assign(CardImpl, {
  Icon: CardIcon,
  Image: CardImage,
  Heading: CardHeading,
  Description: CardDescription,
  Action: CardAction,
  Metadata: CardMetadata,
})

export {Card}
export type {
  CardProps,
  CardIconProps,
  CardImageProps,
  CardHeadingProps,
  CardDescriptionProps,
  CardActionProps,
  CardMetadataProps,
}
