import {AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

type MessageVariant = 'critical' | 'success' | 'unavailable' | 'warning'

export type InlineMessageProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * Specify the size of the InlineMessage
   */
  size?: 'small' | 'medium'

  /**
   * Specify the type of the InlineMessage
   */
  variant: MessageVariant
}

const StyledMessage = styled.div`
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: auto 1fr;
  align-items: start;
  color: var(--inline-message-fgColor, ${get('colors.neutral.emphasis')});
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
    --inline-message-fgColor: ${get('colors.neutral.emphasis')};
  }

  & .InlineMessageIcon {
    min-height: calc(var(--inline-message-lineHeight) * var(--inline-message-fontSize));
  }
`

const variantToIcon: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertIcon className="InlineMessageIcon" />,
  critical: <AlertIcon className="InlineMessageIcon" />,
  success: <CheckCircleIcon className="InlineMessageIcon" />,
  unavailable: <AlertIcon className="InlineMessageIcon" />,
}

const variantToSmallIcon: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertFillIcon className="InlineMessageIcon" size={12} />,
  critical: <AlertFillIcon className="InlineMessageIcon" size={12} />,
  success: <CheckCircleFillIcon className="InlineMessageIcon" size={12} />,
  unavailable: <AlertFillIcon className="InlineMessageIcon" size={12} />,
}

export function InlineMessage({children, size = 'medium', variant, ...rest}: InlineMessageProps) {
  const icon = size === 'small' ? variantToSmallIcon[variant] : variantToIcon[variant]
  return (
    <StyledMessage {...rest} data-size={size} data-variant={variant}>
      {icon}
      {children}
    </StyledMessage>
  )
}
