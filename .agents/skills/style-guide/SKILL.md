---
name: style-guide
description: 'Use when: authoring, modifying, or reviewing Primer React components, hooks, utilities, or component APIs.'
---

# Primer React Style Guide

Use this skill when creating, modifying, or reviewing Primer React components,
hooks, utilities, or component APIs.

Before authoring component code, read `contributor-docs/style.md` and apply the
guidelines that are relevant to the change. The style guide is the source of
truth for component API design and implementation conventions in this
repository.

When proposing, implementing, or reviewing a component change, explicitly apply
the relevant style-guide principles to the design. If a change intentionally
deviates from the style guide, call out the reason.

In addition, there are a set of topics below that may be used for guidance on a
specific topic. Consult this to see if any apply to the task at hand.

| Topic                 | Description                                                                       | Link                                                     |
| :-------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------- |
| Component prop naming | Use when deciding or evaluating the name for a prop in a React component.         | [component-prop-naming](./docs/component-prop-naming.md) |
| Component prop types  | Use when designing or reviewing component prop types, including slot-based props. | [component-prop-types](./docs/component-prop-types.md)   |

## Updating this skill

Keep `SKILL.md` minimal: usage instructions and a table linking to topics.
When adding or updating guidance, edit the relevant topic under `docs/`.
If no existing topic fits, create a new topic file under `docs/` and add a row
to the table with a link and a description of when to consult it. Keep detailed
guidance and examples in topic files rather than in `SKILL.md`.
