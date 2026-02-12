# Codebase Cleanup Analysis Report

**Generated:** 2026-02-12  
**Repository:** primer/react  
**Focus:** Low-hanging fruit for code cleanup

---

## Executive Summary

This report identifies unused, unreachable, or unnecessary code in the Primer React codebase that could be cleaned up. The analysis focused on finding "low-hanging fruit" - cleanup opportunities that would provide immediate value with minimal risk.

**Key Statistics:**
- Total TypeScript files: 807 in `packages/react/src`
- Story files: 235
- Test files: 171
- Snapshot directories: 12
- TODO/FIXME comments: 12
- Console.log statements: 20 files
- ESLint disable comments: 267
- Deprecated components: Multiple (marked for removal since 2022)

---

## 1. CRITICAL: Overdue Deprecated Code Removal ⚠️

### 1.1 ActionList and ActionMenu (Deprecated March 9, 2022)

**Location:** `packages/react/src/deprecated/index.ts:12`

**Issue:** Code marked for removal 6 months after March 9, 2022 (target: September 10, 2022) - **now 3+ years overdue**

```typescript
// TODO: We can remove these 6 months after release: September 10, 2022
export {ActionList} from './ActionList'
export {ActionMenu} from './ActionMenu'
```

**Impact:**
- `packages/react/src/deprecated/ActionList/` - Complete directory with 6 files
- `packages/react/src/deprecated/ActionMenu.tsx` - Single file
- Associated tests in `packages/react/src/__tests__/deprecated/`
- Stories and documentation files

**Recommendation:** HIGH PRIORITY - These components are 3+ years past their removal date. Create a deprecation plan:
1. Add prominent deprecation warnings to documentation
2. Create migration guide if not already present
3. Plan removal for next major version
4. Notify users via changelog

---

## 2. Deprecated Components (Still Published)

### 2.1 Components in Deprecated Export

**Location:** `packages/react/src/deprecated/index.ts`

All components below are exported from `@primer/react/deprecated` and still maintained:

**Deprecated in v35.0.0 (March 9, 2022):**
- ActionList (6 files)
- ActionMenu (1 file)

**Deprecated in v36.0.0:**
- FilteredSearch (3 files)
- UnderlineNav (7 files)

**Deprecated in v37.0.0:**
- Dialog (DialogV1 - entire directory)
- Octicon (re-exported from main)
- Pagehead (re-exported from main)
- TabNav (re-exported from main)
- Tooltip (re-exported from main)

**Files Count:**
- `deprecated/` directory: ~25+ TypeScript files
- Test files: 5 in `__tests__/deprecated/`
- Story files: Multiple

**Recommendation:** 
- Create a deprecation timeline for remaining components
- For v37.0.0 deprecated items (Octicon, Pagehead, TabNav, Tooltip): These are just re-exports, consider removing the re-export path
- For older deprecations: Plan for removal or document long-term support strategy

---

## 3. Development & Testing Artifacts

### 3.1 Development Story Files

**Count:** 36 `.dev.stories.tsx` and `.stress.dev.stories.tsx` files

These files are used for development and debugging but add to bundle/build size:

**Examples:**
- `packages/react/src/Header/Header.dev.stories.tsx`
- `packages/react/src/Button/Button.stress.dev.stories.tsx`
- `packages/react/src/ActionList/ActionList.stress.dev.stories.tsx`
- `packages/react/src/Pagination/Pagination.stress.dev.stories.tsx`
- `packages/react/src/TreeView/TreeView.stress.dev.stories.tsx`

**Recommendation:**
- These are useful for development - KEEP
- Ensure they're excluded from production builds (verify Storybook build configuration)
- Consider if stress test stories could be converted to automated performance tests

### 3.2 Performance Story Files

**Count:** 1 file
- `packages/react/src/PageLayout/PageLayout.performance.stories.tsx`

**Recommendation:**
- Consider converting to automated performance tests
- Or standardize performance testing approach across all components

### 3.3 Snapshot Tests

