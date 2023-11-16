const xsd = exports;

xsd.decimal = {
    pattern: /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/,
    matcher: /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.decimal.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     sign: string,
     *     integer: string,
     *     fraction: string
     * }}
     */
    match(value) {
        const [match, sign, integer, fraction, fraction_2] = xsd.decimal.matcher.exec(value) || [];
        if (match) return {
            sign:     sign || '+',
            integer:  (integer || '').replace(/^0+/, '') || '0',
            fraction: (fraction || fraction_2 || '').replace(/0+$/, '') || '0'
        };
    },
    /**
     * @param {string} value
     * @returns {number}
     */
    parse(value) {
        const match = xsd.decimal.match(value);
        if (match) return Number(match.sign + match.integer + '.' + match.fraction);
    }
};

xsd.integer = {
    pattern: /^[+-]?\d+$/,
    matcher: /^([+-]?)(\d+)$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.integer.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     sign: string,
     *     integer: string
     * }}
     */
    match(value) {
        const [match, sign, integer] = xsd.integer.matcher.exec(value) || [];
        if (match) return {
            sign:    sign || '+',
            integer: (integer || '').replace(/^0+/, '') || '0'
        };
    },
    /**
     * @param {string} value
     * @returns {number}
     */
    parse(value) {
        const match = xsd.integer.match(value);
        if (match) return Number(match.sign + match.integer);
    }
};

xsd.float = {
    pattern: /^NaN|[+-]?(?:INF|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/,
    matcher: /^(NaN)|([+-]?)(?:(INF)|(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?)(\d+))?)$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.float.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     sign: string,
     *     base: string,
     *     exp_sign: string,
     *     exponent: string
     * }}
     */
    match(value) {
        const [match, nan_tag, sign, inf_tag, base, exp_sign, exponent] = xsd.float.matcher.exec(value) || [];
        if (match) return {
            nan_tag,
            inf_tag,
            sign:     sign || '+',
            base:     (base || '').replace(/^0+/, '') || '0',
            exp_sign: exp_sign || '+',
            exponent: (exponent || '').replace(/^0+/, '') || '0'
        };
    },
    /**
     * @param {string} value
     * @returns {number}
     */
    parse(value) {
        const match = xsd.float.match(value);
        if (match) return match.nan_tag ? NaN : Number(match.sign + (match.inf_tag ? 'Infinity' : match.base + 'e' + match.exp_sign + match.exponent));
    }
};

xsd.date = {
    pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^(-?[1-9][0-9]*)-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.date.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     YYYY: string,
     *     MM: string,
     *     DD: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, YYYY, MM, DD, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.date.matcher.exec(value) || [];
        if (match) return {YYYY, MM, DD, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     year: number,
     *     month: number,
     *     day: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.date.match(value);
        if (match) {
            const result = {
                year:  parseInt(match.YYYY),
                month: parseInt(match.MM),
                day:   parseInt(match.DD)
            };
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        matcher: /^(-?[1-9][0-9]*)-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.date.timeZone.pattern.test(value);
        }
    }
};

xsd.time = {
    pattern: /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9](?:\.[0-9]+)?)(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.time.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     hh: string,
     *     mm: string,
     *     ss_ms: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, hh, mm, ss_ms, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.time.matcher.exec(value) || [];
        if (match) return {hh, mm, ss_ms, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     hour: number,
     *     minute: number,
     *     second: number,
     *     millisecond: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.time.match(value);
        if (match) {
            const result       = {
                hour:   parseInt(match.hh),
                minute: parseInt(match.mm),
                second: parseInt(match.ss_ms)
            };
            result.millisecond = Math.round(1000 * (parseFloat(match.ss_ms) - result.second));
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.time.timeZone.pattern.test(value);
        }
    }
};

