var Promise = require('../index');

/**
 *
 * takes a node style API and transforms it into a Fantasy-land Promise
 * @example:
 * var fs = require("fs");
 * var node = require("fantasy-promises/node");
 * var p = node.call(fs.readFile,'./myfile.js', 'UTF-8');
 * p.fork(
 *        function(d) {console.log(d)},
 *        function(err) {console.log(err)},
 * );
 */

var slice = [].slice;

exports.apply = function apply(func, args) {
  return new Promise(function (resolve, reject) {
    var callback = function (err, data) {
      if(err) return reject(error);
      resolve(data);
    }
    func.apply(null, args.concat(callback));
  });
}

exports.call = function call(func) {
  return exports.apply(func, slice.call(arguments, 1));
}

