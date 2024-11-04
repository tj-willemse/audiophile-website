
/**
 * Dependencies
 */

var Trait = require('./trait');
var caps = require('./utils/caps');


/**
 * Expose StringTrait
 */

module.exports = StringTrait;


/**
 * Initilize with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function StringTrait(value, opts){
  Trait.call(this, value, opts);
}


/**
 * Mixin Trait
 */

StringTrait.prototype.__proto__ = Trait.prototype;


/**
 * Capialize string passed in
 *
 * @api public
 */

StringTrait.prototype.capitalize = function(bool){
  if (typeof bool == 'undefined') bool = true;
  this.options.capitalize = bool;
  return this;
}


/**
 * Clever Capitalize the string passed in
 *
 * @api public
 */

StringTrait.prototype.cleverCaps = function(bool){
  if (typeof bool == 'undefined') bool = true;
  this.options.cleverCaps = bool;
  return this;
}


/**
 * Alter the suffix if one of the chars exists
 *
 * @api public
 */

StringTrait.prototype.puncSuffix = function(chars, suffix){
  this.options.puncs = chars;
  this.options.puncSuffix = suffix || '';
  return this;
}


/**
 * Basic validate function, raising errors if
 * value is not of certain type.
 *
 * @return {Boolean}
 * @api private
 */

StringTrait.prototype.$validate = function(){
  if (typeof this.value === 'string') return true;
  this.$setError('invalid type');
}


/**
 * Stringify
 *
 * @api public
 */

StringTrait.prototype.$toString = function(){
  var value = this.value;

  if (this.options.capitalize) {
    value = caps.capitalize(value);
  }

  if (this.options.cleverCaps) {
    value = caps.cleverCaps(value);
  }

  if (this.options.puncs) {
    value = this.$puncSuffix(value);
  }

  return value;
}


/**
 * Alter the suffix if one of the puncs exists
 *
 * @api public
 */

StringTrait.prototype.$puncSuffix = function(value){
  var puncs = this.options.puncs.split('');
  var suf = this.options.puncSuffix;
  var last = value.slice(-1);

  for (var i = 0; i < puncs.length; i++) {
    var punc = puncs[i];
    if (punc !== last) continue;

    this.suffix(suf);
    return value;
  }

  return value;
}