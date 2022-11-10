# Testing

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Components](#components)
  - [Visual Regression Testing](#visual-regression-testing)
  - [Accessibility Verification Testing](#accessibility-verification-testing)
- [Continous Integration](#continous-integration)
- [FAQ](#faq)
  - [Why am I seeing `browserType.launch: Executable doesn't exist at ../path`?](#why-am-i-seeing-browsertypelaunch-executable-doesnt-exist-at-path)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

We use Playwright to run visual regression tests against our components along with automated accessibility checks. These tests are authored within the `e2e` directory and match the file pattern:
`*-test.ts`.

You can run these tests using Playwright locally or you can see the results of
these tests on GitHub through the CI workflow.

To get started locally, make sure to follow the [Prerequisites](#prerequisites)
section to setup your machine. If you're looking for a quick overview of the commands
available, check out the table below.

| Task                                                  | Command                                         |
| :---------------------------------------------------- | :---------------------------------------------- |
| Run playwright tests                                  | `scripts/test:e2e`                              |
| Run a specific test                                   | `scripts/test:e2e TestName`                     |
| View the report from a test run                       | `npx playwright show-report .playwright/report` |
| Update snapshots                                      | `scripts/test:e2e --update-snapshots`           |
| Debug playwright tests                                | `npx playwright test --debug`                   |
| Run playwright with browser visible                   | `npx playwright test --headed`                  |
| Run playwright tests that match a specific tag        | `scripts/test:e2e --grep @tag-name`             |
| Run playwright tests that do not match a specific tag | `scripts/test:e2e --grep-invert @tag-name`      |

> **Note**
> The `scripts/test:e2e` file is a helper to run Playwright in an environment
> that mirrors CI. You can optionally run these tests natively on your machine
> using `npx playwright test` if you would like to interact or debug tests.
> However, screenshots will not match and new ones will need to be generated on
> your first test run.

## Prerequisites

To run Playwright locally, first install the dependencies of the project by
running `npm install`. Next, run the following command to install any necessary
Playwright dependencies:

```bash
npx playwright install --with-deps
```

If you would like to run Playwright in a way to mirror our CI environment (this
is particularly helpful if you are updating snapshots) you will need to install
[Docker](https://www.docker.com/) on your machine.

If you're on macOS, feel free to install [Docker
Desktop](https://www.docker.com/products/docker-desktop/) which can help you
quickly get started. Otherwise, follow the instructions for installing Docker on
your specific Operating System.

## Components

### Visual Regression Testing

In order to run Visual Regression Tests, you will need to first run Storybook by
running `npm start` or by directly running: `STORYBOOK=true npx start-storybook -p 6006`.

After starting storybook, you can run all of the Visual Regression Tests with
the following command:

```bash
script/test:e2e --grep @vrt
```

This will run each test within an environment that mirrors what is used in CI.
You can also run Playwright locally by running:

```bash
npx playwright test --grep @vrt
```

However, screenshots will need to be generated locally for your specific
platform on the first test run.

### Accessibility Verification Testing

We use [axe](https://www.deque.com/axe/) to run automated accessibility
checks against our components. In order to run these checks, you will need to first run Storybook by
running `npm start` or by directly running: `STORYBOOK=true npx start-storybook -p 6006`.

After starting storybook, you can run all of the Accessibility Verification
Tests with
the following command:

```bash
script/test:e2e --grep @avt
```

## Continous Integration

Playwright tests are included in the `avt` and `vrt` jobs of the CI workflow.
The results of the test run are uploaded at the end of the job and are available
to download and view locally.

If you notice that `vrt` or `avt` are failing, you can view the report of the
failing run by visiting the CI workflow, clicking into the job that has failed
and downloading the relevant report.

> **Note**
> The `vrt` job is broken up into several runners to speed up how long it takes
> to run Visual Regression Testing. Make sure to identify the job that is
> failing and download the report that matches the number of the runner.

## FAQ

### Why am I seeing `browserType.launch: Executable doesn't exist at ../path`?

The browser executables need to be installed so that playwright can run tests
inside chromium, firefox, etc. They can be installed by running
`npx playwright install --with-deps`
