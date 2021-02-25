import { useEffect } from "react"

export type UseReturnFocusProps = {
  returnRef: React.RefObject<HTMLElement>
  isOpen: boolean
}

export const useReturnFocus = ({returnRef, isOpen}: UseReturnFocusProps): void => {
  useEffect(() => {
    if(returnRef.current && !isOpen) {
      returnRef.current.focus()
    }
  },[isOpen])
}