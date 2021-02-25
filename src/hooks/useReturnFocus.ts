import { useEffect } from "react"

export type UseReturnFocusProps = {
  returnRef: React.RefObject<HTMLElement>
  isOpen: boolean
}

export const useReturnFocus = ({returnRef, isOpen}: UseReturnFocusProps): void => {
  console.log(isOpen)

  // this isn't being called when isOpen changes for some reason
  useEffect(() => {
    if(returnRef.current && !isOpen) {
      debugger;
      returnRef.current.focus()
    }
  }), [isOpen]
}