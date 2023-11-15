const opc = exports;

opc.nid = {
    pattern: /^ns=(?:\d+|https?:\/\/[^;]+);(?:i=\d+|s=\S{1,4096}|g=\w{8}-\w{4}-\w{4}-\w{4}-\w{12}|o=.{0,4096})$/,
    matcher: /^ns=(?:(\d+)|(https?:\/\/[^;]+));(?:i=(\d+)|s=(\S{1,4096})|g=(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})|o=(.{0,4096}))$/,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    test(value) {
        return opc.nid.pattern.test(value);
    },
    /**
     * @param {string} value
     * @returns {{
     *     ns_index?: string,
     *     ns_uri?: string,
     *     int_id?: string,
     *     str_id?: string,
     *     gu_id?: string,
     *     any_id?: string
     * }}
     */
    match(value) {
        const [match, ns_index, ns_uri, int_id, str_id, gu_id, any_id] = opc.nid.matcher.exec(value) || [];
        if (match) return {ns_index, ns_uri, int_id, str_id, gu_id, any_id};
    },
    /**
     * @param {string} value
     * @returns {{
     *     ns: string | number,
     *     type: 'i' | 's' | 'g' | 'o',
     *     id: number | string
     * }}
     */
    parse(value) {
        const match = opc.nid.match(value);
        if (match) {
            const result = {ns: match.ns_uri || parseInt(match.ns_index)};
            if (match.int_id) {
                result.type = 'i';
                result.id   = parseInt(match.int_id);
            } else if (match.str_id) {
                result.type = 's';
                result.id   = match.str_id;
            } else if (match.gu_id) {
                result.type = 'g';
                result.id   = match.gu_id;
            } else {
                result.type = 'o';
                result.id   = match.any_id;
            }
            return result;
        }
    }
};
