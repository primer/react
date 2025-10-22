import {EyeIcon, ChevronRightIcon, HeartIcon, DownloadIcon} from '@primer/octicons-react'
import {LinkButton} from '.'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'

export default {
  title: 'Components/LinkButton/Features',
}

export const Primary = () => (
  <LinkButton href="#" variant="primary">
    Primary
  </LinkButton>
)

export const Danger = () => (
  <LinkButton href="#" variant="danger">
    Danger
  </LinkButton>
)

export const Invisible = () => (
  <LinkButton href="#" variant="invisible">
    Invisible
  </LinkButton>
)

export const Link = () => (
  <LinkButton href="#" variant="link">
    Button that looks like a link
  </LinkButton>
)

export const LeadingVisual = () => (
  <LinkButton href="#" leadingVisual={HeartIcon}>
    Leading visual
  </LinkButton>
)

export const TrailingVisual = () => (
  <LinkButton href="#" trailingVisual={EyeIcon}>
    Trailing visual
  </LinkButton>
)

export const TrailingAction = () => (
  <LinkButton href="#" trailingAction={ChevronRightIcon}>
    Trailing action
  </LinkButton>
)

export const Block = () => (
  <LinkButton href="#" block>
    Default
  </LinkButton>
)

export const Small = () => (
  <LinkButton href="#" size="small">
    Default
  </LinkButton>
)

export const Medium = () => (
  <LinkButton href="#" size="medium">
    Default
  </LinkButton>
)

export const Large = () => (
  <LinkButton href="#" size="large">
    Default
  </LinkButton>
)

export const WithReactRouter = () => (
  <LinkButton to="/dummy" as={ReactRouterLikeLink}>
    Default
  </LinkButton>
)

export const Loading = () => <LinkButton loading>Default</LinkButton>

export const LoadingCustomAnnouncement = () => (
  <LinkButton href="#" loading loadingAnnouncement="This is a custom loading announcement">
    Default
  </LinkButton>
)

export const LoadingWithLeadingVisual = () => (
  <LinkButton href="#" loading leadingVisual={DownloadIcon}>
    Export
  </LinkButton>
)

export const LoadingWithTrailingVisual = () => (
  <LinkButton href="#" loading trailingVisual={DownloadIcon}>
    Export
  </LinkButton>
)
