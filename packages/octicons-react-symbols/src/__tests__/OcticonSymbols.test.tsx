import {describe, expect, test} from 'vitest'
import {render, screen} from '@testing-library/react'
import {useContext, useEffect} from 'react'
import {OcticonSymbols, OcticonSymbolsContext} from '../OcticonSymbols'

describe('OcticonSymbols', () => {
  test('renders svg symbol children', async () => {
    render(
      <OcticonSymbols>
        <svg aria-hidden="true">
          <symbol data-testid="symbol-child" id="symbol-octicon-test-16" viewBox="0 0 16 16">
            <path />
          </symbol>
        </svg>
      </OcticonSymbols>,
    )

    expect(await screen.findByTestId('symbol-child')).toBeDefined()
  })

  test('renders registered symbols in the hidden sprite container', async () => {
    render(
      <OcticonSymbols>
        <SymbolRegistration />
      </OcticonSymbols>,
    )

    expect(await screen.findByTestId('registered-symbol')).toBeDefined()
  })
})

function SymbolRegistration() {
  const context = useContext(OcticonSymbolsContext)

  useEffect(() => {
    if (context === null) {
      throw new Error('Expected OcticonSymbolsContext to be available')
    }

    context.registerSymbol(
      'symbol-octicon-test-16',
      <symbol data-testid="registered-symbol" id="symbol-octicon-test-16" viewBox="0 0 16 16">
        <path />
      </symbol>,
    )
  }, [context])

  return null
}
