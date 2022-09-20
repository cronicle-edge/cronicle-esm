#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/prr/prr.js
var require_prr = __commonJS({
  "node_modules/prr/prr.js"(exports, module2) {
    (function(name, context, definition) {
      if (typeof module2 != "undefined" && module2.exports)
        module2.exports = definition();
      else
        context[name] = definition();
    })("prr", exports, function() {
      var setProperty = typeof Object.defineProperty == "function" ? function(obj, key, options) {
        Object.defineProperty(obj, key, options);
        return obj;
      } : function(obj, key, options) {
        obj[key] = options.value;
        return obj;
      }, makeOptions = function(value, options) {
        var oo = typeof options == "object", os = !oo && typeof options == "string", op = function(p) {
          return oo ? !!options[p] : os ? options.indexOf(p[0]) > -1 : false;
        };
        return {
          enumerable: op("enumerable"),
          configurable: op("configurable"),
          writable: op("writable"),
          value
        };
      }, prr = function(obj, key, value, options) {
        var k;
        options = makeOptions(value, options);
        if (typeof key == "object") {
          for (k in key) {
            if (Object.hasOwnProperty.call(key, k)) {
              options.value = key[k];
              setProperty(obj, k, options);
            }
          }
          return obj;
        }
        return setProperty(obj, key, options);
      };
      return prr;
    });
  }
});

// node_modules/errno/custom.js
var require_custom = __commonJS({
  "node_modules/errno/custom.js"(exports, module2) {
    var prr = require_prr();
    function init(type, message, cause) {
      if (!!message && typeof message != "string") {
        message = message.message || message.name;
      }
      prr(this, {
        type,
        name: type,
        cause: typeof message != "string" ? message : cause,
        message
      }, "ewr");
    }
    function CustomError(message, cause) {
      Error.call(this);
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, this.constructor);
      init.call(this, "CustomError", message, cause);
    }
    CustomError.prototype = new Error();
    function createError(errno, type, proto) {
      var err = function(message, cause) {
        init.call(this, type, message, cause);
        if (type == "FilesystemError") {
          this.code = this.cause.code;
          this.path = this.cause.path;
          this.errno = this.cause.errno;
          this.message = (errno.errno[this.cause.errno] ? errno.errno[this.cause.errno].description : this.cause.message) + (this.cause.path ? " [" + this.cause.path + "]" : "");
        }
        Error.call(this);
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, err);
      };
      err.prototype = !!proto ? new proto() : new CustomError();
      return err;
    }
    module2.exports = function(errno) {
      var ce = function(type, proto) {
        return createError(errno, type, proto);
      };
      return {
        CustomError,
        FilesystemError: ce("FilesystemError"),
        createError: ce
      };
    };
  }
});

// node_modules/errno/errno.js
var require_errno = __commonJS({
  "node_modules/errno/errno.js"(exports, module2) {
    var all = module2.exports.all = [
      {
        errno: -2,
        code: "ENOENT",
        description: "no such file or directory"
      },
      {
        errno: -1,
        code: "UNKNOWN",
        description: "unknown error"
      },
      {
        errno: 0,
        code: "OK",
        description: "success"
      },
      {
        errno: 1,
        code: "EOF",
        description: "end of file"
      },
      {
        errno: 2,
        code: "EADDRINFO",
        description: "getaddrinfo error"
      },
      {
        errno: 3,
        code: "EACCES",
        description: "permission denied"
      },
      {
        errno: 4,
        code: "EAGAIN",
        description: "resource temporarily unavailable"
      },
      {
        errno: 5,
        code: "EADDRINUSE",
        description: "address already in use"
      },
      {
        errno: 6,
        code: "EADDRNOTAVAIL",
        description: "address not available"
      },
      {
        errno: 7,
        code: "EAFNOSUPPORT",
        description: "address family not supported"
      },
      {
        errno: 8,
        code: "EALREADY",
        description: "connection already in progress"
      },
      {
        errno: 9,
        code: "EBADF",
        description: "bad file descriptor"
      },
      {
        errno: 10,
        code: "EBUSY",
        description: "resource busy or locked"
      },
      {
        errno: 11,
        code: "ECONNABORTED",
        description: "software caused connection abort"
      },
      {
        errno: 12,
        code: "ECONNREFUSED",
        description: "connection refused"
      },
      {
        errno: 13,
        code: "ECONNRESET",
        description: "connection reset by peer"
      },
      {
        errno: 14,
        code: "EDESTADDRREQ",
        description: "destination address required"
      },
      {
        errno: 15,
        code: "EFAULT",
        description: "bad address in system call argument"
      },
      {
        errno: 16,
        code: "EHOSTUNREACH",
        description: "host is unreachable"
      },
      {
        errno: 17,
        code: "EINTR",
        description: "interrupted system call"
      },
      {
        errno: 18,
        code: "EINVAL",
        description: "invalid argument"
      },
      {
        errno: 19,
        code: "EISCONN",
        description: "socket is already connected"
      },
      {
        errno: 20,
        code: "EMFILE",
        description: "too many open files"
      },
      {
        errno: 21,
        code: "EMSGSIZE",
        description: "message too long"
      },
      {
        errno: 22,
        code: "ENETDOWN",
        description: "network is down"
      },
      {
        errno: 23,
        code: "ENETUNREACH",
        description: "network is unreachable"
      },
      {
        errno: 24,
        code: "ENFILE",
        description: "file table overflow"
      },
      {
        errno: 25,
        code: "ENOBUFS",
        description: "no buffer space available"
      },
      {
        errno: 26,
        code: "ENOMEM",
        description: "not enough memory"
      },
      {
        errno: 27,
        code: "ENOTDIR",
        description: "not a directory"
      },
      {
        errno: 28,
        code: "EISDIR",
        description: "illegal operation on a directory"
      },
      {
        errno: 29,
        code: "ENONET",
        description: "machine is not on the network"
      },
      {
        errno: 31,
        code: "ENOTCONN",
        description: "socket is not connected"
      },
      {
        errno: 32,
        code: "ENOTSOCK",
        description: "socket operation on non-socket"
      },
      {
        errno: 33,
        code: "ENOTSUP",
        description: "operation not supported on socket"
      },
      {
        errno: 34,
        code: "ENOENT",
        description: "no such file or directory"
      },
      {
        errno: 35,
        code: "ENOSYS",
        description: "function not implemented"
      },
      {
        errno: 36,
        code: "EPIPE",
        description: "broken pipe"
      },
      {
        errno: 37,
        code: "EPROTO",
        description: "protocol error"
      },
      {
        errno: 38,
        code: "EPROTONOSUPPORT",
        description: "protocol not supported"
      },
      {
        errno: 39,
        code: "EPROTOTYPE",
        description: "protocol wrong type for socket"
      },
      {
        errno: 40,
        code: "ETIMEDOUT",
        description: "connection timed out"
      },
      {
        errno: 41,
        code: "ECHARSET",
        description: "invalid Unicode character"
      },
      {
        errno: 42,
        code: "EAIFAMNOSUPPORT",
        description: "address family for hostname not supported"
      },
      {
        errno: 44,
        code: "EAISERVICE",
        description: "servname not supported for ai_socktype"
      },
      {
        errno: 45,
        code: "EAISOCKTYPE",
        description: "ai_socktype not supported"
      },
      {
        errno: 46,
        code: "ESHUTDOWN",
        description: "cannot send after transport endpoint shutdown"
      },
      {
        errno: 47,
        code: "EEXIST",
        description: "file already exists"
      },
      {
        errno: 48,
        code: "ESRCH",
        description: "no such process"
      },
      {
        errno: 49,
        code: "ENAMETOOLONG",
        description: "name too long"
      },
      {
        errno: 50,
        code: "EPERM",
        description: "operation not permitted"
      },
      {
        errno: 51,
        code: "ELOOP",
        description: "too many symbolic links encountered"
      },
      {
        errno: 52,
        code: "EXDEV",
        description: "cross-device link not permitted"
      },
      {
        errno: 53,
        code: "ENOTEMPTY",
        description: "directory not empty"
      },
      {
        errno: 54,
        code: "ENOSPC",
        description: "no space left on device"
      },
      {
        errno: 55,
        code: "EIO",
        description: "i/o error"
      },
      {
        errno: 56,
        code: "EROFS",
        description: "read-only file system"
      },
      {
        errno: 57,
        code: "ENODEV",
        description: "no such device"
      },
      {
        errno: 58,
        code: "ESPIPE",
        description: "invalid seek"
      },
      {
        errno: 59,
        code: "ECANCELED",
        description: "operation canceled"
      }
    ];
    module2.exports.errno = {};
    module2.exports.code = {};
    all.forEach(function(error) {
      module2.exports.errno[error.errno] = error;
      module2.exports.code[error.code] = error;
    });
    module2.exports.custom = require_custom()(module2.exports);
    module2.exports.create = module2.exports.custom.createError;
  }
});

