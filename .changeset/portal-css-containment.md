---
"@primer/react": minor
---

Added `primer_react_css_contain_portal` feature flag that applies CSS containment (`contain: layout style`) to Portal elements when enabled. This can improve rendering performance by isolating layout and style calculations within portals without clipping overflow content.
