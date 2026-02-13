const {casingMatches, availableCasings} = require('../casing-matches')

describe('casingMatches', function () {
  describe('camel case', function () {
    it('matches valid camelCase identifiers', function () {
      expect(casingMatches('foo', 'camel')).toBe(true)
      expect(casingMatches('fooBar', 'camel')).toBe(true)
      expect(casingMatches('fooBarBaz', 'camel')).toBe(true)
      expect(casingMatches('className', 'camel')).toBe(true)
    })

    it('matches camelCase with numbers', function () {
      expect(casingMatches('button2', 'camel')).toBe(true)
      expect(casingMatches('v1Release', 'camel')).toBe(true)
    })

    it('rejects numbers at the start', function () {
      expect(casingMatches('2button', 'camel')).toBe(false)
    })

    it('rejects PascalCase', function () {
      expect(casingMatches('Foo', 'camel')).toBe(false)
      expect(casingMatches('FooBar', 'camel')).toBe(false)
    })

    it('rejects kebab-case', function () {
      expect(casingMatches('foo-bar', 'camel')).toBe(false)
    })
  })

  describe('pascal case', function () {
    it('matches valid PascalCase identifiers', function () {
      expect(casingMatches('Foo', 'pascal')).toBe(true)
      expect(casingMatches('FooBar', 'pascal')).toBe(true)
      expect(casingMatches('FooBarBaz', 'pascal')).toBe(true)
      expect(casingMatches('ClassName', 'pascal')).toBe(true)
    })

    it('matches PascalCase with numbers', function () {
      expect(casingMatches('Foo1Bar', 'pascal')).toBe(true)
      expect(casingMatches('Button2', 'pascal')).toBe(true)
    })

    it('rejects camelCase', function () {
      expect(casingMatches('foo', 'pascal')).toBe(false)
      expect(casingMatches('fooBar', 'pascal')).toBe(false)
    })

    it('rejects kebab-case', function () {
      expect(casingMatches('Foo-Bar', 'pascal')).toBe(false)
    })
  })

  describe('kebab case', function () {
    it('matches valid kebab-case identifiers', function () {
      expect(casingMatches('foo', 'kebab')).toBe(true)
      expect(casingMatches('foo-bar', 'kebab')).toBe(true)
      expect(casingMatches('foo-bar-baz', 'kebab')).toBe(true)
      expect(casingMatches('class-name', 'kebab')).toBe(true)
    })

    it('matches kebab-case with trailing numbers', function () {
      expect(casingMatches('button-2', 'kebab')).toBe(true)
      expect(casingMatches('v-1', 'kebab')).toBe(true)
    })

    it('rejects camelCase', function () {
      expect(casingMatches('fooBar', 'kebab')).toBe(false)
    })

    it('rejects PascalCase', function () {
      expect(casingMatches('FooBar', 'kebab')).toBe(false)
    })
  })

  describe('invalid case type', function () {
    it('throws an error for unknown case type', function () {
      expect(() => casingMatches('foo', 'snake')).toThrow('Invalid case type snake')
      expect(() => casingMatches('foo', 'unknown')).toThrow('Invalid case type unknown')
    })
  })
})

describe('availableCasings', function () {
  it('exports all available casing options', function () {
    expect(availableCasings).toEqual(['camel', 'pascal', 'kebab'])
  })
})
