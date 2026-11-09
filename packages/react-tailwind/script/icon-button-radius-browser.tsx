import React from 'react'
import {createRoot} from 'react-dom/client'
import {PlusIcon} from '@primer/octicons-react'
import {IconButton} from '../src/components/IconButton'

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Expected the icon button fixture root')

  createRoot(root).render(
    <main>
      <IconButton aria-label="CSS module only" className="square-start" icon={PlusIcon} />
      <IconButton aria-label="Partial utility" className="rounded-s-none square-start" icon={PlusIcon} />
      <IconButton aria-label="Full replacement" className="rounded-none replacement-radius" icon={PlusIcon} />
    </main>,
  )
}

mountFixture()
