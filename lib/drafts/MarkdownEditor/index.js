'use strict';

var MarkdownEditor$2 = require('./MarkdownEditor.js');
var Toolbar = require('./Toolbar.js');
var Actions = require('./Actions.js');
var Label = require('./Label.js');

const MarkdownEditor = Object.assign(MarkdownEditor$2["default"], {
  /** REQUIRED: An accessible label for the editor. */
  Label: Label.Label,

  /**
   * An optional custom toolbar. The toolbar should contain `ToolbarButton`s before
   * and/or after a `DefaultToolbarButtons` instance. To create groups of buttons, wrap
   * them in an unstyled `Box`.
   */
  Toolbar: Toolbar.Toolbar,

  /**
   * A custom toolbar button. This takes `IconButton` props. Every toolbar button should
   * have an `aria-label` defined.
   */
  ToolbarButton: Toolbar.ToolbarButton,

  /**
   * The full set of default toolbar buttons. This is all the basic formatting tools in a
   * standardized order.
   */
  DefaultToolbarButtons: Toolbar.DefaultToolbarButtons,

  /**
   * Optionally define a set of custom buttons to show in the editor footer. Often if you
   * are defining custom buttons you should also wrap the editor in a `<form>`. This
   * component should only contain `ActionButton`s.
   */
  Actions: Actions.Actions,

  /** A button to show in the editor footer. */
  ActionButton: Actions.ActionButton
});
var MarkdownEditor$1 = MarkdownEditor;

module.exports = MarkdownEditor$1;
