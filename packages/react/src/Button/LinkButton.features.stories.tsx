import {EyeIcon, ChevronRightIcon, HeartIcon, DownloadIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import {LinkButton} from '.'

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

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, children, ...props}: {to: string; children: React.ReactNode}, ref) => {
    return (
      <a ref={ref} href={to} {...props}>
        {children}
      </a>
    )
  },
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
