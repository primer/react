# Pull request classification

Two workflows help reviewers understand pull requests, including drafts.
They run when a PR opens, reopens, receives commits, or becomes ready for review.
They are advisory, not release approvals or substitutes for human review.

## Area labels

`PR area labels` deterministically matches changed paths. A PR can have multiple
`area:` labels, such as `area: react` and `area: storybook` for a React story.
Renames count both the old and new paths. The workflow assumes area labels already
exist and removes stale labels from its own set, preserving unrelated labels.

Mappings live in `.github/workflows/pr-area-labels.yml`. The managed areas are
react, styled-react, docs, ci, storybook, mcp, tooling, tests, examples, canvas, and
release. Paths outside these mappings receive no area label.

## Public-package risk and comparisons

`PR public impact` uses Copilot to inspect the diff and relevant manifests,
exports, source, and build configuration without executing PR code. It owns
exactly one of these existing labels:

| Label          | Consumer risk                                                                 |
| -------------- | ----------------------------------------------------------------------------- |
| `risk: high`   | Breaking contracts or broad regressions that may require consumer action.     |
| `risk: medium` | Meaningful, localized regression potential in existing behavior or styling.   |
| `risk: low`    | Narrow backward-compatible additions or isolated, limited-disruption fixes.   |
| `risk: none`   | No published package API, behavior, styling, dependency, or artifact changes. |

Risk is not a semver recommendation. For example, a bug fix in shared focus
management may be riskier than an optional prop addition. Runtime dependencies and
build configuration can affect consumers even without component source changes.
Missing evidence produces an incomplete run, not a guessed `risk: none`.

Public changes receive a comment comparing consumer-facing before/after states
with commit-pinned source evidence. API changes can include usage examples;
visual changes receive source-based explanations, with verified existing PR images
reused when available. This workflow does not render untrusted PR code or generate
new screenshots. It explicitly distinguishes source-based predictions from rendered
evidence. Older workflow comments are hidden when superseded. Internal-only changes
receive no comment, except to supersede an obsolete public comparison.

## Operations and safety

Both workflows use `pull_request_target` with trusted base-branch definitions.
Neither checks out PR code. Area labeling runs for forks as well. AI assessment
requires the event actor to have admin, maintainer, or write access, including
when the PR comes from a fork. An outside contributor's event does not start the
agent; a trusted maintainer can reopen the PR or mark it ready for review to
trigger assessment. Do not relax this role gate to `all` on a privileged trigger.
The agent uses a read-only GitHub proxy. Its authored shell grant is `gh api`;
gh-aw also supplies baseline read utilities and proxy commands. It has no editing
tools or external network access. Mutations use constrained safe outputs targeting
only the triggering PR. Area labeling uses a fixed GitHub API script with no checkout.
Both check that the assessed head is still current before updating the PR.

The agent uses the repository's organization-billed Copilot inference through
`copilot-requests: write`, matching existing agentic workflows. Deployment still
requires the organization's Actions/Copilot policy to permit that inference;
compilation does not verify live authentication. Area labeling needs no AI access.

Edit the agent source in `.github/workflows/pr-public-impact.md`, then run
`gh aw compile pr-public-impact --strict --action-mode action --action-tag 406c7719e31d7fe354224d4bb8fe3d4aeb47da1c`
with the repository's compiler version (currently v1.0.1). This pins the runtime
setup action to the same revision as existing compiled workflows. Commit its
generated `.lock.yml` alongside the source. Do not
hand-edit the lock file. After merging, inspect a docs-only PR, an optional public
API addition, and an existing-behavior change to check classification quality.
Rerun a failed workflow from Actions if credentials or evidence were unavailable.
