module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./package.json":
/***/ (function(module, exports) {

module.exports = {"name":"primer-react","version":"2.0.1-beta","description":"Primer react components","main":"dist/index.umd.js","module":"dist/index.esm.js","engines":{"node":">=8"},"scripts":{"predev":"npm run build:css","dev":"NODE_ENV=development x0 examples -op 8888","//":"next start","predist":"rm -rf dist","dist":"NODE_ENV=production rollup -c","postdist":"npm run build:css","prepublishOnly":"npm run dist","prebuild":"rm -rf docs; npm run dist","build":"x0 build examples --out-dir docs","postbuild":"cp -r dist docs","build:css":"primer-module-build --outputDir dist/css src/primer-react.scss","start":"serve","lint":"eslint src examples","test":"jest","watch":"jest --watch --no-coverage"},"repository":"primer/primer-react","keywords":["react","components","library","design-system"],"author":"GitHub, Inc.","license":"MIT","jest":{"collectCoverage":true,"collectCoverageFrom":["src/*.js"],"setupTestFrameworkScriptFile":"<rootDir>/src/utils/test-matchers.js"},"x0":{"title":"Primer React","template":"./examples/_html.js"},"dependencies":{"@githubprimer/octicons-react":"8.0.0","classnames":"^2.2.5","clean-tag":"2.0.0","d3-shape":"^1.2.0","emotion":"9.2.6","emotion-theming":"9.2.6","fs-extra":"7.0.0","now":"11.3.12","primer-colors":"1.0.1","primer-typography":"1.0.1","react":"16.4.2","react-dom":"16.4.2","react-emotion":"9.2.6","styled-system":"2.3.6","system-classnames":"^1.0.0-3","system-components":"3.0.0"},"devDependencies":{"@compositor/kit":"^1.0.43","@compositor/x0":"6.0.5","@mdx-js/loader":"0.15.0","@mdx-js/mdx":"0.15.0","@mdx-js/tag":"0.15.0","@zeit/next-mdx":"1.1.0","babel-plugin-add-react-displayname":"0.0.5","babel-plugin-external-helpers":"6.22.0","babel-plugin-transform-object-rest-spread":"6.26.0","babel-preset-env":"1.7.0","babel-preset-react":"6.24.1","enzyme":"3.3.0","enzyme-adapter-react-16":"1.1.1","eslint":"4.19.1","eslint-plugin-github":"1.0.0","eslint-plugin-jest":"21.15.1","eslint-plugin-jsx-a11y":"6.0.3","eslint-plugin-react":"7.8.2","jest":"23.5.0","jest-emotion":"9.2.7","mdx-docs":"1.0.0-8","next":"6.1.1","primer-buttons":"2.6.0","primer-forms":"2.1.4","primer-layout":"1.4.9","primer-module-build":"1.0.5","primer-navigation":"1.5.7","primer-product":"5.6.7","primer-tooltips":"1.5.7","primer-utilities":"4.12.0","react-router-dom":"^4.3.1","react-test-renderer":"^16.3.2","rollup":"0.62.0","rollup-plugin-babel":"4.0.0-beta.8","rollup-plugin-commonjs":"9.1.3","serve":"10.0.0","styled-components":"3.3.3"}}

/***/ }),

/***/ "./pages/_app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator__ = __webpack_require__("@babel/runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_next_app__ = __webpack_require__("next/app");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_next_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_next_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_emotion_theming__ = __webpack_require__("emotion-theming");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_emotion_theming___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_emotion_theming__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_mdx_docs__ = __webpack_require__("mdx-docs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_mdx_docs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_mdx_docs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react__ = __webpack_require__("@githubprimer/octicons-react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__src__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__doc_components__ = __webpack_require__("./pages/doc-components/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__doc_components_SideNav__ = __webpack_require__("./pages/doc-components/SideNav.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__doc_components_Header__ = __webpack_require__("./pages/doc-components/Header.js");

var _jsxFileName = "/Users/emplums/primer-react/pages/_app.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }












var iconsObject = function iconsObject() {
  var obj = {};
  Object.keys(__WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react__["iconsByName"]).map(function (key) {
    obj[__WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react__["iconsByName"][key].name] = __WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react__["iconsByName"][key];
  });
  return obj;
};

var customTheme = {
  font: __WEBPACK_IMPORTED_MODULE_6__src__["theme"].fonts.normal,
  LiveEditor: {
    whiteSpace: 'pre-wrap'
  },
  LayoutSidebar: {
    top: '64px',
    backgroundColor: __WEBPACK_IMPORTED_MODULE_6__src__["theme"].colors.gray[0]
  },
  NavLink: {
    padding: '8px 0px',
    fontSize: '16px'
  }
};
var routes = [{
  name: 'Home',
  path: '/'
}, {
  name: 'Components',
  path: '/components/'
}, {
  name: 'Demos',
  path: '/demos'
}, {
  name: 'Avatar',
  path: '/components/avatar'
}];

var MyApp =
/*#__PURE__*/
function (_App) {
  _inherits(MyApp, _App);

  function MyApp() {
    _classCallCheck(this, MyApp);

    return _possibleConstructorReturn(this, (MyApp.__proto__ || Object.getPrototypeOf(MyApp)).apply(this, arguments));
  }

  _createClass(MyApp, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          Component = _props.Component,
          page = _props.page;
      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_next_app__["Container"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 58
        }
      }, __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4_mdx_docs__["Layout"], _extends({
        components: Object.assign({}, __WEBPACK_IMPORTED_MODULE_6__src__, __WEBPACK_IMPORTED_MODULE_7__doc_components__, {
          'Octicon': __WEBPACK_IMPORTED_MODULE_5__githubprimer_octicons_react___default.a
        }, iconsObject())
      }, this.props, {
        routes: routes,
        theme: customTheme,
        header: __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__doc_components_Header__["a" /* default */], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          }
        }),
        sidebar: __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__doc_components_SideNav__["a" /* default */], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 66
          }
        }),
        layoutMain: true,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        }
      }), __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Component, _extends({}, page, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 70
        }
      }))));
    }
  }], [{
    key: "getInitialProps",
    value: function () {
      var _getInitialProps = _asyncToGenerator(
      /*#__PURE__*/
      __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default.a.mark(function _callee(_ref) {
        var Component, router, ctx, page;
        return __WEBPACK_IMPORTED_MODULE_0__babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                Component = _ref.Component, router = _ref.router, ctx = _ref.ctx;
                page = {};

                if (!Component.getInitialProps) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return Component.getInitialProps(ctx);

              case 5:
                page = _context.sent;

              case 6:
                return _context.abrupt("return", {
                  page: page
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function getInitialProps(_x) {
        return _getInitialProps.apply(this, arguments);
      };
    }()
  }]);

  return MyApp;
}(__WEBPACK_IMPORTED_MODULE_2_next_app___default.a);

MyApp.displayName = "MyApp";


/***/ }),

/***/ "./pages/components/Avatar.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Avatar.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Avatar'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    }
  }, "Avatar"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    }
  }, "<Avatar src=\"https://avatars.githubusercontent.com/primer?v=3&s=128\" size={128} username=\"primer\" />\n")));
});

