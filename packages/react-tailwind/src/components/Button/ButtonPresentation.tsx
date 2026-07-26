import type React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {CounterLabel} from '../CounterLabel'
import {Spinner} from '../Spinner'
import {VisuallyHidden} from '../VisuallyHidden'
import type {ButtonVariant} from './ButtonClassName'
import {type ButtonVisual, resolveButtonVisual} from './ButtonVisual'

function renderVisual(visual: ButtonVisual, component: 'leadingVisual' | 'trailingVisual' | 'trailingAction') {
  return (
    <span
      className={cn(
        'flex pointer-events-none',
        component === 'leadingVisual' && '[grid-area:leadingVisual]',
        component === 'trailingVisual' && '[grid-area:trailingVisual]',
        component !== 'trailingAction' && 'text-muted',
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
  size,
  trailingAction,
  trailingVisual,
  variant,
}: ButtonContentProps) {
  const counterVariant = variant === 'primary' ? 'primary' : 'secondary'

  return (
    <>
      <span
        className={cn(
          "relative grid flex-auto grid-cols-[min-content_minmax(0,auto)_min-content] [grid-template-areas:'leadingVisual_text_trailingVisual'] content-center items-center",
          alignContent === 'center' ? 'justify-center' : 'justify-start',
          size === 'small' ? '[&>*:not(:last-child)]:mr-1' : '[&>*:not(:last-child)]:mr-2',
          labelWrap && [
            'self-stretch',
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
            className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 text-muted"
            data-component="leadingVisual"
          >
            <Spinner aria-hidden="true" size="small" srText={null} />
          </span>
        ) : null}
        {leadingVisual
          ? renderVisual(
              loading ? <Spinner aria-hidden="true" size="small" srText={null} /> : leadingVisual,
              'leadingVisual',
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
                <CounterLabel
                  className={cn(
                    variant === 'default' && 'bg-[var(--buttonCounter-default-bgColor-rest)]',
                    variant === 'primary' &&
                      'bg-[var(--buttonCounter-primary-bgColor-rest)] text-[var(--button-primary-fgColor-rest)]',
                    variant === 'danger' &&
                      'bg-[var(--buttonCounter-danger-bgColor-rest)] text-[var(--button-danger-fgColor-rest)]',
                    variant === 'invisible' && 'bg-[var(--buttonCounter-invisible-bgColor-rest)]',
                  )}
                  data-component="ButtonCounter"
                  variant={counterVariant}
                >
                  {count}
                </CounterLabel>
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
