type BreakpointsFor<T> = {
  narrow?: T
  regular?: T
  wide?: T
}
export type BreakpointConfig<T, O extends 'narrow' | 'regular' | 'wide' | '' = ''> = T | Omit<BreakpointsFor<T>, O>