/***/ }),

/***/ "./pages/components/BorderBox.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/BorderBox.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'BorderBox'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "<BorderBox>This is a BorderBox</BorderBox>\n<BorderBox p={2}>This is a BorderBox with padding.</BorderBox>\n<BorderBox boxShadow=\"small\" m={4} p={2}>This is a BorderBox with shadow.</BorderBox>\n<BorderBox boxShadow=\"medium\" m={4} p={2}>This is a BorderBox with a medium shadow.</BorderBox>\n<BorderBox boxShadow=\"large\" m={4} p={2}>This is a BorderBox with a large shadow.</BorderBox>\n<BorderBox boxShadow=\"extra-large\" m={4} p={2}>This is a BorderBox with an extra-large shadow.</BorderBox>\n<BorderBox borderColor=\"green.5\" p={2}>This is a BorderBox with a green border.</BorderBox>\n")));
});

/***/ }),

/***/ "./pages/components/Box.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compositor_kit__ = __webpack_require__("@compositor/kit");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compositor_kit___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__compositor_kit__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_theme__ = __webpack_require__("./src/theme.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_theme___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__src_theme__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__src__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Box.js";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable import/no-named-as-default-member */





var Mono = function Mono(props) {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Text"], _extends({
    fontFamily: "mono"
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }));
};

Mono.displayName = "Mono";

var colors = _toConsumableArray(Object.entries(__WEBPACK_IMPORTED_MODULE_2__src_theme__["default"].colors)).reduce(function (keys, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];

  if (key !== 'bg' && key !== 'border') {
    if (Array.isArray(value)) {
      return keys.concat(Object.keys(value).map(function (i) {
        return "".concat(key, ".").concat(i);
      }));
    } else {
      keys.push(key);
    }
  }

  return keys;
}, []);

var textColors = ['white', 'gray.5', 'black'];
function BoxExample() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("table", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("thead", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("tr", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("th", {
    className: "text-left",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Box"], {
    pb: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    }
  }, "color")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("th", {
    colSpan: textColors.length,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Mono, {
    pb: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    }
  }, "bg=", "{color}")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("th", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Mono, {
    pb: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    }
  }, "borderColor")))), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("tbody", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    }
  }, colors.map(function (color) {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("tr", {
      key: color,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 44
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 45
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Mono, {
      mr: 3,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 46
      }
    }, color)), textColors.map(function (fg) {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("td", {
        key: fg,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        }
      }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Box"], {
        p: 3,
        mb: 2,
        bg: color,
        color: fg,
        border: color === 'white' ? 1 : null,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        }
      }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Mono, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        }
      }, fg)));
    }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 55
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Box"], {
      p: 3,
      mb: 2,
      ml: 3,
      borderColor: color,
      border: 1,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Mono, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57
      }
    }, color))));
  }))));
}
BoxExample.displayName = "BoxExample";
var meta = {
  displayName: 'Box'
};

/***/ }),

/***/ "./pages/components/BranchName.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/BranchName.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'BranchName'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "BranchName"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<BranchName>a_new_feature_branch</BranchName>\n\n<ExampleHeading mt={3}>BranchName with Octicon</ExampleHeading>\n<BranchName>\n  <Octicon icon={GitBranch} />\n  a_new_feature_branch\n</BranchName>\n\n<ExampleHeading mt={3}>Linked BranchName</ExampleHeading>\n<BranchName is=\"a\" href=\"/\">\n  a_new_feature_branch\n</BranchName>\n")));
});

/***/ }),

/***/ "./pages/components/Buttons.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Buttons.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Buttons'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Buttons"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<FlexContainer flexDirection=\"column\" alignItems=\"start\" >\n  <Button> Button </Button>\n\n  <Button size=\"sm\"> Button small </Button>\n\n  <Button size=\"large\"> Button large </Button>\n\n  <ButtonDanger> ButtonDanger </ButtonDanger>\n\n  <ButtonPrimary> ButtonPrimary </ButtonPrimary>\n\n  <ButtonOutline> ButtonOutline </ButtonOutline>\n\n  <Button block> Button block </Button>\n\n  <Button linkStyle> Button linkStyle </Button>\n  <ButtonLink href=\"https://www.goatslive.com/\">This is an {'<a>'} styled as a button</ButtonLink>\n\n  <ExampleHeading>Octicon Buttons</ExampleHeading>\n\n  <OcticonButton icon={Pencil} label=\"Edit\" onClick={() => alert('edit')} mr={3} />\n\n  <Text color=\"red.5\"><OcticonButton icon={X} label=\"Close\" onClick={() => alert('close')} mr={3} /></Text>\n\n  <OcticonButton icon={Hubot} size=\"large\" label=\"ROBOT\" onClick={() => alert('beep boop')} />\n</FlexContainer>\n")));
});

/***/ }),

/***/ "./pages/components/CircleBadge.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/CircleBadge.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'CircleBadge'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "CircleBadge"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Heading fontSize={3}>Small, medium & large</Heading>\n<CircleBadge bg=\"blue.5\" size=\"small\"><img src=\"https://avatars0.githubusercontent.com/t/1929972?s=280&v=4\"/></CircleBadge>\n<CircleBadge bg=\"blue.5\" size=\"medium\"><img src=\"https://avatars0.githubusercontent.com/t/1929972?s=280&v=4\"/></CircleBadge>\n<CircleBadge bg=\"blue.5\" size=\"large\"><img src=\"https://avatars0.githubusercontent.com/t/1929972?s=280&v=4\"/></CircleBadge>\n\n<Heading fontSize={3}>With custom width & height</Heading>\n<CircleBadge bg=\"blue.5\" size={40}><img src=\"https://avatars0.githubusercontent.com/t/1929972?s=280&v=4\"/></CircleBadge>\n\n<Heading fontSize={3}>{`With <img> as a child & bg prop`}</Heading>\n<CircleBadge bg=\"blue.5\" size=\"small\"><img src=\"https://avatars0.githubusercontent.com/t/1929972?s=280&v=4\"/></CircleBadge>\n\n<Heading fontSize={3}>With Octicon as child</Heading>\n<CircleBadge size=\"medium\">\n  <Octicon icon={Zap}/>\n</CircleBadge>\n")));
});

/***/ }),

