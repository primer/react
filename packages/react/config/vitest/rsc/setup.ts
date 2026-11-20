import {beforeAll, beforeEach} from 'vitest'
import {cleanup, initialize} from 'vitest-plugin-rsc/testing-library'

beforeAll(() => {
  initialize()
})

beforeEach(async () => {
  await cleanup()
})