**Count:** 12 `__snapshots__` directories with `.snap` files

**Issue:** According to repository memories, the project is migrating from snapshot tests to Visual Regression Tests (VRT).

**Files:**
- `Button/__tests__/__snapshots__/`
- `CircleBadge/__snapshots__/`
- `PageLayout/__snapshots__/`
- `TextInput/__snapshots__/`
- And 8 more...

**Recommendation:**
- Complete migration from snapshot tests to VRT
- Remove snapshot files once VRT coverage is complete
- Update test files to remove snapshot assertions

---

## 4. Documentation & Work Items

### 4.1 Work Log in Source Code

**Location:** `packages/react/src/experimental/SelectPanel2/work-log.md`

**Issue:** 54-line work log document inside source directory

**Content:**
- Open action items
- Accessibility questions (some answered, some not)
- Design questions
- API decisions
- Implementation notes

**Recommendation:**
- Move to GitHub Issues for tracking
- Or move to `contributor-docs/` if historical context is needed
- Remove from source directory

### 4.2 README Files

**Files:**
- `packages/react/src/legacy-theme/README.md`
- `packages/react/src/FeatureFlags/README.md`

**Recommendation:** KEEP - These provide important context for their respective features

---

## 5. TODO and FIXME Comments

**Count:** 12 TODO comments found

### High Priority TODOs:

1. **`deprecated/index.ts:12`** - Remove deprecated exports (overdue since 2022)
   
2. **`TreeView/TreeView.test.tsx:12`** - "Move this function into a shared location"
   - Suggests code duplication

3. **`__tests__/storybook.test.tsx:10`** - "Remove this allowlist when all components use the new story format"
   - Migration tracking

### Technical Debt TODOs:

4. **`Token/Token.tsx:15`** - "Temporary solution until we figure out why these methods are causing type errors"

5. **`PageLayout/PageLayout.tsx:82`** - "refs" (incomplete comment)

6. **`PageLayout/PageLayout.tsx:527`** - "Account for pane width when centering content"

7. **`hooks/useResponsiveValue.ts:8`** - "Use viewport range tokens from @primer/primitives"

8. **`hooks/useResponsiveValue.ts:48`** - "Improve SSR support"

9. **`utils/modern-polymorphic.ts:14`** - "Figure out how to change this type so we can set displayName"

10. **`LabelGroup/LabelGroup.tsx:110`** - "Reduce re-renders"

### Lower Priority TODOs:

11. **`__tests__/ThemeProvider.test.tsx:72`** - "Need to wire up a prefers color scheme mock, vitest-matchmedia-mock?"

12. **`PageLayout/PageLayout.examples.stories.tsx:95`** - "Update this story so it works when going 2 levels deep"

**Recommendation:**
- Create GitHub issues for TODOs that represent work items
- Remove comments that are no longer relevant
- Address critical type errors and temporary solutions

---

## 6. Console Statements

**Count:** 20 files with `console.log`, `console.debug`, or `console.warn`

**Files with console statements:**
- `TreeView/TreeView.features.stories.tsx`
- `ActionList/ActionList.test.tsx`
- `TreeView/TreeView.test.tsx`
- `Autocomplete/Autocomplete.features.stories.tsx`
- `Button/ButtonBase.tsx` ⚠️ (in production code)
- `SegmentedControl/SegmentedControl.tsx` ⚠️ (in production code)
- `DataTable/useTable.ts` ⚠️ (in production code)
- And 13 more...

**Recommendation:**
- Remove console statements from story files (acceptable in dev stories)
- **CRITICAL:** Remove or replace console statements in production code:
  - `ButtonBase.tsx`
  - `SegmentedControl.tsx`
  - `DataTable/useTable.ts`
- Use proper logging utility (`utils/warning.ts` and `utils/deprecate.tsx` exist)
- ESLint should catch these - verify ESLint configuration

---

## 7. ESLint Disable Comments

**Count:** 267 `eslint-disable` comments

**Issue:** High number suggests either:
- ESLint rules too strict
- Code quality issues being suppressed
- Legacy code not meeting current standards

