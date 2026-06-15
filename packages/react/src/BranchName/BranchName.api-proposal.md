# BranchName — API proposal for upstreaming

Goal: upstream patterns from production usage into the `BranchName` component.
Three patterns keep getting re-implemented by consumers:

1. **Leading visual** — a branch/tag icon before the name
2. **Trailing action** — copy button, branch switcher menu
3. **Description tooltip** — shows `owner/repo:branch` context

---

## Leading visual (icon)

`BranchName` has **no** built-in leading icon today. The `WithBranchIcon` story
hand-rolls it with `Stack` + `Octicon`, but **nobody in github-ui does it that
way** — every consumer reinvents it differently. Real usages (517 references,
~37 files render `<BranchName>`, only ~5 add an icon, and all 5 differ):

```tsx
// 1) codespaces-tab/ExportCodespaceDialog.tsx
//    icon INSIDE, manual size + valign hack, manual <span> wrapper
<BranchName>
  <GitBranchIcon size={12} className="v-align-middle" />
  <span>{codespace.exportBranchName}</span>
</BranchName>
```

```tsx
// 2) commits/CommitBranchInfo.tsx
//    icon OUTSIDE as a sibling, using the deprecated Octicon + margin util
<Octicon className="mr-1" icon={GitBranchIcon} />
<BranchName className="mx-1" href={comparePath({repo, head: branchName})}>
  {branch.branch}
</BranchName>
```

```tsx
// 3) pull-requests/StackOverlay.tsx
//    icon OUTSIDE as a sibling, different color util, no sizing
<GitBranchIcon className="fgColor-muted" />
<BranchName as="span">{baseBranchText}</BranchName>
```

```tsx
// 4) repos-rules/RefPill.tsx
//    icon INSIDE, wrapped in Truncate + extra <span>s, branch/tag swap
<BranchName as="span">
  <Truncate title={param} className={styles.RefPillTruncate}>
    <span className={styles.RefPillText}>
      {showIcon ? <RefIcon target={param} /> : null}
      {param}
    </span>
  </Truncate>
</BranchName>
```

```tsx
// 5) license-compliance-alerts/AppearedInBranchEvent.tsx
//    no leading icon INSIDE BranchName — icon lives on the surrounding timeline row
<BranchName href={`../../tree/${branchInfo.branch_name}`}>{branchInfo.branch_name}</BranchName>
```

Observations:

- **Sizing is inconsistent:** `size={12}`, `size={16}`, or unset.
- **Placement is inconsistent:** sometimes inside `BranchName`, sometimes a
  sibling before it.
- **Alignment is hand-fixed:** `v-align-middle`, `mr-1`, `Stack`, etc.
- **Icon varies:** usually `GitBranchIcon`, sometimes `TagIcon` (RefPill).

This is the same _shape_ of problem as the trailing action: a positional visual
that everyone re-implements. So this proposal includes **leadingVisual** in the
same pass so both ends of `BranchName` get a consistent, sized, aligned API.
Precedent already exists on `Button`/`Token` as a `leadingVisual?: React.ElementType` prop.

Sketch (mirrors whatever we pick for the trailing action):

```tsx
// prop form
<BranchName href={href} leadingVisual={GitBranchIcon}>{branchName}</BranchName>

// compound form
<BranchName href={href}>
  <BranchName.LeadingVisual icon={GitBranchIcon} />
  {branchName}
</BranchName>
```

---

Today `github-ui`'s `PullRequestBranchName` component does all this work by hand
(see Appendix A for the full source):

```tsx
<span className={styles.BranchNameWithTrailingAction}>
  <Tooltip text={`${repo}:${branchName}`}>
    <BranchName href={href} className={styles.BranchNameTransparent}>
      {branchName}
    </BranchName>
  </Tooltip>
  <Tooltip text={tooltipText} aria-hidden>
    <IconButton
      icon={copied ? CheckIcon : CopyIcon}
      aria-label="Copy branch name to clipboard"
      variant="invisible"
      size="small"
      onClick={handleCopy}
      className={clsx(styles.TrailingActionButton, copied && styles.TrailingActionButtonCopied)}
    />
  </Tooltip>
</span>
```

