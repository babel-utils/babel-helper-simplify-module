// @flow
'use strict';

const simplifyModule = require('./');
const createBabylonOptions = require('babylon-options');
const pluginTester = require('babel-plugin-tester');

const plugin = function({types: t}) {
  const VISITED = Symbol('visited');

  return {
    name: 'test-plugin',
    visitor: {
      Program(path) {
        if (path[VISITED]) return;
        simplifyModule(path);
        path[VISITED] = true;
      },
    },
  };
};

pluginTester({
  plugin: plugin,
  babelOptions: {
    parserOpts: createBabylonOptions({
      stage: 0,
      plugins: ['flow']
    }),
  },
  tests: [
    {
      title: 'statement',
      code: 'var a = 1;',
      output: 'var a = 1;',
    },
    {
      title: 'statement rewriting',
      code: 'var a = 1, b = 2;',
      output: 'var a = 1;var b = 2;',
    },
    {
      title: 'export named',
      code: 'export var a = 1;',
      output: 'var a = 1;export { a };',
    },
    {
      title: 'export default',
      code: 'export default 1;',
      output: 'const _default = 1;export default _default;',
    },
    {
      title: 'export named from',
      code: 'export { a } from "b";',
      output: 'export { a } from "b";',
    },
    {
      title: 'export default from',
      code: 'export default from "b";',
      output: 'export { default } from "b";',
    },
    {
      title: 'export all from',
      code: 'export * from "b";',
      output: 'export * from "b";',
    },
    {
      title: 'import default',
      code: 'import a from "b";',
      output: 'import a from "b";',
    },
    {
      title: 'import named',
      code: 'import { a } from "b";',
      output: 'import { a } from "b";',
    },
    {
      title: 'import namespace',
      code: 'import * as a from "b";',
      output: 'import * as a from "b";',
    }
  ],
});