// node_modules/async/dist/async.js
var require_async = __commonJS({
  "node_modules/async/dist/async.js"(exports, module2) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global2.async = global2.async || {});
    })(exports, function(exports2) {
      "use strict";
      function slice(arrayLike, start) {
        start = start | 0;
        var newLen = Math.max(arrayLike.length - start, 0);
        var newArr = Array(newLen);
        for (var idx = 0; idx < newLen; idx++) {
          newArr[idx] = arrayLike[start + idx];
        }
        return newArr;
      }
      var apply = function(fn) {
        var args = slice(arguments, 1);
        return function() {
          var callArgs = slice(arguments);
          return fn.apply(null, args.concat(callArgs));
        };
      };
      var initialParams = function(fn) {
        return function() {
          var args = slice(arguments);
          var callback = args.pop();
          fn.call(this, args, callback);
        };
      };
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
      var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
      function fallback(fn) {
        setTimeout(fn, 0);
      }
      function wrap(defer) {
        return function(fn) {
          var args = slice(arguments, 1);
          defer(function() {
            fn.apply(null, args);
          });
        };
      }
      var _defer;
      if (hasSetImmediate) {
        _defer = setImmediate;
      } else if (hasNextTick) {
        _defer = process.nextTick;
      } else {
        _defer = fallback;
      }
      var setImmediate$1 = wrap(_defer);
      function asyncify(func) {
        return initialParams(function(args, callback) {
          var result;
          try {
            result = func.apply(this, args);
          } catch (e) {
            return callback(e);
          }
          if (isObject(result) && typeof result.then === "function") {
            result.then(function(value) {
              invokeCallback(callback, null, value);
            }, function(err) {
              invokeCallback(callback, err.message ? err : new Error(err));
            });
          } else {
            callback(null, result);
          }
        });
      }
      function invokeCallback(callback, error, value) {
        try {
          callback(error, value);
        } catch (e) {
          setImmediate$1(rethrow, e);
        }
      }
      function rethrow(error) {
        throw error;
      }
      var supportsSymbol = typeof Symbol === "function";
      function isAsync(fn) {
        return supportsSymbol && fn[Symbol.toStringTag] === "AsyncFunction";
      }
      function wrapAsync(asyncFn) {
        return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
      }
      function applyEach$1(eachfn) {
        return function(fns) {
          var args = slice(arguments, 1);
          var go = initialParams(function(args2, callback) {
            var that = this;
            return eachfn(fns, function(fn, cb) {
              wrapAsync(fn).apply(that, args2.concat(cb));
            }, callback);
          });
          if (args.length) {
            return go.apply(this, args);
          } else {
            return go;
          }
        };
      }
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var Symbol$1 = root.Symbol;
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var nativeObjectToString = objectProto.toString;
      var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
        try {
          value[symToStringTag$1] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag$1] = tag;
          } else {
            delete value[symToStringTag$1];
          }
        }
        return result;
      }
      var objectProto$1 = Object.prototype;
      var nativeObjectToString$1 = objectProto$1.toString;
      function objectToString(value) {
        return nativeObjectToString$1.call(value);
      }
      var nullTag = "[object Null]";
      var undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      var asyncTag = "[object AsyncFunction]";
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      var MAX_SAFE_INTEGER = 9007199254740991;
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      var breakLoop = {};
      function noop() {
      }
      function once(fn) {
        return function() {
          if (fn === null)
            return;
          var callFn = fn;
          fn = null;
          callFn.apply(this, arguments);
        };
      }
      var iteratorSymbol = typeof Symbol === "function" && Symbol.iterator;
      var getIterator = function(coll) {
        return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
      };
      function baseTimes(n, iteratee) {
        var index2 = -1, result = Array(n);
        while (++index2 < n) {
          result[index2] = iteratee(index2);
        }
        return result;
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var argsTag = "[object Arguments]";
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }
      var objectProto$3 = Object.prototype;
      var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
      var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      var isArray = Array.isArray;
      function stubFalse() {
        return false;
      }
      var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
      var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer2 = moduleExports ? root.Buffer : void 0;
      var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
      var isBuffer = nativeIsBuffer || stubFalse;
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      var argsTag$1 = "[object Arguments]";
      var arrayTag = "[object Array]";
      var boolTag = "[object Boolean]";
      var dateTag = "[object Date]";
      var errorTag = "[object Error]";
      var funcTag$1 = "[object Function]";
      var mapTag = "[object Map]";
      var numberTag = "[object Number]";
      var objectTag = "[object Object]";
      var regexpTag = "[object RegExp]";
      var setTag = "[object Set]";
      var stringTag = "[object String]";
      var weakMapTag = "[object WeakMap]";
      var arrayBufferTag = "[object ArrayBuffer]";
      var dataViewTag = "[object DataView]";
      var float32Tag = "[object Float32Array]";
      var float64Tag = "[object Float64Array]";
      var int8Tag = "[object Int8Array]";
      var int16Tag = "[object Int16Array]";
      var int32Tag = "[object Int32Array]";
      var uint8Tag = "[object Uint8Array]";
      var uint8ClampedTag = "[object Uint8ClampedArray]";
      var uint16Tag = "[object Uint16Array]";
      var uint32Tag = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      var freeExports$1 = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
      var freeModule$1 = freeExports$1 && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
      var freeProcess = moduleExports$1 && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }
      var objectProto$5 = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$5;
        return value === proto;
      }
      function overArg(func, transform2) {
        return function(arg) {
          return func(transform2(arg));
        };
      }
      var nativeKeys = overArg(Object.keys, Object);
      var objectProto$4 = Object.prototype;
      var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty$3.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function createArrayIterator(coll) {
        var i = -1;
        var len = coll.length;
        return function next() {
          return ++i < len ? { value: coll[i], key: i } : null;
        };
      }
      function createES2015Iterator(iterator2) {
        var i = -1;
        return function next() {
          var item = iterator2.next();
          if (item.done)
            return null;
          i++;
          return { value: item.value, key: i };
        };
      }
      function createObjectIterator(obj) {
        var okeys = keys(obj);
        var i = -1;
        var len = okeys.length;
        return function next() {
          var key = okeys[++i];
          if (key === "__proto__") {
            return next();
          }
          return i < len ? { value: obj[key], key } : null;
        };
      }
      function iterator(coll) {
        if (isArrayLike(coll)) {
          return createArrayIterator(coll);
        }
        var iterator2 = getIterator(coll);
        return iterator2 ? createES2015Iterator(iterator2) : createObjectIterator(coll);
      }
      function onlyOnce(fn) {
        return function() {
          if (fn === null)
            throw new Error("Callback was already called.");
          var callFn = fn;
          fn = null;
          callFn.apply(this, arguments);
        };
      }
      function _eachOfLimit(limit) {
        return function(obj, iteratee, callback) {
          callback = once(callback || noop);
          if (limit <= 0 || !obj) {
            return callback(null);
          }
          var nextElem = iterator(obj);
          var done = false;
          var running = 0;
          var looping = false;
          function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
              done = true;
              callback(err);
            } else if (value === breakLoop || done && running <= 0) {
              done = true;
              return callback(null);
            } else if (!looping) {
              replenish();
            }
          }
          function replenish() {
            looping = true;
            while (running < limit && !done) {
              var elem = nextElem();
              if (elem === null) {
                done = true;
                if (running <= 0) {
                  callback(null);
                }
                return;
              }
              running += 1;
              iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
            looping = false;
          }
          replenish();
        };
      }
      function eachOfLimit(coll, limit, iteratee, callback) {
        _eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
      }
      function doLimit(fn, limit) {
        return function(iterable, iteratee, callback) {
          return fn(iterable, limit, iteratee, callback);
        };
      }
      function eachOfArrayLike(coll, iteratee, callback) {
        callback = once(callback || noop);
        var index2 = 0, completed = 0, length = coll.length;
        if (length === 0) {
          callback(null);
        }
        function iteratorCallback(err, value) {
          if (err) {
            callback(err);
          } else if (++completed === length || value === breakLoop) {
            callback(null);
          }
        }
        for (; index2 < length; index2++) {
          iteratee(coll[index2], index2, onlyOnce(iteratorCallback));
        }
      }
      var eachOfGeneric = doLimit(eachOfLimit, Infinity);
      var eachOf = function(coll, iteratee, callback) {
        var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
        eachOfImplementation(coll, wrapAsync(iteratee), callback);
      };
      function doParallel(fn) {
        return function(obj, iteratee, callback) {
          return fn(eachOf, obj, wrapAsync(iteratee), callback);
        };
      }
      function _asyncMap(eachfn, arr, iteratee, callback) {
        callback = callback || noop;
        arr = arr || [];
        var results = [];
        var counter = 0;
        var _iteratee = wrapAsync(iteratee);
        eachfn(arr, function(value, _, callback2) {
          var index2 = counter++;
          _iteratee(value, function(err, v) {
            results[index2] = v;
            callback2(err);
          });
        }, function(err) {
          callback(err, results);
        });
      }
      var map = doParallel(_asyncMap);
      var applyEach = applyEach$1(map);
      function doParallelLimit(fn) {
        return function(obj, limit, iteratee, callback) {
          return fn(_eachOfLimit(limit), obj, wrapAsync(iteratee), callback);
        };
      }
      var mapLimit = doParallelLimit(_asyncMap);
      var mapSeries = doLimit(mapLimit, 1);
      var applyEachSeries = applyEach$1(mapSeries);
      function arrayEach(array, iteratee) {
        var index2 = -1, length = array == null ? 0 : array.length;
        while (++index2 < length) {
          if (iteratee(array[index2], index2, array) === false) {
            break;
          }
        }
        return array;
      }
      function createBaseFor(fromRight) {
        return function(object, iteratee, keysFunc) {
          var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index2];
            if (iteratee(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      var baseFor = createBaseFor();
      function baseForOwn(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length, index2 = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index2-- : ++index2 < length) {
          if (predicate(array[index2], index2, array)) {
            return index2;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function strictIndexOf(array, value, fromIndex) {
        var index2 = fromIndex - 1, length = array.length;
        while (++index2 < length) {
          if (array[index2] === value) {
            return index2;
          }
        }
        return -1;
      }
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var auto = function(tasks, concurrency, callback) {
        if (typeof concurrency === "function") {
          callback = concurrency;
          concurrency = null;
        }
        callback = once(callback || noop);
        var keys$$1 = keys(tasks);
        var numTasks = keys$$1.length;
        if (!numTasks) {
          return callback(null);
        }
        if (!concurrency) {
          concurrency = numTasks;
        }
        var results = {};
        var runningTasks = 0;
        var hasError = false;
        var listeners = /* @__PURE__ */ Object.create(null);
        var readyTasks = [];
        var readyToCheck = [];
        var uncheckedDependencies = {};
        baseForOwn(tasks, function(task, key) {
          if (!isArray(task)) {
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
          }
          var dependencies = task.slice(0, task.length - 1);
          var remainingDependencies = dependencies.length;
          if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
          }
          uncheckedDependencies[key] = remainingDependencies;
          arrayEach(dependencies, function(dependencyName) {
            if (!tasks[dependencyName]) {
              throw new Error("async.auto task `" + key + "` has a non-existent dependency `" + dependencyName + "` in " + dependencies.join(", "));
            }
            addListener(dependencyName, function() {
              remainingDependencies--;
              if (remainingDependencies === 0) {
                enqueueTask(key, task);
              }
            });
          });
        });
        checkForDeadlocks();
        processQueue();
        function enqueueTask(key, task) {
          readyTasks.push(function() {
            runTask(key, task);
          });
        }
        function processQueue() {
          if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
          }
          while (readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
          }
        }
        function addListener(taskName, fn) {
          var taskListeners = listeners[taskName];
          if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
          }
          taskListeners.push(fn);
        }
        function taskComplete(taskName) {
          var taskListeners = listeners[taskName] || [];
          arrayEach(taskListeners, function(fn) {
            fn();
          });
          processQueue();
        }
        function runTask(key, task) {
          if (hasError)
            return;
          var taskCallback = onlyOnce(function(err, result) {
            runningTasks--;
            if (arguments.length > 2) {
              result = slice(arguments, 1);
            }
            if (err) {
              var safeResults = {};
              baseForOwn(results, function(val, rkey) {
                safeResults[rkey] = val;
              });
              safeResults[key] = result;
              hasError = true;
              listeners = /* @__PURE__ */ Object.create(null);
              callback(err, safeResults);
            } else {
              results[key] = result;
              taskComplete(key);
            }
          });
          runningTasks++;
          var taskFn = wrapAsync(task[task.length - 1]);
          if (task.length > 1) {
            taskFn(results, taskCallback);
          } else {
            taskFn(taskCallback);
          }
        }
        function checkForDeadlocks() {
          var currentTask;
          var counter = 0;
          while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            arrayEach(getDependents(currentTask), function(dependent) {
              if (--uncheckedDependencies[dependent] === 0) {
                readyToCheck.push(dependent);
              }
            });
          }
          if (counter !== numTasks) {
            throw new Error(
              "async.auto cannot execute tasks due to a recursive dependency"
            );
          }
        }
        function getDependents(taskName) {
          var result = [];
          baseForOwn(tasks, function(task, key) {
            if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
              result.push(key);
            }
          });
          return result;
        }
      };
      function arrayMap(array, iteratee) {
        var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index2 < length) {
          result[index2] = iteratee(array[index2], index2, array);
        }
        return result;
      }
      var symbolTag = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      var INFINITY = 1 / 0;
      var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0;
      var symbolToString = symbolProto ? symbolProto.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function baseSlice(array, start, end) {
        var index2 = -1, length = array.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result = Array(length);
        while (++index2 < length) {
          result[index2] = array[index2 + start];
        }
        return result;
      }
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === void 0 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index2 = strSymbols.length;
        while (index2-- && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
        }
        return index2;
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index2 = -1, length = strSymbols.length;
        while (++index2 < length && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
        }
        return index2;
      }
      function asciiToArray(string) {
        return string.split("");
      }
      var rsAstralRange = "\\ud800-\\udfff";
      var rsComboMarksRange = "\\u0300-\\u036f";
      var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
      var rsComboSymbolsRange = "\\u20d0-\\u20ff";
      var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
      var rsVarRange = "\\ufe0e\\ufe0f";
      var rsZWJ = "\\u200d";
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      var rsAstralRange$1 = "\\ud800-\\udfff";
      var rsComboMarksRange$1 = "\\u0300-\\u036f";
      var reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f";
      var rsComboSymbolsRange$1 = "\\u20d0-\\u20ff";
      var rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;
      var rsVarRange$1 = "\\ufe0e\\ufe0f";
      var rsAstral = "[" + rsAstralRange$1 + "]";
      var rsCombo = "[" + rsComboRange$1 + "]";
      var rsFitz = "\\ud83c[\\udffb-\\udfff]";
      var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
      var rsNonAstral = "[^" + rsAstralRange$1 + "]";
      var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
      var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
      var rsZWJ$1 = "\\u200d";
      var reOptMod = rsModifier + "?";
      var rsOptVar = "[" + rsVarRange$1 + "]?";
      var rsOptJoin = "(?:" + rsZWJ$1 + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
      var rsSeq = rsOptVar + reOptMod + rsOptJoin;
      var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      var reTrim = /^\s+|\s+$/g;
      function trim2(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === void 0)) {
          return string.replace(reTrim, "");
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join("");
      }
      var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
      var FN_ARG_SPLIT = /,/;
      var FN_ARG = /(=.+)?(\s*)$/;
      var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      function parseParams(func) {
        func = func.toString().replace(STRIP_COMMENTS, "");
        func = func.match(FN_ARGS)[2].replace(" ", "");
        func = func ? func.split(FN_ARG_SPLIT) : [];
        func = func.map(function(arg) {
          return trim2(arg.replace(FN_ARG, ""));
        });
        return func;
      }
      function autoInject(tasks, callback) {
        var newTasks = {};
        baseForOwn(tasks, function(taskFn, key) {
          var params;
          var fnIsAsync = isAsync(taskFn);
          var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;
          if (isArray(taskFn)) {
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];
            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
          } else if (hasNoDeps) {
            newTasks[key] = taskFn;
          } else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
              throw new Error("autoInject task functions require explicit parameters.");
            }
            if (!fnIsAsync)
              params.pop();
            newTasks[key] = params.concat(newTask);
          }
          function newTask(results, taskCb) {
            var newArgs = arrayMap(params, function(name) {
              return results[name];
            });
            newArgs.push(taskCb);
            wrapAsync(taskFn).apply(null, newArgs);
          }
        });
        auto(newTasks, callback);
      }
      function DLL() {
        this.head = this.tail = null;
        this.length = 0;
      }
      function setInitial(dll, node) {
        dll.length = 1;
        dll.head = dll.tail = node;
      }
      DLL.prototype.removeLink = function(node) {
        if (node.prev)
          node.prev.next = node.next;
        else
          this.head = node.next;
        if (node.next)
          node.next.prev = node.prev;
        else
          this.tail = node.prev;
        node.prev = node.next = null;
        this.length -= 1;
        return node;
      };
      DLL.prototype.empty = function() {
        while (this.head)
          this.shift();
        return this;
      };
      DLL.prototype.insertAfter = function(node, newNode) {
        newNode.prev = node;
        newNode.next = node.next;
        if (node.next)
          node.next.prev = newNode;
        else
          this.tail = newNode;
        node.next = newNode;
        this.length += 1;
      };
      DLL.prototype.insertBefore = function(node, newNode) {
        newNode.prev = node.prev;
        newNode.next = node;
        if (node.prev)
          node.prev.next = newNode;
        else
          this.head = newNode;
        node.prev = newNode;
        this.length += 1;
      };
      DLL.prototype.unshift = function(node) {
        if (this.head)
          this.insertBefore(this.head, node);
        else
          setInitial(this, node);
      };
      DLL.prototype.push = function(node) {
        if (this.tail)
          this.insertAfter(this.tail, node);
        else
          setInitial(this, node);
      };
      DLL.prototype.shift = function() {
        return this.head && this.removeLink(this.head);
      };
      DLL.prototype.pop = function() {
        return this.tail && this.removeLink(this.tail);
      };
      DLL.prototype.toArray = function() {
        var arr = Array(this.length);
        var curr = this.head;
        for (var idx = 0; idx < this.length; idx++) {
          arr[idx] = curr.data;
          curr = curr.next;
        }
        return arr;
      };
      DLL.prototype.remove = function(testFn) {
        var curr = this.head;
        while (!!curr) {
          var next = curr.next;
          if (testFn(curr)) {
            this.removeLink(curr);
          }
          curr = next;
        }
        return this;
      };
      function queue(worker, concurrency, payload) {
        if (concurrency == null) {
          concurrency = 1;
        } else if (concurrency === 0) {
          throw new Error("Concurrency must not be zero");
        }
        var _worker = wrapAsync(worker);
        var numRunning = 0;
        var workersList = [];
        var processingScheduled = false;
        function _insert(data, insertAtFront, callback) {
          if (callback != null && typeof callback !== "function") {
            throw new Error("task callback must be a function");
          }
          q.started = true;
          if (!isArray(data)) {
            data = [data];
          }
          if (data.length === 0 && q.idle()) {
            return setImmediate$1(function() {
              q.drain();
            });
          }
          for (var i = 0, l = data.length; i < l; i++) {
            var item = {
              data: data[i],
              callback: callback || noop
            };
            if (insertAtFront) {
              q._tasks.unshift(item);
            } else {
              q._tasks.push(item);
            }
          }
          if (!processingScheduled) {
            processingScheduled = true;
            setImmediate$1(function() {
              processingScheduled = false;
              q.process();
            });
          }
        }
        function _next(tasks) {
          return function(err) {
            numRunning -= 1;
            for (var i = 0, l = tasks.length; i < l; i++) {
              var task = tasks[i];
              var index2 = baseIndexOf(workersList, task, 0);
              if (index2 === 0) {
                workersList.shift();
              } else if (index2 > 0) {
                workersList.splice(index2, 1);
              }
              task.callback.apply(task, arguments);
              if (err != null) {
                q.error(err, task.data);
              }
            }
            if (numRunning <= q.concurrency - q.buffer) {
              q.unsaturated();
            }
            if (q.idle()) {
              q.drain();
            }
            q.process();
          };
        }
        var isProcessing = false;
        var q = {
          _tasks: new DLL(),
          concurrency,
          payload,
          saturated: noop,
          unsaturated: noop,
          buffer: concurrency / 4,
          empty: noop,
          drain: noop,
          error: noop,
          started: false,
          paused: false,
          push: function(data, callback) {
            _insert(data, false, callback);
          },
          kill: function() {
            q.drain = noop;
            q._tasks.empty();
          },
          unshift: function(data, callback) {
            _insert(data, true, callback);
          },
          remove: function(testFn) {
            q._tasks.remove(testFn);
          },
          process: function() {
            if (isProcessing) {
              return;
            }
            isProcessing = true;
            while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
              var tasks = [], data = [];
              var l = q._tasks.length;
              if (q.payload)
                l = Math.min(l, q.payload);
              for (var i = 0; i < l; i++) {
                var node = q._tasks.shift();
                tasks.push(node);
                workersList.push(node);
                data.push(node.data);
              }
              numRunning += 1;
              if (q._tasks.length === 0) {
                q.empty();
              }
              if (numRunning === q.concurrency) {
                q.saturated();
              }
              var cb = onlyOnce(_next(tasks));
              _worker(data, cb);
            }
            isProcessing = false;
          },
          length: function() {
            return q._tasks.length;
          },
          running: function() {
            return numRunning;
          },
          workersList: function() {
            return workersList;
          },
          idle: function() {
            return q._tasks.length + numRunning === 0;
          },
          pause: function() {
            q.paused = true;
          },
          resume: function() {
            if (q.paused === false) {
              return;
            }
            q.paused = false;
            setImmediate$1(q.process);
          }
        };
        return q;
      }
      function cargo(worker, payload) {
        return queue(worker, 1, payload);
      }
      var eachOfSeries = doLimit(eachOfLimit, 1);
      function reduce(coll, memo, iteratee, callback) {
        callback = once(callback || noop);
        var _iteratee = wrapAsync(iteratee);
        eachOfSeries(coll, function(x, i, callback2) {
          _iteratee(memo, x, function(err, v) {
            memo = v;
            callback2(err);
          });
        }, function(err) {
          callback(err, memo);
        });
      }
      function seq() {
        var _functions = arrayMap(arguments, wrapAsync);
        return function() {
          var args = slice(arguments);
          var that = this;
          var cb = args[args.length - 1];
          if (typeof cb == "function") {
            args.pop();
          } else {
            cb = noop;
          }
          reduce(
            _functions,
            args,
            function(newargs, fn, cb2) {
              fn.apply(that, newargs.concat(function(err) {
                var nextargs = slice(arguments, 1);
                cb2(err, nextargs);
              }));
            },
            function(err, results) {
              cb.apply(that, [err].concat(results));
            }
          );
        };
      }
      var compose = function() {
        return seq.apply(null, slice(arguments).reverse());
      };
      var _concat = Array.prototype.concat;
      var concatLimit = function(coll, limit, iteratee, callback) {
        callback = callback || noop;
        var _iteratee = wrapAsync(iteratee);
        mapLimit(coll, limit, function(val, callback2) {
          _iteratee(val, function(err) {
            if (err)
              return callback2(err);
            return callback2(null, slice(arguments, 1));
          });
        }, function(err, mapResults) {
          var result = [];
          for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
              result = _concat.apply(result, mapResults[i]);
            }
          }
          return callback(err, result);
        });
      };
      var concat = doLimit(concatLimit, Infinity);
      var concatSeries = doLimit(concatLimit, 1);
      var constant = function() {
        var values = slice(arguments);
        var args = [null].concat(values);
        return function() {
          var callback = arguments[arguments.length - 1];
          return callback.apply(this, args);
        };
      };
      function identity(value) {
        return value;
      }
      function _createTester(check, getResult) {
        return function(eachfn, arr, iteratee, cb) {
          cb = cb || noop;
          var testPassed = false;
          var testResult;
          eachfn(arr, function(value, _, callback) {
            iteratee(value, function(err, result) {
              if (err) {
                callback(err);
              } else if (check(result) && !testResult) {
                testPassed = true;
                testResult = getResult(true, value);
                callback(null, breakLoop);
              } else {
                callback();
              }
            });
          }, function(err) {
            if (err) {
              cb(err);
            } else {
              cb(null, testPassed ? testResult : getResult(false));
            }
          });
        };
      }
      function _findGetResult(v, x) {
        return x;
      }
      var detect = doParallel(_createTester(identity, _findGetResult));
      var detectLimit = doParallelLimit(_createTester(identity, _findGetResult));
      var detectSeries = doLimit(detectLimit, 1);
      function consoleFunc(name) {
        return function(fn) {
          var args = slice(arguments, 1);
          args.push(function(err) {
            var args2 = slice(arguments, 1);
            if (typeof console === "object") {
              if (err) {
                if (console.error) {
                  console.error(err);
                }
              } else if (console[name]) {
                arrayEach(args2, function(x) {
                  console[name](x);
                });
              }
            }
          });
          wrapAsync(fn).apply(null, args);
        };
      }
      var dir = consoleFunc("dir");
      function doDuring(fn, test, callback) {
        callback = onlyOnce(callback || noop);
        var _fn = wrapAsync(fn);
        var _test = wrapAsync(test);
        function next(err) {
          if (err)
            return callback(err);
          var args = slice(arguments, 1);
          args.push(check);
          _test.apply(this, args);
        }
        function check(err, truth) {
          if (err)
            return callback(err);
          if (!truth)
            return callback(null);
          _fn(next);
        }
        check(null, true);
      }
      function doWhilst(iteratee, test, callback) {
        callback = onlyOnce(callback || noop);
        var _iteratee = wrapAsync(iteratee);
        var next = function(err) {
          if (err)
            return callback(err);
          var args = slice(arguments, 1);
          if (test.apply(this, args))
            return _iteratee(next);
          callback.apply(null, [null].concat(args));
        };
        _iteratee(next);
      }
      function doUntil(iteratee, test, callback) {
        doWhilst(iteratee, function() {
          return !test.apply(this, arguments);
        }, callback);
      }
      function during(test, fn, callback) {
        callback = onlyOnce(callback || noop);
        var _fn = wrapAsync(fn);
        var _test = wrapAsync(test);
        function next(err) {
          if (err)
            return callback(err);
          _test(check);
        }
        function check(err, truth) {
          if (err)
            return callback(err);
          if (!truth)
            return callback(null);
          _fn(next);
        }
        _test(check);
      }
      function _withoutIndex(iteratee) {
        return function(value, index2, callback) {
          return iteratee(value, callback);
        };
      }
      function eachLimit(coll, iteratee, callback) {
        eachOf(coll, _withoutIndex(wrapAsync(iteratee)), callback);
      }
      function eachLimit$1(coll, limit, iteratee, callback) {
        _eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
      }
      var eachSeries2 = doLimit(eachLimit$1, 1);
      function ensureAsync(fn) {
        if (isAsync(fn))
          return fn;
        return initialParams(function(args, callback) {
          var sync = true;
          args.push(function() {
            var innerArgs = arguments;
            if (sync) {
              setImmediate$1(function() {
                callback.apply(null, innerArgs);
              });
            } else {
              callback.apply(null, innerArgs);
            }
          });
          fn.apply(this, args);
          sync = false;
        });
      }
      function notId(v) {
        return !v;
      }
      var every = doParallel(_createTester(notId, notId));
      var everyLimit = doParallelLimit(_createTester(notId, notId));
      var everySeries = doLimit(everyLimit, 1);
      function baseProperty(key) {
        return function(object) {
          return object == null ? void 0 : object[key];
        };
      }
      function filterArray(eachfn, arr, iteratee, callback) {
        var truthValues = new Array(arr.length);
        eachfn(arr, function(x, index2, callback2) {
          iteratee(x, function(err, v) {
            truthValues[index2] = !!v;
            callback2(err);
          });
        }, function(err) {
          if (err)
            return callback(err);
          var results = [];
          for (var i = 0; i < arr.length; i++) {
            if (truthValues[i])
              results.push(arr[i]);
          }
          callback(null, results);
        });
      }
      function filterGeneric(eachfn, coll, iteratee, callback) {
        var results = [];
        eachfn(coll, function(x, index2, callback2) {
          iteratee(x, function(err, v) {
            if (err) {
              callback2(err);
            } else {
              if (v) {
                results.push({ index: index2, value: x });
              }
              callback2();
            }
          });
        }, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null, arrayMap(results.sort(function(a, b) {
              return a.index - b.index;
            }), baseProperty("value")));
          }
        });
      }
      function _filter(eachfn, coll, iteratee, callback) {
        var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
        filter2(eachfn, coll, wrapAsync(iteratee), callback || noop);
      }
      var filter = doParallel(_filter);
      var filterLimit = doParallelLimit(_filter);
      var filterSeries = doLimit(filterLimit, 1);
      function forever(fn, errback) {
        var done = onlyOnce(errback || noop);
        var task = wrapAsync(ensureAsync(fn));
        function next(err) {
          if (err)
            return done(err);
          task(next);
        }
        next();
      }
      var groupByLimit = function(coll, limit, iteratee, callback) {
        callback = callback || noop;
        var _iteratee = wrapAsync(iteratee);
        mapLimit(coll, limit, function(val, callback2) {
          _iteratee(val, function(err, key) {
            if (err)
              return callback2(err);
            return callback2(null, { key, val });
          });
        }, function(err, mapResults) {
          var result = {};
          var hasOwnProperty2 = Object.prototype.hasOwnProperty;
          for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
              var key = mapResults[i].key;
              var val = mapResults[i].val;
              if (hasOwnProperty2.call(result, key)) {
                result[key].push(val);
              } else {
                result[key] = [val];
              }
            }
          }
          return callback(err, result);
        });
      };
      var groupBy = doLimit(groupByLimit, Infinity);
      var groupBySeries = doLimit(groupByLimit, 1);
      var log = consoleFunc("log");
      function mapValuesLimit(obj, limit, iteratee, callback) {
        callback = once(callback || noop);
        var newObj = {};
        var _iteratee = wrapAsync(iteratee);
        eachOfLimit(obj, limit, function(val, key, next) {
          _iteratee(val, key, function(err, result) {
            if (err)
              return next(err);
            newObj[key] = result;
            next();
          });
        }, function(err) {
          callback(err, newObj);
        });
      }
      var mapValues = doLimit(mapValuesLimit, Infinity);
      var mapValuesSeries = doLimit(mapValuesLimit, 1);
      function has(obj, key) {
        return key in obj;
      }
      function memoize(fn, hasher) {
        var memo = /* @__PURE__ */ Object.create(null);
        var queues = /* @__PURE__ */ Object.create(null);
        hasher = hasher || identity;
        var _fn = wrapAsync(fn);
        var memoized = initialParams(function memoized2(args, callback) {
          var key = hasher.apply(null, args);
          if (has(memo, key)) {
            setImmediate$1(function() {
              callback.apply(null, memo[key]);
            });
          } else if (has(queues, key)) {
            queues[key].push(callback);
          } else {
            queues[key] = [callback];
            _fn.apply(null, args.concat(function() {
              var args2 = slice(arguments);
              memo[key] = args2;
              var q = queues[key];
              delete queues[key];
              for (var i = 0, l = q.length; i < l; i++) {
                q[i].apply(null, args2);
              }
            }));
          }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
      }
      var _defer$1;
      if (hasNextTick) {
        _defer$1 = process.nextTick;
      } else if (hasSetImmediate) {
        _defer$1 = setImmediate;
      } else {
        _defer$1 = fallback;
      }
      var nextTick = wrap(_defer$1);
      function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = isArrayLike(tasks) ? [] : {};
        eachfn(tasks, function(task, key, callback2) {
          wrapAsync(task)(function(err, result) {
            if (arguments.length > 2) {
              result = slice(arguments, 1);
            }
            results[key] = result;
            callback2(err);
          });
        }, function(err) {
          callback(err, results);
        });
      }
      function parallelLimit(tasks, callback) {
        _parallel(eachOf, tasks, callback);
      }
      function parallelLimit$1(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
      }
      var queue$1 = function(worker, concurrency) {
        var _worker = wrapAsync(worker);
        return queue(function(items, cb) {
          _worker(items[0], cb);
        }, concurrency, 1);
      };
      var priorityQueue = function(worker, concurrency) {
        var q = queue$1(worker, concurrency);
        q.push = function(data, priority, callback) {
          if (callback == null)
            callback = noop;
          if (typeof callback !== "function") {
            throw new Error("task callback must be a function");
          }
          q.started = true;
          if (!isArray(data)) {
            data = [data];
          }
          if (data.length === 0) {
            return setImmediate$1(function() {
              q.drain();
            });
          }
          priority = priority || 0;
          var nextNode = q._tasks.head;
          while (nextNode && priority >= nextNode.priority) {
            nextNode = nextNode.next;
          }
          for (var i = 0, l = data.length; i < l; i++) {
            var item = {
              data: data[i],
              priority,
              callback
            };
            if (nextNode) {
              q._tasks.insertBefore(nextNode, item);
            } else {
              q._tasks.push(item);
            }
          }
          setImmediate$1(q.process);
        };
        delete q.unshift;
        return q;
      };
      function race(tasks, callback) {
        callback = once(callback || noop);
        if (!isArray(tasks))
          return callback(new TypeError("First argument to race must be an array of functions"));
        if (!tasks.length)
          return callback();
        for (var i = 0, l = tasks.length; i < l; i++) {
          wrapAsync(tasks[i])(callback);
        }
      }
      function reduceRight(array, memo, iteratee, callback) {
        var reversed = slice(array).reverse();
        reduce(reversed, memo, iteratee, callback);
      }
      function reflect(fn) {
        var _fn = wrapAsync(fn);
        return initialParams(function reflectOn(args, reflectCallback) {
          args.push(function callback(error, cbArg) {
            if (error) {
              reflectCallback(null, { error });
            } else {
              var value;
              if (arguments.length <= 2) {
                value = cbArg;
              } else {
                value = slice(arguments, 1);
              }
              reflectCallback(null, { value });
            }
          });
          return _fn.apply(this, args);
        });
      }
      function reflectAll(tasks) {
        var results;
        if (isArray(tasks)) {
          results = arrayMap(tasks, reflect);
        } else {
          results = {};
          baseForOwn(tasks, function(task, key) {
            results[key] = reflect.call(this, task);
          });
        }
        return results;
      }
      function reject$1(eachfn, arr, iteratee, callback) {
        _filter(eachfn, arr, function(value, cb) {
          iteratee(value, function(err, v) {
            cb(err, !v);
          });
        }, callback);
      }
      var reject = doParallel(reject$1);
      var rejectLimit = doParallelLimit(reject$1);
      var rejectSeries = doLimit(rejectLimit, 1);
      function constant$1(value) {
        return function() {
          return value;
        };
      }
      function retry(opts, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;
        var options = {
          times: DEFAULT_TIMES,
          intervalFunc: constant$1(DEFAULT_INTERVAL)
        };
        function parseTimes(acc, t) {
          if (typeof t === "object") {
            acc.times = +t.times || DEFAULT_TIMES;
            acc.intervalFunc = typeof t.interval === "function" ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
            acc.errorFilter = t.errorFilter;
          } else if (typeof t === "number" || typeof t === "string") {
            acc.times = +t || DEFAULT_TIMES;
          } else {
            throw new Error("Invalid arguments for async.retry");
          }
        }
        if (arguments.length < 3 && typeof opts === "function") {
          callback = task || noop;
          task = opts;
        } else {
          parseTimes(options, opts);
          callback = callback || noop;
        }
        if (typeof task !== "function") {
          throw new Error("Invalid arguments for async.retry");
        }
        var _task = wrapAsync(task);
        var attempt = 1;
        function retryAttempt() {
          _task(function(err) {
            if (err && attempt++ < options.times && (typeof options.errorFilter != "function" || options.errorFilter(err))) {
              setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
              callback.apply(null, arguments);
            }
          });
        }
        retryAttempt();
      }
      var retryable = function(opts, task) {
        if (!task) {
          task = opts;
          opts = null;
        }
        var _task = wrapAsync(task);
        return initialParams(function(args, callback) {
          function taskFn(cb) {
            _task.apply(null, args.concat(cb));
          }
          if (opts)
            retry(opts, taskFn, callback);
          else
            retry(taskFn, callback);
        });
      };
      function series(tasks, callback) {
        _parallel(eachOfSeries, tasks, callback);
      }
      var some = doParallel(_createTester(Boolean, identity));
      var someLimit = doParallelLimit(_createTester(Boolean, identity));
      var someSeries = doLimit(someLimit, 1);
      function sortBy(coll, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        map(coll, function(x, callback2) {
          _iteratee(x, function(err, criteria) {
            if (err)
              return callback2(err);
            callback2(null, { value: x, criteria });
          });
        }, function(err, results) {
          if (err)
            return callback(err);
          callback(null, arrayMap(results.sort(comparator), baseProperty("value")));
        });
        function comparator(left, right) {
          var a = left.criteria, b = right.criteria;
          return a < b ? -1 : a > b ? 1 : 0;
        }
      }
      function timeout(asyncFn, milliseconds, info) {
        var fn = wrapAsync(asyncFn);
        return initialParams(function(args, callback) {
          var timedOut = false;
          var timer;
          function timeoutCallback() {
            var name = asyncFn.name || "anonymous";
            var error = new Error('Callback function "' + name + '" timed out.');
            error.code = "ETIMEDOUT";
            if (info) {
              error.info = info;
            }
            timedOut = true;
            callback(error);
          }
          args.push(function() {
            if (!timedOut) {
              callback.apply(null, arguments);
              clearTimeout(timer);
            }
          });
          timer = setTimeout(timeoutCallback, milliseconds);
          fn.apply(null, args);
        });
      }
      var nativeCeil = Math.ceil;
      var nativeMax = Math.max;
      function baseRange(start, end, step, fromRight) {
        var index2 = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
        while (length--) {
          result[fromRight ? length : ++index2] = start;
          start += step;
        }
        return result;
      }
      function timeLimit(count, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        mapLimit(baseRange(0, count, 1), limit, _iteratee, callback);
      }
      var times = doLimit(timeLimit, Infinity);
      var timesSeries = doLimit(timeLimit, 1);
      function transform(coll, accumulator, iteratee, callback) {
        if (arguments.length <= 3) {
          callback = iteratee;
          iteratee = accumulator;
          accumulator = isArray(coll) ? [] : {};
        }
        callback = once(callback || noop);
        var _iteratee = wrapAsync(iteratee);
        eachOf(coll, function(v, k, cb) {
          _iteratee(accumulator, v, k, cb);
        }, function(err) {
          callback(err, accumulator);
        });
      }
      function tryEach(tasks, callback) {
        var error = null;
        var result;
        callback = callback || noop;
        eachSeries2(tasks, function(task, callback2) {
          wrapAsync(task)(function(err, res) {
            if (arguments.length > 2) {
              result = slice(arguments, 1);
            } else {
              result = res;
            }
            error = err;
            callback2(!err);
          });
        }, function() {
          callback(error, result);
        });
      }
      function unmemoize(fn) {
        return function() {
          return (fn.unmemoized || fn).apply(null, arguments);
        };
      }
      function whilst(test, iteratee, callback) {
        callback = onlyOnce(callback || noop);
        var _iteratee = wrapAsync(iteratee);
        if (!test())
          return callback(null);
        var next = function(err) {
          if (err)
            return callback(err);
          if (test())
            return _iteratee(next);
          var args = slice(arguments, 1);
          callback.apply(null, [null].concat(args));
        };
        _iteratee(next);
      }
      function until(test, iteratee, callback) {
        whilst(function() {
          return !test.apply(this, arguments);
        }, iteratee, callback);
      }
      var waterfall = function(tasks, callback) {
        callback = once(callback || noop);
        if (!isArray(tasks))
          return callback(new Error("First argument to waterfall must be an array of functions"));
        if (!tasks.length)
          return callback();
        var taskIndex = 0;
        function nextTask(args) {
          var task = wrapAsync(tasks[taskIndex++]);
          args.push(onlyOnce(next));
          task.apply(null, args);
        }
        function next(err) {
          if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments);
          }
          nextTask(slice(arguments, 1));
        }
        nextTask([]);
      };
      var index = {
        apply,
        applyEach,
        applyEachSeries,
        asyncify,
        auto,
        autoInject,
        cargo,
        compose,
        concat,
        concatLimit,
        concatSeries,
        constant,
        detect,
        detectLimit,
        detectSeries,
        dir,
        doDuring,
        doUntil,
        doWhilst,
        during,
        each: eachLimit,
        eachLimit: eachLimit$1,
        eachOf,
        eachOfLimit,
        eachOfSeries,
        eachSeries: eachSeries2,
        ensureAsync,
        every,
        everyLimit,
        everySeries,
        filter,
        filterLimit,
        filterSeries,
        forever,
        groupBy,
        groupByLimit,
        groupBySeries,
        log,
        map,
        mapLimit,
        mapSeries,
        mapValues,
        mapValuesLimit,
        mapValuesSeries,
        memoize,
        nextTick,
        parallel: parallelLimit,
        parallelLimit: parallelLimit$1,
        priorityQueue,
        queue: queue$1,
        race,
        reduce,
        reduceRight,
        reflect,
        reflectAll,
        reject,
        rejectLimit,
        rejectSeries,
        retry,
        retryable,
        seq,
        series,
        setImmediate: setImmediate$1,
        some,
        someLimit,
        someSeries,
        sortBy,
        timeout,
        times,
        timesLimit: timeLimit,
        timesSeries,
        transform,
        tryEach,
        unmemoize,
        until,
        waterfall,
        whilst,
        all: every,
        allLimit: everyLimit,
        allSeries: everySeries,
        any: some,
        anyLimit: someLimit,
        anySeries: someSeries,
        find: detect,
        findLimit: detectLimit,
        findSeries: detectSeries,
        forEach: eachLimit,
        forEachSeries: eachSeries2,
        forEachLimit: eachLimit$1,
        forEachOf: eachOf,
        forEachOfSeries: eachOfSeries,
        forEachOfLimit: eachOfLimit,
        inject: reduce,
        foldl: reduce,
        foldr: reduceRight,
        select: filter,
        selectLimit: filterLimit,
        selectSeries: filterSeries,
        wrapSync: asyncify
      };
      exports2["default"] = index;
      exports2.apply = apply;
      exports2.applyEach = applyEach;
      exports2.applyEachSeries = applyEachSeries;
      exports2.asyncify = asyncify;
      exports2.auto = auto;
      exports2.autoInject = autoInject;
      exports2.cargo = cargo;
      exports2.compose = compose;
      exports2.concat = concat;
      exports2.concatLimit = concatLimit;
      exports2.concatSeries = concatSeries;
      exports2.constant = constant;
      exports2.detect = detect;
      exports2.detectLimit = detectLimit;
      exports2.detectSeries = detectSeries;
      exports2.dir = dir;
      exports2.doDuring = doDuring;
      exports2.doUntil = doUntil;
      exports2.doWhilst = doWhilst;
      exports2.during = during;
      exports2.each = eachLimit;
      exports2.eachLimit = eachLimit$1;
      exports2.eachOf = eachOf;
      exports2.eachOfLimit = eachOfLimit;
      exports2.eachOfSeries = eachOfSeries;
      exports2.eachSeries = eachSeries2;
      exports2.ensureAsync = ensureAsync;
      exports2.every = every;
      exports2.everyLimit = everyLimit;
      exports2.everySeries = everySeries;
      exports2.filter = filter;
      exports2.filterLimit = filterLimit;
      exports2.filterSeries = filterSeries;
      exports2.forever = forever;
      exports2.groupBy = groupBy;
      exports2.groupByLimit = groupByLimit;
      exports2.groupBySeries = groupBySeries;
      exports2.log = log;
      exports2.map = map;
      exports2.mapLimit = mapLimit;
      exports2.mapSeries = mapSeries;
      exports2.mapValues = mapValues;
      exports2.mapValuesLimit = mapValuesLimit;
      exports2.mapValuesSeries = mapValuesSeries;
      exports2.memoize = memoize;
      exports2.nextTick = nextTick;
      exports2.parallel = parallelLimit;
      exports2.parallelLimit = parallelLimit$1;
      exports2.priorityQueue = priorityQueue;
      exports2.queue = queue$1;
      exports2.race = race;
      exports2.reduce = reduce;
      exports2.reduceRight = reduceRight;
      exports2.reflect = reflect;
      exports2.reflectAll = reflectAll;
      exports2.reject = reject;
      exports2.rejectLimit = rejectLimit;
      exports2.rejectSeries = rejectSeries;
      exports2.retry = retry;
      exports2.retryable = retryable;
      exports2.seq = seq;
      exports2.series = series;
      exports2.setImmediate = setImmediate$1;
      exports2.some = some;
      exports2.someLimit = someLimit;
      exports2.someSeries = someSeries;
      exports2.sortBy = sortBy;
      exports2.timeout = timeout;
      exports2.times = times;
      exports2.timesLimit = timeLimit;
      exports2.timesSeries = timesSeries;
      exports2.transform = transform;
      exports2.tryEach = tryEach;
      exports2.unmemoize = unmemoize;
      exports2.until = until;
      exports2.waterfall = waterfall;
      exports2.whilst = whilst;
      exports2.all = every;
      exports2.allLimit = everyLimit;
      exports2.allSeries = everySeries;
      exports2.any = some;
      exports2.anyLimit = someLimit;
      exports2.anySeries = someSeries;
      exports2.find = detect;
      exports2.findLimit = detectLimit;
      exports2.findSeries = detectSeries;
      exports2.forEach = eachLimit;
      exports2.forEachSeries = eachSeries2;
      exports2.forEachLimit = eachLimit$1;
      exports2.forEachOf = eachOf;
      exports2.forEachOfSeries = eachOfSeries;
      exports2.forEachOfLimit = eachOfLimit;
      exports2.inject = reduce;
      exports2.foldl = reduce;
      exports2.foldr = reduceRight;
      exports2.select = filter;
      exports2.selectLimit = filterLimit;
      exports2.selectSeries = filterSeries;
      exports2.wrapSync = asyncify;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  "node_modules/delayed-stream/lib/delayed_stream.js"(exports, module2) {
    var Stream = require("stream").Stream;
    var util = require("util");
    module2.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util.inherits(DelayedStream, Stream);
    DelayedStream.create = function(source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function() {
      });
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.source.readable;
      }
    });
    DelayedStream.prototype.setEncoding = function() {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function() {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function() {
      this.source.pause();
    };
    DelayedStream.prototype.release = function() {
      this._released = true;
      this._bufferedEvents.forEach(function(args) {
        this.emit.apply(this, args);
      }.bind(this));
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function() {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function(args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  }
});

// node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  "node_modules/combined-stream/lib/combined_stream.js"(exports, module2) {
    var util = require("util");
    var Stream = require("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module2.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util.inherits(CombinedStream, Stream);
    CombinedStream.create = function(options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function(stream2) {
      return typeof stream2 !== "function" && typeof stream2 !== "string" && typeof stream2 !== "boolean" && typeof stream2 !== "number" && !Buffer.isBuffer(stream2);
    };
    CombinedStream.prototype.append = function(stream2) {
      var isStreamLike = CombinedStream.isStreamLike(stream2);
      if (isStreamLike) {
        if (!(stream2 instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream2, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams
          });
          stream2.on("data", this._checkDataSize.bind(this));
          stream2 = newStream;
        }
        this._handleErrors(stream2);
        if (this.pauseStreams) {
          stream2.pause();
        }
      }
      this._streams.push(stream2);
      return this;
    };
    CombinedStream.prototype.pipe = function(dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function() {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function() {
      var stream2 = this._streams.shift();
      if (typeof stream2 == "undefined") {
        this.end();
        return;
      }
      if (typeof stream2 !== "function") {
        this._pipeNext(stream2);
        return;
      }
      var getStream = stream2;
      getStream(function(stream3) {
        var isStreamLike = CombinedStream.isStreamLike(stream3);
        if (isStreamLike) {
          stream3.on("data", this._checkDataSize.bind(this));
          this._handleErrors(stream3);
        }
        this._pipeNext(stream3);
      }.bind(this));
    };
    CombinedStream.prototype._pipeNext = function(stream2) {
      this._currentStream = stream2;
      var isStreamLike = CombinedStream.isStreamLike(stream2);
      if (isStreamLike) {
        stream2.on("end", this._getNext.bind(this));
        stream2.pipe(this, { end: false });
        return;
      }
      var value = stream2;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function(stream2) {
      var self2 = this;
      stream2.on("error", function(err) {
        self2._emitError(err);
      });
    };
    CombinedStream.prototype.write = function(data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function() {
      if (!this.pauseStreams) {
        return;
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function")
        this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function() {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function")
        this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function() {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function() {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function() {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function() {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function() {
      this.dataSize = 0;
      var self2 = this;
      this._streams.forEach(function(stream2) {
        if (!stream2.dataSize) {
          return;
        }
        self2.dataSize += stream2.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function(err) {
      this._reset();
      this.emit("error", err);
    };
  }
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports, module2) {
    module2.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports, module2) {
    module2.exports = require_db();
  }
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports) {
    "use strict";
    var db = require_mime_db();
    var extname = require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports.charset = charset;
    exports.charsets = { lookup: charset };
    exports.contentType = contentType;
    exports.extension = extension;
    exports.extensions = /* @__PURE__ */ Object.create(null);
    exports.lookup = lookup;
    exports.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports.extensions, exports.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports.charset(mime);
        if (charset2)
          mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path) {
      if (!path || typeof path !== "string") {
        return false;
      }
      var extension2 = extname("x." + path).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  "node_modules/asynckit/lib/defer.js"(exports, module2) {
    module2.exports = defer;
    function defer(fn) {
      var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  }
});

// node_modules/asynckit/lib/async.js
var require_async2 = __commonJS({
  "node_modules/asynckit/lib/async.js"(exports, module2) {
    var defer = require_defer();
    module2.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function() {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  }
});

// node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  "node_modules/asynckit/lib/abort.js"(exports, module2) {
    module2.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  }
});

// node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  "node_modules/asynckit/lib/iterate.js"(exports, module2) {
    var async = require_async2();
    var abort = require_abort();
    module2.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
      state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        if (!(key in state.jobs)) {
          return;
        }
        delete state.jobs[key];
        if (error) {
          abort(state);
        } else {
          state.results[key] = output;
        }
        callback(error, state.results);
      });
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  }
});

// node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  "node_modules/asynckit/lib/state.js"(exports, module2) {
    module2.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
      };
      if (sortMethod) {
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
          return sortMethod(list[a], list[b]);
        });
      }
      return initState;
    }
  }
});

