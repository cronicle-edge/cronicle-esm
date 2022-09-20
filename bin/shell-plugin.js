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
      function slice(arrayLike, start2) {
        start2 = start2 | 0;
        var newLen = Math.max(arrayLike.length - start2, 0);
        var newArr = Array(newLen);
        for (var idx = 0; idx < newLen; idx++) {
          newArr[idx] = arrayLike[start2 + idx];
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
      function baseSlice(array, start2, end) {
        var index2 = -1, length = array.length;
        if (start2 < 0) {
          start2 = -start2 > length ? 0 : length + start2;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start2 > end ? 0 : end - start2 >>> 0;
        start2 >>>= 0;
        var result = Array(length);
        while (++index2 < length) {
          result[index2] = array[index2 + start2];
        }
        return result;
      }
      function castSlice(array, start2, end) {
        var length = array.length;
        end = end === void 0 ? length : end;
        return !start2 && end >= length ? array : baseSlice(array, start2, end);
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
      function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === void 0)) {
          return string.replace(reTrim, "");
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start2 = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start2, end).join("");
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
          return trim(arg.replace(FN_ARG, ""));
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
      function baseRange(start2, end, step, fromRight) {
        var index2 = -1, length = nativeMax(nativeCeil((end - start2) / (step || 1)), 0), result = Array(length);
        while (length--) {
          result[fromRight ? length : ++index2] = start2;
          start2 += step;
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

// node_modules/moment/moment.js
var require_moment = __commonJS({
  "node_modules/moment/moment.js"(exports, module2) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.moment = factory();
    })(exports, function() {
      "use strict";
      var hookCallback;
      function hooks() {
        return hookCallback.apply(null, arguments);
      }
      function setHookCallback(callback) {
        hookCallback = callback;
      }
      function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]";
      }
      function isObject(input) {
        return input != null && Object.prototype.toString.call(input) === "[object Object]";
      }
      function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
      }
      function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
          return Object.getOwnPropertyNames(obj).length === 0;
        } else {
          var k;
          for (k in obj) {
            if (hasOwnProp(obj, k)) {
              return false;
            }
          }
          return true;
        }
      }
      function isUndefined(input) {
        return input === void 0;
      }
      function isNumber(input) {
        return typeof input === "number" || Object.prototype.toString.call(input) === "[object Number]";
      }
      function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]";
      }
      function map(arr, fn) {
        var res = [], i, arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
          res.push(fn(arr[i], i));
        }
        return res;
      }
      function extend(a, b) {
        for (var i in b) {
          if (hasOwnProp(b, i)) {
            a[i] = b[i];
          }
        }
        if (hasOwnProp(b, "toString")) {
          a.toString = b.toString;
        }
        if (hasOwnProp(b, "valueOf")) {
          a.valueOf = b.valueOf;
        }
        return a;
      }
      function createUTC(input, format2, locale2, strict) {
        return createLocalOrUTC(input, format2, locale2, strict, true).utc();
      }
      function defaultParsingFlags() {
        return {
          empty: false,
          unusedTokens: [],
          unusedInput: [],
          overflow: -2,
          charsLeftOver: 0,
          nullInput: false,
          invalidEra: null,
          invalidMonth: null,
          invalidFormat: false,
          userInvalidated: false,
          iso: false,
          parsedDateParts: [],
          era: null,
          meridiem: null,
          rfc2822: false,
          weekdayMismatch: false
        };
      }
      function getParsingFlags(m) {
        if (m._pf == null) {
          m._pf = defaultParsingFlags();
        }
        return m._pf;
      }
      var some;
      if (Array.prototype.some) {
        some = Array.prototype.some;
      } else {
        some = function(fun) {
          var t = Object(this), len = t.length >>> 0, i;
          for (i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
              return true;
            }
          }
          return false;
        };
      }
      function isValid(m) {
        if (m._isValid == null) {
          var flags = getParsingFlags(m), parsedParts = some.call(flags.parsedDateParts, function(i) {
            return i != null;
          }), isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
          if (m._strict) {
            isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
          }
          if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
          } else {
            return isNowValid;
          }
        }
        return m._isValid;
      }
      function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
          extend(getParsingFlags(m), flags);
        } else {
          getParsingFlags(m).userInvalidated = true;
        }
        return m;
      }
      var momentProperties = hooks.momentProperties = [], updateInProgress = false;
      function copyConfig(to2, from2) {
        var i, prop, val, momentPropertiesLen = momentProperties.length;
        if (!isUndefined(from2._isAMomentObject)) {
          to2._isAMomentObject = from2._isAMomentObject;
        }
        if (!isUndefined(from2._i)) {
          to2._i = from2._i;
        }
        if (!isUndefined(from2._f)) {
          to2._f = from2._f;
        }
        if (!isUndefined(from2._l)) {
          to2._l = from2._l;
        }
        if (!isUndefined(from2._strict)) {
          to2._strict = from2._strict;
        }
        if (!isUndefined(from2._tzm)) {
          to2._tzm = from2._tzm;
        }
        if (!isUndefined(from2._isUTC)) {
          to2._isUTC = from2._isUTC;
        }
        if (!isUndefined(from2._offset)) {
          to2._offset = from2._offset;
        }
        if (!isUndefined(from2._pf)) {
          to2._pf = getParsingFlags(from2);
        }
        if (!isUndefined(from2._locale)) {
          to2._locale = from2._locale;
        }
        if (momentPropertiesLen > 0) {
          for (i = 0; i < momentPropertiesLen; i++) {
            prop = momentProperties[i];
            val = from2[prop];
            if (!isUndefined(val)) {
              to2[prop] = val;
            }
          }
        }
        return to2;
      }
      function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
          this._d = new Date(NaN);
        }
        if (updateInProgress === false) {
          updateInProgress = true;
          hooks.updateOffset(this);
          updateInProgress = false;
        }
      }
      function isMoment(obj) {
        return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
      }
      function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
          console.warn("Deprecation warning: " + msg);
        }
      }
      function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function() {
          if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
          }
          if (firstTime) {
            var args = [], arg, i, key, argLen = arguments.length;
            for (i = 0; i < argLen; i++) {
              arg = "";
              if (typeof arguments[i] === "object") {
                arg += "\n[" + i + "] ";
                for (key in arguments[0]) {
                  if (hasOwnProp(arguments[0], key)) {
                    arg += key + ": " + arguments[0][key] + ", ";
                  }
                }
                arg = arg.slice(0, -2);
              } else {
                arg = arguments[i];
              }
              args.push(arg);
            }
            warn(
              msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack
            );
            firstTime = false;
          }
          return fn.apply(this, arguments);
        }, fn);
      }
      var deprecations = {};
      function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
          hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
          warn(msg);
          deprecations[name] = true;
        }
      }
      hooks.suppressDeprecationWarnings = false;
      hooks.deprecationHandler = null;
      function isFunction(input) {
        return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
      }
      function set(config) {
        var prop, i;
        for (i in config) {
          if (hasOwnProp(config, i)) {
            prop = config[i];
            if (isFunction(prop)) {
              this[i] = prop;
            } else {
              this["_" + i] = prop;
            }
          }
        }
        this._config = config;
        this._dayOfMonthOrdinalParseLenient = new RegExp(
          (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
        );
      }
      function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
          if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
              res[prop] = {};
              extend(res[prop], parentConfig[prop]);
              extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
              res[prop] = childConfig[prop];
            } else {
              delete res[prop];
            }
          }
        }
        for (prop in parentConfig) {
          if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
            res[prop] = extend({}, res[prop]);
          }
        }
        return res;
      }
      function Locale(config) {
        if (config != null) {
          this.set(config);
        }
      }
      var keys;
      if (Object.keys) {
        keys = Object.keys;
      } else {
        keys = function(obj) {
          var i, res = [];
          for (i in obj) {
            if (hasOwnProp(obj, i)) {
              res.push(i);
            }
          }
          return res;
        };
      }
      var defaultCalendar = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
      };
      function calendar(key, mom, now2) {
        var output = this._calendar[key] || this._calendar["sameElse"];
        return isFunction(output) ? output.call(mom, now2) : output;
      }
      function zeroFill(number, targetLength, forceSign) {
        var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
        return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }
      var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
      function addFormatToken(token2, padded, ordinal2, callback) {
        var func = callback;
        if (typeof callback === "string") {
          func = function() {
            return this[callback]();
          };
        }
        if (token2) {
          formatTokenFunctions[token2] = func;
        }
        if (padded) {
          formatTokenFunctions[padded[0]] = function() {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
          };
        }
        if (ordinal2) {
          formatTokenFunctions[ordinal2] = function() {
            return this.localeData().ordinal(
              func.apply(this, arguments),
              token2
            );
          };
        }
      }
      function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
          return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
      }
      function makeFormatFunction(format2) {
        var array = format2.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) {
          if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
          } else {
            array[i] = removeFormattingTokens(array[i]);
          }
        }
        return function(mom) {
          var output = "", i2;
          for (i2 = 0; i2 < length; i2++) {
            output += isFunction(array[i2]) ? array[i2].call(mom, format2) : array[i2];
          }
          return output;
        };
      }
      function formatMoment(m, format2) {
        if (!m.isValid()) {
          return m.localeData().invalidDate();
        }
        format2 = expandFormat(format2, m.localeData());
        formatFunctions[format2] = formatFunctions[format2] || makeFormatFunction(format2);
        return formatFunctions[format2](m);
      }
      function expandFormat(format2, locale2) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
          return locale2.longDateFormat(input) || input;
        }
        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format2)) {
          format2 = format2.replace(
            localFormattingTokens,
            replaceLongDateFormatTokens
          );
          localFormattingTokens.lastIndex = 0;
          i -= 1;
        }
        return format2;
      }
      var defaultLongDateFormat = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
      };
      function longDateFormat(key) {
        var format2 = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
        if (format2 || !formatUpper) {
          return format2;
        }
        this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function(tok) {
          if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
            return tok.slice(1);
          }
          return tok;
        }).join("");
        return this._longDateFormat[key];
      }
      var defaultInvalidDate = "Invalid date";
      function invalidDate() {
        return this._invalidDate;
      }
      var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
      function ordinal(number) {
        return this._ordinal.replace("%d", number);
      }
      var defaultRelativeTime = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      };
      function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
      }
      function pastFuture(diff2, output) {
        var format2 = this._relativeTime[diff2 > 0 ? "future" : "past"];
        return isFunction(format2) ? format2(output) : format2.replace(/%s/i, output);
      }
      var aliases = {};
      function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + "s"] = aliases[shorthand] = unit;
      }
      function normalizeUnits(units) {
        return typeof units === "string" ? aliases[units] || aliases[units.toLowerCase()] : void 0;
      }
      function normalizeObjectUnits(inputObject) {
        var normalizedInput = {}, normalizedProp, prop;
        for (prop in inputObject) {
          if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
              normalizedInput[normalizedProp] = inputObject[prop];
            }
          }
        }
        return normalizedInput;
      }
      var priorities = {};
      function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
      }
      function getPrioritizedUnits(unitsObj) {
        var units = [], u;
        for (u in unitsObj) {
          if (hasOwnProp(unitsObj, u)) {
            units.push({ unit: u, priority: priorities[u] });
          }
        }
        units.sort(function(a, b) {
          return a.priority - b.priority;
        });
        return units;
      }
      function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      }
      function absFloor(number) {
        if (number < 0) {
          return Math.ceil(number) || 0;
        } else {
          return Math.floor(number);
        }
      }
      function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
          value = absFloor(coercedNumber);
        }
        return value;
      }
      function makeGetSet(unit, keepTime) {
        return function(value) {
          if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
          } else {
            return get(this, unit);
          }
        };
      }
      function get(mom, unit) {
        return mom.isValid() ? mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]() : NaN;
      }
      function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
          if (unit === "FullYear" && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
            value = toInt(value);
            mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](
              value,
              mom.month(),
              daysInMonth(value, mom.month())
            );
          } else {
            mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
          }
        }
      }
      function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
          return this[units]();
        }
        return this;
      }
      function stringSet(units, value) {
        if (typeof units === "object") {
          units = normalizeObjectUnits(units);
          var prioritized = getPrioritizedUnits(units), i, prioritizedLen = prioritized.length;
          for (i = 0; i < prioritizedLen; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
          }
        } else {
          units = normalizeUnits(units);
          if (isFunction(this[units])) {
            return this[units](value);
          }
        }
        return this;
      }
      var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, regexes;
      regexes = {};
      function addRegexToken(token2, regex, strictRegex) {
        regexes[token2] = isFunction(regex) ? regex : function(isStrict, localeData2) {
          return isStrict && strictRegex ? strictRegex : regex;
        };
      }
      function getParseRegexForToken(token2, config) {
        if (!hasOwnProp(regexes, token2)) {
          return new RegExp(unescapeFormat(token2));
        }
        return regexes[token2](config._strict, config._locale);
      }
      function unescapeFormat(s) {
        return regexEscape(
          s.replace("\\", "").replace(
            /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
            function(matched, p1, p2, p3, p4) {
              return p1 || p2 || p3 || p4;
            }
          )
        );
      }
      function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      var tokens = {};
      function addParseToken(token2, callback) {
        var i, func = callback, tokenLen;
        if (typeof token2 === "string") {
          token2 = [token2];
        }
        if (isNumber(callback)) {
          func = function(input, array) {
            array[callback] = toInt(input);
          };
        }
        tokenLen = token2.length;
        for (i = 0; i < tokenLen; i++) {
          tokens[token2[i]] = func;
        }
      }
      function addWeekParseToken(token2, callback) {
        addParseToken(token2, function(input, array, config, token3) {
          config._w = config._w || {};
          callback(input, config._w, config, token3);
        });
      }
      function addTimeToArrayFromToken(token2, input, config) {
        if (input != null && hasOwnProp(tokens, token2)) {
          tokens[token2](input, config._a, config, token2);
        }
      }
      var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
      function mod(n, x) {
        return (n % x + x) % x;
      }
      var indexOf;
      if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
      } else {
        indexOf = function(o) {
          var i;
          for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
              return i;
            }
          }
          return -1;
        };
      }
      function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
          return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
      }
      addFormatToken("M", ["MM", 2], "Mo", function() {
        return this.month() + 1;
      });
      addFormatToken("MMM", 0, 0, function(format2) {
        return this.localeData().monthsShort(this, format2);
      });
      addFormatToken("MMMM", 0, 0, function(format2) {
        return this.localeData().months(this, format2);
      });
      addUnitAlias("month", "M");
      addUnitPriority("month", 8);
      addRegexToken("M", match1to2);
      addRegexToken("MM", match1to2, match2);
      addRegexToken("MMM", function(isStrict, locale2) {
        return locale2.monthsShortRegex(isStrict);
      });
      addRegexToken("MMMM", function(isStrict, locale2) {
        return locale2.monthsRegex(isStrict);
      });
      addParseToken(["M", "MM"], function(input, array) {
        array[MONTH] = toInt(input) - 1;
      });
      addParseToken(["MMM", "MMMM"], function(input, array, config, token2) {
        var month = config._locale.monthsParse(input, token2, config._strict);
        if (month != null) {
          array[MONTH] = month;
        } else {
          getParsingFlags(config).invalidMonth = input;
        }
      });
      var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split(
        "_"
      ), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
      function localeMonths(m, format2) {
        if (!m) {
          return isArray(this._months) ? this._months : this._months["standalone"];
        }
        return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format2) ? "format" : "standalone"][m.month()];
      }
      function localeMonthsShort(m, format2) {
        if (!m) {
          return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format2) ? "format" : "standalone"][m.month()];
      }
      function handleStrictParse(monthName, format2, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
          for (i = 0; i < 12; ++i) {
            mom = createUTC([2e3, i]);
            this._shortMonthsParse[i] = this.monthsShort(
              mom,
              ""
            ).toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if (format2 === "MMM") {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
          }
        } else {
          if (format2 === "MMM") {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
          }
        }
      }
      function localeMonthsParse(monthName, format2, strict) {
        var i, mom, regex;
        if (this._monthsParseExact) {
          return handleStrictParse.call(this, monthName, format2, strict);
        }
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
        }
        for (i = 0; i < 12; i++) {
          mom = createUTC([2e3, i]);
          if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp(
              "^" + this.months(mom, "").replace(".", "") + "$",
              "i"
            );
            this._shortMonthsParse[i] = new RegExp(
              "^" + this.monthsShort(mom, "").replace(".", "") + "$",
              "i"
            );
          }
          if (!strict && !this._monthsParse[i]) {
            regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
            this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && format2 === "MMMM" && this._longMonthsParse[i].test(monthName)) {
            return i;
          } else if (strict && format2 === "MMM" && this._shortMonthsParse[i].test(monthName)) {
            return i;
          } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
          }
        }
      }
      function setMonth(mom, value) {
        var dayOfMonth;
        if (!mom.isValid()) {
          return mom;
        }
        if (typeof value === "string") {
          if (/^\d+$/.test(value)) {
            value = toInt(value);
          } else {
            value = mom.localeData().monthsParse(value);
            if (!isNumber(value)) {
              return mom;
            }
          }
        }
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth);
        return mom;
      }
      function getSetMonth(value) {
        if (value != null) {
          setMonth(this, value);
          hooks.updateOffset(this, true);
          return this;
        } else {
          return get(this, "Month");
        }
      }
      function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
      }
      function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
          if (!hasOwnProp(this, "_monthsRegex")) {
            computeMonthsParse.call(this);
          }
          if (isStrict) {
            return this._monthsShortStrictRegex;
          } else {
            return this._monthsShortRegex;
          }
        } else {
          if (!hasOwnProp(this, "_monthsShortRegex")) {
            this._monthsShortRegex = defaultMonthsShortRegex;
          }
          return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
      }
      function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
          if (!hasOwnProp(this, "_monthsRegex")) {
            computeMonthsParse.call(this);
          }
          if (isStrict) {
            return this._monthsStrictRegex;
          } else {
            return this._monthsRegex;
          }
        } else {
          if (!hasOwnProp(this, "_monthsRegex")) {
            this._monthsRegex = defaultMonthsRegex;
          }
          return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
        }
      }
      function computeMonthsParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var shortPieces = [], longPieces = [], mixedPieces = [], i, mom;
        for (i = 0; i < 12; i++) {
          mom = createUTC([2e3, i]);
          shortPieces.push(this.monthsShort(mom, ""));
          longPieces.push(this.months(mom, ""));
          mixedPieces.push(this.months(mom, ""));
          mixedPieces.push(this.monthsShort(mom, ""));
        }
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
          shortPieces[i] = regexEscape(shortPieces[i]);
          longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
          mixedPieces[i] = regexEscape(mixedPieces[i]);
        }
        this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
          "^(" + longPieces.join("|") + ")",
          "i"
        );
        this._monthsShortStrictRegex = new RegExp(
          "^(" + shortPieces.join("|") + ")",
          "i"
        );
      }
      addFormatToken("Y", 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : "+" + y;
      });
      addFormatToken(0, ["YY", 2], 0, function() {
        return this.year() % 100;
      });
      addFormatToken(0, ["YYYY", 4], 0, "year");
      addFormatToken(0, ["YYYYY", 5], 0, "year");
      addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
      addUnitAlias("year", "y");
      addUnitPriority("year", 1);
      addRegexToken("Y", matchSigned);
      addRegexToken("YY", match1to2, match2);
      addRegexToken("YYYY", match1to4, match4);
      addRegexToken("YYYYY", match1to6, match6);
      addRegexToken("YYYYYY", match1to6, match6);
      addParseToken(["YYYYY", "YYYYYY"], YEAR);
      addParseToken("YYYY", function(input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken("YY", function(input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
      });
      addParseToken("Y", function(input, array) {
        array[YEAR] = parseInt(input, 10);
      });
      function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
      }
      hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
      };
      var getSetYear = makeGetSet("FullYear", true);
      function getIsLeapYear() {
        return isLeapYear(this.year());
      }
      function createDate(y, m, d, h, M, s, ms) {
        var date;
        if (y < 100 && y >= 0) {
          date = new Date(y + 400, m, d, h, M, s, ms);
          if (isFinite(date.getFullYear())) {
            date.setFullYear(y);
          }
        } else {
          date = new Date(y, m, d, h, M, s, ms);
        }
        return date;
      }
      function createUTCDate(y) {
        var date, args;
        if (y < 100 && y >= 0) {
          args = Array.prototype.slice.call(arguments);
          args[0] = y + 400;
          date = new Date(Date.UTC.apply(null, args));
          if (isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
          }
        } else {
          date = new Date(Date.UTC.apply(null, arguments));
        }
        return date;
      }
      function firstWeekOffset(year, dow, doy) {
        var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
        return -fwdlw + fwd - 1;
      }
      function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
        if (dayOfYear <= 0) {
          resYear = year - 1;
          resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
          resYear = year + 1;
          resDayOfYear = dayOfYear - daysInYear(year);
        } else {
          resYear = year;
          resDayOfYear = dayOfYear;
        }
        return {
          year: resYear,
          dayOfYear: resDayOfYear
        };
      }
      function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
        if (week < 1) {
          resYear = mom.year() - 1;
          resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
          resWeek = week - weeksInYear(mom.year(), dow, doy);
          resYear = mom.year() + 1;
        } else {
          resYear = mom.year();
          resWeek = week;
        }
        return {
          week: resWeek,
          year: resYear
        };
      }
      function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      }
      addFormatToken("w", ["ww", 2], "wo", "week");
      addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
      addUnitAlias("week", "w");
      addUnitAlias("isoWeek", "W");
      addUnitPriority("week", 5);
      addUnitPriority("isoWeek", 5);
      addRegexToken("w", match1to2);
      addRegexToken("ww", match1to2, match2);
      addRegexToken("W", match1to2);
      addRegexToken("WW", match1to2, match2);
      addWeekParseToken(
        ["w", "ww", "W", "WW"],
        function(input, week, config, token2) {
          week[token2.substr(0, 1)] = toInt(input);
        }
      );
      function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }
      var defaultLocaleWeek = {
        dow: 0,
        doy: 6
      };
      function localeFirstDayOfWeek() {
        return this._week.dow;
      }
      function localeFirstDayOfYear() {
        return this._week.doy;
      }
      function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, "d");
      }
      function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, "d");
      }
      addFormatToken("d", 0, "do", "day");
      addFormatToken("dd", 0, 0, function(format2) {
        return this.localeData().weekdaysMin(this, format2);
      });
      addFormatToken("ddd", 0, 0, function(format2) {
        return this.localeData().weekdaysShort(this, format2);
      });
      addFormatToken("dddd", 0, 0, function(format2) {
        return this.localeData().weekdays(this, format2);
      });
      addFormatToken("e", 0, 0, "weekday");
      addFormatToken("E", 0, 0, "isoWeekday");
      addUnitAlias("day", "d");
      addUnitAlias("weekday", "e");
      addUnitAlias("isoWeekday", "E");
      addUnitPriority("day", 11);
      addUnitPriority("weekday", 11);
      addUnitPriority("isoWeekday", 11);
      addRegexToken("d", match1to2);
      addRegexToken("e", match1to2);
      addRegexToken("E", match1to2);
      addRegexToken("dd", function(isStrict, locale2) {
        return locale2.weekdaysMinRegex(isStrict);
      });
      addRegexToken("ddd", function(isStrict, locale2) {
        return locale2.weekdaysShortRegex(isStrict);
      });
      addRegexToken("dddd", function(isStrict, locale2) {
        return locale2.weekdaysRegex(isStrict);
      });
      addWeekParseToken(["dd", "ddd", "dddd"], function(input, week, config, token2) {
        var weekday = config._locale.weekdaysParse(input, token2, config._strict);
        if (weekday != null) {
          week.d = weekday;
        } else {
          getParsingFlags(config).invalidWeekday = input;
        }
      });
      addWeekParseToken(["d", "e", "E"], function(input, week, config, token2) {
        week[token2] = toInt(input);
      });
      function parseWeekday(input, locale2) {
        if (typeof input !== "string") {
          return input;
        }
        if (!isNaN(input)) {
          return parseInt(input, 10);
        }
        input = locale2.weekdaysParse(input);
        if (typeof input === "number") {
          return input;
        }
        return null;
      }
      function parseIsoWeekday(input, locale2) {
        if (typeof input === "string") {
          return locale2.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
      }
      function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
      }
      var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
      function localeWeekdays(m, format2) {
        var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format2) ? "format" : "standalone"];
        return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
      }
      function localeWeekdaysShort(m) {
        return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
      }
      function localeWeekdaysMin(m) {
        return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
      }
      function handleStrictParse$1(weekdayName, format2, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._minWeekdaysParse = [];
          for (i = 0; i < 7; ++i) {
            mom = createUTC([2e3, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(
              mom,
              ""
            ).toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(
              mom,
              ""
            ).toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if (format2 === "dddd") {
            ii = indexOf.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else if (format2 === "ddd") {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          }
        } else {
          if (format2 === "dddd") {
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else if (format2 === "ddd") {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          }
        }
      }
      function localeWeekdaysParse(weekdayName, format2, strict) {
        var i, mom, regex;
        if (this._weekdaysParseExact) {
          return handleStrictParse$1.call(this, weekdayName, format2, strict);
        }
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._minWeekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._fullWeekdaysParse = [];
        }
        for (i = 0; i < 7; i++) {
          mom = createUTC([2e3, 1]).day(i);
          if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp(
              "^" + this.weekdays(mom, "").replace(".", "\\.?") + "$",
              "i"
            );
            this._shortWeekdaysParse[i] = new RegExp(
              "^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$",
              "i"
            );
            this._minWeekdaysParse[i] = new RegExp(
              "^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$",
              "i"
            );
          }
          if (!this._weekdaysParse[i]) {
            regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
            this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && format2 === "dddd" && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (strict && format2 === "ddd" && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (strict && format2 === "dd" && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
          }
        }
      }
      function getSetDayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
          input = parseWeekday(input, this.localeData());
          return this.add(input - day, "d");
        } else {
          return day;
        }
      }
      function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, "d");
      }
      function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        if (input != null) {
          var weekday = parseIsoWeekday(input, this.localeData());
          return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
          return this.day() || 7;
        }
      }
      function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysStrictRegex;
          } else {
            return this._weekdaysRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            this._weekdaysRegex = defaultWeekdaysRegex;
          }
          return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
      }
      function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysShortStrictRegex;
          } else {
            return this._weekdaysShortRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysShortRegex")) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
          }
          return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
      }
      function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysMinStrictRegex;
          } else {
            return this._weekdaysMinRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysMinRegex")) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
          }
          return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
      }
      function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
          mom = createUTC([2e3, 1]).day(i);
          minp = regexEscape(this.weekdaysMin(mom, ""));
          shortp = regexEscape(this.weekdaysShort(mom, ""));
          longp = regexEscape(this.weekdays(mom, ""));
          minPieces.push(minp);
          shortPieces.push(shortp);
          longPieces.push(longp);
          mixedPieces.push(minp);
          mixedPieces.push(shortp);
          mixedPieces.push(longp);
        }
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp(
          "^(" + longPieces.join("|") + ")",
          "i"
        );
        this._weekdaysShortStrictRegex = new RegExp(
          "^(" + shortPieces.join("|") + ")",
          "i"
        );
        this._weekdaysMinStrictRegex = new RegExp(
          "^(" + minPieces.join("|") + ")",
          "i"
        );
      }
      function hFormat() {
        return this.hours() % 12 || 12;
      }
      function kFormat() {
        return this.hours() || 24;
      }
      addFormatToken("H", ["HH", 2], 0, "hour");
      addFormatToken("h", ["hh", 2], 0, hFormat);
      addFormatToken("k", ["kk", 2], 0, kFormat);
      addFormatToken("hmm", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
      });
      addFormatToken("hmmss", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      addFormatToken("Hmm", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2);
      });
      addFormatToken("Hmmss", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      function meridiem(token2, lowercase) {
        addFormatToken(token2, 0, 0, function() {
          return this.localeData().meridiem(
            this.hours(),
            this.minutes(),
            lowercase
          );
        });
      }
      meridiem("a", true);
      meridiem("A", false);
      addUnitAlias("hour", "h");
      addUnitPriority("hour", 13);
      function matchMeridiem(isStrict, locale2) {
        return locale2._meridiemParse;
      }
      addRegexToken("a", matchMeridiem);
      addRegexToken("A", matchMeridiem);
      addRegexToken("H", match1to2);
      addRegexToken("h", match1to2);
      addRegexToken("k", match1to2);
      addRegexToken("HH", match1to2, match2);
      addRegexToken("hh", match1to2, match2);
      addRegexToken("kk", match1to2, match2);
      addRegexToken("hmm", match3to4);
      addRegexToken("hmmss", match5to6);
      addRegexToken("Hmm", match3to4);
      addRegexToken("Hmmss", match5to6);
      addParseToken(["H", "HH"], HOUR);
      addParseToken(["k", "kk"], function(input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
      });
      addParseToken(["a", "A"], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
      });
      addParseToken(["h", "hh"], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("Hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
      });
      addParseToken("Hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
      });
      function localeIsPM(input) {
        return (input + "").toLowerCase().charAt(0) === "p";
      }
      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
      function localeMeridiem(hours2, minutes2, isLower) {
        if (hours2 > 11) {
          return isLower ? "pm" : "PM";
        } else {
          return isLower ? "am" : "AM";
        }
      }
      var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,
        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,
        week: defaultLocaleWeek,
        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,
        meridiemParse: defaultLocaleMeridiemParse
      };
      var locales = {}, localeFamilies = {}, globalLocale;
      function commonPrefix(arr1, arr2) {
        var i, minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
          if (arr1[i] !== arr2[i]) {
            return i;
          }
        }
        return minl;
      }
      function normalizeLocale(key) {
        return key ? key.toLowerCase().replace("_", "-") : key;
      }
      function chooseLocale(names) {
        var i = 0, j, next, locale2, split;
        while (i < names.length) {
          split = normalizeLocale(names[i]).split("-");
          j = split.length;
          next = normalizeLocale(names[i + 1]);
          next = next ? next.split("-") : null;
          while (j > 0) {
            locale2 = loadLocale(split.slice(0, j).join("-"));
            if (locale2) {
              return locale2;
            }
            if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
              break;
            }
            j--;
          }
          i++;
        }
        return globalLocale;
      }
      function isLocaleNameSane(name) {
        return name.match("^[^/\\\\]*$") != null;
      }
      function loadLocale(name) {
        var oldLocale = null, aliasedRequire;
        if (locales[name] === void 0 && typeof module2 !== "undefined" && module2 && module2.exports && isLocaleNameSane(name)) {
          try {
            oldLocale = globalLocale._abbr;
            aliasedRequire = require;
            aliasedRequire("./locale/" + name);
            getSetGlobalLocale(oldLocale);
          } catch (e) {
            locales[name] = null;
          }
        }
        return locales[name];
      }
      function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
          if (isUndefined(values)) {
            data = getLocale(key);
          } else {
            data = defineLocale(key, values);
          }
          if (data) {
            globalLocale = data;
          } else {
            if (typeof console !== "undefined" && console.warn) {
              console.warn(
                "Locale " + key + " not found. Did you forget to load it?"
              );
            }
          }
        }
        return globalLocale._abbr;
      }
      function defineLocale(name, config) {
        if (config !== null) {
          var locale2, parentConfig = baseConfig;
          config.abbr = name;
          if (locales[name] != null) {
            deprecateSimple(
              "defineLocaleOverride",
              "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
            );
            parentConfig = locales[name]._config;
          } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
              parentConfig = locales[config.parentLocale]._config;
            } else {
              locale2 = loadLocale(config.parentLocale);
              if (locale2 != null) {
                parentConfig = locale2._config;
              } else {
                if (!localeFamilies[config.parentLocale]) {
                  localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                  name,
                  config
                });
                return null;
              }
            }
          }
          locales[name] = new Locale(mergeConfigs(parentConfig, config));
          if (localeFamilies[name]) {
            localeFamilies[name].forEach(function(x) {
              defineLocale(x.name, x.config);
            });
          }
          getSetGlobalLocale(name);
          return locales[name];
        } else {
          delete locales[name];
          return null;
        }
      }
      function updateLocale(name, config) {
        if (config != null) {
          var locale2, tmpLocale, parentConfig = baseConfig;
          if (locales[name] != null && locales[name].parentLocale != null) {
            locales[name].set(mergeConfigs(locales[name]._config, config));
          } else {
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
              parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            if (tmpLocale == null) {
              config.abbr = name;
            }
            locale2 = new Locale(config);
            locale2.parentLocale = locales[name];
            locales[name] = locale2;
          }
          getSetGlobalLocale(name);
        } else {
          if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
              locales[name] = locales[name].parentLocale;
              if (name === getSetGlobalLocale()) {
                getSetGlobalLocale(name);
              }
            } else if (locales[name] != null) {
              delete locales[name];
            }
          }
        }
        return locales[name];
      }
      function getLocale(key) {
        var locale2;
        if (key && key._locale && key._locale._abbr) {
          key = key._locale._abbr;
        }
        if (!key) {
          return globalLocale;
        }
        if (!isArray(key)) {
          locale2 = loadLocale(key);
          if (locale2) {
            return locale2;
          }
          key = [key];
        }
        return chooseLocale(key);
      }
      function listLocales() {
        return keys(locales);
      }
      function checkOverflow(m) {
        var overflow, a = m._a;
        if (a && getParsingFlags(m).overflow === -2) {
          overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
          if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
          }
          if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
          }
          if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
          }
          getParsingFlags(m).overflow = overflow;
        }
        return m;
      }
      var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
        ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
        ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
        ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
        ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
        ["YYYY-DDD", /\d{4}-\d{3}/],
        ["YYYY-MM", /\d{4}-\d\d/, false],
        ["YYYYYYMMDD", /[+-]\d{10}/],
        ["YYYYMMDD", /\d{8}/],
        ["GGGG[W]WWE", /\d{4}W\d{3}/],
        ["GGGG[W]WW", /\d{4}W\d{2}/, false],
        ["YYYYDDD", /\d{7}/],
        ["YYYYMM", /\d{6}/, false],
        ["YYYY", /\d{4}/, false]
      ], isoTimes = [
        ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
        ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
        ["HH:mm:ss", /\d\d:\d\d:\d\d/],
        ["HH:mm", /\d\d:\d\d/],
        ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
        ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
        ["HHmmss", /\d\d\d\d\d\d/],
        ["HHmm", /\d\d\d\d/],
        ["HH", /\d\d/]
      ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
      };
      function configFromISO(config) {
        var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
        if (match) {
          getParsingFlags(config).iso = true;
          for (i = 0, l = isoDatesLen; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
              dateFormat = isoDates[i][0];
              allowTime = isoDates[i][2] !== false;
              break;
            }
          }
          if (dateFormat == null) {
            config._isValid = false;
            return;
          }
          if (match[3]) {
            for (i = 0, l = isoTimesLen; i < l; i++) {
              if (isoTimes[i][1].exec(match[3])) {
                timeFormat = (match[2] || " ") + isoTimes[i][0];
                break;
              }
            }
            if (timeFormat == null) {
              config._isValid = false;
              return;
            }
          }
          if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
          }
          if (match[4]) {
            if (tzRegex.exec(match[4])) {
              tzFormat = "Z";
            } else {
              config._isValid = false;
              return;
            }
          }
          config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
          configFromStringAndFormat(config);
        } else {
          config._isValid = false;
        }
      }
      function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
          untruncateYear(yearStr),
          defaultLocaleMonthsShort.indexOf(monthStr),
          parseInt(dayStr, 10),
          parseInt(hourStr, 10),
          parseInt(minuteStr, 10)
        ];
        if (secondStr) {
          result.push(parseInt(secondStr, 10));
        }
        return result;
      }
      function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
          return 2e3 + year;
        } else if (year <= 999) {
          return 1900 + year;
        }
        return year;
      }
      function preprocessRFC2822(s) {
        return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
      }
      function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
          var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(
            parsedInput[0],
            parsedInput[1],
            parsedInput[2]
          ).getDay();
          if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
          }
        }
        return true;
      }
      function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
          return obsOffsets[obsOffset];
        } else if (militaryOffset) {
          return 0;
        } else {
          var hm = parseInt(numOffset, 10), m = hm % 100, h = (hm - m) / 100;
          return h * 60 + m;
        }
      }
      function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
        if (match) {
          parsedArray = extractFromRFC2822Strings(
            match[4],
            match[3],
            match[2],
            match[5],
            match[6],
            match[7]
          );
          if (!checkWeekday(match[1], parsedArray, config)) {
            return;
          }
          config._a = parsedArray;
          config._tzm = calculateOffset(match[8], match[9], match[10]);
          config._d = createUTCDate.apply(null, config._a);
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          getParsingFlags(config).rfc2822 = true;
        } else {
          config._isValid = false;
        }
      }
      function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
          config._d = new Date(+matched[1]);
          return;
        }
        configFromISO(config);
        if (config._isValid === false) {
          delete config._isValid;
        } else {
          return;
        }
        configFromRFC2822(config);
        if (config._isValid === false) {
          delete config._isValid;
        } else {
          return;
        }
        if (config._strict) {
          config._isValid = false;
        } else {
          hooks.createFromInputFallback(config);
        }
      }
      hooks.createFromInputFallback = deprecate(
        "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
        function(config) {
          config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
        }
      );
      function defaults(a, b, c) {
        if (a != null) {
          return a;
        }
        if (b != null) {
          return b;
        }
        return c;
      }
      function currentDateArray(config) {
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
          return [
            nowValue.getUTCFullYear(),
            nowValue.getUTCMonth(),
            nowValue.getUTCDate()
          ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
      }
      function configFromArray(config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;
        if (config._d) {
          return;
        }
        currentDate = currentDateArray(config);
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
          dayOfYearFromWeekInfo(config);
        }
        if (config._dayOfYear != null) {
          yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
          if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
          }
          date = createUTCDate(yearToUse, 0, config._dayOfYear);
          config._a[MONTH] = date.getUTCMonth();
          config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
          config._a[i] = input[i] = currentDate[i];
        }
        for (; i < 7; i++) {
          config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
        }
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
          config._nextDay = true;
          config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(
          null,
          input
        );
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
        if (config._tzm != null) {
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }
        if (config._nextDay) {
          config._a[HOUR] = 24;
        }
        if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
          getParsingFlags(config).weekdayMismatch = true;
        }
      }
      function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
          dow = 1;
          doy = 4;
          weekYear = defaults(
            w.GG,
            config._a[YEAR],
            weekOfYear(createLocal(), 1, 4).year
          );
          week = defaults(w.W, 1);
          weekday = defaults(w.E, 1);
          if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
          }
        } else {
          dow = config._locale._week.dow;
          doy = config._locale._week.doy;
          curWeek = weekOfYear(createLocal(), dow, doy);
          weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
          week = defaults(w.w, curWeek.week);
          if (w.d != null) {
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
              weekdayOverflow = true;
            }
          } else if (w.e != null) {
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
              weekdayOverflow = true;
            }
          } else {
            weekday = dow;
          }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
          getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
          getParsingFlags(config)._overflowWeekday = true;
        } else {
          temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
          config._a[YEAR] = temp.year;
          config._dayOfYear = temp.dayOfYear;
        }
      }
      hooks.ISO_8601 = function() {
      };
      hooks.RFC_2822 = function() {
      };
      function configFromStringAndFormat(config) {
        if (config._f === hooks.ISO_8601) {
          configFromISO(config);
          return;
        }
        if (config._f === hooks.RFC_2822) {
          configFromRFC2822(config);
          return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;
        var string = "" + config._i, i, parsedInput, tokens2, token2, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
        tokens2 = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens2.length;
        for (i = 0; i < tokenLen; i++) {
          token2 = tokens2[i];
          parsedInput = (string.match(getParseRegexForToken(token2, config)) || [])[0];
          if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
              getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(
              string.indexOf(parsedInput) + parsedInput.length
            );
            totalParsedInputLength += parsedInput.length;
          }
          if (formatTokenFunctions[token2]) {
            if (parsedInput) {
              getParsingFlags(config).empty = false;
            } else {
              getParsingFlags(config).unusedTokens.push(token2);
            }
            addTimeToArrayFromToken(token2, parsedInput, config);
          } else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token2);
          }
        }
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
          getParsingFlags(config).unusedInput.push(string);
        }
        if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
          getParsingFlags(config).bigHour = void 0;
        }
        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        config._a[HOUR] = meridiemFixWrap(
          config._locale,
          config._a[HOUR],
          config._meridiem
        );
        era = getParsingFlags(config).era;
        if (era !== null) {
          config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }
        configFromArray(config);
        checkOverflow(config);
      }
      function meridiemFixWrap(locale2, hour, meridiem2) {
        var isPm;
        if (meridiem2 == null) {
          return hour;
        }
        if (locale2.meridiemHour != null) {
          return locale2.meridiemHour(hour, meridiem2);
        } else if (locale2.isPM != null) {
          isPm = locale2.isPM(meridiem2);
          if (isPm && hour < 12) {
            hour += 12;
          }
          if (!isPm && hour === 12) {
            hour = 0;
          }
          return hour;
        } else {
          return hour;
        }
      }
      function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
        if (configfLen === 0) {
          getParsingFlags(config).invalidFormat = true;
          config._d = new Date(NaN);
          return;
        }
        for (i = 0; i < configfLen; i++) {
          currentScore = 0;
          validFormatFound = false;
          tempConfig = copyConfig({}, config);
          if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
          }
          tempConfig._f = config._f[i];
          configFromStringAndFormat(tempConfig);
          if (isValid(tempConfig)) {
            validFormatFound = true;
          }
          currentScore += getParsingFlags(tempConfig).charsLeftOver;
          currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
          getParsingFlags(tempConfig).score = currentScore;
          if (!bestFormatIsValid) {
            if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
              if (validFormatFound) {
                bestFormatIsValid = true;
              }
            }
          } else {
            if (currentScore < scoreToBeat) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
            }
          }
        }
        extend(config, bestMoment || tempConfig);
      }
      function configFromObject(config) {
        if (config._d) {
          return;
        }
        var i = normalizeObjectUnits(config._i), dayOrDate = i.day === void 0 ? i.date : i.day;
        config._a = map(
          [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
          function(obj) {
            return obj && parseInt(obj, 10);
          }
        );
        configFromArray(config);
      }
      function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
          res.add(1, "d");
          res._nextDay = void 0;
        }
        return res;
      }
      function prepareConfig(config) {
        var input = config._i, format2 = config._f;
        config._locale = config._locale || getLocale(config._l);
        if (input === null || format2 === void 0 && input === "") {
          return createInvalid({ nullInput: true });
        }
        if (typeof input === "string") {
          config._i = input = config._locale.preparse(input);
        }
        if (isMoment(input)) {
          return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
          config._d = input;
        } else if (isArray(format2)) {
          configFromStringAndArray(config);
        } else if (format2) {
          configFromStringAndFormat(config);
        } else {
          configFromInput(config);
        }
        if (!isValid(config)) {
          config._d = null;
        }
        return config;
      }
      function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
          config._d = new Date(hooks.now());
        } else if (isDate(input)) {
          config._d = new Date(input.valueOf());
        } else if (typeof input === "string") {
          configFromString(config);
        } else if (isArray(input)) {
          config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
          });
          configFromArray(config);
        } else if (isObject(input)) {
          configFromObject(config);
        } else if (isNumber(input)) {
          config._d = new Date(input);
        } else {
          hooks.createFromInputFallback(config);
        }
      }
      function createLocalOrUTC(input, format2, locale2, strict, isUTC) {
        var c = {};
        if (format2 === true || format2 === false) {
          strict = format2;
          format2 = void 0;
        }
        if (locale2 === true || locale2 === false) {
          strict = locale2;
          locale2 = void 0;
        }
        if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
          input = void 0;
        }
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale2;
        c._i = input;
        c._f = format2;
        c._strict = strict;
        return createFromConfig(c);
      }
      function createLocal(input, format2, locale2, strict) {
        return createLocalOrUTC(input, format2, locale2, strict, false);
      }
      var prototypeMin = deprecate(
        "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
        function() {
          var other = createLocal.apply(null, arguments);
          if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
          } else {
            return createInvalid();
          }
        }
      ), prototypeMax = deprecate(
        "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
        function() {
          var other = createLocal.apply(null, arguments);
          if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
          } else {
            return createInvalid();
          }
        }
      );
      function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
          moments = moments[0];
        }
        if (!moments.length) {
          return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
          if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
          }
        }
        return res;
      }
      function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isBefore", args);
      }
      function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isAfter", args);
      }
      var now = function() {
        return Date.now ? Date.now() : +new Date();
      };
      var ordering = [
        "year",
        "quarter",
        "month",
        "week",
        "day",
        "hour",
        "minute",
        "second",
        "millisecond"
      ];
      function isDurationValid(m) {
        var key, unitHasDecimal = false, i, orderLen = ordering.length;
        for (key in m) {
          if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
          }
        }
        for (i = 0; i < orderLen; ++i) {
          if (m[ordering[i]]) {
            if (unitHasDecimal) {
              return false;
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
              unitHasDecimal = true;
            }
          }
        }
        return true;
      }
      function isValid$1() {
        return this._isValid;
      }
      function createInvalid$1() {
        return createDuration(NaN);
      }
      function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
        this._isValid = isDurationValid(normalizedInput);
        this._milliseconds = +milliseconds2 + seconds2 * 1e3 + minutes2 * 6e4 + hours2 * 1e3 * 60 * 60;
        this._days = +days2 + weeks2 * 7;
        this._months = +months2 + quarters * 3 + years2 * 12;
        this._data = {};
        this._locale = getLocale();
        this._bubble();
      }
      function isDuration(obj) {
        return obj instanceof Duration;
      }
      function absRound(number) {
        if (number < 0) {
          return Math.round(-1 * number) * -1;
        } else {
          return Math.round(number);
        }
      }
      function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
        for (i = 0; i < len; i++) {
          if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
            diffs++;
          }
        }
        return diffs + lengthDiff;
      }
      function offset(token2, separator) {
        addFormatToken(token2, 0, 0, function() {
          var offset2 = this.utcOffset(), sign2 = "+";
          if (offset2 < 0) {
            offset2 = -offset2;
            sign2 = "-";
          }
          return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
        });
      }
      offset("Z", ":");
      offset("ZZ", "");
      addRegexToken("Z", matchShortOffset);
      addRegexToken("ZZ", matchShortOffset);
      addParseToken(["Z", "ZZ"], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
      });
      var chunkOffset = /([\+\-]|\d\d)/gi;
      function offsetFromString(matcher, string) {
        var matches = (string || "").match(matcher), chunk, parts, minutes2;
        if (matches === null) {
          return null;
        }
        chunk = matches[matches.length - 1] || [];
        parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
        minutes2 = +(parts[1] * 60) + toInt(parts[2]);
        return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
      }
      function cloneWithOffset(input, model) {
        var res, diff2;
        if (model._isUTC) {
          res = model.clone();
          diff2 = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
          res._d.setTime(res._d.valueOf() + diff2);
          hooks.updateOffset(res, false);
          return res;
        } else {
          return createLocal(input).local();
        }
      }
      function getDateOffset(m) {
        return -Math.round(m._d.getTimezoneOffset());
      }
      hooks.updateOffset = function() {
      };
      function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset2 = this._offset || 0, localAdjust;
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        if (input != null) {
          if (typeof input === "string") {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
              return this;
            }
          } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
          }
          if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
          }
          this._offset = input;
          this._isUTC = true;
          if (localAdjust != null) {
            this.add(localAdjust, "m");
          }
          if (offset2 !== input) {
            if (!keepLocalTime || this._changeInProgress) {
              addSubtract(
                this,
                createDuration(input - offset2, "m"),
                1,
                false
              );
            } else if (!this._changeInProgress) {
              this._changeInProgress = true;
              hooks.updateOffset(this, true);
              this._changeInProgress = null;
            }
          }
          return this;
        } else {
          return this._isUTC ? offset2 : getDateOffset(this);
        }
      }
      function getSetZone(input, keepLocalTime) {
        if (input != null) {
          if (typeof input !== "string") {
            input = -input;
          }
          this.utcOffset(input, keepLocalTime);
          return this;
        } else {
          return -this.utcOffset();
        }
      }
      function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
      }
      function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
          this.utcOffset(0, keepLocalTime);
          this._isUTC = false;
          if (keepLocalTime) {
            this.subtract(getDateOffset(this), "m");
          }
        }
        return this;
      }
      function setOffsetToParsedOffset() {
        if (this._tzm != null) {
          this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
          var tZone = offsetFromString(matchOffset, this._i);
          if (tZone != null) {
            this.utcOffset(tZone);
          } else {
            this.utcOffset(0, true);
          }
        }
        return this;
      }
      function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
          return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
      }
      function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
      }
      function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
          return this._isDSTShifted;
        }
        var c = {}, other;
        copyConfig(c, this);
        c = prepareConfig(c);
        if (c._a) {
          other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
          this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
          this._isDSTShifted = false;
        }
        return this._isDSTShifted;
      }
      function isLocal() {
        return this.isValid() ? !this._isUTC : false;
      }
      function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
      }
      function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
      }
      var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
      function createDuration(input, key) {
        var duration = input, match = null, sign2, ret, diffRes;
        if (isDuration(input)) {
          duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
          };
        } else if (isNumber(input) || !isNaN(+input)) {
          duration = {};
          if (key) {
            duration[key] = +input;
          } else {
            duration.milliseconds = +input;
          }
        } else if (match = aspNetRegex.exec(input)) {
          sign2 = match[1] === "-" ? -1 : 1;
          duration = {
            y: 0,
            d: toInt(match[DATE]) * sign2,
            h: toInt(match[HOUR]) * sign2,
            m: toInt(match[MINUTE]) * sign2,
            s: toInt(match[SECOND]) * sign2,
            ms: toInt(absRound(match[MILLISECOND] * 1e3)) * sign2
          };
        } else if (match = isoRegex.exec(input)) {
          sign2 = match[1] === "-" ? -1 : 1;
          duration = {
            y: parseIso(match[2], sign2),
            M: parseIso(match[3], sign2),
            w: parseIso(match[4], sign2),
            d: parseIso(match[5], sign2),
            h: parseIso(match[6], sign2),
            m: parseIso(match[7], sign2),
            s: parseIso(match[8], sign2)
          };
        } else if (duration == null) {
          duration = {};
        } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
          diffRes = momentsDifference(
            createLocal(duration.from),
            createLocal(duration.to)
          );
          duration = {};
          duration.ms = diffRes.milliseconds;
          duration.M = diffRes.months;
        }
        ret = new Duration(duration);
        if (isDuration(input) && hasOwnProp(input, "_locale")) {
          ret._locale = input._locale;
        }
        if (isDuration(input) && hasOwnProp(input, "_isValid")) {
          ret._isValid = input._isValid;
        }
        return ret;
      }
      createDuration.fn = Duration.prototype;
      createDuration.invalid = createInvalid$1;
      function parseIso(inp, sign2) {
        var res = inp && parseFloat(inp.replace(",", "."));
        return (isNaN(res) ? 0 : res) * sign2;
      }
      function positiveMomentsDifference(base, other) {
        var res = {};
        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, "M").isAfter(other)) {
          --res.months;
        }
        res.milliseconds = +other - +base.clone().add(res.months, "M");
        return res;
      }
      function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
          return { milliseconds: 0, months: 0 };
        }
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
          res = positiveMomentsDifference(base, other);
        } else {
          res = positiveMomentsDifference(other, base);
          res.milliseconds = -res.milliseconds;
          res.months = -res.months;
        }
        return res;
      }
      function createAdder(direction, name) {
        return function(val, period) {
          var dur, tmp;
          if (period !== null && !isNaN(+period)) {
            deprecateSimple(
              name,
              "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
            );
            tmp = val;
            val = period;
            period = tmp;
          }
          dur = createDuration(val, period);
          addSubtract(this, dur, direction);
          return this;
        };
      }
      function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
        if (!mom.isValid()) {
          return;
        }
        updateOffset = updateOffset == null ? true : updateOffset;
        if (months2) {
          setMonth(mom, get(mom, "Month") + months2 * isAdding);
        }
        if (days2) {
          set$1(mom, "Date", get(mom, "Date") + days2 * isAdding);
        }
        if (milliseconds2) {
          mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
        }
        if (updateOffset) {
          hooks.updateOffset(mom, days2 || months2);
        }
      }
      var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
      function isString(input) {
        return typeof input === "string" || input instanceof String;
      }
      function isMomentInput(input) {
        return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === void 0;
      }
      function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
          "years",
          "year",
          "y",
          "months",
          "month",
          "M",
          "days",
          "day",
          "d",
          "dates",
          "date",
          "D",
          "hours",
          "hour",
          "h",
          "minutes",
          "minute",
          "m",
          "seconds",
          "second",
          "s",
          "milliseconds",
          "millisecond",
          "ms"
        ], i, property, propertyLen = properties.length;
        for (i = 0; i < propertyLen; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function isNumberOrStringArray(input) {
        var arrayTest = isArray(input), dataTypeTest = false;
        if (arrayTest) {
          dataTypeTest = input.filter(function(item) {
            return !isNumber(item) && isString(input);
          }).length === 0;
        }
        return arrayTest && dataTypeTest;
      }
      function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
          "sameDay",
          "nextDay",
          "lastDay",
          "nextWeek",
          "lastWeek",
          "sameElse"
        ], i, property;
        for (i = 0; i < properties.length; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function getCalendarFormat(myMoment, now2) {
        var diff2 = myMoment.diff(now2, "days", true);
        return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
      }
      function calendar$1(time, formats) {
        if (arguments.length === 1) {
          if (!arguments[0]) {
            time = void 0;
            formats = void 0;
          } else if (isMomentInput(arguments[0])) {
            time = arguments[0];
            formats = void 0;
          } else if (isCalendarSpec(arguments[0])) {
            formats = arguments[0];
            time = void 0;
          }
        }
        var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format2 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format2]) ? formats[format2].call(this, now2) : formats[format2]);
        return this.format(
          output || this.localeData().calendar(format2, this, createLocal(now2))
        );
      }
      function clone() {
        return new Moment(this);
      }
      function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units = normalizeUnits(units) || "millisecond";
        if (units === "millisecond") {
          return this.valueOf() > localInput.valueOf();
        } else {
          return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
      }
      function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units = normalizeUnits(units) || "millisecond";
        if (units === "millisecond") {
          return this.valueOf() < localInput.valueOf();
        } else {
          return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
      }
      function isBetween(from2, to2, units, inclusivity) {
        var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
          return false;
        }
        inclusivity = inclusivity || "()";
        return (inclusivity[0] === "(" ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
      }
      function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input), inputMs;
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units = normalizeUnits(units) || "millisecond";
        if (units === "millisecond") {
          return this.valueOf() === localInput.valueOf();
        } else {
          inputMs = localInput.valueOf();
          return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
      }
      function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
      }
      function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
      }
      function diff(input, units, asFloat) {
        var that, zoneDelta, output;
        if (!this.isValid()) {
          return NaN;
        }
        that = cloneWithOffset(input, this);
        if (!that.isValid()) {
          return NaN;
        }
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
        units = normalizeUnits(units);
        switch (units) {
          case "year":
            output = monthDiff(this, that) / 12;
            break;
          case "month":
            output = monthDiff(this, that);
            break;
          case "quarter":
            output = monthDiff(this, that) / 3;
            break;
          case "second":
            output = (this - that) / 1e3;
            break;
          case "minute":
            output = (this - that) / 6e4;
            break;
          case "hour":
            output = (this - that) / 36e5;
            break;
          case "day":
            output = (this - that - zoneDelta) / 864e5;
            break;
          case "week":
            output = (this - that - zoneDelta) / 6048e5;
            break;
          default:
            output = this - that;
        }
        return asFloat ? output : absFloor(output);
      }
      function monthDiff(a, b) {
        if (a.date() < b.date()) {
          return -monthDiff(b, a);
        }
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
        if (b - anchor < 0) {
          anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
          adjust = (b - anchor) / (anchor - anchor2);
        } else {
          anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
          adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust) || 0;
      }
      hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
      hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
      function toString() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      }
      function toISOString(keepOffset) {
        if (!this.isValid()) {
          return null;
        }
        var utc = keepOffset !== true, m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
          return formatMoment(
            m,
            utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
          );
        }
        if (isFunction(Date.prototype.toISOString)) {
          if (utc) {
            return this.toDate().toISOString();
          } else {
            return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
          }
        }
        return formatMoment(
          m,
          utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
        );
      }
      function inspect() {
        if (!this.isValid()) {
          return "moment.invalid(/* " + this._i + " */)";
        }
        var func = "moment", zone = "", prefix, year, datetime, suffix;
        if (!this.isLocal()) {
          func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
          zone = "Z";
        }
        prefix = "[" + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        datetime = "-MM-DD[T]HH:mm:ss.SSS";
        suffix = zone + '[")]';
        return this.format(prefix + year + datetime + suffix);
      }
      function format(inputString) {
        if (!inputString) {
          inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
      }
      function from(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
          return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
          return this.localeData().invalidDate();
        }
      }
      function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
      }
      function to(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
          return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
          return this.localeData().invalidDate();
        }
      }
      function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
      }
      function locale(key) {
        var newLocaleData;
        if (key === void 0) {
          return this._locale._abbr;
        } else {
          newLocaleData = getLocale(key);
          if (newLocaleData != null) {
            this._locale = newLocaleData;
          }
          return this;
        }
      }
      var lang = deprecate(
        "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
        function(key) {
          if (key === void 0) {
            return this.localeData();
          } else {
            return this.locale(key);
          }
        }
      );
      function localeData() {
        return this._locale;
      }
      var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
      function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
      }
      function localStartOfDate(y, m, d) {
        if (y < 100 && y >= 0) {
          return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
          return new Date(y, m, d).valueOf();
        }
      }
      function utcStartOfDate(y, m, d) {
        if (y < 100 && y >= 0) {
          return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
          return Date.UTC(y, m, d);
        }
      }
      function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === void 0 || units === "millisecond" || !this.isValid()) {
          return this;
        }
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units) {
          case "year":
            time = startOfDate(this.year(), 0, 1);
            break;
          case "quarter":
            time = startOfDate(
              this.year(),
              this.month() - this.month() % 3,
              1
            );
            break;
          case "month":
            time = startOfDate(this.year(), this.month(), 1);
            break;
          case "week":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - this.weekday()
            );
            break;
          case "isoWeek":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - (this.isoWeekday() - 1)
            );
            break;
          case "day":
          case "date":
            time = startOfDate(this.year(), this.month(), this.date());
            break;
          case "hour":
            time = this._d.valueOf();
            time -= mod$1(
              time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
              MS_PER_HOUR
            );
            break;
          case "minute":
            time = this._d.valueOf();
            time -= mod$1(time, MS_PER_MINUTE);
            break;
          case "second":
            time = this._d.valueOf();
            time -= mod$1(time, MS_PER_SECOND);
            break;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === void 0 || units === "millisecond" || !this.isValid()) {
          return this;
        }
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units) {
          case "year":
            time = startOfDate(this.year() + 1, 0, 1) - 1;
            break;
          case "quarter":
            time = startOfDate(
              this.year(),
              this.month() - this.month() % 3 + 3,
              1
            ) - 1;
            break;
          case "month":
            time = startOfDate(this.year(), this.month() + 1, 1) - 1;
            break;
          case "week":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - this.weekday() + 7
            ) - 1;
            break;
          case "isoWeek":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - (this.isoWeekday() - 1) + 7
            ) - 1;
            break;
          case "day":
          case "date":
            time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
            break;
          case "hour":
            time = this._d.valueOf();
            time += MS_PER_HOUR - mod$1(
              time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
              MS_PER_HOUR
            ) - 1;
            break;
          case "minute":
            time = this._d.valueOf();
            time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
            break;
          case "second":
            time = this._d.valueOf();
            time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
            break;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 6e4;
      }
      function unix() {
        return Math.floor(this.valueOf() / 1e3);
      }
      function toDate() {
        return new Date(this.valueOf());
      }
      function toArray() {
        var m = this;
        return [
          m.year(),
          m.month(),
          m.date(),
          m.hour(),
          m.minute(),
          m.second(),
          m.millisecond()
        ];
      }
      function toObject() {
        var m = this;
        return {
          years: m.year(),
          months: m.month(),
          date: m.date(),
          hours: m.hours(),
          minutes: m.minutes(),
          seconds: m.seconds(),
          milliseconds: m.milliseconds()
        };
      }
      function toJSON() {
        return this.isValid() ? this.toISOString() : null;
      }
      function isValid$2() {
        return isValid(this);
      }
      function parsingFlags() {
        return extend({}, getParsingFlags(this));
      }
      function invalidAt() {
        return getParsingFlags(this).overflow;
      }
      function creationData() {
        return {
          input: this._i,
          format: this._f,
          locale: this._locale,
          isUTC: this._isUTC,
          strict: this._strict
        };
      }
      addFormatToken("N", 0, 0, "eraAbbr");
      addFormatToken("NN", 0, 0, "eraAbbr");
      addFormatToken("NNN", 0, 0, "eraAbbr");
      addFormatToken("NNNN", 0, 0, "eraName");
      addFormatToken("NNNNN", 0, 0, "eraNarrow");
      addFormatToken("y", ["y", 1], "yo", "eraYear");
      addFormatToken("y", ["yy", 2], 0, "eraYear");
      addFormatToken("y", ["yyy", 3], 0, "eraYear");
      addFormatToken("y", ["yyyy", 4], 0, "eraYear");
      addRegexToken("N", matchEraAbbr);
      addRegexToken("NN", matchEraAbbr);
      addRegexToken("NNN", matchEraAbbr);
      addRegexToken("NNNN", matchEraName);
      addRegexToken("NNNNN", matchEraNarrow);
      addParseToken(
        ["N", "NN", "NNN", "NNNN", "NNNNN"],
        function(input, array, config, token2) {
          var era = config._locale.erasParse(input, token2, config._strict);
          if (era) {
            getParsingFlags(config).era = era;
          } else {
            getParsingFlags(config).invalidEra = input;
          }
        }
      );
      addRegexToken("y", matchUnsigned);
      addRegexToken("yy", matchUnsigned);
      addRegexToken("yyy", matchUnsigned);
      addRegexToken("yyyy", matchUnsigned);
      addRegexToken("yo", matchEraYearOrdinal);
      addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
      addParseToken(["yo"], function(input, array, config, token2) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
          match = input.match(config._locale._eraYearOrdinalRegex);
        }
        if (config._locale.eraYearOrdinalParse) {
          array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
          array[YEAR] = parseInt(input, 10);
        }
      });
      function localeEras(m, format2) {
        var i, l, date, eras = this._eras || getLocale("en")._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
          switch (typeof eras[i].since) {
            case "string":
              date = hooks(eras[i].since).startOf("day");
              eras[i].since = date.valueOf();
              break;
          }
          switch (typeof eras[i].until) {
            case "undefined":
              eras[i].until = Infinity;
              break;
            case "string":
              date = hooks(eras[i].until).startOf("day").valueOf();
              eras[i].until = date.valueOf();
              break;
          }
        }
        return eras;
      }
      function localeErasParse(eraName, format2, strict) {
        var i, l, eras = this.eras(), name, abbr, narrow;
        eraName = eraName.toUpperCase();
        for (i = 0, l = eras.length; i < l; ++i) {
          name = eras[i].name.toUpperCase();
          abbr = eras[i].abbr.toUpperCase();
          narrow = eras[i].narrow.toUpperCase();
          if (strict) {
            switch (format2) {
              case "N":
              case "NN":
              case "NNN":
                if (abbr === eraName) {
                  return eras[i];
                }
                break;
              case "NNNN":
                if (name === eraName) {
                  return eras[i];
                }
                break;
              case "NNNNN":
                if (narrow === eraName) {
                  return eras[i];
                }
                break;
            }
          } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
            return eras[i];
          }
        }
      }
      function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? 1 : -1;
        if (year === void 0) {
          return hooks(era.since).year();
        } else {
          return hooks(era.since).year() + (year - era.offset) * dir;
        }
      }
      function getEraName() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].name;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].name;
          }
        }
        return "";
      }
      function getEraNarrow() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].narrow;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].narrow;
          }
        }
        return "";
      }
      function getEraAbbr() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].abbr;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].abbr;
          }
        }
        return "";
      }
      function getEraYear() {
        var i, l, dir, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          dir = eras[i].since <= eras[i].until ? 1 : -1;
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
            return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
          }
        }
        return this.year();
      }
      function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, "_erasNameRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
      }
      function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, "_erasAbbrRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
      }
      function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, "_erasNarrowRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
      }
      function matchEraAbbr(isStrict, locale2) {
        return locale2.erasAbbrRegex(isStrict);
      }
      function matchEraName(isStrict, locale2) {
        return locale2.erasNameRegex(isStrict);
      }
      function matchEraNarrow(isStrict, locale2) {
        return locale2.erasNarrowRegex(isStrict);
      }
      function matchEraYearOrdinal(isStrict, locale2) {
        return locale2._eraYearOrdinalRegex || matchUnsigned;
      }
      function computeErasParse() {
        var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, eras = this.eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          namePieces.push(regexEscape(eras[i].name));
          abbrPieces.push(regexEscape(eras[i].abbr));
          narrowPieces.push(regexEscape(eras[i].narrow));
          mixedPieces.push(regexEscape(eras[i].name));
          mixedPieces.push(regexEscape(eras[i].abbr));
          mixedPieces.push(regexEscape(eras[i].narrow));
        }
        this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp(
          "^(" + narrowPieces.join("|") + ")",
          "i"
        );
      }
      addFormatToken(0, ["gg", 2], 0, function() {
        return this.weekYear() % 100;
      });
      addFormatToken(0, ["GG", 2], 0, function() {
        return this.isoWeekYear() % 100;
      });
      function addWeekYearFormatToken(token2, getter) {
        addFormatToken(0, [token2, token2.length], 0, getter);
      }
      addWeekYearFormatToken("gggg", "weekYear");
      addWeekYearFormatToken("ggggg", "weekYear");
      addWeekYearFormatToken("GGGG", "isoWeekYear");
      addWeekYearFormatToken("GGGGG", "isoWeekYear");
      addUnitAlias("weekYear", "gg");
      addUnitAlias("isoWeekYear", "GG");
      addUnitPriority("weekYear", 1);
      addUnitPriority("isoWeekYear", 1);
      addRegexToken("G", matchSigned);
      addRegexToken("g", matchSigned);
      addRegexToken("GG", match1to2, match2);
      addRegexToken("gg", match1to2, match2);
      addRegexToken("GGGG", match1to4, match4);
      addRegexToken("gggg", match1to4, match4);
      addRegexToken("GGGGG", match1to6, match6);
      addRegexToken("ggggg", match1to6, match6);
      addWeekParseToken(
        ["gggg", "ggggg", "GGGG", "GGGGG"],
        function(input, week, config, token2) {
          week[token2.substr(0, 2)] = toInt(input);
        }
      );
      addWeekParseToken(["gg", "GG"], function(input, week, config, token2) {
        week[token2] = hooks.parseTwoDigitYear(input);
      });
      function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
          this,
          input,
          this.week(),
          this.weekday(),
          this.localeData()._week.dow,
          this.localeData()._week.doy
        );
      }
      function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
          this,
          input,
          this.isoWeek(),
          this.isoWeekday(),
          1,
          4
        );
      }
      function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
      }
      function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
      }
      function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }
      function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
      }
      function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
          return weekOfYear(this, dow, doy).year;
        } else {
          weeksTarget = weeksInYear(input, dow, doy);
          if (week > weeksTarget) {
            week = weeksTarget;
          }
          return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
      }
      function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
      }
      addFormatToken("Q", 0, "Qo", "quarter");
      addUnitAlias("quarter", "Q");
      addUnitPriority("quarter", 7);
      addRegexToken("Q", match1);
      addParseToken("Q", function(input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
      });
      function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
      }
      addFormatToken("D", ["DD", 2], "Do", "date");
      addUnitAlias("date", "D");
      addUnitPriority("date", 9);
      addRegexToken("D", match1to2);
      addRegexToken("DD", match1to2, match2);
      addRegexToken("Do", function(isStrict, locale2) {
        return isStrict ? locale2._dayOfMonthOrdinalParse || locale2._ordinalParse : locale2._dayOfMonthOrdinalParseLenient;
      });
      addParseToken(["D", "DD"], DATE);
      addParseToken("Do", function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
      });
      var getSetDayOfMonth = makeGetSet("Date", true);
      addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
      addUnitAlias("dayOfYear", "DDD");
      addUnitPriority("dayOfYear", 4);
      addRegexToken("DDD", match1to3);
      addRegexToken("DDDD", match3);
      addParseToken(["DDD", "DDDD"], function(input, array, config) {
        config._dayOfYear = toInt(input);
      });
      function getSetDayOfYear(input) {
        var dayOfYear = Math.round(
          (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
        ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
      }
      addFormatToken("m", ["mm", 2], 0, "minute");
      addUnitAlias("minute", "m");
      addUnitPriority("minute", 14);
      addRegexToken("m", match1to2);
      addRegexToken("mm", match1to2, match2);
      addParseToken(["m", "mm"], MINUTE);
      var getSetMinute = makeGetSet("Minutes", false);
      addFormatToken("s", ["ss", 2], 0, "second");
      addUnitAlias("second", "s");
      addUnitPriority("second", 15);
      addRegexToken("s", match1to2);
      addRegexToken("ss", match1to2, match2);
      addParseToken(["s", "ss"], SECOND);
      var getSetSecond = makeGetSet("Seconds", false);
      addFormatToken("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
      });
      addFormatToken(0, ["SS", 2], 0, function() {
        return ~~(this.millisecond() / 10);
      });
      addFormatToken(0, ["SSS", 3], 0, "millisecond");
      addFormatToken(0, ["SSSS", 4], 0, function() {
        return this.millisecond() * 10;
      });
      addFormatToken(0, ["SSSSS", 5], 0, function() {
        return this.millisecond() * 100;
      });
      addFormatToken(0, ["SSSSSS", 6], 0, function() {
        return this.millisecond() * 1e3;
      });
      addFormatToken(0, ["SSSSSSS", 7], 0, function() {
        return this.millisecond() * 1e4;
      });
      addFormatToken(0, ["SSSSSSSS", 8], 0, function() {
        return this.millisecond() * 1e5;
      });
      addFormatToken(0, ["SSSSSSSSS", 9], 0, function() {
        return this.millisecond() * 1e6;
      });
      addUnitAlias("millisecond", "ms");
      addUnitPriority("millisecond", 16);
      addRegexToken("S", match1to3, match1);
      addRegexToken("SS", match1to3, match2);
      addRegexToken("SSS", match1to3, match3);
      var token, getSetMillisecond;
      for (token = "SSSS"; token.length <= 9; token += "S") {
        addRegexToken(token, matchUnsigned);
      }
      function parseMs(input, array) {
        array[MILLISECOND] = toInt(("0." + input) * 1e3);
      }
      for (token = "S"; token.length <= 9; token += "S") {
        addParseToken(token, parseMs);
      }
      getSetMillisecond = makeGetSet("Milliseconds", false);
      addFormatToken("z", 0, 0, "zoneAbbr");
      addFormatToken("zz", 0, 0, "zoneName");
      function getZoneAbbr() {
        return this._isUTC ? "UTC" : "";
      }
      function getZoneName() {
        return this._isUTC ? "Coordinated Universal Time" : "";
      }
      var proto = Moment.prototype;
      proto.add = add;
      proto.calendar = calendar$1;
      proto.clone = clone;
      proto.diff = diff;
      proto.endOf = endOf;
      proto.format = format;
      proto.from = from;
      proto.fromNow = fromNow;
      proto.to = to;
      proto.toNow = toNow;
      proto.get = stringGet;
      proto.invalidAt = invalidAt;
      proto.isAfter = isAfter;
      proto.isBefore = isBefore;
      proto.isBetween = isBetween;
      proto.isSame = isSame;
      proto.isSameOrAfter = isSameOrAfter;
      proto.isSameOrBefore = isSameOrBefore;
      proto.isValid = isValid$2;
      proto.lang = lang;
      proto.locale = locale;
      proto.localeData = localeData;
      proto.max = prototypeMax;
      proto.min = prototypeMin;
      proto.parsingFlags = parsingFlags;
      proto.set = stringSet;
      proto.startOf = startOf;
      proto.subtract = subtract;
      proto.toArray = toArray;
      proto.toObject = toObject;
      proto.toDate = toDate;
      proto.toISOString = toISOString;
      proto.inspect = inspect;
      if (typeof Symbol !== "undefined" && Symbol.for != null) {
        proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
          return "Moment<" + this.format() + ">";
        };
      }
      proto.toJSON = toJSON;
      proto.toString = toString;
      proto.unix = unix;
      proto.valueOf = valueOf;
      proto.creationData = creationData;
      proto.eraName = getEraName;
      proto.eraNarrow = getEraNarrow;
      proto.eraAbbr = getEraAbbr;
      proto.eraYear = getEraYear;
      proto.year = getSetYear;
      proto.isLeapYear = getIsLeapYear;
      proto.weekYear = getSetWeekYear;
      proto.isoWeekYear = getSetISOWeekYear;
      proto.quarter = proto.quarters = getSetQuarter;
      proto.month = getSetMonth;
      proto.daysInMonth = getDaysInMonth;
      proto.week = proto.weeks = getSetWeek;
      proto.isoWeek = proto.isoWeeks = getSetISOWeek;
      proto.weeksInYear = getWeeksInYear;
      proto.weeksInWeekYear = getWeeksInWeekYear;
      proto.isoWeeksInYear = getISOWeeksInYear;
      proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
      proto.date = getSetDayOfMonth;
      proto.day = proto.days = getSetDayOfWeek;
      proto.weekday = getSetLocaleDayOfWeek;
      proto.isoWeekday = getSetISODayOfWeek;
      proto.dayOfYear = getSetDayOfYear;
      proto.hour = proto.hours = getSetHour;
      proto.minute = proto.minutes = getSetMinute;
      proto.second = proto.seconds = getSetSecond;
      proto.millisecond = proto.milliseconds = getSetMillisecond;
      proto.utcOffset = getSetOffset;
      proto.utc = setOffsetToUTC;
      proto.local = setOffsetToLocal;
      proto.parseZone = setOffsetToParsedOffset;
      proto.hasAlignedHourOffset = hasAlignedHourOffset;
      proto.isDST = isDaylightSavingTime;
      proto.isLocal = isLocal;
      proto.isUtcOffset = isUtcOffset;
      proto.isUtc = isUtc;
      proto.isUTC = isUtc;
      proto.zoneAbbr = getZoneAbbr;
      proto.zoneName = getZoneName;
      proto.dates = deprecate(
        "dates accessor is deprecated. Use date instead.",
        getSetDayOfMonth
      );
      proto.months = deprecate(
        "months accessor is deprecated. Use month instead",
        getSetMonth
      );
      proto.years = deprecate(
        "years accessor is deprecated. Use year instead",
        getSetYear
      );
      proto.zone = deprecate(
        "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
        getSetZone
      );
      proto.isDSTShifted = deprecate(
        "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
        isDaylightSavingTimeShifted
      );
      function createUnix(input) {
        return createLocal(input * 1e3);
      }
      function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
      }
      function preParsePostFormat(string) {
        return string;
      }
      var proto$1 = Locale.prototype;
      proto$1.calendar = calendar;
      proto$1.longDateFormat = longDateFormat;
      proto$1.invalidDate = invalidDate;
      proto$1.ordinal = ordinal;
      proto$1.preparse = preParsePostFormat;
      proto$1.postformat = preParsePostFormat;
      proto$1.relativeTime = relativeTime;
      proto$1.pastFuture = pastFuture;
      proto$1.set = set;
      proto$1.eras = localeEras;
      proto$1.erasParse = localeErasParse;
      proto$1.erasConvertYear = localeErasConvertYear;
      proto$1.erasAbbrRegex = erasAbbrRegex;
      proto$1.erasNameRegex = erasNameRegex;
      proto$1.erasNarrowRegex = erasNarrowRegex;
      proto$1.months = localeMonths;
      proto$1.monthsShort = localeMonthsShort;
      proto$1.monthsParse = localeMonthsParse;
      proto$1.monthsRegex = monthsRegex;
      proto$1.monthsShortRegex = monthsShortRegex;
      proto$1.week = localeWeek;
      proto$1.firstDayOfYear = localeFirstDayOfYear;
      proto$1.firstDayOfWeek = localeFirstDayOfWeek;
      proto$1.weekdays = localeWeekdays;
      proto$1.weekdaysMin = localeWeekdaysMin;
      proto$1.weekdaysShort = localeWeekdaysShort;
      proto$1.weekdaysParse = localeWeekdaysParse;
      proto$1.weekdaysRegex = weekdaysRegex;
      proto$1.weekdaysShortRegex = weekdaysShortRegex;
      proto$1.weekdaysMinRegex = weekdaysMinRegex;
      proto$1.isPM = localeIsPM;
      proto$1.meridiem = localeMeridiem;
      function get$1(format2, index, field, setter) {
        var locale2 = getLocale(), utc = createUTC().set(setter, index);
        return locale2[field](utc, format2);
      }
      function listMonthsImpl(format2, index, field) {
        if (isNumber(format2)) {
          index = format2;
          format2 = void 0;
        }
        format2 = format2 || "";
        if (index != null) {
          return get$1(format2, index, field, "month");
        }
        var i, out = [];
        for (i = 0; i < 12; i++) {
          out[i] = get$1(format2, i, field, "month");
        }
        return out;
      }
      function listWeekdaysImpl(localeSorted, format2, index, field) {
        if (typeof localeSorted === "boolean") {
          if (isNumber(format2)) {
            index = format2;
            format2 = void 0;
          }
          format2 = format2 || "";
        } else {
          format2 = localeSorted;
          index = format2;
          localeSorted = false;
          if (isNumber(format2)) {
            index = format2;
            format2 = void 0;
          }
          format2 = format2 || "";
        }
        var locale2 = getLocale(), shift = localeSorted ? locale2._week.dow : 0, i, out = [];
        if (index != null) {
          return get$1(format2, (index + shift) % 7, field, "day");
        }
        for (i = 0; i < 7; i++) {
          out[i] = get$1(format2, (i + shift) % 7, field, "day");
        }
        return out;
      }
      function listMonths(format2, index) {
        return listMonthsImpl(format2, index, "months");
      }
      function listMonthsShort(format2, index) {
        return listMonthsImpl(format2, index, "monthsShort");
      }
      function listWeekdays(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdays");
      }
      function listWeekdaysShort(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdaysShort");
      }
      function listWeekdaysMin(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdaysMin");
      }
      getSetGlobalLocale("en", {
        eras: [
          {
            since: "0001-01-01",
            until: Infinity,
            offset: 1,
            name: "Anno Domini",
            narrow: "AD",
            abbr: "AD"
          },
          {
            since: "0000-12-31",
            until: -Infinity,
            offset: 1,
            name: "Before Christ",
            narrow: "BC",
            abbr: "BC"
          }
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
          var b = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        }
      });
      hooks.lang = deprecate(
        "moment.lang is deprecated. Use moment.locale instead.",
        getSetGlobalLocale
      );
      hooks.langData = deprecate(
        "moment.langData is deprecated. Use moment.localeData instead.",
        getLocale
      );
      var mathAbs = Math.abs;
      function abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
      }
      function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
      }
      function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
      }
      function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
      }
      function absCeil(number) {
        if (number < 0) {
          return Math.floor(number);
        } else {
          return Math.ceil(number);
        }
      }
      function bubble() {
        var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
        if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
          milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
          days2 = 0;
          months2 = 0;
        }
        data.milliseconds = milliseconds2 % 1e3;
        seconds2 = absFloor(milliseconds2 / 1e3);
        data.seconds = seconds2 % 60;
        minutes2 = absFloor(seconds2 / 60);
        data.minutes = minutes2 % 60;
        hours2 = absFloor(minutes2 / 60);
        data.hours = hours2 % 24;
        days2 += absFloor(hours2 / 24);
        monthsFromDays = absFloor(daysToMonths(days2));
        months2 += monthsFromDays;
        days2 -= absCeil(monthsToDays(monthsFromDays));
        years2 = absFloor(months2 / 12);
        months2 %= 12;
        data.days = days2;
        data.months = months2;
        data.years = years2;
        return this;
      }
      function daysToMonths(days2) {
        return days2 * 4800 / 146097;
      }
      function monthsToDays(months2) {
        return months2 * 146097 / 4800;
      }
      function as(units) {
        if (!this.isValid()) {
          return NaN;
        }
        var days2, months2, milliseconds2 = this._milliseconds;
        units = normalizeUnits(units);
        if (units === "month" || units === "quarter" || units === "year") {
          days2 = this._days + milliseconds2 / 864e5;
          months2 = this._months + daysToMonths(days2);
          switch (units) {
            case "month":
              return months2;
            case "quarter":
              return months2 / 3;
            case "year":
              return months2 / 12;
          }
        } else {
          days2 = this._days + Math.round(monthsToDays(this._months));
          switch (units) {
            case "week":
              return days2 / 7 + milliseconds2 / 6048e5;
            case "day":
              return days2 + milliseconds2 / 864e5;
            case "hour":
              return days2 * 24 + milliseconds2 / 36e5;
            case "minute":
              return days2 * 1440 + milliseconds2 / 6e4;
            case "second":
              return days2 * 86400 + milliseconds2 / 1e3;
            case "millisecond":
              return Math.floor(days2 * 864e5) + milliseconds2;
            default:
              throw new Error("Unknown unit " + units);
          }
        }
      }
      function valueOf$1() {
        if (!this.isValid()) {
          return NaN;
        }
        return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
      }
      function makeAs(alias) {
        return function() {
          return this.as(alias);
        };
      }
      var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y");
      function clone$1() {
        return createDuration(this);
      }
      function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + "s"]() : NaN;
      }
      function makeGetter(name) {
        return function() {
          return this.isValid() ? this._data[name] : NaN;
        };
      }
      var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
      function weeks() {
        return absFloor(this.days() / 7);
      }
      var round = Math.round, thresholds = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
      };
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale2) {
        return locale2.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }
      function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale2) {
        var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
        if (thresholds2.w != null) {
          a = a || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
        }
        a = a || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale2;
        return substituteTimeAgo.apply(null, a);
      }
      function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === void 0) {
          return round;
        }
        if (typeof roundingFunction === "function") {
          round = roundingFunction;
          return true;
        }
        return false;
      }
      function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === void 0) {
          return false;
        }
        if (limit === void 0) {
          return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === "s") {
          thresholds.ss = limit - 1;
        }
        return true;
      }
      function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        var withSuffix = false, th = thresholds, locale2, output;
        if (typeof argWithSuffix === "object") {
          argThresholds = argWithSuffix;
          argWithSuffix = false;
        }
        if (typeof argWithSuffix === "boolean") {
          withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === "object") {
          th = Object.assign({}, thresholds, argThresholds);
          if (argThresholds.s != null && argThresholds.ss == null) {
            th.ss = argThresholds.s - 1;
          }
        }
        locale2 = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale2);
        if (withSuffix) {
          output = locale2.pastFuture(+this, output);
        }
        return locale2.postformat(output);
      }
      var abs$1 = Math.abs;
      function sign(x) {
        return (x > 0) - (x < 0) || +x;
      }
      function toISOString$1() {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
        if (!total) {
          return "P0D";
        }
        minutes2 = absFloor(seconds2 / 60);
        hours2 = absFloor(minutes2 / 60);
        seconds2 %= 60;
        minutes2 %= 60;
        years2 = absFloor(months2 / 12);
        months2 %= 12;
        s = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
        totalSign = total < 0 ? "-" : "";
        ymSign = sign(this._months) !== sign(total) ? "-" : "";
        daysSign = sign(this._days) !== sign(total) ? "-" : "";
        hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
        return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s + "S" : "");
      }
      var proto$2 = Duration.prototype;
      proto$2.isValid = isValid$1;
      proto$2.abs = abs;
      proto$2.add = add$1;
      proto$2.subtract = subtract$1;
      proto$2.as = as;
      proto$2.asMilliseconds = asMilliseconds;
      proto$2.asSeconds = asSeconds;
      proto$2.asMinutes = asMinutes;
      proto$2.asHours = asHours;
      proto$2.asDays = asDays;
      proto$2.asWeeks = asWeeks;
      proto$2.asMonths = asMonths;
      proto$2.asQuarters = asQuarters;
      proto$2.asYears = asYears;
      proto$2.valueOf = valueOf$1;
      proto$2._bubble = bubble;
      proto$2.clone = clone$1;
      proto$2.get = get$2;
      proto$2.milliseconds = milliseconds;
      proto$2.seconds = seconds;
      proto$2.minutes = minutes;
      proto$2.hours = hours;
      proto$2.days = days;
      proto$2.weeks = weeks;
      proto$2.months = months;
      proto$2.years = years;
      proto$2.humanize = humanize;
      proto$2.toISOString = toISOString$1;
      proto$2.toString = toISOString$1;
      proto$2.toJSON = toISOString$1;
      proto$2.locale = locale;
      proto$2.localeData = localeData;
      proto$2.toIsoString = deprecate(
        "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
        toISOString$1
      );
      proto$2.lang = lang;
      addFormatToken("X", 0, 0, "unix");
      addFormatToken("x", 0, 0, "valueOf");
      addRegexToken("x", matchSigned);
      addRegexToken("X", matchTimestamp);
      addParseToken("X", function(input, array, config) {
        config._d = new Date(parseFloat(input) * 1e3);
      });
      addParseToken("x", function(input, array, config) {
        config._d = new Date(toInt(input));
      });
      hooks.version = "2.29.4";
      setHookCallback(createLocal);
      hooks.fn = proto;
      hooks.min = min;
      hooks.max = max;
      hooks.now = now;
      hooks.utc = createUTC;
      hooks.unix = createUnix;
      hooks.months = listMonths;
      hooks.isDate = isDate;
      hooks.locale = getSetGlobalLocale;
      hooks.invalid = createInvalid;
      hooks.duration = createDuration;
      hooks.isMoment = isMoment;
      hooks.weekdays = listWeekdays;
      hooks.parseZone = createInZone;
      hooks.localeData = getLocale;
      hooks.isDuration = isDuration;
      hooks.monthsShort = listMonthsShort;
      hooks.weekdaysMin = listWeekdaysMin;
      hooks.defineLocale = defineLocale;
      hooks.updateLocale = updateLocale;
      hooks.locales = listLocales;
      hooks.weekdaysShort = listWeekdaysShort;
      hooks.normalizeUnits = normalizeUnits;
      hooks.relativeTimeRounding = getSetRelativeTimeRounding;
      hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
      hooks.calendarFormat = getCalendarFormat;
      hooks.prototype = proto;
      hooks.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "GGGG-[W]WW",
        MONTH: "YYYY-MM"
      };
      return hooks;
    });
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _log(message) {
      console.log(`[dotenv][DEBUG] ${message}`);
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function config(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else {
            if (override === true) {
              process.env[key] = parsed[key];
            }
            if (debug) {
              if (override === true) {
                _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`);
              } else {
                _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`);
              }
            }
          }
        });
        return { parsed };
      } catch (e) {
        if (debug) {
          _log(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    var DotenvModule = {
      config,
      parse
    };
    module2.exports.config = DotenvModule.config;
    module2.exports.parse = DotenvModule.parse;
    module2.exports = DotenvModule;
  }
});