/***/ "./pages/components/CircleOcticon.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/CircleOcticon.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'CircleOcticon'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "CircleOcticon"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<FlexContainer>\n  <CircleOcticon icon={Check} size={32} bg=\"green.5\" color=\"white\" mr={2} />\n  <CircleOcticon icon={Zap} size={48} bg=\"blue.5\" color=\"white\" mr={2} />\n  <CircleOcticon icon={X} size={64} bg=\"red.5\" color=\"white\" mr={2} />\n</FlexContainer>\n")));
});

/***/ }),

/***/ "./pages/components/CounterLabel.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/CounterLabel.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'CounterLabel'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "CounterLabel"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<CounterLabel>12</CounterLabel>\n<CounterLabel scheme={'gray'}>13</CounterLabel>\n<CounterLabel scheme={'gray-light'}>13</CounterLabel>\n")));
});

/***/ }),

/***/ "./pages/components/Details.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Details.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Details'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Details"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<ExampleHeading>With static children</ExampleHeading>\n\n<Details>\n  <summary className=\"btn\">Click me</summary>\n  <p>This should show and hide</p>\n</Details>\n\n\n<ExampleHeading>With children as a function</ExampleHeading>\n\n<Details>\n  {({open, toggle}) => (\n    <React.Fragment>\n      <summary className=\"btn\" onClick={toggle}>\n        {open ? 'Hide' : 'Show'}\n      </summary>\n      <p>This should show and hide</p>\n    </React.Fragment>\n  )}\n</Details>\n\n<ExampleHeading>With render prop</ExampleHeading>\n<Details render={() => 'hi'} />\n")));
});

/***/ }),

/***/ "./pages/components/DonutChart.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/DonutChart.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'DonutChart'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "DonutChart"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Box mb={2}>\n  <ExampleHeading>\n    With <Text fontFamily=\"mono\">data</Text> prop\n  </ExampleHeading>\n\n  <DonutChart mr={1} data={{error: 2, pending: 3, success: 5}} />\n  <DonutChart mr={1} data={{error: 1, pending: 4, success: 2}} />\n  <DonutChart mr={1} data={{pending: 2, success: 6}} />\n  <DonutChart mr={1} data={{pending: 0, success: 1}} />\n  <DonutChart mr={1} data={{pending: 1, queued: 1}} />\n  <DonutChart mr={1} data={{unknown: 1}} />\n</Box>\n<Box mb={2}>\n  <ExampleHeading>\n    With <Text fontFamily=\"mono\">DonutSlice</Text> children\n  </ExampleHeading>\n\n  <DonutChart mr={1}>\n    <DonutSlice value={1} state=\"pending\" />\n    <DonutSlice value={1} state=\"success\" />\n    <DonutSlice value={1} state=\"error\" />\n  </DonutChart>\n\n  <DonutChart mr={1}>\n    <DonutSlice value={1} state=\"error\" />\n    <DonutSlice value={4} state=\"pending\" />\n    <DonutSlice value={2} state=\"success\" />\n  </DonutChart>\n\n  <DonutChart mr={1}>\n    <DonutSlice value={2} state=\"pending\" />\n    <DonutSlice value={6} state=\"success\" />\n  </DonutChart>\n\n  <DonutChart mr={1}>\n    <DonutSlice value={0} state=\"pending\" />\n    <DonutSlice value={1} state=\"success\" />\n  </DonutChart>\n\n  <DonutChart mr={1}>\n    <DonutSlice value={1} state=\"pending\" />\n    <DonutSlice value={1} state=\"queued\" />\n  </DonutChart>\n\n  <DonutChart>\n    <DonutSlice value={1} state=\"queued\" />\n  </DonutChart>\n</Box>\n\n<Box mb={2}>\n  <ExampleHeading>\n    With <Text fontFamily=\"mono\">DonutSlice</Text> children\n  </ExampleHeading>\n\n  <DonutChart>\n    <DonutSlice value={1} fill={theme.colors.purple[0]} />\n    <DonutSlice value={1} fill={theme.colors.purple[1]} />\n    <DonutSlice value={1} fill={theme.colors.purple[2]} />\n    <DonutSlice value={1} fill={theme.colors.purple[3]} />\n    <DonutSlice value={1} fill={theme.colors.purple[4]} />\n  </DonutChart>\n</Box>\n")));
});

/***/ }),

/***/ "./pages/components/Dropdown.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Dropdown.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Dropdown'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Dropdown"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Box mb={4}>\n  <ExampleHeading>Dropdown Primary</ExampleHeading>\n  <Dropdown scheme=\"primary\" minWidth=\"5em\">\n    <Box is=\"ul\" m={0} p={0} className=\"list-style-none\">\n      <li>Item 1</li>\n      <li>Item 2</li>\n      <li>Item 3</li>\n    </Box>\n  </Dropdown>\n</Box>\n\n<Box mb={4}>\n  <ExampleHeading>Dropdown</ExampleHeading>\n  <Dropdown minWidth=\"5em\">\n    <Box is=\"ul\" m={0} p={0} className=\"list-style-none\">\n      <li>Item 1</li>\n      <li>Item 2</li>\n      <li>Item 3</li>\n    </Box>\n  </Dropdown>\n</Box>\n\n<Box mb={4}>\n  <ExampleHeading>Dropdown with title</ExampleHeading>\n  <Dropdown title=\"Options\" minWidth=\"5em\">\n    <Box is=\"ul\" m={0} p={0} className=\"list-style-none\">\n      <li>Item 1</li>\n      <li>Item 2</li>\n      <li>Item 3</li>\n    </Box>\n  </Dropdown>\n</Box>\n")));
});

/***/ }),

/***/ "./pages/components/FilterList.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/FilterList.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'FilterList'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "FilterList"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<FilterList>\n  <FilterListItem selected count='32' href='#foo'>First Filter</FilterListItem>\n  <FilterListItem count='2' href='#bar'>Second Filter</FilterListItem>\n  <FilterListItem href='#baz'>Third Filter</FilterListItem>\n</FilterList>\n\n<ExampleHeading>Small</ExampleHeading>\n<FilterList small>\n  <FilterListItem selected count='32' href='#foo'>First Filter</FilterListItem>\n  <FilterListItem href='#bar'>Second Filter</FilterListItem>\n  <FilterListItem href='#baz'>Third Filter</FilterListItem>\n</FilterList>\n")));
});

/***/ }),

/***/ "./pages/components/Flash.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Flash.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Flash'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Flash"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Flash m={4}> Flash </Flash>\n<Flash m={4} scheme=\"yellow\"> Flash yellow </Flash>\n<Flash m={4} scheme=\"red\"> Flash red </Flash>\n<Flash m={4} scheme=\"green\"> Flash green </Flash>\n<Flash m={4} full> Flash full </Flash>\n")));
});

