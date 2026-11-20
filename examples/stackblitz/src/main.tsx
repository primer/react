import {BaseStyles, ThemeProvider} from '@primer/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

function main() {
  const root = document.getElementById('root')

  if (!root) {
    throw new Error('Missing application root')
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider>
        <BaseStyles>
          <App />
        </BaseStyles>
      </ThemeProvider>
    </React.StrictMode>,
  )
}

main()
