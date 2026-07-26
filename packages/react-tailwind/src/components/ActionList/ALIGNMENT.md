# Alignment

## From: `@primer/react`

Legacy ActionList is a broad compound list surface with groups, headings, visuals, descriptions, dividers, link items, selection variants, trailing actions, and older loading, inactive, and CSS-module-only visual variants.

## To: `@primer/react-tailwind`

The stable compound API provides `Root`, `Item`, `LinkItem`, `Group`, `GroupHeading`, `Description`, and `TrailingAction`. It preserves disabled, inactive, loading, selected, active, size, description, divider, group, link, and visual composition.

A trailing action is a sibling of the primary item action, so the markup never nests interactive controls. Menu selection follows Primer's checkmark convention rather than a filled item background.

## Migration notes

- Use `loading` with `loadingText` for an unavailable item that is waiting on work. Loading items expose disabled semantics, render a shared spinner, and suppress trailing actions until ready.
- Use `inactiveText` for supporting inactive status text, not a legacy inactive prop.
- Multiple `Description` children are preserved in author order instead of being collapsed by the legacy slot extractor. Use one description when strict legacy rendering is required.
- Use `size="large"` for the supported spacious item geometry and `GroupHeading variant="filled"` for a separated heading surface.
- Item content inherits its colour from the item, so `variant="danger"` and inactive items tint their label, descriptions, and visuals together. The inactive warning keeps the attention colour. Custom item content that sets its own text colour will override this.
- CSS-module-only variants remain unsupported.
- Use `className` rather than `sx` or styled-system props.
