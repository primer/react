import {useCallback, useEffect, useRef, useState} from 'react'
import type {FileType, UnifiedFileSelectResult} from '../hooks/useUnifiedFileSelect'
import {useUnifiedFileSelect} from '../hooks/useUnifiedFileSelect'
import {useSafeAsyncCallback} from '../hooks/useSafeAsyncCallback'
import type {SyntheticChangeEmitter} from '../hooks/useSyntheticChange'
import {markdownComment, markdownImage, markdownLink} from './utils'
export type {FileType} from '../hooks/useUnifiedFileSelect'

const placeholder = (file: File) => markdownComment(`Uploading "${file.name}"...`)

const markdown = (file: File, url: string | null) => {
  if (!url) return markdownComment(`Failed to upload "${file.name}"`)
  if (file.type.startsWith('video/')) return url
  if (file.type.startsWith('image/')) return markdownImage('Image', url)
  return markdownLink(file.name, url)
}

type UploadProgress = [current: number, total: number]

type UseFileHandlingResult = UnifiedFileSelectResult & {
  errorMessage?: string
  uploadProgress?: UploadProgress
}

type UseFileHandlingProps = {
  repositoryId?: number
  inputRef: React.RefObject<HTMLTextAreaElement>
  emitChange: SyntheticChangeEmitter
  disabled?: boolean
  value: string
  onUploadFile?: (file: File) => Promise<FileUploadResult>
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
  acceptedFileTypes,
}: UseFileHandlingProps): UseFileHandlingResult | null => {
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

  const safeSetRejectedFiles = useSafeAsyncCallback((files: Array<File>) => {
    const types = new Set(
      files
        .map(({name}) => {
          const parts = name.split('.')
          return parts.length > 1 ? `.${parts.at(-1)}` : ''
        })
        .filter(s => s !== ''),
    )
    if (types.size > 0) setErrorMessage(`File type${types.size > 1 ? 's' : ''} not allowed: ${[...types].join(', ')}`)
  })

  const [uploadProgress, setUploadProgress] = useState<UploadProgress | undefined>(undefined)
  const safeClearUploadProgress = useSafeAsyncCallback(() => setUploadProgress(undefined))

  const insertPlaceholder = useCallback(
    (files: Array<File>) => {
      if (!inputRef.current) return
      const placeholders = `\n\n${files.map(placeholder).join('\n')}\n\n`

      emitChange(placeholders)
    },
    [inputRef, emitChange],
  )

  const replacePlaceholderWithMarkdown = (file: File, url: string | null) => {
    if (!inputRef.current) return
    const placeholderStr = placeholder(file)
    const placeholderIndex = inputRef.current.value.indexOf(placeholderStr)
    if (placeholderIndex === -1) return

    emitChange(markdown(file, url), [placeholderIndex, placeholderIndex + placeholderStr.length])
  }

  // It's crucial that this is done safely because file uploads can take a long time - there's
  // a very good chance that the references will be outdated or the component unmounted by the time this is called.
  const safeHandleCompletedFileUpload = useSafeAsyncCallback(({file, url}: OptFileUploadResult) => {
    setUploadProgress(progress => progress && [progress[0] + 1, progress[1]])
    replacePlaceholderWithMarkdown(file, url)
  })

  const uploadFiles = useCallback(
    (files: Array<File>): Array<Promise<void>> =>
      files.map(async file => {
        let result: OptFileUploadResult = {url: null, file}
        try {
          result = (await onUploadFile?.(file)) ?? {file, url: null}
        } catch (e) {
          result = {file, url: null}
        }

        safeHandleCompletedFileUpload(result)
      }),
    [onUploadFile, safeHandleCompletedFileUpload],
  )

  const onSelectFiles = useCallback(
    async (accepted: Array<File>, rejected: Array<File>) => {
      if (accepted.length > 0) {
        setUploadProgress([1, accepted.length])
        insertPlaceholder(accepted)

        await Promise.all(uploadFiles(accepted))

        safeClearUploadProgress()
      }
      // setting rejected files will hide upload progress, replacing it with an error message
      // so only call it after successful files are uploaded
      safeSetRejectedFiles(rejected)
    },
    [safeSetRejectedFiles, insertPlaceholder, uploadFiles, safeClearUploadProgress],
  )

  let fileSelect = useUnifiedFileSelect({
    acceptedFileTypes,
    multi: true,
    onSelect: onSelectFiles,
  })

  if (disabled) {
    fileSelect = {
      clickTargetProps: {
        onClick: noop,
      },
      dropTargetProps: {
        onDragEnter: noop,
        onDragLeave: noop,
        onDrop: noop,
        onDragOver: noop,
      },
      pasteTargetProps: {
        onPaste: noop,
      },
      isDraggedOver: false,
    }
  }

  return onUploadFile ? {...fileSelect, errorMessage, uploadProgress} : null
}
