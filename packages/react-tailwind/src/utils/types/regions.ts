import type React from 'react'

/**
 * Declares element props for a compound component's named regions.
 *
 * Every compound component that identifies children by role accepts one prop per region, so a
 * consumer whose own component wraps a part can pass it directly instead of relying on the
 * parent recognizing the wrapper. An explicit region prop takes precedence over a matched
 * child.
 *
 * ```tsx
 * export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, RegionProps<'heading' | 'action'> {}
 *
 * <Card heading={<TeamCardHeading />} />
 * ```
 */
export type RegionProps<Names extends string> = {
  [Name in Names]?: React.ReactNode
}
