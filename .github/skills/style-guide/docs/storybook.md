# Storybook

Use these guidelines when authoring storybook stories.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

Storybook stories live alongside the component they are documenting:

- `packages/react/src/Banner/Banner.tsx`
- `packages/react/src/Banner/Banner.stories.tsx`
- `packages/react/src/Banner/Banner.features.stories.tsx`

The `*.stories.tsx` file should contain two stories:

- A `Default` story rendering the default case for the component
- A `Playground` story rendering a playground for the component, allowing users to interact with the component and change its props

When additional functionality needs to be documented, a `*.features.stories.tsx` file should be created. This file should contain stories for each feature of the component, demonstrating how to use the feature and any relevant props. Feature stories must be written in a way that allows for individuals to easily copy and paste the snippets into their own project. As a result, avoid abstractions that inhibit this workflow.
