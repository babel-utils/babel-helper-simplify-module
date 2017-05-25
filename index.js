// @flow
'use strict';
const explodeModule = require('babel-explode-module').default;
const t = require('babel-types');

/*::
type Node = {
  type: string,
  [key: string]: any,
};

type Path = {
  type: string,
  node: Node,
  [key: string]: any,
};
*/

function toModuleSpecifierValues(specifier) {
  return {
    local: specifier.local ? t.identifier(specifier.local) : null,
    external: specifier.external ? t.identifier(specifier.external) : null,
    source: specifier.source ? t.stringLiteral(specifier.source) : null,
  };
}

function simplifyModule(path /*: Path */) {
  if (!path.isProgram()) {
    throw new Error(
      `Must call simplifyModule() with Program node, passed: ${path.type}`
    );
  }

  let exploded = explodeModule(path.node);
  let body = [];

  exploded.imports.forEach(item => {
    let {local, external, source} = toModuleSpecifierValues(item);
    let specifier;

    if (!external) {
      specifier = t.importNamespaceSpecifier(local);
    } else if (item.external === 'default') {
      specifier = t.importDefaultSpecifier(local);
    } else {
      specifier = t.importSpecifier(local, external);
    }

    body.push(t.importDeclaration([specifier], source));
  });

  exploded.statements.forEach(item => {
    body.push(item);
  });

  exploded.exports.forEach(item => {
    let {local, external, source} = toModuleSpecifierValues(item);
    let declaration;

    if (!source && item.external === 'default') {
      declaration = t.exportDefaultDeclaration(local);
    } else if (source && !local && !external) {
      declaration = t.exportAllDeclaration(source);
    } else {
      let specifier = t.exportSpecifier(local, external);
      declaration = t.exportNamedDeclaration(null, [specifier], source);
    }

    body.push(declaration);
  });

  let program = Object.assign({}, path.node, {
    body: body,
  });

  path.replaceWith(program);
}

module.exports = simplifyModule;
