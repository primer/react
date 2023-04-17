## ❗ Pre-merge checklist

Please ensure these items are checked before merging.

### 🔎 Smoke test

- [ ] All CI checks pass
- [ ] Docs and Storybook open in a browser
- [ ] Successful integration test with GitHub Projects as a primary consumer of Primer React
  - [ ] Install the Release Candidate
  - [ ] Verify no new build errors appear
  - [ ] Verify no new linting errors appear
  - [ ] Verify no new browser console errors appear
  - [ ] Verify unit tests and E2E tests pass
  - [ ] Manually test critical paths (Tip: Use the provided tests project boards)
  - [ ] Manually test release-specific bugfixes and/or features work as described
- [ ] Works in CodeSandbox or StackBlitz
  - [ ] New components render successfully
  - [ ] (optional) Tested in both SPA and SSR apps if release contains build changes

### 🤔 Sanity test

- [ ] All bugfixes in this release have resolved their corrosponding issues
- [ ] All new features in this release have been tested and verified as compatible with GitHub Projects
- [ ] No noticeable regressions have not been introduced as a result of changes in this release
- [ ] Release notes accurately describe the changes made

### 🚢 After merge

- [ ] Add the preview deployment's link to releases as a way of permalinking to old version's docs. [Example](https://github.com/primer/react/releases/tag/v35.9.0)

Please also leave any testing notes as a comment on this pull request. In particular, describing any issues encountered during your testing. This is helpful in providing historical context to maintainers.
