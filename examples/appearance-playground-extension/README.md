# Primer Appearance Playground for Chrome

Experimental, unpacked Manifest V3 extension for desktop Chrome 123+ and compatible
Chromium browsers. It brings the
playground's 20 themes, five density levels, five Seriousness presets and a
CSS-variable editor to an existing Primer website. No app changes are required.

## Install and try

1. Open `chrome://extensions` and enable **Developer mode**.
2. Choose **Load unpacked** and select this directory, containing `manifest.json`.
3. Pin **Primer Appearance Playground** in Chrome's Extensions menu.
4. Open a Primer page and click the extension icon. An on-page sidebar appears at the right;
   enable **Preview on this tab** there.
5. Try a theme, Density or Seriousness. **Reset page** removes this extension's styles.

Start with the existing Storybook page at
`http://localhost:6006/iframe.html?id=design-tools-noodles-page--default&viewMode=story`.
Real sites using Primer variables, including authenticated sites you can already
access, can also be previewed. The controls use an isolated extension frame inside
a shadow root, so website themes do not restyle them. No separate browser window
or native side-panel UI is used.

## Behavior

- The sidebar reuses the React playground's **actual palette-grid components and
  styles**, including theme previews, grouping, search and selected states.
  Density and Seriousness live inside the sidebar, above the palettes.
- Presets come from the **same token engine** as the React playground, not a second
  implementation. Merge order is Density → Theme → Seriousness → custom overrides.
- Seriousness recommends Spacious at Friendly social and Compact at Bank security.
  Changing Density afterward overrides that recommendation. Theme changes retain
  Density and Seriousness. Bank security is a visual style, not a security feature.
- Preview can be paused without losing choices. Reset clears choices and removes
  the exact injected stylesheet; it never replaces the site's own inline styles.
- Each tab has independent settings. A full reload or navigation to a new document
  clears the preview. Same-document SPA navigation retains it. Settings survive
  closing/reopening the controls and service-worker restarts, not browser restarts.
- Controls stay docked to the right edge, fill the viewport height and affect only that tab.
  Click the extension icon again or **Close** to dismiss them without removing
  the preview. Another tab gets its own independent controls. A full reload
  removes the controls; click the icon again to reopen them.
- Variable inspection reads computed CSS custom properties from the document,
  body and up to 20 component roots, capped at 1,000 variables. Refresh after
  opening a menu/dialog to discover additional component variables.
- The editor accepts a single CSS value, including `var()` and `calc()`. Resources,
  CSS declarations, escapes and executable CSS functions are intentionally rejected.
  Up to 150 custom overrides are supported.

## Permissions and privacy

`activeTab` grants temporary access when you click the extension. There are **no
host permissions, automatic content scripts, analytics, remote code or external
services**. `scripting` applies/removes a user-origin stylesheet and mounts the
floating controls without a `sidePanel` permission.
`storage.session` remembers tab settings, activation metadata and the injected CSS.
The inspector reads variable names/values and theme metadata, not report text,
cookies, credentials or form contents. The extension does not alter app data.

The controls document and bundled Windows 95 and IBM VGA fonts are exposed as local
extension resources. The Windows 95 font includes its original OFL and MIT notices.
MS DOS uses VileR's IBM VGA font under CC BY-SA-4.0, with its license and attribution
in `assets/ibm-vga/`. This does not grant website access. A site's font CSP can still
require a system-font fallback. Other presets use installed fonts.

## Demo limitations

This works best with variable-based Primer React/CSS. Hard-coded styles, older
styled-components themes, JavaScript-selected assets and custom layouts can remain
unchanged. It does not notify React theme contexts or change a site's theme setting.
Styles cover the top document and its dynamically added portals, not iframe
documents or shadow roots. GitHub may combine multiple styling systems; results vary.
Chrome pages, the Chrome Web Store and other browser-protected pages cannot be
modified. File URLs need Chrome's separate **Allow access to file URLs** setting.
Cross-origin navigation requires clicking the extension icon again.

Browser-internal pages such as `chrome://extensions`, settings and the new-tab
page cannot host the controls. The extension icon shows **N/A** and its tooltip
explains that a normal website is required. Other activation failures show **ERR**
with details in the icon tooltip and service-worker console. If an older copy logged
`Cannot access a chrome:// URL`, reload the unpacked extension in the browser's
extensions manager; previously recorded errors can be cleared there.

The controls bundle React and the shared Primer components locally. Installation
still needs no dependencies or server. Bundled dependency licenses are in
`assets/ui-LICENSES.txt`. This is a demo, not a supported Primer package or a store release.

## Refresh the bundled presets

The checked-in folder is ready to load: no install, app build or server is needed.
After changing the React playground presets, run from the repository root with its
supported Node version:

```sh
node examples/appearance-playground-extension/refresh-presets.mjs
```

This exports data from `packages/react/src/AppearancePlayground/AppearancePlayground.tokens.ts`,
copies the licensed Windows 95 and IBM VGA fonts/notices, and bundles only the
extension UI with the repository's existing esbuild installation. The UI source
is `panel.tsx` and `panel.source.css`; `panel.js`, `panel.css` and `assets/ui/` are generated.
It does not build repository packages, run tests or install dependencies.
