import test from 'tape'

import getFormData, {getNamedFormElementData as getFieldData} from 'src/index'
import fixture from './fixture'

document.body.innerHTML = fixture

test('getFormData', t => {
  t.plan(2)

  let form = document.querySelector('#testForm')

  t.deepEqual(getFormData(form), {
    checkOneMultipleCheckbox: ['3'],
    checkTwoMultipleCheckbox: ['1', '3'],
    checkedCheckbox: 'checkedCheckbox',
    checkedRadio: '2',
    hiddenInput: 'hiddenInput',
    partiallyDisabledMultipleCheckbox: ['3'],
    selectedSelect: '2',
    selectOneSelectMultiple: ['3'],
    selectTwoSelectMultiple: ['1', '3'],
    textarea: 'textarea',
    textInput: 'textInput',
    unselectedSelect: ''
  }, 'buttons and disabled elements ignored, data extracted consistently')

  t.throws(
    () => getFormData(),
    /A form is required by getFormData, was given form=undefined/,
    'Error if form is not provided'
  )
})

test('getNamedFormElementData', t => {
  t.plan(10)

  let form = document.querySelector('#testForm')

  t.deepEqual(getFieldData(form, 'checkedRadio'), '2', 'special case for radio select mutiple - single value rather than a list')

  t.deepEqual(getFieldData(form, 'multipleCheckbox'), null, 'null for multiple checkboxes with nothing checked')
  t.deepEqual(getFieldData(form, 'checkOneMultipleCheckbox'), ['3'], 'list for 1 checked in multiple checkbox')
  t.deepEqual(getFieldData(form, 'checkTwoMultipleCheckbox'), ['1', '3'], 'list for >1 checked in multiple checkboxes')

  t.deepEqual(getFieldData(form, 'selectMultiple'), null, 'null for select multiple with nothing selected')
  t.deepEqual(getFieldData(form, 'selectOneSelectMultiple'), ['3'], 'list for 1 selected in select multiple')
  t.deepEqual(getFieldData(form, 'selectTwoSelectMultiple'), ['1', '3'], 'list for >1 selected in select multiple')

  t.throws(
    () => getFieldData(),
    /A form is required by getNamedFormElementData, was given form=undefined/,
    'Error if form is not provided'
  )

  t.throws(
    () => getFieldData(form),
    /A form element name is required by getNamedFormElementData, was given elementName=undefined/,
    'Error if element name is not provided'
  )

  t.equal(getFieldData(form, ''), null, 'null if an empty string is given as element name')
})

test('trim option', t => {
  t.plan(5)

  let form = document.querySelector('#trimForm')

  t.deepEqual(getFormData(form), {
    username: ' AzureDiamond',
    password: 'hunter2 ',
    message: ' Hello ',
    tos: ' Y '
  }, 'getFormData trims nothing by default')

  // A trim option can be passed to getFormData
  let trimmedData = getFormData(form, {trim: true})
  t.deepEqual(trimmedData, {
    username: 'AzureDiamond',
    password: 'hunter2',
    message: 'Hello',
    tos: ' Y '
  }, 'getFormData only trims text inputs with {trim: true}')

  // A trim option can also be passed directly to getNamedFormElementData
  t.equal(getFormData.getNamedFormElementData(form, 'username'),
          ' AzureDiamond',
          'getNamedFormElementData trims nothing by default')
  t.equal(getFormData.getNamedFormElementData(form, 'username', {trim: true}),
          'AzureDiamond',
          'getNamedFormElementData trims text inputs with {trim: true}')
  t.equal(getFormData.getNamedFormElementData(form, 'tos', {trim: true}),
          ' Y ',
          'getNamedFormElementData doesn\'t trim non-text inputs with {trim: true}')
})

test('README example - getFormData', t => {
  t.plan(1)
  let form = document.querySelector('#productForm')
  let data = getFormData(form)
  t.deepEqual(data, {
    product: '1',
    quantity: '9',
    shipping: 'express',
    tos: 'Y'
  }, `Data: ${JSON.stringify(data)}`)
})

test('README example - getNamedFormElementData', t => {
  t.plan(1)
  let form = document.querySelector('#tshirtForm')
  let data = getFieldData(form, 'sizes')
  t.deepEqual(data, ['M', 'L'], `Data: ${JSON.stringify(data)}`)
})

test('README example - trimming', t => {
  t.plan(1)
  let form = document.querySelector('#signupForm')
  let data = getFormData(form, {trim: true})
  t.deepEqual(data, {
    username: 'AzureDiamond',
    password: 'hunter2'
  }, `Data: ${JSON.stringify(data)}`)
})
