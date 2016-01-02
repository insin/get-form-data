# 1.2.5 / 2016-01-02

Added ES6 modules build.

# 1.2.4 / 2015-11-12

Changed UMD build directory.

# 1.2.3 / 2015-11-08

Changed how the module is published to npm.

# 1.2.2 / 2015-04-27

Fixed: Ignore form elements with empty names in `getFormData()`; don't throw on
empty element names in `getNamedFormElementData()`
[[#3](https://github.com/insin/get-form-data/issues/3)]

# 1.2.1 / 2015-03-11

Fixed: Ignore any `<fieldset>` elements which appear in `form.elements`
[[sixsided](https://github.com/sixsided)]

# 1.2.0 / 2015-03-05

Changed: Return a `File` object for `<input type="file">` where supported, or a
list of `File` objects if it uses `multiple`.

# 1.1.0 / 2015-02-05

Added: `trim` option for `getFormData()` and `getNamedFormElementData()`.

Fixed: ignoring of individial disabled inputs when multiple inputs have the same
name.

# 1.0.1 / 2015-01-19

Fixed: incorrect function names in error messages.

# 1.0.0 / 2015-01-19

First release.
