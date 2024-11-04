var expect = require('expect.js');
var Trait = require('../../lib/trait/page');

describe('trait page', function(){

  it('can throw validation error', function(){
    var trait = new Trait(123);
    expect(trait.error.errors[0]).to.eql('invalid type')

    var trait = new Trait([]);
    expect(trait.error.errors[0]).to.eql('invalid type')
  })

  it('should not throw validation error and outputs defaults', function(){
    var trait = new Trait('123');
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123');

    var trait = new Trait({first: '123'});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123');

    var trait = new Trait({first: '123', last:'125'});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123-125');

    var trait = new Trait([{first: '123', last:'125'}, {first: '456', last:'457'}], {multi:true});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123-125, 456-457');
  })

  it('sets single prefix/suffix', function(){
    var trait = new Trait('123', {singlePrefix: 'p '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('p 123');
    expect(trait.singlePrefix('&').options.singlePrefix).to.eql('&')

    var trait = new Trait('123', {singleSuffix: '! '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123! ');
    expect(trait.singleSuffix('&').options.singleSuffix).to.eql('&')

    var trait = new Trait(['123', {first: '456', last:'457'}], {multi:true, singlePrefix:'p '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('p 123, 456-457');

    var trait = new Trait(['123', {first: '456', last:'457'}], {multi:true, singleSuffix:'! '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123! , 456-457');
  })

  it('sets range prefix/suffix', function(){
    var trait = new Trait(['123', {first: '456', last:'457'}], {multi:true, rangePrefix:'pp '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123, pp 456-457');
    expect(trait.rangePrefix('&').options.rangePrefix).to.eql('&')

    var trait = new Trait(['123', {first: '456', last:'457'}], {multi:true, rangeSuffix:'! '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123, 456-457! ');
    expect(trait.rangeSuffix('&').options.rangeSuffix).to.eql('&')
  })

  it('sets range separator', function(){
    var trait = new Trait(['123', {first: '456', last:'457'}], {multi:true, rangeSeparator:' - '});
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123, 456 - 457');
    expect(trait.rangeSeparator('&').options.rangeSeparator).to.eql('&')
  })

  var opts = {multi:true, separator: ' | ', lastSeparator:' & '};

  it('sets separators with one page', function(){
    var trait = new Trait([{first: '456', last:'457'}], opts);
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('456-457');
    trait.separators('foo', 'bar')
    expect(trait.options.separator).to.eql('foo')
    expect(trait.options.lastSeparator).to.eql('bar')
  })

  it('sets separators with two pages', function(){
    var trait = new Trait([{first: '123', last:'125'}, {first: '456', last:'457'}], opts);
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123-125 & 456-457');
  })

  it('sets separators with three pages', function(){
    var trait = new Trait([{first: '123', last:'125'}, {first: '456', last:'457'}, {first: '555', last:'556'}], opts);
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('123-125 | 456-457 & 555-556');
  })
})
