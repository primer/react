import React from 'react'
import {useSSRSafeId} from '@react-aria/ssr'
import Box from '../Box'
import Truncate from '../Truncate'
import {Slot} from './Item'

export type DescriptionProps = {
  variant?: 'inline' | 'block'
  id?: string
}

export const Description: React.FC<DescriptionProps> = ({variant = 'inline', ...props}) => {
  const id = useSSRSafeId(props.id)

  const styles = {
    color: 'fg.muted',
    fontSize: 0,
    lineHeight: '16px',
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    marginLeft: variant === 'block' ? 0 : 2
  }

  return (
    <Slot name={variant === 'block' ? 'BlockDescription' : 'InlineDescription'} metadata={{id}}>
      {variant === 'block' ? (
        <Box as="span" sx={styles} id={id}>
          {props.children}
        </Box>
      ) : (
        <Truncate id={id} sx={styles} title={props.children as string} inline={true} maxWidth="100%">
          {props.children}
        </Truncate>
      )}
    </Slot>
  )
}
