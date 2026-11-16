import {test, expect} from 'vitest'
// eslint-disable-next-line import/no-namespace
import * as StyledReact from '../'

test('@primer/styled-react exports', () => {
  expect(
    Object.keys(StyledReact).sort((a, b) => {
      return a.localeCompare(b)
    }),
  ).toMatchSnapshot()
})
