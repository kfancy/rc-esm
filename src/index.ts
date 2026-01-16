import { join } from 'node:path';
import minimist from 'minimist';
import * as utils from './utils.ts';
import type { RcFunction, RcOptions, ParseFunction, RcConfig } from './types.ts';

const etc = '/etc';
const win = process.platform === 'win32';
const home = win ? process.env.USERPROFILE : process.env.HOME;

// Native deepExtend implementation to replace deep-extend
function deepExtend(
  target: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  if (!sources.length) return target;
  const source = sources.shift()!;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepExtend(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepExtend(target, ...sources);
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

const rc: RcFunction = function <T extends Record<string, unknown> = RcOptions>(
  name: string,
  defaults?: T | string,
  argv?: RcOptions,
  parse?: ParseFunction
): T & RcConfig {
  if (typeof name !== 'string') {
    throw new Error('rc(name): name *must* be string');
  }

  if (!argv) {
    argv = minimist(process.argv.slice(2));
  } else {
    // Ensure argv is defined and has the expected structure
    argv = { ...argv };
  }

  let processedDefaults: T;
  if (typeof defaults === 'string') {
    const defaultsConfig = utils.json(defaults);
    processedDefaults = (defaultsConfig || {}) as T;
  } else {
    processedDefaults = (defaults || {}) as T;
  }

  const parser = parse || utils.parse;
  const env = utils.env(name + '_');

  const configs: Record<string, unknown>[] = [processedDefaults];
  const configFiles: string[] = [];

  function addConfigFile(file: string | undefined): void {
    if (!file || configFiles.indexOf(file) >= 0) return;
    const fileConfig = utils.file(file);
    if (fileConfig) {
      configs.push(parser(fileConfig));
      configFiles.push(file);
    }
  }

  // which files do we look at?
  if (!win) {
    [join(etc, name, 'config'), join(etc, name + 'rc')].forEach(addConfigFile);
  }
  if (home) {
    [
      join(home, '.config', name, 'config'),
      join(home, '.config', name),
      join(home, '.' + name, 'config'),
      join(home, '.' + name + 'rc'),
    ].forEach(addConfigFile);
  }
  const localRcPath = '.' + name + 'rc';
  const foundPath = utils.find(localRcPath);
  addConfigFile(foundPath);
  if (env.config) addConfigFile(env.config as string);
  if (argv.config) addConfigFile(argv.config as string);

  const result = deepExtend({}, ...configs, env, argv) as T & RcOptions;

  if (configFiles.length) {
    Object.assign(result, { configs: configFiles, config: configFiles[configFiles.length - 1] });
  }

  return result;
};

export default rc;
