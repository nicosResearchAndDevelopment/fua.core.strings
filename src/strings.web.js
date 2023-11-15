const web = exports;

web.ip = {
    v4: {
        /**
         * Ipv4 from '0.0.0.0' to '255.255.255.255' ('000.000.000.000' is also allowed).
         * The RE is constructed the following way:
         * Does it start with 0 or 1, that means up to 2 decimals can follow (numbers from 000 to 199).
         * Else does it start with a 2, then a 0 to 4 and at least a decimal must follow (numbers from 200 to 249).
         * Else does it start with 25, then a 0 to 5 must follow (numbers from 250 to 255).
         * @type {RegExp}
         */
        pattern: /^(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/,
        matcher: /^([01]?\d{1,2}|2[0-4]\d|25[0-5])\.([01]?\d{1,2}|2[0-4]\d|25[0-5])\.([01]?\d{1,2}|2[0-4]\d|25[0-5])\.([01]?\d{1,2}|2[0-4]\d|25[0-5])$/,
        /**
         * Tests a string against the IPv4 pattern.
         * @param {string} value
         * @returns {boolean}
         */
        test(value) {
            return web.ip.v4.pattern.test(value);
        },
        match(value) {
            const [match, part_1, part_2, part_3, part_4] = web.ip.v4.matcher.exec(value) || [];
            if (match) return {part_1, part_2, part_3, part_4};
        },
        parse(value) {
            const match = web.ip.v4.match(value);
            if (value) return [
                parseInt(match.part_1),
                parseInt(match.part_2),
                parseInt(match.part_3),
                parseInt(match.part_4)
            ];
        }
    },
    v6: {
        short: {
            /**
             * This RegExp validates, if a string has a double colon, but no triple and no second double.
             * That means, it must be the short representation of an ipv6.
             * @type {RegExp}
             */
            is_pattern: /^(?:(?:[0-9a-fA-F]{1,4}:)+|:):(?!:|.+::)/,
            /**
             * This RegExp cannot validate the short format on its own, just if the colons are correct.
             * That is why you need to use the IPv6_is_short_pattern first.
             * The short format in general means, that you can replace (only once) any number of zero blocks by a double colon.
             * E.g. '::1' means '0:0:0:0:0:0:0:1'
             * Their may be a colon first, then up to 7 hexadecimal blocks with a colon or just a colon.
             * At last there is another hexadecimal block or a single colon.
             * @type {RegExp}
             */
            pattern: /^:?(?:[0-9a-fA-F]{0,4}:){1,7}(?:[0-9a-fA-F]{1,4}|:)$/,
            // pattern = /^(?:[0-9a-fA-F]{1,4}:|::)(?:[0-9a-fA-F]{0,4}:){0,5}(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/,
            /**
             * Same as IPv6_short_pattern but with ipv4 mixin.
             * E.g. '::1:192.168.0.1' means '0:0:0:0:0:1:192.168.0.1'
             * The pattern should be clear by now.
             * @type {RegExp}
             */
            mixed_pattern: /^:?(?:[0-9a-fA-F]{0,4}:){0,6}(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/,
            test(value) {
                return web.ip.v6.short.is_pattern.test(value) && (web.ip.v6.short.pattern.test(value) || web.ip.v6.short.mixed_pattern.test(value));
            }
        },
        basic: {
            /**
             * This is the most basic representation of an ipv6, from '0:0:0:0:0:0:0:0' to 'FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF'.
             * [0-9a-fA-F]{1,4} is used to test for a block of up to 4 hexadecimals.
             * There are 7 blocks that are followed by a colon and then a single block.
             * @type {RegExp}
             */
            pattern: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,

            /**
             * Ipv4 can be embedded in an ipv6 adress.
             * E.g. '0:0:0:0:0:FFFF:192.168.0.1'
             * There are 6 blocks of hexadecimals that are followed by a colon and then the ipv4, as in validateIPv4.
             * @type {RegExp}
             */
            mixed_pattern: /^(?:[0-9a-fA-F]{1,4}:){6}(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/,
            // mixed_pattern = /^(?:[0-9a-fA-F]{1,4}:|::)?(?:[0-9a-fA-F]{0,4}:){0,6}(?:[0-9a-fA-F]{1,4}|:)$/,
            test(value) {
                return !web.ip.v6.short.is_pattern.test(value) && (web.ip.v6.basic.pattern.test(value) || web.ip.v6.basic.mixed_pattern.test(value));
            }
        },
        /**
         * Tests a string against the IPv6 patterns.
         * @param {string} value
         * @returns {boolean}
         * @see https://tools.ietf.org/html/rfc3513#section-2.2
         */
        test(value) {
            if (web.ip.v6.short.is_pattern.test(value)) {
                return web.ip.v6.short.pattern.test(value) || web.ip.v6.short.mixed_pattern.test(value);
            } else {
                return web.ip.v6.basic.pattern.test(value) || web.ip.v6.basic.mixed_pattern.test(value);
            }
        }
    },
    /**
     * Tests a string against the IPv4 pattern and the IPv6 patterns.
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return web.ip.v4.test(value) || web.ip.v6.test(value);
    }
};

web.email = {
    /**
     * The following characters are allowed: A-Za-z0-9.!#$%&'*+-/=?^_`{|}~
     * Before the @ has to be at least one of those characters, then the @,
     * then at least another letter, number, minus or dot followed by a dot and the ending (just letters).
     * @type {RegExp}
     */
    pattern: /^[A-Za-z0-9.!#$%&'*+\-/=?^_`{|}~]+@[A-Za-z0-9.\-]+\.[A-Za-z]+$/,
    matcher: /^([A-Za-z0-9.!#$%&'*+\-/=?^_`{|}~]+)@([A-Za-z0-9.\-]+\.[A-Za-z]+)$/,
    /**
     * The email address is invalid,
     * if it begins with a dot
     * or there is a dot before or after the @
     * or there are two dots in a row anywhere after the @.
     * @type {RegExp}
     */
    invalid_pattern: /^\.|\.@|@\.|@.*\.\./,
    /**
     * Tests a string against the Email pattern.
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return web.email.pattern.test(value) && !web.email.invalid_pattern.test(value);
    },
    match(value) {
        const [match, local_part, domain] = web.email.matcher.exec(value) || [];
        if (match) return {local_part, domain};
    }
};

web.iri = {
    pattern: /^[a-z][a-z0-9+.-]*:[^\s"<>\\^`{|}]*$/i,
    test(value) {
        return web.iri.pattern.test(value);
    },
    prefix: {
        pattern: /^[a-z][a-z0-9+.-]*$/i,
        test(value) {
            return web.iri.prefix.pattern.test(value);
        }
    }
};

web.url = {
    pattern: /^https?:\/\/[-\w.]+(?::\d+)?(?:\/[-\w.:&%@~+]*)*(?:\?[-\w.,:;&%@~+=]*)?(?:#[-\w]*)?$/i,
    // pattern: new RegExp('^((ft|htt)ps?:\\/\\/)?' + // protocol
    //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    //     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    //     '(\\:\\d+)?' + // port
    //     '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    //     '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
    //     '(\\#[-a-z\\d_]*)?$', 'i'), // fragment locator;
    test(value) {
        return web.url.pattern.test(value);
    },
    path: {
        pattern: /^(?:\/[-\w.:&%@~+]*)*$/i,
        test(value) {
            return web.url.path.pattern.test(value);
        }
    }
};

web.language = {
    pattern: /^[a-z]{1,3}(?:-[a-z0-9]{1,8})*$/i,
    test(value) {
        return web.language.pattern.test(value);
    }
};
