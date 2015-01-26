var λ = require('fantasy-check/src/adapters/nodeunit'),
    combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
	I = require ('fantasy-identities'),
    Promise = require('../fantasy-promises'),

    fs = require('fs'),

    identity = combinators.identity;

exports.promise = {
    'when testing of should return correct value': λ.check(
        function(a) {
            var promise = Promise.of(a);
            return promise.fork(identity) === a;
        },
        [λ.AnyVal]
    ),
    'when testing chain should return correct value': λ.check(
        function(a) {
            var promise = Promise.of(a).chain(
                function(x) {
                    return Promise.of(x + 1);
                }
            );
            return promise.fork(identity) === a + 1;
        },
        [Number]
    ),
    'when testing map should return correct value': λ.check(
        function(a) {
            var promise = Promise.of(a).map(
                function(x) {
                    return x + 1;
                }
            );
            return promise.fork(identity) === a + 1;
        },
        [Number]
    ),
    'when testing nested promises with chain should return correct value': λ.check(
        function(a) {
            var promise = Promise.of(Promise.of(a)).chain(identity);
            return promise.fork(identity) === a;
        },
        [λ.AnyVal]
    ),
    'when testing extract should return correct value': λ.check(
        function(a) {
            var promise = Promise.of(a).map(
                function(x) {
                    return x + 1;
                }
            );
            return promise.extract() === a + 1;
        },
        [Number]
    ),
    'when testing extend should return correct value': λ.check(
        function(a) {
            var promise = Promise.of(a).extend(
                function(x) {
                    return x.extract().toUpperCase();
                }
            );
            return promise.extract() === a.toUpperCase();
        },
        [String]
    ),
    'when building transformer, it should return correct value': λ.check(
		function (a) {
			var PTI = Promise.PromiseT (I); // Identity Monad
			return PTI.of (a).fork (identity).x  === I.of (a).x;
		},
		[λ.AnyVal]
    ),
    'when lifting into transformer, it should return correct value': λ.check(
		function (a) {
			var PTI = Promise.PromiseT (I); // Identity Monad
			return PTI.lift (I.of (a)).fork (identity).x  === I.of (a).x;
		},
		[λ.AnyVal]
    ),
    'when chaining transformer, it should return correct value': λ.check(
		function (a) {
			var PTI = Promise.PromiseT (I); // Identity Monad
			return PTI.of (a).chain (PTI.lift).fork (identity).x  === I.of (a).x;
		},
		[λ.AnyVal]
    ),
};

exports.testReadFile = function(test) {
    var promise = new Promise(function(resolve) {
        fs.readFile(__filename, 'utf8', function(error, data) {
            resolve(data);
        });
    });

    promise.fork(function(data) {
        test.ok(true);
        test.done();
    });
};

exports.testExtend = function(test) {
    var promise = new Promise(function(resolve) {
        setTimeout(function() {
            resolve("100 ms");
        }, 100);
    }).extend(function(p) {
        return p.extract().toUpperCase();
    }).fork(function(data) {
        test.equal("100 MS", data);
        test.done();
    });
};
