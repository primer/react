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

/***/ "./pages/_app.js":
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: /Users/emplums/primer-react/pages/_app.js: Unexpected token (32:6)\n\n  30 | \n  31 |     return (\n> 32 |       <Container>\n     |       ^\n  33 |         <Layout\n  34 |           components={components}\n  35 |           {...this.props}\n    at Parser.raise (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:778:15)\n    at Parser.unexpected (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2063:16)\n    at Parser.parseExprAtom (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:3125:20)\n    at Parser.parseExprSubscripts (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2725:21)\n    at Parser.parseMaybeUnary (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2704:21)\n    at Parser.parseExprOps (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2616:21)\n    at Parser.parseMaybeConditional (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2588:21)\n    at Parser.parseMaybeAssign (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2546:21)\n    at Parser.parseParenAndDistinguishExpression (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:3271:28)\n    at Parser.parseExprAtom (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:3081:21)\n    at Parser.parseExprSubscripts (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2725:21)\n    at Parser.parseMaybeUnary (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2704:21)\n    at Parser.parseExprOps (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2616:21)\n    at Parser.parseMaybeConditional (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2588:21)\n    at Parser.parseMaybeAssign (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2546:21)\n    at Parser.parseExpression (/Users/emplums/primer-react/node_modules/@babel/core/node_modules/babylon/lib/index.js:2499:21)");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/_app.js");


/***/ })

/******/ });
//# sourceMappingURL=_app.js.map