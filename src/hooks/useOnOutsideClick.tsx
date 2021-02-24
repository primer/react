import React, {useEffect, useCallback} from 'react'


export type UseOnOutsideClickParameters = {
  insideRefs: React.RefObject<HTMLElement>[]
  outsideRefs: React.RefObject<HTMLElement>[]
  isOpen: boolean
  onClickOutside: (e: MouseEvent) => void
}


const wasOutside = (insideRefs: React.RefObject<HTMLElement>[], e: MouseEvent) => {
  let wasOutside = true;
  insideRefs.forEach(ref => {
    if (ref.current?.contains(e.target as Node)) {
      wasOutside = false;
    }
  })
  return wasOutside
}
export  const useOnOutsideClick = ({insideRefs, isOpen, onClickOutside}: UseOnOutsideClickParameters) => {
  const onOutsideClickInternal = useCallback(
    (e: MouseEvent) => {
      if (wasOutside(insideRefs, e)) {
        onClickOutside(e)
      }
    }, [onClickOutside, insideRefs]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', onOutsideClickInternal)
      return () => {
        document.removeEventListener('mousedown', onOutsideClickInternal)
      }
    }
  }, [isOpen, onOutsideClickInternal])
}