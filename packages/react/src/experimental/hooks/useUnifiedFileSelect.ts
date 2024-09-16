import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

type TopLevelMimeType =
  | 'application'
  | 'audio'
  | 'font'
  | 'image'
  | 'model'
  | 'text'
  | 'video'
  | 'message'
  | 'multipart'

type MimeType = `${TopLevelMimeType}/${string}`

/** @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers */
export type FileType = `.${string}` | MimeType

type CommonFileSelectProps = {
  acceptedFileTypes?: Array<FileType>
}

export type SingleFileSelectProps = CommonFileSelectProps & {
  onSelect: (accepted?: File, rejected?: File) => void
  multi?: false
}

export type MultiFileSelectProps = CommonFileSelectProps & {
  onSelect: (accepted: Array<File>, rejected: Array<File>) => void
  multi: true
}

export type FileSelectProps = SingleFileSelectProps | MultiFileSelectProps

type PasteTargetProps = {
  onPaste: React.ClipboardEventHandler
}

type ClickTargetProps = {
  onClick: React.MouseEventHandler
}

type DropTargetProps = {
  onDragEnter: React.DragEventHandler
  onDragLeave: React.DragEventHandler
  onDrop: React.DragEventHandler
  onDragOver: React.DragEventHandler
}

export type UnifiedFileSelectResult = {
  pasteTargetProps: PasteTargetProps
  clickTargetProps: ClickTargetProps
  dropTargetProps: DropTargetProps
  isDraggedOver: boolean
}

/** Returns a function that can check if a file matches the file type. */
const fileTypeMatcher = (fileType: FileType): ((file: File) => boolean) => {
  if (fileType.startsWith('.')) {
    return file => file.name.toLowerCase().endsWith(fileType.toLowerCase())
  } else {
    const mimeTypeMatch = fileType.match(mimeTypeRegex)
    if (mimeTypeMatch === null) return () => false // invalid FileType matches no files

    const [, targetType, targetSubtype] = mimeTypeMatch

    return file => {
      const [, type, subType] = file.type.match(mimeTypeRegex) ?? []
      return (
        targetType.toLowerCase() === type.toLowerCase() &&
        (targetSubtype === '*' || targetSubtype.toLowerCase() === subType.toLowerCase())
      )
    }
  }
}

function useOnSelectFiles(props: FileSelectProps) {
  const matchers = useMemo(() => props.acceptedFileTypes?.map(fileTypeMatcher), [props.acceptedFileTypes])
  const isAcceptableFile = useCallback((file: File) => matchers?.some(m => m(file)) ?? true, [matchers])

  return useCallback(
    function onSelectFiles(files: FileList): boolean {
      if (files.length === 0) return false

      if (props.multi) {
        // isAcceptableFile is not that fast, so only run once per file
        const accepted: File[] = []
        const rejected: File[] = []
        for (const file of files) isAcceptableFile(file) ? accepted.push(file) : rejected.push(file)
        props.onSelect(accepted, rejected)
      } else {
        const file = files[0]
        if (isAcceptableFile(file)) props.onSelect(file, undefined)
        else props.onSelect(undefined, file)
      }

      return true
    },
    // Because props is a discriminated union type, eslint isn't smart enough to realize we
    // are putting all used properties in the dependency array. We can't use destructuring
    // to extract them or we'll lose the type link between multi & onSelect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAcceptableFile, props.multi, props.onSelect],
  )
}

/** Simple (naive) regex to split a `type/subtype;params` MIME type into parts. */
const mimeTypeRegex = /([^/]+)\/([^;]);?(.*)/

