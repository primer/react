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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ({

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),

/***/ 17:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Plugin/Preset files are not allowed to export objects, only functions. In /Users/emplums/primer-react/node_modules/babel-preset-react/lib/index.js\n    at createDescriptor (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:179:11)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:104:12\n    at Array.map (<anonymous>)\n    at createDescriptors (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:103:27)\n    at createPresetDescriptors (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:95:10)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:67:19\n    at presets (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-descriptors.js:57:25)\n    at mergeChainOpts (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:298:68)\n    at /Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:251:7\n    at buildRootChain (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/config-chain.js:85:20)\n    at loadPrivatePartialConfig (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/partial.js:41:53)\n    at Object.loadPartialConfig (/Users/emplums/primer-react/node_modules/@babel/core/lib/config/partial.js:66:16)\n    at Object.<anonymous> (/Users/emplums/primer-react/node_modules/babel-loader/lib/index.js:82:26)\n    at Generator.next (<anonymous>)\n    at step (/Users/emplums/primer-react/node_modules/babel-loader/lib/index.js:3:221)\n    at _next (/Users/emplums/primer-react/node_modules/babel-loader/lib/index.js:3:409)");

/***/ })

/******/ });