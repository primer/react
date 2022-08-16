import {useEffect} from 'react'

type UseLinkInterceptionSettings = {
  htmlContainer: HTMLDivElement
  onLinkClick?: (event: MouseEvent) => void
  openLinksInNewTab: boolean
}

/**
 * Updates all links in the container to open a new tab and call `onLinkClick` on click.
 */
export const useLinkInterception = ({htmlContainer, onLinkClick, openLinksInNewTab}: UseLinkInterceptionSettings) => {
  useEffect(function transformLinks() {
    const links = htmlContainer.querySelectorAll('a')

    const cleanupFns = Array.from(links).map(link => {
      const clickHandler = onLinkClick
      if (clickHandler) link.addEventListener('click', clickHandler)

      const prevTarget = link.target
      if (openLinksInNewTab) link.setAttribute('target', '_blank')

      return () => {
        if (clickHandler) link.removeEventListener('click', clickHandler)
        link.setAttribute('target', prevTarget)
      }
    })

    return () => {
      for (const fn of cleanupFns) fn()
    }
  })
}
