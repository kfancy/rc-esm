#!/usr/bin/env node

import rc from './index.js';

const appName = process.argv[2];
if (!appName) {
  console.error('Usage: rc <appname>');
  process.exit(1);
}

const config = rc(appName);
console.log(JSON.stringify(config, null, 2));
