# Contributor Trait
This is a trait for use with contributors such as Authors,
Editors, Translators etc.

### .separators(all, last)
Sets all the contributors separators, and optionally set the
last separator

### .format(str)
Sets the format of a single contributor. For example

```js
.format('First Last')
.format('Last, F.')
.format('Title Last, F.')
.format('Title L. M. F.')
```

### .multiSuffix(suffix)
Specify the suffix if there are multiple contributors


### .shrink(count, text, opts)
Shrink the number of authors down to a certain length.

```js
.shrink(5)
```

Shrink down and add a string to the end

```js
.shrink(5, ' et al')
```

Shrink down, but uses the string as the last separator

```js
.shrink(5, ' ... ', {lastSeparator: true})
```
