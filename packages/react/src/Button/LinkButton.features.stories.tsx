import {EyeIcon, ChevronRightIcon, HeartIcon} from '@primer/octicons-react'
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

export const Outline = () => (
  <Button as="a" href="/" variant="outline">
    Invisible
  </Button>
)

export const LeadingVisual = () => (
  <Button as="a" href="/" leadingIcon={HeartIcon}>
    Leading visual
  </Button>
)

export const TrailingVisual = () => (
  <Button as="a" href="/" trailingIcon={EyeIcon}>
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
  ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={ref} href={to} {...props} />
  },
)

export const WithReactRouter = () => (
  <Button to="/dummy" as={ReactRouterLikeLink}>
    Default
  </Button>
)
