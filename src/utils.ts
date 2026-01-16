import fs from 'node:fs';
import ini from 'ini';
import path from 'node:path';
// @ts-ignore - strip-json-comments doesn't provide types
import stripJsonComments from 'strip-json-comments';
import type { ParseFunction, RcOptions } from './types.ts';

export const parse: ParseFunction = function (content: string): RcOptions {
  //if it ends in .json or starts with { then it must be json.
  //must be done this way, because ini accepts everything.
  //can't just try and parse it and let it throw if it's not ini.
  //everything is ini. even json with a syntax error.

  if (/^\s*{/.test(content)) {
    return JSON.parse(stripJsonComments(content));
  }
  return ini.parse(content);
};

export const file = function (...args: (string | undefined)[]): string | undefined {
  const filteredArgs = args.filter((arg) => arg != null);

  //path.join breaks if it's a not a string, so just skip this.
  for (const arg of filteredArgs) {
    if (typeof arg !== 'string') {
      return undefined;
    }
  }

  const filePath = path.join(...(filteredArgs as string[]));
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return undefined;
  }
};

export const json = function (...args: (string | undefined)[]): RcOptions | null {
  const content = file(...args);
  return content ? parse(content) : null;
};

export const env = function (prefix: string, env?: Record<string, string | undefined>) {
  const processEnv = env || process.env;
  const obj: Record<string, unknown> = {};
  const l = prefix.length;
  for (const k in processEnv) {
    if (k.toLowerCase().indexOf(prefix.toLowerCase()) === 0) {
      const envValue = processEnv[k];
      if (envValue === undefined) continue;

      const keypath = k.substring(l).split('__');

      // Trim empty strings from keypath array
      let emptyStringIndex: number;
      while ((emptyStringIndex = keypath.indexOf('')) > -1) {
        keypath.splice(emptyStringIndex, 1);
      }

      let cursor: Record<string, unknown> = obj;
      keypath.forEach(function _buildSubObj(subkey, i) {
        // (check for _subkey first so we ignore empty strings)
        // (check for cursor to avoid assignment to primitive objects)
        if (!subkey || typeof cursor !== 'object' || cursor === null) {
          return;
        }

        // If this is the last key, just stuff the value in there
        // Assigns actual value from env variable to final key
        // (unless it's just an empty string- in that case use the last valid key)
        if (i === keypath.length - 1) {
          cursor[subkey] = envValue;
        }

        // Build sub-object if nothing already exists at the keypath
        if (cursor[subkey] === undefined) {
          cursor[subkey] = {};
        }

        // Increment cursor used to track the object at the current depth
        cursor = cursor[subkey] as Record<string, unknown>;
      });
    }
  }

  return obj as RcOptions;
};

export const find = function (...args: string[]): string | undefined {
  const rel = path.join(...args);

  function find(start: string, rel: string): string | undefined {
    const filePath = path.join(start, rel);
    try {
      fs.statSync(filePath);
      return filePath;
    } catch (err) {
      if (path.dirname(start) !== start) {
        // root
        return find(path.dirname(start), rel);
      }
    }
  }
  return find(process.cwd(), rel);
};
