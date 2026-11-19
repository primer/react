import {
  CardImpl,
  CardIcon,
  CardImage,
  CardHeading,
  CardLink,
  CardButton,
  CardDescription,
  CardAction,
  CardMetadata,
} from './Card'
import type {
  CardProps,
  CardIconProps,
  CardImageProps,
  CardHeadingProps,
  CardLinkProps,
  CardButtonProps,
  CardDescriptionProps,
  CardActionProps,
  CardMetadataProps,
} from './Card'

const Card = Object.assign(CardImpl, {
  Icon: CardIcon,
  Image: CardImage,
  Heading: CardHeading,
  Link: CardLink,
  Button: CardButton,
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
  CardLinkProps,
  CardButtonProps,
  CardDescriptionProps,
  CardActionProps,
  CardMetadataProps,
}
