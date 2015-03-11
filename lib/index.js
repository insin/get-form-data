'use strict';

var NODE_LIST_CLASSES = {
  '[object HTMLCollection]': true
, '[object NodeList]': true
, '[object RadioNodeList]': true
}

var IGNORED_INPUT_TYPES = {
  'button': true
, 'reset': true
, 'submit': true
, 'fieldset': true
}

var CHECKED_INPUT_TYPES = {
  'checkbox': true
, 'radio': true
}

var TRIM_RE = /^\s+|\s+$/g

var slice = Array.prototype.slice
var toString = Object.prototype.toString

/**
 * @param {HTMLFormElement} form
 * @return {Object.<string,(string|Array.<string>)>} an object containing
 *   submittable value(s) held in the form's .elements collection, with
 *   properties named as per element names or ids.
 */
function getFormData(form, options) {
  if (!form) {
    throw new Error('A form is required by getFormData, was given form=' + form)
  }

  if (!options) {
    options = {trim: false}
  }

  var data = {}
  var elementName
  var elementNames = []
  var elementNameLookup = {}

  // Get unique submittable element names for the form
  for (var i = 0, l = form.elements.length; i < l; i++) {
    var element = form.elements[i]
    if (IGNORED_INPUT_TYPES[element.type] || element.disabled) {
      continue
    }
    elementName = element.name || element.id
    if (!elementNameLookup[elementName]) {
      elementNames.push(elementName)
      elementNameLookup[elementName] = true
    }
  }

  // Extract element data name-by-name for consistent handling of special cases
  // around elements which contain multiple inputs.
  for (i = 0, l = elementNames.length; i < l; i++) {
    elementName = elementNames[i]
    var value = getNamedFormElementData(form, elementName, options)
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
 *   named element from its .elements collection, or null if there was no
 *   element with that name or the element had no submittable value(s).
 */
function getNamedFormElementData(form, elementName, options) {
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

  var trim = !!(options && options.trim)

  if (!NODE_LIST_CLASSES[toString.call(element)]) {
    return getFormElementValue(element, trim)
  }

  // Deal with multiple form controls which have the same name
  var data = []
  var allRadios = true
  for (var i = 0, l = element.length; i < l; i++) {
    if (element[i].disabled) {
      continue
    }
    if (allRadios && element[i].type !== 'radio') {
      allRadios = false
    }
    var value = getFormElementValue(element[i], trim)
    if (value != null) {
      data = data.concat(value)
    }
  }

  // Special case for an element with multiple same-named inputs which were all
  // radio buttons: if there was a selected value, only return the value.
  if (allRadios && data.length === 1) {
    return data[0]
  }

  return (data.length > 0 ? data : null)
}

/**
 * @param {HTMLElement} element a form element.
 * @param {booleam} trim should values for text entry inputs be trimmed?
 * @return {(string|Array.<string>|File|Array.<File>)} the element's submittable
 *   value(s), or null if it had none.
 */
function getFormElementValue(element, trim) {
  var value = null

  if (element.type === 'select-one') {
    if (element.options.length) {
      value = element.options[element.selectedIndex].value
    }
    return value
  }

  if (element.type === 'select-multiple') {
    value = []
    for (var i = 0, l = element.options.length; i < l; i++) {
      if (element.options[i].selected) {
        value.push(element.options[i].value)
      }
    }
    if (value.length === 0) {
      value = null
    }
    return value
  }

  // If a file input doesn't have a files attribute, fall through to using its
  // value attribute.
  if (element.type === 'file' && 'files' in element) {
    if (element.multiple) {
      value = slice.call(element.files)
      if (value.length === 0) {
        value = null
      }
    }
    else {
      // Should be null if not present, according to the spec
      value = element.files[0]
    }
    return value
  }

  if (!CHECKED_INPUT_TYPES[element.type]) {
    value = (trim ? element.value.replace(TRIM_RE, '') : element.value)
  }
  else if (element.checked) {
    value = element.value
  }

  return value
}

getFormData.getNamedFormElementData = getNamedFormElementData

module.exports = getFormData
