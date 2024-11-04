
/**
 * Expose TraitError
 */

module.exports = TraitError;

/**
 * Instantiate a Trait Error
 *
 * @param {Style} style
 * @api public
 */

function TraitError(msg){
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'TraitError';
  this.message = msg;
  this.errors = [];
}


/**
 * Inherits from Error.
 */

TraitError.prototype.__proto__ = Error.prototype;


/**
 *
 *
 * @param {Array} errors
 * @api public
 */

TraitError.prototype.add = function(err){
  this.errors.push(err);
  return this;
}