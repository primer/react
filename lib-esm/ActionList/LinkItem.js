import React from 'react';
import Link from '../Link.js';
import '../sx.js';
import { Item } from './Item.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LinkItem = /*#__PURE__*/React.forwardRef(({
  sx = {},
  active,
  as: Component,
  ...props
}, forwardedRef) => {
  const styles = {
    // occupy full size of Item
    paddingX: 2,
    paddingY: '6px',
    // custom value off the scale
    display: 'flex',
    flexGrow: 1,
    // full width
    borderRadius: 2,
    // inherit Item styles
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
      textDecoration: 'none'
    }
  };
  return /*#__PURE__*/React.createElement(Item, {
    active: active,
    sx: {
      paddingY: 0,
      paddingX: 0
    },
    _PrivateItemWrapper: ({
      children
    }) => /*#__PURE__*/React.createElement(Link, _extends({
      as: Component,
      sx: merge(styles, sx)
    }, props, {
      ref: forwardedRef
    }), children)
  }, props.children);
});

export { LinkItem };
