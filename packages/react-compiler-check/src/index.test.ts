import {describe, expect, test} from 'vitest'
import {check} from './'

describe('check', () => {
  test('returns ok for files that compile successfully', async () => {
    await expect(
      check(
        'Counter.tsx',
        `
          function Counter({value}: {value: number}) {
            const doubled = value * 2

            return <span>{doubled}</span>
          }
        `,
      ),
    ).resolves.toEqual({ok: true})
  })

  test('does not fail on recoverable compiler diagnostics for successfully compiled files', async () => {
    await expect(
      check(
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
    ).resolves.toEqual({ok: true})
  })

  test('returns compiler errors with source locations', async () => {
    const result = await check(
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

  test('returns compile skips as errors', async () => {
    const result = await check(
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

  test('rethrows errors that do not come from the React Compiler', async () => {
    await expect(
      check(
        'SyntaxError.tsx',
        `
          function SyntaxError() {
            return <span>
          }
        `,
      ),
    ).rejects.toThrow()
  })
})