xsd.dateTime = {
    pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])T(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^(-?[1-9][0-9]*)-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9](?:\.[0-9]+)?)(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.dateTime.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     YYYY: string,
     *     MM: string,
     *     DD: string,
     *     hh: string,
     *     mm: string,
     *     ss_ms: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, YYYY, MM, DD, hh, mm, ss_ms, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.dateTime.matcher.exec(value) || [];
        if (match) return {YYYY, MM, DD, hh, mm, ss_ms, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     year: number,
     *     month: number,
     *     day: number,
     *     hour: number,
     *     minute: number,
     *     second: number,
     *     millisecond: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.dateTime.match(value);
        if (match) {
            const result       = {
                year:   parseInt(match.YYYY),
                month:  parseInt(match.MM),
                day:    parseInt(match.DD),
                hour:   parseInt(match.hh),
                minute: parseInt(match.mm),
                second: parseInt(match.ss_ms)
            };
            result.millisecond = Math.round(1000 * (parseFloat(match.ss_ms) - result.second));
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])T(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.dateTime.timeZone.pattern.test(value);
        }
    }
};

xsd.dateTimeStamp = {
    pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])T(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?Z$/,
    matcher: /^(-?[1-9][0-9]*)-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9](?:\.[0-9]+)?)Z$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.dateTimeStamp.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     YYYY: string,
     *     MM: string,
     *     DD: string,
     *     hh: string,
     *     mm: string,
     *     ss_ms: string
     * }}
     */
    match(value) {
        const [match, YYYY, MM, DD, hh, mm, ss_ms] = xsd.dateTimeStamp._matcher.exec(value) || [];
        if (match) return {YYYY, MM, DD, hh, mm, ss_ms};
    },
    /**
     * @param {string} value
     * @returns {{
     *     year: number,
     *     month: number,
     *     day: number,
     *     hour: number,
     *     minute: number,
     *     second: number,
     *     millisecond: number
     * }}
     */
    parse(value) {
        const match = xsd.dateTimeStamp.match(value);
        if (match) {
            const result       = {
                year:   parseInt(match.YYYY),
                month:  parseInt(match.MM),
                day:    parseInt(match.DD),
                hour:   parseInt(match.hh),
                minute: parseInt(match.mm),
                second: parseInt(match.ss_ms)
            };
            result.millisecond = Math.round(1000 * (parseFloat(match.ss_ms) - result.second));
            return result;
        }
    }
};

