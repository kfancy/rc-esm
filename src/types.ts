export interface RcOptions {
  [key: string]: any;
}

export interface RcConfig {
  configs?: string[];
  config?: string;
  [key: string]: any;
}

export interface ParseFunction {
  (content: string): RcOptions;
}

export interface RcFunction {
  <T = RcOptions>(
    name: string,
    defaults?: T | string,
    argv?: RcOptions,
    parse?: ParseFunction
  ): T & RcConfig;
}

export interface Utils {
  parse: ParseFunction;
  file: (...args: (string | undefined)[]) => string | undefined;
  json: (...args: (string | undefined)[]) => RcOptions | null;
  env: (prefix: string, env?: Record<string, string | undefined>) => RcOptions;
  find: (...args: string[]) => string | undefined;
}
