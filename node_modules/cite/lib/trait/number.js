
/**
 * Dependencies
 */

var Trait = require('./trait');


/**
 * Expose StringTrait
 */

module.exports = NumberTrait;


/**
 * Initilize with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function NumberTrait(value, opts){
  Trait.call(this, value, opts);
}


/**
 * Mixin Trait
 */

NumberTrait.prototype.__proto__ = Trait.prototype;


/**
 * Ordinalize the number passed in
 *
 * @api public
 */

NumberTrait.prototype.ordinalize = function(bool){
  if (typeof bool == 'undefined') bool = true;
  this.options.ordinalize = bool;
  return this;
}


/**
 * Basic validate function, raising errors if
 * value is not of certain type.
 *
 * @return {Boolean}
 * @api private
 */

NumberTrait.prototype.$validate = function(){
  var value = this.value;
  if (typeof value === 'number') return true;
  this.$setError('invalid type');
}



/**
 * stringify the number passed in
 *
 * @api public
 */

NumberTrait.prototype.$toString = function(){
  var value = this.value;

  if (this.options.ordinalize){
    var suffix = this.options.suffix || '';
    this.suffix(ordinalize(value) + suffix);
  }

  return value;
}


/**
 * Used to actually ordinalize the number
 *
 * @api private
 */

function ordinalize(no){
  var t = no % 100;

  if (t == 11 || t == 12 || t == 13) {
    return 'th'
  }

  switch (no % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}