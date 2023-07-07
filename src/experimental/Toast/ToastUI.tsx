import React from 'react'
import {CheckIcon, AlertIcon, StopIcon, InfoIcon, XIcon} from '@primer/octicons-react'

import {Spinner, Box, IconButton} from '../..'

const variants = ['default', 'success', 'attention', 'danger', 'loading'] as const

const icon: Record<ToastVariants, React.ReactNode> = {
  default: <InfoIcon size="small" />,
  success: <CheckIcon size="small" />,
  attention: <AlertIcon size="small" />,
  danger: <StopIcon size="small" />,
  loading: <Spinner size="small" />,
}

export const ToastUI = ({
  dismissible = false,
  variant = 'default',
  role = 'status',
  dismissLabel = 'Dismiss this message',
  children,
}: React.PropsWithChildren<ToastUIProps>) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.assert(
      variants.includes(variant),
      `The variant ${variant} is not supported. Use one of ${variants.join(', ')}`,
    )
  }

  return (
    <Box role={role} sx={{display: 'flex', justifyContent: 'flex-start'}}>
      <Box
        sx={{display: 'inline-flex', maxWidth: '450px', borderRadius: 2, boxShadow: 'shadow.large', overflow: 'hidden'}}
      >
        <Box
          sx={{
            display: 'flex',
            justifyItems: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
            border: '1px solid',
            borderColor: 'border.default',
            borderInlineEnd: 'none',
            p: 3,
            color: 'fg.onEmphasis',
            '&[data-variant="default"]': {
              backgroundColor: 'accent.emphasis',
              borderColor: 'accent.emphasis',
            },
            '&[data-variant="success"]': {
              backgroundColor: 'success.emphasis',
              borderColor: 'success.emphasis',
            },
            '&[data-variant="attention"]': {
              backgroundColor: 'attention.emphasis',
              borderColor: 'attention.emphasis',
            },
            '&[data-variant="danger"]': {
              backgroundColor: 'danger.emphasis',
              borderColor: 'danger.emphasis',
            },
            '&[data-variant="loading"]': {
              backgroundColor: 'neutral.emphasis',
              borderColor: 'neutral.emphasis',
            },
          }}
          role="presentation"
          data-variant={variant}
        >
          {icon[variant]}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: dismissible ? 'auto 1fr' : '1fr',
            alignItems: 'center',
            gap: 3,
            justifyContent: 'space-between',
            borderBottomRightRadius: 2,
            borderTopRightRadius: 2,
            border: '1px solid',
            borderColor: 'border.default',
            borderInlineStart: 'none',
            px: 3,
            paddingRight: dismissible ? 2 : 3,
          }}
        >
          <Box
            sx={{
              /* we margin to allow for margin collapsing when user-land uses as the children <Text as="p" /> */
              marginY: 3,
            }}
          >
            {children}
          </Box>
          {dismissible && (
            <IconButton
              aria-label={dismissLabel}
              icon={XIcon}
              variant="invisible"
              sx={{color: 'fg.default'}}
              size="small"
            ></IconButton>
          )}
        </Box>
      </Box>
    </Box>
  )
}
ToastUI.displayName = 'Toast'

// --

export type ToastUIProps = {
  /**
   * @default default
   */
  variant?: ToastVariants | undefined
  /**
   * Setting this to true will allow the user to dismiss this toast.
   *
   * @default false
   */
  dismissible?: boolean | undefined
  /**
   * Sets the role attribute of the toast, which is used by assistive technologies to communicate status to users.
   *
   * - "status" will not be read out of assistive technologies immediately, and won't interupt what the user is currently doing.
   * - "alert" will be read out immediately, and will interupt what the user is currently doing. Because of this "alert" should be use sparingly.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role
   *
   * @default status
   */
  role?: 'status' | 'alert' | undefined

  /**
   * The `aria-label` to use for the close button.
   *
   * @default Dismiss this message
   */
  dismissLabel?: string
}

export type ToastVariants = (typeof variants)[number]
