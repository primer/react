import React from 'react'
import {CheckIcon, AlertIcon, StopIcon, InfoIcon, XIcon} from '@primer/octicons-react'

import {Spinner, Text, IconButton} from '../..'

import classNames from './ToastUI.module.css'
import {useLayoutEffect, useRef, useState} from 'react'

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

  const textRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<string>('0px')

  useLayoutEffect(() => {
    if (textRef.current) {
      setHeight(window.getComputedStyle(textRef.current).lineHeight)
    }
  }, [])

  const body = React.createElement(
    typeof children === 'string' ? Text : 'div',
    {
      role: 'main',
      className: classNames.ToastUI__text,
      ref: textRef,
    },
    children,
  )

  return (
    <div role="alert" className={classNames.ToastUI} data-dismissable={dismissible}>
      <div role="presentation" className={classNames.ToastUI__wrapper} style={{height: height}}>
        <div className={classNames.ToastUI__Icon} data-variant={variant}>
          {icon[variant]}
        </div>
      </div>
      <div>{body}</div>
      {dismissible && (
        <div className={classNames.ToastUI__wrapper} style={{height: height}}>
          <IconButton
            aria-label={dismissLabel}
            icon={XIcon}
            variant="invisible"
            sx={{
              color: 'var(--overlay-inverse-fgColor-default)',
              '&:hover': {
                backgroundColor: 'var(--button-invisible-bgColor-hover)',
              },
              '&:active': {
                backgroundColor: 'var(--button-invisible-bgColor-active)',
              },
            }}
            size="small"
          />
        </div>
      )}
    </div>
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
   * The `aria-label` to use for the close button.
   *
   * @default Dismiss this message
   */
  dismissLabel?: string
}

export type ToastVariants = (typeof variants)[number]
