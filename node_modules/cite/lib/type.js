/**
 * Expose Type
 */

module.exports = Type;


/**
 * Dependencies
 */

var Trait = require('./trait');
var Stub = require('./trait/stub');
var SCHEMA = require('cite-traits').properties;
var Emitter = require('events').EventEmitter;
var VisibilityError = require('./error/visibility');
var OtherError = require('./error/other');


/**
 * Instantiate a Type with style properties
 * nested inside `fn`.
 *
 * @param {Object} data
 * @param {Function} fn
 * @api private
 */

function Type(data) {
  Emitter.call(this);
  this.setMaxListeners(30);

  this.data = data || {};
  this.traits = {};
  this.order = [];
  this.errors = [];
  this.string = '';
  this.validators = [];
  this.modifiers = [];
  this.visibilities = {};
}


/**
 * Extends Emitter
 */

Type.prototype.__proto__  = Emitter.prototype;


/**
 * stringify all traits
 *
 * @return {Self}
 * @api public
 */

Type.prototype.stringify = function(){

  this.emit('modifier');
  this.emit('move');

  for (var i = 0; i < this.validators.length; i++) {
    var validator = this.validators[i];
    if (validator.overriden) continue;
    if (!validator.passed) {
      validator.failed = true;
      this.errors.push(new VisibilityError(validator.type, validator.ids));
    }
  }

  if (this.errors.length) {
    return this;
  }

  for (var i = 0; i < this.order.length; i++) {
    var id = this.order[i];
    var name = unid(id);
    var options = this.traits[id];
    var visib = this.visibilities[id] || 'optional';

    // if hidden, skip this trait
    if (visib == 'hide') continue;

    // setup trait
    var trait = (name == 'text')
              ? new Stub(options)
              : Trait(name, this.data[name], options)

    // if stubbed, append string
    if (trait.stubbed) {
      this.append(trait.string);
      continue;
    }

    if (!trait.defined && visib !== 'show') {
      continue;
    }

    if (!trait.defined) {
      console.error('should not reach here (check styleguide/lib/style.js)');
      continue;
    }

    if (trait.error) {
      this.errors.push(trait.error);
      continue;
    }

    this.append(trait.string);
  }

  this.string = this.string.trim();
  return this;
};


/**
 * append string and handle any extra whitespace
 * ignoring any HTML entries.
 *
 * @param {String} str
 * @return {Self}
 * @api public
 */

Type.prototype.append = function(str){
  var string = this.string;
  var reg = new RegExp('\</?.+?\>', 'g');
  var main = string.replace(reg, '');
  var next = str.replace(reg, '');

  if (main[(main.length - 1)] == ' ' && next[0] == ' ') {
    var i = string.lastIndexOf(' ');
    this.string = string.substring(0, i) + string.substring(i + 1);
  }

  this.string += str;
  return this;
};


/**
 * set error
 *
 * @param {String} msg
 * @param {Object} obj
 * @return {Self}
 * @api public
 */

Type.prototype.error = function(msg, obj){
  var e = new OtherError(msg, obj);
  this.errors.push(e);
  return this;
}


/**
 * Inherit settings from a specified
 * wrapper Function
 *
 * @param {Function}
 * @return {Self}
 * @api public
 */

Type.prototype.inherit = function() {
  var args = [].slice.call(arguments);

  for (var i = 0; i < args.length; i++) {
    var fn = args[i];
    fn.call(this);
  }

  return this;
}


/**
 * Splits up a `str` into its parts such as
 * `(datePublished)` would return this
 *
 *  {
 *    prefix: "(",
 *    name: "datePublished",
 *    suffix: ")"
 *  }
 *
 * @param {String} str
 * @return {Self}
 * @api private
 */

