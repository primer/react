## ❗ Pre-merge checklist

Please ensure these items are checked before merging.

### 🔎 Smoke test

- [ ] All CI checks pass on this pull request
- [ ] Docs and Storybook open in a browser
- [ ] Works in CodeSandbox or StackBlitz
  - [ ] New components render successfully
  - [ ] (optional) Tested in both SPA and SSR apps if release contains build changes

### 🌏 Integration tests

- [ ] Successful integration test with github/github as a primary consumer of Primer React ([automated pull request](https://github.com/github/github/pulls?q=is%3Apr+is%3Aopen+Integration+tests+for+%40primer%2Freact+label%3Adependencies))
  - [ ] Verify all CI checks have passed on automated pull request
  - [ ] Manually test critical paths in the review-lab
  - [ ] Manually test release-specific bugfixes and/or features work as described in the review-lab

### 🤔 Sanity test

- [ ] All bugfixes in this release have resolved their corresponding issues
- [ ] The issues for reverted PRs have been re-opened and commented on with a link to the reverted PR
- [ ] No noticeable regressions have not been introduced as a result of changes in this release
- [ ] Release notes accurately describe the changes made

### 🚢 After merge

- [ ] Upgrade `@primer/react` version at github/github

- [ ] Add the preview deployment's link to releases as a way of permalinking to old version's docs. [Example](https://github.com/primer/react/releases/tag/v35.9.0)

Please also leave any testing notes on the weekly [release tracking issue](https://github.com/primer/react/issues?q=is%3Aissue+is%3Aopen+%22Release+Tracking%22). In particular, describing any issues encountered during your testing. This is helpful in providing historical context to the next release conductor as well as maintainers.
