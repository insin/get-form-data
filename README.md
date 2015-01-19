# get-form-data

Get a form's data or a named form element's data via `form.elements`.

## Install

### Node.js

get-form-data can be bundled for the client using an npm-compatible packaging
system such as [Browserify](http://browserify.org/) or
[webpack](http://webpack.github.io/).

```
npm install get-form-data
```

### Browser bundle

The browser bundle exposes a global `getFormData` variable.

You can find it in the [/dist directory](https://github.com/insin/get-form-data/tree/master/dist).

## Usage

### Getting form data

To get data for an entire form, use the `getFormData(form)` function:

```html
<form id="productForm">
  ...
  <Label>Product:</label>
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

To get data for individual form elements (which may contain multiple form inputs
with the same name), use the `getNamedFormElementData(form, elementName)`
function, which is exposed as a proprety of `getFormData`:

```html
<form id="tshirtForm">
  ...
  <Label>Sizes:</label>
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

## MIT Licensed