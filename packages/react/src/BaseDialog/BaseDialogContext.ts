import {createContext, useContext} from 'react'

type BaseDialogContextValue = {
  id: string
  titleId: string
  command: 'show-modal' | 'show'
  headingText: string
  setHeadingText: (text: string) => void
  focusHeading: boolean
}

const BaseDialogContext = createContext<BaseDialogContextValue | null>(null)

function useBaseDialog(): BaseDialogContextValue {
  const value = useContext(BaseDialogContext)
  if (value) {
    return value
  }
  throw new Error('useBaseDialogContext must be used within BaseDialog.Root')
}

export {BaseDialogContext, useBaseDialog}
