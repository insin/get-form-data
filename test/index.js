QUnit.test('getFormData', function(t) {
  var form = document.querySelector('#testForm')
  t.deepEqual(getFormData(form), {
    checkOneMultipleCheckbox: ['3']
  , checkTwoMultipleCheckbox: ['1', '3']
  , checkedCheckbox: 'checkedCheckbox'
  , checkedRadio: '2'
  , hiddenInput: 'hiddenInput'
  , selectedSelect: '2'
  , selectOneSelectMultiple: ['3']
  , selectTwoSelectMultiple: ['1', '3']
  , textarea: 'textarea'
  , textInput: 'textInput'
  , unselectedSelect: ''
  }, 'buttons and disabled elements ignored, data extracted consistently')

  t.raises(
    function() { getFormData() },
    /A form is required by getFormData, was given form=undefined/,
    'Error if form is not provided'
  )
})

QUnit.test('getNamedFormElementData', function(t) {
  var getData = getFormData.getNamedFormElementData
  var form = document.querySelector('#testForm')
  t.deepEqual(getData(form, 'checkedRadio'), '2', 'special case for radio select mutiple - single value rather than a list')

  t.deepEqual(getData(form, 'multipleCheckbox'), null, 'null for multiple checkboxes with nothing checked')
  t.deepEqual(getData(form, 'checkOneMultipleCheckbox'), ['3'], 'list for 1 checked in multiple checkbox')
  t.deepEqual(getData(form, 'checkTwoMultipleCheckbox'), ['1', '3'], 'list for >1 checked in multiple checkboxes')

  t.deepEqual(getData(form, 'selectMultiple'), null, 'null for select multiple with nothing selected')
  t.deepEqual(getData(form, 'selectOneSelectMultiple'), ['3'], 'list for 1 selected in select multiple')
  t.deepEqual(getData(form, 'selectTwoSelectMultiple'), ['1', '3'], 'list for >1 selected in select multiple')

  t.raises(
    function() { getData() },
    /A form is required by getNamedFormElementData, was given form=undefined/,
    'Error if form is not provided'
  )

  t.raises(
    function() { getData(form) },
    /A form element name is required by getNamedFormElementData, was given elementName=undefined/,
    'Error if element name is not provided'
  )
})

QUnit.module('README examples')

QUnit.test('getFormData', function(t) {
  var form = document.querySelector('#productForm')
  var data = getFormData(form)
  t.deepEqual(getFormData(form), {
    product: "1"
  , quantity: "9"
  , shipping: 'express'
  , tos: 'Y'
  }, 'Data: ' + JSON.stringify(data))
})

QUnit.test('getNamedFormElementData', function(t) {
  var getFieldData = getFormData.getNamedFormElementData
  var form = document.querySelector('#tshirtForm')
  var data = getFieldData(form, 'sizes')
  t.deepEqual(getFieldData(form, 'sizes'), ['M', 'L'], 'Data: ' + JSON.stringify(data))
})