/**
 * Provides event handlers for all types of file upload targets, unifying events into a
 * single `onSelect` event. Does not manage its own state as far as which files are
 * currently selected - this should be done in the parent component.
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
export function useUnifiedFileSelect(props: FileSelectProps): UnifiedFileSelectResult {
  const clickTargetProps = useClickFileSelect(props)
  const pasteTargetProps = usePasteFileSelect(props)
  const [isDraggedOver, dropTargetProps] = useDropFileSelect(props)

  return useMemo(
    () => ({
      clickTargetProps,
      pasteTargetProps,
      dropTargetProps,
      isDraggedOver,
    }),
    [clickTargetProps, dropTargetProps, isDraggedOver, pasteTargetProps],
  )
}

/**
 * Provides a click event handler for opening a file select dialog. Calls `onSelect` upon
 * completion.
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
export function useClickFileSelect(props: FileSelectProps): ClickTargetProps {
  const onSelectFiles = useOnSelectFiles(props)
  const {multi, acceptedFileTypes} = props

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onInputChange = useCallback(
    function onChange(this: HTMLInputElement) {
      // eslint-disable-next-line no-invalid-this
      if (this.files) onSelectFiles(this.files)
    },
    [onSelectFiles],
  )

  // The only way to open a file select window is to click on an input type="file" so we
  // create a hidden one and insert it into the DOM, then simulate a click on it when needed
  useEffect(
    function createFileInputClickTarget() {
      const fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('multiple', multi ? 'true' : 'false')
      if (acceptedFileTypes) fileInput.setAttribute('accept', acceptedFileTypes.join(', '))
      fileInput.style.display = 'none'
      fileInput.addEventListener('change', onInputChange)

      document.body.appendChild(fileInput)
      fileInputRef.current = fileInput

      return () => {
        fileInputRef.current = null
        fileInput.parentNode?.removeChild(fileInput)
      }
    },
    [multi, acceptedFileTypes, onInputChange],
  )

  // Because we don't use the event object, it's tempting to change the function type from
  // `MouseEventHandler` to simply `() => void` so the consumer doesn't have to pass a click
  // event and can programmatically trigger the file select. However, due to security
  // restrictions the file select dialog can only be opened while handling a user interaction
  // so the type of this method ensures that it is NOT called programmatically, which would fail.
  const onClick = useCallback(() => fileInputRef.current?.click(), [])

  return useMemo(
    () => ({
      onClick,
    }),

    [onClick],
  )
}

// The `files` property will always be empty before drop (while dragging), but basic info is given in the `items` property
const isFileDragEvent = (event: React.DragEvent) =>
  Array.from(event.dataTransfer.items).some(({kind}) => kind === 'file')

/**
 * Provides event handlers for a file drop region. Calls `onSelect` upon drop. Note that
 * drop targets alone are not accessible - combine with a click target.
 * @return Tuple of `[isDraggedOver, dropTargetProps]` where `isDraggedOver` is true if a valid item
 * is dragged over the drop target and `dropTargetProps` should be spread to the drop
 * target.
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
export function useDropFileSelect(props: FileSelectProps): [isDraggedOver: boolean, dropTargetProps: DropTargetProps] {
  const onSelectFiles = useOnSelectFiles(props)

  const [isDraggedOver, setIsDraggedOver] = useState(false)

  const onDragLeave = useCallback(() => setIsDraggedOver(false), [])

  const onDragEnter = useCallback((event: React.DragEvent) => {
    if (!isFileDragEvent(event)) return
    setIsDraggedOver(true)
    event.preventDefault()
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    // This method must be fast as it will be called every few milliseconds
    if (!isFileDragEvent(event)) return
    event.preventDefault() // prevents the 'drop caret' from appearing in the textarea because we are not (yet) respecting the specific drop location
    event.dataTransfer.dropEffect = 'link'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (onSelectFiles(event.dataTransfer.files)) {
        event.preventDefault()
        setIsDraggedOver(false)
      }
    },
    [onSelectFiles],
  )

  const dropTargetProps = useMemo(
    () => ({
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      // onDragStart and onDragEnd are not relevant for system file dragging
    }),
    [onDrop, onDragOver, onDragLeave, onDragEnter],
  )

  return [isDraggedOver, dropTargetProps]
}

/**
 * Provides a paste event handler for pasting files. Props should be spread on an element
 * with `contenteditable` or a text input/textarea.
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
export function usePasteFileSelect(props: FileSelectProps): PasteTargetProps {
  const onSelectFiles = useOnSelectFiles(props)

  return useMemo(
    () => ({
      onPaste: (event: React.ClipboardEvent) => {
        if (onSelectFiles(event.clipboardData.files)) {
          event.preventDefault()
        }
      },
    }),

    [onSelectFiles],
  )
}
