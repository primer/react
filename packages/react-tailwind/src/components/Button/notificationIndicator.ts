export type NotificationIndicatorPlacement = 'button' | 'leadingVisual' | 'icon'

const indicatorDot =
  "before:absolute before:block before:size-2 before:rounded-full before:bg-[var(--fgColor-accent)] before:shadow-[0_0_0_calc(var(--base-size-4)/2)_var(--bgColor-inset)] before:content-['']"

/** Classes that draw the new-activity dot on the element that owns the given placement. */
export function getNotificationIndicatorClassName(placement: NotificationIndicatorPlacement) {
  switch (placement) {
    case 'button':
      return `relative ${indicatorDot} before:-top-0.5 before:-right-0.5`
    case 'icon':
      return `relative ${indicatorDot} before:top-[calc(50%-var(--base-size-12))] before:right-[calc(50%-var(--base-size-12))]`
    case 'leadingVisual':
      return `relative ${indicatorDot} before:-top-1 before:-right-1`
  }
}
