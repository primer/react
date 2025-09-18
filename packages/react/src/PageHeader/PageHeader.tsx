import React, {useEffect} from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import type {LinkProps as BaseLinkProps} from '../Link'
import Link from '../Link'

import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import type {BetterSystemStyleObject} from '../sx'
import {useProvidedRefOrCreate} from '../hooks/useProvidedRefOrCreate'
import {get} from '../constants'
import {VisuallyHidden} from '../_VisuallyHidden'

type AriaRole = React.AriaRole

export interface PageHeaderProps {
  'aria-label'?: string
  as?: React.ElementType
  hidden?: ResponsiveValue<boolean>
  role?: AriaRole
  hasBorder?: boolean
}

function getHiddenDataAttributes(hidden?: ResponsiveValue<boolean>) {
  return hidden === undefined
    ? {}
    : {
        'data-hidden': hidden,
      }
}

const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PageHeaderProps>>(
  ({children, as = 'div', 'aria-label': ariaLabel, role, hasBorder}, forwardedRef) => {
    const rootRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef as React.RefObject<HTMLDivElement>)

    useEffect(() => {
      if (!__DEV__) return
      if (!rootRef.current) return
      const count = rootRef.current.childNodes.length
      if (count === 0) {
        // eslint-disable-next-line no-console
        console.warn('PageHeader: no child nodes found.')
      }
    }, [children, rootRef])

    return (
      <div
        ref={rootRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          borderBottom: hasBorder ? '1px solid #d0d7de' : undefined,
        }}
        aria-label={ariaLabel}
        role={role}
      >
        {children}
      </div>
    )
  },
)

const ContextArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, hidden}) => {
  const hiddenVal = useResponsiveValue(hidden)
  if (hiddenVal) return null

  return (
    <div
      style={{
        marginTop: '8px',
        color: '#57606a',
        fontSize: '14px',
      }}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

export type PageHeaderLeadingActionProps = PageHeaderProps & {
  href?: string
} & (
    | {
        icon?: never
        'aria-label'?: string
      }
    | {
        icon: React.ElementType
        'aria-label': string
      }
  )

const LeadingAction: React.FC<PageHeaderLeadingActionProps> = ({
  children,
  hidden,
  href,
  'aria-label': ariaLabel,
  icon: Icon = ArrowLeftIcon,
}) => {
  const hiddenVal = useResponsiveValue(hidden)
  if (hiddenVal) return null

  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: '#0969da',
        fontSize: '14px',
        textDecoration: 'none',
        marginRight: '12px',
      }}
      {...getHiddenDataAttributes(hidden)}
    >
      {Icon && (
        <Icon
          size={16}
          style={{marginRight: '4px'}}
          aria-hidden="true"
        />
      )}
      {ariaLabel ? <VisuallyHidden>{ariaLabel}</VisuallyHidden> : children}
    </Link>
  )
}

const TitleArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, hidden}) => {
  const hiddenVal = useResponsiveValue(hidden)
  if (hiddenVal) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
      }}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

export type PageHeaderTitleProps = React.PropsWithChildren<PageHeaderProps> & {
  variant?: 'large' | 'medium' | 'small'
}

const Title: React.FC<PageHeaderTitleProps> = ({children, hidden, variant = 'large'}) => {
  const hiddenVal = useResponsiveValue(hidden)
  if (hiddenVal) return null

  const fontSizes = {
    large: get('fontSizes.4'), // 24px
    medium: get('fontSizes.3'), // 20px
    small: get('fontSizes.2'), // 16px
  }

  return (
    <Heading
      as="h1"
      style={{
        fontSize: fontSizes[variant],
        fontWeight: 600,
        margin: 0,
        lineHeight: 1.2,
      }}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </Heading>
  )
}

const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, hidden}) => {
  const hiddenVal = useResponsiveValue(hidden)
  if (hiddenVal) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginTop: '8px',
        justifyContent: 'flex-end',
      }}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

export const PageHeader = Object.assign(Root, {
  ContextArea,
  LeadingAction,
  TitleArea,
  Title,
  Actions,
})

export type PageHeaderComponent = PolymorphicForwardRefComponent<'div', PageHeaderProps & {sx?: BetterSystemStyleObject}>
