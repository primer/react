import React from 'react'
import {createRoot} from 'react-dom/client'
import {Banner} from '../src/components/Banner'

export function Fixture() {
  const [detail, setDetail] = React.useState('Invalid value for state')
  return (
    <>
      <p id="validation-message">FormControl error</p>
      <label htmlFor="root-input">Root reference</label>
      <input id="root-input" aria-describedby="validation-message root-errors" aria-invalid="true" />
      <Banner id="root-errors" variant="warning">
        <Banner.Title>Filter contains 1 issue:</Banner.Title>
        <ul>
          <li>{detail}</li>
        </ul>
      </Banner>

      <label htmlFor="separate-input">Separate references</label>
      <input
        id="separate-input"
        aria-describedby="validation-message separate-title separate-details"
        aria-invalid="true"
      />
      <Banner variant="warning">
        <Banner.Title id="separate-title">Filter contains 1 issue:</Banner.Title>
        <Banner.Description id="separate-details">
          <ul>
            <li>{detail}</li>
          </ul>
        </Banner.Description>
      </Banner>

      <label htmlFor="grouped-input">Grouped reference</label>
      <input id="grouped-input" aria-describedby="validation-message grouped-errors" aria-invalid="true" />
      <Banner aria-labelledby="grouped-title" variant="warning">
        <div id="grouped-errors">
          <Banner.Title id="grouped-title">Filter contains 1 issue:</Banner.Title>
          <ul>
            <li>{detail}</li>
          </ul>
        </div>
      </Banner>

      <button type="button" onClick={() => setDetail('State must be open or closed')}>
        Update detail
      </button>
    </>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Banner description fixture root not found')
  createRoot(root).render(<Fixture />)
}

mountFixture()
