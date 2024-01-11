const http = exports;

http.headers = {};

http.headers.contentType = {
    // media-type     = type "/" subtype *( OWS ";" OWS parameter )
    // type           = token
    // subtype        = token
    // parameter      = token "=" ( token / quoted-string )
    // token          = 1*tchar
    // tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
    //                ; any VCHAR, except delimiters
    // OWS            = *( SP / HTAB )
    //                ; optional whitespace
    // quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
    // qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
    // obs-text       = %x80-FF
    // quoted-pair    = "\" ( HTAB / SP / VCHAR / obs-text )
    // VCHAR          = %x21-7E
    //                ; visible (printing) characters
    // SP             = %x20
    // HTAB           = %x09
    //                ; horizontal tab
    // DIGIT          = %x30-39
    //                ; 0-9
    // ALPHA          = %x41-5A / %x61-7A
    //                ; A-Z / a-z
    pattern: /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+\/[!#$%&'*+\-.^_`|~0-9A-Za-z]+(?:[ \t]*;[ \t]*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=(?:[!#$%&'*+\-.^_`|~0-9A-Za-z]+|"(?:[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]|\\[\t \x21-\x7E\x80-\xFF])*"))*$/,
    test(value) {
        return http.headers.contentType.pattern.test(value);
    },
    matcher: /^([!#$%&'*+\-.^_`|~0-9A-Za-z]+\/[!#$%&'*+\-.^_`|~0-9A-Za-z]+)(?=$|[ \t;])/,
    param:   {
        matcher: /[ \t]*;[ \t]*([!#$%&'*+\-.^_`|~0-9A-Za-z]+)=(?:([!#$%&'*+\-.^_`|~0-9A-Za-z]+)|"((?:[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]|\\[\t \x21-\x7E\x80-\xFF])*)")*/gy
    },
    match(value) {
        const [match] = http.headers.contentType.matcher.exec(value) || [];
        if (!match) return;
        const result                                     = [match];
        let matchedLength                                = match.length;
        http.headers.contentType.param.matcher.lastIndex = matchedLength;
        for (let pMatch of value.matchAll(http.headers.contentType.param.matcher)) {
            matchedLength = pMatch.index + pMatch[0].length;
            result.push(pMatch[1], pMatch[2] || pMatch[3]);
        }
        http.headers.contentType.param.matcher.lastIndex = 0;
        if (matchedLength === value.length) return result;
    },
    parse(value) {
        const match = http.headers.contentType.match(value);
        if (match) {
            const param = {};
            for (let index = 1; index < match.length; index += 2) {
                const key = match[index];
                if (Array.isArray(param[key])) param[key].push(match[index + 1]);
                else if (key in param) param[key] = [param[key], match[index + 1]];
                else param[key] = match[index + 1];
            }
            return {format: match[0], param};
        }
    }
};
