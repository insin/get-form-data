QUnit.module('get-form-data')


QUnit.test('getFormData', function() {
  var form = document.querySelector('#testForm')
  deepEqual(getFormData(form), {
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
})

QUnit.test('getNamedFormElementData', function() {
  var getData = getFormData.getNamedFormElementData
  var form = document.querySelector('#testForm')
  deepEqual(getData(form, 'checkedRadio'), '2', 'special case for radio select mutiple - single value rather than a list')

  deepEqual(getData(form, 'multipleCheckbox'), null, 'null for multiple checkboxes with nothing checked')
  deepEqual(getData(form, 'checkOneMultipleCheckbox'), ['3'], 'list for 1 checked in multiple checkbox')
  deepEqual(getData(form, 'checkTwoMultipleCheckbox'), ['1', '3'], 'list for >1 checked in multiple checkboxes')

  deepEqual(getData(form, 'selectMultiple'), null, 'null for select multiple with nothing selected')
  deepEqual(getData(form, 'selectOneSelectMultiple'), ['3'], 'list for 1 selected in select multiple')
  deepEqual(getData(form, 'selectTwoSelectMultiple'), ['1', '3'], 'list for >1 selected in select multiple')
})