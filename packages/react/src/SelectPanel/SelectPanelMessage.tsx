import React from 'react'
import Text from '../Text'
import Box from '../Box'

export type SelectPanelMessageProps = {
  children: React.ReactNode
  title: string
  variant: 'noInitialItems' | 'noFilteredItems' | 'error' | 'warning'
}

export const SelectPanelMessage: React.FC<SelectPanelMessageProps> = ({
  variant = 'noInitialItems',
  title,
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: '100%',
        gap: 1,
        paddingX: 4,
        textAlign: 'center',
        a: {color: 'inherit', textDecoration: 'underline'},
        minHeight: 'min(calc(var(--max-height) - 150px), 324px)',
        //                 maxHeight of dialog - (header & footer)
      }}
    >
      <Text sx={{fontSize: 1, fontWeight: 'semibold'}}>{title}</Text>
      <Text
        sx={{fontSize: 1, color: 'fg.muted', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center'}}
      >
        {children}
      </Text>
    </Box>
  )
}