/***/ }),

/***/ "./pages/components/Flex.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Flex.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Flex'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "FlexContainer and FlexItem"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<ExampleHeading mt={3}>FlexContainer + FlexItems</ExampleHeading>\n<BorderBox width={300} height={300} borderRadius={0}>\n  <FlexContainer flexWrap=\"nowrap\">\n    <FlexItem>\n      <Box p={3} bg=\"blue.5\">\n        Item 1\n      </Box>\n    </FlexItem>\n    <FlexItem>\n      <Box p={3} bg=\"green.5\">\n        Item 2\n      </Box>\n    </FlexItem>\n    <FlexItem>\n      <Box p={3} bg=\"yellow.5\">\n        Item 3\n      </Box>\n    </FlexItem>\n  </FlexContainer>\n</BorderBox>\n\n\n<ExampleHeading mt={2}>FlexContainer + FlexItems direction set to 'column'</ExampleHeading>\n<BorderBox width={400} height={200} borderRadius={0}>\n  <FlexContainer flexWrap=\"nowrap\" flexDirection='column'>\n    <FlexItem>\n      <Box p={3} bg=\"blue.5\">\n        Item 1\n      </Box>\n    </FlexItem>\n    <FlexItem>\n      <Box p={3} bg=\"green.5\">\n        Item 2\n      </Box>\n    </FlexItem>\n    <FlexItem>\n      <Box p={3} bg=\"yellow.5\">\n        Item 3\n      </Box>\n    </FlexItem>\n  </FlexContainer>\n</BorderBox>\n\n<ExampleHeading mt={2}>FlexContainer + FlexItems using tag prop set to \"p\"</ExampleHeading>\n<BorderBox width={400} height={200} borderRadius={0}>\n  <FlexContainer flexWrap=\"nowrap\">\n    <FlexItem is=\"p\">\n      <Box p={3} bg=\"blue.5\">\n        Item 1\n      </Box>\n    </FlexItem>\n    <FlexItem is=\"p\">\n      <Box p={3} bg=\"green.5\">\n        Item 2\n      </Box>\n    </FlexItem>\n    <FlexItem is=\"p\">\n      <Box p={3} bg=\"yellow.5\">\n        Item 3\n      </Box>\n    </FlexItem>\n  </FlexContainer>\n</BorderBox>\n")));
});

/***/ }),

/***/ "./pages/components/Heading.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Heading.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Heading'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Heading"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Heading fontSize={1} mb={2}>With fontSize={1}</Heading>\n<Heading fontSize={2} mb={2}>With fontSize={2}</Heading>\n<Heading fontSize={3} mb={2}>With fontSize={3}</Heading>\n")));
});

/***/ }),

/***/ "./pages/components/Label.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Label.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Label'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Label"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<FlexContainer flexDirection=\"column\" alignItems=\"start\">\n  <Label m={1}>Default label</Label>\n  <Label m={1} scheme=\"gray-darker\">Darker gray label</Label>\n  <Label m={1} scheme=\"orange\">Orange label</Label>\n  <Label m={1} scheme=\"green\">Green label</Label>\n  <Label m={1} outline>Default outline label</Label>\n  <Label m={1} outline scheme=\"green\">Green outline label</Label>\n</FlexContainer>\n")));
});

/***/ }),

/***/ "./pages/components/Link.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Link.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Link'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Link"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Link mb={1} href=\"https://github.com\">Link</Link>\n<Link mb={1} muted href=\"https://github.com\">Link muted</Link>\n<Link mb={1} scheme=\"gray\" href=\"https://github.com\">Link gray</Link>\n<Link mb={1} scheme=\"gray-dark\" href=\"https://github.com\">Link gray-dark</Link>\n")));
});

/***/ }),

/***/ "./pages/components/MergeStatus.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/MergeStatus.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'MergeStatus'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "MergeStatus"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<FlexContainer flexDirection=\"column\" alignItems=\"start\">\n  <MergeStatus mb={2} state=\"pending\" />\n  <MergeStatus mb={2} state=\"invalid\" />\n  <MergeStatus mb={2} state=\"merged\" />\n  <MergeStatus mb={2} state=\"ready\" />\n</FlexContainer>\n")));
});

/***/ }),

/***/ "./pages/components/PointerBox.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/PointerBox.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'PointerBox'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "PointerBox"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<PointerBox m={4} p={2} minHeight={100} bg=\"green.1\" borderColor=\"green.5\">\n  PointerBox\n</PointerBox>\n")));
});

/***/ }),

/***/ "./pages/components/Position.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Position.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Position'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Position Components"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Box p={2} mb={200}>\n  <ExampleHeading mb={2}>Relative + Absolute</ExampleHeading>\n  <Relative size={128} mx={128} my={6}>\n    <Box border={1} borderColor=\"gray.2\" size=\"100%\">\n      <Absolute left=\"100%\" top={0} bg=\"red.1\" p={1}>rt</Absolute>\n      <Absolute right=\"100%\" top={0} bg=\"green.1\" p={1}>lt</Absolute>\n      <Absolute left=\"100%\" bottom={0} bg=\"blue.1\" p={1}>rb</Absolute>\n      <Absolute right=\"100%\" bottom={0} bg=\"purple.1\" p={1}>lb</Absolute>\n      <Absolute left={0} top=\"100%\" bg=\"orange.1\" p={1}>bl</Absolute>\n      <Absolute right={0} top=\"100%\" bg=\"yellow.3\" p={1}>br</Absolute>\n      <Absolute left={0} bottom=\"100%\" bg=\"red.1\" p={1}>tl</Absolute>\n      <Absolute right={0} bottom=\"100%\" bg=\"blue.1\" p={1}>tr</Absolute>\n    </Box>\n  </Relative>\n\n  <ExampleHeading my={2}>Sticky</ExampleHeading>\n\n  <Box border={1} borderColor=\"green.5\" height={1000}>\n    <Sticky top={0} bg=\"green.2\" p={4}>\n      I'm sticky!\n    </Sticky>\n  </Box>\n\n  <ExampleHeading my={2}>Fixed</ExampleHeading>\n  <p>(see the bottom right of the screen)</p>\n\n  <Fixed bottom={0} right={0} bg=\"red.2\" p={2}>\n    I'm fixed to the bottom right.\n  </Fixed>\n</Box>\n")));
});

/***/ }),

