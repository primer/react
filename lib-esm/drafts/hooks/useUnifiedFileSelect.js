import { useMemo, useRef, useCallback, useEffect, useState } from 'react';

/** Returns a function that can check if a file matches the file type. */
const fileTypeMatcher = fileType => {
  if (fileType.startsWith('.')) {
    return file => file.name.toLowerCase().endsWith(fileType.toLowerCase());
  } else {
    const mimeTypeMatch = fileType.match(mimeTypeRegex);
    if (mimeTypeMatch === null) return () => false; // invalid FileType matches no files

    const [, targetType, targetSubtype] = mimeTypeMatch;
    return file => {
      var _file$type$match;

      const [, type, subType] = (_file$type$match = file.type.match(mimeTypeRegex)) !== null && _file$type$match !== void 0 ? _file$type$match : [];
      return targetType.toLowerCase() === type.toLowerCase() && (targetSubtype === '*' || targetSubtype.toLowerCase() === subType.toLowerCase());
    };
  }
};

function useOnSelectFiles(props) {
  const matchers = useMemo(() => {
    var _props$acceptedFileTy;

    return (_props$acceptedFileTy = props.acceptedFileTypes) === null || _props$acceptedFileTy === void 0 ? void 0 : _props$acceptedFileTy.map(fileTypeMatcher);
  }, [props.acceptedFileTypes]);
  const isAcceptableFile = useCallback(file => {
    var _matchers$some;

    return (_matchers$some = matchers === null || matchers === void 0 ? void 0 : matchers.some(m => m(file))) !== null && _matchers$some !== void 0 ? _matchers$some : true;
  }, [matchers]);
  return useCallback(function onSelectFiles(files) {
    if (files.length === 0) return false;

    if (props.multi) {
      // isAcceptableFile is not that fast, so only run once per file
      const accepted = [];
      const rejected = [];

      for (const file of files) isAcceptableFile(file) ? accepted.push(file) : rejected.push(file);

      props.onSelect(accepted, rejected);
    } else {
      const file = files[0];
      if (isAcceptableFile(file)) props.onSelect(file, undefined);else props.onSelect(undefined, file);
    }

    return true;
  }, // Because props is a discriminated union type, eslint isn't smart enough to realize we
  // are putting all used properties in the dependency array. We can't use destructuring
  // to extract them or we'll lose the type link between multi & onSelect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isAcceptableFile, props.multi, props.onSelect]);
}
/** Simple (naive) regex to split a `type/subtype;params` MIME type into parts. */


const mimeTypeRegex = /([^/]+)\/([^;]);?(.*)/;
/**
 * Provides event handlers for all types of file upload targets, unifying events into a
 * single `onSelect` event. Does not manage its own state as far as which files are
 * currently selected - this should be done in the parent component.
 */

function useUnifiedFileSelect(props) {
  const clickTargetProps = useClickFileSelect(props);
  const pasteTargetProps = usePasteFileSelect(props);
  const [isDraggedOver, dropTargetProps] = useDropFileSelect(props);
  return useMemo(() => ({
    clickTargetProps,
    pasteTargetProps,
    dropTargetProps,
    isDraggedOver
  }), [clickTargetProps, dropTargetProps, isDraggedOver, pasteTargetProps]);
}
/**
 * Provides a click event handler for opening a file select dialog. Calls `onSelect` upon
 * completion.
 */

function useClickFileSelect(props) {
  const onSelectFiles = useOnSelectFiles(props);
  const {
    multi,
    acceptedFileTypes
  } = props;
  const fileInputRef = useRef(null);
  const onInputChange = useCallback(function onChange() {
    // eslint-disable-next-line no-invalid-this
    if (this.files) onSelectFiles(this.files);
  }, [onSelectFiles]); // The only way to open a file select window is to click on an input type="file" so we
  // create a hidden one and insert it into the DOM, then simulate a click on it when needed

  useEffect(function createFileInputClickTarget() {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('multiple', multi ? 'true' : 'false');
    if (acceptedFileTypes) fileInput.setAttribute('accept', acceptedFileTypes.join(', '));
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', onInputChange);
    document.body.appendChild(fileInput);
    fileInputRef.current = fileInput;
    return () => {
      var _fileInput$parentNode;

      fileInputRef.current = null;
      (_fileInput$parentNode = fileInput.parentNode) === null || _fileInput$parentNode === void 0 ? void 0 : _fileInput$parentNode.removeChild(fileInput);
    };
  }, [multi, acceptedFileTypes, onInputChange]); // Because we don't use the event object, it's tempting to change the function type from
  // `MouseEventHandler` to simply `() => void` so the consumer doesn't have to pass a click
  // event and can programmatically trigger the file select. However, due to security
  // restrictions the file select dialog can only be opened while handling a user interaction
  // so the type of this method ensures that it is NOT called programmatically, which would fail.

  const onClick = useCallback(() => {
    var _fileInputRef$current;

    return (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 ? void 0 : _fileInputRef$current.click();
  }, []);
  return useMemo(() => ({
    onClick
  }), [onClick]);
} // The `files` property will always be empty before drop (while dragging), but basic info is given in the `items` property

const isFileDragEvent = event => Array.from(event.dataTransfer.items).some(({
  kind
}) => kind === 'file');
/**
 * Provides event handlers for a file drop region. Calls `onSelect` upon drop. Note that
 * drop targets alone are not accessible - combine with a click target.
 * @return Tuple of `[isDraggedOver, dropTargetProps]` where `isDraggedOver` is true if a valid item
 * is dragged over the drop target and `dropTargetProps` should be spread to the drop
 * target.
 */


function useDropFileSelect(props) {
  const onSelectFiles = useOnSelectFiles(props);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const onDragLeave = useCallback(() => setIsDraggedOver(false), []);
  const onDragEnter = useCallback(event => {
    if (!isFileDragEvent(event)) return;
    setIsDraggedOver(true);
    event.preventDefault();
  }, []);
  const onDragOver = useCallback(event => {
    // This method must be fast as it will be called every few milliseconds
    if (!isFileDragEvent(event)) return;
    event.preventDefault(); // prevents the 'drop caret' from appearing in the textarea because we are not (yet) respecting the specific drop location

    event.dataTransfer.dropEffect = 'link';
  }, []);
  const onDrop = useCallback(event => {
    if (onSelectFiles(event.dataTransfer.files)) {
      event.preventDefault();
      setIsDraggedOver(false);
    }
  }, [onSelectFiles]);
  const dropTargetProps = useMemo(() => ({
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop // onDragStart and onDragEnd are not relevant for system file dragging

  }), [onDrop, onDragOver, onDragLeave, onDragEnter]);
  return [isDraggedOver, dropTargetProps];
}
/**
 * Provides a paste event handler for pasting files. Props should be spread on an element
 * with `contenteditable` or a text input/textarea.
 */

function usePasteFileSelect(props) {
  const onSelectFiles = useOnSelectFiles(props);
  return useMemo(() => ({
    onPaste: event => {
      if (onSelectFiles(event.clipboardData.files)) {
        event.preventDefault();
      }
    }
  }), [onSelectFiles]);
}

export { useClickFileSelect, useDropFileSelect, usePasteFileSelect, useUnifiedFileSelect };
