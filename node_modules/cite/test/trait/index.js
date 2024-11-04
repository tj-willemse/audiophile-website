var expect = require('expect.js');
var Trait = require('../../lib/trait/index');



describe('trait', function(){
  it('can get contributor trait', function(){
    var trait = Trait('author');
    expect(trait).to.be.a(require('../../lib/trait/contributor'));
  })

  it('can get date trait', function(){
    var trait = Trait('datePublished');
    expect(trait).to.be.a(require('../../lib/trait/date'));
  })

  it('can get location trait', function(){
    var trait = Trait('location');
    expect(trait).to.be.a(require('../../lib/trait/location'));
  })

  it('can get number trait', function(){
    var trait = Trait('issue');
    expect(trait).to.be.a(require('../../lib/trait/number'));
  })

  it('can get page trait', function(){
    var trait = Trait('page');
    expect(trait).to.be.a(require('../../lib/trait/page'));
  })

  it('can get string trait', function(){
    var trait = Trait('doi');
    expect(trait).to.be.a(require('../../lib/trait/string'));
  })
})