/***/ "./pages/components/StateLabel.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/StateLabel.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'StateLabel'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "StateLabel"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Box mb={2}>\n  <StateLabel state=\"open\">Open</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel state=\"closed\">Closed</StateLabel>\n</Box>\n<Box mb={4}>\n  <StateLabel state=\"merged\">Merged</StateLabel>\n</Box>\n\n<ExampleHeading>By state (Octicons built in)</ExampleHeading>\n<Box mb={2}>\n  <StateLabel>Unknown</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel state=\"open\">Open</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel state=\"closed\">Closed</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel state=\"merged\">Merged</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel state=\"reopened\">Reopened</StateLabel>\n</Box>\n\n<ExampleHeading>By color</ExampleHeading>\n<Box mb={2}>\n  <StateLabel scheme=\"invalid\">Invalid</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel scheme=\"green\">Green</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel scheme=\"red\">Red</StateLabel>\n</Box>\n<Box mb={2}>\n  <StateLabel scheme=\"purple\">Purple</StateLabel>\n</Box>\n\n<ExampleHeading>Small, by state</ExampleHeading>\n<Box mb={2}>\n  <StateLabel mr={2} small>Unknown</StateLabel>\n  <StateLabel mr={2} small state=\"open\">\n    Open\n  </StateLabel>\n  <StateLabel mr={2} small state=\"closed\">\n    Closed\n  </StateLabel>\n  <StateLabel mr={2} small state=\"merged\">\n    Merged\n  </StateLabel>\n  <StateLabel mr={2} small state=\"reopened\">\n    Reopened\n  </StateLabel>\n</Box>\n\n<ExampleHeading>Small, by color</ExampleHeading>\n<Box mb={2}>\n  <StateLabel mr={2} small scheme=\"invalid\">\n    Invalid\n  </StateLabel>\n  <StateLabel mr={2} small scheme=\"green\">\n    Green\n  </StateLabel>\n  <StateLabel mr={2} small scheme=\"red\">\n    Red\n  </StateLabel>\n  <StateLabel mr={2} small scheme=\"purple\">\n    Purple\n  </StateLabel>\n  <StateLabel mr={2} small scheme=\"green\" icon={<Octicon icon={GitBranch} />}>\n    Custom Octicon\n  </StateLabel>\n</Box>\n")));
});

/***/ }),

/***/ "./pages/components/Text.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Text.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Text'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Text"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<Text is=\"div\">Text</Text>\n<Text is=\"div\" fontWeight=\"bold\">Text bold</Text>\n<Text is=\"div\" color=\"green.5\">Text green</Text>\n<Text is=\"div\" lineHeight=\"condensed\">Text lineHeight 'condensed'</Text>\n<Text is=\"div\" fontSize={4}>Text fontSize 4</Text>\n<Text is=\"div\" p={4}>Text padding 4</Text>\n")));
});

/***/ }),

/***/ "./pages/components/TextInput.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/TextInput.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'TextInput'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "TextInput"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<TextInput name=\"zipcode\" />\n\n<ExampleHeading>Text Input Sizes</ExampleHeading>\n<TextInput name=\"zipcode\" size=\"small\" placeholder=\"Small input\" />\n<TextInput name=\"zipcode\" size=\"large\" placeholder=\"Large input\" />\n\n<ExampleHeading>Text Input - Block</ExampleHeading>\n<TextInput block placeholder=\"Full width block input\" />\n")));
});

/***/ }),

/***/ "./pages/components/Tooltip.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/Tooltip.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'Tooltip'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "Tooltip"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<ExampleHeading mt={3}>Basic Tooltip</ExampleHeading>\n<BorderBox p={3}>\n  <Tooltip text=\"Hello, Tooltip!\">Text with a tooltip</Tooltip>\n</BorderBox>\n\n<ExampleHeading mt={3}>Directions</ExampleHeading>\n{Tooltip.directions.map(dir => (\n  <BorderBox p={3} my={2} key=\"top\">\n    <Tooltip text=\"Hello, Tooltip!\" direction=\"${dir}\">\n      Tooltip direction=\"${dir}\"\n    </Tooltip>\n  </BorderBox>\n))}\n\n\n<ExampleHeading mt={3}>Word wrap</ExampleHeading>\n<BorderBox p={3} my={2}>\n  <Tooltip\n    text=\"Hello, Tooltip! This tooltip has a sentence that will wrap to a newline.\"\n    wrap\n    direction=\"ne\"\n    align=\"left\"\n  >\n    Word wrapping tooltip\n  </Tooltip>\n</BorderBox>\n\n<ExampleHeading mt={3}>Alignment</ExampleHeading>\n{Tooltip.alignments.map(align => (\n  <BorderBox p={3} my={2} key=\"${align}\">\n    <Tooltip text=\"Hello, Tooltip!\" direction=\"ne\" align=\"${align}\">\n      Tooltip align=\"${align}\"\n    </Tooltip>\n  </BorderBox>\n))}\n\n\n<ExampleHeading mt={3}>No Delay</ExampleHeading>\n<BorderBox p={3} my={2}>\n  <Tooltip noDelay text=\"Hello, Tooltip!\">\n    Text with a tooltip\n  </Tooltip>\n</BorderBox>`\n")));
});

/***/ }),

/***/ "./pages/components/UnderlineNav.md":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__ = __webpack_require__("@mdx-js/tag");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mdx_js_tag___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__);
var _jsxFileName = "/Users/emplums/primer-react/pages/components/UnderlineNav.md";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }



var meta = {
  displayName: 'UnderlineNav'
};
/* unused harmony default export */ var _unused_webpack_default_export = (function (_ref) {
  var components = _ref.components,
      props = _objectWithoutProperties(_ref, ["components"]);

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "wrapper",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "h3",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, "UnderlineNav"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "pre",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "code",
    components: components,
    parentName: "pre",
    props: {
      "className": "language-.jsx"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, "<ExampleHeading>\n  Using <Text fontFamily=\"mono\">{'<UnderlineNavLink>'}</Text>\n</ExampleHeading>\n<UnderlineNav>\n  <UnderlineNavLink href=\"#foo\" selected>\n    Selected\n  </UnderlineNavLink>\n  <UnderlineNavLink href=\"#bar\">Bar</UnderlineNavLink>\n  <UnderlineNavLink href=\"#baz\">Baz</UnderlineNavLink>\n</UnderlineNav>\n")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "p",
    components: components,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    }
  }, "  To use UnderlineNav with ", __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "p",
    props: {
      "href": "https://github.com/ReactTraining/react-router"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    }
  }, "react-router"), " or\n", __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "a",
    components: components,
    parentName: "p",
    props: {
      "href": "https://www.npmjs.com/package/react-router-dom"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    }
  }, "react-router-dom"), ", pass\n", __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    }
  }, "is={NavLink}"), " and omit the ", __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    }
  }, "selected"), " prop.\nThis ensures that the NavLink gets ", __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__mdx_js_tag__["MDXTag"], {
    name: "inlineCode",
    components: components,
    parentName: "p",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    }
  }, "activeClassName='selected'")));
});