Pain points we want to remove for consumers:

- The wrapper `span` + layout/divider CSS (`.BranchNameWithTrailingAction`,
  `.TrailingActionButton`, the `::before` divider, transparent-background override).
- Hand-rolling the leading icon with `Stack` + `Octicon` or inline hacks.
- Wrapping in `<Tooltip>` for the description.
- The copy plumbing (`navigator.clipboard.writeText`, `announce('Copied!')`,
  the `copied` state, the `CopyIcon`/`CheckIcon` swap, tooltip text swap).
- Getting the accessibility details right (announce, aria-hidden tooltip, etc).

Below are the decisions to make. Pick one option per section.

---

## API shape

### Option A — Compound component (recommended) ✅

`BranchName` becomes a layout container. The link gets its own slot, and
trailing actions are children.

```tsx
<BranchName href={href}>
  <BranchName.Link>{branchName}</BranchName.Link>
  <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />
</BranchName>
```

- **Pros:** Idiomatic Primer ("children as API", ADR-004). Handles the divider
  automatically between each action. Naturally supports 0, 1, or many trailing
  actions (copy AND menu). Most flexible for the menu variant.
- **Cons:** Biggest change. Introduces a sub-component and a wrapping element,
  which slightly changes the DOM/markup that existing `BranchName` consumers get.
  Need a back-compat path so `<BranchName href>text</BranchName>` still renders
  exactly as before (no wrapper) when there are no trailing actions.

### Option B — `trailingAction` prop

```tsx
<BranchName
  href={href}
  trailingAction={<IconButton icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />}
>
  {branchName}
</BranchName>
```

- **Pros:** Smaller surface area, no sub-components. Easy to reason about.
- **Cons:** Awkward for multiple actions / the menu variant. Consumer still has
  to import and configure `IconButton` and match sizing/variant. Divider styling
  applied to an arbitrary node is fiddlier.

### Option C — `trailingAction` prop + constrained `BranchName.Action` slot (the `TextInput` pattern)

