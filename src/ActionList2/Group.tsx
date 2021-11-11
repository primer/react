import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {Header, HeaderProps} from './Header'
import {ListProps} from './List'

export type GroupProps = HeaderProps &
  SxProp & {
    selectionVariant?: ListProps['selectionVariant'] | false
  }

type ContextProps = Pick<GroupProps, 'selectionVariant'>
export const GroupContext = React.createContext<ContextProps>({})

export const Group: React.FC<GroupProps> = ({title, variant, auxiliaryText, selectionVariant, sx = {}, ...props}) => {
  return (
    <Box
      as="li"
      sx={{
        '&:not(:first-child)': {marginTop: 2},
        listStyle: 'none', // hide the ::marker inserted by browser's stylesheet
        ...sx
      }}
      {...props}
    >
      {title && <Header title={title} variant={variant} auxiliaryText={auxiliaryText} />}
      <GroupContext.Provider value={{selectionVariant}}>
        <Box as="ul" sx={{paddingInlineStart: 0}}>
          {props.children}
        </Box>
      </GroupContext.Provider>
    </Box>
  )
}
