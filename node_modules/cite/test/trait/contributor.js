var Trait = require('../../lib/trait/contributor');
var expect = require('expect.js');

describe('trait contributor', function(){

  function setup(t){
    t.separators(', ', ' & ')
  }

  it('can throw invalid type', function(){
    var trait = new Trait(new Date)
    expect(trait.error.errors[0]).to.eql('invalid type')
  })

  it('can throw no contributors', function(){
    var trait = new Trait([])
    expect(trait.error.errors[0]).to.eql('no contributors')
  })

  it('can throw missing props', function(){
    var trait = new Trait([{first: 'foo'}])
    expect(trait.error.errors[0]).to.eql('no last at position 0')
  })

  it('can validate correctly', function(){
    var trait = new Trait([{first: 'foo', last: 'bar'}])
    expect(trait.string).to.eql('Foo Bar')
    expect(trait.error).to.be(undefined)
  })

  it('can parse one full contributor', function(){
    var trait = new Trait([{first: 'foo', last: 'bar'}])
    expect(trait.string).to.equal('Foo Bar')
    expect(trait.error).to.be(undefined)
  })

  it('can parse one corp contributor', function(){
    var trait = new Trait([{name: 'foo'}])
    expect(trait.string).to.equal('foo')
    expect(trait.error).to.be(undefined)
  })

  it('can parse two contributors', function(){
    var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}]
    var trait = new Trait(d)
    setup(trait)
    trait.$stringify();
    expect(trait.string).to.equal('Foo Bar & Fee Fi');
    expect(trait.error).to.be(undefined)
  })

  it('can parse three contributors', function(){
    var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
    var trait = new Trait(d)
    setup(trait)
    trait.$stringify();
    expect(trait.string).to.equal('Foo Bar, Fee Fi & Fo Thumb');
    expect(trait.error).to.be(undefined)
  })

  it('can parse three contributors with corp', function(){
    var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {name: 'fo'}]
    var trait = new Trait(d)
    setup(trait)
    trait.$stringify();
    expect(trait.string).to.equal('Foo Bar, Fee Fi & fo');
    expect(trait.error).to.be(undefined)
  })

  it('can parse multiSuffix', function(){
    var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}]
    var trait = new Trait(d);
    setup(trait)
    trait.multiSuffix(' (Foo)');
    trait.$stringify();
    expect(trait.string).to.equal('Foo Bar & Fee Fi (Foo)');
    expect(trait.error).to.be(undefined)
  })

  it('can ignore multiSuffix if one author', function(){
    var d = [{first: 'foo', last: 'bar'}];
    var trait = new Trait(d)
    setup(trait)
    trait.multiSuffix(' (Foo)');
    trait.$stringify();
    expect(trait.string).to.equal('Foo Bar');
    expect(trait.error).to.be(undefined)
  })

  describe('shrink', function(){
    it('shrinks correctly to 1 from 2', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(1)
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar');
      expect(trait.error).to.be(undefined)
    })

    it('shrinks correctly to 1 from 3', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(1)
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar');
      expect(trait.error).to.be(undefined)
    })

    it('shrinks correctly', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(2)
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar & Fo Thumb');
      expect(trait.error).to.be(undefined)
    })

    it('ignores shrink - when equal author to count', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(3)
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar, Fee Fi & Fo Thumb');
      expect(trait.error).to.be(undefined)
    })

    it('ignores shrink - when more authors than count', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(4)
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar, Fee Fi & Fo Thumb');
      expect(trait.error).to.be(undefined)
    })

    it('shrinks - from 3 to 2 WITH TEXT', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(2, ' et al')
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar & Fo Thumb et al');
      expect(trait.error).to.be(undefined)
    })

    it('ignores shrink - doesnt add text - when count matches author count', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(2, ' et al')
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar & Fee Fi');
      expect(trait.error).to.be(undefined)
    })

    it('shrinks - from 4 down to 3 WITH TEXT SEPARATOR', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}, {first: 'bing', last: 'bam'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(3, ' ... ', {lastSeparator: true})
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar, Fee Fi ... Bing Bam');
      expect(trait.error).to.be(undefined)
    })

    it('ignores shrink - from 3 to 3 WITH TEXT SEPARATOR', function(){
      var d = [{first: 'foo', last: 'bar'}, {first: 'fee', last: 'fi'}, {first: 'fo', last: 'thumb'}]
      var trait = new Trait(d)
      setup(trait)
      trait.shrink(3, ' ... ', {lastSeparator: true})
      trait.$stringify();
      expect(trait.string).to.equal('Foo Bar, Fee Fi & Fo Thumb');
      expect(trait.error).to.be(undefined)
    })
  })

  describe('format', function(){
    it('formats and capitalizes correctly', function(){
      var trait = new Trait([{first: 'foo'}], {format: 'first'})
      expect(trait.string).to.equal('foo');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo'}], {format: 'FIRST'})
      expect(trait.string).to.equal('FOO');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo'}], {format: 'f'})
      expect(trait.string).to.equal('f');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo'}], {format: 'F'})
      expect(trait.string).to.equal('F');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foO'}], {format: 'First'})
      expect(trait.string).to.equal('FoO');
      expect(trait.error).to.be(undefined)
    })

    it('formats and capitalizes title correctly', function(){
      var trait = new Trait([{title: 'mrs'}], {format: 'title'})
      expect(trait.string).to.equal('mrs');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{title: 'mrs'}], {format: 'TITLE'})
      expect(trait.string).to.equal('MRS');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{title: 'mrs'}], {format: 't'})
      expect(trait.string).to.equal('mrs');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{title: 'mrs'}], {format: 'T'})
      expect(trait.string).to.equal('MRS');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{title: 'mrs'}], {format: 'Title'})
      expect(trait.string).to.equal('Mrs');
      expect(trait.error).to.be(undefined)
    })

    it('formats with First-initial and Last', function(){
      var trait = new Trait([{first: 'foo', last: 'bar'}], {format: 'Last, F.'})
      expect(trait.string).to.equal('Bar, F.')
      expect(trait.error).to.be(undefined)
    })

    it('formats with First and Last', function(){
      var trait = new Trait([{first: 'foo', last: 'bar'}], {format: 'Last, First.'})
      expect(trait.string).to.equal('Bar, Foo.');
      expect(trait.error).to.be(undefined)
    })

    it('formats with Title and Last', function(){
      var trait = new Trait([{title: 'mrs', first: 'foo', last: 'bar'}], {format: 'Title Last'})
      expect(trait.string).to.equal('Mrs Bar');
      expect(trait.error).to.be(undefined)
    })

    it('formats with Title, First and Last', function(){
      var trait = new Trait([{title: 'mrs', first: 'foo', last: 'bar'}], {format: 'Title First Last'})
      expect(trait.string).to.equal('Mrs Foo Bar');
      expect(trait.error).to.be(undefined)
    })

    it('formats with Title, First, Middle and Last', function(){
      var trait = new Trait([{title: 'mrs', first: 'foo', middle: 'fab', last: 'bar'}], {format: 'Title First Middle Last'})
      expect(trait.string).to.equal('Mrs Foo Fab Bar');
      expect(trait.error).to.be(undefined)
    })

    it('formats with First, Middle Initial and last', function(){
      var trait = new Trait([{first: 'foo', middle: 'fab', last: 'bar'}], {format: 'First M Last'})
      expect(trait.string).to.equal('Foo F Bar');
      expect(trait.error).to.be(undefined)
    })

    it('formats with First, optional Middle Initial and last', function(){
      var trait = new Trait([{first: 'foo', middle: 'lamb', last: 'bar'}], {format: 'First {M }Last'})
      expect(trait.string).to.equal('Foo L Bar');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo', last: 'bar'}], {format: 'First {M }Last'})
      expect(trait.string).to.equal('Foo Bar');
      expect(trait.error).to.be(undefined)
    })

    it('formats with multi optional', function(){
      var trait = new Trait([{first: 'foo', middle: 'boom', last: 'bar'}], {format: 'F {Middle Last}'})
      expect(trait.string).to.equal('F Boom Bar');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo', middle: 'boom'}], {format: 'F {Middle Last}'})
      expect(trait.string).to.equal('F ');
      expect(trait.error).to.be(undefined)
    })

    it('formats with several optionals', function(){
      var trait = new Trait([{first: 'foo', middle: 'boom', last: 'bar'}], {format: 'F{ Middle.}{ Last}'})
      expect(trait.string).to.equal('F Boom. Bar');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo', last: 'bar'}], {format: 'F{ Middle.}{ Last}'})
      expect(trait.string).to.equal('F Bar');
      expect(trait.error).to.be(undefined)

      var trait = new Trait([{first: 'foo'}], {format: 'F{ Middle.}{ Last}'})
      expect(trait.string).to.equal('F');
      expect(trait.error).to.be(undefined)
    })

    it('formats with escape', function(){
      var trait = new Trait([{first: 'foo', last: 'bar'}], {format: 'F [Last]'})
      expect(trait.string).to.equal('F Last');
      expect(trait.error).to.be(undefined)
    })

    it('formats with several escapes', function(){
      var trait = new Trait([{first: 'foo', last: 'bar'}], {format: '[Title] F [Last]'})
      expect(trait.string).to.equal('Title F Last');
      expect(trait.error).to.be(undefined)
    })
  })
})
