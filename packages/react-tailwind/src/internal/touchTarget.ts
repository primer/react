/**
 * Expands a positioned control's hit area to 44px tall on coarse pointers without changing its layout.
 * Mirrors upstream's `@media (pointer: coarse)` pseudo-element touch target.
 */
export const coarsePointerTouchTarget =
  'primer:pointer-coarse:before:absolute primer:pointer-coarse:before:inset-x-0 primer:pointer-coarse:before:top-1/2 primer:pointer-coarse:before:min-h-11 primer:pointer-coarse:before:-translate-y-1/2'
