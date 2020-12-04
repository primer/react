/* adapted from: https://github.com/github/github/blob/a959c0d15c29b98c49b881f520c5947fe24eecb9/app/assets/modules/github/behaviors/button-outline.ts */
import {useEffect} from 'react'

function useMouseIntent() {
  useEffect(() => {
    let lastActiveElement = null
    let currentInputIsMouse = false

    function setClass() {
      lastActiveElement = document.activeElement
      if (document.body) {
        document.body.classList.toggle('intent-mouse', currentInputIsMouse)
      }
    }
    // Use mousedown event to make sure outline is remove for holding and dragging
    document.addEventListener(
      'mousedown',
      function() {
        currentInputIsMouse = true
        if (lastActiveElement === document.activeElement) setClass()
      },
      {capture: true}
    )

    document.addEventListener(
      'keydown',
      function() {
        currentInputIsMouse = false
      },
      {capture: true}
    )

    document.addEventListener('focusin', setClass, {capture: true})
  })
}

export default useMouseIntent
