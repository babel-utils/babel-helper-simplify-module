# babel-helper-simplify-module

> Transform module using [babel-explode-module](https://github.com/babel-utils/babel-explode-module) to have a simpler structure

```js
import {simplifyModule} from 'babel-helper-simplify-module';

simplifyModule(programPath);
```

**Before:**

```js
import foo from "mod";
import {bar} from "mod";

export default function() {
  // ...
}

export const baz = 42,
             bat = "hello world";

export * from "bam";
```

**After:**

```js
import foo, {bar} from "mod";

function _default() {
  // ...
}

const baz = 42;
const bat = "hello world";

export default _default;
export { baz };
export { bat };
export * from "bam";
```

## API

### `explodedToStatements(exploded)`

```js
import explodeModule from 'babel-explode-module';
import {explodedToStatements} from 'babel-helper-simplify-module';

let exploded = explodeModule(node);
let statements = explodedToStatements(exploded);
```

### `simplifyModule(path)`

> This mutates the program.

```js
import {simplifyModule} from 'babel-helper-simplify-module';

simplifyModule(programPath);
```
