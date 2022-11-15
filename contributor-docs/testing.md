# Testing

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Strategy](#strategy)
- [Unit Tests](#unit-tests)
  - [Overview](#overview)
  - [What We Test](#what-we-test)
  - [Running Tests](#running-tests)
- [Visual Regression Tests](#visual-regression-tests)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Components](#components)
    - [Visual Regression Testing](#visual-regression-testing)
    - [Accessibility Verification Testing](#accessibility-verification-testing)
- [Interaction Tests](#interaction-tests)
  - [As A Part Of Unit Tests](#as-a-part-of-unit-tests)
  - [Storybook Interaction Tests](#storybook-interaction-tests)
- [Accessibility Tests](#accessibility-tests)
- [Continous Integration](#continous-integration)
- [FAQ](#faq)
  - [Why am I seeing `browserType.launch: Executable doesn't exist at ../path`?](#why-am-i-seeing-browsertypelaunch-executable-doesnt-exist-at-path)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Strategy

Strategy

## Unit Tests

### Overview

We use [Jest](https://jestjs.io/) as our test runner to write and run our unit tests. Our prefered way of structuring tests is with `describe/it` block format and they are authored within the components's source directory with the file name of `componentName.test.tsx`

We predominantly use [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)'s testing helpers such as

- [render](https://testing-library.com/docs/react-testing-library/api#render) to render components
- [userEvent](https://testing-library.com/docs/user-event/intro/) or [Event API](https://testing-library.com/docs/dom-testing-library/api-events/) to fire events and simulate user interaction on the component\*
- `screen`
- `act`

To make assertions about the elements we use [Jest](https://jestjs.io/) and [jest-dom](https://github.com/testing-library/jest-dom).

\*: You can read about the differences between `fireEvent` and `UserEvent` [here](https://testing-library.com/docs/user-event/intro/#differences-from-fireevent).

###What We Test

We try to achieve high coverage on unit tests and make sure to test components' API such as their props, events and callback functions.

We also have extra set of functions to test common functionalities of components. They are

- BehavesAsComponent
- checkExports
- checkStoriesForAxeViolations

We make sure that every component has [these fundamental unit tests](https://github.com/primer/react/blob/main/src/utils/testing.tsx).

###Running Unit Tests

| Task                | Command                  |
| :------------------ | :----------------------- |
| Run unit tests      | `npm test`               |
| Run a specific test | `npm test ComponentName` |
| Debug unit tests    | `npm run test:watch`     |
| Update snapshots    | `npm run test:update`    |
| Unit test coverage  | `npm run test:coverage`  |

##Interaction Tests

### As A Part Of Unit Tests

We write our unit tests from a user perspective rather than focusing on implementation details. Simulating events to test user interations is a core part of our testing practise.

We write user interaction tests leveraging [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)’s [userEvent](<[userEvent](https://testing-library.com/docs/user-event/intro/)>) testing helper.

### Storybook Tests

We use [Storybook interactions tests](https://storybook.js.org/docs/react/writing-tests/interaction-testing) to our testing practises. They are particularly useful for cases where writing unit tests are not practical due the limitation of the mock browser functionalities of JSDOM. For example testing out a component's overflow behaviour whose responsiveness is managed by its own dynamic width.

Storybook tests are authored within the components's source directory with the file name of `interactions.stories.tsx`

##Visual Regression Tests

###Overview

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

### Prerequisites

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

### Components

#### Visual Regression Testing

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

#### Accessibility Verification Testing

We use [axe](https://www.deque.com/axe/) to run automated accessibility
checks against our components. In order to run these checks, you will need to first run Storybook by
running `npm start` or by directly running: `STORYBOOK=true npx start-storybook -p 6006`.

After starting storybook, you can run all of the Accessibility Verification
Tests with
the following command:

```bash
script/test:e2e --grep @avt
```

## Accessibility Tests

To be written in the collaboration with Eric Bailey.

## Continous Integration

All the tests are ran on our continous integration workflows.

Unit tests are included in the `test` job, Playwright tests are included in the `avt` and `vrt` jobs of the `CI` workflow.

Storybook tests are ran in `Storybook Tests` workflow.

The results of the Playwright test run are uploaded at the end of the job and are available
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
