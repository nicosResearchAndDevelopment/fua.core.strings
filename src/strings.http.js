const http = exports;

http.headers = {

    contentType: {
        pattern: /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+\/[!#$%&'*+\-.^_`|~0-9A-Za-z]+(?:[ \t]*;[ \t]*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=(?:[!#$%&'*+\-.^_`|~0-9A-Za-z]+|"(?:[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]|\\[\t \x21-\x7E\x80-\xFF])*"))*$/,
        test(value) {
            return http.headers.contentType.pattern.test(value);
        },
        matcher: /^([!#$%&'*+\-.^_`|~0-9A-Za-z]+\/[!#$%&'*+\-.^_`|~0-9A-Za-z]+)(?:[ \t]*;[ \t](.*))?$/s,
        match(value) {
            const [match, format, parameters] = http.headers.contentType.matcher.exec(value) || [];
            if (!match) return;
            if (!parameters) return [format];
            const paramMatch = http.headers.contentType.param.match(parameters);
            if (paramMatch) return [format, ...paramMatch];
        },
        parse(value) {
            const [match, format, parameters] = http.headers.contentType.matcher.exec(value) || [];
            if (!match) return;
            const param = parameters ? http.headers.contentType.param.parse(parameters) : undefined;
            if (format && param) return {format, param};
        },
        param: {
            pattern: /^(?:[!#$%&'*+\-.^_`|~0-9A-Za-z]+=(?:[!#$%&'*+\-.^_`|~0-9A-Za-z]+|"(?:[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]|\\[\t \x21-\x7E\x80-\xFF])*")(?:$|[ \t]*;[ \t]*(?!$)))*$/,
            test(value) {
                return http.headers.contentType.param.pattern.test(value);
            },
            matcher: /([!#$%&'*+\-.^_`|~0-9A-Za-z]+)=(?:([!#$%&'*+\-.^_`|~0-9A-Za-z]+)|"((?:[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]|\\[\t \x21-\x7E\x80-\xFF])*)")(?:$|[ \t]*;[ \t]*(?!$))/gy,
            match(value) {
                const result                                     = [];
                let matchedLength                                = 0;
                http.headers.contentType.param.matcher.lastIndex = 0;
                for (let pMatch of value.matchAll(http.headers.contentType.param.matcher)) {
                    matchedLength = pMatch.index + pMatch[0].length;
                    result.push(pMatch[1], pMatch[2] || pMatch[3]);
                }
                http.headers.contentType.param.matcher.lastIndex = 0;
                if (matchedLength === value.length) return result;
            },
            parse(value) {
                const match = http.headers.contentType.param.match(value);
                if (match) {
                    const param = {};
                    for (let index = 0; index < match.length; index += 2) {
                        const key = match[index];
                        if (Array.isArray(param[key])) param[key].push(match[index + 1]);
                        else if (key in param) param[key] = [param[key], match[index + 1]];
                        else param[key] = match[index + 1];
                    }
                    return param;
                }
            }
        }
    },

    accept: {}

};
