import {isMacOS} from '@primer/behaviors/utils'

export type InputState = {
  readonly value: string
  readonly selectionStart: number
  readonly selectionEnd: number
}

export const getSelectedLineRange = (inputState: InputState): [number, number] => {
  // Subtract one from the caret position so the newline found is not the one _at_ the caret position
  // then add one because we don't want to include the found newline. Also changes -1 (not found) result to 0
  const start = inputState.value.lastIndexOf('\n', inputState.selectionStart - 1) + 1

  // activeLineEnd will be the index of the next newline inclusive, which works because slice is last-index exclusive
  let end = inputState.value.indexOf('\n', inputState.selectionEnd)
  if (end === -1) end = inputState.value.length

  return [start, end]
}

export const markdownComment = (text: string) => `<!-- ${text.replaceAll('--', '\\-\\-')} -->`

export const markdownLink = (text: string, url: string) =>
  `[${text.replaceAll('[', '\\[').replaceAll(']', '\\]')}](${url.replaceAll('(', '\\(').replaceAll(')', '\\)')})`

export const markdownImage = (altText: string, url: string) => `!${markdownLink(altText, url)}`

export const isModifierKey = (event: KeyboardEvent | React.KeyboardEvent<unknown>) =>
  isMacOS() ? event.metaKey : event.ctrlKey

export function isMultipleLines(string: string): boolean {
  return string.trim().split('\n').length > 1
}
