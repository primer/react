# ADR 009: Use Interaction testing in storybook to maintain components

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

Our testing infrastructure consists of Jest "unit" tests and automatic Chromatic visual testing. Both of these are super useful but we have been experiencing a few setbacks.
Unofficially we test more complex interactive scenarios using our storybooks setup.

1. Repeated markup in storybooks and jest tests - Since there is not automation of interaction in storybooks, we tend to test them out manually in stories and then transfer to jest. This results in us constructing similar test case scenarios in storybooks and in tests.

2. Debugging complex jest tests - There is no visual aspect to jest tests. Mostly everything is CLI based. This makes it hard to debug broken tests. Visibility into these tests is also low for people who want to enhance them.

## Prior work and Alternatives

Before settling on this solution, we experimented with a couple of different alternatives.

1. Cypress - Writing tests using cypress e2e testing infrastructure, on the surface is pretty straightforward. Easy debugging and CI support come along with it. However, we found that cypress tends to create flaky tests because of how often the wait function needs to be used. Cypress is also not multi browser friendly. So we decided to try Playwright.
2. Playwright - This is perhaps the best way for e2e tests in the industry right now. Other github products already use it. It ticks all of the boxes that cypress lacks in.

However, we do not yet have a single e2e environment to run these tests. We'd have to create a kitchen sink app and write tests for it. Or we'd need to run these tests on storybook. The latter is a pretty common but slightly heavy setup that burdens our existing workflow.
After some peer recommendations, we found Storybook play functions to be a good middle ground. These tests tack on nicely to existing infrastructure and give us a taste of integration testing. We can assess the usage and utility of these tests before committing to Playwright in the future. As primer-react and its usage matures, we can upgrade our testing chops too.

## Decisions

Going forward, we can use [storybook's play functions](https://storybook.js.org/docs/react/writing-stories/play-function) to write interaction tests for our components. Here's a document that describes [how to add and run these tests](../storybook-tests.md).
Guidelines to make this easier -

1. Create a new storybook file for your components and call them "interactions". Inside these files, we can import the stories from "examples" or "fixtures" and tack on play functions to them. This will create duplicate stories but with the added benefit of the tests appearing in the interactions add-on tab. This tab will let you step through your tests step by step, increasing visibility and debuggability.

2. Port complex jest tests onto interactive tests. This is up to developer discretion. My recommendation is to have basic "unit" tests like component existence and axe tests in jest. Anything that can benefit from a visual aspect to it can be moved to interaction tests.

3. Interaction tests are not perfect. Some aspects like mocking can be challenging and we will find solutions to these as when the need arises.
