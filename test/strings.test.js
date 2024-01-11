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

    describe('http', function () {

        describe('headers', function () {

            test('contentType', function () {
                const contentType = strings?.http?.headers?.contentType;
                expect(contentType).toBeTruthy();

                expect(contentType.pattern).toBeInstanceOf(RegExp);
                expect(typeof contentType.test).toBe('function');
                expect(typeof contentType.match).toBe('function');
                expect(typeof contentType.parse).toBe('function');

                expect(contentType.test('Hello World!')).toBe(false);
                expect(contentType.test('text/plain')).toBe(true);

                expect(
                    contentType.parse('text/html; charset=utf-8; boundary=something; literal="Hello World!"; literal=""')
                ).toEqual({
                    format: 'text/html',
                    param:  {
                        charset:  'utf-8',
                        boundary: 'something',
                        literal:  ['Hello World!', '']
                    }
                });
            });

        });

    });

});
