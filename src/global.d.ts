// Type declarations for external modules
declare module 'strip-json-comments' {
  function stripJsonComments(input: string, options?: { whitespace?: boolean }): string;
  export = stripJsonComments;
}

export {};
