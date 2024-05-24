import {AlertIcon, AlertFillIcon, IssueClosedIcon, FeedIssueClosedIcon} from '@primer/octicons-react'
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
  align-items: center;
  color: var(--inline-message-fgColor, ${get('colors.neutral.emphasis')});
  line-height: var(--inline-message-lineHeight);

  &[data-size='small'] {
    font-size: var(--text-body-size-small, ${get('fontSizes.0')});
    --inline-message-lineHeight: var(--text-body-lineHeight-small, 1.6666);
  }

  &[data-size='medium'] {
    font-size: var(--text-body-size-medium, ${get('fontSizes.1')});
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
    /* This height value needs to match the line-height of the text */
    min-height: var(--inline-message-lineHeight);
  }
`

const variantToIcon: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertIcon className="InlineMessageIcon" />,
  critical: <AlertIcon className="InlineMessageIcon" />,
  success: <IssueClosedIcon className="InlineMessageIcon" />,
  unavailable: <AlertIcon className="InlineMessageIcon" />,
}

const variantToFilledIcon: Record<MessageVariant, React.ReactNode> = {
  warning: <AlertFillIcon className="InlineMessageIcon" />,
  critical: <AlertFillIcon className="InlineMessageIcon" />,
  success: <FeedIssueClosedIcon className="InlineMessageIcon" />,
  unavailable: <AlertFillIcon className="InlineMessageIcon" />,
}

export function InlineMessage({children, size = 'medium', variant, ...rest}: InlineMessageProps) {
  // When the `InlineMessage` is small, use the fill variant of icons
  const icon = size === 'small' ? variantToFilledIcon[variant] : variantToIcon[variant]
  return (
    <StyledMessage {...rest} data-size={size} data-variant={variant}>
      {icon}
      {children}
    </StyledMessage>
  )
}
