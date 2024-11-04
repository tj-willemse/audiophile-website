
/**
 * Dependencies
 */

var DateTrait = require('./date');
var PageTrait = require('./page');
var LocationTrait = require('./location');
var NumberTrait = require('./number');
var StringTrait = require('./string');
var ContributorTrait = require('./contributor');

var SCHEMA = require('cite-traits').properties


/**
 * Expose Trait
 */

module.exports = Trait;


/**
 *
 * @param {String} name
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function Trait(name, value, opts){
  var schema = SCHEMA[name];
  var type = schema.type;

  if (type === 'contributor') {
    var TraitType = ContributorTrait;
  }

  if (type === 'number') {
    var TraitType = NumberTrait;
  }

  if (type === 'string') {
    var TraitType = StringTrait;
  }

  if (type === 'date') {
    var TraitType = DateTrait;
  }

  if (type === 'page') {
    var TraitType = PageTrait;
  }

  if (type === 'location') {
    var TraitType = LocationTrait;
  }

  return new TraitType(value, opts);
}