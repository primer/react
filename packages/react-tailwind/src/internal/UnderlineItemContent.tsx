import type React from 'react'
import {CounterLabel} from '../components/CounterLabel'
import {SkeletonBox} from '../components/SkeletonBox'
import {cn} from './cn'

export const underlineRootClassName =
  'primer:@container/underline-nav primer:flex primer:min-h-12 primer:items-start primer:justify-start primer:overflow-x-auto primer:overflow-y-hidden primer:pt-2 primer:shadow-[inset_0_-1px_var(--borderColor-muted)]'

export const underlineListClassName =
  'primer:relative primer:m-0 primer:flex primer:min-w-max primer:list-none primer:items-center primer:gap-2 primer:p-0 primer:whitespace-nowrap'

export const underlineItemClassName =
  "primer:group/underline-item primer:relative primer:mb-2 primer:inline-flex primer:h-8 primer:max-w-full primer:shrink-0 primer:items-center primer:rounded-md primer:border-0 primer:bg-transparent primer:px-2 primer:py-1.5 primer:text-center primer:text-sm primer:leading-[1.5] primer:text-default primer:no-underline primer:after:pointer-events-none primer:after:absolute primer:after:inset-x-0 primer:after:bottom-0 primer:after:-mb-2 primer:after:h-0.5 primer:after:bg-transparent primer:after:content-[''] primer:hover:bg-neutral-muted primer:hover:no-underline primer:focus-visible:outline-2 primer:focus-visible:outline-transparent primer:focus-visible:shadow-[inset_0_0_0_2px_var(--fgColor-accent)] primer:data-[active]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)] primer:data-[current]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)]"

/** An item's counter, or a placeholder while counters load. */
export function UnderlineCounter({counter, loading}: {counter: React.ReactNode; loading: boolean}) {
  return loading ? (
    <SkeletonBox as="span" aria-hidden="true" className="primer:h-4 primer:w-6 primer:rounded-full" />
  ) : (
    <CounterLabel>{counter}</CounterLabel>
  )
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  return ''
}

export function UnderlineItemContent({
  children,
  counter,
  leadingVisual,
  leadingVisualClassName,
  loadingCounters = false,
  marker,
}: {
  children: React.ReactNode
  counter?: React.ReactNode
  leadingVisual?: React.ReactNode
  leadingVisualClassName?: string
  loadingCounters?: boolean
  marker: string
}) {
  const textContent = getTextContent(children)
  return (
    <>
      {leadingVisual ? (
        <span
          aria-hidden="true"
          data-component={`${marker}.LeadingVisual`}
          className={cn(
            'primer:mr-2 primer:inline-flex primer:shrink-0 primer:items-center primer:text-muted',
            leadingVisualClassName,
          )}
        >
          {leadingVisual}
        </span>
      ) : null}
      <span
        data-component={`${marker}.Text`}
        data-content={textContent || undefined}
        className="primer:min-w-0 primer:overflow-hidden primer:text-ellipsis primer:whitespace-nowrap primer:before:block primer:before:h-0 primer:before:whitespace-nowrap primer:before:font-semibold primer:before:invisible primer:before:content-[attr(data-content)] primer:group-aria-[selected=true]/underline-item:font-semibold primer:group-data-[active]/underline-item:font-semibold primer:group-data-[current]/underline-item:font-semibold"
      >
        {children}
      </span>
      {counter === undefined ? null : (
        <span
          data-component={`${marker}.Counter`}
          className="primer:ml-2 primer:flex primer:shrink-0 primer:items-center"
        >
          <UnderlineCounter counter={counter} loading={loadingCounters} />
        </span>
      )}
    </>
  )
}
