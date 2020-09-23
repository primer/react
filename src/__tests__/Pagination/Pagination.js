import React from 'react'
import Pagination from '../../Pagination'
import {behavesAsComponent} from '../../utils/testing'
import {COMMON} from '../../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const reqProps = {pageCount: 10, currentPage: 1}
const comp = <Pagination {...reqProps} />

describe('Pagination', () => {
  behavesAsComponent(Pagination, [COMMON], () => comp)

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(comp)
    const results = await axe(container, {
      rules: {
        // The skip-link rule has to do with entire documents
        // and is not relevant to this component.
        // See https://dequeuniversity.com/rules/axe/3.3/skip-link?application=axeAPI
        'skip-link': {
          enabled: false
        }
      }
    })
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
