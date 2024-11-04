
/**
 * Dependencies
 */

var Trait = require('./trait')


/**
 * Expose Trait
 */

module.exports = TextStub;


/**
 * Instantiate TextStub with `opts`
 *
 * @param {Object} opts
 * @api private
 */

function TextStub(opts){
  this.stubbed = true;
  Trait.call(this, true, opts);

  delete this.prefix;
  delete this.suffix;
  delete this.optional;
  delete this.enum;
  delete this.stub;
}


/**
 * Mixin Emitter
 */

TextStub.prototype.__proto__ = Trait.prototype;


/**
 * Set the TextStub content
 *
 * @param {String} str
 * @api public
 */

TextStub.prototype.content = function(str){
  this.options.content = str;
  return this;
}


/**
 * validate
 *
 * @param {String} str
 * @api public
 */

TextStub.prototype.$validate = function(){
  return true;
}


/**
 * returns string content
 *
 * @api public
 */

TextStub.prototype.$toString = function(){
  return this.options.content;
}