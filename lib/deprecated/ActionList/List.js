'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Group = require('./Group.js');
var Item = require('./Item.js');
var Divider = require('./Divider.js');
var styled = require('styled-components');
var constants = require('../../constants.js');
var behaviors = require('@primer/behaviors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Asserts that the given value fulfills the `GroupedListProps` contract.
 * @param props A value which fulfills either the `ListPropsBase` or the `GroupedListProps` contract.
 */
function isGroupedListProps(props) {
  return 'groupMetadata' in props;
}
/**
 * Contract for props passed to the `List` component.
 */


const StyledList = styled__default["default"].div.withConfig({
  displayName: "List__StyledList",
  componentId: "sc-hkz3q0-0"
})(["font-size:", ";line-height:20px;&[", "],&:focus-within{--item-hover-bg-override:none;--item-hover-divider-border-color-override:", ";}"], constants.get('fontSizes.1'), behaviors.hasActiveDescendantAttribute, constants.get('colors.border.muted'));
/**
 * Returns `sx` prop values for `List` children matching the given `List` style variation.
 * @param variant `List` style variation.
 */

function useListVariant(variant = 'inset') {
  switch (variant) {
    case 'full':
      return {
        headerStyle: {
          paddingX: constants.get('space.2')
        },
        itemStyle: {
          borderRadius: 0
        }
      };

    default:
      return {
        firstGroupStyle: {
          marginTop: constants.get('space.2')
        },
        lastGroupStyle: {
          marginBottom: constants.get('space.2')
        },
        itemStyle: {
          marginX: constants.get('space.2')
        }
      };
  }
}
/**
 * Lists `Item`s, either grouped or ungrouped, with a `Divider` between each `Group`.
 */


const List = /*#__PURE__*/React__default["default"].forwardRef((props, forwardedRef) => {
  // Get `sx` prop values for `List` children matching the given `List` style variation.
  const {
    firstGroupStyle,
    lastGroupStyle,
    headerStyle,
    itemStyle
  } = useListVariant(props.variant);
  /**
   * Render a `Group` using the first of the following renderers that is defined:
   * A `Group`-level or `List`-level custom `Group` renderer, or
   * the default `Group` renderer.
   */

  const renderGroup = groupProps => {
    var _ref;

    const GroupComponent = ((_ref = 'renderGroup' in groupProps && groupProps.renderGroup) !== null && _ref !== void 0 ? _ref : props.renderGroup) || Group.Group;
    return /*#__PURE__*/React__default["default"].createElement(GroupComponent, _extends({}, groupProps, {
      key: groupProps.groupId
    }));
  };
  /**
   * Render an `Item` using the first of the following renderers that is defined:
   * An `Item`-level, `Group`-level, or `List`-level custom `Item` renderer,
   * or the default `Item` renderer.
   */


  const renderItem = (itemProps, item, itemIndex) => {
    var _ref2, _ref3, _itemProps$id;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const ItemComponent = 'renderItem' in itemProps && itemProps.renderItem || props.renderItem || Item.Item;
    const key = (_ref2 = (_ref3 = 'key' in itemProps ? itemProps.key : undefined) !== null && _ref3 !== void 0 ? _ref3 : (_itemProps$id = itemProps.id) === null || _itemProps$id === void 0 ? void 0 : _itemProps$id.toString()) !== null && _ref2 !== void 0 ? _ref2 : itemIndex.toString();
    return /*#__PURE__*/React__default["default"].createElement(ItemComponent, _extends({
      showDivider: props.showItemDividers,
      selectionVariant: props.selectionVariant
    }, itemProps, {
      key: key,
      sx: { ...itemStyle,
        ...itemProps.sx
      },
      item: item
    }));
  };
  /**
   * An array of `Group`s, each with an associated `Header` and with an array of `Item`s belonging to that `Group`.
   */


  let groups = []; // Collect rendered `Item`s into `Group`s, avoiding excess iteration over the lists of `items` and `groupMetadata`:

  if (!isGroupedListProps(props)) {
    // When no `groupMetadata`s is provided, collect rendered `Item`s into a single anonymous `Group`.
    groups = [{
      items: props.items.map((item, index) => renderItem(item, item, index)),
      groupId: '0'
    }];
  } else {
    // When `groupMetadata` is provided, collect rendered `Item`s into their associated `Group`s.

    /**
     * A map of group identifiers to `Group`s, each with an associated array of `Item`s belonging to that `Group`.
     */
    const groupMap = props.groupMetadata.reduce((groupAccumulator, groupMetadata) => groupAccumulator.set(groupMetadata.groupId, groupMetadata), new Map());

    for (const itemProps of props.items) {
      var _group$items$length, _group$items, _group$items2;

      // Look up the group associated with the current item.
      const group = groupMap.get(itemProps.groupId);
      const itemIndex = (_group$items$length = group === null || group === void 0 ? void 0 : (_group$items = group.items) === null || _group$items === void 0 ? void 0 : _group$items.length) !== null && _group$items$length !== void 0 ? _group$items$length : 0; // Upsert the group to include the current item (rendered).

      groupMap.set(itemProps.groupId, { ...group,
        items: [...((_group$items2 = group === null || group === void 0 ? void 0 : group.items) !== null && _group$items2 !== void 0 ? _group$items2 : []), renderItem({
          showDivider: group === null || group === void 0 ? void 0 : group.showItemDividers,
          ...(group && 'renderItem' in group && {
            renderItem: group.renderItem
          }),
          ...itemProps
        }, itemProps, itemIndex)]
      });
    }

    groups = [...groupMap.values()];
  }

  return /*#__PURE__*/React__default["default"].createElement(StyledList, _extends({}, props, {
    ref: forwardedRef
  }), groups.map(({
    header,
    ...groupProps
  }, index) => {
    const hasFilledHeader = (header === null || header === void 0 ? void 0 : header.variant) === 'filled';
    const shouldShowDivider = index > 0 && !hasFilledHeader;
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, {
      key: groupProps.groupId
    }, shouldShowDivider ? /*#__PURE__*/React__default["default"].createElement(Divider.Divider, {
      key: `${groupProps.groupId}-divider`
    }) : null, renderGroup({
      sx: { ...(index === 0 && firstGroupStyle),
        ...(index === groups.length - 1 && lastGroupStyle),
        ...(index > 0 && !shouldShowDivider && {
          mt: 2
        })
      },
      ...(header && {
        header: { ...header,
          sx: { ...headerStyle,
            ...header.sx
          }
        }
      }),
      ...groupProps
    }));
  }));
});
List.displayName = 'ActionList';

exports.List = List;
