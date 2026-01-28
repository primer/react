import {describe, expect, test} from 'vitest'
import postcss from 'postcss'
import preset from '../'

async function process(input: string): Promise<string> {
  try {
    const result = await postcss([preset()]).process(input, {
      from: undefined,
    })
    return result.css.toString()
  } catch (error) {
    // Note: it seems like Jest cannot serialize errors thrown by postcss. As a
    // result, we remove problematic fields before throwing the error
    if (error instanceof postcss.CssSyntaxError) {
      // @ts-expect-error it seems the type for this is incorrect and this field
      // does exist and is causing the circular reference issue
      if (error.postcssNode) {
        // @ts-expect-error it seems the type for this is incorrect and this field
        // does exist and is causing the circular reference issue
        delete error.postcssNode
      }
    }
    throw error
  }
}

describe('postcss-preset-primer', () => {
  test('css nesting', async () => {
    const result = await process(`
      .selector {
        &[data-active] {
          color: var(--fgColor-active);
        }
      }
    `)
    expect(result).toMatchSnapshot()
  })

  describe('mixins', () => {
    test('@mixin activeIndicatorLine', async () => {
      const result = await process(`
        .selector {
          @mixin activeIndicatorLine;
        }
      `)
      expect(result).toMatchSnapshot()
    })

    test('@mixin focusOutline', async () => {
      const result = await process(`
        .selector {
          @mixin focusOutline;
        }
      `)
      expect(result).toMatchSnapshot()
    })

    test('@mixin focusOutlineOnEmphasis', async () => {
      const result = await process(`
        .selector {
          @mixin focusOutlineOnEmphasis;
        }
      `)
      expect(result).toMatchSnapshot()
    })

    test('@mixin buttonReset', async () => {
      const result = await process(`
        .selector {
          @mixin buttonReset;
        }
      `)
      expect(result).toMatchSnapshot()
    })
  })
})
