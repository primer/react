---
'@primer/react': patch
---

- adds [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) style to inputs so they get the correct user-agent dark/light styles
- crops ToggleSwitch knob's shadow inside the toggle switch boundaries
- changes FormControl styles to prevent `<select>`, `<textarea>`, `<input>` from filling the parent's width when the `block` prop has not been passed to the input component
