import {AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './InlineMessage.module.css'
import type {SxProp} from '../sx'
type MessageVariant = 'critical' | 'success' | 'unavailable' | 'warning'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

export type InlineMessageProps = React.ComponentPropsWithoutRef<'div'> &
  SxProp & {
    /**
     * Specify the size of the InlineMessage
     */
    size?: 'small' | 'medium'

    /**
     * Specify the type of the InlineMessage
     */
    variant: MessageVariant
  }

const StyledMessage = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div`
    display: grid;
    column-gap: 0.5rem;
    grid-template-columns: auto 1fr;
    align-items: start;
    color: var(--inline-message-fgColor, ${get('colors.fg.muted')});
    line-height: var(--inline-message-lineHeight);
    font-size: var(--inline-message-fontSize, ${get('fontSizes.1')});

    &[data-size='small'] {
      --inline-message-fontSize: var(--text-body-size-small, ${get('fontSizes.0')});
      --inline-message-lineHeight: var(--text-body-lineHeight-small, 1.6666);
    }

    &[data-size='medium'] {
      --inline-message-fontSize: var(--text-body-size-medium, ${get('fontSizes.1')});
      --inline-message-lineHeight: var(--text-body-lineHeight-medium, 1.4285);
    }

    &[data-variant='warning'] {
      --inline-message-fgColor: ${get('colors.attention.fg')};
    }

    &[data-variant='critical'] {
      --inline-message-fgColor: ${get('colors.danger.fg')};
    }

    &[data-variant='success'] {
      --inline-message-fgColor: ${get('colors.success.fg')};
    }

    &[data-variant='unavailable'] {
      --inline-message-fgColor: ${get('colors.fg.muted')};
    }

    & .InlineMessageIcon {
      min-height: calc(var(--inline-message-lineHeight) * var(--inline-message-fontSize));
    }
  `,
)

const variantToIcon = (enabled: boolean, variant: MessageVariant): React.ReactNode => {
  const icons = {
    warning: <AlertIcon className={enabled ? classes.InlineMessageIcon : 'InlineMessageIcon'} />,
    critical: <AlertIcon className={enabled ? classes.InlineMessageIcon : 'InlineMessageIcon'} />,
    success: <CheckCircleIcon className={enabled ? classes.InlineMessageIcon : 'InlineMessageIcon'} />,
    unavailable: <AlertIcon className={enabled ? classes.InlineMessageIcon : 'InlineMessageIcon'} />,
  }

  return icons[variant]
}

const variantToSmallIcon = (enabled: boolean, variant: MessageVariant): React.ReactNode => {
  const icons = {
    warning: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
    critical: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
    success: <CheckCircleFillIcon className={classes.InlineMessageIcon} size={12} />,
    unavailable: <AlertFillIcon className={classes.InlineMessageIcon} size={12} />,
  }
  return icons[variant]
}

export function InlineMessage({children, className, size = 'medium', variant, ...rest}: InlineMessageProps) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const icon = size === 'small' ? variantToSmallIcon(enabled, variant) : variantToIcon(enabled, variant)
  return (
    <StyledMessage
      className={clsx(className, enabled && classes.InlineMessage)}
      {...rest}
      data-size={size}
      data-variant={variant}
    >
      {icon}
      {children}
    </StyledMessage>
  )
}
