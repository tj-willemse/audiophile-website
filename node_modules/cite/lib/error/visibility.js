
/**
 * Expose VisibilityError
 */

module.exports = VisibilityError;


/**
 * Instantiate a VisibilityError
 *
 * @param {Style} style
 * @api public
 */

function VisibilityError(msg, traits){
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'VisibilityError';
  this.message = msg;
  this.traits = traits;
}


/**
 * Inherits from Error.
 */

VisibilityError.prototype.__proto__ = Error.prototype;
