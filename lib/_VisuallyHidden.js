'use strict';

var styled = require('styled-components');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const VisuallyHidden = styled__default["default"].span.withConfig({
  displayName: "_VisuallyHidden__VisuallyHidden",
  componentId: "sc-11jhm7a-0"
})(["", ""], props => {
  if (props.isVisible) {
    return sx["default"];
  }

  return `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    `;
});
VisuallyHidden.defaultProps = {
  isVisible: false
};

module.exports = VisuallyHidden;
