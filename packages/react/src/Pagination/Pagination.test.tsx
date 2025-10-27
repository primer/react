/* eslint-disable primer-react/spread-props-first */
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Pagination from '../Pagination'
import {ReactRouterLikeLink} from './mocks/ReactRouterLink'

describe('Pagination', () => {
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
