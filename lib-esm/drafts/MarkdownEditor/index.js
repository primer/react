import _MarkdownEditor from './MarkdownEditor.js';
import { Toolbar, ToolbarButton, DefaultToolbarButtons } from './Toolbar.js';
import { Actions, ActionButton } from './Actions.js';
import { Label } from './Label.js';

const MarkdownEditor = Object.assign(_MarkdownEditor, {
  /** REQUIRED: An accessible label for the editor. */
  Label,

  /**
   * An optional custom toolbar. The toolbar should contain `ToolbarButton`s before
   * and/or after a `DefaultToolbarButtons` instance. To create groups of buttons, wrap
   * them in an unstyled `Box`.
   */
  Toolbar,

  /**
   * A custom toolbar button. This takes `IconButton` props. Every toolbar button should
   * have an `aria-label` defined.
   */
  ToolbarButton,

  /**
   * The full set of default toolbar buttons. This is all the basic formatting tools in a
   * standardized order.
   */
  DefaultToolbarButtons,

  /**
   * Optionally define a set of custom buttons to show in the editor footer. Often if you
   * are defining custom buttons you should also wrap the editor in a `<form>`. This
   * component should only contain `ActionButton`s.
   */
  Actions,

  /** A button to show in the editor footer. */
  ActionButton
});
var MarkdownEditor$1 = MarkdownEditor;

export { MarkdownEditor$1 as default };
