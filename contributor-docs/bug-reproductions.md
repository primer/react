# Bug reproductions

The `reproduce-bug` agentic workflow runs when an issue is opened with the `bug`
label or that label is applied later. It is open to community bug reports, but
only investigates public browser behavior that can run without credentials or
backend services.

The starter lives in `examples/stackblitz`. To run it locally:

```sh
npm run dev -w stackblitz -- --host 127.0.0.1
```

To submit a modified example through StackBlitz's
[HTML form POST interface](https://developer.stackblitz.com/platform/api/post-api):

```sh
node script/create-stackblitz-reproduction.ts examples/stackblitz /tmp/reproduction.html
```

Open the generated HTML in a browser and select **Open in StackBlitz**. The form
includes only the starter's package manifest, HTML, TypeScript configuration,
Vite configuration, entry point, and `App.tsx`. Keep reproduction code in these
files; additional files are not included. No StackBlitz SDK, API credentials,
or repository upload is required. Only submit public, independently authored
code. The `node` template runs Vite in a WebContainer.

The workflow checks the reported symptom and a one-variable control in the
actual StackBlitz preview, then submits the original form in a fresh session.
Inaccessible previews, unsupported browsers, and inconclusive investigations
produce no issue comment; the limitation is recorded in the run summary.

StackBlitz's dynamically generated projects are
[not persisted without an account](https://developer.stackblitz.com/platform/api/javascript-sdk#generate-and-embed-new-projects).
After verification, a trusted safe-output job preserves the six reproduction
files on an isolated `reproductions/bug-ISSUE-RUN` branch. The comment links to
StackBlitz's GitHub import of that immutable commit, not a temporary editor URL.
The investigation still submits files through HTML forms; no StackBlitz API or
account is used. The generated `reproduction.json` transfers the exact files
and optional screenshot to the publication job.

A verified comment includes versions, reproduction steps, observed behavior,
and evidence for the root cause or triggering condition. If the issue and its
comments do not already include media, a screenshot of a visible failure is
published with the reproduction commit and embedded in the
comment. These public assets persist beyond Actions artifact retention.
Existing reproduction comments prevent duplicate publication.

Maintainers must configure Copilot inference for agentic workflows before use.
The agent has read-only GitHub scopes; a separate safe-output job publishes the
source, single comment, and optional PNG. It enforces file and size limits,
pinned runtime versions, issue state, duplicate detection, and staged mode.
The workflow never fixes code or signs into
StackBlitz. WebContainers must work under the runner's browser and network
policy; the workflow must not relax isolation to bypass a startup failure.
