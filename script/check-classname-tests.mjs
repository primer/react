#!/usr/bin/env node

import {readFileSync, readdirSync, statSync} from 'fs'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Files to ignore from className testing requirement
const IGNORED_FILES = [
  // Add file paths relative to project root here, e.g.:
  // 'packages/react/src/SomeComponent/SomeComponent.test.tsx',
  'packages/react/src/Portal/Portal.test.tsx',
  'packages/react/src/Autocomplete/AutocompleteOverlay.tsx',
  'packages/react/src/ActionMenu/ActionMenu.test.tsx',
  'packages/react/src/Pagination/PaginationModel.test.tsx',
]

function getAllTestFiles(dir, files = []) {
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      // Skip utils and __tests__ directories
      if (item !== 'utils' && item !== '__tests__') {
        getAllTestFiles(fullPath, files)
      }
    } else if (stat.isFile() && item.endsWith('.test.tsx') && !item.endsWith('.types.test.tsx')) {
      files.push(fullPath)
    }
  }

  return files
}

function main() {
  console.log('Checking for implementsClassName in component test files...')

  const projectRoot = join(__dirname, '..')
  const srcDir = join(projectRoot, 'packages/react/src')
  const testFiles = getAllTestFiles(srcDir)
  const missingTests = []

  for (const testFile of testFiles) {
    try {
      // Make path relative to project root for comparison with IGNORED_FILES
      const relativePath = testFile.replace(projectRoot + '/', '')

      // Skip files in the ignored list
      if (IGNORED_FILES.includes(relativePath)) {
        continue
      }

      const content = readFileSync(testFile, 'utf-8')

      // Check if file imports a component (has relative import) and doesn't have implementsClassName
      const hasRelativeImport =
        content.includes("from '../") || content.includes('from "./') || content.includes("from '.")
      const hasImplementsClassName = content.includes('implementsClassName')

      if (hasRelativeImport && !hasImplementsClassName) {
        missingTests.push(relativePath)
      }
    } catch (error) {
      console.error(`Error reading file ${testFile}:`, error.message)
    }
  }

  if (missingTests.length > 0) {
    console.log('❌ The following component test files are missing implementsClassName:')
    missingTests.forEach(file => console.log(file))
    console.log('')
    console.log('Please add implementsClassName test to ensure className prop works correctly.')
    process.exit(1)
  }

  console.log('✅ All component test files include implementsClassName')
}

main()
