// import StackTrace from "stacktrace-js";
// import StackTraceGPS from "stacktrace-gps";
import ErrorStackParser from "error-stack-parser";
import StackGenerator from "stack-generator";
import { Gps } from "./gps";
import StackFrame from "stackframe";

var _options = {
  filter: function (stackframe: any) {
    // Filter out stackframes for this library by default
    return (
      (stackframe.functionName || "").indexOf("StackTrace$$") === -1 &&
      (stackframe.functionName || "").indexOf("ErrorStackParser$$") === -1 &&
      (stackframe.functionName || "").indexOf("StackTraceGPS$$") === -1 &&
      (stackframe.functionName || "").indexOf("StackGenerator$$") === -1
    );
  },
  sourceCache: {},
};

var _generateError = function StackTrace$$GenerateError() {
  try {
    // Error must be thrown to get stack in IE
    throw new Error();
  } catch (err) {
    return err;
  }
};

/**
 * Merge 2 given Objects. If a conflict occurs the second object wins.
 * Does not do deep merges.
 *
 * @param {Object} first base object
 * @param {Object} second overrides
 * @returns {Object} merged first and second
 * @private
 */
function _merge(first: any, second: any) {
  var target: any = {};

  [first, second].forEach(function (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        target[prop] = obj[prop];
      }
    }
    return target;
  });

  return target;
}

function _isShapedLikeParsableError(err: any) {
  return err.stack || err["opera#sourceloc"];
}

function _filtered(stackframes: any, filter: any) {
  if (typeof filter === "function") {
    return stackframes.filter(filter);
  }
  return stackframes;
}

export class Trace {
  resolve: () => Promise<unknown>;
  promise?: Promise<unknown>;

  constructor(resolve: () => Promise<unknown>) {
    this.resolve = resolve;
  }

  value(): Promise<StackFrame[]> {
    this.promise ??= this.resolve();
    return this.promise as any;
  }
}

export class StaTrace {
  get(opts?: any) {
    var err = _generateError();
    const trace = new Trace(async () => {
      return _isShapedLikeParsableError(err)
        ? this.fromError(err, opts)
        : this.generateArtificially(opts);
    });
    return trace;
  }

  /**
   * Get a backtrace from invocation point.
   * IMPORTANT: Does not handle source maps or guess function names!
   *
   * @param {Object} opts
   * @returns {Array} of StackFrame
   */
  getSync(opts: any) {
    opts = _merge(_options, opts);
    var err: any = _generateError();
    var stack = _isShapedLikeParsableError(err)
      ? ErrorStackParser.parse(err)
      : StackGenerator.backtrace(opts);
    return _filtered(stack, opts.filter);
  }

  /**
   * Given an error object, parse it.
   *
   * @param {Error} error object
   * @param {Object} opts
   * @returns {Promise} for Array[StackFrame}
   */
  fromError(error: any, opts?: any) {
    opts = _merge(_options, opts);
    var gps = new Gps(opts);
    return new Promise((resolve) => {
      var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
      resolve(
        Promise.all(
          stackframes.map(function (sf: any) {
            return new Promise(function (resolve) {
              function resolveOriginal() {
                resolve(sf);
              }

              gps
                .pinpoint(sf)
                .then(resolve, resolveOriginal)
                ["catch"](resolveOriginal);
            });
          })
        )
      );
    });
  }

  /**
   * Use StackGenerator to generate a backtrace.
   *
   * @param {Object} opts
   * @returns {Promise} of Array[StackFrame]
   */
  generateArtificially(opts: any) {
    opts = _merge(_options, opts);
    var stackFrames = StackGenerator.backtrace(opts);
    if (typeof opts.filter === "function") {
      stackFrames = stackFrames.filter(opts.filter);
    }
    return Promise.resolve(stackFrames);
  }

  /**
   * Given a function, wrap it such that invocations trigger a callback that
   * is called with a stack trace.
   *
   * @param {Function} fn to be instrumented
   * @param {Function} callback function to call with a stack trace on invocation
   * @param {Function} errback optional function to call with error if unable to get stack trace.
   * @param {Object} thisArg optional context object (e.g. window)
   */
  instrument(fn: any, callback: any, errback: any, thisArg: any) {
    if (typeof fn !== "function") {
      throw new Error("Cannot instrument non-function object");
    } else if (typeof fn.__stacktraceOriginalFn === "function") {
      // Already instrumented, return given Function
      return fn;
    }

    var instrumented = () => {
      try {
        // @ts-ignore
        this.get().then(callback, errback)["catch"](errback);
        // @ts-ignore
        return fn.apply(thisArg || this, arguments);
      } catch (e) {
        if (_isShapedLikeParsableError(e)) {
          this.fromError(e).then(callback, errback)["catch"](errback);
        }
        throw e;
      }
    };
    // @ts-ignore
    instrumented.__stacktraceOriginalFn = fn;

    return instrumented;
  }

  /**
   * Given a function that has been instrumented,
   * revert the function to it's original (non-instrumented) state.
   *
   * @param {Function} fn to de-instrument
   */
  deinstrument(fn: any) {
    if (typeof fn !== "function") {
      throw new Error("Cannot de-instrument non-function object");
    } else if (typeof fn.__stacktraceOriginalFn === "function") {
      return fn.__stacktraceOriginalFn;
    } else {
      // Function not instrumented, return original
      return fn;
    }
  }

  /**
   * Given an error message and Array of StackFrames, serialize and POST to given URL.
   *
   * @param {Array} stackframes
   * @param {String} url
   * @param {String} errorMsg
   * @param {Object} requestOptions
   */
  report(stackframes: any, url: any, errorMsg: any, requestOptions: any) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.onerror = reject;
      req.onreadystatechange = function onreadystatechange() {
        if (req.readyState === 4) {
          if (req.status >= 200 && req.status < 400) {
            resolve(req.responseText);
          } else {
            reject(
              new Error("POST to " + url + " failed with status: " + req.status)
            );
          }
        }
      };
      req.open("post", url);

      // Set request headers
      req.setRequestHeader("Content-Type", "application/json");
      if (requestOptions && typeof requestOptions.headers === "object") {
        var headers = requestOptions.headers;
        for (var header in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, header)) {
            req.setRequestHeader(header, headers[header]);
          }
        }
      }

      var reportPayload: any = { stack: stackframes };
      if (errorMsg !== undefined && errorMsg !== null) {
        reportPayload.message = errorMsg;
      }

      req.send(JSON.stringify(reportPayload));
    });
  }
}
