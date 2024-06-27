import type {DOMAttributes} from 'react'
import React, {useCallback} from 'react'
import {Box, Spinner} from '../..'

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

/** @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604) */
const MarkdownViewer = ({
  dangerousRenderedHTML,
  loading = false,
  markdownValue = '',
  onChange: externalOnChange,
  disabled = false,
  onLinkClick,
  openLinksInNewTab = false,
}: MarkdownViewerProps) => {
  // We're using state to store the HTML container because we want the value
  // to re-run effects when it changes
  const [htmlContainer, setHtmlContainer] = React.useState<HTMLElement>()
  const htmlContainerRef = React.useCallback((node: HTMLElement | null) => {
    if (!node) return
    setHtmlContainer(node)
  }, [])

  const onChange = useCallback(
    async (value: string) => {
      try {
        await externalOnChange?.(value)
      } catch (error) {
        if (htmlContainer) {
          htmlContainer.innerHTML = dangerousRenderedHTML.__html as string
        }
      }
    },
    [externalOnChange, htmlContainer, dangerousRenderedHTML],
  )

  useListInteraction({
    onChange,
    disabled: disabled || !externalOnChange,
    htmlContainer,
    markdownValue,
    dependencies: [dangerousRenderedHTML],
  })

  useLinkInterception({
    htmlContainer,
    onLinkClick,
    openLinksInNewTab,
  })

  return loading ? (
    <Box sx={{display: 'flex', justifyContent: 'space-around', p: 2}}>
      <Spinner aria-label="Loading content..." />
    </Box>
  ) : (
    <Box
      ref={htmlContainerRef}
      className="markdown-body"
      sx={{fontSize: 1, maxWidth: '100%', '& > div > :last-child': {mb: 0}}}
      dangerouslySetInnerHTML={dangerousRenderedHTML}
    />
  )
}

export default MarkdownViewer
