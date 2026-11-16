import {describe, expect, test} from 'vitest'
import {checkFile} from './'

describe('checkFile', () => {
  test('returns ok for files that compile successfully', () => {
    expect(
      checkFile(
        'Counter.tsx',
        `
          function Counter({value}: {value: number}) {
            const doubled = value * 2

            return <span>{doubled}</span>
          }
        `,
      ),
    ).toEqual({ok: true})
  })

  test('does not fail on recoverable compiler diagnostics for successfully compiled files', () => {
    expect(
      checkFile(
        'BaseStyles.tsx',
        `
          import type React from 'react'

          type BaseStylesProps = {
            children?: React.ReactNode
            as?: keyof React.JSX.IntrinsicElements
            className?: string
            color?: string
            style?: React.CSSProperties
          }

          function BaseStyles({children, color, className, as: Component = 'div', style, ...rest}: BaseStylesProps) {
            const baseStyles = {
              ['--BaseStyles-fgColor']: color,
            }

            return (
              <Component
                className={className}
                style={{
                  ...baseStyles,
                  ...style,
                }}
                {...rest}
              >
                {children}
              </Component>
            )
          }
        `,
      ),
    ).toEqual({ok: true})
  })

  test('returns compiler errors with source locations', () => {
    const result = checkFile(
      'ConditionalHook.tsx',
      `
        import {useState} from 'react'

        function ConditionalHook({enabled}: {enabled: boolean}) {
          if (enabled) {
            useState(0)
          }

          return null
        }
      `,
    )

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toMatchObject({
        location: {
          start: {
            line: 6,
            column: 12,
          },
        },
        reason: expect.stringContaining('Hooks must always be called in a consistent order'),
      })
    }
  })

  test('returns compile skips as errors', () => {
    const result = checkFile(
      'NoMemo.tsx',
      `
        function NoMemo() {
          'use no memo'

          return <span />
        }
      `,
    )

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toMatchObject({
        location: expect.any(Object),
        reason: expect.stringContaining('Skipped due to'),
      })
    }
  })

  test('returns compiler descriptions and suggestions', () => {
    const result = checkFile(
      'SuppressedRule.tsx',
      `
        function SuppressedRule() {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          return <span />
        }
      `,
    )

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toMatchObject({
        description: 'Found React rule suppression',
        reason: 'React rule suppression prevents optimization',
        suggestions: [
          {
            description: 'Remove the suppression and address the reported React rule violation',
          },
        ],
      })
    }
  })

  test('reports UTF-16 columns for native diagnostics after non-ASCII text', () => {
    const contents = `import {useState} from 'react'
function ConditionalHook({enabled}: {enabled: boolean}) {
  if (enabled) { const label = 'caf\u00e9 \u{1f680}'; useState(0) }
  return null
}`
    const result = checkFile('ConditionalHook.tsx', contents)

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.errors[0].location?.start).toEqual({
        line: 3,
        column: contents.split('\n')[2].indexOf('useState'),
      })
    }
  })

  test('reports opt-out locations after non-ASCII text', () => {
    const result = checkFile(
      'NoMemo.tsx',
      `// caf\u00e9 \u{1f680}
function NoMemo() {
  'use no memo'
  return <span />
}`,
    )

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.errors[0].location?.start).toEqual({line: 3, column: 2})
    }
  })

  test('rethrows errors that do not come from the React Compiler', () => {
    expect(() =>
      checkFile(
        'SyntaxError.tsx',
        `
          function SyntaxError() {
            return <span>
          }
        `,
      ),
    ).toThrow()
  })
})
