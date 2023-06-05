import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Box from '../../Box'
import VisuallyHidden from '../../_VisuallyHidden'
import {useId} from '../../hooks/useId'
import {useResizeObserver} from '../../hooks/useResizeObserver'
import {useSlots} from '../../hooks/useSlots'
import {SxProp} from '../../sx'
import MarkdownViewer from '../MarkdownViewer'
import {useIgnoreKeyboardActionsWhileComposing} from '../hooks/useIgnoreKeyboardActionsWhileComposing'
import {useSafeAsyncCallback} from '../hooks/useSafeAsyncCallback'
import {useSyntheticChange} from '../hooks/useSyntheticChange'
import {FileType} from '../hooks/useUnifiedFileSelect'
import {Actions} from './Actions'
import {Label} from './Label'
import {CoreToolbar, DefaultToolbarButtons, Toolbar} from './Toolbar'
import {CoreFooter, Footer} from './Footer'
import {FormattingTools} from './_FormattingTools'
import {MarkdownEditorContext} from './_MarkdownEditorContext'
import {MarkdownInput} from './_MarkdownInput'
import {SavedRepliesContext, SavedRepliesHandle, SavedReply} from './_SavedReplies'
import {MarkdownViewMode, ViewSwitch} from './_ViewSwitch'
import {FileUploadResult, useFileHandling} from './_useFileHandling'
import {useIndenting} from './_useIndenting'
import {useListEditing} from './_useListEditing'
import {SuggestionOptions} from './suggestions'
import {Emoji} from './suggestions/_useEmojiSuggestions'
import {Mentionable} from './suggestions/_useMentionSuggestions'
import {Reference} from './suggestions/_useReferenceSuggestions'
import {isModifierKey} from './utils'

export type MarkdownEditorProps = SxProp & {
  /** Current value of the editor as a multiline markdown string. */
  value: string
  /** Called when the value changes. */
  onChange: (newMarkdown: string) => void
  /**
   * Accepts Markdown and returns rendered HTML. To prevent XSS attacks,
   * the HTML should be sanitized and/or come from a trusted source.
   */
  onRenderPreview: (markdown: string) => Promise<string>
  children: React.ReactNode
  /** Disable the editor and all related buttons. Users can still switch between preview & edit modes. */
  disabled?: boolean
  /** Placeholder text to show when the editor is empty. By default, no placeholder will be shown. */
  placeholder?: string
  /** Maximum number of characters the markdown can hold (includes formatting characters like `*`). */
  maxLength?: number
  /**
   * Force the editor to take up the full height of the container and disallow resizing. Only
   * use when the container height is tall enough that the user will never want to expand the
   * input further, ie when it takes the full height of the viewport.
   */
  fullHeight?: boolean
  /** ID of the describing element. */
  'aria-describedby'?: string
  /** Optionally control the view mode. If uncontrolled, leave this `undefined`. */
  viewMode?: MarkdownViewMode
  /** If `viewMode` is controlled, this will be called on change. */
  onChangeViewMode?: (newViewMode: MarkdownViewMode) => void
  /**
   * Called when the user presses `Ctrl`/`Cmd` + `Enter`. Should almost always be wired to
   * the same event as clicking the primary `actionButton`.
   */
  onPrimaryAction?: () => void
  /**
   * Minimum number of visible lines of text in the editor.
   * @default 5
   */
  minHeightLines?: number
  /**
   * Maximum number of visible lines of text in the editor. Has no effect if `fullHeight = true`.
   * @default 35
   */
  maxHeightLines?: number
  /**
   * Array of all possible emojis to suggest. Leave `undefined` to disable emoji autocomplete.
   * For lazy-loading suggestions, an async function can be provided instead.
   */
  emojiSuggestions?: SuggestionOptions<Emoji>
  /**
   * Array of all possible mention suggestions. Leave `undefined` to disable `@`-mention autocomplete.
   * For lazy-loading suggestions, an async function can be provided instead.
   */
  mentionSuggestions?: SuggestionOptions<Mentionable>
  /**
   * Array of all possible references to suggest. Leave `undefined` to disable `#`-reference autocomplete.
   * For lazy-loading suggestions, an async function can be provided instead.
   */
  referenceSuggestions?: SuggestionOptions<Reference>
  /**
   * Uploads a file to a hosting service and returns the URL. If not provided, file uploads
   * will be disabled.
   */
  onUploadFile?: (file: File) => Promise<FileUploadResult>
  /**
   * Array of allowed file types. If `onUploadFile` is defined but this array is not, all
   * file types will be accepted. You can still reject file types by rejecting the `onUploadFile`
   * promise, but setting this array provides a better user experience by preventing the
   * upload in the first place.
   */
  acceptedFileTypes?: FileType[]
  /** Control whether the editor font is monospace. */
  monospace?: boolean
  /** Control whether the input is required. */
  required?: boolean
  /** The name that will be given to the `textarea`. */
  name?: string
  /** To enable the saved replies feature, provide an array of replies. */
  savedReplies?: SavedReply[]
  /**
   * Control whether URLs are pasted as plain text instead of as formatted links (if the
   * user has selected some text before pasting). Defaults to `false` (URLs will paste as
   * links). This should typically be controlled by user settings.
   *
   * Users can always toggle this behavior by holding `shift` when pasting.
   */
  pasteUrlsAsPlainText?: boolean
}

