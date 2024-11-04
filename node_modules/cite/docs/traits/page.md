# Page Trait
This is a trait for use with pages and page ranges.

### .singlePrefix(str)

Spesifies the prefix that the page trait will inherit if only one value is entered by the user.

### .rangePrefix(str)

Spesifies the prefix that the page trait will inherit if one or more range sets are entered by the user.

### .rangeSeparator(str)

Spesifies the seperator that will be used for page ranges. For example:

```JS
page.rangeSeparator(' - ')
```
will generate

```JS
100 - 102
```

### .separators(str)

Spesifies the seperators that will be used between the values displayed in the page trait. For example

```JS
.separators(', ', ' & ')
```

could generate  

```JS
100, 202-300 & 900-999
```

### .multi()

Enables multiple page(s) and page ranges.