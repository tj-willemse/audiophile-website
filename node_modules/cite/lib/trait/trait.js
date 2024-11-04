
/**
 * Dependencies
 */

var TraitError = require('../error/trait');


/**
 * Expose Trait
 */

module.exports = Trait;


/**
 * Initilize a new Trait with `value` and `opts`
 *
 * @param {Mixed} value
 * @param {Object} opts
 * @api private
 */

function Trait(value, opts) {
  this.value = value;
  this.apply(opts);

  if (typeof value === 'undefined') {
    if (this.options.stub) {
      this.stubbed = true;
      this.$wrapString(this.options.stub);
      return;
    }

    this.$setError('undefined');
    return;
  }

  this.defined = true;
  this.$validate() && this.$stringify();
}


/**
 * Set title
 *
 * @param {String} title
 * @api public
 */

Trait.prototype.title = function(title){
  this.options.title = title;
  return this;
}


/**
 * Enable style
 *
 * @param {String} style
 * @param {Object} opt
 * @api public
 */

Trait.prototype.style = function(style, opt){
  if (!this.options.styles) this.options.styles = {};

  if (opt === false) {
    this.options.styles[style] = false;
    return this;
  }

  if (!opt || opt === true){
    this.options.styles[style] = true;
    return this;
  }

  var obj = {};
  var s = opt.split(' ');
  for (var i = 0; i < s.length; i++) {
    obj[s[i]] = true;
  }

  this.options.styles[style] = obj;
  return this;
}


/**
 * Enable Italics
 *
 * @param {Object} opt
 * @api public
 */

Trait.prototype.italics = function(opt){
  return this.style('i', opt);
}


/**
 * Enable bold
 *
 * @param {Object} opt
 * @api public
 */

Trait.prototype.bold = function(opt){
  return this.style('b', opt);
}


/**
 * Set Prefix
 *
 * @param {String} prefix
 * @api public
 */

Trait.prototype.prefix = function(prefix){
  this.options.prefix = prefix;
  return this;
}


/**
 * Set suffix
 *
 * @param {String} suffix
 * @api public
 */

Trait.prototype.suffix = function(suffix){
  this.options.suffix = suffix;
  return this;
}


/**
 * Set stub
 *
 * @param {String} stub
 * @api public
 */

Trait.prototype.stub = function(stub){
  this.options.stub = stub;
  return this;
}


/**
 * Setup Enums
 *
 * @param {Object} obj
 * @api public
 */

Trait.prototype.enum = function(obj){

  // hack to edit content in upons and such
  if (obj && this.options.enums) {
    for (var key in obj) {
      var item = this.options.enums[key];
      if (!item) continue;
      item.content = obj[key];
    }
    return this;
  }

  var chain = {};
  var items = [];

  chain.add = function(label, content, c){
    c = c || {}
    c.label = label;
    c.content = content;
    items.push(c);
    return chain;
  }

  this.options.enums = items;
  return chain;
}


/**
 * Set as optional
 *
 * @api public
 */

Trait.prototype.optional = function(){
  this.visibility = 'optional';
  return this;
}


/**
 * Set this to show
 *
 * @api public
 */

Trait.prototype.show = function(){
  this.visibility = 'show';
  return this;
}


/**
 * Set this to hide
 *
 * @api public
 */

Trait.prototype.hide = function(){
  this.visibility = 'hide';
  return this;
}


/**
 * Apply obj to options
 *
 * @api public
 */

Trait.prototype.apply = function(obj){
  if (!this.options) this.options = {};
  if (!obj) return this;

  for (var key in obj) {
    this.options[key] = obj[key];
  }
  return this;
}


/**
 * Creates a new Error and adds to `this.error`
 * if one not already set and adds `message` to it
 *
 * @param {String} message
 * @return {Self}
 * @api private
 */

Trait.prototype.$setError = function(message){
  if (!this.error) this.error = new TraitError();
  this.error.add(message);
  return this;
}







/**
 * creates string for given type, checks for enums
 * and applys styles.
 *
 * @returns {Mixed}
 * @api private
 */

Trait.prototype.$stringify = function(){
  var value = this.value;
  var str;

  if (!this.options.enums) {
    return this.$wrapString(this.$toString());
  }

  // enums
  var found;
  for (var i = 0; i < this.options.enums.length; i++) {
    var item = this.options.enums[i];
    var sel = item.selector || item.label;
    if (value === sel) {
      found = item.content;
      break;
    }
  }

  if (!found) {
    this.setError('no enum matching value');
    return this;
  }

  this.$wrapString(found);
  return this;
}


/**
 * wrap `value` with prefix and suffix and styles
 *
 * @param {String} value
 * @return {Self}
 * @api public
 */

Trait.prototype.$wrapString = function(value){
  this.string = '';
  this.string += this.$applyStyles('prefix', this.options.prefix)
  this.string += this.$applyStyles('main', value);
  this.string += this.$applyStyles('suffix', this.options.suffix);
  return this.string;
}


/**
 * Wraps `str` with style `type` such as italics
 * or bold
 *
 * @returns {String}
 * @api private
 */

Trait.prototype.$applyStyles = function(type, str){
  var out = '';
  var q = [];

  for (var key in this.options.styles) {
    var style = this.options.styles[key];
    if (style === true) q.push(key);
    if (style && style[type]) q.push(key);
  }

  if (!str) return out;

  for (var i = 0; i < q.length; i++) {
    out += '<' + q[i] + '>';
  }

  out += (str || '');

  for (var n = q.length - 1; n >= 0; n--) {
    out += '</' + q[n] + '>';
  }

  return out;
}