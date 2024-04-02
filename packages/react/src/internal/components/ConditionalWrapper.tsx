import React from 'react'
import type {FC, PropsWithChildren} from 'react'
import Box from '../../Box/Box'
import type {BoxProps} from '../../Box/Box'

export const ConditionalWrapper: FC<PropsWithChildren<{if: boolean} & BoxProps>> = props => {
  const {if: condition, ...rest} = props

  if (condition) return <Box {...rest}>{props.children}</Box>
  else return <>{props.children}</>
}
