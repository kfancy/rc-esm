import { join } from 'node:path';
import minimist from 'minimist';
import * as utils from './utils.js';
import type { RcFunction, RcOptions, ParseFunction, RcConfig } from './types.js';

const etc = '/etc';
const win = process.platform === 'win32';
const home = win ? process.env.USERPROFILE : process.env.HOME;

// Native deepExtend implementation to replace deep-extend
function deepExtend(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepExtend(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepExtend(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

const rc: RcFunction = function <T = RcOptions>(
  name: string,
  defaults?: T | string,
  argv?: RcOptions,
  parse?: ParseFunction
): T & RcConfig {
  console.log('DEBUG: rc called with name:', name);
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

  const configs: any[] = [processedDefaults];
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
  console.log('DEBUG: Looking for local rc file:', localRcPath);
  const foundPath = utils.find(localRcPath);
  console.log('DEBUG: Found at:', foundPath);
  addConfigFile(foundPath);
  if (env.config) addConfigFile(env.config as string);
  if (argv.config) addConfigFile(argv.config as string);

  return deepExtend(
    {},
    ...configs,
    env,
    argv,
    configFiles.length
      ? { configs: configFiles, config: configFiles[configFiles.length - 1] }
      : undefined
  ) as T & RcOptions;
};

export default rc;
