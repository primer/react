## ❗ Pre-merge checklist

Please ensure these items are checked before merging:

### 🔎 Smoke test

- [ ] All CI checks pass on this pull request
- [ ] Docs and Storybook open in a browser

### 🌏 Integration tests

- [ ] Successful integration test with github/github-ui as a primary consumer of primer/react ([automated pull request](https://github.com/github/github-ui/pulls?q=is%3Apr+is%3Aopen+author%3Aapp%2Ftest-primer-actions+Integration+tests+for+primer%2Freact+release+primer-react-hourly+github+action+))
  - [ ] Verify all CI checks have passed on automated pull request
  - [ ] Manually test critical paths in preview
  - [ ] Manually test release-specific bugfixes and/or feature work as described in preview
     
### ✅ Peer Review

- [ ] Create release review issue for Issues team ([example](https://github.com/github/issues/issues/17817))
- [ ] Wait for approval from Issues team before merging

### 🤔 Sanity test

- [ ] All bugfixes in this release have resolved their corresponding issues
- [ ] The issues for any reverted PRs have been re-opened and commented on with a link to the reverted PR
- [ ] No noticeable regressions have been introduced as a result of changes in this release
- [ ] Release notes accurately describe the changes made

## ❗ Post-merge checklist

Please ensure these items are checked after merging:

## 🚢 Version upgrade, cleanup, and documentation

- [ ] Upgrade `@primer/react` version at github/github-ui
- [ ] Close Integration test PR and delete branch
- [ ] Leave a comment on [quarterly release conductor tracking issue](https://github.com/github/primer/issues/5977)
- [ ] Leave any testing notes on the automated [per-shift release tracking issue](https://github.com/primer/react/issues?q=is%3Aissue+is%3Aopen+%22Release+Tracking%22). In particular, describe any issues encountered during your testing. This is helpful in providing historical context to the next release conductor as well as other maintainers.
