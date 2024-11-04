
/**
 * Dependencies
 */

var Trait = require('./trait');
var caps = require('./utils/caps');
var cap = caps.capitalize;
var up = caps.toUpperCase;
var low = caps.toLowerCase;


/**
 * Expose Contributor
 */

module.exports = Contributor;


/**
 * Initilize with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function Contributor(value, opts){
  Trait.call(this, value, opts);
}


/**
 * Mixin Trait
 */

Contributor.prototype.__proto__ = Trait.prototype;


/**
 * Set the way in which a contributor should be
 * displayed by passing in a `str`. Example:
 *
 *    .format('First Last')
 *
 * @param {String} str
 * @api public
 */

Contributor.prototype.format = function(str){
  this.options.format = str;
  return this;
}


/**
 * Set the separator between multiple
 * contributors with `all`. You can also specify
 * the `last` separator as well.
 *
 * @param {String} all
 * @param {String} last
 * @api public
 */

Contributor.prototype.separators = function(all, last){
  this.options.separator = all;
  this.options.lastSeparator = last || all;
  return this;
}


/**
 * Set the suffix to the following if there are
 * multiple contributors
 *
 * @param {String} suffix
 * @api public
 */

Contributor.prototype.multiSuffix = function(suffix){
  this.options.multiSuffix = suffix;
  return this;
}


/**
 * Set the item to shrink after certain conditions
 *
 * @param {String} suffix
 * @api public
 */

Contributor.prototype.shrink = function(count, text, opts){
  this.options.shrinkCount = count;
  if (text) this.options.shrinkText = text;

  if (opts && opts.lastSeparator && text) {
    this.options.shrinkSeparator = true;
  }
  return this;
}








/**
 * Basic validate function, raising errors if
 * value is not of certain type.
 *
 * @return {Boolean}
 * @api private
 */

Contributor.prototype.$validate = function(){
  if (!Array.isArray(this.value)) {
    this.$setError('invalid type');
    return false;
  }

  if (!this.value.length) {
    this.$setError('no contributors')
    return false;
  }

  return true;
}


/**
 * Converts each contributor into a string, and
 * will also add any separators.
 *
 * @api private
 */

Contributor.prototype.$toString = function(){
  var out = '';
  var value = this.value;
  var len = value.length;
  var format = this.options.format || 'First Last';

  var count = this.options.shrinkCount;

  if (count && len > count) {
    var many = value.length;

    if (count == 0) {
      value = [];

    } else if (count == 1) {
      value = [value[0]];

    } else {
      many -= count - 1;
      value.splice(count - 1, many - 1);
    }

    len = value.length;
    var showShrinkText = true;
  }

  // if shrink has the lastSeparator flag, update
  // the last separator to the shrink text
  if (showShrinkText && this.options.shrinkSeparator) {
    showShrinkText = false;
    this.options.lastSeparator = this.options.shrinkText;
  }

  for (var i = 0; i < value.length; i++) {
    var corp = value[i].name;

    if (typeof corp !== 'undefined') {
      out += corp;
      out += this.$addSeparators(i, len);
      continue;
    }

    var parts = this.$parts(format, value[i]);

    for (var key in parts.error) {
      this.$setError('no ' + key + ' at position ' + i)
    }

    out += parts.str;
    out += this.$addSeparators(i, len);
  }

  // add the shrink text to the end
  if (showShrinkText) {
    out += this.options.shrinkText || '';
  }

  var multi = this.options.multiSuffix;
  if (multi && len > 1) {
    this.suffix(multi);
  }

  return out;
}


/**
 * Works out and displays the separators for each
 * contributor and returns a string result.
 *
 * `i` is the current contributor index, and
 * `count` is the maximum count of contributors
 *
 * @param {Number} i
 * @param {Number} count
 * @return {String}
 * @api private
 */

Contributor.prototype.$addSeparators = function(i, count){
  var sep = this.options.separator || '';
  var lastSep = this.options.lastSeparator || '';

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



/**
 * Map lowercase character to its value in the
 * contributor object.
 */

var map = {
  title   : 'title',
  t       : 'title',
  first   : 'first',
  f       : 'first',
  middle  : 'middle',
  m       : 'middle',
  last    : 'last',
  l       : 'last'
}


/**
 * useful regexs
 */

var reg = {
  all: /(\{.+?\}|\[.+?\]|first|f|last|l|middle|m|title|t)/ig,
  title: /(title|t)/i,
  optional: /\{(.+)\}/i,
  escape: /\[(.+)\]/i,
}


/**
 * This takes a `format` for example 'Last, F.'
 * and splits it into parts using the large "all"
 * regex above.
 *
 * Each split part, may just be a random string,
 * but it could be a escape, an optional, or a
 * field and each have their own way of behaving.
 *
 * Random strings and the strings inside escapes
 * are appended to the `obj.string` property.
 *
 * Optionals work by taking the string inside, and
 * pass it back into this function. If no errors
 * arise, then the final string is appended.
 *
 * If the part is a property such as "L", this
 * will be lowercased and checked against the
 * `map` object above for its official property
 * counterpart, in this case "last". If this
 * property exists on the `contr` object, the part
 * will be sent to `this.namePart()`. If it does
 * not exist, an error will be marked.
 *
 * TODO: refactor, and make nicer
 *
 * @param {String} format
 * @param {Object} contr
 * @return {Object}
 * @api private
 */

Contributor.prototype.$parts = function(format, contr){
  var self = this;
  var splits = format.split(reg.all);
  var obj = { str: '' };

  for (var i = 0; i < splits.length; i++) {
    var split = splits[i];

    // matches part
    if (!reg.all.test(split)) {
      obj.str += split;
      continue;
    }

    // matches optional
    var o = reg.optional.exec(split);
    if (o) {
      var parts = self.$parts(o[1], contr);
      if (parts.error) continue;
      obj.str += parts.str;
      continue;
    }

    // matches escape
    var esc = reg.escape.exec(split);
    if (esc) {
      obj.str += esc[1];
      continue;
    }

    var prop = map[low(split)];
    if (typeof contr[prop] === 'undefined') {
      if (!obj.error) obj.error = {};
      obj.error[prop] = true;
      continue;
    }

    if (reg.title.test(split)){
      obj.str += this.$namePartTitle(split, contr[prop]);
      continue;
    }

    obj.str += this.$namePart(split, contr[prop]);
  }

  return obj;
}


/**
 * Return `value` in the case format of `f`.
 *
 * For example, format could be 'f', 'F', 'first',
 * 'FIRST' or 'First'.
 *
 * 'Frst' will only capitalize the first letter
 * and ignore the case of any others.
 *
 * @param {String} f
 * @param {String} value
 * @return {String}
 * @api private
 */

Contributor.prototype.$namePart = function(f, value){
  if (f.length === 1) {
    if (f === up(f)) return up(value)[0];
    return low(value)[0];
  }
  if (f === low(f)) return low(value);
  if (f === up(f)) return up(value);
  return cap(value);
}


/**
 * Return `value` in the case format of `f`.
 *
 * For example, format could be 'title', 'TITLE'
 * or 'Title'.
 *
 * 'Title' will only capitalize the first letter
 * and ignore the case of any others.
 *
 * @param {String} f
 * @param {String} value
 * @return {String}
 * @api private
 */

Contributor.prototype.$namePartTitle = function(f, value){
  if (f === low(f)) return low(value);
  if (f === up(f)) return up(value);
  return cap(value);
}
