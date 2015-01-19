/*!
 * get-form-data 1.0.1 - https://github.com/insin/get-form-data
 * MIT Licensed
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.getFormData=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var NODE_LIST_CLASSES = {
  '[object HTMLCollection]': true
, '[object NodeList]': true
, '[object RadioNodeList]': true
}

var BUTTON_INPUT_TYPES = {
  'button': true
, 'reset': true
, 'submit': true
}

var CHECKED_INPUT_TYPES = {
  'checkbox': true
, 'radio': true
}

var toString = Object.prototype.toString

/**
 * @param {HTMLFormElement} form
 * @return {Object.<string,(string|Array.<string>)>} an object containing
 *   submittable value(s) held in the form's .elements collection, with
 *   properties named as per element names or ids.
 */
function getFormData(form) {
  if (!form) {
    throw new Error('A form is required by getFormData, was given form=' + form)
  }

  var data = {}
  var elementName
  var elementNames = []
  var elementNameLookup = {}

  // Get unique element names for the form
  for (var i = 0, l = form.elements.length; i < l; i++) {
    var element = form.elements[i]
    if (BUTTON_INPUT_TYPES[element.type] || element.disabled) {
      continue
    }
    elementName = element.name || element.id
    if (!elementNameLookup[elementName]) {
      elementNames.push(elementName)
      elementNameLookup[elementName] = true
    }
  }

  // Extract data name-by-name for consistent handling of special cases around
  // elements which contain multiple inputs.
  for (i = 0, l = elementNames.length; i < l; i++) {
    elementName = elementNames[i]
    var value = getNamedFormElementData(form, elementName)
    if (value != null) {
      data[elementName] = value
    }
  }

  return data
}

/**
 * @param {HTMLFormElement} form
 * @param {string} elementName
 * @return {(string|Array.<string>)} submittable value(s) in the form for a
 *   named element from its .elemnts collection, or null if there was no
 *   element with that name or the element had no submittable value(s).
 */
function getNamedFormElementData(form, elementName) {
  if (!form) {
    throw new Error('A form is required by getNamedFormElementData, was given form=' + form)
  }
  if (!elementName) {
    throw new Error('A form element name is required by getNamedFormElementData, was given elementName=' + elementName)
  }

  var element = form.elements[elementName]
  if (!element || element.disabled) {
    return null
  }

  if (!NODE_LIST_CLASSES[toString.call(element)]) {
    return getFormElementValue(element)
  }

  // Deal with multiple form controls which have the same name
  var data = []
  var allRadios = true
  for (var i = 0, l = element.length; i < l; i++) {
    if (element.disabled) {
      continue
    }
    if (allRadios && element[i].type !== 'radio') {
      allRadios = false
    }
    var value = getFormElementValue(element[i])
    if (value != null) {
      data = data.concat(value)
    }
  }
  if (allRadios && data.length === 1) {
    return data[0]
  }
  return (data.length > 0 ? data : null)
}

/**
 * @param {HTMLElement} element a form element.
 * @return {(string|Array.<string>)} the element's submittable value(s), or null
 *   if it had none.
 */
function getFormElementValue(element) {
  var value = null

  if (element.type === 'select-one') {
    if (element.options.length) {
      value = element.options[element.selectedIndex].value
    }
  }
  else if (element.type === 'select-multiple') {
    value = []
    for (var i = 0, l = element.options.length; i < l; i++) {
      if (element.options[i].selected) {
        value.push(element.options[i].value)
      }
    }
    if (value.length === 0) {
      value = null
    }
  }
  else if (!CHECKED_INPUT_TYPES[element.type] || element.checked) {
    value = element.value
  }

  return value
}

getFormData.getNamedFormElementData = getNamedFormElementData

module.exports = getFormData
},{}]},{},[1])(1)
});