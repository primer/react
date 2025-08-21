/**
 * This test verifies that the TypeScript declaration files are correctly generated
 * and placed in the expected location for the @primer/styled-react package.
 */

import {expect, test} from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const distDir = path.join(__dirname, '../../dist')

test('TypeScript declaration files are generated in correct locations', () => {
  // Check that the main declaration files exist at the correct paths
  const indexDts = path.join(distDir, 'index.d.ts')
  const experimentalDts = path.join(distDir, 'experimental.d.ts')
  const deprecatedDts = path.join(distDir, 'deprecated.d.ts')

  expect(fs.existsSync(indexDts)).toBe(true)
  expect(fs.existsSync(experimentalDts)).toBe(true)
  expect(fs.existsSync(deprecatedDts)).toBe(true)
})

test('Declaration files contain expected exports', () => {
  const indexDts = path.join(distDir, 'index.d.ts')
  const indexContent = fs.readFileSync(indexDts, 'utf-8')
  
  // Verify that key components are exported
  expect(indexContent).toContain('Text')
  expect(indexContent).toContain('Link')
  expect(indexContent).toContain('Button')
  expect(indexContent).toContain('Box')
  expect(indexContent).toContain('SxProp')
})

test('Package exports align with generated declaration files', () => {
  const packageJsonPath = path.join(__dirname, '../../package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  
  // Verify that package.json exports point to existing declaration files
  const mainExports = packageJson.exports['.']
  expect(mainExports.types).toBe('./dist/index.d.ts')
  expect(fs.existsSync(path.join(__dirname, '../../', mainExports.types))).toBe(true)
  
  const experimentalExports = packageJson.exports['./experimental']
  expect(experimentalExports.types).toBe('./dist/experimental.d.ts')
  expect(fs.existsSync(path.join(__dirname, '../../', experimentalExports.types))).toBe(true)
  
  const deprecatedExports = packageJson.exports['./deprecated']
  expect(deprecatedExports.types).toBe('./dist/deprecated.d.ts')
  expect(fs.existsSync(path.join(__dirname, '../../', deprecatedExports.types))).toBe(true)
})