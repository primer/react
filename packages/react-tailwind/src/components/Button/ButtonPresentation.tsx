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
const visualClassName = 'primer:text-[var(--button-visual-fgColor,var(--fgColor-muted))]'

function renderVisual(
  visual: ButtonVisual,
  component: 'leadingVisual' | 'trailingVisual' | 'trailingAction',
  notificationIndicator = false,
) {
  return (
    <span
      className={cn(
        'primer:flex primer:pointer-events-none',
        notificationIndicator && getNotificationIndicatorClassName('leadingVisual'),
        component === 'leadingVisual' && 'primer:[grid-area:leadingVisual]',
        component === 'trailingVisual' && 'primer:[grid-area:trailingVisual]',
        visualClassName,
        component === 'trailingAction' && 'primer:-mr-1',
      )}
      data-component={component}
    >
      {resolveButtonVisual(visual)}
    </span>
  )
}

interface ButtonContentProps {
  alignContent?: 'start' | 'center'
  autoWrapInActions?: boolean
  children?: React.ReactNode
  count?: number | string
  labelId: string
  labelWrap?: boolean
  leadingVisual?: ButtonVisual
  loading: boolean
  loadingAnnouncement: string
  loadingAnnouncementId?: string
  notificationIndicator?: boolean
  size?: ControlSize
  trailingAction?: ButtonVisual
  trailingVisual?: ButtonVisual
  variant: ButtonVariant
}

export function ButtonContent({
  alignContent = 'center',
  autoWrapInActions = false,
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
          "primer:relative primer:grid primer:flex-[1_0_auto] primer:grid-cols-[min-content_minmax(0,auto)_min-content] primer:[grid-template-areas:'leadingVisual_text_trailingVisual'] primer:content-center primer:items-center",
          alignContent === 'center' ? 'primer:justify-center' : 'primer:justify-start',
          size === 'small' ? 'primer:[&>*:not(:last-child)]:mr-1' : 'primer:[&>*:not(:last-child)]:mr-2',
          labelWrap && [
            'primer:flex-auto primer:self-stretch',
            size === 'small'
              ? 'primer:py-[calc(var(--control-small-paddingBlock)-2px)]'
              : size === 'large'
                ? 'primer:py-[calc(var(--control-large-paddingBlock)-2px)]'
                : 'primer:py-[calc(var(--control-medium-paddingBlock)-2px)]',
          ],
          autoWrapInActions &&
            labelWrap === undefined && [
              'primer:flex-[var(--primer-action-flex,1_0_auto)] primer:[align-self:var(--primer-action-align,auto)]',
              variant !== 'link' &&
                (size === 'small'
                  ? 'primer:py-[calc(var(--primer-action-wrap,0)*(var(--control-small-paddingBlock)-2px))]'
                  : size === 'large'
                    ? 'primer:py-[calc(var(--primer-action-wrap,0)*(var(--control-large-paddingBlock)-2px))]'
                    : 'primer:py-[calc(var(--primer-action-wrap,0)*(var(--control-medium-paddingBlock)-2px))]'),
            ],
        )}
        data-align={alignContent}
        data-component="buttonContent"
      >
        {loading && !leadingVisual && !trailingVisual && !trailingAction && count === undefined ? (
          <span
            className={cn(
              'primer:pointer-events-none primer:[position:absolute] primer:left-1/2 primer:flex primer:-translate-x-1/2',
              visualClassName,
            )}
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
              'primer:[grid-area:text] primer:leading-[var(--text-body-lineHeight-medium)]',
              autoWrapInActions && labelWrap === undefined && variant !== 'link'
                ? 'primer:[white-space:var(--primer-action-white-space,nowrap)]'
                : 'primer:whitespace-nowrap',
              size === 'small' && 'primer:leading-[var(--text-body-lineHeight-small)]',
              variant === 'link' && 'primer:whitespace-normal primer:[line-height:inherit]',
              labelWrap && 'primer:break-words primer:whitespace-normal',
              autoWrapInActions &&
                labelWrap === undefined &&
                'primer:[overflow-wrap:var(--primer-action-overflow-wrap,normal)]',
              loading &&
                !leadingVisual &&
                !trailingVisual &&
                !trailingAction &&
                count === undefined &&
                'primer:[visibility:hidden]',
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
      {loadingAnnouncementId ? (
        <VisuallyHidden>
          <span id={loadingAnnouncementId} role="status">
            {loadingAnnouncement}
          </span>
        </VisuallyHidden>
      ) : null}
    </>
  )
}
