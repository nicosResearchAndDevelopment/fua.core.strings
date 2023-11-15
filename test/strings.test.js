const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    strings          = require('../src/strings.js');

describe('fua.core.strings', function () {

    test('develop', function () {
        // console.log(strings);
        console.log(strings.convert('test', null, 'base64'));
        console.log(strings.xsd.float.parse('1.12e3'));
        console.log(strings.xsd.float.parse('-INF'));
        console.log(strings.xsd.time.parse('12:03:59.123'));
        console.log(strings.web.ip.v4.parse('192.168.0.1'));
        console.log(strings.web.email.match('test@example.com'));
    });

});
