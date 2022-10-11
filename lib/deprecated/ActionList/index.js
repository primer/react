'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var List = require('./List.js');
var Group = require('./Group.js');
var Item = require('./Item.js');
var Divider = require('./Divider.js');

/**
 * @deprecated Use ActionList with composable API instead. See https://primer.style/react/ActionList for more details.
 */
const ActionList = Object.assign(List.List, {
  /** Collects related `Items` in an `ActionList`. */
  Group: Group.Group,

  /** An actionable or selectable `Item` with an optional icon and description. */
  Item: Item.Item,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider: Divider.Divider
});

exports.ActionList = ActionList;
