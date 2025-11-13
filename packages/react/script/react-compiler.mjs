import path from 'node:path'
import glob from 'fast-glob'
import {fileURLToPath} from 'node:url'

const PACKAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = glob
  .sync('src/**/*.{ts,tsx}', {
    cwd: PACKAGE_DIR,
    ignore: ['**/*.d.ts'],
  })
  .map(match => {
    return path.join(PACKAGE_DIR, match)
  })
const unsupported = new Set(
  [
    'src/ActionList/**/*.tsx',
    'src/ActionMenu/**/*.tsx',
    'src/AvatarStack/**/*.tsx',
    'src/Button/**/*.tsx',
    'src/ConfirmationDialog/**/*.tsx',
    'src/Pagehead/**/*.tsx',
    'src/Pagination/**/*.tsx',
    'src/SelectPanel/**/*.tsx',
    'src/SideNav.tsx',
    'src/internal/components/CheckboxOrRadioGroup/**/*.tsx',
    'src/TooltipV2/**/*.tsx',
  ].flatMap(pattern => {
    if (glob.isDynamicPattern(pattern)) {
      const matches = glob.sync(pattern, {cwd: PACKAGE_DIR})
      if (matches) {
        return matches.map(match => {
          return path.join(PACKAGE_DIR, match)
        })
      }
    }
    return path.join(PACKAGE_DIR, pattern)
  }),
)

function isSupported(filepath) {
  return !unsupported.has(filepath)
}

const notMigrated = Array.from(unsupported)

export {files, notMigrated, isSupported}
