import {describe, expect, test} from 'vitest'
import {render, screen} from '@testing-library/react'
import {createOcticonSymbol} from '../OcticonSymbol'
import {OcticonSymbols} from '../OcticonSymbols'

const TestSymbol = createOcticonSymbol({
  id: 'symbol-octicon-test',
  definition: (
    <symbol data-testid="test-symbol" id="symbol-octicon-test-16" viewBox="0 0 16 16">
      <path />
    </symbol>
  ),
})

describe('OcticonSymbols', () => {
  test('renders symbols in the hidden sprite container', () => {
    render(
      <OcticonSymbols symbols={[TestSymbol]}>
        <div data-testid="child" />
      </OcticonSymbols>,
    )

    expect(screen.getByTestId('test-symbol')).toBeDefined()
    expect(screen.getByTestId('child')).toBeDefined()
  })

  test('does not render duplicate symbols', () => {
    const {container} = render(
      <OcticonSymbols symbols={[TestSymbol, TestSymbol]}>
        <OcticonSymbols
          symbols={[
            createOcticonSymbol({
              id: TestSymbol.id,
              definition: <symbol data-testid="nested-duplicate-symbol" id="symbol-octicon-test-16" />,
            }),
          ]}
        />
      </OcticonSymbols>,
    )

    expect(screen.getAllByTestId('test-symbol')).toHaveLength(1)
    expect(screen.queryByTestId('nested-duplicate-symbol')).toBeNull()
    expect(container.querySelectorAll('svg')).toHaveLength(1)
  })

  test('renders symbols that are not registered by an ancestor', () => {
    const NestedSymbol = createOcticonSymbol({
      id: 'symbol-octicon-nested',
      definition: <symbol data-testid="nested-symbol" id="symbol-octicon-nested-16" />,
    })

    render(
      <OcticonSymbols symbols={[TestSymbol]}>
        <OcticonSymbols symbols={[TestSymbol, NestedSymbol]} />
      </OcticonSymbols>,
    )

    expect(screen.getAllByTestId('test-symbol')).toHaveLength(1)
    expect(screen.getByTestId('nested-symbol')).toBeDefined()
  })
})
