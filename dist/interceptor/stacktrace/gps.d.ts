export declare class Gps {
    opts: any;
    sourceCache: any;
    sourceMapConsumerCache: any;
    ajax: any;
    _atob: any;
    constructor(opts: any);
    _get(location: any): Promise<unknown>;
    /**
     * Creating SourceMapConsumers is expensive, so this wraps the creation of a
     * SourceMapConsumer in a per-instance cache.
     *
     * @param {String} sourceMappingURL = URL to fetch source map from
     * @param {String} defaultSourceRoot = Default source root for source map if undefined
     * @returns {Promise} that resolves a SourceMapConsumer
     */
    _getSourceMapConsumer(sourceMappingURL: any, defaultSourceRoot: any): Promise<unknown>;
    /**
     * Given a StackFrame, enhance function name and use source maps for a
     * better StackFrame.
     *
     * @param {StackFrame} stackframe object
     * @returns {Promise} that resolves with with source-mapped StackFrame
     */
    pinpoint(stackframe: any): Promise<unknown>;
    /**
     * Given a StackFrame, guess function name from location information.
     *
     * @param {StackFrame} stackframe
     * @returns {Promise} that resolves with enhanced StackFrame.
     */
    findFunctionName(stackframe: any): Promise<unknown>;
    /**
     * Given a StackFrame, seek source-mapped location and return new enhanced StackFrame.
     *
     * @param {StackFrame} stackframe
     * @returns {Promise} that resolves with enhanced StackFrame.
     */
    getMappedLocation(stackframe: any): Promise<unknown>;
}