A hybrid of A and B: there's a `trailingAction` **prop** (like B), but the
thing you pass into it is a dedicated, constrained slot component
(`BranchName.Action`) rather than a raw `IconButton` or arbitrary node. This is
exactly what `TextInput` does today (`TextInput.Action`, from mperrotti's #2033).

```tsx
<BranchName
  href={href}
  trailingAction={<BranchName.Action icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />}
>
  {branchName}
</BranchName>
```

For reference, the `TextInput` precedent:

```tsx
<TextInput
  trailingAction={<TextInput.Action icon={XCircleFillIcon} aria-label="Clear input" onClick={() => setValue('')} />}
/>
```

`TextInput.Action` is a constrained wrapper: it takes `icon`, `aria-label` (which
doubles as the tooltip text + accessible label), `tooltipDirection`, and
`variant` (defaults to `invisible`), then renders an internal `IconButton` so the
consumer never builds one by hand. `children` is deprecated ("action buttons
should only use icon buttons").

- **Pros:** Consumer can't pass "whatever you want" — the action is always a
  constrained icon button with consistent sizing/variant/tooltip. Tooltip + a11y
  are handled inside the slot. Precedent already exists in the codebase.
- **Cons:** Two concepts to learn (the prop _and_ the slot component). Still
  awkward for multiple actions. The `TextInput.Action` tooltip is a **label**
  tooltip (icon-only button); `BranchName`'s tooltip need is a **description**
  (see open problems), so this wouldn't solve the tooltip question as-is. Not
  obviously "nice" — it's just the established precedent.

---

## API exploration — A vs B, side by side, by complexity

Both options collapse to the **same markup** for everything `BranchName` does
today (levels 0–2). They only diverge once a leading visual or trailing action
enters the picture (levels 3+). Each level is taken from an existing story.

### Level 0 — plain text (`NoProps` story)

Identical in both options. No wrapper, no slots.

```tsx
<BranchName>branch_name</BranchName>
```

### Level 1 — as a link (`LinkWithoutHref` / default)

Identical in both options.

```tsx
<BranchName href="/owner/repo/tree/branch_name">branch_name</BranchName>
```

### Level 2 — not a link (`NotALink` story)

Identical in both options.

```tsx
<BranchName as="span">branch_name</BranchName>
```

> Up to here, A and B are indistinguishable. The choice only matters once a
> visual or action is added.

### Level 3 — leading visual (`WithBranchIcon` story)

Today this is hand-rolled with `Stack` + `Octicon`:

```tsx
<BranchName href="#">
  <Stack direction="horizontal" gap="condensed" align="center">
    <Octicon icon={GitBranchIcon} />
    branch_name
  </Stack>
</BranchName>
```

**Option A — compound**

```tsx
<BranchName href={href}>
  <BranchName.LeadingVisual icon={GitBranchIcon} />
  branch_name
</BranchName>
```

**Option B — prop**

```tsx
<BranchName href={href} leadingVisual={GitBranchIcon}>
  branch_name
</BranchName>
```

### Level 4 — single trailing action: copy (`WithTrailingAction` story)

Today this is a wrapper `span`, two `Tooltip`s, an `IconButton`, divider CSS, and
copy/announce plumbing (see top of doc).

**Option A — compound**

```tsx
<BranchName href={href}>
  branch_name
  <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />
</BranchName>
```

**Option B — prop**

```tsx
<BranchName
  href={href}
  trailingAction={<IconButton icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />}
>
  branch_name
</BranchName>
```

### Level 5 — description tooltip

Identical in both options. Adds a description tooltip (the `owner/repo:branch`
context) — this maps to `aria-describedby`, not a label.

```tsx
<BranchName href={href} description={`${repo}:${branchName}`}>
  {branchName}
</BranchName>
```

### Level 6 — everything at once (leading visual + description + trailing action)

The full "kitchen sink": leading icon, description tooltip, and a trailing copy
action.

**Option A — compound**

<!-- prettier-ignore -->
```tsx
<BranchName href={href} description={`${repo}:${branchName}`}>
  <BranchName.LeadingVisual icon={GitBranchIcon} />
  {branchName}
  <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />
</BranchName>
```

**Option B — prop**

<!-- prettier-ignore -->
```tsx
<BranchName href={href} description={`${repo}:${branchName}`} leadingVisual={GitBranchIcon} trailingAction={<IconButton icon={CopyIcon} aria-label="Copy branch name to clipboard" onClick={handleCopy} />}>
  {branchName}
</BranchName>
```

### Level 7 — trailing action as a menu anchor (`WithTrailingActionMenu` story)

Only the **trailing button** should be the menu anchor — not the whole
`BranchName` (we don't want the branch link itself to open the menu). So instead
of wrapping `BranchName` in `renderAnchor`, use `SelectPanel`'s **external
anchor** pattern: pass `renderAnchor={null}`, hand the button a `ref`, and pass
that `ref` to `SelectPanel` as `anchorRef` (the `open` state is controlled). See
`SelectPanel`'s `WithExternalAnchor` story.

**Option A — compound**

<!-- prettier-ignore -->
```tsx
const anchorRef = useRef<HTMLButtonElement>(null)
const [open, setOpen] = useState(false)

<BranchName href={href}>
  {selected.text}
  <BranchName.TrailingAction icon={TriangleDownIcon} aria-label="Change base branch" ref={anchorRef}  onClick={() => setOpen(!open)} />
</BranchName>

<SelectPanel renderAnchor={null} anchorRef={anchorRef} />
```

**Option B — prop**

<!-- prettier-ignore -->
```tsx
const anchorRef = useRef<HTMLButtonElement>(null)
const [open, setOpen] = useState(false)

<BranchName href={href} trailingAction={<IconButton icon={TriangleDownIcon} aria-label="Change base branch" ref={anchorRef} onClick={() => setOpen(!open)} />}>
  {selected.text}
</BranchName>

<SelectPanel renderAnchor={null} anchorRef={anchorRef} />
```

> Both options need the trailing button to forward a `ref` so it can be the
> external anchor. A forwards the `ref` through the `TrailingAction` slot (the
> component owns the button); B puts the `ref` on the hand-built `IconButton`.
> Either way, the anchor is just the button — `BranchName` itself stays a plain
> link.

### What the progression shows

| Level | Scenario            | A (compound)                     | B (prop)                         |
| ----- | ------------------- | -------------------------------- | -------------------------------- |
| 0–2   | text / link / span  | identical                        | identical                        |
| 3     | leading visual      | `BranchName.LeadingVisual` slot  | `leadingVisual` prop             |
| 4     | one trailing action | `BranchName.TrailingAction` slot | `trailingAction` node prop       |
| 5     | description tooltip | identical (`description` prop)   | identical (`description` prop)   |
| 6     | everything          | `description` prop + slots       | `description` + other props      |
| 7     | menu anchor         | `ref` forwarded via slot         | `ref` on hand-built `IconButton` |

- **A scales** with the number of trailing actions and keeps divider logic
  inside the component, at the cost of a wrapper element and sub-components.
- **B stays terse** for the common 0–1 action case and changes the DOM the
  least, at the cost of the consumer still hand-building the `IconButton`.

---

## Decision

**Option A — Compound component** is the chosen approach.

The compound API:

- Keeps divider/layout logic inside the component
- Forwards refs through slots for menu anchoring
- Scales naturally to multiple trailing actions
- Matches Primer's "children as API" pattern (ADR-004)

---

## Appendix — full source of the real-world examples

Complete code pulled from the two repos so you can study each pattern in context.
Paths are relative to each repo root.

### A. Trailing action source we're upstreaming

**`github-ui` · `packages/pull-requests/components/PullRequestBranchName.tsx`**

This is the component the whole effort is based on. Note it hand-rolls the same
wrapper `span` + `Tooltip` our story does, and takes the trailing action as an
opaque `button?: React.ReactNode` (the "put whatever you want" approach we want
to avoid).

```tsx
import {branchPath} from '@github-ui/paths'
import {BranchName} from '@primer/react'
import {Tooltip} from '@primer/react/experimental'
import styles from './PullRequestBranchName.module.css'

export function PullRequestBranchName({
  branchText,
  repositoryOwner,
  repositoryName,
  branch,
  button,
}: {
  branchText: string
  repositoryName: string
  repositoryOwner: string
  branch: string
  button?: React.ReactNode
}) {
  const name =
    repositoryName && repositoryOwner ? (
      <Tooltip text={`${repositoryOwner}/${repositoryName}:${branch}`}>
        <BranchName
          href={branchPath({owner: repositoryOwner, repo: repositoryName, branch})}
          className={styles.branchName}
        >
          {branchText}
        </BranchName>
      </Tooltip>
    ) : (
      <BranchName as="span" className={styles.branchName} title="This repository has been deleted">
        {branchText}
      </BranchName>
    )

  if (!button) return name

  return (
    <span className={styles.branchWithButton}>
      {name}
      {button}
    </span>
  )
}
```

**Our current Primer story** (`packages/react/src/BranchName/BranchName.features.stories.tsx`)
does the same wrapper-by-hand, plus the copy plumbing:

```tsx
export const WithTrailingAction = ({
  branchName = 'fix/anchored-overlay-outside-top-autogrow',
  repo = 'primer/react',
}: {
  branchName: string
  repo: string
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    setCopied(true)
    void navigator.clipboard.writeText(branchName)
    announce('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const tooltipText = copied ? 'Copied!' : 'Copy branch name to clipboard'

  return (
    <span className={styles.BranchNameWithTrailingAction}>
      <Tooltip text={`${repo}:${branchName}`}>
        <BranchName href={`https://github.com/${repo}/tree/${branchName}`} className={styles.BranchNameTransparent}>
          {branchName}
        </BranchName>
      </Tooltip>
      <Tooltip text={tooltipText} aria-hidden>
        <IconButton
          icon={copied ? CheckIcon : CopyIcon}
          aria-label="Copy branch name to clipboard"
          variant="invisible"
          size="small"
          onClick={handleCopy}
          className={clsx(styles.TrailingActionButton, copied && styles.TrailingActionButtonCopied)}
        />
      </Tooltip>
    </span>
  )
}
```

### B. Leading visual (icon) examples — every one is different

**B1. `github-ui` · `packages/codespaces-tab/components/ExportCodespaceDialog.tsx`**

Icon **inside** `BranchName`, manual `size={12}`, manual vertical-align hack,
manual `<span>` around the text.

```tsx
import {Spinner, Banner, FormControl, TextInput, RadioGroup, Radio, BranchName} from '@primer/react'
import {GitBranchIcon} from '@primer/octicons-react'

// …inside the "create a new branch" body:
;<>
  <p className="tmp-mb-3">This will create a new branch with any unpushed changes</p>
  <BranchName>
    <GitBranchIcon size={12} className="v-align-middle" />
    <span>{codespace.exportBranchName}</span>
  </BranchName>
</>
```

**B2. `github-ui` · `packages/commits/components/Commit/header/CommitBranchInfo.tsx`**

Icon **outside** as a sibling, using the **deprecated** `Octicon` wrapper and a
margin utility. A second `mx-1` margin sits on `BranchName` itself.

```tsx
import {GitBranchIcon} from '@primer/octicons-react'
import {BranchName, Link} from '@primer/react'
import {Octicon} from '@primer/react/deprecated'

// container:
;<div className={clsx(className, 'd-flex flex-items-center flex-wrap fgColor-muted gap-1')}>
  <Octicon className="mr-1" icon={GitBranchIcon} />
  {/* …maps over branches… */}
</div>

// each branch:
function BranchFragment({branch, repo}: {branch: BranchInfo; repo: RepositoryNWO}) {
  const branchName = branch.branch
  return (
    <>
      <BranchName className="mx-1" href={comparePath({repo, head: branchName})}>
        {branch.branch}
      </BranchName>
      {/* …PR links… */}
    </>
  )
}
```

**B3. `github-ui` · `packages/pull-requests/components/StackOverlay.tsx`**

Icon **outside** as a sibling, different color utility (`fgColor-muted`), no
explicit sizing. (Same file also renders `BranchName` with no icon for the
stacked PR rows.)

```tsx
import {BranchName, NavList} from '@primer/react'
import {PlusIcon, GitBranchIcon} from '@primer/octicons-react'

// no-icon usage (inside a NavList.Item):
<span className={styles.prBranch}>
  <BranchName as="span" className={styles.prBranchName}>
    {stackedPR.headBranch}
  </BranchName>
</span>

// base-branch usage (icon as a sibling before it):
<li className={styles.branchItem}>
  <span className={styles.branchItemContent}>
    <GitBranchIcon className="fgColor-muted" />
    <BranchName as="span">{baseBranchText}</BranchName>
  </span>
</li>
```

**B4. `github-ui` · `packages/repos-rules/components/RefPill.tsx`**

Icon **inside**, but wrapped in `Truncate` + extra `<span>`s, and the icon is
chosen by a helper that swaps **branch vs tag** (`GitBranchIcon` / `TagIcon`).
Icon visibility is itself a prop (`showIcon`).

```tsx
import type {FC} from 'react'
import {BranchName, Label, Truncate} from '@primer/react'
import {GitBranchIcon, TagIcon} from '@primer/octicons-react'
import {unqualifyRef, mapRefType} from '@github-ui/ref-utils'
import styles from './RefPill.module.css'

const RefIcon: FC<{target: string}> = ({target}) => {
  const refType = mapRefType(target)
  if (refType === 'tag') {
    return <TagIcon className={styles.RefPillOcticon} />
  }
  if (refType === 'branch') {
    return <GitBranchIcon className={styles.RefPillOcticon} />
  }
  return null
}

export const RefPill: FC<RefPillProps> = ({param, displayAsLabel = false, showIcon, showQualifiedRef}) => {
  if (displayAsLabel) {
    return <Label variant="secondary">{param}</Label>
  }
  if (showQualifiedRef) {
    return (
      <BranchName as="span">
        <Truncate title={param} className={styles.RefPillTruncate}>
          <span className={styles.RefPillText}>
            {showIcon ? <RefIcon target={param} /> : null}
            {param}
          </span>
        </Truncate>
      </BranchName>
    )
  }
  return (
    <BranchName as="span">
      <Truncate title={unqualifyRef(param) || ''} className={styles.RefPillTruncate}>
        <span className={styles.RefPillText}>
          {showIcon ? <RefIcon target={param} /> : null}
          {unqualifyRef(param)}
        </span>
      </Truncate>
    </BranchName>
  )
}
```

**B5. `github-ui` · `packages/license-compliance-alerts/components/timeline/events/AppearedInBranchEvent.tsx`**

No leading icon **inside** `BranchName` at all — the `GitBranchIcon` belongs to
the surrounding timeline row (`icon={<GitBranchIcon size={16} />}`), so the
branch name renders bare. Shows that "icon + branch name" is often a layout
concern owned by the parent, not `BranchName`.

```tsx
import {GitBranchIcon} from '@primer/octicons-react'
import {BranchName} from '@primer/react'
import {TimelineEventWithoutActor, parseEventBody, PullRequestLink} from './shared'

export function AppearedInBranchEvent({event}: AppearedInBranchEventProps) {
  const branchInfo = parseEventBody<AppearedInBranchEventBody>(event.eventBody)

  const prLink =
    branchInfo?.pull_request_number != null && branchInfo?.pull_request_title ? (
      <PullRequestLink number={branchInfo.pull_request_number} title={branchInfo.pull_request_title} />
    ) : undefined

  return (
    <TimelineEventWithoutActor
      event={event}
      icon={<GitBranchIcon size={16} />}
      actionText="Appeared in branch"
      data-testid="timeline-event-appeared-in-branch"
      belowContent={prLink}
    >
      {branchInfo?.branch_name && (
        <BranchName href={`../../tree/${branchInfo.branch_name}`}>{branchInfo.branch_name}</BranchName>
      )}
    </TimelineEventWithoutActor>
  )
}
```

### C. The Primer `WithBranchIcon` story (the "wild" one)

For reference, this is how Primer's own story demonstrates a leading icon today —
`Stack` + `Octicon`, which **none** of the github-ui consumers actually copy:

```tsx
export const WithBranchIcon = () => (
  <BranchName href="#">
    <Stack direction="horizontal" gap="condensed" align="center">
      <Octicon icon={GitBranchIcon} />
      branch_name
    </Stack>
  </BranchName>
)
```

### Summary table

| Example                       | Icon?               | Placement        | Sizing             | Alignment          | Notes                       |
| ----------------------------- | ------------------- | ---------------- | ------------------ | ------------------ | --------------------------- |
| ExportCodespaceDialog         | yes                 | inside           | `size={12}`        | `v-align-middle`   | manual `<span>`             |
| CommitBranchInfo              | yes                 | sibling (before) | default            | `mr-1` + `mx-1`    | deprecated `Octicon`        |
| StackOverlay                  | yes                 | sibling (before) | default            | flex container     | also has no-icon usage      |
| RefPill                       | yes                 | inside           | CSS class          | `Truncate` + spans | branch/tag swap, `showIcon` |
| AppearedInBranchEvent         | no (parent owns it) | —                | `size={16}` on row | —                  | icon is the timeline row's  |
| Primer `WithBranchIcon` story | yes                 | inside           | default            | `Stack`            | not used by any consumer    |
