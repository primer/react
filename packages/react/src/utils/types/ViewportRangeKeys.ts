export type ViewportRangeKeys = 'narrow' | 'narrowLandscape' | 'regular' | 'wide' | 'portrait' | 'landscape'
export type WidthOnlyViewportRangeKeys = Exclude<ViewportRangeKeys, 'narrowLandscape' | 'portrait' | 'landscape'>
