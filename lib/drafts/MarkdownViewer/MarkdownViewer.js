'use strict';

var React = require('react');
var _useLinkInterception = require('./_useLinkInterception.js');
var _useListInteraction = require('./_useListInteraction.js');
var Box = require('../../Box.js');
var Spinner = require('../../Spinner.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const createRenderedContainer = html => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
};

const MarkdownViewer = ({
  dangerousRenderedHTML,
  loading = false,
  markdownValue = '',
  onChange: externalOnChange,
  disabled = false,
  onLinkClick,
  openLinksInNewTab = false
}) => {
  const outputContainerRef = React.useRef(null); // Render the HTML into an internal container element so we can modify it before it becomes visible.
  // Using `unsafeInnerHTML` would require an effect to run after rendering which would cause flicker

  const [htmlContainer, setHtmlContainer] = React.useState(() => createRenderedContainer(dangerousRenderedHTML.__html));
  React.useEffect(() => setHtmlContainer(createRenderedContainer(dangerousRenderedHTML.__html)), [dangerousRenderedHTML.__html]);
  const onChange = React.useCallback(async value => {
    try {
      await (externalOnChange === null || externalOnChange === void 0 ? void 0 : externalOnChange(value));
    } catch (error) {
      setHtmlContainer(createRenderedContainer(dangerousRenderedHTML.__html));
    }
  }, [externalOnChange, dangerousRenderedHTML.__html]);
  _useListInteraction.useListInteraction({
    onChange,
    disabled: disabled || !externalOnChange,
    htmlContainer,
    markdownValue
  });
  _useLinkInterception.useLinkInterception({
    htmlContainer,
    onLinkClick,
    openLinksInNewTab
  }); // If we were to inject the `...htmlContainer.children` instead of the container element itself,
  // those children elements would be moved from the `htmlContainer` to the `outputContainer`. Then if
  // other effects use `htmlContainer.querySelectorAll`, they wouldn't find any elements to affect

  React.useEffect(() => {
    var _outputContainerRef$c;

    return (_outputContainerRef$c = outputContainerRef.current) === null || _outputContainerRef$c === void 0 ? void 0 : _outputContainerRef$c.replaceChildren(htmlContainer);
  }, [htmlContainer]);
  return loading ? /*#__PURE__*/React__default["default"].createElement(Box, {
    sx: {
      display: 'flex',
      justifyContent: 'space-around',
      p: 2
    }
  }, /*#__PURE__*/React__default["default"].createElement(Spinner, {
    "aria-label": "Loading content..."
  })) : /*#__PURE__*/React__default["default"].createElement(Box, {
    ref: outputContainerRef,
    className: "markdown-body",
    sx: {
      fontSize: 1,
      maxWidth: '100%',
      '& > div > :last-child': {
        mb: 0
      }
    }
  });
};

var MarkdownViewer$1 = MarkdownViewer;

module.exports = MarkdownViewer$1;