// node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  "node_modules/asynckit/lib/terminator.js"(exports, module2) {
    var abort = require_abort();
    var async = require_async2();
    module2.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  }
});

// node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  "node_modules/asynckit/parallel.js"(exports, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator, state, function(error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  }
});

// node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  "node_modules/asynckit/serialOrdered.js"(exports, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = serialOrdered;
    module2.exports.ascending = ascending;
    module2.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  }
});

// node_modules/asynckit/serial.js
var require_serial = __commonJS({
  "node_modules/asynckit/serial.js"(exports, module2) {
    var serialOrdered = require_serialOrdered();
    module2.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  }
});

// node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  "node_modules/asynckit/index.js"(exports, module2) {
    module2.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered()
    };
  }
});

// node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  "node_modules/form-data/lib/populate.js"(exports, module2) {
    module2.exports = function(dst, src) {
      Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  }
});

// node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  "node_modules/form-data/lib/form_data.js"(exports, module2) {
    var CombinedStream = require_combined_stream();
    var util = require("util");
    var path = require("path");
    var http2 = require("http");
    var https2 = require("https");
    var parseUrl = require("url").parse;
    var fs = require("fs");
    var Stream = require("stream").Stream;
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var populate = require_populate();
    module2.exports = FormData2;
    util.inherits(FormData2, CombinedStream);
    function FormData2(options) {
      if (!(this instanceof FormData2)) {
        return new FormData2(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    FormData2.LINE_BREAK = "\r\n";
    FormData2.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData2.prototype.append = function(field, value, options) {
      options = options || {};
      if (typeof options == "string") {
        options = { filename: options };
      }
      var append = CombinedStream.prototype.append.bind(this);
      if (typeof value == "number") {
        value = "" + value;
      }
      if (util.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append(header);
      append(value);
      append(footer);
      this._trackLength(header, value, options);
    };
    FormData2.prototype._trackLength = function(header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += +options.knownLength;
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength += Buffer.byteLength(header) + FormData2.LINE_BREAK.length;
      if (!value || !value.path && !(value.readable && value.hasOwnProperty("httpVersion")) && !(value instanceof Stream)) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData2.prototype._lengthRetriever = function(value, callback) {
      if (value.hasOwnProperty("fd")) {
        if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs.stat(value.path, function(err, stat2) {
            var fileSize;
            if (err) {
              callback(err);
              return;
            }
            fileSize = stat2.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
      } else if (value.hasOwnProperty("httpModule")) {
        value.on("response", function(response) {
          value.pause();
          callback(null, +response.headers["content-length"]);
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData2.prototype._multiPartHeader = function(field, value, options) {
      if (typeof options.header == "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
        "Content-Type": [].concat(contentType || [])
      };
      if (typeof options.header == "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (!headers.hasOwnProperty(prop))
          continue;
        header = headers[prop];
        if (header == null) {
          continue;
        }
        if (!Array.isArray(header)) {
          header = [header];
        }
        if (header.length) {
          contents += prop + ": " + header.join("; ") + FormData2.LINE_BREAK;
        }
      }
      return "--" + this.getBoundary() + FormData2.LINE_BREAK + contents + FormData2.LINE_BREAK;
    };
    FormData2.prototype._getContentDisposition = function(value, options) {
      var filename, contentDisposition;
      if (typeof options.filepath === "string") {
        filename = path.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value.name || value.path) {
        filename = path.basename(options.filename || value.name || value.path);
      } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        filename = path.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        contentDisposition = 'filename="' + filename + '"';
      }
      return contentDisposition;
    };
    FormData2.prototype._getContentType = function(value, options) {
      var contentType = options.contentType;
      if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (!contentType && value.readable && value.hasOwnProperty("httpVersion")) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && typeof value == "object") {
        contentType = FormData2.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData2.prototype._multiPartFooter = function() {
      return function(next) {
        var footer = FormData2.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData2.prototype._lastBoundary = function() {
      return "--" + this.getBoundary() + "--" + FormData2.LINE_BREAK;
    };
    FormData2.prototype.getHeaders = function(userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
      };
      for (header in userHeaders) {
        if (userHeaders.hasOwnProperty(header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData2.prototype.setBoundary = function(boundary) {
      this._boundary = boundary;
    };
    FormData2.prototype.getBoundary = function() {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData2.prototype.getBuffer = function() {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== "function") {
          if (Buffer.isBuffer(this._streams[i])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
          }
          if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData2.LINE_BREAK)]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData2.prototype._generateBoundary = function() {
      var boundary = "--------------------------";
      for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
      }
      this._boundary = boundary;
    };
    FormData2.prototype.getLengthSync = function() {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(new Error("Cannot calculate proper length in synchronous way."));
      }
      return knownLength;
    };
    FormData2.prototype.hasKnownLength = function() {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData2.prototype.getLength = function(cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
          cb(err);
          return;
        }
        values.forEach(function(length) {
          knownLength += length;
        });
        cb(null, knownLength);
      });
    };
    FormData2.prototype.submit = function(params, cb) {
      var request, options, defaults = { method: "post" };
      if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
          port: params.port,
          path: params.pathname,
          host: params.hostname,
          protocol: params.protocol
        }, defaults);
      } else {
        options = populate(params, defaults);
        if (!options.port) {
          options.port = options.protocol == "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol == "https:") {
        request = https2.request(options);
      } else {
        request = http2.request(options);
      }
      this.getLength(function(err, length) {
        if (err && err !== "Unknown stream") {
          this._error(err);
          return;
        }
        if (length) {
          request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
          var onResponse;
          var callback = function(error, responce) {
            request.removeListener("error", callback);
            request.removeListener("response", onResponse);
            return cb.call(this, error, responce);
          };
          onResponse = callback.bind(this, null);
          request.on("error", callback);
          request.on("response", onResponse);
        }
      }.bind(this));
      return request;
    };
    FormData2.prototype._error = function(err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData2.prototype.toString = function() {
      return "[object FormData]";
    };
  }
});

// plugins/url-plugin.js
var import_fs4 = require("fs");

// pixl/json-stream.mjs
var import_events = __toESM(require("events"), 1);
var import_os = require("os");
var JSONStream = class extends import_events.default {
  streamIn = null;
  streamOut = null;
  buffer = "";
  perf = null;
  recordRegExp = /^\s*\{/;
  preserveWhitespace = false;
  maxLineLength = 1024 * 1024;
  EOL = import_os.EOL;
  constructor(stream_in, stream_out) {
    super();
    if (!stream_out)
      stream_out = stream_in;
    this.streamIn = stream_in;
    this.streamOut = stream_out;
    this.init();
  }
  setPerf(perf) {
    this.perf = perf;
  }
  init() {
    var self2 = this;
    this.streamIn.setEncoding("utf8");
    this.streamIn.on("data", function(data) {
      if (self2.buffer) {
        data = self2.buffer + data;
        if (data.length > self2.maxLineLength)
          data = data.substring(data.length - self2.maxLineLength);
        self2.buffer = "";
      }
      var records = data.split(self2.EOL);
      if (data.substring(data.length - self2.EOL.length) != self2.EOL) {
        self2.buffer = records.pop();
      }
      var record = "";
      var json = null;
      for (var idx = 0, len = records.length; idx < len; idx++) {
        record = records[idx];
        if (record.match(self2.recordRegExp)) {
          json = null;
          if (self2.perf)
            self2.perf.begin("json_stream_parse");
          try {
            json = JSON.parse(record);
          } catch (e) {
            self2.emit("error", new Error("JSON Parse Error: " + e.message), record);
          }
          if (self2.perf) {
            self2.perf.end("json_stream_parse");
            self2.perf.count("json_stream_msgs_read", 1);
            self2.perf.count("json_stream_bytes_read", record.length + self2.EOL.length);
          }
          if (json) {
            self2.emit("json", json);
          }
        } else if (self2.preserveWhitespace || record.match(/\S/)) {
          self2.emit("text", record + self2.EOL);
        }
      }
    });
    if (this.streamOut != this.streamIn) {
      this.streamIn.on("error", function(err) {
        self2.emit("error", "Error in input stream: " + err.message);
      });
      this.streamOut.on("error", function(err) {
        self2.emit("error", "Error in output stream: " + err.message);
      });
    } else {
      this.streamIn.on("error", function(err) {
        self2.emit("error", err);
      });
    }
    this.streamIn.on("end", function() {
      self2.emit("end");
    });
  }
  write(json, callback) {
    if (this.perf)
      this.perf.begin("json_stream_compose");
    var data = JSON.stringify(json);
    if (this.perf) {
      this.perf.end("json_stream_compose");
      this.perf.count("json_stream_msgs_written", 1);
      this.perf.count("json_stream_bytes_written", data.length + this.EOL.length);
    }
    var result = this.streamOut.write(data + this.EOL, callback);
    if (!result && this.perf) {
      this.perf.count("json_stream_write_buffer", 1);
    }
    return result;
  }
};

// pixl/tools.mjs
var import_fs = require("fs");
var import_errno = __toESM(require_errno(), 1);
var import_os2 = require("os");
var import_async = __toESM(require_async(), 1);
var hostname = (0, import_os2.hostname)();
var sub = function(text, args, fatal, fallback) {
  const self2 = this;
  let result = true;
  let value = "";
  if (typeof text == "undefined")
    text = "";
  text = "" + text;
  if (!args)
    args = {};
  text = text.replace(/\[([^\]]+)\]/g, function(m_all, name) {
    value = getPath(args, name);
    if (value === void 0) {
      result = false;
      return fallback || m_all;
    } else
      return value;
  });
  if (!result && fatal)
    return null;
  else
    return text;
};
var getPath = function(target, path) {
  let parts = path.indexOf("\\") > -1 ? path.replace(/\\\./g, "__PXDOT__").replace(/\\\//g, "__PXSLASH__").split(/[\.\/]/).map(function(elem) {
    return elem.replace(/__PXDOT__/g, ".").replace(/__PXSLASH__/g, "/");
  }) : path.split(/[\.\/]/);
  let key = parts.pop();
  while (parts.length) {
    let part = parts.shift();
    if (part) {
      if (typeof target[part] != "object") {
        return void 0;
      }
      target = target[part];
    }
  }
  return target[key];
};
function mkdirp(path, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = null;
  }
  if (!opts)
    opts = { mode: 511 };
  if (typeof opts == "number")
    opts = { mode: opts };
  opts.recursive = true;
  (0, import_fs.mkdir)(path, opts, callback);
}
mkdirp.sync = function(path, opts) {
  if (!opts)
    opts = { mode: 511 };
  if (typeof opts == "number")
    opts = { mode: opts };
  opts.recursive = true;
  return (0, import_fs.mkdirSync)(path, opts);
};

// pixl/request.mjs
var import_fs3 = require("fs");
var import_http = __toESM(require("http"), 1);
var import_https = __toESM(require("https"), 1);
var import_querystring = require("querystring");
var import_zlib = require("zlib");
var import_url = __toESM(require("url"), 1);
var import_form_data = __toESM(require_form_data(), 1);

// pixl/xml.mjs
var import_fs2 = require("fs");
var xml_header = '<?xml version="1.0"?>';
var re_valid_tag_name = /^\w[\w\-\:\.]*$/;
var XML = function XML2(args, opts) {
  if (!args)
    args = "";
  if (isa_hash(args)) {
    for (var key in args)
      this[key] = args[key];
  } else
    this.text = args || "";
  if (opts) {
    for (var key in opts)
      this[key] = opts[key];
  }
  if (this.text instanceof Buffer) {
    this.text = this.text.toString();
  }
  if (!this.text.match(/^\s*</)) {
    var file = this.text;
    this.text = (0, import_fs2.readFileSync)(file, { encoding: "utf8" });
    if (!this.text)
      throw new Error("File not found: " + file);
  }
  this.tree = {};
  this.errors = [];
  this.piNodeList = [];
  this.dtdNodeList = [];
  this.documentNodeName = "";
  if (this.lowerCase) {
    this.attribsKey = this.attribsKey.toLowerCase();
    this.dataKey = this.dataKey.toLowerCase();
  }
  this.patTag.lastIndex = 0;
  if (this.text)
    this.parse();
};
XML.prototype.preserveDocumentNode = false;
XML.prototype.preserveAttributes = false;
XML.prototype.preserveWhitespace = false;
XML.prototype.lowerCase = false;
XML.prototype.forceArrays = false;
XML.prototype.patTag = /([^<]*?)<([^>]+)>/g;
XML.prototype.patSpecialTag = /^\s*([\!\?])/;
XML.prototype.patPITag = /^\s*\?/;
XML.prototype.patCommentTag = /^\s*\!--/;
XML.prototype.patDTDTag = /^\s*\!DOCTYPE/;
XML.prototype.patCDATATag = /^\s*\!\s*\[\s*CDATA/;
XML.prototype.patStandardTag = /^\s*(\/?)([\w\-\:\.]+)\s*([\s\S]*)$/;
XML.prototype.patSelfClosing = /\/\s*$/;
XML.prototype.patAttrib = new RegExp(`([\\w\\-\\:\\.]+)\\s*=\\s*([\\"\\'])([^\\2]*?)\\2`, "g");
XML.prototype.patPINode = /^\s*\?\s*([\w\-\:]+)\s*(.*)$/;
XML.prototype.patEndComment = /--$/;
XML.prototype.patNextClose = /([^>]*?)>/g;
XML.prototype.patExternalDTDNode = new RegExp('^\\s*\\!DOCTYPE\\s+([\\w\\-\\:]+)\\s+(SYSTEM|PUBLIC)\\s+\\"([^\\"]+)\\"');
XML.prototype.patInlineDTDNode = /^\s*\!DOCTYPE\s+([\w\-\:]+)\s+\[/;
XML.prototype.patEndDTD = /\]$/;
XML.prototype.patDTDNode = /^\s*\!DOCTYPE\s+([\w\-\:]+)\s+\[(.*)\]/;
XML.prototype.patEndCDATA = /\]\]$/;
XML.prototype.patCDATANode = /^\s*\!\s*\[\s*CDATA\s*\[([^]*)\]\]/;
XML.prototype.attribsKey = "_Attribs";
XML.prototype.dataKey = "_Data";
XML.prototype.parse = function(branch, name) {
  if (!branch)
    branch = this.tree;
  if (!name)
    name = null;
  var foundClosing = false;
  var matches = null;
  while (matches = this.patTag.exec(this.text)) {
    var before = matches[1];
    var tag = matches[2];
    if (before.match(/\S/)) {
      if (typeof branch[this.dataKey] != "undefined")
        branch[this.dataKey] += " ";
      else
        branch[this.dataKey] = "";
      branch[this.dataKey] += !this.preserveWhitespace ? trim(decode_entities(before)) : decode_entities(before);
    }
    if (tag.match(this.patSpecialTag)) {
      if (tag.match(this.patPITag))
        tag = this.parsePINode(tag);
      else if (tag.match(this.patCommentTag))
        tag = this.parseCommentNode(tag);
      else if (tag.match(this.patDTDTag))
        tag = this.parseDTDNode(tag);
      else if (tag.match(this.patCDATATag)) {
        tag = this.parseCDATANode(tag);
        if (typeof branch[this.dataKey] != "undefined")
          branch[this.dataKey] += " ";
        else
          branch[this.dataKey] = "";
        branch[this.dataKey] += !this.preserveWhitespace ? trim(decode_entities(tag)) : decode_entities(tag);
      } else {
        this.throwParseError("Malformed special tag", tag);
        break;
      }
      if (tag == null)
        break;
      continue;
    } else {
      var matches = tag.match(this.patStandardTag);
      if (!matches) {
        this.throwParseError("Malformed tag", tag);
        break;
      }
      var closing = matches[1];
      var nodeName = this.lowerCase ? matches[2].toLowerCase() : matches[2];
      var attribsRaw = matches[3];
      if (closing) {
        if (nodeName == (name || "")) {
          foundClosing = 1;
          break;
        } else {
          this.throwParseError("Mismatched closing tag (expected </" + name + ">)", tag);
          break;
        }
      } else {
        var selfClosing = !!attribsRaw.match(this.patSelfClosing);
        var leaf = {};
        var attribs = leaf;
        if (this.preserveAttributes) {
          leaf[this.attribsKey] = {};
          attribs = leaf[this.attribsKey];
        }
        this.patAttrib.lastIndex = 0;
        while (matches = this.patAttrib.exec(attribsRaw)) {
          var key = this.lowerCase ? matches[1].toLowerCase() : matches[1];
          attribs[key] = decode_entities(matches[3]);
        }
        if (this.preserveAttributes && !num_keys(attribs)) {
          delete leaf[this.attribsKey];
        }
        if (!selfClosing) {
          this.parse(leaf, nodeName);
          if (this.error())
            break;
        }
        var num_leaf_keys = num_keys(leaf);
        if (typeof leaf[this.dataKey] != "undefined" && num_leaf_keys == 1) {
          leaf = leaf[this.dataKey];
        } else if (!num_leaf_keys) {
          leaf = "";
        }
        if (typeof branch[nodeName] != "undefined") {
          if (isa_array(branch[nodeName])) {
            branch[nodeName].push(leaf);
          } else {
            var temp = branch[nodeName];
            branch[nodeName] = [temp, leaf];
          }
        } else if (this.forceArrays && branch != this.tree) {
          branch[nodeName] = [leaf];
        } else {
          branch[nodeName] = leaf;
        }
        if (this.error() || branch == this.tree)
          break;
      }
    }
  }
  if (name && !foundClosing) {
    this.throwParseError("Missing closing tag (expected </" + name + ">)", name);
  }
  if (branch == this.tree) {
    if (typeof this.tree[this.dataKey] != "undefined")
      delete this.tree[this.dataKey];
    if (num_keys(this.tree) > 1) {
      this.throwParseError("Only one top-level node is allowed in document", first_key(this.tree));
      return;
    }
    this.documentNodeName = first_key(this.tree);
    if (this.documentNodeName && !this.preserveDocumentNode) {
      this.tree = this.tree[this.documentNodeName];
    }
  }
};
XML.prototype.throwParseError = function(key, tag) {
  var parsedSource = this.text.substring(0, this.patTag.lastIndex);
  var eolMatch = parsedSource.match(/\n/g);
  var lineNum = (eolMatch ? eolMatch.length : 0) + 1;
  lineNum -= tag.match(/\n/) ? tag.match(/\n/g).length : 0;
  this.errors.push({
    type: "Parse",
    key,
    text: "<" + tag + ">",
    line: lineNum
  });
  throw new Error(this.getLastError());
};
XML.prototype.error = function() {
  return this.errors.length;
};
XML.prototype.getError = function(error) {
  var text = "";
  if (!error)
    return "";
  text = (error.type || "General") + " Error";
  if (error.code)
    text += " " + error.code;
  text += ": " + error.key;
  if (error.line)
    text += " on line " + error.line;
  if (error.text)
    text += ": " + error.text;
  return text;
};
XML.prototype.getLastError = function() {
  if (!this.error())
    return "";
  return this.getError(this.errors[this.errors.length - 1]);
};
XML.prototype.parsePINode = function(tag) {
  if (!tag.match(this.patPINode)) {
    this.throwParseError("Malformed processor instruction", tag);
    return null;
  }
  this.piNodeList.push(tag);
  return tag;
};
XML.prototype.parseCommentNode = function(tag) {
  var matches = null;
  this.patNextClose.lastIndex = this.patTag.lastIndex;
  while (!tag.match(this.patEndComment)) {
    if (matches = this.patNextClose.exec(this.text)) {
      tag += ">" + matches[1];
    } else {
      this.throwParseError("Unclosed comment tag", tag);
      return null;
    }
  }
  this.patTag.lastIndex = this.patNextClose.lastIndex;
  return tag;
};
XML.prototype.parseDTDNode = function(tag) {
  var matches = null;
  if (tag.match(this.patExternalDTDNode)) {
    this.dtdNodeList.push(tag);
  } else if (tag.match(this.patInlineDTDNode)) {
    this.patNextClose.lastIndex = this.patTag.lastIndex;
    while (!tag.match(this.patEndDTD)) {
      if (matches = this.patNextClose.exec(this.text)) {
        tag += ">" + matches[1];
      } else {
        this.throwParseError("Unclosed DTD tag", tag);
        return null;
      }
    }
    this.patTag.lastIndex = this.patNextClose.lastIndex;
    if (tag.match(this.patDTDNode)) {
      this.dtdNodeList.push(tag);
    } else {
      this.throwParseError("Malformed DTD tag", tag);
      return null;
    }
  } else {
    this.throwParseError("Malformed DTD tag", tag);
    return null;
  }
  return tag;
};
XML.prototype.parseCDATANode = function(tag) {
  var matches = null;
  this.patNextClose.lastIndex = this.patTag.lastIndex;
  while (!tag.match(this.patEndCDATA)) {
    if (matches = this.patNextClose.exec(this.text)) {
      tag += ">" + matches[1];
    } else {
      this.throwParseError("Unclosed CDATA tag", tag);
      return null;
    }
  }
  this.patTag.lastIndex = this.patNextClose.lastIndex;
  if (matches = tag.match(this.patCDATANode)) {
    return matches[1];
  } else {
    this.throwParseError("Malformed CDATA tag", tag);
    return null;
  }
};
XML.prototype.getTree = function() {
  return this.tree;
};
XML.prototype.compose = function(indent_string, eol) {
  if (typeof eol == "undefined")
    eol = "\n";
  var tree = this.tree;
  if (this.preserveDocumentNode)
    tree = tree[this.documentNodeName];
  var raw = compose_xml(tree, this.documentNodeName, 0, indent_string, eol);
  var body = raw.replace(/^\s*\<\?.+?\?\>\s*/, "");
  var xml = "";
  if (this.piNodeList.length) {
    for (var idx = 0, len = this.piNodeList.length; idx < len; idx++) {
      xml += "<" + this.piNodeList[idx] + ">" + eol;
    }
  } else {
    xml += xml_header + eol;
  }
  if (this.dtdNodeList.length) {
    for (var idx = 0, len = this.dtdNodeList.length; idx < len; idx++) {
      xml += "<" + this.dtdNodeList[idx] + ">" + eol;
    }
  }
  xml += body;
  return xml;
};
var parse = function(text, opts) {
  if (!opts)
    opts = {};
  opts.text = text;
  var parser = new XML(opts);
  return parser.error() ? parser.getLastError() : parser.getTree();
};
var trim = function(text) {
  if (text == null)
    return "";
  if (text && text.replace) {
    text = text.replace(/^\s+/, "");
    text = text.replace(/\s+$/, "");
  }
  return text;
};
var encode_entities = function encode_entities2(text) {
  if (text == null)
    return "";
  if (text && text.replace) {
    text = text.replace(/\&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
  }
  return text;
};
var encode_attrib_entities = function encode_attrib_entities2(text) {
  if (text == null)
    return "";
  if (text && text.replace) {
    text = text.replace(/\&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/\"/g, "&quot;");
    text = text.replace(/\'/g, "&apos;");
  }
  return text;
};
var decode_entities = function decode_entities2(text) {
  if (text == null)
    return "";
  if (text && text.replace && text.match(/\&/)) {
    text = text.replace(/\&lt\;/g, "<");
    text = text.replace(/\&gt\;/g, ">");
    text = text.replace(/\&quot\;/g, '"');
    text = text.replace(/\&apos\;/g, "'");
    text = text.replace(/\&amp\;/g, "&");
  }
  return text;
};
var compose_xml = function compose_xml2(node, name, indent, indent_string, eol, sort) {
  if (typeof indent_string == "undefined")
    indent_string = "	";
  if (typeof eol == "undefined")
    eol = "\n";
  if (typeof sort == "undefined")
    sort = true;
  var xml = "";
  if (!indent) {
    indent = 0;
    xml = xml_header + eol;
    if (!name) {
      name = first_key(node);
      node = node[name];
    }
  }
  var indent_text = "";
  for (var k = 0; k < indent; k++)
    indent_text += indent_string;
  if (typeof node == "object" && node != null) {
    if (!node.length) {
      xml += indent_text + "<" + name;
      var num_keys3 = 0;
      var has_attribs = 0;
      for (var key in node)
        num_keys3++;
      if (node["_Attribs"]) {
        has_attribs = 1;
        var sorted_keys = sort ? hash_keys_to_array(node["_Attribs"]).sort() : hash_keys_to_array(node["_Attribs"]);
        for (var idx = 0, len = sorted_keys.length; idx < len; idx++) {
          var key = sorted_keys[idx];
          xml += " " + key + '="' + encode_attrib_entities(node["_Attribs"][key]) + '"';
        }
      }
      if (num_keys3 > has_attribs) {
        xml += ">";
        if (node["_Data"]) {
          xml += encode_entities(node["_Data"]) + "</" + name + ">" + eol;
        } else {
          xml += eol;
          var sorted_keys = sort ? hash_keys_to_array(node).sort() : hash_keys_to_array(node);
          for (var idx = 0, len = sorted_keys.length; idx < len; idx++) {
            var key = sorted_keys[idx];
            if (key != "_Attribs" && key.match(re_valid_tag_name)) {
              xml += compose_xml2(node[key], key, indent + 1, indent_string, eol, sort);
            }
          }
          xml += indent_text + "</" + name + ">" + eol;
        }
      } else {
        xml += "/>" + eol;
      }
    } else {
      for (var idx = 0; idx < node.length; idx++) {
        xml += compose_xml2(node[idx], name, indent, indent_string, eol, sort);
      }
    }
  } else {
    xml += indent_text + "<" + name + ">" + encode_entities(node) + "</" + name + ">" + eol;
  }
  return xml;
};
var hash_keys_to_array = function hash_keys_to_array2(hash) {
  var array = [];
  for (var key in hash)
    array.push(key);
  return array;
};
var isa_array = function isa_array2(arg) {
  return Array.isArray(arg);
};
var isa_hash = function isa_hash2(arg) {
  return !!arg && typeof arg == "object" && !isa_array(arg);
};
var first_key = function first_key2(hash) {
  for (var key in hash)
    return key;
  return null;
};
var num_keys = function num_keys2(hash) {
  var count = 0;
  for (var {} in hash)
    count++;
  return count;
};

// pixl/perf.mjs
var import_events2 = require("events");
var Perf = class extends import_events2.EventEmitter {
  perf = null;
  counters = null;
  scale = 1e3;
  precision = 1e3;
  totalKey = "total";
  minMax = false;
  __events = false;
  constructor() {
    super();
    this.reset();
  }
  reset = function() {
    this.perf = {};
    this.counters = {};
  };
  setScale = function(scale) {
    this.scale = scale;
  };
  setPrecision = function(precision) {
    this.precision = precision;
  };
  calcElapsed = function(start) {
    var diff = process.hrtime(start);
    var nano = diff[0] * 1e9 + diff[1];
    var value = nano / (1e9 / this.scale);
    return value;
  };
  begin = function(id) {
    if (!id)
      id = this.totalKey;
    var now = process.hrtime();
    if (id == this.totalKey && this.perf[id])
      return;
    if (!this.perf[id])
      this.perf[id] = { elapsed: 0 };
    this.perf[id].start = now;
    if (this.perf[id].end)
      delete this.perf[id].end;
    return new PerfMetric(this, id, now);
  };
  end = function(id, start) {
    if (!id)
      id = this.totalKey;
    var now = process.hrtime();
    if (!this.perf[id] && !start)
      return;
    if (!this.perf[id])
      this.perf[id] = { elapsed: 0 };
    var obj = this.perf[id];
    if (start)
      obj.start = start;
    obj.end = now;
    if (!obj.start)
      obj.start = obj.end;
    var elapsed = Array.isArray(obj.start) ? this.calcElapsed(obj.start) : 0;
    if (id == this.totalKey) {
      obj.elapsed = elapsed;
    } else {
      obj.elapsed += elapsed;
    }
    if (this.minMax) {
      if (!obj.count || elapsed < obj.min)
        obj.min = elapsed;
      if (!obj.count || elapsed > obj.max)
        obj.max = elapsed;
      if (!obj.count)
        obj.count = 0;
      obj.count++;
    }
    return this.formatValue(elapsed);
  };
  count = function(id, amount) {
    if (typeof amount == "undefined")
      amount = 1;
    if (!(id in this.counters))
      this.counters[id] = amount;
    else
      this.counters[id] += amount;
  };
  metrics = function() {
    var out = {};
    this.end();
    for (var id in this.perf) {
      if (this.perf[id].end) {
        out[id] = this.elapsed(id, true);
      }
    }
    return {
      scale: this.scale,
      perf: out,
      counters: this.counters
    };
  };
  json = function() {
    return JSON.stringify(this.metrics());
  };
  summarize = function(prefix) {
    var pairs = [];
    var metrics = this.metrics();
    if (!prefix)
      prefix = "";
    pairs.push("scale=" + this.scale);
    pairs.push("total=" + metrics.perf.total);
    delete metrics.perf.total;
    for (var id in metrics.perf) {
      pairs.push(prefix + id + "=" + metrics.perf[id]);
    }
    for (var id in metrics.counters) {
      var disp_id = id.match(/^c_/) ? id : "c_" + id;
      pairs.push(disp_id + "=" + metrics.counters[id]);
    }
    return pairs.join("&");
  };
  elapsed = function(id, disp) {
    if (!id)
      id = this.totalKey;
    if (!this.perf[id])
      return 0;
    var obj = this.perf[id];
    var elapsed = obj.elapsed || 0;
    if (!elapsed && obj.start && !obj.end) {
      elapsed = this.calcElapsed(obj.start);
    }
    return disp ? this.formatValue(elapsed) : elapsed;
  };
  get = function() {
    return this.perf;
  };
  getCounters = function() {
    return this.counters;
  };
  formatValue = function(value) {
    return Math.floor(value * this.precision) / this.precision;
  };
  getMinMaxMetrics = function() {
    if (!this.minMax)
      return {};
    var metrics = {};
    for (var id in this.perf) {
      var obj = this.perf[id];
      if (obj.end && id != this.totalKey) {
        if (!obj.elapsed)
          obj.elapsed = 0;
        metrics[id] = {
          min: this.formatValue(obj.min || 0),
          max: this.formatValue(obj.max || 0),
          total: this.formatValue(obj.elapsed),
          count: obj.count || 0,
          avg: this.formatValue(obj.elapsed / (obj.count || 1))
        };
      }
    }
    return metrics;
  };
  import = function(perf, prefix) {
    if (!prefix)
      prefix = "";
    if (perf.perf) {
      for (var key in perf.perf) {
        if (key != this.totalKey) {
          var pkey = prefix + key;
          if (!this.perf[pkey])
            this.perf[pkey] = {};
          if (!this.perf[pkey].end)
            this.perf[pkey].end = 1;
          if (!this.perf[pkey].elapsed)
            this.perf[pkey].elapsed = 0;
          var elapsed = typeof perf.perf[key] == "number" ? perf.perf[key] : perf.perf[key].elapsed;
          this.perf[pkey].elapsed += elapsed / (perf.scale / this.scale) || 0;
          if (this.minMax && perf.minMax) {
            var adj_min = perf.perf[key].min / (perf.scale / this.scale);
            if (!this.perf[pkey].count || adj_min < this.perf[pkey].min)
              this.perf[pkey].min = adj_min;
            var adj_max = perf.perf[key].max / (perf.scale / this.scale);
            if (!this.perf[pkey].count || adj_max > this.perf[pkey].max)
              this.perf[pkey].max = adj_max;
            if (!this.perf[pkey].count)
              this.perf[pkey].count = 0;
            this.perf[pkey].count += perf.perf[key].count || 0;
          } else if (this.minMax) {
            var adj_elapsed = elapsed / (perf.scale / this.scale) || 0;
            if (!this.perf[pkey].count || adj_elapsed < this.perf[pkey].min)
              this.perf[pkey].min = adj_elapsed;
            if (!this.perf[pkey].count || adj_elapsed > this.perf[pkey].max)
              this.perf[pkey].max = adj_elapsed;
            if (!this.perf[pkey].count)
              this.perf[pkey].count = 0;
            this.perf[pkey].count++;
          }
        }
      }
    }
    if (perf.counters) {
      for (var key in perf.counters) {
        var pkey = prefix + key;
        this.count(pkey, perf.counters[key]);
      }
    }
  };
};
var PerfMetric = class extends import_events2.EventEmitter {
  __events = false;
  perf = null;
  id = "";
  start = 0;
  constructor(perf, id, start) {
    super();
    this.perf = perf;
    this.id = id;
    this.start = start;
  }
  end = function() {
    return this.perf.end(this.id, this.start);
  };
};

// pixl/request.mjs
var import_errno2 = __toESM(require_errno(), 1);
var import_http_common = require("_http_common");
var import_events3 = require("events");
var hasBrotli = !!import_zlib.BrotliCompress;
var pixlreq_agent = "PixlRequest 1.0.0";
var dns_cache = {};
var checkIsHttpToken = import_http_common._checkIsHttpToken;
var checkInvalidHeaderChar = import_http_common._checkInvalidHeaderChar;
var Request = class extends import_events3.EventEmitter {
  defaultHeaders = null;
  defaultTimeout = 3e4;
  defaultFollow = false;
  followMatch = /^(301|302|307|308)$/;
  dnsTTL = 0;
  successMatch = /^2\d\d$/;
  autoDecompress = true;
  autoError = false;
  autoAgent = false;
  defaultRetries = false;
  retryMatch = /^5\d\d$/;
  autoContentLength = true;
  constructor(useragent) {
    super();
    this.defaultHeaders = {
      "Accept-Encoding": hasBrotli ? "gzip, deflate, br" : "gzip, deflate"
    };
    this.setUserAgent(useragent || pixlreq_agent);
  }
  setHeader = function(name, value) {
    this.defaultHeaders[name] = value;
  };
  setUserAgent = function(useragent) {
    this.setHeader("User-Agent", useragent);
  };
  setTimeout = function(timeout) {
    this.defaultTimeout = timeout;
  };
  setFollow = function(follow) {
    this.defaultFollow = follow;
  };
  setRetries = function(retries) {
    this.defaultRetries = retries;
  };
  setDNSCache = function(ttl) {
    this.dnsTTL = ttl;
  };
  flushDNSCache = function() {
    dns_cache = {};
  };
  setSuccessMatch = function(regexp) {
    this.successMatch = regexp;
  };
  setAutoDecompress = function(enabled) {
    this.autoDecompress = enabled;
  };
  setAutoError = function(enabled) {
    this.autoError = enabled;
  };
  setKeepAlive = function(enabled, opts) {
    if (enabled && !this.autoAgent) {
      if (!opts)
        opts = { keepAlive: true };
      this.autoAgent = {
        http: new import_http.Agent(opts),
        https: new import_https.Agent(opts)
      };
    } else if (!enabled && this.autoAgent) {
      this.autoAgent.http.destroy();
      this.autoAgent.https.destroy();
      this.autoAgent = false;
    }
  };
  setAutoContentLength = function(enabled) {
    this.autoContentLength = enabled;
  };
  json = function(url, data, options, callback) {
    var self2 = this;
    if (!callback) {
      callback = options;
      options = {};
    }
    var method = "";
    if (data) {
      method = "post";
      options.json = true;
      options.data = data;
    } else {
      method = "get";
    }
    this[method](url, options, function(err, res, data2, perf) {
      if (err)
        return callback(err, null, null, perf);
      if (!res.statusCode.toString().match(self2.successMatch)) {
        err = new Error("HTTP " + res.statusCode + " " + res.statusMessage);
        err.code = res.statusCode;
        return callback(err, res, data2, perf);
      }
      var json = null;
      try {
        json = JSON.parse(data2.toString());
      } catch (err2) {
        return callback(err2, res, data2, perf);
      }
      callback(null, res, json, perf);
    });
  };
  xml = function(url, data, options, callback) {
    var self2 = this;
    if (!callback) {
      callback = options;
      options = {};
    }
    var method = "";
    if (data) {
      method = "post";
      options.xml = true;
      options.data = data;
    } else {
      method = "get";
    }
    this[method](url, options, function(err, res, data2, perf) {
      if (err)
        return callback(err, null, null, perf);
      if (!res.statusCode.toString().match(self2.successMatch)) {
        err = new Error("HTTP " + res.statusCode + " " + res.statusMessage);
        err.code = res.statusCode;
        return callback(err, res, data2, perf);
      }
      var xml = null;
      try {
        xml = parse(data2.toString());
      } catch (err2) {
        return callback(err2, res, data2, perf);
      }
      callback(null, res, xml, perf);
    });
  };
  get = function(url, options, callback) {
    if (!callback) {
      callback = options;
      options = {};
    }
    if (!options)
      options = {};
    if (!options.method)
      options.method = "GET";
    this.request(url, options, callback);
  };
  head = function(url, options, callback) {
    if (!callback) {
      callback = options;
      options = {};
    }
    if (!options)
      options = {};
    if (!options.method)
      options.method = "HEAD";
    this.request(url, options, callback);
  };
  post = function(url, options, callback) {
    var key;
    if (!options)
      options = {};
    if (!options.headers)
      options.headers = {};
    if (!options.data) {
      if (options.files)
        options.data = {};
      else
        options.data = "";
    }
    if (!options.method)
      options.method = "POST";
    if (!options.data) {
      delete options.data;
      return this.request(url, options, callback);
    }
    var is_buffer = options.data instanceof Buffer;
    var is_string = typeof options.data == "string";
    if (is_string) {
      options.data = Buffer.from(options.data);
      is_buffer = true;
      is_string = false;
    }
    if (typeof options.data == "object" && !is_buffer) {
      url = url.replace(/\s*\[data\:\s*([\w\-]+)\:\s*([^\]]+)\]/ig, function(m_all, m_g1, m_g2) {
        if (m_g2.match(/^\-?\d+$/))
          m_g2 = parseInt(m_g2);
        else if (m_g2.match(/^\-?\d+\.\d+$/))
          m_g2 = parseFloat(m_g2);
        else if (m_g2.match(/^true$/))
          m_g2 = true;
        else if (m_g2.match(/^false$/))
          m_g2 = false;
        options.data[m_g1] = m_g2;
        return "";
      }).trim();
      if (options.json) {
        options.data = JSON.stringify(options.data) + "\n";
        options.headers["Content-Type"] = "application/json";
        delete options.json;
      } else if (options.xml) {
        options.data = compose_xml(options.data, options.xmlRootNode || "Request") + "\n";
        options.headers["Content-Type"] = "text/xml";
        delete options.xml;
        delete options.xmlRootNode;
      } else if (options.files || options.multipart) {
        var form = new import_form_data.default();
        for (key in options.data) {
          form.append(key, options.data[key]);
        }
        if (options.files) {
          for (key in options.files) {
            var file = options.files[key];
            if (typeof file == "string") {
              form.append(key, (0, import_fs3.createReadStream)(file));
            } else if (Array.isArray(file)) {
              var file_data = file[0];
              if (typeof file_data == "string")
                file_data = (0, import_fs3.createReadStream)(file_data);
              form.append(key, file_data, {
                filename: file[1]
              });
            } else {
              form.append(key, file);
            }
          }
          delete options.files;
        }
        options.data = form;
      } else {
        options.data = Buffer.from((0, import_querystring.stringify)(options.data));
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }
    this.request(url, options, callback);
  };
  put = function(url, options, callback) {
    if (!callback) {
      callback = options;
      options = {};
    }
    if (!options)
      options = {};
    if (!options.method)
      options.method = "PUT";
    this.post(url, options, callback);
  };
  delete = function(url, options, callback) {
    if (!callback) {
      callback = options;
      options = {};
    }
    if (!options)
      options = {};
    if (!options.method)
      options.method = "DELETE";
    this.post(url, options, callback);
  };
  request = function(url, options, callback) {
    var self2 = this;
    var callback_fired = false;
    var timer = null;
    var socket = null;
    var key;
    if (!options)
      options = {};
    else {
      var new_opts = {};
      for (key in options)
        new_opts[key] = options[key];
      options = new_opts;
    }
    var perf = new Perf();
    perf.begin();
    var parts = import_url.default.parse(url);
    if (options.host && !options.hostname) {
      options.hostname = options.host;
      delete options.host;
    }
    if (options.hostname && options.port && !options.path) {
      options.path = url;
    }
    if (!options.hostname)
      options.hostname = parts.hostname;
    if (!options.port)
      options.port = parts.port || (parts.protocol == "https:" ? 443 : 80);
    if (!options.path)
      options.path = parts.path;
    if (!options.auth && parts.auth)
      options.auth = parts.auth;
    if (this.autoAgent) {
      options.agent = parts.protocol == "https:" ? this.autoAgent.https : this.autoAgent.http;
    } else if (!("agent" in options)) {
      options.agent = false;
      options.keepAlive = false;
    }
    if (!options.headers)
      options.headers = {};
    for (key in this.defaultHeaders) {
      if (!(key in options.headers)) {
        options.headers[key] = this.defaultHeaders[key];
      }
    }
    url = url.replace(/\s*\[header\:\s*([\w\-]+)\:\s*([^\]]+)\]/ig, function(m_all, m_g1, m_g2) {
      options.headers[m_g1] = m_g2;
      return "";
    }).trim();
    if (this.dnsTTL && dns_cache[options.hostname]) {
      var now = new Date().getTime() / 1e3;
      var obj = dns_cache[options.hostname];
      if (obj.expires > now) {
        options.headers["Host"] = options.hostname;
        options.hostname = obj.ip;
      } else {
        delete dns_cache[options.hostname];
      }
    }
    var post_data = null;
    var is_form = false;
    if ("data" in options && options.data !== null) {
      post_data = options.data;
      delete options.data;
      if (post_data instanceof import_form_data.default) {
        is_form = true;
        var form_headers = post_data.getHeaders();
        for (key in form_headers) {
          options.headers[key] = form_headers[key];
        }
      } else if (this.autoContentLength || options.method != "POST") {
        if (typeof post_data == "string")
          post_data = Buffer.from(post_data, "utf8");
        options.headers["Content-Length"] = post_data.length;
      }
    }
    var aborted = false;
    var timeout = this.defaultTimeout;
    if ("timeout" in options) {
      timeout = options.timeout;
      delete options.timeout;
    }
    var follow = this.defaultFollow;
    if ("follow" in options) {
      follow = options.follow;
      delete options.follow;
    }
    var retries = this.defaultRetries;
    if ("retries" in options) {
      retries = options.retries;
      delete options.retries;
    }
    var download = null;
    var pre_download = null;
    if ("download" in options) {
      download = options.download;
      if (typeof download == "string") {
        try {
          download = (0, import_fs3.createWriteStream)(download);
        } catch (err) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          if (callback && !callback_fired) {
            callback_fired = true;
            callback(err);
          }
          return;
        }
        download.on("error", function(err) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          if (callback && !callback_fired) {
            callback_fired = true;
            callback(err);
          }
          return;
        });
      }
      delete options.download;
    }
    if ("pre_download" in options) {
      pre_download = options.pre_download;
      delete options.pre_download;
    }
    for (var key in options.headers) {
      if (!checkIsHttpToken(key)) {
        callback_fired = true;
        return callback(new Error("Invalid characters in header name: " + key));
      }
      if (checkInvalidHeaderChar(options.headers[key])) {
        callback_fired = true;
        return callback(new Error("Invalid characters in header value: " + key + ": " + options.headers[key]));
      }
    }
    var proto_class = parts.protocol == "https:" ? import_https.default : import_http.default;
    var req = proto_class.request(options, function(res) {
      perf.end("wait", perf.perf.total.start);
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (follow && res.statusCode.toString().match(self2.followMatch) && res.headers["location"]) {
        options.timeout = timeout;
        options.follow = typeof follow == "number" ? follow - 1 : follow;
        options.download = download;
        options.pre_download = pre_download;
        options.retries = retries;
        delete options.hostname;
        delete options.port;
        delete options.path;
        delete options.auth;
        if (post_data !== null)
          options.data = post_data;
        callback_fired = true;
        self2.request(res.headers["location"], options, callback);
        return;
      }
      if (retries && res.statusCode.toString().match(self2.retryMatch)) {
        options.timeout = timeout;
        options.follow = follow;
        options.download = download;
        options.pre_download = pre_download;
        options.retries = typeof retries == "number" ? retries - 1 : retries;
        delete options.hostname;
        delete options.port;
        delete options.path;
        delete options.auth;
        if (post_data !== null)
          options.data = post_data;
        callback_fired = true;
        self2.request(url, options, callback);
        return;
      }
      var err = null;
      if (self2.autoError && !res.statusCode.toString().match(self2.successMatch)) {
        err = new Error("HTTP " + res.statusCode + " " + res.statusMessage);
        err.code = res.statusCode;
      }
      if (download) {
        var decompressor = null;
        download.on("finish", function() {
          perf.end("receive", perf.perf.total.start);
          if (callback && !callback_fired) {
            callback_fired = true;
            callback(err, res, download, self2.finishPerf(perf));
          }
        });
        if (pre_download) {
          if (pre_download(null, res, download) === false) {
            download.removeAllListeners("finish");
            download = null;
          }
        } else if (self2.autoDecompress && res.headers["content-encoding"] && res.headers["content-encoding"].match(/\bbr\b/i) && hasBrotli) {
          decompressor = (0, import_zlib.createBrotliDecompress)();
          decompressor.on("error", function(err2) {
          });
          res.pipe(decompressor).pipe(download);
        } else if (self2.autoDecompress && res.headers["content-encoding"] && res.headers["content-encoding"].match(/\bgzip\b/i)) {
          decompressor = (0, import_zlib.createGunzip)();
          decompressor.on("error", function(err2) {
          });
          res.pipe(decompressor).pipe(download);
        } else if (self2.autoDecompress && res.headers["content-encoding"] && res.headers["content-encoding"].match(/\bdeflate\b/i)) {
          decompressor = (0, import_zlib.createInflate)();
          decompressor.on("error", function(err2) {
          });
          res.pipe(decompressor).pipe(download);
        } else {
          res.pipe(download);
        }
      }
      if (!download) {
        var chunks = [];
        var total_bytes = 0;
        res.on("data", function(chunk) {
          chunks.push(chunk);
          total_bytes += chunk.length;
        });
        res.on("end", function() {
          perf.end("receive", perf.perf.total.start);
          if (socket) {
            perf.count("bytes_sent", (socket.bytesWritten || 0) - (socket._pixl_orig_bytes_written || 0));
            perf.count("bytes_received", (socket.bytesRead || 0) - (socket._pixl_orig_bytes_read || 0));
            socket._pixl_orig_bytes_written = socket.bytesWritten || 0;
            socket._pixl_orig_bytes_read = socket.bytesRead || 0;
          }
          if (total_bytes) {
            var buf = Buffer.concat(chunks, total_bytes);
            if (self2.autoDecompress && res.headers["content-encoding"] && res.headers["content-encoding"].match(/\bbr\b/i) && hasBrotli && callback) {
              (0, import_zlib.brotliDecompress)(buf, function(zerr, data) {
                perf.end("decompress", perf.perf.total.start);
                if (!callback_fired) {
                  callback_fired = true;
                  callback(err || zerr, res, data, self2.finishPerf(perf));
                }
              });
            } else if (self2.autoDecompress && res.headers["content-encoding"] && res.headers["content-encoding"].match(/\bgzip\b/i) && callback) {
              (0, import_zlib.gunzip)(buf, function(zerr, data) {
                perf.end("decompress", perf.perf.total.start);
                if (!callback_fired) {
                  callback_fired = true;
                  callback(err || zerr, res, data, self2.finishPerf(perf));
                }
              });
            } else if (self2.autoDecompress && res.headers["content-encoding"] && res.headers["content-encoding"].match(/\bdeflate\b/i) && callback) {
              (0, import_zlib.inflate)(buf, function(zerr, data) {
                perf.end("decompress", perf.perf.total.start);
                if (!callback_fired) {
                  callback_fired = true;
                  callback(err || zerr, res, data, self2.finishPerf(perf));
                }
              });
            } else {
              if (callback && !callback_fired) {
                callback_fired = true;
                callback(err, res, buf, self2.finishPerf(perf));
              }
            }
          } else {
            if (callback && !callback_fired) {
              callback_fired = true;
              callback(err, res, Buffer.alloc(0), self2.finishPerf(perf));
            }
          }
        });
      }
    });
    req.on("socket", function(sock) {
      socket = sock;
      if (!socket._pixl_request_hooked) {
        socket._pixl_request_hooked = true;
        socket.setNoDelay(true);
        socket.once("lookup", function(err, address, family, hostname2) {
          perf.end("dns", perf.perf.total.start);
          if (self2.dnsTTL) {
            dns_cache[options.hostname] = {
              ip: address,
              expires: new Date().getTime() / 1e3 + self2.dnsTTL
            };
          }
        });
        socket.once("connect", function() {
          perf.end("connect", perf.perf.total.start);
        });
      }
    });
    req.on("finish", function() {
      perf.end("send", perf.perf.total.start);
    });
    req.on("error", function(e) {
      if (callback && !aborted) {
        var msg = e.toString();
        if (msg.match(/ENOTFOUND/))
          msg = "DNS: Failed to lookup IP from hostname: " + options.hostname;
        else if (msg.match(/ECONNREFUSED/))
          msg = "Connection Refused: Failed to connect to host: " + options.hostname;
        else if (e.errno && import_errno2.code[e.errno]) {
          msg = ucfirst(import_errno2.code[e.errno].description) + " (" + e.message + ")";
        }
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (!callback_fired) {
          if (retries) {
            options.timeout = timeout;
            options.follow = follow;
            options.download = download;
            options.pre_download = pre_download;
            options.retries = typeof retries == "number" ? retries - 1 : retries;
            delete options.hostname;
            delete options.port;
            delete options.path;
            delete options.auth;
            if (post_data !== null)
              options.data = post_data;
            callback_fired = true;
            self2.request(url, options, callback);
            return;
          }
          callback_fired = true;
          callback(new Error(msg), null, null, self2.finishPerf(perf));
        }
      }
    });
    if (timeout) {
      timer = setTimeout(function() {
        if (!aborted) {
          aborted = true;
          req.abort();
          if (callback && !callback_fired) {
            if (retries) {
              options.timeout = timeout;
              options.follow = follow;
              options.download = download;
              options.pre_download = pre_download;
              options.retries = typeof retries == "number" ? retries - 1 : retries;
              delete options.hostname;
              delete options.port;
              delete options.path;
              delete options.auth;
              if (post_data !== null)
                options.data = post_data;
              callback_fired = true;
              self2.request(url, options, callback);
              return;
            }
            callback_fired = true;
            callback(new Error("Socket Timeout (" + timeout + " ms)"), null, null, self2.finishPerf(perf));
          }
        }
      }, timeout);
    }
    if (post_data !== null) {
      if (is_form)
        post_data.pipe(req);
      else {
        req.end(post_data);
      }
    } else
      req.end();
  };
  finishPerf = function(perf) {
    var p = perf.perf;
    if (p.decompress && p.receive)
      p.decompress.elapsed -= p.receive.elapsed;
    if (p.receive && p.wait)
      p.receive.elapsed -= p.wait.elapsed;
    if (p.wait && p.send)
      p.wait.elapsed -= p.send.elapsed;
    if (p.send && p.connect)
      p.send.elapsed -= p.connect.elapsed;
    if (p.connect && p.dns)
      p.connect.elapsed -= p.dns.elapsed;
    for (var key in p) {
      if (p[key].elapsed)
        p[key].elapsed = Math.max(0, p[key].elapsed);
    }
    perf.end();
    return perf;
  };
};
function ucfirst(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
}

// plugins/url-plugin.js
process.stdin.setEncoding("utf8");
process.stdout.setEncoding("utf8");
var stream = new JSONStream(process.stdin, process.stdout);
stream.on("json", function(job) {
  var params = job.params;
  var request = new Request();
  var print = function(text) {
    (0, import_fs4.appendFileSync)(job.log_file, text);
  };
  request.setTimeout((params.timeout || 0) * 1e3);
  if (params.ssl_cert_bypass) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  if (!params.url || !params.url.match(/^https?\:\/\/\S+$/i)) {
    stream.write({ complete: 1, code: 1, description: "Malformed URL: " + (params.url || "(n/a)") });
    return;
  }
  params.url = sub(params.url, job);
  print("Sending HTTP " + params.method + " to URL:\n" + params.url + "\n");
  if (params.headers) {
    params.headers = sub(params.headers, job);
    print("\nRequest Headers:\n" + params.headers.trim() + "\n");
    params.headers.replace(/\r\n/g, "\n").trim().split(/\n/).forEach(function(pair) {
      if (pair.match(/^([^\:]+)\:\s*(.+)$/)) {
        request.setHeader(RegExp.$1, RegExp.$2);
      }
    });
  }
  if (params.follow)
    request.setFollow(32);
  var opts = {
    method: params.method
  };
  if (opts.method == "POST") {
    params.data = sub(params.data, job);
    print("\nPOST Data:\n" + params.data.trim() + "\n");
    opts.data = Buffer.from(params.data || "");
  }
  var success_match = new RegExp(params.success_match || ".*");
  var error_match = new RegExp(params.error_match || "(?!)");
  request.request(params.url, opts, function(err, resp, data, perf) {
    if (!err && (resp.statusCode < 200 || resp.statusCode >= 400)) {
      err = new Error("HTTP " + resp.statusCode + " " + resp.statusMessage);
      err.code = resp.statusCode;
    }
    var text = data ? data.toString() : "";
    if (!err) {
      if (text.match(error_match)) {
        err = new Error("Response contains error match: " + params.error_match);
      } else if (!text.match(success_match)) {
        err = new Error("Response missing success match: " + params.success_match);
      }
    }
    var update = {
      complete: 1
    };
    if (err) {
      update.code = err.code || 1;
      update.description = err.message || err;
    } else {
      update.code = 0;
      update.description = "Success (HTTP " + resp.statusCode + " " + resp.statusMessage + ")";
    }
    print("\n" + update.description + "\n");
    if (resp && resp.rawHeaders) {
      var rows = [];
      print("\nResponse Headers:\n");
      for (var idx = 0, len = resp.rawHeaders.length; idx < len; idx += 2) {
        rows.push([resp.rawHeaders[idx], resp.rawHeaders[idx + 1]]);
        print(resp.rawHeaders[idx] + ": " + resp.rawHeaders[idx + 1] + "\n");
      }
      update.table = {
        title: "HTTP Response Headers",
        header: ["Header Name", "Header Value"],
        rows: rows.sort(function(a, b) {
          return a[0].localeCompare(b[0]);
        })
      };
    }
    if (job.chain) {
      update.chain_data = {
        headers: resp.headers
      };
    }
    if (text && resp.headers["content-type"] && resp.headers["content-type"].match(/(text|javascript|json|css|html)/i)) {
      print("\nRaw Response Content:\n" + text.trim() + "\n");
      if (text.length < 32768) {
        update.html = {
          title: "Raw Response Content",
          content: "<pre>" + text.replace(/</g, "&lt;").trim() + "</pre>"
        };
      }
      if (job.chain && text.length < 1024 * 1024 && resp.headers["content-type"].match(/(application|text)\/json/i)) {
        var json = null;
        try {
          json = JSON.parse(text);
        } catch (e) {
          print("\nWARNING: Failed to parse JSON response: " + e + " (could not include JSON in chain_data)\n");
        }
        if (json)
          update.chain_data.json = json;
      }
    }
    if (perf) {
      update.perf = perf.metrics();
      print("\nPerformance Metrics: " + perf.summarize() + "\n");
    }
    stream.write(update);
  });
});
/*!
  * prr
  * (c) 2013 Rod Vagg <rod@vagg.org>
  * https://github.com/rvagg/prr
  * License: MIT
  */
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
