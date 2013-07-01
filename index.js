/**
    # Fantasy Promises

    This library implements purely functional, monadic promises.
**/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but only CommonJS-like
        // enviroments that support module.exports, like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

/**
    ## `Promise(fork)`

    Promise is a constructor which takes a `fork` function. The `fork`
    function takes two arguments:

        fork(resolve, reject)

    Both `resolve` and `reject` are side-effecting callbacks.

    ### `fork(resolve, reject)`

    The `resolve` callback gets called on a "successful" value. The
    `reject` callback gets called on a "failure" value.
**/
function Promise(fork) {
    this.fork = fork;
}

/**
    ### `Promise.of(x)`

    Creates a Promise that contains a successful value.
**/
Promise.of = function(x) {
    return new Promise(function(resolve, reject) {
        resolve(x);
    });
};

/**
    ### `Promise.error(x)`

    Creates a Promise that contains a failure value.
**/
Promise.error = function(x) {
    return new Promise(function(resolve, reject) {
        reject(x);
    });
};

/**
    ### `chain(f)`

    Returns a new promise that evaluates `f` when the current promise
    is successfully fulfilled. `f` must return a new promise.
**/
Promise.prototype.chain = function(f) {
    var promise = this;
    return new Promise(function(resolve, reject) {
        promise.fork(function(a) {
            f(a).fork(resolve, reject);
        }, reject);
    });
};

/**
    ### `reject(f)`

    Returns a new promise that evaluates `f` when the current promise
    fails. `f` must return a new promise.
**/
Promise.prototype.reject = function(f) {
    var promise = this;
    return new Promise(function(resolve, reject) {
        promise.fork(resolve, function(a) {
            f(a).fork(resolve, reject);
        });
    });
};

/**
    ### `map(f)`

    Returns a new promise that evaluates `f` on a value and passes it
    through to the resolve function.
**/
Promise.prototype.map = function(f) {
    var promise = this;
    return new Promise(function(resolve, reject) {
        promise.fork(function(a) {
            resolve(f(a));
        }, reject);
    });
};

return Promise;
}));

/**
    ## Fantasy Land Compatible

    [
      ![](https://raw.github.com/pufuwozu/fantasy-land/master/logo.png)
    ](https://github.com/pufuwozu/fantasy-land)
**/
