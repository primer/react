# ADR 008: Use Interaction testing in storybook to maintain components

## Status

Draft

## Context

Our testing infrastructure consists of Jest "unit" tests and automatic Chromatic visual testing. Both of these are super useful but we have been experiencing a few setbacks.
Unofficially we test more complex interactive scenarios using our storybooks setup.

1. Repeated markup in storybooks and jest tests - Since there is not automation of interaction in storybooks, we tend to test them out manually in stories and then transfer to jest. This results in us constructing similar test case scenarios in storybooks and in tests.

2. Debugging complex jest tests - There is no visual aspect to jest tests. Mostly everything is CLI based. This makes it hard to debug broken tests. Visibility into these tests is also low for people who want to enhance them.

## Decisions

Going forward, we can use [storybook's play functions](https://storybook.js.org/docs/react/writing-stories/play-function) to write interactive tests for our components. Here's a document that describes h[ow to add and run these tests](../storybook-tests.md).
Guidelines to make this easier -

1. Create a new storybook file for your components and call them "interactions". Inside these files, we can import the stories from "examples" or "fixtures" and tack on play functions to them. This will create duplicate stories but with the added benefit of the tests appearing in the interactions add-on tab. This tab will let you step through your tests step by step, increasing visibility and debuggability.

2. Port complex jest tests onto interactive tests. This is up to developer discretion. My recommendation is to have basic "unit" tests like component existence and axe tests in jest. Anything that can benefit from a visual aspect to it can be moved to interaction tests.

3. Interaction tests are not perfect. Some aspects like mocking can be challenging and we will find solutions to these as when the need arises.
