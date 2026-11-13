export type TooltipDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

export const tooltipDirectionPlacement: Record<
  TooltipDirection,
  {align: 'start' | 'center' | 'end'; side: 'top' | 'right' | 'bottom' | 'left'}
> = {
  n: {align: 'center', side: 'top'},
  ne: {align: 'start', side: 'top'},
  e: {align: 'center', side: 'right'},
  se: {align: 'start', side: 'bottom'},
  s: {align: 'center', side: 'bottom'},
  sw: {align: 'end', side: 'bottom'},
  w: {align: 'center', side: 'left'},
  nw: {align: 'end', side: 'top'},
}
