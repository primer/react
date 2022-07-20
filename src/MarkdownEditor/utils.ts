export const getSelectedLineRange = (textarea: HTMLTextAreaElement): [number, number] => {
  // Subtract one from the caret position so the newline found is not the one _at_ the caret position
  // then add one because we don't want to include the found newline. Also changes -1 (not found) result to 0
  const start = textarea.value.lastIndexOf('\n', textarea.selectionStart - 1) + 1

  // activeLineEnd will be the index of the next newline inclusive, which works because slice is last-index exclusive
  let end = textarea.value.indexOf('\n', textarea.selectionEnd)
  if (end === -1) end = textarea.value.length

  return [start, end]
}
