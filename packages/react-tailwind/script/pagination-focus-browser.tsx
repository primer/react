import React from 'react'
import {createRoot} from 'react-dom/client'
import {Pagination} from '../src/components/Pagination/Pagination'

export function Example() {
  const [currentPage, setCurrentPage] = React.useState(2)
  const [pending, setPending] = React.useState(false)
  const [requests, setRequests] = React.useState<number[]>([])

  return (
    <>
      <Pagination
        currentPage={currentPage}
        pageCount={5}
        onPageChange={(event, page) => {
          event.preventDefault()
          if (pending) return
          setCurrentPage(page)
          setPending(true)
          setRequests(previous => [...previous, page])
        }}
        renderPage={({number: _number, pageType: _pageType, onPageSelect: _onPageSelect, ...props}) =>
          props.href ? (
            <a {...props} aria-disabled={pending || undefined}>
              {props.children}
            </a>
          ) : (
            <span role="link" aria-label={props['aria-label']} aria-disabled="true">
              {props.children}
            </span>
          )
        }
      />
      <button type="button" onClick={() => setPending(false)}>
        Complete request
      </button>
      <output aria-label="Requested pages">{requests.join(',')}</output>
    </>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Pagination fixture root not found')
  createRoot(root).render(<Example />)
}

mountExample()
