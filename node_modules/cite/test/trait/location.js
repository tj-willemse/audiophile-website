var expect = require('expect.js');
var Trait = require('../../lib/trait/location');


describe('trait location', function() {
  it('can throw validation error', function() {
    var trait = new Trait('str');
    expect(trait.error.errors[0]).to.eql('invalid type')
  })

  it('parses correctly', function() {
    var trait = new Trait({
      city: 'Horsham',
      province: 'Sussex',
      country: 'United Kingdom'
    }, {
      format: 'city, province, country'
    });
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('Horsham, Sussex, United Kingdom')
  })

  it('parses optional correctly with data', function() {
    var trait = new Trait({
      city: 'Horsham',
      province: 'Sussex',
      country: 'United Kingdom'
    }, {
      format: 'city, {province, }country'
    });
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('Horsham, Sussex, United Kingdom')
  })

  it('parses optional correctly without data', function() {
    var trait = new Trait({
      city: 'Horsham',
      country: 'United Kingdom'
    }, {
      format: 'city, {province, }country'
    });
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('Horsham, United Kingdom')
  })

  it('parses escapes correctly', function() {
    var trait = new Trait({
      city: 'Horsham',
      country: 'United Kingdom'
    }, {
      format: 'city, [country]'
    });
    expect(trait.error).to.be(undefined);
    expect(trait.string).to.eql('Horsham, country')
  })
})
