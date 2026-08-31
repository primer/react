---
name: primer-npm-packages-integration
description: 'Use when monitoring a Primer React pull request labeled `integration-tests: recommended` and a fresh github-ui npm-packages integration run is needed after opening or updating the PR. Covers label verification, workflow dispatch, and run tracking with the GitHub CLI.'
---

# Primer npm-packages integration

The github-ui integration workflow builds npm artifacts from a Primer React pull
request and installs them into a generated github-ui pull request.

## When to use

Use this skill only when:

- The Primer React pull request has the `integration-tests: recommended` label.
- A new integration run is needed, such as after opening the pull request or
  pushing a change that needs downstream validation.

Do not dispatch the workflow when the label is absent.

## Dispatch the workflow

Use the pull request URL as the workflow input:

```bash
PR_URL="$(gh pr view <PR_NUMBER> --repo primer/react --json url --jq .url)"

gh pr view "$PR_URL" --repo primer/react --json labels --jq '.labels[].name' |
  rg -qx 'integration-tests: recommended'

gh workflow run primer-npm-packages-integration.yml \
  --repo github/github-ui \
  --ref main \
  -f "prc-pr=$PR_URL"
```

The label check exits nonzero when the pull request is not recommended for
integration testing. Do not bypass it.

## Track the run

Find the dispatched workflow, then inspect the generated github-ui pull request
and its checks:

```bash
gh run list \
  --repo github/github-ui \
  --workflow primer-npm-packages-integration.yml \
  --limit 5

gh pr list \
  --repo github/github-ui \
  --head "prc-npm-packages-integration-for-<PR_NUMBER>" \
  --state open

gh pr checks <INTEGRATION_PR_NUMBER> --repo github/github-ui
```

The generated integration pull request is automated and must remain a draft.
Never modify or merge it manually.
