import {forwardRef, useEffect, useId, useRef} from 'react'
import {CheckIcon, CopyIcon} from '@primer/octicons-react'
import {announce} from '@primer/live-region-element'
import {clsx} from 'clsx'
import {IconButton, type IconButtonProps} from '../Button'
import {Tooltip, type TooltipProps} from '../TooltipV2'
import {VisuallyHidden} from '../VisuallyHidden'
import {useCopyToClipboard} from '../hooks/useCopyToClipboard'
import classes from './CopyToClipboardButton.module.css'

export interface CopyToClipboardButtonProps
  extends Omit<
    IconButtonProps,
    'icon' | 'onClick' | 'aria-label' | 'aria-labelledby' | 'unsafeDisableTooltip' | 'tooltipDirection' | 'children'
  > {
  /** Plain text to copy. */
  textToCopy: string
  /** Accessible name and initial tooltip. @default "Copy to clipboard" */
  ariaLabel?: string
  /** Icon shown before copying. @default CopyIcon */
  icon?: IconButtonProps['icon']
  /** Called only after a successful clipboard write. */
  onCopy?: () => void
  /** Called after a failed clipboard write. */
  onCopyError?: (error: Error) => void
  /** Successful copy tooltip and screen-reader announcement. @default "Copied!" */
  copiedMessage?: string
  /** Failed copy tooltip and screen-reader announcement. @default "Unable to copy to clipboard" */
  errorMessage?: string
  tooltipProps?: Omit<
    TooltipProps,
    'text' | 'aria-label' | 'type' | 'id' | 'aria-hidden' | 'children' | '_privateDisableTooltip'
  >
}

type CopyToClipboardTooltipTriggerProps = IconButtonProps & {
  accessibleDescription: string | undefined
}

const CopyToClipboardTooltipTrigger = forwardRef<HTMLButtonElement, CopyToClipboardTooltipTriggerProps>(
  function CopyToClipboardTooltipTrigger({accessibleDescription, ...props}, ref) {
    return <IconButton {...props} ref={ref} aria-describedby={accessibleDescription} />
  },
)

export const CopyToClipboardButton = forwardRef<HTMLButtonElement, CopyToClipboardButtonProps>(
  function CopyToClipboardButton(
    {
      textToCopy,
      ariaLabel = 'Copy to clipboard',
      icon = CopyIcon,
      variant = 'invisible',
      onCopy,
      onCopyError,
      copiedMessage = 'Copied!',
      errorMessage = 'Unable to copy to clipboard',
      tooltipProps,
      description,
      keybindingHint,
      keyshortcuts,
      disabled,
      className,
      ...rest
    },
    ref,
  ) {
    const {copy, copied, isCopying, error} = useCopyToClipboard()
    const request = useRef(0)
    const descriptionId = useId()
    const accessibleDescription = [rest['aria-describedby'], description ? descriptionId : undefined]
      .filter(Boolean)
      .join(' ')

    useEffect(() => {
      const activeRequest = request
      return () => {
        activeRequest.current++
      }
    }, [])

    const handleCopy = async () => {
      const currentRequest = ++request.current
      try {
        await copy(textToCopy)
      } catch (copyError) {
        if (currentRequest !== request.current) return
        announce(errorMessage)
        onCopyError?.(copyError instanceof Error ? copyError : new Error(errorMessage, {cause: copyError}))
        return
      }
      if (currentRequest !== request.current) return
      announce(copiedMessage)
      onCopy?.()
    }

    const buttonProps = {
      ...rest,
      'data-component': 'CopyToClipboardButton',
      'data-copied': copied || undefined,
      'data-copy-error': Boolean(error) || undefined,
      'aria-label': ariaLabel,
      'aria-busy': isCopying || undefined,
      'aria-keyshortcuts': rest['aria-keyshortcuts'] ?? keyshortcuts,
      icon: copied ? CheckIcon : icon,
      variant,
      disabled,
      className: clsx(classes.Button, className),
      'aria-describedby': accessibleDescription || undefined,
      onClick: handleCopy,
    }

    const button = <IconButton {...buttonProps} ref={ref} />

    return (
      <>
        {disabled ? (
          button
        ) : (
          <Tooltip
            {...tooltipProps}
            keybindingHint={tooltipProps?.keybindingHint ?? keybindingHint ?? keyshortcuts}
            text={copied ? copiedMessage : error ? errorMessage : (description ?? ariaLabel)}
            aria-hidden
          >
            <CopyToClipboardTooltipTrigger
              {...buttonProps}
              ref={ref}
              accessibleDescription={accessibleDescription || undefined}
            />
          </Tooltip>
        )}
        {description ? <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden> : null}
      </>
    )
  },
)
