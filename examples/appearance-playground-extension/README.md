# Primer Appearance Playground for Chrome

Experimental, unpacked Manifest V3 extension for desktop Chrome 123+. It brings the
playground's 19 themes, five density levels, five Seriousness presets and a
CSS-variable editor to an existing Primer website. No app changes are required.

## Install and try

1. Open `chrome://extensions` and enable **Developer mode**.
2. Choose **Load unpacked** and select this directory, containing `manifest.json`.
3. Pin **Primer Appearance Playground** in Chrome's Extensions menu.
4. Open a Primer page, click the extension icon and enable **Preview on this tab**.
5. Try a theme, Density or Seriousness. **Reset page** removes this extension's styles.

Start with the existing Storybook page at
`http://localhost:6006/iframe.html?id=design-tools-noodles-page--default&viewMode=story`.
Real sites using Primer variables, including authenticated sites you can already
access, can also be previewed. Chrome's side panel does not inherit website themes.

## Behavior

- Presets come from the **same token engine** as the React playground, not a second
  implementation. Merge order is Density → Theme → Seriousness → custom overrides.
- Seriousness recommends Spacious at Friendly social and Compact at Bank security.
  Changing Density afterward overrides that recommendation. Theme changes retain
  Density and Seriousness. Bank security is a visual style, not a security feature.
- Preview can be paused without losing choices. Reset clears choices and removes
  the exact injected stylesheet; it never replaces the site's own inline styles.
- Each tab has independent settings. A full reload or navigation to a new document
  clears the preview. Same-document SPA navigation retains it. Settings survive
  closing/reopening the panel and service-worker restarts, not browser restarts.
- Variable inspection reads computed CSS custom properties from the document,
  body and up to 20 component roots, capped at 1,000 variables. Refresh after
  opening a menu/dialog to discover additional component variables.
- The editor accepts a single CSS value, including `var()` and `calc()`. Resources,
  CSS declarations, escapes and executable CSS functions are intentionally rejected.
  Up to 150 custom overrides are supported.

## Permissions and privacy

`activeTab` grants temporary access when you click the extension. There are **no
host permissions, automatic content scripts, analytics, remote code or external
services**. `scripting` applies/removes a user-origin stylesheet, `sidePanel` hosts
the UI, and `storage.session` remembers only tab settings and the injected CSS.
The inspector reads variable names/values and theme metadata, not report text,
cookies, credentials or form contents. The extension does not alter app data.

The bundled Windows 95 font is exposed as a local extension resource, with its
original OFL and MIT notices. This does not grant website access. A site's font
CSP can still require a system-font fallback. Other presets use installed fonts.

## Demo limitations

This works best with variable-based Primer React/CSS. Hard-coded styles, older
styled-components themes, JavaScript-selected assets and custom layouts can remain
unchanged. It does not notify React theme contexts or change a site's theme setting.
Styles cover the top document and its dynamically added portals, not iframe
documents or shadow roots. GitHub may combine multiple styling systems; results vary.
Chrome pages, the Chrome Web Store and other browser-protected pages cannot be
modified. File URLs need Chrome's separate **Allow access to file URLs** setting.
Cross-origin navigation requires clicking the extension icon again.

The controls use native HTML rather than bundling React, keeping installation
dependency-free. This is a demo, not a supported Primer package or a store release.

## Refresh the bundled presets

The checked-in folder is ready to load: no install, app build or server is needed.
After changing the React playground presets, run from the repository root with its
supported Node version:

```sh
node examples/appearance-playground-extension/refresh-presets.mjs
```

This exports data from `packages/react/src/AppearancePlayground/AppearancePlayground.tokens.ts`
and copies the existing licensed Windows 95 font/notices. It does not build the
repository, run tests or install dependencies.