Type.prototype.parse = function(str) {
  var traits = Object.keys(SCHEMA);
  var poss = [];

  for (var i = 0; i < traits.length; i++) {
    var item = traits[i];
    var pos = str.indexOf(item);
    if (!~pos) continue;

    poss.push({
      name: item,
      index: pos,
      len: item.length
    })
  }

  poss = poss.sort(function(a, b) {
    return parseFloat(b.len) - parseFloat(a.len)
  })

  if (!poss[0]) {
    throw new Error('could not parse string "' + str + '"');
  }

  var name = poss[0].name;
  var index = poss[0].index;

  var obj = {
    name: name
  };

  var prefix = str.slice(0, index);
  if (prefix) obj.prefix = prefix;

  var suffix = str.slice(index + name.length);
  if (suffix) obj.suffix = suffix;

  return obj;
}


/**
 * Apply options `obj` directly on `this.options`
 * with `id`
 *
 * @param {String} id
 * @param {Object} options
 * @return {Self}
 * @api private
 */

Type.prototype.set = function(id, options) {
  var trait = this.setupTrait(id, this.traits[id]);
  this.setupTraitOptions(trait, options);
  this.traits[id] = trait.options;
  this.parseVisibility(trait, id);
  return this;
}


/**
 * Parses a trait `str` such like
 * `[prefix]trait name[suffix]`
 *
 * Specify an `fn` object or function
 * to manipulate the options of that passed
 * trait. See `this.set()`
 *
 * Pass `false` to the `inherit` if you want
 * stop that field from inheriting options
 * specified by `.inherit()`
 *
 * @param {String} str
 * @param {Object|Function} fn
 * @param {Boolean} inherit
 * @return {Self}
 * @api public
 */

Type.prototype.trait = function(str, fn) {
  var props = this.parse(str);
  var name = props.name;

  for (var i = 0; i < 20; i++) {
    var n = i == 0 ? '' : i;
    var id = name + n
    if (!~this.order.indexOf(id)) break;
  }

  var trait = this.setupTrait(id, this.traits[id]);

  if (props.prefix) trait.prefix(props.prefix);
  if (props.suffix) trait.suffix(props.suffix);

  this.setupTraitOptions(trait, fn);
  this.parseVisibility(trait, id);

  this.traits[id] = trait.options;
  this.order.push(id);

  return this;
}


/**
 * Creates a text placeholder with content of
 * this placeholder passed into `str`.
 *
 * Specify an `options` object or function
 * to manipulate the options of the text
 * placeholder
 *
 * @param {String} str
 * @param {Object|Function} options
 * @return {Self}
 * @api public
 */

Type.prototype.text = function(str, fn) {
  for (var i = 0; i < 20; i++) {
    var n = i == 0 ? '' : i;
    var id = 'text' + n
    if (!~this.order.indexOf(id)) break;
  }

  var trait = this.setupTrait(id, this.traits[id]);
  trait.content(str);

  this.setupTraitOptions(trait, fn);
  this.parseVisibility(trait, id);

  this.traits[id] = trait.options;
  this.order.push(id);
  return this;
}


/**
 * Use this to setup a trait by `id` with as many
 * options objects or functions you like.
 *
 * Passing objects is acceptable only if the
 * target has that method and that it doesn't
 * require more than one argument.
 *
 * Also you can pass in functions which will be
 * invoked in the context of the target trait.
 *
 * @param {String} id
 * @param {Object|Function} option[s]
 * @return {Self}
 * @api public
 */

Type.prototype.setupTrait = function(id, options) {
  var name = unid(id);
  var schema = SCHEMA[name];
  var trait;

  if (name === 'text') {
    return new Stub(options);
  }

  if (!schema) {
    throw new Error('no trait with name: ' + name);
  }

  return Trait(name, undefined, options);
}


/**
 * Apply `options` to `item`
 *
 * @param {Trait} item
 * @param {Object|Function} options
 * @return {Self}
 * @api public
 */

Type.prototype.setupTraitOptions = function(item, options) {
  if (typeof options == 'undefined') return;

  if (typeof options == 'function') {
    options.call(item, item);
    return this;
  }

  for (var key in options) {
    if (typeof options[key] === 'undefined') continue;
    if (typeof item[key] !== 'function') {
      throw new Error('no fn "' + key + '" on item "' + item.id + '"')
      continue;
    }
    item[key].call(item, options[key]);
  }

  return this;
}


