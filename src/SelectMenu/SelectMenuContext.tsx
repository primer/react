import {createContext} from 'react'

export const MenuContext = createContext<{
  selectedTab?: string
  setSelectedTab?: React.Dispatch<React.SetStateAction<string>>
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  open?: boolean
  initialTab?: string
}>({})
