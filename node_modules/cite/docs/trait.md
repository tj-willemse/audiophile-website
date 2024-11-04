# Trait
These methods belong to all the traits

### .prefix(str)
Text inserted before the value entered

### .suffix(str)
Text inserter after the value entered

### .stub(str)
Set a trait to display a string if no data is given and the
trait is optional. For example `n.d.`

### .italics() or .bold()
Style the trait

```js
.bold()               // prefix, suffix and main
.bold(true)           // prefix, suffix and main
.bold('prefix')       // just prefix
.bold('main suffix')  // suffix and value
.bold(false)          // no styling
```

### .show()
This will ensure the trait is showing. This is the default
behaviour.

### .hide()
This will ensure the trait is hidden.

### .optional()
This will give the user the option to include the trait or
not.

### .enum()

Enum is used to set specific values for traits. This would
most likely be used to render a dropdown on the form.

For each item you want to `.add(label, content, opts)` to the
enum, you must specify a `label` which is what is displayed
on the dropdown item, and is stored in the database. `content`
is the value to display when that item is selected.

You can also specify extra `options` such as `selector` to
specify what data you have to send in to select.

You **SHOULD NOT** add options to `.enum()` in `.upon()`'s
because this could cause changes to the form when certain things
happen and this will piss the user off. You can however alter
the `content` in upons, look below for example.

You can also use upons to change things based on a selected item.
Look below for examples.


```js
// resets enum for current trait
.emum()
  .add('Edition', ' Ed.')
  .add('Revised Edition', ' Rev. Ed.')

// using selectors
.emum()
  .add('Edition', ' Ed.', {selector:'a'})
  .add('Revised Edition', ' Rev. Ed.', {selector:'b'})


// you can change enum content in upons.
.upon('foo', function(){
  this.set('trait', function(){
    // '0' references the enum item index.
    trait.enum({0: ' REV. ED.'})
  })
})

// upon
.upon('trait.0', function(){
  // do something when enum 0 selected on trait
})
.upon('-trait.1', function(){
  // do something when enum 1 is not selected on trait
})


```
