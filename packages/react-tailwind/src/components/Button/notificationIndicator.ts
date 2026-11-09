export type NotificationIndicatorPlacement = 'button' | 'leadingVisual' | 'icon'

const indicatorDot =
  "primer:before:absolute primer:before:block primer:before:size-2 primer:before:rounded-full primer:before:bg-[var(--fgColor-accent)] primer:before:shadow-[0_0_0_calc(var(--base-size-4)/2)_var(--bgColor-inset)] primer:before:content-['']"

/** Classes that draw the new-activity dot on the element that owns the given placement. */
export function getNotificationIndicatorClassName(placement: NotificationIndicatorPlacement) {
  switch (placement) {
    case 'button':
      return `primer:relative ${indicatorDot} primer:before:-top-0.5 primer:before:-right-0.5`
    case 'icon':
      return `primer:relative ${indicatorDot} primer:before:top-[calc(50%-var(--base-size-12))] primer:before:right-[calc(50%-var(--base-size-12))]`
    case 'leadingVisual':
      return `primer:relative ${indicatorDot} primer:before:-top-1 primer:before:-right-1`
  }
}