xsd.gYear = {
    pattern: /^-?[1-9][0-9]*(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^(-?[1-9][0-9]*)(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.gYear.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     YYYY: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, YYYY, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.gYear.matcher.exec(value) || [];
        if (match) return {YYYY, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     year: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.gYear.match(value);
        if (match) {
            const result = {
                year: parseInt(match.YYYY)
            };
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^-?[1-9][0-9]*(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.gYear.timeZone.pattern.test(value);
        }
    }
};

xsd.gMonth = {
    pattern: /^--(?:1[0-2]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^--(1[0-2]|0[1-9])(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.gMonth.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     MM: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, MM, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.gMonth.matcher.exec(value) || [];
        if (match) return {MM, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     month: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.gMonth.match(value);
        if (match) {
            const result = {
                month: parseInt(match.MM)
            };
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^--(?:1[0-2]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.gMonth.timeZone.pattern.test(value);
        }
    }
};

xsd.gDay = {
    pattern: /^---(?:3[01]|[12][0-9]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^---(3[01]|[12][0-9]|0[1-9])(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.gDay.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     DD: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, DD, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.gDay.matcher.exec(value) || [];
        if (match) return {DD, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     day: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.gDay.match(value);
        if (match) {
            const result = {
                day: parseInt(match.DD)
            };
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^---(?:3[01]|[12][0-9]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.gDay.timeZone.pattern.test(value);
        }
    }
};

xsd.gYearMonth = {
    pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^(-?[1-9][0-9]*)-(1[0-2]|0[1-9])(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.gYearMonth.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     YYYY: string,
     *     MM: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, YYYY, MM, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.gYearMonth.matcher.exec(value) || [];
        if (match) return {YYYY, MM, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     year: number,
     *     month: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.gYearMonth.match(value);
        if (match) {
            const result = {
                year:  parseInt(match.YYYY),
                month: parseInt(match.MM)
            };
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^-?[1-9][0-9]*-(?:1[0-2]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.gYearMonth.timeZone.pattern.test(value);
        }
    }
};

xsd.gMonthDay = {
    pattern: /^--(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)?$/,
    matcher: /^--(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.gMonthDay.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     MM: string,
     *     DD: string,
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, MM, DD, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.gMonthDay.matcher.exec(value) || [];
        if (match) return {MM, DD, tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     month: number,
     *     day: number,
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.gMonthDay.match(value);
        if (match) {
            const result = {
                month: parseInt(match.MM),
                day:   parseInt(match.DD)
            };
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    },
    timeZone: {
        pattern: /^--(?:1[0-2]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9])(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
        /**
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return xsd.gMonthDay.timeZone.pattern.test(value);
        }
    }
};

xsd.duration = {
    pattern: /^-?P(?=.)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=.)(?:\d+H)?(?:\d+M)?(?:\d*(?:\.\d+)?S)?)?$/,
    matcher: /^(-?)P(?=.)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?=.)(?:(\d+)H)?(?:(\d+)M)?(?:(\d*(?:\.\d+)?)S)?)?$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.duration.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     sign?: string,
     *     YYYY?: string,
     *     MM?: string,
     *     DD?: string,
     *     hh?: string,
     *     mm?: string,
     *     ss_ms?: string
     * }}
     */
    match(value) {
        const [match, sign, YYYY, MM, DD, hh, mm, ss_ms] = xsd.duration.matcher.exec(value) || [];
        if (match) return {sign, YYYY, MM, DD, hh, mm, ss_ms};
    },
    /**
     * @param {string} value
     * @returns {{
     *     sign: number,
     *     years: number,
     *     months: number,
     *     days: number,
     *     hours: number,
     *     minutes: number,
     *     seconds: number,
     *     milliseconds: number
     * }}
     */
    parse(value) {
        const match = xsd.duration.match(value);
        if (match) {
            const result        = {
                sign:    (match.sign === '-') ? -1 : 1,
                years:   parseInt(match.YYYY || 0),
                months:  parseInt(match.MM || 0),
                days:    parseInt(match.DD || 0),
                hours:   parseInt(match.hh || 0),
                minutes: parseInt(match.mm || 0),
                seconds: parseInt(match.ss_ms || 0)
            };
            result.milliseconds = Math.round(1000 * (parseFloat(match.ss_ms || 0) - result.second));
            return result;
        }
    }
};

xsd.timeZone = {
    pattern: /^(?:[+-](?:1[0-2]|0[0-9]):[0-5][0-9]|Z)$/,
    matcher: /^(?:([+-])(1[0-2]|0[0-9]):([0-5][0-9])|(Z))$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return xsd.timeZone.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     tz_sign?: string,
     *     tz_hh?: string,
     *     tz_mm?: string,
     *     utc_tag?: string
     * }}
     */
    match(value) {
        const [match, tz_sign, tz_hh, tz_mm, utc_tag] = xsd.timeZone.matcher.exec(value) || [];
        if (match) return {tz_sign, tz_hh, tz_mm, utc_tag};
    },
    /**
     * @param {string} value
     * @returns {{
     *     offset?: number,
     *     utc?: boolean
     * }}
     */
    parse(value) {
        const match = xsd.timeZone.match(value);
        if (match) {
            const result = {};
            if (match.tz_sign) result.offset = (match.tz_sign === '-' ? -1 : 1) * (60 * parseInt(match.tz_hh) + parseInt(match.tz_mm));
            if (match.utc_tag || result.offset === 0) result.utc = true;
            return result;
        }
    }
};
