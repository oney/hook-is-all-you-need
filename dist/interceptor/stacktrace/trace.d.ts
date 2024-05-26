import ErrorStackParser from "error-stack-parser";
import StackFrame from "stackframe";
export declare class Trace {
    resolve: () => Promise<unknown>;
    promise?: Promise<unknown>;
    constructor(resolve: () => Promise<unknown>);
    value(): Promise<StackFrame[]>;
}
export declare class StaTrace {
    get(opts?: any): Trace;
    /**
     * Get a backtrace from invocation point.
     * IMPORTANT: Does not handle source maps or guess function names!
     *
     * @param {Object} opts
     * @returns {Array} of StackFrame
     */
    getSync(opts: any): any;
    /**
     * Given an error object, parse it.
     *
     * @param {Error} error object
     * @param {Object} opts
     * @returns {Promise} for Array[StackFrame}
     */
    fromError(error: any, opts?: any): Promise<unknown>;
    /**
     * Use StackGenerator to generate a backtrace.
     *
     * @param {Object} opts
     * @returns {Promise} of Array[StackFrame]
     */
    generateArtificially(opts: any): Promise<ErrorStackParser.StackFrame[]>;
    /**
     * Given a function, wrap it such that invocations trigger a callback that
     * is called with a stack trace.
     *
     * @param {Function} fn to be instrumented
     * @param {Function} callback function to call with a stack trace on invocation
     * @param {Function} errback optional function to call with error if unable to get stack trace.
     * @param {Object} thisArg optional context object (e.g. window)
     */
    instrument(fn: any, callback: any, errback: any, thisArg: any): any;
    /**
     * Given a function that has been instrumented,
     * revert the function to it's original (non-instrumented) state.
     *
     * @param {Function} fn to de-instrument
     */
    deinstrument(fn: any): any;
    /**
     * Given an error message and Array of StackFrames, serialize and POST to given URL.
     *
     * @param {Array} stackframes
     * @param {String} url
     * @param {String} errorMsg
     * @param {Object} requestOptions
     */
    report(stackframes: any, url: any, errorMsg: any, requestOptions: any): Promise<unknown>;
}
