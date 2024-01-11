const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    http             = require('../src/strings.http.js');

describe('fua.core.strings.http', function () {

    describe('headers', function () {

        const headers = http?.headers;

        describe('contentType', function () {

            const contentType = headers?.contentType;

            describe('param', function () {

                const param = contentType?.param;

                test('test', function () {
                    expect(param.test('Hello World!')).toBe(false);
                    expect(param.test('charset=utf-8; boundary=something')).toBe(true);
                    expect(param.test('charset=utf-8; ')).toBe(false);
                    expect(param.test('  charset=utf-8 ')).toBe(false);
                });

                test('parse', function () {
                    expect(
                        param.parse('charset=utf-8; boundary=something; literal="Hello World!"; literal=""')
                    ).toEqual({
                        charset:  'utf-8',
                        boundary: 'something',
                        literal:  ['Hello World!', '']
                    });
                });

            });

            test('test', function () {
                expect(contentType.test('Hello World!')).toBe(false);
                expect(contentType.test('text/plain')).toBe(true);
                expect(contentType.test('text/html; charset=utf-8; boundary=something')).toBe(true);
                expect(contentType.test('text/html; charset=utf-8; ')).toBe(false);
            });

            test('parse', function () {
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
