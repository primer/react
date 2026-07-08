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
  'src/ActionBar/ActionBar.tsx',
  'src/ActionList/ActionList.examples.stories.tsx',
  'src/ActionMenu/ActionMenu.test.tsx',
  'src/ActionMenu/ActionMenu.tsx',
  'src/AnchoredOverlay/AnchoredOverlay.tsx',
  'src/Autocomplete/Autocomplete.test.tsx',
  'src/Autocomplete/AutocompleteInput.tsx',
  'src/Button/ButtonBase.tsx',
  'src/Checkbox/Checkbox.tsx',
  'src/CounterLabel/CounterLabel.tsx',
  'src/Dialog/Dialog.tsx',
  'src/FilteredActionList/FilteredActionList.tsx',
  'src/FilteredActionList/useAnnouncements.tsx',
  'src/LabelGroup/LabelGroup.tsx',
  'src/NavList/NavList.features.stories.tsx',
  'src/NavList/NavList.test.tsx',
  'src/Overlay/Overlay.figma.tsx',
  'src/Overlay/Overlay.tsx',
  'src/Portal/Portal.tsx',
  'src/SelectPanel/SelectPanel.examples.stories.tsx',
  'src/SelectPanel/SelectPanel.test.tsx',
  'src/SelectPanel/SelectPanel.tsx',
  'src/Skeleton/SkeletonBox.figma.tsx',
  'src/TextInput/TextInput.tsx',
  'src/Token/_RemoveTokenButton.tsx',
  'src/Tooltip/Tooltip.tsx',
  'src/TooltipV2/Tooltip.tsx',
  'src/TreeView/TreeView.features.stories.tsx',
  'src/TreeView/TreeView.tsx',
  'src/Truncate/Truncate.tsx',
  'src/deprecated/utils/create-slots.tsx',
  'src/experimental/SelectPanel2/SelectPanel.tsx',
  'src/experimental/UnderlinePanels/UnderlinePanels.test.tsx',
  'src/experimental/UnderlinePanels/UnderlinePanels.tsx',
  'src/hooks/useAnchoredPosition.ts',
  'src/hooks/useControllableState.ts',
  'src/hooks/useFocusTrap.ts',
  'src/hooks/useFocusZone.ts',
  'src/hooks/useMenuInitialFocus.ts',
  'src/hooks/useOnEscapePress.ts',
  'src/hooks/useOnOutsideClick.tsx',
  'src/hooks/useResizeObserver.ts',
  'src/hooks/useSafeTimeout.ts',
  'src/internal/components/Caret.tsx',
  'src/internal/hooks/__tests__/useFocus.test.tsx',
  'src/internal/hooks/useDevOnlyEffect.ts',
  'src/stories/deprecated/ActionList.stories.tsx',
  'src/utils/StressTest.tsx',
  'src/utils/use-force-update.ts',
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
