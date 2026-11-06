/**
 * Expands a positioned control's hit area to 44px tall on coarse pointers without changing its layout.
 * Mirrors upstream's `@media (pointer: coarse)` pseudo-element touch target.
 */
export const coarsePointerTouchTarget =
  'pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:min-h-11 pointer-coarse:before:-translate-y-1/2'
