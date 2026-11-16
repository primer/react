// @vitest-environment node
import {readFileSync} from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import {expect, it} from 'vitest'

it('does not import development-only stories in documentation', () => {
  const developmentStoryImport = /^\s*import\b[^'";]*\bfrom\s*['"][^'"]+\.dev\.stories(?:\.[jt]sx?)?['"]/m
  const documentationFiles = glob.sync('**/*.mdx', {cwd: import.meta.dirname})
  const invalidImports = documentationFiles.filter(file =>
    developmentStoryImport.test(readFileSync(path.join(import.meta.dirname, file), 'utf8')),
  )

  expect(documentationFiles.length).toBeGreaterThan(0)
  expect(invalidImports).toEqual([])
})
