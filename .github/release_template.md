## ❗ Pre-merge checklist

Please ensure these items are checked before merging.

### 🔎 Smoke test

- [ ] All CI checks pass
- [ ] Docs and Storybook open in a browser
- [ ] Successful integration test with GitHub Projects
  1. Install the Release Candidate
  2. Verify no new build errors appear
  3. Verify no new linting errors appear
  4. Verify no new browser console errors appear
  5. Verify unit tests and E2E tests pass
  6. Manually test critical paths (Tip: Use the provided tests project boards)
  7. Manually test release-specific bugfixes and/or features work as described

### 🤔 Sanity test

- [ ] All bugfixes in this release have resolved their corrosponding issues
- [ ] All new features in this release have been tested and verified as compatible with GitHub Projects
- [ ] No noticeable regressions have not been introduced as a result of changes in this release
- [ ] Commit descriptions in the release accurately describe the changes applied
