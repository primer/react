import type React from 'react'
import {CounterLabel} from '../components/CounterLabel'
import {SkeletonBox} from '../components/SkeletonBox'
import {cn} from './cn'

export const underlineRootClassName =
  '@container/underline-nav flex min-h-12 items-start justify-start overflow-x-auto overflow-y-hidden pt-2 shadow-[inset_0_-1px_var(--borderColor-muted)]'

export const underlineListClassName = 'relative m-0 flex min-w-max list-none items-center gap-2 p-0 whitespace-nowrap'

export const underlineItemClassName =
  "group/underline-item relative mb-2 inline-flex h-8 max-w-full shrink-0 items-center rounded-md border-0 bg-transparent px-2 py-1.5 text-center text-sm leading-[1.5] text-default no-underline after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:-mb-2 after:h-0.5 after:bg-transparent after:content-[''] hover:bg-neutral-muted hover:no-underline focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-[inset_0_0_0_2px_var(--fgColor-accent)] data-[active]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)] data-[current]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)]"

/** An item's counter, or a placeholder while counters load. */
export function UnderlineCounter({counter, loading}: {counter: React.ReactNode; loading: boolean}) {
  return loading ? (
    <SkeletonBox as="span" aria-hidden="true" className="h-4 w-6 rounded-full" />
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
          className={cn('mr-2 inline-flex shrink-0 items-center text-muted', leadingVisualClassName)}
        >
          {leadingVisual}
        </span>
      ) : null}
      <span
        data-component={`${marker}.Text`}
        data-content={textContent || undefined}
        className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap before:block before:h-0 before:whitespace-nowrap before:font-semibold before:invisible before:content-[attr(data-content)] group-aria-[selected=true]/underline-item:font-semibold group-data-[active]/underline-item:font-semibold group-data-[current]/underline-item:font-semibold"
      >
        {children}
      </span>
      {counter === undefined ? null : (
        <span data-component={`${marker}.Counter`} className="ml-2 flex shrink-0 items-center">
          <UnderlineCounter counter={counter} loading={loadingCounters} />
        </span>
      )}
    </>
  )
}
