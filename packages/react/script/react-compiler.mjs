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
  // Never compile test or story files: they aren't shipped, often define ad-hoc
  // helper components that violate the Rules of React (which makes the compiler
  // inject hooks into non-components and throw "invalid hook call"), and gain
  // nothing from memoization. Excluding them also keeps a component's test suite
  // green when the component itself is migrated.
  if (/\.(test|stories)\.[cm]?[jt]sx?$/.test(filepath)) {
    return false
  }
  // Opt-in override to compile ALL (non-test) source files, including the
  // not-yet-migrated ones, so the full test suite can validate a bulk React
  // Compiler migration. Enable with REACT_COMPILER_ALL=true
  // (e.g. `REACT_COMPILER_ALL=true npm test`).
  if (process.env.REACT_COMPILER_ALL === 'true') {
    return true
  }
  return !unsupported.has(filepath)
}

const notMigrated = Array.from(unsupported)

export {files, notMigrated, isSupported, unsupportedPatterns}
