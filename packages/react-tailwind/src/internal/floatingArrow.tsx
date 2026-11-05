import type React from 'react'

/**
 * Places a 16×8 caret on the popup edge facing its anchor. Base UI positions the
 * arrow along that edge and reports the resolved side through `data-side`.
 */
export const floatingArrowClassName =
  'flex h-2 w-4 data-[side=bottom]:-top-2 data-[side=top]:-bottom-2 data-[side=top]:rotate-180 data-[side=left]:-right-3 data-[side=left]:rotate-90 data-[side=right]:-left-3 data-[side=right]:-rotate-90 data-[side=inline-start]:-end-3 data-[side=inline-start]:rotate-90 data-[side=inline-start]:rtl:-rotate-90 data-[side=inline-end]:-start-3 data-[side=inline-end]:-rotate-90 data-[side=inline-end]:rtl:rotate-90 data-[uncentered]:invisible'

/**
 * Default caret graphic: an outer border-colored triangle with an inset surface
 * triangle, matching Primer's CSS caret. Colors come from `--arrow-border-color`
 * and `--arrow-bg-color` so each overlay can theme it.
 */
export function FloatingArrowGraphic(): React.ReactElement {
  return (
    <svg aria-hidden="true" className="block size-full" focusable="false" viewBox="0 0 16 8">
      <path className="fill-[var(--arrow-border-color)]" d="M0 8 8 0l8 8Z" />
      <path className="fill-[var(--arrow-bg-color)]" d="M1 8 8 1l7 7Z" />
    </svg>
  )
}
