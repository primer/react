# Managing focus

Use these guidelines when authoring components that manage focus.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Guidelines

### Prefer managing focus through event handlers instead of effects

When managing focus within a component, prefer focusing elements within event
handlers as opposed to effects. This helps to ensure that focus is only being
moved as a result of a user interaction. When focus is managed in an effect,
there is a risk that focus will be moved due to an unrelated dependency in the
effect dependency array being updated.
