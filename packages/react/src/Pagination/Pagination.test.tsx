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
})
