/**
 *  Dependencies
 */

var Trait = require('./trait');
var TraitError = require('../error/trait');


/**
 * Expose LocationTrait
 */

module.exports = LocationTrait;


/**
 * Initilize with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function LocationTrait(value, opts){
  Trait.call(this, value, opts);
}


/**
 * Mixin Trait
 */

LocationTrait.prototype.__proto__ = Trait.prototype;


/**
 * Set the way in which the date should be
 * displayed by passing in a `str`. Example:
 *
 *    .format('city {province }country')
 *
 * @param {String} str
 * @api public
 */

LocationTrait.prototype.format = function(str){
  this.options.format = str;
  return this;
}


/**
 * Validate value
 *
 * @return {Boolean}
 * @api private
 */

LocationTrait.prototype.$validate = function(){
  var value = this.value;

  if (typeof value !== 'object' || Array.isArray(value)) {
    this.$setError('invalid type');
    return false;
  }

  return true;
}


/**
 * Generates a string
 *
 * @api private
 */

LocationTrait.prototype.$toString = function(){
  var fmt = this.options.format || 'city'
  var parts = this.$parts(fmt, this.value);

  for (var key in parts.error) {
    this.$setError('no ' + key)
  }

  return parts.str;
}


/**
 * useful regexs
 */

var reg = {
  all: /(\{.+?\}|\[.+?\]|city|province|country)/ig,
  optional: /\{(.+)\}/i,
  escape: /\[(.+)\]/i,
}


/**
 * parses format
 *
 * TODO: refactor, and make nicer
 *
 * @param {String} format
 * @param {Object} contr
 * @return {Object}
 * @api private
 */

LocationTrait.prototype.$parts = function(format, loc){
  var self = this;
  var splits = (format + '').split(reg.all);
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
      var parts = self.$parts(o[1], loc);
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

    if (typeof loc[split] === 'undefined') {
      if (!obj.error) obj.error = {};
      obj.error[split] = true;
      continue;
    }

    obj.str += loc[split];
  }

  return obj;
}