/**
 * parses validations that may be applied to trait
 *
 * @param {Trait} trait
 * @param {String} id
 * @return {Self}
 * @api public
 */

Type.prototype.parseVisibility = function(trait, id){
  var v = trait.visibility;
  if (v === this.visibilities[id]) return this;

  if (v == 'show') this.show(id);
  if (v == 'hide') this.hide(id);
  if (v == 'optional') this.optional(id);

  return this;
}


/**
 * Specify traits where only one should be
 * displayed out of the group.
 *
 * If the last argument is `{optional:true}` then
 * this allows no traits to be specified.
 * Otherwise, it will by default require at least
 * one trait.
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.either = function() {
  var args = argify(arguments);
  var all = args.ids;
  args.opts.either = true;
  all.push(args.opts);
  this.requires.apply(this, all);
  return this;
}


/**
 * At least has traits
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.atleast = function(){
  var args = argify(arguments);
  var all = args.ids;
  args.opts.atleast = true;
  all.push(args.opts);
  this.requires.apply(this, all);
  return this;
};


/**
 * Specify traits where all should be displayed
 * out of the group.
 *
 * If the last argument is `{optional:true}` then
 * this allows no traits to be specified.
 * Otherwise, it will by default require all.
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.all = function() {
  this.requires.apply(this, arguments);
  return this;
}


/**
 * adds a requirement for traits
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.requires = function(){
  var args = argify(arguments);
  var ids = args.ids;
  var opts = args.opts;
  var count = [];

  var obj = {
    ids: ids,
    type: 'requires'
  }

  this.validators.push(obj);

  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var name = unid(id);
    if (name == 'text' || typeof this.data[name] !== 'undefined') {
      count.push(id);
    }
  }

  if (opts.optional) {
    obj.optional = true;
  }

  if (opts.either) {
    obj.type = 'either';
  }

  if (opts.atleast) {
    obj.type = 'atleast';
    if (count.length > 0) {
      obj.passed = true;
      return this;
    }
  }

  if (opts.optional && count.length === 0) {
    obj.passed = true;
    return this.setVisibility(ids, 'optional');
  }

  if (opts.either) {
    if (count.length === 1) {
      obj.passed = true;
      this.setVisibility(ids, 'hide');
      this.setVisibility(count[0], 'show');
      return this;
    }
    return this;
  }

  if (ids.length === count.length) {
    obj.passed = true;
    return this.setVisibility(ids, 'show');
  }

  return this;
}


/**
 * has visibility with id
 *
 * @param {Array} ids
 * @return {Self}
 * @api public
 */

Type.prototype.getRequires = function(ids){
  for (var i = this.validators.length - 1; i >= 0; i--) {
    var validator = this.validators[i];

    for (var n = 0; n < ids.length; n++) {
      var id = ids[n];
      if (~validator.ids.indexOf(id)) {
        return validator;
      }
    }
  }
}


/**
 * removes any requires for trait
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.deRequires = function(){
  var ids = argify(arguments).ids;
  var validator = this.getRequires(ids);
  if (validator) validator.overridden = true;
  return this;
}


/**
 * show given traits (and require them)
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.show = function(ids) {
  var ids = argify(arguments).ids;
  this.deRequires(ids);
  this.requires(ids);
  this.setVisibility(ids, 'show');
  return this;
}


/**
 * hide given traits (and remove requirements)
 *
 * @param {String} ids
 * @return {Self}
 * @api public
 */

Type.prototype.hide = function() {
  var ids = argify(arguments).ids;
  this.deRequires(ids);
  this.setVisibility(ids, 'hide');
  return this;
}


/**
 * make traits optional (and remove requirements)
 *
 * @param {String} id
 * @return {Self}
 * @api public
 */

Type.prototype.optional = function() {
  var ids = argify(arguments).ids;
  this.deRequires(ids);
  this.setVisibility(ids, 'optional');
  return this;
}


/**
 * set ids with visibility
 *
 * @param {Array\String} ids
 * @param {String} visib
 * @return {Self}
 * @api public
 */

