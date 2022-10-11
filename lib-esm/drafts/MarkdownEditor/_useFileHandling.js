import { useState, useRef, useEffect, useCallback } from 'react';
import { useUnifiedFileSelect } from '../hooks/useUnifiedFileSelect.js';
import { useSafeAsyncCallback } from '../hooks/useSafeAsyncCallback.js';
import { markdownComment, markdownImage, markdownLink } from './utils.js';

const placeholder = file => markdownComment(`Uploading "${file.name}"...`);

const markdown = (file, url) => {
  if (!url) return markdownComment(`Failed to upload "${file.name}"`);
  if (file.type.startsWith('video/')) return url;
  if (file.type.startsWith('image/')) return markdownImage('Image', url);
  return markdownLink(file.name, url);
};

const noop = () => {
  /*noop*/
};

const useFileHandling = ({
  emitChange,
  value,
  inputRef,
  disabled,
  onUploadFile,
  acceptedFileTypes
}) => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const errorVisibleForEnoughTime = useRef(false);
  useEffect(() => {
    if (errorMessage) {
      errorVisibleForEnoughTime.current = false;
      const id = setTimeout(() => errorVisibleForEnoughTime.current = true, 1000);
      return () => clearTimeout(id);
    }
  }, [errorMessage]);
  useEffect(() => {
    // clears the error message when the user types and enough time has passed
    if (errorVisibleForEnoughTime.current) setErrorMessage(undefined);
  }, [value]);
  const safeSetRejectedFiles = useSafeAsyncCallback(files => {
    const types = new Set(files.map(({
      name
    }) => {
      const parts = name.split('.');
      return parts.length > 1 ? `.${parts.at(-1)}` : '';
    }).filter(s => s !== ''));
    if (types.size > 0) setErrorMessage(`File type${types.size > 1 ? 's' : ''} not allowed: ${[...types].join(', ')}`);
  });
  const [uploadProgress, setUploadProgress] = useState(undefined);
  const safeClearUploadProgress = useSafeAsyncCallback(() => setUploadProgress(undefined));
  const insertPlaceholder = useCallback(files => {
    if (!inputRef.current) return;
    const placeholders = `\n\n${files.map(placeholder).join('\n')}\n\n`;
    emitChange(placeholders);
  }, [inputRef, emitChange]);

  const replacePlaceholderWithMarkdown = (file, url) => {
    if (!inputRef.current) return;
    const placeholderStr = placeholder(file);
    const placeholderIndex = inputRef.current.value.indexOf(placeholderStr);
    if (placeholderIndex === -1) return;
    emitChange(markdown(file, url), [placeholderIndex, placeholderIndex + placeholderStr.length]);
  }; // It's crucial that this is done safely because file uploads can take a long time - there's
  // a very good chance that the references will be outdated or the component unmounted by the time this is called.


  const safeHandleCompletedFileUpload = useSafeAsyncCallback(({
    file,
    url
  }) => {
    setUploadProgress(progress => progress && [progress[0] + 1, progress[1]]);
    replacePlaceholderWithMarkdown(file, url);
  });
  const uploadFiles = useCallback(files => files.map(async file => {
    let result = {
      url: null,
      file
    };

    try {
      var _await$onUploadFile;

      result = (_await$onUploadFile = await (onUploadFile === null || onUploadFile === void 0 ? void 0 : onUploadFile(file))) !== null && _await$onUploadFile !== void 0 ? _await$onUploadFile : {
        file,
        url: null
      };
    } catch (e) {
      result = {
        file,
        url: null
      };
    }

    safeHandleCompletedFileUpload(result);
  }), [onUploadFile, safeHandleCompletedFileUpload]);
  const onSelectFiles = useCallback(async (accepted, rejected) => {
    if (accepted.length > 0) {
      setUploadProgress([1, accepted.length]);
      insertPlaceholder(accepted);
      await Promise.all(uploadFiles(accepted));
      safeClearUploadProgress();
    } // setting rejected files will hide upload progress, replacing it with an error message
    // so only call it after successful files are uploaded


    safeSetRejectedFiles(rejected);
  }, [safeSetRejectedFiles, insertPlaceholder, uploadFiles, safeClearUploadProgress]);
  let fileSelect = useUnifiedFileSelect({
    acceptedFileTypes,
    multi: true,
    onSelect: onSelectFiles
  });

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
    };
  }

  return onUploadFile ? { ...fileSelect,
    errorMessage,
    uploadProgress
  } : null;
};

export { useFileHandling };
