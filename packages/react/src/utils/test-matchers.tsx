import '@testing-library/jest-dom'
import 'jest-styled-components'
import {styleSheetSerializer} from 'jest-styled-components/serializer'
import failOnConsole from 'jest-fail-on-console'
import React from 'react'
import {getClasses, getComputedStyles, render} from './testing'
import type axe from 'axe-core'

expect.addSnapshotSerializer(styleSheetSerializer)

const stringify = (d: Record<string, unknown>) => JSON.stringify(d, null, '  ')

expect.extend({
  toMatchKeys(obj, values) {
    return {
      pass: Object.keys(values).every(key => this.equals(obj[key], values[key])),
      message: () => `Expected ${stringify(obj)} to have matching keys: ${stringify(values)}`,
    }
  },

  toHaveClasses(node, klasses, only = false) {
    const classes = getClasses(node)
    const pass = only
      ? this.equals(classes.sort(), klasses.sort())
      : klasses.every((klass: Array<string>) => classes.includes(klass))
    return {
      pass,
      message: () => `expected ${stringify(classes)} to include: ${stringify(klasses)}`,
    }
  },

  toImplementSxBehavior(element) {
    const mediaKey = "@media (max-width:123px)";
    const expectedColor = "rgb(255, 0, 0)";
    const sxPropValue = { [mediaKey]: { color: "red" } };
    const elem = React.cloneElement(element, { sx: sxPropValue });
    const { container } = render(elem);

    const originalMatchMedia = window.matchMedia
    const matchMediaMock = jest.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === mediaKey,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    function checkStylesDeep(node: Element): boolean {
      if (!(node instanceof HTMLElement)) return false
      if ( expectedColor === window.getComputedStyle(node).color) return true
	  return [...node.children].some((child) => checkStylesDeep(child as HTMLElement));
    }

    const rootElement = container.firstChild as HTMLElement
    matchMediaMock.mockRestore();
    return {
      pass: rootElement ? checkStylesDeep(rootElement) : false,
      message: () => 'sx prop values did not change styles of component nor of any sub-components',
    }
  },

  toSetExports(mod, expectedExports) {
    if (!Object.keys(expectedExports).includes('default')) {
      return {
        pass: false,
        message: () => "You must specify the module's default export",
      }
    }

    const seen = new Set()
    for (const exp of Object.keys(expectedExports)) {
      seen.add(exp)
      if (mod[exp] !== expectedExports[exp]) {
        if (!mod[exp] && !expectedExports[exp]) {
          continue
        }

        return {
          pass: false,
          message: () => `Module exported a different value from key '${exp}' than expected`,
        }
      }
    }

    for (const exp of Object.keys(mod)) {
      if (seen.has(exp)) {
        continue
      }

      if (mod[exp] !== expectedExports[exp]) {
        return {
          pass: false,
          message: () => `Module exported an unexpected value from key '${exp}'`,
        }
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },

  toHaveNoViolations(results: axe.AxeResults) {
    return {
      pass: results.violations.length === 0,
      message: () => {
        return results.violations
          .map(err => {
            return `Expected the HTML found in the document to have no violations, but received:
            \n${err.help}
            \n${err.nodes
              .map(
                (node, index) => `${index + 1}. ${node.html}
              \n${node.failureSummary}\n`,
              )
              .join('\n')}\nMore information can be found at: ${err.helpUrl}\n${'─'.repeat(20)}
          `
          })
          .join('\n')
      },
    }
  },
})

const failOnAllConsoleMessages = process.env.CI === 'true'

failOnConsole({
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  shouldFailOnDebug: failOnAllConsoleMessages,
  shouldFailOnInfo: failOnAllConsoleMessages,
  shouldFailOnLog: failOnAllConsoleMessages,
})
