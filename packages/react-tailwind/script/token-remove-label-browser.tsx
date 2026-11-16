import React from 'react'
import {createRoot} from 'react-dom/client'
import {IssueLabelToken, Token} from '../src/components/Token'
import {VisuallyHidden} from '../src/components/VisuallyHidden'

export function Example() {
  const [tokenRemovals, setTokenRemovals] = React.useState(0)
  const [labelRemovals, setLabelRemovals] = React.useState(0)
  const [interactiveRemovals, setInteractiveRemovals] = React.useState(0)

  return (
    <>
      <button type="button">Before</button>
      <Token
        onRemove={() => setTokenRemovals(count => count + 1)}
        removeButtonLabel="Remove linked pull request #42"
        size="large"
        text={
          <>
            <VisuallyHidden>Open pull request </VisuallyHidden>#42
          </>
        }
      />
      <IssueLabelToken
        onRemove={() => setLabelRemovals(count => count + 1)}
        removeButtonLabel="Remove linked pull request #43"
        size="large"
        text={
          <>
            <VisuallyHidden>Merged pull request </VisuallyHidden>#43
          </>
        }
      />
      <Token
        as="a"
        data-testid="interactive-token"
        href="#pull-44"
        onRemove={() => setInteractiveRemovals(count => count + 1)}
        removeButtonLabel="Not a separate button"
        size="large"
        text={
          <>
            <VisuallyHidden>Open pull request </VisuallyHidden>#44
          </>
        }
      />
      <button type="button">After</button>
      <span data-testid="token-removals" hidden>
        {tokenRemovals}
      </span>
      <span data-testid="label-removals" hidden>
        {labelRemovals}
      </span>
      <span data-testid="interactive-removals" hidden>
        {interactiveRemovals}
      </span>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Token fixture root not found')
  createRoot(root).render(<Example />)
}

mountExample()
