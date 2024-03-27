import {AlertIcon, StopIcon, IssueClosedIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {Announce} from '../internal/components/Announce'
import {get} from '../constants'

type MessageVariant = 'warning' | 'critical' | 'success' | 'unavailable'

export type InlineMessageProps = React.ComponentPropsWithoutRef<'div'> & {
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
  font-size: ${get('fontSizes.1')};
  line-height: calc(20 / 14);

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

export function InlineMessage({children, variant, ...rest}: InlineMessageProps) {
  const icon = variantToIcon[variant]
  return (
    <Announce
      {...rest}
      as={StyledMessage}
      data-variant={variant}
      politeness={variant === 'critical' ? 'assertive' : 'polite'}
    >
      {icon}
      {children}
    </Announce>
  )
}