**Recommendation:**
- Audit a sample of eslint-disable comments
- Fix underlying issues where possible
- Document legitimate exceptions
- Consider updating ESLint rules if consistently disabled

---

## 8. Experimental Features

### 8.1 Experimental Components

**Location:** `packages/react/src/experimental/`

**Components:**
- CSSComponent
- IssueLabel
- SelectPanel2 (with work-log.md)
- Tabs
- UnderlinePanels
- hooks (experimental hooks)

**Count:** 32 TypeScript files

**Recommendation:**
- Review each experimental component
- Promote stable ones to main
- Remove abandoned experiments
- Document criteria for graduation from experimental

---

## 9. Other Findings

### 9.1 Duplicate File Names

Multiple components share the same file names (e.g., `ActionList.test.tsx` appears in both main and deprecated). This is expected with directory structure but could cause confusion.

**Recommendation:** Acceptable - directory structure provides context

### 9.2 No Empty Files

✅ No empty TypeScript or CSS files found

### 9.3 No Debugger Statements

✅ No `debugger` statements found in source code

### 9.4 Story File Organization

**Count:** 235 story files with multiple variants:
- `.stories.tsx` - Main examples
- `.features.stories.tsx` - Feature demos
- `.dev.stories.tsx` - Development/debugging
- `.examples.stories.tsx` - Advanced examples
- `.responsive.stories.tsx` - Responsive testing
- `.performance.stories.tsx` - Performance testing

**Recommendation:** 
- This organization is good - KEEP
- Ensure naming convention is documented

---

## 10. Prioritized Action Items

### Immediate (High Priority)

1. **Remove overdue deprecated code** (ActionList v1, ActionMenu v1)
   - 3+ years past removal date
   - Create migration guide and announce removal timeline

2. **Remove console statements from production code**
   - `ButtonBase.tsx`
   - `SegmentedControl.tsx`  
   - `DataTable/useTable.ts`

3. **Move work-log.md out of source**
   - `experimental/SelectPanel2/work-log.md` → GitHub Issues or docs

### Medium Priority

4. **Complete snapshot to VRT migration**
   - Remove 12 `__snapshots__` directories
   - Update test files

5. **Address critical TODOs**
   - Fix type errors in `Token/Token.tsx`
   - Move shared test function from `TreeView/TreeView.test.tsx`
   - Remove story format allowlist

6. **Review experimental components**
   - Promote stable ones
   - Remove abandoned ones
   - Document graduation criteria

### Low Priority

7. **Review ESLint disable comments**
   - Sample audit
   - Fix underlying issues

8. **Plan deprecation timeline**
   - FilteredSearch, UnderlineNav, DialogV1
   - Document support strategy

9. **Address remaining TODOs**
   - Create issues for work items
   - Remove obsolete comments

---

## 11. Estimated Impact

### Code Reduction Potential

**Immediate removals (overdue deprecated code):**
- ~15-20 component files
- ~10 test files  
- ~5 story files
- Estimated: **30-35 files, ~2,000-3,000 lines of code**

**After snapshot migration:**
- 12 `__snapshots__` directories
- ~15-20 snapshot files
- Estimated: **~500-1,000 lines of snapshot data**

**After full deprecated cleanup:**
- ~40-50 component/test/story files
- Estimated: **~5,000-7,000 lines of code**

### Maintenance Burden Reduction

- Fewer deprecated components to maintain
- Reduced test suite complexity
- Clearer codebase boundaries (experimental vs stable vs deprecated)
- Better documentation through TODO resolution

---

## Conclusion

The Primer React codebase is generally well-maintained with good organization. The main cleanup opportunities are:

1. **Overdue deprecated code removal** - Clear, actionable, high-impact
2. **Console statement cleanup** - Quick wins for code quality
3. **Snapshot test migration** - Already planned, needs completion
4. **Work tracking out of source** - Simple organizational improvement

These cleanups would remove significant technical debt while maintaining backward compatibility during a proper deprecation cycle.
