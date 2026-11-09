import React from 'react'
import {createRoot} from 'react-dom/client'
import {SearchIcon, XCircleFillIcon} from '@primer/octicons-react'
import {TextInput} from '../src/components/TextInput'

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Expected the text input fixture root')

  createRoot(root).render(
    <main>
      <div data-case="plain-small">
        <TextInput aria-label="Plain small" block size="small" />
      </div>
      <div data-case="leading-medium">
        <TextInput aria-label="Leading medium" block leadingVisual={SearchIcon} />
      </div>
      <div data-case="visuals-large">
        <TextInput
          aria-label="Visuals large"
          block
          leadingVisual={SearchIcon}
          size="large"
          trailingVisual={SearchIcon}
        />
      </div>
      <div data-case="action-medium">
        <TextInput
          aria-label="Action medium"
          block
          leadingVisual={SearchIcon}
          trailingAction={<TextInput.Action aria-label="Clear" icon={XCircleFillIcon} />}
        />
      </div>
      <div data-case="intrinsic-large">
        <TextInput aria-label="Intrinsic large" size="large" />
      </div>
    </main>,
  )
}

mountFixture()
