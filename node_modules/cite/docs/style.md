# Style API

### .inherit(fn)
Use this to add default settings about traits and the style.
In the function, you are most like to use `.set()` along
with any of the visibility methods.

### .set(trait, options)
Set options for trait with either an object or function

```js
.set('title', {suffix: ' & '});
.set('title', function(){
  this.prefix('title:')
});
```

### .trait(name, fn, inherit)
Use this to add a new trait to the style you are creating.
These have to called in the order you want them to display.
To find the available options, please see the Trait Docs.

```js
.trait('title')
```

it can also include prefix and suffixes. The prefix being a
space, and suffix being a comma space.

```js
.trait(' title, ')
```

You can pass in an object to the trait to set it up.

```js
.trait('title', {prefix: 'something'})
```
or pass in a function

```js
.trait('title', function(title){
  title.prefix('foo')
})
```

If you've used `.inherit()`, You can also prevent a trait
from inheriting its settings, by setting the last arg to
false. This will initialise the trait with blank settings

```js
.trait('title', {}, false)
```

### .show(trait)
This will ensure a trait is showing. This is the default
behaviour.

### .hide(trait)
This will ensure a trait is hidden.

### .optional(trait)
This will give the user the option to include the trait or
not.

### .either(traits)
This will setup the style so that only one of the traits
will be allowed at once. You can also optionally specify the
last argument to allow ALL the traits to be optional

```js
.either('title', 'publisher')
.either('authors', 'editors', {optional: true})
```

### .all(traits)
This will setup the style so that all of the traits must be
specified. Same options as above regarding optionality

```js
.all('title', 'publisher')
.all('authors', 'editors', {optional: true})
```

### .atleast(traits)
This will setup the style so that the style must have at least
the traits specified

```js
.atleast('title', 'publisher')
```

### .if(traits, fn)
Easy if trait exists and not exists statements.

```js
.if('title', '-publisher', function(){
  this.set('title', {suffix: '!'});
  // sets suffix to "!" if title exists AND no publisher
})
```

### .upon(traits, fn)
Same as the `.if()`, but applied at the end, when all traits
setup.

```js
.upon('title', '-publisher', function(){
  // stuff goes here
})
```

### .move(trait, options)
This will move the trait in the list of traits. Only needed
when using if or upon.

```js
.if('-authors', '-editors', '-corpAuthor', function(){
  this.move('title', {before: 'title'});
  // can also use
  this.move('title', {after: 'publisher'})
  this.move('title', {start: true})
  this.move('title', {end: true})
})
```
