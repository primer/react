# Copy to clipboard

The experimental clipboard APIs are available from `@primer/react/experimental`.

```tsx
import {CopyToClipboardButton} from '@primer/react/experimental'
;<CopyToClipboardButton textToCopy="Hello, world!" ariaLabel="Copy greeting" />
```

`CopyToClipboardButton` composes `IconButton`, `Tooltip`, and `useCopyToClipboard`. It keeps its accessible name stable and announces success or failure after the clipboard write completes. Success changes the icon to a checkmark for two seconds. Failure leaves the copy icon available for retry and displays an error tooltip. `onCopy` runs only after success; `onCopyError` receives clipboard errors. Localize `ariaLabel`, `copiedMessage`, and `errorMessage` as needed. Avoid putting sensitive or lengthy clipboard contents in the accessible name.

Other `IconButton` props are forwarded to the button, including `disabled`, `size`, `variant`, `className`, and button attributes. The default variant is `invisible`. The ref points to the button. `description` overrides the initial tooltip text, while `keybindingHint` and `keyshortcuts` retain tooltip hints and keyboard shortcut semantics. `tooltipProps` configures tooltip presentation; the component owns its feedback text and accessibility behavior.

If writes overlap, only the most recently started write updates feedback or calls `onCopy`/`onCopyError`. Pending writes do not announce or call callbacks after the button unmounts.

## Custom controls

`useCopyToClipboard(options?)` returns `{copy, copied, isCopying, error}`. Call `copy(text)` directly from a user interaction; it returns a promise that rejects on failure while updating `error`. Catch that rejection and provide visible and screen-reader feedback. The hook does not announce automatically. The most recently started request owns the state if requests overlap. `resetDelayMs` controls the success feedback duration (default: 2000 milliseconds).

```tsx
import {Button} from '@primer/react'
import {useCopyToClipboard} from '@primer/react/experimental'

function CopyGreeting() {
  const {copy, copied, error} = useCopyToClipboard()
  const handleCopy = async () => {
    try {
      await copy('Hello, world!')
    } catch {
      // The hook's error is rendered in the status below.
    }
  }
  return (
    <>
      <Button onClick={handleCopy}>Copy greeting</Button>
      <span role="status">{copied ? 'Greeting copied' : error ? 'Greeting could not be copied' : ''}</span>
    </>
  )
}
```

For non-React callers, `copyText(text): Promise<void>` uses the same clipboard behavior without state or announcements. Handle rejection and provide feedback in the calling UI.

Clipboard writes require user activation and may require a secure context or browser permission. If the Clipboard API is unavailable, the helper uses the browser's legacy selection-based copy command, restoring the previous selection and removing its temporary element. A denied Clipboard API write is propagated rather than retried through the legacy path.
