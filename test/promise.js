'use strict';

const Z = require('sanctuary-type-classes');
const jsc = require('jsverify');
const assert = require('assert');

const applicative = require('fantasy-land/laws/applicative');
const functor = require('fantasy-land/laws/functor');
const monad = require('fantasy-land/laws/monad');

const {identity} = require('fantasy-combinators');
const Identity = require('fantasy-identities');
const Promise = require('../fantasy-promises');

const {of, ap, map, chain, extract, extend} = require('fantasy-land');

function equals(a, b) {
  return Z.equals(a[extract], b[extract])
};

function test(name, func) {
  it(name, () => {
    assert.equal(func(Promise)(equals)(1), true)
  });
}

describe('Applicative Functor tests', () => {
  test('Identity', applicative.identity)
  test('Homomorphism', applicative.homomorphism)
  test('Interchange', applicative.interchange)
});

describe('Functor tests', () => {
  test('Identity', functor.identity)
  it('Composition', () => {
    assert.equal(functor.composition(Promise)(equals)(identity)(identity)(1), true)
  });
});

describe('Monad tests', () => {
  it('Left Identity', () => {
    assert.equal(monad.leftIdentity(Promise)(equals)(Promise[of])(1), true)
  });
  test('Right Identity', monad.rightIdentity)
});
