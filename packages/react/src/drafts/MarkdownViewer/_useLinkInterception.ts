import {useEffect} from 'react'

type UseLinkInterceptionSettings = {
  htmlContainer?: HTMLElement
  onLinkClick?: (event: MouseEvent) => void
  openLinksInNewTab: boolean
}

/**
 * Updates all links in the container to open a new tab and call `onLinkClick` on click.
 */
export const useLinkInterception = ({htmlContainer, onLinkClick, openLinksInNewTab}: UseLinkInterceptionSettings) => {
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a')
      if (!link) return

      onLinkClick?.(event)

      if (!event.defaultPrevented && openLinksInNewTab && link.href) {
        window.open(link.href, '_blank', 'noopener noreferrer')
        event.preventDefault()
      }
    }

    if (!htmlContainer) return

    htmlContainer.addEventListener('click', clickHandler)

    return () => {
      htmlContainer.removeEventListener('click', clickHandler)
    }
  }, [htmlContainer, onLinkClick, openLinksInNewTab])
}
