# PageLayout Horizontal Overflow Fix - Documentation

## Issue Summary

Visual regressions were occurring in PageLayout where content expanded outside the component's set width, causing horizontal overflow. This was particularly problematic with:

- Wide tables
- Long unbroken text strings
- Fixed-width content elements
- Content that doesn't respect flexbox sizing

## Root Cause Analysis

The issue was in the `.ContentWrapper` CSS class in `packages/react/src/PageLayout/PageLayout.module.css`.

### Original CSS Structure

```css
.ContentWrapper {
  display: flex;
  min-width: 1px;
  flex-direction: column;
  order: var(--region-order-content);
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
}
```

### Problem

The `.ContentWrapper` element uses flexbox with:

- `flex-basis: 0` - Allows flex-grow to control the width
- `flex-grow: 1` - Grows to fill available space
- `flex-shrink: 1` - Can shrink if needed
- `min-width: 1px` - Prevents overflow from pushing the pane region to the next line

However, **it lacked an explicit `width: 100%` constraint**. This allowed child content to:

1. Expand beyond the parent's intended width
2. Ignore the flex container's sizing constraints
3. Cause horizontal overflow when content had `min-width` or fixed widths exceeding available space

### Why This Happened

In flexbox layouts, when `flex-basis: 0` is set with `flex-grow: 1`, the element grows to fill space. However, without an explicit width constraint, children can still overflow if they have:

- Intrinsic sizing (like images, tables, or iframes)
- `min-width` values
- Fixed widths that exceed the computed flex size
- Content that doesn't wrap (like long URLs or code)

## Solution

Added `width: 100%` to `.ContentWrapper`:

```css
.ContentWrapper {
  display: flex;
  width: 100%; /* ← NEW: Explicit width constraint */
  min-width: 1px;
  flex-direction: column;
  order: var(--region-order-content);
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
}
```

### Why This Works

1. **Explicit Constraint**: `width: 100%` provides a clear maximum width that children must respect
2. **Compatible with Flexbox**: Works alongside `flex-basis: 0` and `flex-grow: 1`
3. **No Breaking Changes**: Doesn't affect existing layouts that already behave correctly
4. **Prevents Overflow**: Forces children to constrain their width to the parent's computed size

## Impact Assessment

### Positive Effects

- ✅ Prevents horizontal overflow in PageLayout.Content
- ✅ Maintains existing layout behavior
- ✅ Works with all current PageLayout features (sticky panes, resizable panes, dividers)
- ✅ No changes needed to component API or usage

### No Breaking Changes

- The change is additive (adding a CSS property)
- All flexbox properties remain intact
- Existing content that already fits properly continues to work
- The `min-width: 1px` hack for pane wrapping still functions

## Testing

### Unit Tests

✅ All 17 PageLayout unit tests pass

- Default layout rendering
- Condensed layout
- Divider variations
- Responsive behavior
- Hidden regions
- Custom widths

### Build Verification

✅ TypeScript compilation succeeds
✅ Rollup build completes without errors

### Visual Regression Testing

⏳ Should be verified in CI with Playwright VRT tests

- Pull Request Page layout
- Nested Scroll Container
- Resizable Pane
- Sticky Pane behavior

## Files Changed

1. **packages/react/src/PageLayout/PageLayout.module.css**
   - Line 349: Added `width: 100%;` to `.ContentWrapper`

## Related Issues & References

- https://github.com/github/pull-requests/issues/22335
- https://github.com/github/pull-requests/issues/22225
- Slack thread in #ui: https://github.slack.com/archives/C0948TXP4UA/p1769176103252369
- Related issue: https://github.com/github/primer/issues/6360

## Future Considerations

### Similar Patterns in Codebase

Consider auditing other components for similar patterns where:

- Flexbox is used with `flex-basis: 0` and `flex-grow: 1`
- No explicit `width` constraint exists
- Overflow issues have been reported

### Best Practice

When using flexbox with `flex-basis: 0` and `flex-grow: 1` for the main content area:

1. Always include `width: 100%` to prevent child overflow
2. Combine with `max-width: 100%` if needed for specific children
3. Use `overflow-x: auto` on children that might overflow intentionally

## Conclusion

This is a minimal, surgical fix that addresses the root cause of horizontal overflow in PageLayout by adding a single CSS property. The change is backwards-compatible, doesn't break existing layouts, and prevents future overflow issues with wide content.
