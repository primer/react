import {addons} from "@storybook/addons"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    // Some stories may set up keyboard event handlers, which can can be interfered
    // with by these keyboard shortcuts.
    enableShortcuts: false
  }
}
