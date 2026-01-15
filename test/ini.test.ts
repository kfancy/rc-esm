import { test, describe, assert } from './test-runner.mjs';
import * as utils from '../dist/utils.js';
import * as INI from 'ini';

describe('INI parsing utilities', () => {
  function testObj(obj: Record<string, any>): void {
    const _json = JSON.stringify(obj);
    const _ini = INI.stringify(obj);

    const json = utils.parse(_json);
    const ini = utils.parse(_ini);

    console.log(_ini, _json);
    assert.deepStrictEqual(json, ini);
  }

  test('should parse simple object', () => {
    testObj({ hello: true });
  });
});
