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

  test('does not fail on computed object pattern keys', () => {
    expect(
      checkFile(
        'Label.tsx',
        `
          type LabelProps = {
            'data-component'?: string
          }

          function Label({['data-component']: dataComponent = 'Label'}: LabelProps) {
            return <span data-component={dataComponent} />
          }
        `,
      ),
    ).toEqual({ok: true})
  })

  test('does not fail on computed object expression keys', () => {
    expect(
      checkFile(
        'Tooltip.tsx',
        `
          import {clsx} from 'clsx'

          const styles = {
            Tooltip: 'Tooltip',
            TooltipLeft: 'TooltipLeft',
          }

          function Tooltip({align}: {align?: 'left' | 'right'}) {
            const className = clsx(styles.Tooltip, {
              [styles[\`Tooltip\${align === 'left' ? 'Left' : 'Right'}\`]]: align,
              [\`tooltipped-\${align}\`]: align,
            })

            return <span className={className} />
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
