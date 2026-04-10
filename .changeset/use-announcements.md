---
'@primer/react': patch
---

Debounce list update announcements in `useAnnouncements` to prevent race conditions during rapid filtering. This ensures screen readers don't overwhelm users with intermediate states during fast typing.
