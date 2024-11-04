var expect = require('expect.js');
var Trait = require('../../lib/trait/date');


describe('trait date', function(){
  it('can throw validation error', function(){
    var trait = new Trait('str');
    expect(trait.error.errors[0]).to.eql('invalid type')
  })

  it('can throw incomplete date', function(){
    var trait = new Trait({year: '2010'}, {format: 'YYYY MM'});
    expect(trait.error.errors[0]).to.eql('no month')
  })

  it('can validate correctly', function(){
    var trait = new Trait({year: '2010'}, {format: 'YYYY'});
    expect(trait.string).to.eql('2010')
    expect(trait.error).to.be(undefined)
  })

  it('can format other stuff', function(){
    var trait = new Trait({month: 10, year: 2009}, {format: 'YYYY MM'});
    expect(trait.string).to.eql('2009 11')
    expect(trait.error).to.be(undefined)
  })

  it('can format time', function(){
    var trait = new Trait({hour: 13, minute: 30}, {format: 'h.ma'});
    expect(trait.string).to.eql('1.30pm')
    expect(trait.error).to.be(undefined)
  })
})