// plugins/shell-plugin.js
var import_fs2 = require("fs");
var import_os3 = require("os");
var import_child_process = require("child_process");
var import_path = require("path");

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
var MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];
var DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var getDateArgs = function(thingy) {
  if (!thingy)
    thingy = new Date();
  let date = typeof thingy == "object" ? thingy : new Date(typeof thingy == "number" ? thingy * 1e3 : thingy);
  let args = {
    epoch: Math.floor(date.getTime() / 1e3),
    year: date.getFullYear(),
    mon: date.getMonth() + 1,
    mday: date.getDate(),
    wday: date.getDay(),
    hour: date.getHours(),
    min: date.getMinutes(),
    sec: date.getSeconds(),
    msec: date.getMilliseconds(),
    offset: 0 - date.getTimezoneOffset() / 60
  };
  args.yyyy = "" + args.year;
  args.yy = args.year % 100;
  if (args.yy < 10)
    args.yy = "0" + args.yy;
  else
    args.yy = "" + args.yy;
  if (args.mon < 10)
    args.mm = "0" + args.mon;
  else
    args.mm = "" + args.mon;
  if (args.mday < 10)
    args.dd = "0" + args.mday;
  else
    args.dd = "" + args.mday;
  if (args.hour < 10)
    args.hh = "0" + args.hour;
  else
    args.hh = "" + args.hour;
  if (args.min < 10)
    args.mi = "0" + args.min;
  else
    args.mi = "" + args.min;
  if (args.sec < 10)
    args.ss = "0" + args.sec;
  else
    args.ss = "" + args.sec;
  if (args.hour >= 12) {
    args.ampm = "pm";
    args.hour12 = args.hour - 12;
    if (!args.hour12)
      args.hour12 = 12;
  } else {
    args.ampm = "am";
    args.hour12 = args.hour;
    if (!args.hour12)
      args.hour12 = 12;
  }
  args.AMPM = args.ampm.toUpperCase();
  args.yyyy_mm_dd = args.yyyy + "/" + args.mm + "/" + args.dd;
  args.hh_mi_ss = args.hh + ":" + args.mi + ":" + args.ss;
  args.tz = "GMT" + (args.offset >= 0 ? "+" : "") + args.offset;
  args.mmm = SHORT_MONTH_NAMES[args.mon - 1];
  args.mmmm = MONTH_NAMES[args.mon - 1];
  args.ddd = SHORT_DAY_NAMES[args.wday];
  args.dddd = DAY_NAMES[args.wday];
  return args;
};
var ucfirst = function(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
};
var getErrorDescription = function(err) {
  let msg = err.message;
  if (err.errno && import_errno.code[err.errno]) {
    msg = ucfirst(import_errno.code[err.errno].description) + " (" + err.message + ")";
  } else if (err.code && import_errno.code[err.code]) {
    msg = ucfirst(import_errno.code[err.code].description) + " (" + err.message + ")";
  }
  return msg;
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

// plugins/shell-plugin.js
var import_moment = __toESM(require_moment());
if (process.env["ENV_FILE"]) {
  try {
    require_main().config({ path: process.env["ENV_FILE"] });
  } catch {
  }
}
var start = (0, import_moment.default)();
process.stdin.setEncoding("utf8");
process.stdout.setEncoding("utf8");
var stream = new JSONStream(process.stdin, process.stdout);
stream.on("json", function(job) {
  let script_file = (0, import_path.join)((0, import_os3.tmpdir)(), "cronicle-script-temp-" + job.id + ".sh");
  (0, import_fs2.writeFileSync)(script_file, job.params.script, { mode: "775" });
  if (Array.isArray(job.files)) {
    job.files.forEach((e) => {
      if (e.name) {
        process.env["files/" + e.name] = e.content || "";
        process.env["FILE_" + String(e.name).toUpperCase().replace(/\./g, "_")] = e.content || "";
      }
    });
  }
  if (job.tty)
    process.env["TERM"] = "xterm";
  let child_exec = job.tty ? "/usr/bin/script" : script_file;
  let child_args = job.tty ? ["-qec", script_file, "--flush", "/dev/null"] : [];
  const child = (0, import_child_process.spawn)(child_exec, child_args, { stdio: ["pipe", "pipe", "pipe"] });
  let kill_timer = null;
  let stderr_buffer = "";
  let sent_html = false;
  const cstream = job.tty ? new JSONStream(child.stdout) : new JSONStream(child.stdout, child.stdin);
  cstream.recordRegExp = /^\s*\{.+\}\s*$/;
  cstream.on("json", function(data) {
    if (job.params.json) {
      stream.write(data);
      if (data.html)
        sent_html = true;
    } else
      cstream.emit("text", JSON.stringify(data) + "\n");
  });
  cstream.on("text", function(line) {
    if (line.match(/^\s*(\d+)\%\s*$/)) {
      let progress = Math.max(0, Math.min(100, parseInt(RegExp.$1))) / 100;
      stream.write({
        progress
      });
    } else if (line.match(/^\s*\#(.{1,60})\#\s*$/)) {
      let memoText = RegExp.$1;
      stream.write({
        memo: memoText
      });
      if (job.params.logmemo) {
        let dint = (0, import_moment.default)().diff(start) > 999e3 ? "m" : "s";
        let diff = String((0, import_moment.default)().diff(start, dint)).padStart(2, " ");
        start = (0, import_moment.default)();
        console.log(`[${start.format("yyyy-MM-DD HH:mm:ss")}][${diff}${dint}]: ${memoText}`);
      }
    } else {
      if (job.params.annotate) {
        let dargs = getDateArgs(new Date());
        line = "[" + dargs.yyyy_mm_dd + " " + dargs.hh_mi_ss + "] " + line;
      }
      (0, import_fs2.appendFileSync)(job.log_file, line);
    }
  });
  cstream.on("error", function(err, text) {
    if (text)
      (0, import_fs2.appendFileSync)(job.log_file, text + "\n");
  });
  child.on("error", function(err) {
    stream.write({
      complete: 1,
      code: 1,
      description: "Script failed: " + getErrorDescription(err)
    });
    (0, import_fs2.unlink)(script_file, function(err2) {
      ;
    });
  });
  child.on("exit", function(code2, signal) {
    if (kill_timer)
      clearTimeout(kill_timer);
    code2 = code2 || signal || 0;
    let data = {
      complete: 1,
      code: code2,
      description: code2 ? "Script exited with code: " + code2 : ""
    };
    if (stderr_buffer.length && stderr_buffer.match(/\S/)) {
      if (!sent_html)
        data.html = {
          title: "Error Output",
          content: "<pre>" + stderr_buffer.replace(/</g, "&lt;").trim() + "</pre>"
        };
      if (code2) {
        let stderr_line = stderr_buffer.trim().split(/\n/).shift();
        if (stderr_line.length < 256)
          data.description += ": " + stderr_line;
      }
    }
    stream.write(data);
    (0, import_fs2.unlink)(script_file, function(err) {
      ;
    });
  });
  child.stdin.on("error", function(err) {
  });
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", function(data) {
    if (stderr_buffer.length < 32768)
      stderr_buffer += data;
    else if (!stderr_buffer.match(/\.\.\.$/))
      stderr_buffer += "...";
    (0, import_fs2.appendFileSync)(job.log_file, data);
  });
  cstream.write(job);
  child.stdin.end();
  process.on("SIGTERM", function() {
    console.log("Caught SIGTERM, killing child: " + child.pid);
    kill_timer = setTimeout(function() {
      console.log("Child did not exit, killing harder: " + child.pid);
      child.kill("SIGKILL");
    }, 9 * 1e3);
    child.kill("SIGTERM");
  });
});
/*!
  * prr
  * (c) 2013 Rod Vagg <rod@vagg.org>
  * https://github.com/rvagg/prr
  * License: MIT
  */
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! moment.js
//! momentjs.com
//! version : 2.29.4
