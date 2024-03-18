import {SelectPanel} from '../'

export function titleRequiredWithSizeFull() {
  return (
    // @ts-expect-error title is required
    <SelectPanel.Message size="full" variant="empty">
      test
    </SelectPanel.Message>
  )
}

export function titleInvalidWithInline() {
  return (
    // @ts-expect-error title is invalid with inline
    <SelectPanel.Message size="inline" title="test">
      test
    </SelectPanel.Message>
  )
}

export function emptyInvalidWithInline() {
  return (
    // @ts-expect-error empty is invalid with inline
    <SelectPanel.Message size="inline" variant="empty">
      test
    </SelectPanel.Message>
  )
}
