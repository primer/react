import type React from 'react'

export const ConditionalWrapper: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithoutRef<'div'> & {if: boolean}>
> = props => {
  const {if: condition, children, ...rest} = props

  if (condition) return <div {...rest}>{children}</div>
  else return <>{children}</>
}
