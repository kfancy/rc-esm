import assert from 'node:assert';
import { test, describe } from 'node:test';
import * as utils from '../utils.ts';
import * as INI from 'ini';

describe('INI parsing utilities', () => {
  function testObj(obj: Record<string, unknown>): void {
    const _json = JSON.stringify(obj);
    const _ini = INI.stringify(obj);

    const json = utils.parse(_json);
    const ini = utils.parse(_ini);

    assert.deepStrictEqual(json, ini);
  }

  test('should parse simple object', () => {
    testObj({ hello: true });
  });
});
