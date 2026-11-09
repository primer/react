import React from 'react'
import {createRoot} from 'react-dom/client'
import {ActionBar} from '../src/components/ActionBar/ActionBar'

export function Example() {
  return (
    <>
      <div style={{width: 64}}>
        <ActionBar aria-label="Default actions">
          <ActionBar.Button>Assign</ActionBar.Button>
          <ActionBar.Button>Labels</ActionBar.Button>
        </ActionBar>
      </div>
      <div style={{width: 64}}>
        <ActionBar aria-label="Flush actions" flush>
          <ActionBar.Button>Assign</ActionBar.Button>
        </ActionBar>
      </div>
      <div style={{width: 64}}>
        <ActionBar aria-label="Customized actions" className="px-2">
          <ActionBar.Button>Assign</ActionBar.Button>
        </ActionBar>
      </div>
      <div style={{width: 64}}>
        <ActionBar aria-label="Explicit host utility" className="px-4">
          <ActionBar.Button>Assign</ActionBar.Button>
        </ActionBar>
      </div>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('ActionBar fixture root not found')
  createRoot(root).render(<Example />)
}

mountExample()
