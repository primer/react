import {EyeIcon, ChevronRightIcon, HeartIcon, DownloadIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import {Button} from '.'

export default {
  title: 'Components/LinkButton/Features',
}

export const Primary = () => (
  <Button as="a" href="/" variant="primary">
    Primary
  </Button>
)

export const Danger = () => (
  <Button as="a" href="/" variant="danger">
    Danger
  </Button>
)

export const Invisible = () => (
  <Button as="a" href="/" variant="invisible">
    Invisible
  </Button>
)

export const LeadingVisual = () => (
  <Button as="a" href="/" leadingVisual={HeartIcon}>
    Leading visual
  </Button>
)

export const TrailingVisual = () => (
  <Button as="a" href="/" trailingVisual={EyeIcon}>
    Trailing visual
  </Button>
)

export const TrailingAction = () => (
  <Button as="a" href="/" trailingAction={ChevronRightIcon}>
    Trailing action
  </Button>
)

export const Block = () => (
  <Button as="a" href="/" block>
    Default
  </Button>
)

export const Small = () => (
  <Button as="a" href="/" size="small">
    Default
  </Button>
)

export const Medium = () => (
  <Button as="a" href="/" size="medium">
    Default
  </Button>
)

export const Large = () => (
  <Button as="a" href="/" size="large">
    Default
  </Button>
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
  <Button to="/dummy" as={ReactRouterLikeLink}>
    Default
  </Button>
)

export const Loading = () => <Button loading>Default</Button>

export const LoadingCustomAnnouncement = () => (
  <Button as="a" href="/" loading loadingAnnouncement="This is a custom loading announcement">
    Default
  </Button>
)

export const LoadingWithLeadingVisual = () => (
  <Button as="a" href="/" loading leadingVisual={DownloadIcon}>
    Export
  </Button>
)

export const LoadingWithTrailingVisual = () => (
  <Button as="a" href="/" loading trailingVisual={DownloadIcon}>
    Export
  </Button>
)
