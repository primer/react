'use strict';

var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const oppositeEdge = {
  top: 'Bottom',
  right: 'Left',
  bottom: 'Top',
  left: 'Right'
};
const perpendicularEdge = {
  top: 'Left',
  right: 'Top',
  bottom: 'Left',
  left: 'Top'
};

function getEdgeAlign(location) {
  const [edge, align] = location.split('-');
  return [edge, align];
}

function getPosition(edge, align, spacing) {
  const opposite = oppositeEdge[edge].toLowerCase();
  const perp = perpendicularEdge[edge].toLowerCase();
  return {
    [opposite]: '100%',
    [align || perp]: align ? spacing : '50%'
  };
}

const getBg = styledSystem.style({
  prop: 'bg',
  key: 'colors'
});
const getBorderColor = styledSystem.style({
  prop: 'borderColor',
  key: 'colors'
});
const getBorderWidth = styledSystem.style({
  prop: 'borderWidth',
  key: 'borderWidths',
  scale: [0, 1]
});

function Caret(props) {
  var _props$theme;

  const theme = React__default["default"].useContext(styled.ThemeContext);
  const propsWithTheme = { ...props,
    theme: (_props$theme = props.theme) !== null && _props$theme !== void 0 ? _props$theme : theme
  };
  const {
    bg
  } = getBg(propsWithTheme);
  const {
    borderColor
  } = getBorderColor(propsWithTheme);
  const {
    borderWidth
  } = getBorderWidth(propsWithTheme);
  const {
    size = 8,
    location = 'bottom'
  } = props;
  const [edge, align] = getEdgeAlign(location);
  const perp = perpendicularEdge[edge]; // note: these arrays represent points in the form [x, y]

  const a = [-size, 0];
  const b = [0, size];
  const c = [size, 0]; // spaces are optional in path `d` attribute, and points are
  // represented in the form `x,y` -- which is what the arrays above
  // become when stringified!

  const triangle = `M${a}L${b}L${c}L${a}Z`;
  const line = `M${a}L${b}L${c}`;
  const transform = {
    top: `translate(${[size, size * 2]}) rotate(180)`,
    right: `translate(${[0, size]}) rotate(-90)`,
    bottom: `translate(${[size, 0]})`,
    left: `translate(${[size * 2, size]}) rotate(90)`
  }[edge];
  return /*#__PURE__*/React__default["default"].createElement("svg", {
    width: size * 2,
    height: size * 2,
    style: {
      pointerEvents: 'none',
      position: 'absolute',
      ...getPosition(edge, align, size),
      // if align is set (top|right|bottom|left),
      // then we don't need an offset margin
      [`margin${perp}`]: align ? null : -size
    }
  }, /*#__PURE__*/React__default["default"].createElement("g", {
    transform: transform
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: triangle,
    fill: bg
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: line,
    fill: "none",
    stroke: borderColor,
    strokeWidth: borderWidth
  })));
}

Caret.displayName = "Caret";
Caret.locations = ['top', 'top-left', 'top-right', 'right', 'right-top', 'right-bottom', 'bottom', 'bottom-left', 'bottom-right', 'left', 'left-top', 'left-bottom'];
Caret.defaultProps = {
  bg: 'canvas.default',
  borderColor: 'border.default',
  borderWidth: 1
};

module.exports = Caret;
