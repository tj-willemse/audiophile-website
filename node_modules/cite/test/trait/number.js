var expect = require('expect.js');
var Trait = require('../../lib/trait/number');

describe('trait number', function(){

  it('can throw validation error', function(){
    var trait = new Trait('123');
    expect(trait.error.errors[0]).to.eql('invalid type')
  })

  it('can validate correctly with number', function(){
    var trait = new Trait(123);
    expect(trait.string).to.eql('123');
  })

  it('can ordinalize', function(){
    expect((new Trait(1, {ordinalize: true})).string).to.eql('1st')
    expect((new Trait(2, {ordinalize: true})).string).to.eql('2nd')
    expect((new Trait(3, {ordinalize: true})).string).to.eql('3rd')
    expect((new Trait(4, {ordinalize: true})).string).to.eql('4th')
  })

})
