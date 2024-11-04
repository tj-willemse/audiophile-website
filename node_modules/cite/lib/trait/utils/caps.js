
/**
 * Expose cleverCaps
 */

exports.cleverCaps = cleverCaps;


/**
 * Capitalize certain words in a string but leave
 * a few uncapitalized.
 *
 * @param {String} string
 * @api private
 */

function cleverCaps(string){
  if (!string) return string;
  var words = ['a', 'an', 'the', 'at', 'by', 'for',
              'in', 'of', 'on', 'to', 'up', 'and',
              'as', 'but', 'it', 'or', 'nor']
  var capitals = [];
  var string = string.trim().split(' ');

  string.forEach(function(str, i){
    str = str.toLowerCase();
    if (~words.indexOf(str) && i > 0) {
      capitals.push(str);
      return;
    }
    capitals.push(capitalize(str));
  })

  return capitals.join(' ');
}


/**
 * Expose capitalize
 */

exports.capitalize = capitalize;


/**
 * Capitalize the first letter of every word in a
 * string, and leave everything else as what ever
 * case it is in.
 *
 * @param {String} str
 * @api private
 */

function capitalize(str) {
  return str.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
    return p1 + p2.toUpperCase();
  });
}


/**
 * Expose toUpperCase
 */

exports.toUpperCase = toUpperCase;


/**
 * Capitalize every letter in a string
 *
 * @param {String} str
 * @api private
 */

function toUpperCase(str){
  return str.toUpperCase();
}


/**
 * Expose toLowerCase
 */

exports.toLowerCase = toLowerCase;


/**
 * Lower every letter in a string
 *
 * @param {String} str
 * @api private
 */

function toLowerCase(str){
  return str.toLowerCase();
}