/***/ }),

/***/ "./pages/components/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_md__ = __webpack_require__("./pages/components/Avatar.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Avatar", function() { return __WEBPACK_IMPORTED_MODULE_0__Avatar_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BorderBox_md__ = __webpack_require__("./pages/components/BorderBox.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "BorderBox", function() { return __WEBPACK_IMPORTED_MODULE_1__BorderBox_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Box_js__ = __webpack_require__("./pages/components/Box.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Box", function() { return __WEBPACK_IMPORTED_MODULE_2__Box_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__BranchName_md__ = __webpack_require__("./pages/components/BranchName.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "BranchName", function() { return __WEBPACK_IMPORTED_MODULE_3__BranchName_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Buttons_md__ = __webpack_require__("./pages/components/Buttons.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Buttons", function() { return __WEBPACK_IMPORTED_MODULE_4__Buttons_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CircleBadge_md__ = __webpack_require__("./pages/components/CircleBadge.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CircleBadge", function() { return __WEBPACK_IMPORTED_MODULE_5__CircleBadge_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__CircleOcticon_md__ = __webpack_require__("./pages/components/CircleOcticon.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CircleOcticon", function() { return __WEBPACK_IMPORTED_MODULE_6__CircleOcticon_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__CounterLabel_md__ = __webpack_require__("./pages/components/CounterLabel.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CounterLabel", function() { return __WEBPACK_IMPORTED_MODULE_7__CounterLabel_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Details_md__ = __webpack_require__("./pages/components/Details.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Details", function() { return __WEBPACK_IMPORTED_MODULE_8__Details_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__DonutChart_md__ = __webpack_require__("./pages/components/DonutChart.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DonutChart", function() { return __WEBPACK_IMPORTED_MODULE_9__DonutChart_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Dropdown_md__ = __webpack_require__("./pages/components/Dropdown.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Dropdown", function() { return __WEBPACK_IMPORTED_MODULE_10__Dropdown_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__FilterList_md__ = __webpack_require__("./pages/components/FilterList.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "FilterList", function() { return __WEBPACK_IMPORTED_MODULE_11__FilterList_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__Flash_md__ = __webpack_require__("./pages/components/Flash.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Flash", function() { return __WEBPACK_IMPORTED_MODULE_12__Flash_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Flex_md__ = __webpack_require__("./pages/components/Flex.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Flex", function() { return __WEBPACK_IMPORTED_MODULE_13__Flex_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__Heading_md__ = __webpack_require__("./pages/components/Heading.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Heading", function() { return __WEBPACK_IMPORTED_MODULE_14__Heading_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__Label_md__ = __webpack_require__("./pages/components/Label.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Label", function() { return __WEBPACK_IMPORTED_MODULE_15__Label_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__Link_md__ = __webpack_require__("./pages/components/Link.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return __WEBPACK_IMPORTED_MODULE_16__Link_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__MergeStatus_md__ = __webpack_require__("./pages/components/MergeStatus.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MergeStatus", function() { return __WEBPACK_IMPORTED_MODULE_17__MergeStatus_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__PointerBox_md__ = __webpack_require__("./pages/components/PointerBox.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PointerBox", function() { return __WEBPACK_IMPORTED_MODULE_18__PointerBox_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__Position_md__ = __webpack_require__("./pages/components/Position.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Position", function() { return __WEBPACK_IMPORTED_MODULE_19__Position_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__StateLabel_md__ = __webpack_require__("./pages/components/StateLabel.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "StateLabel", function() { return __WEBPACK_IMPORTED_MODULE_20__StateLabel_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__Text_md__ = __webpack_require__("./pages/components/Text.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return __WEBPACK_IMPORTED_MODULE_21__Text_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__TextInput_md__ = __webpack_require__("./pages/components/TextInput.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TextInput", function() { return __WEBPACK_IMPORTED_MODULE_22__TextInput_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__Tooltip_md__ = __webpack_require__("./pages/components/Tooltip.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Tooltip", function() { return __WEBPACK_IMPORTED_MODULE_23__Tooltip_md__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__UnderlineNav_md__ = __webpack_require__("./pages/components/UnderlineNav.md");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UnderlineNav", function() { return __WEBPACK_IMPORTED_MODULE_24__UnderlineNav_md__["a"]; });


























/***/ }),

/***/ "./pages/doc-components/ExampleHeading.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__src__);
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/ExampleHeading.js";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var ExampleHeading = function ExampleHeading(props) {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__src__["Heading"], _extends({
    is: "h3",
    fontSize: 3,
    mb: 2
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 4
    }
  }));
};

ExampleHeading.displayName = "ExampleHeading";
/* harmony default export */ __webpack_exports__["a"] = (ExampleHeading);

/***/ }),

/***/ "./pages/doc-components/Header.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__githubprimer_octicons_react__ = __webpack_require__("@githubprimer/octicons-react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__githubprimer_octicons_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__githubprimer_octicons_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_next_link__ = __webpack_require__("next/link");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_next_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_next_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__src__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__package_json__ = __webpack_require__("./package.json");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__package_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__package_json__);
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/Header.js";





var pkg = "".concat(__WEBPACK_IMPORTED_MODULE_4__package_json__["name"], "@").concat(__WEBPACK_IMPORTED_MODULE_4__package_json__["version"]);
var releaseURL = "https://github.com/".concat(__WEBPACK_IMPORTED_MODULE_4__package_json__["repository"], "/releases/v").concat(__WEBPACK_IMPORTED_MODULE_4__package_json__["version"]);

var Header = function Header() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["FlexContainer"], {
    mr: 1,
    p: 1,
    alignItems: "center",
    justifyContent: "space-between",
    bg: "black",
    color: "white",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["FlexContainer"], {
    ml: 4,
    alignItems: "center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__githubprimer_octicons_react___default.a, {
    size: "medium",
    icon: __WEBPACK_IMPORTED_MODULE_1__githubprimer_octicons_react__["MarkGithub"],
    className: "mr-3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    }
  }, "Primer-react")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_next_link___default.a, {
    href: "/docs",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Button"], {
    linkStyle: true,
    color: "white",
    py: 3,
    px: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    }
  }, "Docs")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_next_link___default.a, {
    href: "/dev-mode",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Button"], {
    linkStyle: true,
    color: "white",
    py: 3,
    px: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    }
  }, "Dev mode")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_next_link___default.a, {
    href: "/demos",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Button"], {
    linkStyle: true,
    color: "white",
    py: 3,
    px: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    }
  }, "Demos")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_next_link___default.a, {
    href: "/sandbox",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Button"], {
    linkStyle: true,
    color: "white",
    py: 3,
    mr: 0,
    px: 4,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    }
  }, "Sandbox"))));
};

