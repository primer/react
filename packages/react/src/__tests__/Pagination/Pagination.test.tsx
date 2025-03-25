import React from 'react'
import Pagination from '../../Pagination'
import {behavesAsComponent} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {ReactRouterLikeLink} from '../mocks/ReactRouterLink'

const reqProps = {pageCount: 10, currentPage: 1}
const comp = <Pagination {...reqProps} />

describe('Pagination', () => {
  behavesAsComponent({Component: Pagination, toRender: () => comp})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(comp)
    const results = await axe.run(container, {
      rules: {
        // The skip-link rule has to do with entire documents
        // and is not relevant to this component.
        // See https://dequeuniversity.com/rules/axe/3.3/skip-link?application=axeAPI
        'skip-link': {
          enabled: false,
        },
      },
    })
    expect(results).toHaveNoViolations()
  })

  it('should render links instead of anchor tags with the renderPageLink prop', () => {
    const {container} = HTMLRender(
      <Pagination
        pageCount={10}
        currentPage={1}
        renderPageLink={({number, ...props}) => <ReactRouterLikeLink to={`#${number}`} {...props} />}
      />,
    )

    expect(container.querySelectorAll('a').length).toEqual(10)
  })
})
