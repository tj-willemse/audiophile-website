var expect = require('expect.js');
var Trait = require('../../lib/trait/trait');
var StringTrait = require('../../lib/trait/string')
var NumberTrait = require('../../lib/trait/number')

describe('Trait', function(){

  describe('no value', function(){
    it('should not raise direct error', function(){
      var trait = new Trait({});
      trait.check()
      expect(trait.valid).to.be(undefined)
    })

    it('should display correctly if stubbed', function(){
      var trait = new Trait({stub:'foo'});
      expect(trait.check()).to.eql('foo')
      expect(trait.error).to.be(undefined);
      expect(trait.valid).to.be(undefined)
    })

    it('should display correctly if stubbed with fixes and styles', function(){
      var trait = new Trait({stub:'foo', prefix:'!', suffix: '&', bold: true});
      expect(trait.check()).to.eql('!<strong>foo</strong>&')
      expect(trait.error).to.be(undefined);
      expect(trait.valid).to.be(undefined)
    })
  })

  describe('.prefix()', function(){
    it('can setup correctly', function(){
      var trait = new StringTrait({prefix: '123'});
      expect(trait.stringify('test')).to.eql('123test')
    })

    it('can bold correctly', function(){
      var trait = new StringTrait({prefix: '123', boldPrefix: true});
      expect(trait.stringify('test')).to.eql('<strong>123</strong>test')
    })

    it('can italics correctly', function(){
      var trait = new StringTrait({prefix: '123', italicsPrefix: true});
      expect(trait.stringify('test')).to.eql('<em>123</em>test')
    })

    it('can bold & italics correctly', function(){
      var trait = new StringTrait({prefix: '123', boldPrefix: true, italicsPrefix: true});
      expect(trait.stringify('test')).to.eql('<em><strong>123</strong></em>test')
    })
  })

  describe('.suffix()', function(){
    it('can setup correctly', function(){
      var trait = new StringTrait({suffix: '123'});
      expect(trait.stringify('test')).to.eql('test123')
    })

    it('can bold correctly', function(){
      var trait = new StringTrait({suffix: '123', boldSuffix:true});
      expect(trait.stringify('test')).to.eql('test<strong>123</strong>')
    })

    it('can italics correctly', function(){
      var trait = new StringTrait({suffix: '123', italicsSuffix: true});
      expect(trait.stringify('test')).to.eql('test<em>123</em>')
    })

    it('can bold & italics correctly', function(){
      var trait = new StringTrait({suffix: '123', boldSuffix:true, italicsSuffix: true});
      expect(trait.stringify('test')).to.eql('test<em><strong>123</strong></em>')
    })
  })

  describe('.enum()', function(){
    var schema = {};

    beforeEach(function(){
      schema = {
        enums: [{
          label:'FOO',
          content: 'foobar'
        }, {
          label:'BAZ',
          content: 'bazbam'
        }]
      }
    })

    it('selects first item by label', function(){
      var trait = new StringTrait(schema);
      var str = trait.stringify('FOO');
      expect(trait.error).to.be(undefined);
      expect(str).to.eql('foobar');
    })

    it('selects second item by label', function(){
      var trait = new StringTrait(schema);
      var str = trait.stringify('BAZ')
      expect(trait.error).to.be(undefined);
      expect(str).to.eql('bazbam');
    })

    it('raises error if no item found', function(){
      var trait = new StringTrait(schema);
      var str = trait.stringify('label-that-does-not-exist')
      expect(trait.error.errors[0]).to.eql('no enum matching value')
    })

    it('selects by selector', function(){
      schema.enums[1].selector = 'sel'
      var trait = new StringTrait(schema);
      var str = trait.stringify('sel')
      expect(trait.error).to.be(undefined);
      expect(str).to.eql('bazbam');
    })

    it('can select a number', function(){
      schema = {
        enums: [{
          label:'one',
          content: 1
        }, {
          label:'two',
          content: 2
        }]
      };
      var trait = new NumberTrait(schema);
      expect(trait.stringify('one')).to.eql('1')
      expect(trait.stringify('two')).to.eql('2')
    })
  })

})