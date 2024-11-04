
/**
 * Dependencies
 */

var StyleGuide = module.exports = require('../../../')();


/**
 * Setup configuration
 */

StyleGuide.config(require('./styleguide'));

/**
 * Load Types
 */

StyleGuide
.path(__dirname)
.load('./source');