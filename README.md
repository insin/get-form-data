# get-form-data

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Gets form data - or data for a named form element - via `form.elements`.

Data is retrieved in a format similar to request parameters which would be sent if the form was submitted, so this module is suitable for extracting form data on the client side for projects which implement ismorphic handling of form submission.

## Install

```
npm install get-form-data
```

Browser bundles area abailable, which export a global `getFormData` variable.

* [get-form-data.js](https://npmcdn.com/get-form-data/umd/get-form-data.js) (development version)
* [get-form-data.min.js](https://npmcdn.com/get-form-data/umd/get-form-data.min.js) (compressed production version)

## Usage

### Getting form data

To get data for an entire form, use the `getFormData()` function:

```html
<form id="productForm">
  ...
  <label>Product:</label>
  <select name="product">
    <option value="1" selected>T-shirt</option>
    <option value="2">Hat</option>
    <option value="3">Shoes</option>
  </select>

  <label>Quantity:</label>
  <input type="number" name="quantity" min="0" step="1" value="9">

  <label>Express shipping</label>
  <p>Do you want to use <a href="/shipping#express">Express Shipping</a>?</p>
  <div class="radios">
    <label><input type="radio" name="shipping" value="express" checked> Yes</label>
    <label><input type="radio" name="shipping" value="regular"> No</label>
  </div>

  <label>Terms of Service:</label>
  <p>I have read and agree to the <a href="/">Terms of Service</a>.</p>
  <label class="checkbox"><input type="checkbox" name="tos" value="Y" checked> Yes</label>
  ...
</form>
```
```javascript
var form = document.querySelector('#productForm')

var data = getFormData(form)

console.log(JSON.stringify(data))
```
```
{"product": "1", "quantity": "9", "shipping": "express", "tos": "Y"}
```

### Getting field data

To get data for individual form elements (which may contain multiple form inputs with the same name), use the `getNamedFormElementData()` function, which is exposed as a property of `getFormData`:

```html
<form id="tshirtForm">
  ...
  <label>Sizes:</label>
  <div class="checkboxes">
    <label><input type="checkbox" name="sizes" value="S"> S</label>
    <label><input type="checkbox" name="sizes" value="M" checked> M</label>
    <label><input type="checkbox" name="sizes" value="L" checked> L</label>
  </div>
  ...
</form>
```
```javascript
// You probably want to alias the function :)
var getFieldData = getFormData.getNamedFormElementData

var form = document.querySelector('#tshirtForm')

var sizes = getFieldData(form, 'sizes')

console.log(JSON.stringify(sizes))
```
```
["M", "L"]
```

### Trimming user input

To trim user input, pass a `trim` option to `getFormData()` or `getNamedFormElementData()`:

```html
<form id="signupForm">
  ...
  <label>Username:</label>
  <input type="text" name="username" value="AzureDiamond  ">

  <label>Password:</label>
  <input type="password" name="password" value=" hunter2 ">
  ...
</form>
```
```javascript
var form = document.querySelector('#signupForm')

var data = getFormData(form, {trim: true})

console.log(JSON.stringify(data))
```
```
{"username": "AzureDiamond", "password": "hunter2"}
```

### File Inputs

Where possible, data extracted from `<input type="file">` will be native
[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) objects.

If the `.files` property is not available, the `.value` property will be used to provide data instead.

## API

### `getFormData(form: HTMLFormElement[, options: Object])`

Extracts data from a `<form>`'s `.elements` collection - in order to use `.elements`, form inputs must have `name` or `id` attributes. Since multiple inputs can't have the same `id` and a `name` allows an input to qualify as a successful control for form submission, `name` attributes are preferred and will be given priority if both are present.

The following options can be configured:

* `trim: Boolean` (default: `false`) - if `true`, leading and trailing whitespace will be trimmed from user input in text entry form inputs.

#### Return type: `Object<String, String|Array.<String>|File|Array.<File>`

Properties in the returned data object are mostly consistent with what would have been sent as request parameters if the form had been submitted:

* All disabled inputs are ignored
* Text inputs will always contribute a value, which will be `''` if they are empty.
* Checkbox inputs will only contribute a value if they are checked, in which case their `value` attribute will be used.
* Form elements which represent multiple values (select-multiple, or multiple inputs with the same name, file inputs with `multiple`) will only contribute a value if they have at least one value to submit. Their values will always be held in an `Array`, even if there is only one.

An exception to this is that buttons are completely ignored, as it's only possible to determine which button counts as successful after it's been used to submit the form.

### `getNamedFormElementData(form: HTMLFormElement, elementName: String[, options: Object])`

Extracts data for a named element from a  `<form>`'s `.elements` collection.

Options are as documented for `getFormData`.

#### Return type: `null|String|Array.<String>|File|Array.<File>`

This function is used by `getFormData()`, so the documentation for individual return values above also applies.

`null` will be returned if the named element is non-existent, disabled, or shouldn't contribute a value (unchecked checkboxes, multiple selects with no selections, file inputs with no selections).

## MIT Licensed

[build-badge]: https://img.shields.io/travis/insin/get-form-data/master.svg?style=flat-square
[build]: https://travis-ci.org/insin/get-form-data

[npm-badge]: https://img.shields.io/npm/v/get-form-data.svg?style=flat-square
[npm]: https://www.npmjs.org/package/get-form-data

[coveralls-badge]: https://img.shields.io/coveralls/insin/get-form-data/master.svg?style=flat-square
[coveralls]: https://coveralls.io/github/insin/get-form-data
