import {isMacOS} from '@primer/behaviors/dist/esm/utils'
import {useSSRSafeId} from '@react-aria/ssr'
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react'
import Box from '../Box'
import {FileType} from '../hooks'
import {useIgnoreKeyboardActionsWhileComposing} from '../hooks/useIgnoreKeyboardActionsWhileComposing'
import {useResizeObserver} from '../hooks/useResizeObserver'
import {useSyntheticChange} from '../hooks/useSyntheticChange'
import MarkdownViewer from '../MarkdownViewer'
import {SxProp} from '../sx'
import InputLabel from '../_InputLabel'
import VisuallyHidden from '../_VisuallyHidden'
import {MarkdownEditorFooter} from './_MarkdownEditorFooter'
import {MarkdownInput} from './_MarkdownEditorInput'
import {MarkdownToolbar} from './_MarkdownToolbar'
import {FileUploadResult, useFileHandling} from './_useFileHandling'
import {useIndenting} from './_useIndenting'
import {useListEditing} from './_useListEditing'
import {EmojiSuggestionHandler, MentionSuggestionHandler, ReferenceSuggestionHandler} from './_useSuggestions'
import {MarkdownViewMode, ViewSwitch} from './_ViewSwitch'

export type MarkdownEditorProps = SxProp & {
  /** Current value of the editor as a multiline markdown string. */
  value: string
  /** Called when the value changes. */
  onChange: (newMarkdown: string) => void
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
  /**
   * Any additional buttons to show in the editor. Buttons should be `size="small"` for
   * optimal display. If there are multiple buttons, wrap them in a fragment.
   */
  actionButtons?: React.ReactNode
  /** ID of the describing element. */
  describedBy?: string
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
  /** Accessible label for the editor. A label is required, though it can be hidden with `hideLabel`. */
  label: React.ReactNode
  /** Control whether the label is hidden. */
  hideLabel?: boolean
  /**
   * Accepts Markdown and returns rendered HTML. To prevent XSS attacks,
   * the HTML should be sanitized and/or come from a trusted source.
   */
  onRenderPreview: (markdown: string) => Promise<string>
  /** Returns an ordered list of emoji suggestions matching a query. */
  onSuggestEmojis?: EmojiSuggestionHandler
  /** Returns an ordered list of mention suggestions matching a query. */
  onSuggestMentions?: MentionSuggestionHandler
  /** Returns an ordered list of reference suggestions matching a query. */
  onSuggestReferences?: ReferenceSuggestionHandler
  /** Uploads a file to a hosting service and returns the URL. */
  onUploadFile: (file: File) => Promise<FileUploadResult>
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
}

export interface MarkdownEditor {
  /** Focus on the markdown textarea (has no effect in preview mode). */
  focus: (options?: FocusOptions) => void
  /** Scroll to the editor. */
  scrollIntoView: (options?: ScrollIntoViewOptions) => void
}

const a11yOnlyStyle = {clipPath: 'Circle(0)', position: 'absolute'} as const

const CONDENSED_WIDTH_THRESHOLD = 675

/**
 * Markdown textarea with controls & keyboard shortcuts.
 */
