import assert from 'node:assert';
import { test, describe } from 'node:test';
import { writeFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import rc from '../index.ts';

describe('rc basic functionality', () => {
  const n = 'rc' + Math.random();

  test('should load configuration with defaults and environment variables', () => {
    process.env[n + '_envOption'] = '42';

    const config = rc(n, {
      option: true,
    });

    assert.strictEqual(config.option, true);
    assert.strictEqual(config.envOption, '42');
  });

  test('should handle custom argv with nopt-like structure', () => {
    const customArgv = rc(
      n,
      {
        option: true,
      },
      {
        // nopt-like argv
        option: false,
        envOption: 24,
        argv: {
          remain: [],
          cooked: ['--no-option', '--envOption', '24'],
          original: ['--no-option', '--envOption=24'],
        },
      }
    );

    assert.strictEqual(customArgv.option, false);
    assert.strictEqual(customArgv.envOption, 24);
  });

  test('should load from commented JSON config file', () => {
    const jsonrc = resolve('.' + n + 'rc');

    writeFileSync(
      jsonrc,
      [
        '{',
        '// json overrides default',
        '"option": false,',
        '/* env overrides json */',
        '"envOption": "24"',
        '}',
      ].join('\n')
    );

    const commentedJSON = rc(n, {
      option: true,
    });

    unlinkSync(jsonrc);

    assert.strictEqual(commentedJSON.option, false);
    assert.strictEqual(commentedJSON.envOption, '42');

    assert.strictEqual(commentedJSON.config, jsonrc);
    assert.strictEqual(commentedJSON.configs?.length, 1);
    assert.strictEqual(commentedJSON.configs?.[0], jsonrc);
  });
});
