import {useCallback, useEffect, useRef, useState} from 'react'
import {FileType, UnifiedFileSelectResult, useUnifiedFileSelect} from '../hooks'
import {SyntheticChangeEmitter} from '../hooks/useSyntheticChange'
import {markdownComment, markdownImage, markdownLink} from './utils'

const placeholder = (file: File) => markdownComment(`Uploading "${file.name}"...`)

const markdown = (file: File, url: string | null) => {
  if (!url) return markdownComment(`Failed to upload "${file.name}"`)
  if (file.type.startsWith('video/')) return url
  if (file.type.startsWith('image/')) return markdownImage('Image', url)
  return markdownLink(file.name, url)
}

type UploadProgress = [current: number, total: number]

interface UseFileHandlingResult extends UnifiedFileSelectResult {
  errorMessage?: string
  uploadProgress: UploadProgress | null
}

type UseFileHandlingProps = {
  repositoryId?: number
  inputRef: React.RefObject<HTMLTextAreaElement>
  emitChange: SyntheticChangeEmitter
  disabled?: boolean
  value: string
  onUploadFile: (file: File) => Promise<FileUploadResult>
  acceptedFileTypes?: FileType[]
}

export type FileUploadResult = {
  /** The URL of the uploaded file. `null` if the upoad failed (or reject the promise). */
  url: string
  /**
   * The file that was uploaded. Typically the client-side detected name, size, and content
   * type can be unreliable, so your file upload service may provide more accurate data. By
   * receiving an updated File instance with the more accurate data, the Markdown editor can
   * make better decisions.
   */
  file: File
}

type OptFileUploadResult = FileUploadResult | {url: null; file: File}

const noop = () => {
  /*noop*/
}

export const useFileHandling = ({
  emitChange,
  value,
  inputRef,
  disabled,
  onUploadFile,
  acceptedFileTypes
}: UseFileHandlingProps): UseFileHandlingResult => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const errorVisibleForEnoughTime = useRef(false)
  useEffect(() => {
    if (errorMessage) {
      errorVisibleForEnoughTime.current = false
      const id = setTimeout(() => (errorVisibleForEnoughTime.current = true), 1000)
      return () => clearTimeout(id)
    }
  }, [errorMessage])
  useEffect(() => {
    // clears the error message when the user types and enough time has passed
    if (errorVisibleForEnoughTime.current) setErrorMessage(undefined)
  }, [value])

  const setRejectedFiles = useCallback((files: Array<File>) => {
    const types = new Set(
      files
        .map(({name}) => {
          const parts = name.split('.')
          return parts.length > 1 ? `.${parts.at(-1)}` : ''
        })
        .filter(s => s !== '')
    )
    if (types.size > 0) setErrorMessage(`File type${types.size > 1 ? 's' : ''} not allowed: ${[...types].join(', ')}`)
  }, [])

  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  const uploadFiles = useCallback(
    (files: Array<File>): Array<Promise<OptFileUploadResult>> =>
      files.map(async file => {
        try {
          return await onUploadFile(file)
        } catch (e) {
          return {file, url: null}
        }
      }),
    [onUploadFile]
  )

  const insertPlaceholder = useCallback(
    (files: Array<File>) => {
      if (!inputRef.current) return
      const placeholders = `\n\n${files.map(placeholder).join('\n')}\n\n`

      emitChange(placeholders)
    },
    [inputRef, emitChange]
  )

  const replacePlaceholderWithMarkdown = useCallback(
    (file: File, url: string | null) => {
      if (!inputRef.current) return
      const placeholderStr = placeholder(file)
      const placeholderIndex = inputRef.current.value.indexOf(placeholderStr)
      if (placeholderIndex === -1) return

      emitChange(markdown(file, url), [placeholderIndex, placeholderIndex + placeholderStr.length])
    },
    [inputRef, emitChange]
  )

  const onSelectFiles = useCallback(
    async (accepted: Array<File>, rejected: Array<File>) => {
      if (accepted.length > 0) {
        setUploadProgress([1, accepted.length])
        insertPlaceholder(accepted)

        await Promise.all(
          uploadFiles(accepted).map(async promise => {
            const {file, url} = await promise
            setUploadProgress(progress => [(progress?.[0] ?? 1) + 1, accepted.length])
            replacePlaceholderWithMarkdown(file, url)
          })
        )

        setUploadProgress(null)
      }
      setRejectedFiles(rejected)
    },
    [insertPlaceholder, uploadFiles, setRejectedFiles, replacePlaceholderWithMarkdown]
  )

  let fileSelect = useUnifiedFileSelect({
    acceptedFileTypes,
    multi: true,
    onSelect: onSelectFiles
  })

  if (disabled) {
    fileSelect = {
      clickTargetProps: {
        onClick: noop
      },
      dropTargetProps: {
        onDragEnter: noop,
        onDragLeave: noop,
        onDrop: noop,
        onDragOver: noop
      },
      pasteTargetProps: {
        onPaste: noop
      },
      isDraggedOver: false
    }
  }

  return {...fileSelect, errorMessage, uploadProgress}
}
