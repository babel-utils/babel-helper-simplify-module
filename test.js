// @flow
'use strict';

const {simplifyModule} = require('./');
const createBabylonOptions = require('babylon-options');
const pluginTester = require('babel-plugin-tester');
const printAST = require('ast-pretty-print');

const plugin = function({types: t}) {
  const VISITED = Symbol('visited');

  let getOutput = path => {
    let printed = printAST(path) + '\n';
    return t.expressionStatement(
      t.templateLiteral([
        t.templateElement({ raw: printed }, true)
      ], [])
    );
  };

  return {
    name: 'test-plugin',
    visitor: {
      Program(path) {
        if (path[VISITED]) return;
        simplifyModule(path);
        path[VISITED] = true;
        path.pushContainer('body', getOutput(path));
      },
    },
  };
};

pluginTester({
  plugin: plugin,
  babelOptions: {
    parserOpts: createBabylonOptions({
      stage: 0,
      plugins: ['flow'],
    }),
  },
  snapshot: true,
  tests: [
    {
      title: 'statement',
      code: 'var a = 1;',
    },
    {
      title: 'statement rewriting',
      code: 'var a = 1, b = 2;',
    },
    {
      title: 'export named',
      code: 'export var a = 1;',
    },
    {
      title: 'export default',
      code: 'export default 1;',
    },
    {
      title: 'export named from',
      code: 'export { a } from "b";',
    },
    {
      title: 'export default from',
      code: 'export default from "b";',
    },
    {
      title: 'export all from',
      code: 'export * from "b";',
    },
    {
      title: 'import default',
      code: 'import a from "b";',
    },
    {
      title: 'import named',
      code: 'import { a } from "b";',
    },
    {
      title: 'import namespace',
      code: 'import * as a from "b";',
    },
    {
      title: 'import type default',
      code: 'import type a from "b";',
    },
    {
      title: 'import type named',
      code: 'import type { a } from "b";',
    },
    {
      title: 'import type inner',
      code: 'import { type a } from "b";',
    },
    {
      title: 'import typeof default',
      code: 'import typeof a from "b";',
    },
    {
      title: 'import typeof named',
      code: 'import typeof { a } from "b";',
    },
    {
      title: 'import typeof inner',
      code: 'import { typeof a } from "b";',
    },
    {
      title: 'import side effects',
      code: 'import "b";',
    },
  ],
});