export const MarkdownEditor = forwardRef<MarkdownEditor, MarkdownEditorProps>(
  (
    {
      value,
      onChange,
      disabled,
      placeholder,
      maxLength,
      actionButtons,
      describedBy,
      fullHeight,
      onRenderPreview,
      sx,
      onPrimaryAction,
      viewMode: controlledViewMode,
      onChangeViewMode: controlledSetViewMode,
      minHeightLines = 5,
      maxHeightLines = 35,
      label,
      onSuggestEmojis,
      onSuggestMentions,
      onSuggestReferences,
      onUploadFile,
      acceptedFileTypes,
      monospace = false,
      hideLabel = false,
      required = false,
      name
    },
    ref
  ) => {
    const [uncontrolledViewMode, uncontrolledSetViewMode] = useState<MarkdownViewMode>('edit')
    const [view, setView] =
      controlledViewMode === undefined
        ? [uncontrolledViewMode, uncontrolledSetViewMode]
        : [controlledViewMode, controlledSetViewMode]

    const [html, setHtml] = useState<string | null>(null)

    const previewStale = useRef(true)
    useEffect(() => {
      previewStale.current = true
    }, [value])
    const loadPreview = async () => {
      if (!previewStale.current) return
      setHtml(null)
      setHtml(await onRenderPreview(value))
      previewStale.current = false
    }

    const inputRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => ({
      focus: opts => inputRef.current?.focus(opts),
      scrollIntoView: opts => containerRef.current?.scrollIntoView(opts)
    }))

    const inputHeight = useRef(0)
    if (inputRef.current && inputRef.current.offsetHeight) inputHeight.current = inputRef.current.offsetHeight

    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
      },
      [onChange]
    )

    const emitChange = useSyntheticChange({inputRef, fallbackEventHandler: onInputChange})

    const fileHandler = useFileHandling({
      emitChange,
      value,
      inputRef,
      disabled,
      onUploadFile,
      acceptedFileTypes
    })

    const listEditor = useListEditing({emitChange})
    const indenter = useIndenting({emitChange})

    const toolbarRef = useRef<MarkdownToolbar>(null)

    // use state instead of ref since we need to recalculate when the element mounts
    const containerRef = useRef<HTMLDivElement>(null)
    const [condensed, setCondensed] = useState(false)
    const onResize = useCallback(
      // it's fine that this isn't debounced because calling setCondensed with the current value will not trigger a render
      () => setCondensed(containerRef.current !== null && containerRef.current.clientWidth < CONDENSED_WIDTH_THRESHOLD),
      []
    )
    useResizeObserver(onResize, containerRef.current)

    // the ID must be unique for each instance while remaining constant across renders
    const id = useSSRSafeId()
    const descriptionId = `${id}-description`

    const inputCompositionProps = useIgnoreKeyboardActionsWhileComposing(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const toolbar = toolbarRef.current
        if (disabled) return

        if (isMacOS() ? e.metaKey : e.ctrlKey) {
          if (e.key === 'Enter') onPrimaryAction?.()
          else if (e.key === 'b') toolbar?.bold()
          else if (e.key === 'i') toolbar?.italic()
          else if (e.shiftKey && e.key === '.') toolbar?.quote()
          else if (e.key === 'e') toolbar?.code()
          else if (e.key === 'k') toolbar?.link()
          else if (e.key === '8') toolbar?.unorderedList()
          else if (e.shiftKey && e.key === '7') toolbar?.orderedList()
          else if (e.shiftKey && e.key === 'l') toolbar?.taskList()
          else return

          e.preventDefault()
          e.stopPropagation()
        } else {
          listEditor.onKeyDown(e)
          indenter.onKeyDown(e)
        }
      }
    )

    return (
      <fieldset
        disabled={disabled}
        aria-describedby={describedBy ? `${descriptionId} ${describedBy}` : descriptionId}
        style={{appearance: 'none', border: 'none'}}
      >
        <InputLabel as="legend" sx={{cursor: 'default', mb: 1}} visuallyHidden={hideLabel} required={required}>
          {label}
        </InputLabel>

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
            ...sx
          }}
          ref={containerRef}
        >
          <VisuallyHidden id={descriptionId} aria-live="polite">
            Markdown input:
            {view === 'preview' ? 'Preview mode selected' : 'Edit mode selected'}
          </VisuallyHidden>

          <Box sx={{display: 'flex', pb: 2, gap: 2, justifyContent: 'space-between'}} as="header">
            <ViewSwitch
              selectedView={view}
              onViewSelect={setView}
              condensed={condensed}
              disabled={fileHandler.uploadProgress !== null}
              onLoadPreview={loadPreview}
            />

            <Box sx={{display: 'flex'}}>
              {view === 'edit' && (
                <MarkdownToolbar forInputId={id} disabled={disabled} ref={toolbarRef} condensed={condensed} />
              )}
            </Box>
          </Box>

          <MarkdownInput
            value={value}
            onChange={onInputChange}
            onSuggestEmojis={onSuggestEmojis}
            onSuggestReferences={onSuggestReferences}
            onSuggestMentions={onSuggestMentions}
            disabled={disabled}
            placeholder={placeholder}
            id={id}
            maxLength={maxLength}
            ref={inputRef}
            fullHeight={fullHeight}
            isDraggedOver={fileHandler.isDraggedOver}
            minHeightLines={minHeightLines}
            maxHeightLines={maxHeightLines}
            visible={view === 'edit'}
            monospace={monospace}
            required={required}
            name={name}
            {...inputCompositionProps}
            {...fileHandler.pasteTargetProps}
            {...fileHandler.dropTargetProps}
          />

          {view === 'preview' && (
            <Box
              sx={{
                p: 1,
                overflow: 'auto',
                height: fullHeight ? '100%' : undefined,
                minHeight: inputHeight.current,
                boxSizing: 'border-box'
              }}
              aria-live="polite"
            >
              <h2 style={a11yOnlyStyle}>Rendered Markdown Preview</h2>
              <MarkdownViewer
                dangerousRenderedHTML={{__html: html || 'Nothing to preview'}}
                loading={html === null}
                openLinksInNewTab
              />
            </Box>
          )}

          <MarkdownEditorFooter
            actionButtons={actionButtons}
            condensed={condensed}
            fileDraggedOver={fileHandler.isDraggedOver}
            fileUploadProgress={fileHandler.uploadProgress}
            uploadButtonProps={{
              disabled,
              ...fileHandler.clickTargetProps
            }}
            errorMessage={fileHandler.errorMessage}
            previewMode={view === 'preview'}
          />
        </Box>
      </fieldset>
    )
  }
)
MarkdownEditor.displayName = 'MarkdownEditor'
