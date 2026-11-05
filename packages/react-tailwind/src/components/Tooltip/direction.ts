export type TooltipDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

export const tooltipDirectionPlacement: Record<
  TooltipDirection,
  {align: 'start' | 'center' | 'end'; side: 'top' | 'right' | 'bottom' | 'left'}
> = {
  n: {align: 'center', side: 'top'},
  ne: {align: 'end', side: 'top'},
  e: {align: 'center', side: 'right'},
  se: {align: 'end', side: 'bottom'},
  s: {align: 'center', side: 'bottom'},
  sw: {align: 'start', side: 'bottom'},
  w: {align: 'center', side: 'left'},
  nw: {align: 'start', side: 'top'},
}
