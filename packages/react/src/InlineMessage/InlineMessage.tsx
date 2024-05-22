import {AlertIcon, StopIcon, IssueClosedIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

type MessageVariant = 'warning' | 'critical' | 'success' | 'unavailable'

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
  color: var(--inline-message-fgColor, ${get('colors.neutral.emphasis')});

  &[data-size='small'] {
    font-size: var(--text-body-size-small, ${get('fontSizes.0')});
    line-height: var(--text-body-lineHeight-small, 1.6666);
  }

  &[data-size='medium'] {
    font-size: var(--text-body-size-medium, ${get('fontSizes.1')});
    line-height: var(--text-body-lineHeight-medium, 1.4285);
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
    /* This height value matches the line-height of the text */
    min-height: 1.25rem;
  }
`

const variantToIcon: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertIcon className="InlineMessageIcon" />,
  critical: <StopIcon className="InlineMessageIcon" />,
  success: <IssueClosedIcon className="InlineMessageIcon" />,
  unavailable: <AlertIcon className="InlineMessageIcon" />,
}

export function InlineMessage({children, size = 'medium', variant, ...rest}: InlineMessageProps) {
  const icon = variantToIcon[variant]
  return (
    <StyledMessage {...rest} data-size={size} data-variant={variant}>
      {icon}
      {children}
    </StyledMessage>
  )
}
