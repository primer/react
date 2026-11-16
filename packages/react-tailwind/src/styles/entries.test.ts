import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import {describe, expect, it} from 'vitest'

const require = createRequire(import.meta.url)
const read = (file: string) => readFileSync(path.join(import.meta.dirname, file), 'utf8')
const statements = (css: string) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

describe('stylesheet entries', () => {
  it.each(['styles.css', 'tailwind.css'])('%s generates package utilities with the primer prefix', file => {
    expect(statements(read(file))).toContain("@import 'tailwindcss/theme.css' layer(theme) prefix(primer);")
  })

  it('compiles the standalone entry from package files only', () => {
    const css = statements(read('tailwind.css'))
    expect(css).toContain("@import 'tailwindcss/utilities.css' layer(utilities) source(none);")
    expect(css).toContain("@source './';")
    expect(css.filter(line => line.startsWith('@import'))).not.toContain("@import 'tailwindcss';")
  })

  it('builds caller-owned story classes without the package prefix', () => {
    const css = statements(read('storybook.css'))
    expect(css).toContain("@import '../../dist/styles.css';")
    expect(css).toContain("@import 'tailwindcss/theme.css' layer(theme);")
    expect(css).toContain("@import 'tailwindcss/utilities.css' layer(utilities) source(none);")
    expect(css).not.toContain("@import './styles.css';")
  })

  it.each(['styles.css', 'tailwind.css'])(
    '%s references the config border module so its unprefixed static rules are not emitted',
    file => {
      const css = statements(read(file))
      const configIndex = readFileSync(require.resolve('@primer/tailwind-config'), 'utf8')
      const modules = [...configIndex.matchAll(/@import '\.\/([\w-]+)\.css';/g)].map(([, name]) => name)

      expect(modules).toContain('border')
      expect(css).not.toContain("@import '@primer/tailwind-config';")
      expect(css).not.toContain("@import '@primer/tailwind-config/border';")
      expect(css).toContain("@reference '@primer/tailwind-config/border';")
      for (const name of modules.filter(name => name !== 'border')) {
        expect(css).toContain(`@import '@primer/tailwind-config/${name}';`)
      }
    },
  )

  it('keeps package stylesheets free of utility class selectors', () => {
    for (const file of ['base.css', 'components.css', 'theme.css']) {
      expect(read(file)).not.toMatch(/(?:^|[\s,{}>+~])\.[a-z][\w-]*(?:\\:|[\s,{.[:>+~])/m)
    }
  })
})
