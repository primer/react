import React, {DOMAttributes, useCallback, useEffect, useRef, useState} from 'react'
import {Spinner, Box} from '../..'

import {useLinkInterception} from './_useLinkInterception'
import {useListInteraction} from './_useListInteraction'

type DangerousHtmlContainer = Required<DOMAttributes<unknown>>['dangerouslySetInnerHTML']

type CoreMarkdownViewerProps = {
  /** Show a loading spinner instead of content. */
  loading?: boolean
  /**
   * Set the rendered HTML of the viewer. To prevent XSS, ensure that the source of this
   * HTML is trusted!
   */
  dangerousRenderedHTML: DangerousHtmlContainer
  /**
   * Called when the user clicks a link element. This can be used to intercept the click
   * and provide custom routing. Note that this is a native HTML `MouseEvent` and not a
   * `React.ClickEvent`.
   */
  onLinkClick?: (event: MouseEvent) => void
  openLinksInNewTab?: boolean
}

export type InteractiveMarkdownViewerProps = CoreMarkdownViewerProps & {
  /**
   * The markdown the HTML was rendered from. This is not used for viewing, only as a source
   * for change events.
   */
  markdownValue: string
  /**
   * Called when the user interacts and updates the Markdown. The rendered Markdown is
   * updated eagerly - if the request fails, a rejected Promise should be returned by
   * this handler. In that case, the viewer will revert the visual change.
   *
   * If the change is handled by an async API request (as it typically will be in production
   * code), the viewer should be `disabled` while the request is pending to avoid conflicts.
   * To allow users to check multiple boxes rapidly, the API request should be debounced (an
   * ideal debounce duration is about 1 second).
   */
  onChange: (markdown: string) => void | Promise<void>
  /** Control whether interaction is disabled. */
  disabled?: boolean
}

type NoninteractiveMarkdownViewerProps = CoreMarkdownViewerProps & {
  // This is externally useless, but internally it lets us use unpacking to get the props.
  // If a prop was present only on one member of the type union, Typescript would treat it as
  // though it doesn't exist at all until you discriminate which type the props are.
  markdownValue?: undefined
  onChange?: undefined
  disabled?: undefined
}

export type MarkdownViewerProps = NoninteractiveMarkdownViewerProps | InteractiveMarkdownViewerProps

const createRenderedContainer = (html: string): HTMLDivElement => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div
}

const MarkdownViewer = ({
  dangerousRenderedHTML,
  loading = false,
  markdownValue = '',
  onChange: externalOnChange,
  disabled = false,
  onLinkClick,
  openLinksInNewTab = false
}: MarkdownViewerProps) => {
  const outputContainerRef = useRef<HTMLDivElement>(null)

  // Render the HTML into an internal container element so we can modify it before it becomes visible.
  // Using `unsafeInnerHTML` would require an effect to run after rendering which would cause flicker
  const [htmlContainer, setHtmlContainer] = useState(() => createRenderedContainer(dangerousRenderedHTML.__html))
  useEffect(
    () => setHtmlContainer(createRenderedContainer(dangerousRenderedHTML.__html)),
    [dangerousRenderedHTML.__html]
  )

  const onChange = useCallback(
    async (value: string) => {
      try {
        await externalOnChange?.(value)
      } catch (error) {
        setHtmlContainer(createRenderedContainer(dangerousRenderedHTML.__html))
      }
    },
    [externalOnChange, dangerousRenderedHTML.__html]
  )

  useListInteraction({
    onChange,
    disabled: disabled || !externalOnChange,
    htmlContainer,
    markdownValue
  })

  useLinkInterception({
    htmlContainer,
    onLinkClick,
    openLinksInNewTab
  })

  // If we were to inject the `...htmlContainer.children` instead of the container element itself,
  // those children elements would be moved from the `htmlContainer` to the `outputContainer`. Then if
  // other effects use `htmlContainer.querySelectorAll`, they wouldn't find any elements to affect
  useEffect(() => outputContainerRef.current?.replaceChildren(htmlContainer))

  return loading ? (
    <Box sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
      <Spinner aria-label="Loading content..." />
    </Box>
  ) : (
    <Box
      ref={outputContainerRef}
      className="markdown-body"
      sx={{fontSize: 1, maxWidth: '100%', '& > div > :last-child': {mb: 0}}}
    />
  )
}

export default MarkdownViewer
