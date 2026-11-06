import type React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {CounterLabel} from '../CounterLabel'
import {Spinner} from '../Spinner'
import {VisuallyHidden} from '../VisuallyHidden'
import type {ButtonVariant} from './ButtonClassName'
import {type ButtonVisual, resolveButtonVisual} from './ButtonVisual'
import {getNotificationIndicatorClassName} from './notificationIndicator'

// Variants and states set --button-visual-fgColor on the button root, mirroring Primer's `.Visual` colors.
const visualClassName = 'text-[var(--button-visual-fgColor,var(--fgColor-muted))]'

function renderVisual(
  visual: ButtonVisual,
  component: 'leadingVisual' | 'trailingVisual' | 'trailingAction',
  notificationIndicator = false,
) {
  return (
    <span
      className={cn(
        'flex pointer-events-none',
        notificationIndicator && getNotificationIndicatorClassName('leadingVisual'),
        component === 'leadingVisual' && '[grid-area:leadingVisual]',
        component === 'trailingVisual' && '[grid-area:trailingVisual]',
        visualClassName,
        component === 'trailingAction' && '-mr-1',
      )}
      data-component={component}
    >
      {resolveButtonVisual(visual)}
    </span>
  )
}

interface ButtonContentProps {
  alignContent?: 'start' | 'center'
  children?: React.ReactNode
  count?: number | string
  labelId: string
  labelWrap?: boolean
  leadingVisual?: ButtonVisual
  loading: boolean
  loadingAnnouncement: string
  loadingAnnouncementId: string
  notificationIndicator?: boolean
  size?: ControlSize
  trailingAction?: ButtonVisual
  trailingVisual?: ButtonVisual
  variant: ButtonVariant
}

export function ButtonContent({
  alignContent = 'center',
  children,
  count,
  labelId,
  labelWrap,
  leadingVisual,
  loading,
  loadingAnnouncement,
  loadingAnnouncementId,
  notificationIndicator,
  size,
  trailingAction,
  trailingVisual,
  variant,
}: ButtonContentProps) {
  return (
    <>
      <span
        className={cn(
          "relative grid flex-[1_0_auto] grid-cols-[min-content_minmax(0,auto)_min-content] [grid-template-areas:'leadingVisual_text_trailingVisual'] content-center items-center",
          alignContent === 'center' ? 'justify-center' : 'justify-start',
          size === 'small' ? '[&>*:not(:last-child)]:mr-1' : '[&>*:not(:last-child)]:mr-2',
          labelWrap && [
            'flex-auto self-stretch',
            size === 'small'
              ? 'py-[calc(var(--control-small-paddingBlock)-2px)]'
              : size === 'large'
                ? 'py-[calc(var(--control-large-paddingBlock)-2px)]'
                : 'py-[calc(var(--control-medium-paddingBlock)-2px)]',
          ],
        )}
        data-align={alignContent}
        data-component="buttonContent"
      >
        {loading && !leadingVisual && !trailingVisual && !trailingAction && count === undefined ? (
          <span
            className={cn('pointer-events-none absolute left-1/2 flex -translate-x-1/2', visualClassName)}
            data-component="leadingVisual"
          >
            <Spinner aria-hidden="true" size="small" srText={null} />
          </span>
        ) : null}
        {leadingVisual
          ? renderVisual(
              loading ? <Spinner aria-hidden="true" size="small" srText={null} /> : leadingVisual,
              'leadingVisual',
              notificationIndicator,
            )
          : null}
        {children ? (
          <span
            className={cn(
              '[grid-area:text] whitespace-nowrap leading-[var(--text-body-lineHeight-medium)]',
              size === 'small' && 'leading-[var(--text-body-lineHeight-small)]',
              variant === 'link' && 'whitespace-normal [line-height:inherit]',
              labelWrap && 'break-words whitespace-normal',
              loading && !leadingVisual && !trailingVisual && !trailingAction && count === undefined && 'invisible',
            )}
            data-component="text"
            id={loading ? labelId : undefined}
          >
            {children}
          </span>
        ) : null}
        {count !== undefined && !trailingVisual
          ? renderVisual(
              loading && !leadingVisual ? (
                <Spinner aria-hidden="true" size="small" srText={null} />
              ) : (
                <CounterLabel data-component="ButtonCounter">{count}</CounterLabel>
              ),
              'trailingVisual',
            )
          : trailingVisual
            ? renderVisual(
                loading && !leadingVisual ? <Spinner aria-hidden="true" size="small" srText={null} /> : trailingVisual,
                'trailingVisual',
              )
            : null}
      </span>
      {trailingAction
        ? renderVisual(
            loading && !leadingVisual && !trailingVisual ? (
              <Spinner aria-hidden="true" size="small" srText={null} />
            ) : (
              trailingAction
            ),
            'trailingAction',
          )
        : null}
      {loading ? (
        <VisuallyHidden>
          <span id={loadingAnnouncementId} role="status">
            {loadingAnnouncement}
          </span>
        </VisuallyHidden>
      ) : null}
    </>
  )
}
