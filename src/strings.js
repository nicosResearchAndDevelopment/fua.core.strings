const strings = exports;

strings.xsd = require('./strings.xsd.js');
strings.opc = require('./strings.opc.js');
strings.web = require('./strings.web.js');

/**
 * @param {string | Buffer} value
 * @param {BufferEncoding | 'buffer'} [sourceEncoding='utf8']
 * @param {BufferEncoding | 'buffer'} [targetEncoding='utf8']
 * @returns {string | Buffer}
 */
strings.convert = function (value, sourceEncoding, targetEncoding) {
    sourceEncoding ??= Buffer.isBuffer(value) ? 'buffer' : 'utf8';
    targetEncoding ??= 'utf8';
    if (sourceEncoding === 'buffer' ? !Buffer.isBuffer(value) : typeof value !== 'string') throw new Error('invalid value');
    const buffer = sourceEncoding === 'buffer' ? value : Buffer.from(value, sourceEncoding);
    return targetEncoding === 'buffer' ? buffer : buffer.toString(targetEncoding);
};

/**
 * @param {string} value
 * @param {string} [flags]
 * @returns {RegExp}
 */
strings.toRegExp = function (value, flags) {
    const unsafeChars = /[./\\+*?([{|^$]/g;
    return new RegExp(value.replace(unsafeChars, '\\$&'), flags);
};

(function freeze(target) {
    Object.freeze(target);
    Object.values(target)
        .filter(value => value instanceof Object)
        .forEach(freeze);
})(strings);
module.exports = strings;
