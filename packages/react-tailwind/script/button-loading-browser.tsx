import React from 'react'
import {createRoot} from 'react-dom/client'
import {Button} from '../src/components/Button/Button'
import {LinkButton} from '../src/components/LinkButton/LinkButton'

export function Example() {
  const [buttonLoading, setButtonLoading] = React.useState(false)
  const [linkLoading, setLinkLoading] = React.useState(false)
  const [buttonActions, setButtonActions] = React.useState(0)
  const [linkActions, setLinkActions] = React.useState(0)
  const [externalButtonLoading, setExternalButtonLoading] = React.useState(false)
  const [externalLinkLoading, setExternalLinkLoading] = React.useState(false)
  const [hostMessages, setHostMessages] = React.useState<string[]>([])

  return (
    <>
      <Button
        aria-describedby="action-hint"
        data-testid="action"
        loading={buttonLoading}
        onClick={() => {
          setButtonLoading(true)
          setButtonActions(count => count + 1)
        }}
      >
        Publish
      </Button>
      <LinkButton
        aria-describedby="link-hint"
        data-testid="link"
        href="#documentation"
        loading={linkLoading}
        onClick={event => {
          event.preventDefault()
          setLinkLoading(true)
          setLinkActions(count => count + 1)
        }}
      >
        Documentation
      </LinkButton>
      <span id="action-hint">Saves the draft</span>
      <span id="link-hint">Opens the guide</span>
      <Button
        aria-describedby="external-button-hint"
        data-testid="external-action"
        loading={externalButtonLoading}
        loadingAnnouncement=""
        onClick={() => {
          setExternalButtonLoading(true)
          setHostMessages(messages => [...messages, 'Saving settings'])
        }}
      >
        Save settings
      </Button>
      <LinkButton
        aria-describedby="external-link-hint"
        data-testid="external-link"
        href="#external-guide"
        loading={externalLinkLoading}
        loadingAnnouncement=""
        onClick={event => {
          event.preventDefault()
          setExternalLinkLoading(true)
          setHostMessages(messages => [...messages, 'Opening guide'])
        }}
      >
        Open guide
      </LinkButton>
      <span id="external-button-hint">Saves the preferences</span>
      <span id="external-link-hint">Opens the documentation</span>
      <div data-testid="host-messages">{hostMessages.join(', ')}</div>
      <Button data-testid="short-idle">I</Button>
      <Button data-testid="short-loading" loading>
        I
      </Button>
      <Button data-testid="with-visual" loading leadingVisual={<span aria-hidden="true">+</span>}>
        With visual
      </Button>
      <LinkButton data-testid="with-count" href="#count" loading count={3}>
        With count
      </LinkButton>
      <Button data-testid="with-trailing-visual" loading trailingVisual={<span aria-hidden="true">+</span>}>
        With trailing visual
      </Button>
      <Button data-testid="with-trailing-action" loading trailingAction={<span aria-hidden="true">+</span>}>
        With trailing action
      </Button>
      <Button
        data-testid="complete"
        onClick={() => {
          setButtonLoading(false)
          setLinkLoading(false)
          setExternalButtonLoading(false)
          setExternalLinkLoading(false)
        }}
      >
        Complete requests
      </Button>
      <output data-testid="action-count">{buttonActions}</output>
      <output data-testid="link-count">{linkActions}</output>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Button fixture root not found')
  createRoot(root).render(<Example />)
}

mountExample()
