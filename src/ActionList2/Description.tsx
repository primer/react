import React from 'react'
import Box from '../Box'
import Truncate from '../Truncate'
import {ItemContext} from './Item'

export type DescriptionProps = {
  variant?: 'inline' | 'block'
}
export const Description: React.FC<DescriptionProps> = ({variant = 'inline', ...props}) => {
  const {registerSlot, deregisterSlot} = React.useContext(ItemContext)

  const styles = {
    color: 'fg.muted',
    fontSize: 0,
    lineHeight: '16px',
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    marginLeft: variant === 'block' ? 0 : 2
  }

  const contents =
    variant === 'block' ? (
      <Box as="span" sx={styles}>
        {props.children}
      </Box>
    ) : (
      <Truncate sx={styles} title={props.children as string} inline={true} maxWidth="100%">
        {props.children}
      </Truncate>
    )

  React.useEffect(() => {
    const slotName = variant === 'block' ? 'BlockDescription' : 'InlineDescription'
    registerSlot(slotName, contents)
    return () => deregisterSlot(slotName)
  }, [variant, props.children])

  return null
}
