var expect = require('expect.js')
var Style = require('../lib/type')

describe('style', function(){
  var style;

  beforeEach(function(){
    style = new Style({})
  })

  describe('.inherit()', function(){
    it('can setup inherit correctly', function(){
      style.inherit(function(){
        this.set('title', {prefix: 'bar'});
      })
      expect(style.traits.title.prefix).to.eql('bar');
      expect(style.order).to.have.length(0)
    })
  })

  describe('.set()', function(){
    it('can adjust settings', function(){
      style.set('title', {prefix: '&&&'})
      expect(style.traits.title.prefix).to.eql('&&&')
    })

    it('can adjust settings on trait with fn', function(){
      style.set('title', function(){
        this.prefix('&&&')
      })
      expect(style.traits.title.prefix).to.eql('&&&')
    })
  })

  describe('.trait()', function(){
    it('will add trait correctly', function(){
      var style = new Style({title:'foo'})
      style.trait('(title)')
      expect(style.traits.title.prefix).to.eql('(');
      expect(style.traits.title.suffix).to.eql(')');
      expect(style.stringify().string).to.eql('(foo)');

    })

    it('will add trait index correctly', function(){
      var style = new Style({title:'bar'})
      style.trait('(title)')
      style.trait('title&');
      expect(style.traits.title.prefix).to.eql('(');
      expect(style.traits.title.suffix).to.eql(')');
      expect(style.traits.title1.suffix).to.eql('&');
      expect(style.stringify().string).to.eql('(bar)bar&');
    })

    it('will add trait with similar name correctly', function(){
      // traits requires series and seriesTitle
      style.trait('seriesTitle');
      expect(style.traits.seriesTitle.suffix).to.be(undefined);
    })

    it('will add trait correctly with previous set', function(){
      style.set('title', {prefix: 'boom'});
      expect(style.traits.title.prefix).to.eql('boom');
      expect(style.traits.title.suffix).to.be(undefined);
      expect(style.order[0]).to.be(undefined);

      style.trait('title ');
      expect(style.order[0]).to.eql('title');
      expect(style.traits.title.prefix).to.eql('boom')
      expect(style.traits.title.suffix).to.eql(' ')
    })

    it('will raise error if trait not defined', function(){
      expect(style.trait.bind(style, 'foooooo')).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('could not parse string "foooooo"')
      });

      expect(style.set.bind(style, 'foooooo')).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.eql('no trait with name: foooooo')
      });
    })

    it('will setup trait correctly with prefix and cb', function(){
      style.trait('(title)', function(){
        this.bold();
      })
      expect(style.traits.title.prefix).to.eql('(')
      expect(style.traits.title.styles.b).to.be(true)
    })

    it('will setup trait correctly with prefix and obj', function(){
      style.trait('(title)', {bold: true})
      expect(style.traits.title.prefix).to.eql('(')
      expect(style.traits.title.styles.b).to.eql(true)
    })
  })

  describe('.text()', function(){
    it('will add text correctly', function(){
      style.text('1234')
      expect(style.traits.text.content).to.eql('1234');
    })

    it('will add text index correctly', function(){
      style.text('1234')
      style.text('abcd')
      expect(style.traits.text.content).to.eql('1234');
      expect(style.traits.text1.content).to.eql('abcd');
      expect(style.stringify().string).to.eql('1234abcd');
    })
  })

  describe('.requires()', function(){
    describe('single', function(){
      it('should require single trait', function(){
        var style = new Style({title: 'foobar'});
        style.requires('title');
        expect(style.validators[0].ids).to.eql(['title']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].passed).to.be(true);
      })

      it('should require single trait and raise error', function(){
        var style = new Style();
        style.requires('title');
        expect(style.validators[0].ids).to.eql(['title']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].passed).to.be(undefined);
      })
    })

    describe('all', function(){
      it('should require all traits', function(){
        var style = new Style({title: 'foobar', bar:'barfoo'});
        style.requires('title', 'bar');
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].passed).to.be(true);
      })

      it('should require all traits and raise error', function(){
        var style = new Style({bar:'foo'});
        style.requires('title', 'bar');
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].passed).to.be(undefined);
      })

      it('should require all traits and raise error', function(){
        var style = new Style();
        style.requires('title', 'bar');
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].passed).to.be(undefined);
      })
    })

    describe('all optional', function(){
      it('should require all traits', function(){
        var style = new Style({title: 'foobar', bar:'barfoo'});
        style.requires('title', 'bar', {optional:true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].optional).to.be(true);
        expect(style.validators[0].passed).to.be(true);
      })

      it('should require all traits and raise error', function(){
        var style = new Style({bar:'foo'});
        style.requires('title', 'bar', {optional:true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].optional).to.be(true);
        expect(style.validators[0].passed).to.be(undefined);
      })

      it('should require all traits except when optional', function(){
        var style = new Style();
        style.requires('title', 'bar', {optional:true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('requires');
        expect(style.validators[0].optional).to.be(true);
        expect(style.validators[0].passed).to.be(true);
      })
    })

    describe('either', function(){
      it('should require either traits', function(){
        var style = new Style({title: 'foobar'});
        style.requires('title', 'bar', {either: true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('either');
        expect(style.validators[0].passed).to.be(true);
      })

      it('should require either traits and raise error', function(){
        var style = new Style({title: 'baz', bar:'foo'});
        style.requires('title', 'bar', {either: true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('either');
        expect(style.validators[0].passed).to.be(undefined);
      })

      it('should require either traits and raise error', function(){
        var style = new Style();
        style.requires('title', 'bar', {either: true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('either');
        expect(style.validators[0].passed).to.be(undefined);
      })
    })

    describe('either optional', function(){
      it('should require either traits', function(){
        var style = new Style({title: 'foobar'});
        style.requires('title', 'bar', {optional:true, either: true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('either');
        expect(style.validators[0].optional).to.be(true);
        expect(style.validators[0].passed).to.be(true);
      })

      it('should require either traits and raise error', function(){
        var style = new Style({title: 'baz', bar:'foo'});
        style.requires('title', 'bar', {optional:true, either: true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('either');
        expect(style.validators[0].optional).to.be(true);
        expect(style.validators[0].passed).to.be(undefined);
      })

      it('should require either traits except when optional', function(){
        var style = new Style();
        style.requires('title', 'bar', {optional:true, either: true});
        expect(style.validators[0].ids).to.eql(['title', 'bar']);
        expect(style.validators[0].type).to.eql('either');
        expect(style.validators[0].optional).to.be(true);
        expect(style.validators[0].passed).to.be(true);
      })
    })
  })

  describe('.deRequires()', function(){
    it('should remove single requires', function(){
      style.requires('title');
      style.deRequires('title');
      expect(style.validators[0].overridden).to.be(true);
    })

    it('should remove multi requires', function(){
      style.requires('title', 'foo');
      style.deRequires('title', 'foo');
      expect(style.validators[0].overridden).to.be(true);
    })

    it('single can remove multi requires', function(){
      style.requires('title', 'foo');
      style.deRequires('title');
      expect(style.validators[0].overridden).to.be(true);
    })
  })

  describe('.all', function(){
    it('should provide syntax sugar for .requires', function(){
      var style = new Style({bar:'foo'});
      style.requires('title', 'bar');
      expect(style.validators[0].ids).to.eql(['title', 'bar']);
      expect(style.validators[0].type).to.eql('requires');
      expect(style.validators[0].passed).to.be(undefined);
    })
  })

  describe('.either', function(){
    it('should provide syntax sugar for .requires', function(){
      var style = new Style({title: 'baz', bar:'foo'});
      style.requires('title', 'bar', {either: true});
      expect(style.validators[0].ids).to.eql(['title', 'bar']);
      expect(style.validators[0].type).to.eql('either');
      expect(style.validators[0].passed).to.be(undefined);
    })
  })


  describe('.show()', function(){
    it('can show', function(){
      var style = new Style({title: 'foobar'})
      style.trait('title');
      style.show('title');
      expect(style.validators[0].ids).to.eql(['title']);
      expect(style.visibilities.title).to.eql('show');
      expect(style.stringify().string).to.eql('foobar');
    })

    it('can raise error', function(){
      var style = new Style({})
      style.trait('title');
      style.show('title');
      expect(style.validators[0].ids).to.eql(['title']);
      expect(style.visibilities.title).to.eql('show');
      expect(style.stringify().errors[0].message).to.eql('requires')
    })
  })

  describe('.hide()', function(){
    it('can hide', function(){
      var style = new Style({title: 'foobar'})
      style.trait('title');
      style.hide('title');
      expect(style.visibilities.title).to.eql('hide');
      expect(style.stringify().string).to.eql('');
      expect(style.errors).to.have.length(0);
    })

    it('can hide without data and without error', function(){
      var style = new Style({})
      style.trait('title');
      style.hide('title');
      expect(style.visibilities.title).to.eql('hide');
      expect(style.stringify().errors).to.have.length(0);
    })
  })

  describe('.atleast()', function(){
    it('throws error when not atleast trait', function(){
      var style = new Style()
      style.trait('title').trait('publisher').trait('datePublished')
      style.atleast('title', 'publisher')
      expect(style.stringify().errors[0].message).to.eql('atleast');
      expect(style.stringify().errors[0].traits).to.eql(['title', 'publisher']);
    })

    it('throws error when not atleast trait', function(){
      var style = new Style()
      style.trait('title').trait('publisher').trait('datePublished')
      style.atleast('title')
      expect(style.stringify().errors[0].message).to.eql('atleast');
      expect(style.stringify().errors[0].traits).to.eql(['title']);
    })

    it('ignores error when traits present', function(){
      var style = new Style({title:'bar'})
      style.trait('title').trait('publisher').trait('datePublished')
      style.atleast('title', 'publisher')
      expect(style.stringify().errors[0]).to.be(undefined);
    })

    it('ignores error when traits present', function(){
      var style = new Style({publisher:'bar'})
      style.trait('title').trait('publisher').trait('datePublished')
      style.atleast('title', 'publisher')
      expect(style.stringify().errors[0]).to.be(undefined);
    })

    it('ignores error when traits present', function(){
      var style = new Style({publisher:'bar', title: 'bar'})
      style.trait('title').trait('publisher').trait('datePublished')
      style.atleast('title', 'publisher')
      expect(style.stringify().errors[0]).to.be(undefined);
    })
  })

  describe('complex requirements', function(){
    function setup(s){
      s
      .atleast('doi', 'title')
      .trait('title, ')
      .trait('doi, ')
      .trait('publisher')
      .if('publisher', function(){
        this.set('doi', function(e){
          e.show();
        })
      })
    }

    it('throws correct errors', function(){
      var style = new Style({title: 'f', publisher:'abc'});
      setup(style);
      style.stringify();
      expect(style.validators).to.have.length(2);
      expect(style.validators[0].type).to.eql('atleast');
      expect(style.validators[0].failed).to.be(undefined);
      expect(style.validators[0].overridden).to.be(true);
      expect(style.validators[1].type).to.eql('requires');
      expect(style.validators[1].failed).to.be(true);

      expect(style.errors).to.have.length(1);
      expect(style.errors[0].message).to.eql('requires');
    })

    it('does not throw errors', function(){
      var style = new Style({title: 'f', publisher:'abc', doi:'foo'});
      setup(style);
      style.stringify();
      expect(style.validators).to.have.length(2);
      expect(style.validators[0].type).to.eql('atleast');
      expect(style.validators[0].failed).to.be(undefined);
      expect(style.validators[0].overridden).to.be(true);
      expect(style.validators[1].type).to.eql('requires');
      expect(style.validators[1].failed).to.be(undefined);

      expect(style.errors).to.have.length(0);
    })
  })


  describe('.validator()', function(){
    it('raises error', function(){
      var style = new Style({title: 'foobar'})
      style.validator('d.title && d.bar', function(){
        this.error('error bar')
      })
      style.validators[0].fn.call(style)
      expect(style.errors[0].message).to.eql('error bar');
    })

    it('does not raise error', function(){
      var style = new Style({title: 'foobar', bar: 'boom'})
      style.validator('d.title && d.bar', function(){
        this.error('error bar')
      })
      style.validators[0].fn.call(style)
      expect(style.errors).to.have.length(0)
    })
  })

  describe('move', function(){
    beforeEach(function(){
      style.trait('title').trait('datePublished').trait('author').trait('publisher')
    })

    it('can move before something', function(){
      style.move('author', {before: 'title'}).emit('move');
      expect(style.order[0]).to.eql('author')
      expect(style.order[1]).to.eql('title')
      expect(style.order[2]).to.eql('datePublished')
      expect(style.order[3]).to.eql('publisher')
    })

    it('can move after something', function(){
      style.move('title', {after: 'publisher'}).emit('move');
      expect(style.order[0]).to.eql('datePublished')
      expect(style.order[1]).to.eql('author')
      expect(style.order[2]).to.eql('publisher')
      expect(style.order[3]).to.eql('title')
    })

    it('can move to start', function(){
      style.move('publisher', {start: true}).emit('move');
      expect(style.order[0]).to.eql('publisher')
      expect(style.order[1]).to.eql('title')
      expect(style.order[2]).to.eql('datePublished')
      expect(style.order[3]).to.eql('author')
    })

    it('can move to end', function(){
      style.move('title',{end: true}).emit('move');
      expect(style.order[0]).to.eql('datePublished')
      expect(style.order[1]).to.eql('author')
      expect(style.order[2]).to.eql('publisher')
      expect(style.order[3]).to.eql('title')
    })

    it('wont move anything if trait not found', function(){
      style.move('foo', {after:'title'}).emit('move');
      expect(style.order[0]).to.eql('title')
      expect(style.order[1]).to.eql('datePublished')
      expect(style.order[2]).to.eql('author')
      expect(style.order[3]).to.eql('publisher')
    })
  })

  describe('if', function(){
    it('will fire if trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.if('title', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('')
    })

    it('will not fire if trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.if('publisher', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
    })

    it('will fire if -trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.if('-publisher', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('')
    })

    it('will not fire if -trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.if('-title', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
    })
  })

  describe('upon', function(){
    it('will fire upon trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.upon('title', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
      style.stringify()
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('')
    })

    it('will not fire upon trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.upon('publisher', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
      style.stringify()
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
    })

    it('will fire upon -trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.upon('-publisher', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
      style.stringify()
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('')
    })

    it('will not fire upon -trait', function(){
      var style = new Style({title:'foo'});
      style.trait('!!!title&&&');
      style.upon('-title', function(){
        this.set('title', {suffix:''})
      })
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
      style.stringify()
      expect(style.traits.title.prefix).to.eql('!!!')
      expect(style.traits.title.suffix).to.eql('&&&')
    })
  })

})
