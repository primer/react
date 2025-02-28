import type {Meta} from '@storybook/react'
import ActionList2 from './ActionList2'
import {StarIcon} from '@primer/octicons-react'
import {forwardRef} from 'react'
import React from 'react'

const meta: Meta = {
  title: 'Components/ActionList2/Examples',
  component: ActionList2,
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

export function Links(): JSX.Element {
  return (
    <ActionList2
      showDividers
      items={[
        {label: 'not a link, just an Item for comparison'},
        {label: 'basic link', link: {href: 'https://github.com/primer', target: '_blank', rel: 'noopener noreferrer'}},
        {
          label: 'react router link',
          link: {
            href: 'https://github.com/primer',
          },
          renderLabel: props => <ReactRouterLikeLink to={props.link?.href ?? '/'}>{props.label}</ReactRouterLikeLink>,
        },
        {
          label: 'next js link',
          link: {
            href: '?path=/story/components-actionlist--default',
          },
          renderLabel: props => (
            <NextJSLikeLink href={props.link?.href ?? '/'}>
              <a>{props.label}</a>
            </NextJSLikeLink>
          ),
        },
      ]}
    />
  )
}

export function AllCombinations(): JSX.Element {
  return (
    <ActionList2
      showDividers
      items={[
        {
          label: 'The everything bagel',
          leadingVisual: <StarIcon />,
          inlineDescription: 'inline description',
          blockDescription: 'block description',
          trailingVisual: <StarIcon />,
        },
        {label: 'none of them, only text'},
        {label: 'only L', leadingVisual: <StarIcon />},
        {label: 'only I', inlineDescription: 'inline description'},
        {label: 'only B', blockDescription: 'block description'},
        {label: 'only T', trailingVisual: <StarIcon />},
        {label: 'L and I', leadingVisual: <StarIcon />, inlineDescription: 'inline description'},
        {label: 'L and B', leadingVisual: <StarIcon />, blockDescription: 'block description'},
        {label: 'L and T', leadingVisual: <StarIcon />, trailingVisual: <StarIcon />},
        {label: 'I and B', inlineDescription: 'inline description', blockDescription: 'block description'},
        {label: 'I and T', inlineDescription: 'inline description', trailingVisual: <StarIcon />},
        {label: 'B and T', blockDescription: 'block description', trailingVisual: <StarIcon />},
        {
          label: 'L, I, and B',
          leadingVisual: <StarIcon />,
          inlineDescription: 'inline description',
          blockDescription: 'block description',
        },
        {
          label: 'L, I, and T',
          leadingVisual: <StarIcon />,
          inlineDescription: 'inline description',
          trailingVisual: <StarIcon />,
        },
        {
          label: 'L, B, and T',
          leadingVisual: <StarIcon />,
          blockDescription: 'block description',
          trailingVisual: <StarIcon />,
        },
        {
          label: 'I, B, and T',
          inlineDescription: 'inline description',
          blockDescription: 'block description',
          trailingVisual: <StarIcon />,
        },
        {
          label: 'L, I, B, and T',
          leadingVisual: <StarIcon />,
          inlineDescription: 'inline description',
          blockDescription: 'block description',
          trailingVisual: <StarIcon />,
        },
      ]}
    />
  )
}

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

const NextJSLikeLink = forwardRef(
  ({href, children}: {href: string; children: React.ReactNode}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)
