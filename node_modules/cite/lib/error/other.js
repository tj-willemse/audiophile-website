
/**
 * Expose OtherError
 */

module.exports = OtherError;


/**
 * Instantiate a OtherError
 *
 * @param {Style} style
 * @api public
 */

function OtherError(msg, obj){
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'OtherError';
  this.message = msg;
  obj = obj || {};
  for (var key in obj) this[key] = obj[key];
}


/**
 * Inherits from Error.
 */

OtherError.prototype.__proto__ = Error.prototype;
