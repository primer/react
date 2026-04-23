import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Pagination from '../Pagination'
import {ReactRouterLikeLink} from './mocks/ReactRouterLink'
import {implementsClassName} from '../utils/testing'
import classes from './Pagination.module.css'

describe('Pagination', () => {
  implementsClassName(props => <Pagination pageCount={5} currentPage={1} {...props} />, classes.PaginationContainer)

  it('should render links instead of anchor tags with the renderPage prop', () => {
    const {container} = HTMLRender(
      <Pagination
        pageCount={10}
        currentPage={1}
        renderPage={({key, number, ...props}) => <ReactRouterLikeLink key={key} to={`#${number}`} {...props} />}
      />,
    )

    expect(container.querySelectorAll('a').length).toEqual(10)
  })

  describe('data-component attributes', () => {
    it('renders Pagination with data-component attribute', () => {
      const {container} = HTMLRender(<Pagination pageCount={5} currentPage={1} />)

      const pagination = container.querySelector('[data-component="Pagination"]')
      expect(pagination).toBeInTheDocument()
    })

    it('renders Pagination.Page with data-component attribute', () => {
      const {container} = HTMLRender(<Pagination pageCount={5} currentPage={1} />)

      const pages = container.querySelectorAll('[data-component="Pagination.Page"]')
      expect(pages.length).toBeGreaterThan(0)
    })

    it('renders Pagination.Page with data-component attribute when using renderPage', () => {
      const {container} = HTMLRender(
        <Pagination
          pageCount={5}
          currentPage={1}
          renderPage={({key, number, ...props}) => <ReactRouterLikeLink key={key} to={`#${number}`} {...props} />}
        />,
      )

      const pages = container.querySelectorAll('[data-component="Pagination.Page"]')
      expect(pages.length).toBeGreaterThan(0)
    })

    it('renders Pagination.PreviousPage with data-component attribute', () => {
      const {container} = HTMLRender(<Pagination pageCount={5} currentPage={3} />)

      const previousPage = container.querySelector('[data-component="Pagination.PreviousPage"]')
      expect(previousPage).toBeInTheDocument()
    })

    it('renders Pagination.NextPage with data-component attribute', () => {
      const {container} = HTMLRender(<Pagination pageCount={5} currentPage={3} />)

      const nextPage = container.querySelector('[data-component="Pagination.NextPage"]')
      expect(nextPage).toBeInTheDocument()
    })

    it('renders Pagination.PreviousPageIcon with data-component attribute', () => {
      const {container} = HTMLRender(<Pagination pageCount={5} currentPage={3} />)

      const previousPageIcon = container.querySelector('[data-component="Pagination.PreviousPageIcon"]')
      expect(previousPageIcon).toBeInTheDocument()
    })

    it('renders Pagination.NextPageIcon with data-component attribute', () => {
      const {container} = HTMLRender(<Pagination pageCount={5} currentPage={3} />)

      const nextPageIcon = container.querySelector('[data-component="Pagination.NextPageIcon"]')
      expect(nextPageIcon).toBeInTheDocument()
    })
  })
})
