---
name: pull-request-description
description: 'Use when drafting, filling out, or updating a pull request description in primer/react, including descriptions generated in cloud sessions. Do not use for reviewing code, writing commits or issues, or checking PR status without editing the description.'
---

# Pull request descriptions

Read `.github/pull_request_template.md` and check `.github/PULL_REQUEST_TEMPLATE/`
for applicable templates before writing. Use the template's headings, comments,
and ordering. The rollout checklist is the exception: keep only applicable options.

Read the diff and relevant issue context so the description reflects the actual
change. When updating a PR, read its current body and preserve relevant
human-authored context. Do not invent issues, rollout decisions, or results.

## Issue references

- Put all closing references (`Closes`, `Fixes`, or `Resolves`) together at the
  top of the body, before the overview and changelog.
- Move any references appended at the bottom by cloud sessions to the top.
  Preserve their targets and avoid duplicates.
- Only use closing keywords for issues this PR actually resolves. Use `Related to`
  or `Follow up to` for other relationships.
- Leave the issue location blank when there is no linked issue.

## Overview and changelog

- Give a short overview of what changes and why.
- Fill the relevant New, Changed, and Removed sections with terse, concrete
  changes. Leave sections without relevant changes empty.
- Include screenshots, videos, or other evidence when useful for understanding
  the change, not as boilerplate.

## Rollout strategy

- Select every applicable option with `[x]` and remove all unselected options.
  Do not treat the checklist as single-select.
- Use `No changes needed in github/github-ui` for package changes that need no
  downstream code changes. This does not mean there is no rollout.
- For `Needs changes in github/github-ui`, include the relevant commits or
  migration plan. For feature flags, include their names.
- Use `Not sure` when the rollout is genuinely unknown rather than guessing.
- Use `No rollout required (for example, docs-only changes)` only when there is
  no published package behavior change to roll out. Briefly explain why, and
  do not combine it with other options.

## Testing & Reviewing

- Write for the reviewer: what to inspect, which scenario to try, and what
  behavior or outcome to expect.
- Keep this to one or two short sentences or a few terse bullets. Focus on the
  change's specific risks or non-obvious review needs.
- Do not dump commands, routine CI checks, completed-test inventories, or local
  environment/session notes into this section.
- Leave it blank when there is no special review guidance.

## Before publishing

- Check the final body against the current diff, including after follow-up changes.
- Confirm closing references are at the top, only applicable checked rollout
  options remain, and review guidance is short and actionable.
- Use the `changesets` skill when deciding changeset requirements. This checklist
  does not replace a required changeset or the `skip changeset` label.