Header.displayName = "Header";
/* harmony default export */ __webpack_exports__["a"] = (Header);

/***/ }),

/***/ "./pages/doc-components/MergeActions.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__src__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__MergeButton__ = __webpack_require__("./pages/doc-components/MergeButton.js");
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/MergeActions.js";





var MergeActions = function MergeActions(_ref) {
  var numCommits = _ref.numCommits,
      onClick = _ref.onClick,
      desktopUrl = _ref.desktopUrl,
      state = _ref.state;
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Box"], {
    py: 3,
    px: 4,
    bg: "gray.0",
    style: {
      borderBottomLeftRadius: '3px',
      borderBottomRightRadius: '3px'
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__MergeButton__["a" /* default */], {
    primary: state === 'ready',
    numCommits: numCommits,
    onClick: onClick,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
    ml: 2,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    }
  }, "You can also "), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Link"], {
    nounderline: true,
    href: desktopUrl,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    }
  }, "open this in Github Desktop"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    }
  }, " or view "), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["ButtonLink"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    }
  }, "command line instructions."));
};

MergeActions.displayName = "MergeActions";
MergeActions.propTypes = {
  desktopUrl: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  numCommits: __WEBPACK_IMPORTED_MODULE_3__MergeButton__["a" /* default */].propTypes.numCommits,
  onClick: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  state: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
};
/* harmony default export */ __webpack_exports__["a"] = (MergeActions);

/***/ }),

/***/ "./pages/doc-components/MergeBox.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__src__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__MergeDetail__ = __webpack_require__("./pages/doc-components/MergeDetail.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__MergeActions__ = __webpack_require__("./pages/doc-components/MergeActions.js");
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/MergeBox.js";





var stateColorMap = {
  ready: 'green.5',
  invalid: 'invalid',
  merged: 'purple.5',
  pending: 'yellow.5'
};

function getDesktopURL(repoUrl, branchName) {
  return "x-github-client://openRepo/".concat(repoUrl, "?branch=").concat(branchName);
}

var MergeBox = function MergeBox(_ref) {
  var state = _ref.state,
      repoUrl = _ref.repoUrl,
      branchName = _ref.branchName,
      numCommits = _ref.numCommits,
      onMerge = _ref.onMerge;
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    className: "d-flex flex-items-start",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["MergeStatus"], {
    state: state,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["PointerBox"], {
    ml: 3,
    borderColor: stateColorMap[state],
    caret: "left-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__MergeDetail__["a" /* default */], {
    state: state,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    }
  }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__MergeActions__["a" /* default */], {
    state: state,
    numCommits: numCommits,
    desktopUrl: getDesktopURL(repoUrl, branchName),
    onClick: onMerge,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    }
  })));
};

MergeBox.displayName = "MergeBox";
MergeBox.propTypes = {
  branchName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  numCommits: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.number.isRequired,
  onMerge: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  repoUrl: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  state: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOf(['ready', 'invalid', 'merged', 'pending']).isRequired
};
/* harmony default export */ __webpack_exports__["a"] = (MergeBox);

/***/ }),

/***/ "./pages/doc-components/MergeButton.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__src__);
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/MergeButton.js";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





var MergeButton = function MergeButton(_ref) {
  var numCommits = _ref.numCommits,
      onClick = _ref.onClick,
      primary = _ref.primary;
  var arrowStyles = {
    content: '',
    border: '4px solid',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    width: '0',
    height: '0'
  };
  var borderStyles = {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0'
  };
  var buttonSchemeProps = {};

  if (primary) {
    buttonSchemeProps.scheme = 'primary';
  }

  var commits = numCommits === 1 ? '1 commit' : "".concat(numCommits, " commits");
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    className: "BtnGroup",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Button"], _extends({}, buttonSchemeProps, {
    grouped: true,
    onClick: onClick,
    style: {
      borderRight: 0
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    }
  }), "Merge Pull Request"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Details"], {
    className: "details-reset d-flex float-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    }
  }, function (_ref2) {
    var toggle = _ref2.toggle;
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Button"], _extends({
      is: "summary"
    }, buttonSchemeProps, {
      onClick: toggle,
      style: borderStyles,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 36
      }
    }), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
      className: "d-inline-block v-align-middle",
      style: arrowStyles,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 37
      }
    })), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Box"], {
      position: "absolute",
      width: 300,
      mt: 1,
      style: {
        zIndex: 99999
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["PointerBox"], {
      caret: "top-left",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 40
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("ul", {
      className: "list-style-none p-0 m-0",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 41
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("li", {
      className: "border-bottom py-2 pl-4 pr-2",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
      is: "p",
      m: 0,
      fontSize: 1,
      fontWeight: "bold",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43
      }
    }, "Create a merge commit"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
      is: "p",
      m: 0,
      fontSize: 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 46
      }
    }, "All commits from this branch will be added to the base branch via a merge commit.")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("li", {
      className: "border-bottom py-2 pl-4 pr-2",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
      is: "p",
      m: 0,
      fontSize: 1,
      fontWeight: "bold",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 51
      }
    }, "Squash and merge"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
      is: "p",
      m: 0,
      fontSize: 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54
      }
    }, "The ", commits, " from this branch will be combined into one commit in the base branch.")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("li", {
      className: "py-2 pl-4 pr-2",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 58
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
      is: "p",
      m: 0,
      fontSize: 1,
      fontWeight: "bold",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59
      }
    }, "Rebase and merge"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
      is: "p",
      fontSize: 0,
      m: 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62
      }
    }, "The ", commits, " from this branch will be rebased and added to the base branch"))))));
  }));
};

MergeButton.displayName = "MergeButton";
MergeButton.defaultProps = {
  numCommits: 0
};
MergeButton.propTypes = {
  numCommits: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.number.isRequired,
  onClick: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  primary: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool
};
/* harmony default export */ __webpack_exports__["a"] = (MergeButton);

/***/ }),

/***/ "./pages/doc-components/MergeDetail.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__githubprimer_octicons_react__ = __webpack_require__("@githubprimer/octicons-react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__githubprimer_octicons_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__githubprimer_octicons_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__src__);
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/MergeDetail.js";




var stateColorMap = {
  ready: 'green.5',
  invalid: 'invalid',
  merged: 'purple.5',
  pending: 'yellow.5'
};

