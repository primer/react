import {Card as CardRoot, CardAction, CardDescription, CardHeading, CardIcon, CardImage, CardMetadata} from './Card'

export const Card = Object.assign(CardRoot, {
  Action: CardAction,
  Description: CardDescription,
  Heading: CardHeading,
  Icon: CardIcon,
  Image: CardImage,
  Metadata: CardMetadata,
})

export {
  CardAction,
  CardDescription,
  CardHeading,
  CardIcon,
  CardImage,
  CardMetadata,
  type CardHeadingProps,
  type CardIconProps,
  type CardImageProps,
  type CardProps,
} from './Card'
