var expect = require('expect.js');
var Trait = require('../../lib/trait/string');

describe('trait string', function(){

  it('can throw validation error', function(){
    var trait = new Trait(new Date);
    expect(trait.error.errors[0]).to.eql('invalid type')
  })

  it('can validate correctly', function(){
    var trait = new Trait('boom');
    expect(trait.string).to.eql('boom');
    expect(trait.error).to.eql(undefined)
  })

  it('can capitalize', function(){
    var trait = new Trait('boom bam', {capitalize:true});
    expect(trait.string).to.eql('Boom Bam')
  })

  it('can clever caps', function(){
    var trait = new Trait('the foo of bar', {cleverCaps:true});
    expect(trait.string).to.eql('The Foo of Bar');
  })

  describe('puncSuffix', function(){
    it('can change suffix on given punctuation', function(){
      var trait = new Trait('the foo of bar!');
      trait.suffix(', ');
      trait.puncSuffix('?!.', ' ')
      trait.$stringify();
      expect(trait.string).to.eql('the foo of bar! ');
    })

    it('can ignore puncSuffix', function(){
      var trait = new Trait('the foo of bar');
      trait.suffix(', ');
      trait.puncSuffix('?!.', ' ')
      trait.$stringify();
      expect(trait.string).to.eql('the foo of bar, ');
    })
  })
})