var MergeDetail = function MergeDetail(_ref) {
  var state = _ref.state;
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    className: "p-2 d-flex border-bottom",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Box"], {
    mt: 2,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["CircleOcticon"], {
    icon: __WEBPACK_IMPORTED_MODULE_2__githubprimer_octicons_react__["Check"],
    size: 32,
    bg: stateColorMap[state],
    color: "white",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  })), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Box"], {
    p: 2,
    display: "inline",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Text"], {
    is: "p",
    p: 0,
    m: 0,
    fontSize: 2,
    fontWeight: "bold",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    }
  }, "This branch has no conflicts with the base branch"), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__src__["Text"], {
    is: "p",
    pt: 1,
    m: 0,
    fontSize: 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    }
  }, "Merging can be performed automatically")));
};

MergeDetail.displayName = "MergeDetail";
MergeDetail.propTypes = {
  state: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOf(Object.keys(stateColorMap)).isRequired
};
/* harmony default export */ __webpack_exports__["a"] = (MergeDetail);

/***/ }),

/***/ "./pages/doc-components/SideNav.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_next_link__ = __webpack_require__("next/link");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_next_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_next_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__src__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components__ = __webpack_require__("./pages/components/index.js");
var _jsxFileName = "/Users/emplums/primer-react/pages/doc-components/SideNav.js";





var SideNav = function SideNav() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Box"], {
    bg: "gray.0",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["FlexContainer"], {
    flexDirection: "column",
    alignItems: "start",
    p: 5,
    borderBottom: 1,
    borderColor: "gray.2",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_next_link___default.a, {
    href: "/getting-started",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Button"], {
    linkStyle: true,
    color: "black",
    m: 0,
    mb: 3,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    }
  }, "Getting Started")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_next_link___default.a, {
    href: "/system-props",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Button"], {
    linkStyle: true,
    color: "black",
    m: 0,
    mb: 3,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    }
  }, "System Props")), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_next_link___default.a, {
    href: "/primer-theme",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Button"], {
    linkStyle: true,
    color: "black",
    m: 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  }, "Primer Theme"))), __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Box"], {
    pt: 5,
    pl: 5,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    }
  }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Text"], {
    fontWeight: "bold",
    is: "p",
    color: "black",
    m: 0,
    mb: 3,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    }
  }, "Components"), Object.values(__WEBPACK_IMPORTED_MODULE_3__components__).map(function (meta) {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Box"], {
      mb: 1,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 22
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_next_link___default.a, {
      key: meta.displayName,
      href: "/components/".concat(meta.displayName),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      }
    }, __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__src__["Button"], {
      linkStyle: true,
      m: 2,
      ml: 4,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      }
    }, meta.displayName)));
  })));
};

SideNav.displayName = "SideNav";
/* harmony default export */ __webpack_exports__["a"] = (SideNav);

/***/ }),

/***/ "./pages/doc-components/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MergeActions__ = __webpack_require__("./pages/doc-components/MergeActions.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MergeActions", function() { return __WEBPACK_IMPORTED_MODULE_0__MergeActions__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MergeBox__ = __webpack_require__("./pages/doc-components/MergeBox.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MergeBox", function() { return __WEBPACK_IMPORTED_MODULE_1__MergeBox__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__MergeButton__ = __webpack_require__("./pages/doc-components/MergeButton.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MergeButton", function() { return __WEBPACK_IMPORTED_MODULE_2__MergeButton__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__MergeDetail__ = __webpack_require__("./pages/doc-components/MergeDetail.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MergeDetail", function() { return __WEBPACK_IMPORTED_MODULE_3__MergeDetail__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ExampleHeading__ = __webpack_require__("./pages/doc-components/ExampleHeading.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ExampleHeading", function() { return __WEBPACK_IMPORTED_MODULE_4__ExampleHeading__["a"]; });






/***/ }),

/***/ "./src/index.js":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Plugin/Preset files are not allowed to export objects, only functions. In /Users/emplums/primer-react/node_modules/babel-preset-react/lib/index.js\n    at createDescriptor (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:179:11)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:104:12\n    at Array.map (<anonymous>)\n    at createDescriptors (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:103:27)\n    at createPresetDescriptors (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:95:10)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:67:19\n    at presets (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:57:25)\n    at mergeChainOpts (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:298:68)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:251:7\n    at buildRootChain (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:85:20)\n    at loadPrivatePartialConfig (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/partial.js:41:53)\n    at Object.loadPartialConfig (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/partial.js:66:16)\n    at Object.<anonymous> (/Users/emplums/primer-react/node_modules/next/node_modules/babel-loader/lib/index.js:82:26)\n    at Generator.next (<anonymous>)\n    at step (/Users/emplums/primer-react/node_modules/next/node_modules/babel-loader/lib/index.js:3:221)\n    at _next (/Users/emplums/primer-react/node_modules/next/node_modules/babel-loader/lib/index.js:3:409)");

/***/ }),

/***/ "./src/theme.js":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Plugin/Preset files are not allowed to export objects, only functions. In /Users/emplums/primer-react/node_modules/babel-preset-react/lib/index.js\n    at createDescriptor (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:179:11)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:104:12\n    at Array.map (<anonymous>)\n    at createDescriptors (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:103:27)\n    at createPresetDescriptors (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:95:10)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:67:19\n    at presets (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:57:25)\n    at mergeChainOpts (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:298:68)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:251:7\n    at buildRootChain (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:85:20)\n    at loadPrivatePartialConfig (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/partial.js:41:53)\n    at Object.loadPartialConfig (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/partial.js:66:16)\n    at Object.<anonymous> (/Users/emplums/primer-react/node_modules/next/node_modules/babel-loader/lib/index.js:82:26)\n    at Generator.next (<anonymous>)\n    at step (/Users/emplums/primer-react/node_modules/next/node_modules/babel-loader/lib/index.js:3:221)\n    at _next (/Users/emplums/primer-react/node_modules/next/node_modules/babel-loader/lib/index.js:3:409)");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/_app.js");


/***/ }),

/***/ "@babel/runtime/regenerator":
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "@compositor/kit":
/***/ (function(module, exports) {

module.exports = require("@compositor/kit");

/***/ }),

/***/ "@githubprimer/octicons-react":
/***/ (function(module, exports) {

module.exports = require("@githubprimer/octicons-react");

/***/ }),

/***/ "@mdx-js/tag":
/***/ (function(module, exports) {

module.exports = require("@mdx-js/tag");

/***/ }),

/***/ "emotion-theming":
/***/ (function(module, exports) {

module.exports = require("emotion-theming");

/***/ }),

/***/ "mdx-docs":
/***/ (function(module, exports) {

module.exports = require("mdx-docs");

/***/ }),

/***/ "next/app":
/***/ (function(module, exports) {

module.exports = require("next/app");

/***/ }),

/***/ "next/link":
/***/ (function(module, exports) {

module.exports = require("next/link");

/***/ }),

/***/ "prop-types":
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
//# sourceMappingURL=_app.js.map