---
'@primer/react': patch
---

Banner: Improve button layout wrapping behavior with CSS container queries

- Banners with titles now always wrap action buttons for better readability
- Banners with dismiss buttons always wrap action buttons regardless of content
- Banners without titles or dismiss buttons use container queries for responsive wrapping based on content length