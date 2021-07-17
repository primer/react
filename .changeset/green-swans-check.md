---
'@primer/components': major
---

Adds typings for theme in styled and sx contexts

BREAKING_CHANGE:

WHAT Adds typings for theme in styled and sx contexts

WHY To help consumers effectively understand and use the theme in components extending the base components using styled and sx

HOW to update? If your extensions are properly using the theme everything should just work, however if you're accidentally accessing a property on a theme that isn't defined you may receive errors and need to adjust your usage of the theme
