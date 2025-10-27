import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import React from 'react'
import Box from '../components/Box'
import {theme} from '@primer/react'

const breakpoints = [
  null,
  'screen and (min-width: 544px)',
  'screen and (min-width: 768px)',
  'screen and (min-width: 1012px)',
] as const

describe('Box', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Box className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('should support margin', () => {
    render(<Box data-testid="box" m={1} theme={theme} />)
    const box = screen.getByTestId('box')
    expect(getCSSRuleForClass(getClassName(box.className)).style.margin).toBe(theme.space[1])
  })

  it('should support responsive margin', () => {
    const m = [0, 1, 2, 3]

    render(<Box data-testid="box" m={[0, 1, 2, 3]} theme={theme} />)

    const box = screen.getByTestId('box')
    const className = getClassName(box.className)

    for (let i = 0; i < m.length; i++) {
      let themeValue = theme.space[m[i]]
      if (themeValue === '0') {
        themeValue = '0px'
      }

      if (i === 0) {
        const cssRule = getCSSRuleForClass(className)
        expect(cssRule.style.margin).toBe(themeValue)
      } else {
        const cssRule = getCSSRuleForClass(className, breakpoints[i]!)
        expect(cssRule.style.margin).toBe(themeValue)
      }
    }
  })

  it('should support padding', () => {
    render(<Box data-testid="box" p={1} theme={theme} />)
    const box = screen.getByTestId('box')
    expect(getCSSRuleForClass(getClassName(box.className)).style.padding).toBe(theme.space[1])
  })

  it('should support responsive padding', () => {
    const p = [0, 1, 2, 3]

    render(<Box data-testid="box" p={[0, 1, 2, 3]} theme={theme} />)

    const box = screen.getByTestId('box')
    const className = getClassName(box.className)

    for (let i = 0; i < p.length; i++) {
      let themeValue = theme.space[p[i]]
      if (themeValue === '0') {
        themeValue = '0px'
      }

      if (i === 0) {
        const cssRule = getCSSRuleForClass(className)
        expect(cssRule.style.padding).toBe(themeValue)
      } else {
        const cssRule = getCSSRuleForClass(className, breakpoints[i]!)
        expect(cssRule.style.padding).toBe(themeValue)
      }
    }
  })

  it('should support display', () => {
    render(<Box data-testid="box" display="inline" theme={theme} />)
    const box = screen.getByTestId('box')
    expect(getCSSRuleForClass(getClassName(box.className)).style.display).toBe('inline')
  })

  it('should support responsive display', () => {
    const display = ['none', 'inline', 'inline-block', 'block']
    render(<Box data-testid="box" display={display} theme={theme} />)
    const box = screen.getByTestId('box')
    const className = getClassName(box.className)
    for (let i = 0; i < display.length; i++) {
      if (i === 0) {
        const cssRule = getCSSRuleForClass(className)
        expect(cssRule.style.display).toBe(display[i])
      } else {
        const cssRule = getCSSRuleForClass(className, breakpoints[i]!)
        expect(cssRule.style.display).toBe(display[i])
      }
    }
  })
})

function getClassName(className: string): string {
  // styled-components with `Box` seems to generate two classes: `sx-<hash>` and
  // `<hash>`. We are looking for the second class which seems to be the one the
  // styles are applied to in CSS.
  const classes = className.split(' ')
  return classes[1]
}

function getCSSRuleForClass(className: string, mediaText?: string): CSSStyleRule {
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (mediaText) {
        if (rule instanceof CSSMediaRule && rule.media.mediaText === mediaText) {
          for (const innerRule of rule.cssRules) {
            if (innerRule instanceof CSSStyleRule && innerRule.selectorText === `.${className}`) {
              return innerRule
            }
          }
        }
      } else if (rule instanceof CSSStyleRule) {
        if (rule.selectorText === `.${className}`) {
          return rule
        }
      }
    }
  }

  throw new Error(`CSS rule for class "${className}" not found`)
}
