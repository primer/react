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
const unsupportedPatterns = [
  'src/ActionMenu/ActionMenu.test.tsx',
  'src/ActionMenu/ActionMenu.tsx',
  'src/Autocomplete/Autocomplete.test.tsx',
  'src/Autocomplete/AutocompleteInput.tsx',
  'src/Button/ButtonBase.tsx',
  'src/Dialog/Dialog.tsx',
  'src/SelectPanel/SelectPanel.examples.stories.tsx',
  'src/SelectPanel/SelectPanel.test.tsx',
  'src/SelectPanel/SelectPanel.tsx',
  'src/experimental/SelectPanel2/SelectPanel.tsx',
  'src/hooks/useAnchoredPosition.ts',
  'src/hooks/useFocusTrap.ts',
  'src/hooks/useFocusZone.ts',
  'src/hooks/useMenuInitialFocus.ts',
  'src/hooks/useOnEscapePress.ts',
  'src/hooks/useResizeObserver.ts',
  'src/hooks/useSafeTimeout.ts',
  'src/TooltipV2/Tooltip.tsx',
]

const unsupported = new Set(
  unsupportedPatterns.flatMap(pattern => {
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

export {files, notMigrated, isSupported, unsupportedPatterns}
