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
  'src/ActionMenu/**/*.tsx',
  'src/Autocomplete/**/*.tsx',
  'src/AvatarStack/**/*.tsx',
  'src/Banner/**/*.tsx',
  'src/Button/**/*.tsx',
  'src/Checkbox/**/*.tsx',
  'src/ConfirmationDialog/**/*.tsx',
  'src/Dialog/**/*.tsx',
  'src/Heading/**/*.tsx',
  'src/Link/**/*.tsx',
  'src/Pagehead/**/*.tsx',
  'src/PageLayout/**/*.tsx',
  'src/Pagination/**/*.tsx',
  'src/SelectPanel/**/*.tsx',
  'src/SideNav.tsx',
  'src/UnderlineNav/**/*.tsx',
  'src/experimental/SelectPanel2/**/*.tsx',
  'src/hooks/useAnchoredPosition.ts',
  'src/hooks/useFocusTrap.ts',
  'src/hooks/useFocusZone.ts',
  'src/hooks/useMenuInitialFocus.ts',
  'src/hooks/useOnEscapePress.ts',
  'src/hooks/useResizeObserver.ts',
  'src/hooks/useSafeTimeout.ts',
  'src/hooks/useScrollFlash.ts',
  'src/internal/components/CheckboxOrRadioGroup/**/*.tsx',
  'src/hooks/useMergedRefs.ts',
  'src/TooltipV2/**/*.tsx',
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
