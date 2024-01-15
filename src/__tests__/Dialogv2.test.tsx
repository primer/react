import React from 'react'
import {BaseStyles, SSRProvider, ThemeProvider} from '../'
import theme from '../theme'
import {Dialog} from '../Dialog/Dialog'
import {behavesAsComponent} from '../utils/testing'
import {axe, toHaveNoViolations} from 'jest-axe'
import renderer from 'react-test-renderer'

expect.extend(toHaveNoViolations)

/* Dialog Version 2 */

// window.matchMedia() is not implemented by JSDOM so we have to create a mock:
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

function SimpleDialog(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          <Dialog title="My dialog" onClose={() => {}}>
            Hello world
          </Dialog>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('Dialog v2', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  behavesAsComponent({
    Component: Dialog,
    options: {skipAs: true, skipSx: true},
    toRender: () => (
      <SSRProvider>
        <Dialog onClose={() => {}} />
      </SSRProvider>
    ),
  })

  it('should match snapshot', () => {
    const tree = renderer.create(<SimpleDialog />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
