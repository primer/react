/* adapted from: https://github.com/github/github/blob/a959c0d15c29b98c49b881f520c5947fe24eecb9/app/assets/modules/github/behaviors/button-outline.ts */
import {useEffect} from 'react'

let lastActiveElement: Element | null = null
let currentInputIsMouse = false

const useMouseIntent = () => {
  useEffect(() => {
    function setClass() {
      lastActiveElement = document.activeElement
      if (document.body) {
        document.body.classList.toggle('intent-mouse', currentInputIsMouse)
      }
    }

    function onKeyDown() {
      currentInputIsMouse = false
    }

    function onMouseDown() {
      currentInputIsMouse = true
      if (lastActiveElement === document.activeElement) setClass()
    }
    // Use mousedown event to make sure outline is remove for holding and dragging
    document.addEventListener('mousedown', onMouseDown, {capture: true})

    document.addEventListener('keydown', onKeyDown, {capture: true})

    document.addEventListener('focusin', setClass, {capture: true})

    return () => {
      lastActiveElement = null
      currentInputIsMouse = false
      document.removeEventListener('keydown', onKeyDown, {capture: true})
      document.removeEventListener('focusin', setClass, {capture: true})
      document.removeEventListener('mousedown', onMouseDown, {capture: true})
    }
  }, [])
}

export function prepareForFocusWithoutMouse() {
  currentInputIsMouse = false
}

export default useMouseIntent