Type.prototype.setVisibility = function(ids, visib) {
  if (typeof ids === 'string') ids = [ids];

  for (var i = 0; i < ids.length; i++) {
    this.visibilities[ids[i]] = visib;
  }

  return this;
}


/**
 * validator
 *
 * @param {String} str
 * @param {Function} fn
 * @return {Self}
 * @api public
 */

Type.prototype.validator = function(str, fn){
  var check = new Function('d', 'if (' + str + ') return true');

  function validator(){
    var data = {};

    for (var key in this.data){
      data[key] = (typeof this.data[key] !== undefined);
    }

    if (check(data) !== true) return fn.call(this);
  }

  this.validators.push({
    fn: validator
  })

  return this;
}


/**
 * Sets up a modifier
 *
 *   .if('title', '-datePublished', fn)
 *
 * The last argument which needs to be a function
 * is passed into `.run()` of the modifier.
 *
 * @param {String} ids
 * @param {Function} fn
 * @return {Self}
 * @api public
 */

Type.prototype.if = function() {
  var args = [].slice.call(arguments);
  var fn = args.pop();

  this.has(args) && fn.call(this);
  return this
}


/**
 * Sets up a modifier
 *
 *   .upon('title', '-datePublished', fn)
 *
 * The last argument which needs to be a function
 * is passed into `.run()` of the modifier.
 *
 * This is deferred until after all traits have
 * setup.
 *
 * @param {String} ids
 * @param {Function} fn
 * @return {Self}
 * @api public
 */

Type.prototype.upon = function() {
  var args = [].slice.call(arguments);
  var fn = args.pop();

  function mod(){
    this.has(args) && fn.call(this);
  }

  this.on('modifier', mod.bind(this))
  return this
}


/**
 * checks to see if ids are truthy
 *
 * @param {String} ids
 * @return {Boolean}
 * @api private
 */

Type.prototype.has = function(ids){
  var failed;

  for (var i = 0; i < ids.length; i++) {
    var name = ids[i];

    if (name[0] == '-') {
      if (this.data[name.slice(1)]) {
        failed = true;
        break;
      }
      continue;
    }

    if (!this.data[name]) {
      failed = true;
      break;
    }
  }

  if (failed !== true) return true;
}


/**
 * move traits
 *
 * @api public
 */

Type.prototype.move = function(id, pos){
  var order = this.order;

  function defer(){
    var i = order.indexOf(id);

    if (i == -1) return this;

    if (pos.before) {
      var to = order.indexOf(pos.before)
      if (to == -1) return this;
      move(order, i, to);
    }

    if (pos.after) {
      var to = order.indexOf(pos.after) + 1;
      if (to == -1) return this;
      if (to < order.length) {
        move(order, i, to);
        return this;
      }
      pos.end = true;
    }

    if (pos.start) {
      move(order, i, 0)
    }

    if (pos.end) {
      move(order, i, -1)
    }
  }

  this.on('move', defer.bind(this));
  return this;
}


/**
 * splits ids and options
 *
 * @return {Object}
 * @api private
 */

function argify(arguments){
  var ids = [].slice.call(arguments);
  var opts = {};

  if (Array.isArray(ids[0])) {
    ids = ids[0];
  }

  if (typeof ids[ids.length - 1] !== 'string'){
    var opts = ids.pop();
  }

  return {ids:ids, opts: opts}
}


/**
 * Return string with any numbers removed
 *
 * @param {String} id
 * @return {String}
 * @api private
 */

function unid(id){
  return id.replace(/[0-9]/g, '');
}


/**
 * Modify `arr` and move `from` `to`
 *
 * @param {Array} arr
 * @param {Number} from
 * @param {Number} to
 * @return {Array}
 * @api private
 */

function move(arr, from, to) {
  while (from < 0) {
    from += arr.length;
  }

  while (to < 0) {
    to += arr.length;
  }

  if (to >= arr.length) {
    var k = to - arr.length;
    while ((k--) + 1) {
        arr.push(undefined);
    }
  }

  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
}