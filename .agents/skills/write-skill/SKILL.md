---
name: write-skill
description: Use when creating, updating, or reviewing agent skills
---

# Write Skill

- Use this skill when creating, updating, or reviewing skill files
- When authoring a skill, include in its description when it should and should not be used
- Keep agent skills short and concise
- Keep skill prose under 200 lines, excluding reference tables; move additional guidance into references
- Use a `references` sub-folder in a skill when it becomes too long or needs to link out to different topics
- Links to references must be kept up-to-date as files are created, updated, or removed
- References must include a table of contents as the first section
- Each entry in the table of contents should include the section heading's line number in the reference file so agents can make targeted reads
- After creating or editing a reference, update its table of contents and verify every entry's line number against the section heading in the final formatted file
- If using a references folder, `SKILL.md` must include:
  - A references section
  - A table in this section that provides a name/link to the reference and a description for when to use it
- Use the references table to select files relevant to the current task; do not load all references by default
- Read each selected reference's table of contents first, then use its line numbers to read only the relevant sections
- Read additional sections or linked references only when needed to complete the task
- If line numbers are stale, locate the section by its heading
- Avoid duplicating information across references, instead consolidate or extract out information
- Always report contradictions in references and recommend a resolution. Obtain permission before modifying files to resolve them
- Write descriptions that identify the specific tasks that should trigger the skill. Avoid broad wording that causes it to load for unrelated work

## Examples

### SKILL.md

```md
---
name: skill-name
description: Information about the skill, when to use it, and how to use it
---

# Skill name

<!-- An overview of the skill -->

## References

| Name | Description |
| :--- | :---------- |
| [Reference](./references/reference.md) | A brief description of the reference and when to use it |
```

### .agents/skills/<skill>/references/<reference>.md

```md
# Reference

Brief overview of the reference

## Table of Contents

- [Example](#example), L:11

<!-- ... -->

## Example
```
