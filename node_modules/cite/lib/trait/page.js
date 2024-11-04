/**
 *  Dependencies
 */

var Trait = require('./trait');
var TraitError = require('../error/trait');



/**
 * Expose Page
 */

module.exports = PageTrait;


/**
 * Initilize with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function PageTrait(value, opts){
  Trait.call(this, value, opts);
}


/**
 * Mixin Trait
 */

PageTrait.prototype.__proto__ = Trait.prototype;


/**
 * Sets field as multiple
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.multi = function(){
  this.options.multi = true;
  return this;
}


/**
 * Sets field as multiple
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.separators = function(all, last){
  this.options.separator = all;
  this.options.lastSeparator = last || all;
  return this;
}


/**
 * Sets single prefix
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.singlePrefix = function(str){
  this.options.singlePrefix = str;
  return this;
}


/**
 * Sets single prefix
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.rangePrefix = function(str){
  this.options.rangePrefix = str;
  return this;
}


/**
 * Sets single prefix
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.singleSuffix = function(str){
  this.options.singleSuffix = str;
  return this;
}


/**
 * Sets single prefix
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.rangeSuffix = function(str){
  this.options.rangeSuffix = str;
  return this;
}


/**
 * Sets single prefix
 *
 * @param {String} str
 * @api public
 */

PageTrait.prototype.rangeSeparator = function(str){
  this.options.rangeSeparator = str;
  return this;
}



/**
 * Basic validate function, raising errors if
 * value is not of certain type, or has the keys
 * needed for the format given
 *
 * @return {Boolean}
 * @api private
 */

PageTrait.prototype.$validate = function(){
  var value = this.value;
  var multi = this.options.multi;
  var failed = false;

  function check(item){
    if (typeof item === 'undefined') {
      failed = true;
      return;
    }

    if (typeof item === 'string') {
      item = {first: item};
    }

    if (item.first || item.last) return;
    failed = true;
  }

  if (Array.isArray(value)) {
    multi ? value.forEach(check) : check(value[0])
    if (failed) this.$setError('invalid type');
    return !failed
  }

  check(value);
  if (failed) this.$setError('invalid type');
  return !failed;
}


/**
 * Itterates through pages, and generates and
 * returns that string
 *
 * @return {String}
 * @api private
 */

PageTrait.prototype.$toString = function(){
  var value = this.value;
  var multi = this.options.multi;

  if (Array.isArray(value)) {
    if (!multi) return this.$page(value[0])
    var str = '';

    for (var i = 0; i < value.length; i++) {
      var item = value[i];
      str += this.$page(item);
      str += this.$addSeparators(i, value.length);
    }

    return str;
  }

  return this.$page(value);
}


/**
 * Generates a string for a single page
 *
 * @param {Mixed} value
 * @return {String}
 * @api private
 */

PageTrait.prototype.$page = function(value){
  if (typeof value === 'string') {
    value = {first: value};
  }

  var str = '';
  var range = !!value.last;

  if (range) {
    str += this.options.rangePrefix || '';
    str += value.first;
    str += this.options.rangeSeparator || '-';
    str += value.last;
    str += this.options.rangeSuffix || '';
    return str;
  }

  str += this.options.singlePrefix || '';
  str += value.first;
  str += this.options.singleSuffix || '';

  return str;
}


/**
 * figures out separators for given `i` in `count`
 *
 * @param {Number} i
 * @param {Number} count
 * @return {Self}
 * @api private
 */

PageTrait.prototype.$addSeparators = function(i, count){
  var sep = this.options.separator || ', ';
  var lastSep = this.options.lastSeparator || ', ';

  // if last item, ignore separator
  if (i == count) return '';

  // if any item except last 2
  if (i < (count - 2)) {
    return sep;
  }

  // if second to last item
  if (i < (count - 1)) {
    return lastSep;
  }

  return '';
}