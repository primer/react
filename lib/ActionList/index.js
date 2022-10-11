'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var List = require('./List.js');
var Group = require('./Group.js');
var Item = require('./Item.js');
var LinkItem = require('./LinkItem.js');
var Divider = require('./Divider.js');
var Description = require('./Description.js');
var Visuals = require('./Visuals.js');

/**
 * Collection of list-related components.
 */
const ActionList = Object.assign(List.List, {
  /** Collects related `Items` in an `ActionList`. */
  Group: Group.Group,

  /** An actionable or selectable `Item` */
  Item: Item.Item,

  /** A `Item` that renders a full-size anchor inside ListItem */
  LinkItem: LinkItem.LinkItem,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider: Divider.Divider,

  /** Secondary text which provides additional information about an `Item`. */
  Description: Description.Description,

  /** Icon (or similar) positioned before `Item` text. */
  LeadingVisual: Visuals.LeadingVisual,

  /** Icon (or similar) positioned after `Item` text. */
  TrailingVisual: Visuals.TrailingVisual
});

exports.ActionList = ActionList;
