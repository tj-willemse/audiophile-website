/**
 *  Dependencies
 */

var Trait = require('./trait');
var moment = require('moment');
var TraitError = require('../error/trait');


/**
 * Available properties for date
 */

var props = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second'
]


/**
 * This is used to check that the properties
 * are present for a given format string
 */

var check = {
  Y: ['year'],
  M: ['month'],
  d: ['day', 'month', 'year'],
  D: ['day'],
  A: ['hour', 'minute'],
  a: ['hour', 'minute'],
  H: ['hour'],
  h: ['hour'],
  m: ['minute'],
  s: ['second']
}


/**
 * Expose DateTrait
 */

module.exports = DateTrait;


/**
 * Initilize with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function DateTrait(value, opts){
  Trait.call(this, value, opts);
}


/**
 * Mixin Trait
 */

DateTrait.prototype.__proto__ = Trait.prototype;


/**
 * Set the way in which the date should be
 * displayed by passing in a `str`. Example:
 *
 *    .format('YYYY')
 *
 * @param {String} str
 * @api public
 */

DateTrait.prototype.format = function(str){
  this.options.format = str;
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

DateTrait.prototype.$validate = function(){
  var value = this.value;
  var format = this.options.format || 'YYYY';
  var ignore = {};

  if (typeof value !== 'object' || Array.isArray(value)) {
    this.$setError('invalid type');
    return
  }

  for (var key in check) {
    var parts = check[key];
    if (!~format.indexOf(key)) continue;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (value[part] || ignore[part]) continue;
      ignore[part] = true;
      this.$setError('no ' + part)
    }
  }

  return true;
}


/**
 * Generates a string
 *
 * @api private
 */

DateTrait.prototype.$toString = function(){
  var value = this.value;
  var format = this.options.format || 'YYYY';
  return moment(value).format(format);
}