const handleBrand = Symbol()

export interface MarkdownEditorHandle {
  /** Focus on the markdown textarea (has no effect in preview mode). */
  focus: (options?: FocusOptions) => void
  /** Scroll to the editor. */
  scrollIntoView: (options?: ScrollIntoViewOptions) => void
  /**
   * This 'fake' member prevents other types from being assigned to this, thus
   * disallowing broader ref types like `HTMLTextAreaElement`.
   * @private
   */
  [handleBrand]: undefined
}

const a11yOnlyStyle = {clipPath: 'Circle(0)', position: 'absolute'} as const

const CONDENSED_WIDTH_THRESHOLD = 675

/**
 * We want to switch editors from preview mode on cmd/ctrl+shift+P. But in preview mode,
 * there's no input to focus so we have to bind the event to the document. If there are
 * multiple editors, we want the most recent one to switch to preview mode to be the one
 * that we switch back to edit mode, so we maintain a LIFO stack of IDs of editors in
 * preview mode.
 */
let editorsInPreviewMode: string[] = []

/**
 * Markdown textarea with controls & keyboard shortcuts.
 */
const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder,
      maxLength,
      'aria-describedby': describedBy,
      fullHeight,
      onRenderPreview,
      sx,
      onPrimaryAction,
      viewMode: controlledViewMode,
      onChangeViewMode: controlledSetViewMode,
      minHeightLines = 5,
      maxHeightLines = 35,
      emojiSuggestions,
      mentionSuggestions,
      referenceSuggestions,
      onUploadFile,
      acceptedFileTypes,
      monospace = false,
      required = false,
      name,
      children,
      savedReplies,
      pasteUrlsAsPlainText = false,
    },
    ref,
  ) => {
    const [slots, childrenWithoutSlots] = useSlots(children, {
      toolbar: Toolbar,
      actions: Actions,
      label: Label,
      footer: Footer,
    })
    const [uncontrolledViewMode, uncontrolledSetViewMode] = useState<MarkdownViewMode>('edit')
    const [view, setView] =
      controlledViewMode === undefined
        ? [uncontrolledViewMode, uncontrolledSetViewMode]
        : [controlledViewMode, controlledSetViewMode]

    const [html, setHtml] = useState<string | null>(null)
    const safeSetHtml = useSafeAsyncCallback(setHtml)

    const previewStale = useRef(true)
    useEffect(() => {
      previewStale.current = true
    }, [value])
    const loadPreview = async () => {
      if (!previewStale.current) return
      previewStale.current = false // set to false before the preview is rendered to prevent multiple concurrent calls
      safeSetHtml(null)
      safeSetHtml(await onRenderPreview(value))
    }

    useEffect(() => {
      // we have to be careful here - loading preview sets state which causes a render which can cause an infinite loop,
      // however that should be prevented by previewStale.current being set immediately in loadPreview
      if (view === 'preview' && previewStale.current) loadPreview()
    })

    const inputRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(
      ref,
      () =>
        ({
          focus: opts => inputRef.current?.focus(opts),
          scrollIntoView: opts => containerRef.current?.scrollIntoView(opts),
        } as MarkdownEditorHandle),
    )

    const inputHeight = useRef(0)
    if (inputRef.current && inputRef.current.offsetHeight) inputHeight.current = inputRef.current.offsetHeight

    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
      },
      [onChange],
    )

    const emitChange = useSyntheticChange({inputRef, fallbackEventHandler: onInputChange})

    const fileHandler = useFileHandling({
      emitChange,
      value,
      inputRef,
      disabled,
      onUploadFile,
      acceptedFileTypes,
    })

    const listEditor = useListEditing({emitChange})
    const indenter = useIndenting({emitChange})

    const formattingToolsRef = useRef<FormattingTools>(null)

    // use state instead of ref since we need to recalculate when the element mounts
    const containerRef = useRef<HTMLDivElement>(null)

    const [condensed, setCondensed] = useState(false)
    const onResize = useCallback(
      // it's fine that this isn't debounced because calling setCondensed with the current value will not trigger a render
      () => setCondensed(containerRef.current !== null && containerRef.current.clientWidth < CONDENSED_WIDTH_THRESHOLD),
      [],
    )
    useResizeObserver(onResize, containerRef)

    // workaround for Safari bug where layout is otherwise not recalculated
    useLayoutEffect(() => {
      const container = containerRef.current
      if (!container) return

      const parent = container.parentElement
      const nextSibling = containerRef.current.nextSibling
      parent?.removeChild(container)
      parent?.insertBefore(container, nextSibling)
    }, [condensed])

    // the ID must be unique for each instance while remaining constant across renders
    const id = useId()
    const descriptionId = `${id}-description`

    const savedRepliesRef = useRef<SavedRepliesHandle>(null)
    const onSelectSavedReply = (reply: SavedReply) => {
      // need to wait a tick to run after the selectmenu finishes closing
      requestAnimationFrame(() => emitChange(reply.content))
    }
    const savedRepliesContext = savedReplies ? {savedReplies, onSelect: onSelectSavedReply, ref: savedRepliesRef} : null

    const inputCompositionProps = useIgnoreKeyboardActionsWhileComposing(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const format = formattingToolsRef.current
        if (disabled) return

        if (e.ctrlKey && e.key === '.') {
          // saved replies are always Control, even on Mac
          savedRepliesRef.current?.openMenu()
          e.preventDefault()
          e.stopPropagation()
        } else if (isModifierKey(e)) {
          if (e.key === 'Enter') onPrimaryAction?.()
          else if (e.key === 'b') format?.bold()
          else if (e.key === 'i') format?.italic()
          else if (e.shiftKey && e.key === '.') format?.quote()
          else if (e.key === 'e') format?.code()
          else if (e.key === 'k') format?.link()
          else if (e.key === '8') format?.unorderedList()
          else if (e.shiftKey && e.key === '7') format?.orderedList()
          else if (e.shiftKey && e.key === 'l') format?.taskList()
          else if (e.shiftKey && e.key === 'p') setView?.('preview')
          else return

          e.preventDefault()
          e.stopPropagation()
        } else {
          listEditor.onKeyDown(e)
          indenter.onKeyDown(e)
        }
      },
    )

    useEffect(() => {
      if (view === 'preview') {
        editorsInPreviewMode.push(id)

        const handler = (e: KeyboardEvent) => {
          if (
            !e.defaultPrevented &&
            editorsInPreviewMode.at(-1) === id &&
            isModifierKey(e) &&
            e.shiftKey &&
            e.key === 'p'
          ) {
            setView?.('edit')
            setTimeout(() => inputRef.current?.focus())
            e.preventDefault()
          }
        }
        document.addEventListener('keydown', handler)

        return () => {
          document.removeEventListener('keydown', handler)
          // Performing the filtering in the cleanup callback allows it to happen also when
          // the user clicks the toggle button, not just on keyboard shortcut
          editorsInPreviewMode = editorsInPreviewMode.filter(id_ => id_ !== id)
        }
      }
    }, [view, setView, id])

    // If we don't memoize the context object, every child will rerender on every render even if memoized
    const context = useMemo(
      () => ({
        disabled,
        formattingToolsRef,
        condensed,
        required,
        fileDraggedOver: fileHandler?.isDraggedOver ?? false,
        fileUploadProgress: fileHandler?.uploadProgress,
        uploadButtonProps: fileHandler?.clickTargetProps ?? null,
        errorMessage: fileHandler?.errorMessage,
        previewMode: view === 'preview',
      }),
      [
        disabled,
        condensed,
        required,
        fileHandler?.isDraggedOver,
        fileHandler?.uploadProgress,
        fileHandler?.clickTargetProps,
        fileHandler?.errorMessage,
        view,
      ],
    )

    // We are using MarkdownEditorContext instead of the built-in Slots context because Slots' context is not typesafe
    return (
      <MarkdownEditorContext.Provider value={context}>
        <fieldset
          aria-disabled={disabled /* if we set disabled={true}, we can't enable the buttons that should be enabled */}
          aria-describedby={describedBy ? `${descriptionId} ${describedBy}` : descriptionId}
          style={{appearance: 'none', border: 'none', minInlineSize: 'auto'}}
        >
          <FormattingTools ref={formattingToolsRef} forInputId={id} />
          <div style={{display: 'none'}}>{childrenWithoutSlots}</div>

          {slots.label}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              borderColor: 'border.default',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 2,
              p: 2,
              height: fullHeight ? '100%' : undefined,
              minInlineSize: 'auto',
              bg: 'canvas.default',
              color: disabled ? 'fg.subtle' : 'fg.default',
              ...sx,
            }}
            ref={containerRef}
          >
            <VisuallyHidden id={descriptionId} aria-live="polite">
              Markdown input:
              {view === 'preview' ? ' preview mode selected.' : ' edit mode selected.'}
            </VisuallyHidden>

            <Box sx={{display: 'flex', pb: 2, gap: 2, justifyContent: 'space-between'}} as="header">
              <ViewSwitch
                selectedView={view}
                onViewSelect={setView}
                disabled={fileHandler?.uploadProgress !== undefined}
                onLoadPreview={loadPreview}
              />

              <Box sx={{display: 'flex'}}>
                <SavedRepliesContext.Provider value={savedRepliesContext}>
                  {view === 'edit' &&
                    (slots.toolbar ?? (
                      <CoreToolbar>
                        <DefaultToolbarButtons />
                      </CoreToolbar>
                    ))}
                </SavedRepliesContext.Provider>
              </Box>
            </Box>

            <MarkdownInput
              value={value}
              onChange={onInputChange}
              emojiSuggestions={emojiSuggestions}
              mentionSuggestions={mentionSuggestions}
              referenceSuggestions={referenceSuggestions}
              disabled={disabled}
              placeholder={placeholder}
              id={id}
              maxLength={maxLength}
              ref={inputRef}
              fullHeight={fullHeight}
              isDraggedOver={fileHandler?.isDraggedOver ?? false}
              minHeightLines={minHeightLines}
              maxHeightLines={maxHeightLines}
              visible={view === 'edit'}
              monospace={monospace}
              required={required}
              name={name}
              pasteUrlsAsPlainText={pasteUrlsAsPlainText}
              {...inputCompositionProps}
              {...fileHandler?.pasteTargetProps}
              {...fileHandler?.dropTargetProps}
            />

            {view === 'preview' && (
              <Box
                sx={{
                  p: 1,
                  overflow: 'auto',
                  height: fullHeight ? '100%' : undefined,
                  minHeight: inputHeight.current,
                  boxSizing: 'border-box',
                }}
                aria-live="polite"
                tabIndex={-1}
              >
                <h2 style={a11yOnlyStyle}>Rendered Markdown Preview</h2>
                <MarkdownViewer
                  dangerousRenderedHTML={{__html: html || 'Nothing to preview'}}
                  loading={html === null}
                  openLinksInNewTab
                />
              </Box>
            )}
            {slots.footer ?? (
              <CoreFooter>{React.isValidElement(slots.actions) && slots.actions.props.children}</CoreFooter>
            )}
          </Box>
        </fieldset>
      </MarkdownEditorContext.Provider>
    )
  },
)

export default MarkdownEditor
