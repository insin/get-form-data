/*!
 * get-form-data 1.2.2 - https://github.com/insin/get-form-data
 * MIT Licensed
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["getFormData"] = factory();
	else
		root["getFormData"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var NODE_LIST_CLASSES = {
	  '[object HTMLCollection]': true,
	  '[object NodeList]': true,
	  '[object RadioNodeList]': true
	};

	var IGNORED_INPUT_TYPES = {
	  'button': true,
	  'reset': true,
	  'submit': true,
	  'fieldset': true
	};

	var CHECKED_INPUT_TYPES = {
	  'checkbox': true,
	  'radio': true
	};

	var TRIM_RE = /^\s+|\s+$/g;

	var slice = Array.prototype.slice;
	var toString = Object.prototype.toString;

	/**
	 * @param {HTMLFormElement} form
	 * @param {Object} options
	 * @return {Object.<string,(string|Array.<string>)>} an object containing
	 *   submittable value(s) held in the form's .elements collection, with
	 *   properties named as per element names or ids.
	 */
	function getFormData(form) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? { trim: false } : arguments[1];

	  if (!form) {
	    throw new Error('A form is required by getFormData, was given form=' + form);
	  }

	  var data = {};
	  var elementName = undefined;
	  var elementNames = [];
	  var elementNameLookup = {};

	  // Get unique submittable element names for the form
	  for (var i = 0, l = form.elements.length; i < l; i++) {
	    var element = form.elements[i];
	    if (IGNORED_INPUT_TYPES[element.type] || element.disabled) {
	      continue;
	    }
	    elementName = element.name || element.id;
	    if (elementName && !elementNameLookup[elementName]) {
	      elementNames.push(elementName);
	      elementNameLookup[elementName] = true;
	    }
	  }

	  // Extract element data name-by-name for consistent handling of special cases
	  // around elements which contain multiple inputs.
	  for (var i = 0, l = elementNames.length; i < l; i++) {
	    elementName = elementNames[i];
	    var value = getNamedFormElementData(form, elementName, options);
	    if (value != null) {
	      data[elementName] = value;
	    }
	  }

	  return data;
	}

	/**
	 * @param {HTMLFormElement} form
	 * @param {string} elementName
	 * @param {Object} options
	 * @return {(string|Array.<string>)} submittable value(s) in the form for a
	 *   named element from its .elements collection, or null if there was no
	 *   element with that name or the element had no submittable value(s).
	 */
	function getNamedFormElementData(form, elementName) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? { trim: false } : arguments[2];

	  if (!form) {
	    throw new Error('A form is required by getNamedFormElementData, was given form=' + form);
	  }
	  if (!elementName && toString.call(elementName) !== '[object String]') {
	    throw new Error('A form element name is required by getNamedFormElementData, was given elementName=' + elementName);
	  }

	  var element = form.elements[elementName];
	  if (!element || element.disabled) {
	    return null;
	  }

	  if (!NODE_LIST_CLASSES[toString.call(element)]) {
	    return getFormElementValue(element, options.trim);
	  }

	  // Deal with multiple form controls which have the same name
	  var data = [];
	  var allRadios = true;
	  for (var i = 0, l = element.length; i < l; i++) {
	    if (element[i].disabled) {
	      continue;
	    }
	    if (allRadios && element[i].type !== 'radio') {
	      allRadios = false;
	    }
	    var value = getFormElementValue(element[i], options.trim);
	    if (value != null) {
	      data = data.concat(value);
	    }
	  }

	  // Special case for an element with multiple same-named inputs which were all
	  // radio buttons: if there was a selected value, only return the value.
	  if (allRadios && data.length === 1) {
	    return data[0];
	  }

	  return data.length > 0 ? data : null;
	}

	/**
	 * @param {HTMLElement} element a form element.
	 * @param {booleam} trim should values for text entry inputs be trimmed?
	 * @return {(string|Array.<string>|File|Array.<File>)} the element's submittable
	 *   value(s), or null if it had none.
	 */
	function getFormElementValue(element, trim) {
	  var value = null;
	  var type = element.type;

	  if (type === 'select-one') {
	    if (element.options.length) {
	      value = element.options[element.selectedIndex].value;
	    }
	    return value;
	  }

	  if (type === 'select-multiple') {
	    value = [];
	    for (var i = 0, l = element.options.length; i < l; i++) {
	      if (element.options[i].selected) {
	        value.push(element.options[i].value);
	      }
	    }
	    if (value.length === 0) {
	      value = null;
	    }
	    return value;
	  }

	  // If a file input doesn't have a files attribute, fall through to using its
	  // value attribute.
	  if (type === 'file' && 'files' in element) {
	    if (element.multiple) {
	      value = slice.call(element.files);
	      if (value.length === 0) {
	        value = null;
	      }
	    } else {
	      // Should be null if not present, according to the spec
	      value = element.files[0];
	    }
	    return value;
	  }

	  if (!CHECKED_INPUT_TYPES[type]) {
	    value = trim ? element.value.replace(TRIM_RE, '') : element.value;
	  } else if (element.checked) {
	    value = element.value;
	  }

	  return value;
	}

	getFormData.getNamedFormElementData = getNamedFormElementData;

	exports['default'] = getFormData;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;