## 1.1 Require patterns

Different way to structure modules in Node.

**Folder Structure:**

```
  |____greet
  | |____spanish.js
  | |____index.js
  | |____english.js
  |____app.js
```

```javascript
// spanish.js

const greet = () => console.log("Hola!");

module.exports = greet;
```

```javascript
// english.js

const greet = () => console.log("Hello!");

module.exports = greet;
```

```javascript
// index.js

const english = require("./english");
const spanish = require("./spanish");

module.exports = {
  english,
  spanish
};
```

```javascript
// app.js

const greet = require("./index");

greet.english();
// => Hello!

greet.spanish();
// => Hola!
```

## 1.2 Module patterns

### Pattern 1

```javascript
//greet1.js

module.exports = () => console.log("Hello World");
```

```javascript
//app.js

const greet = require("./greet1");
greet();

// => Hello World
```

### Pattern 2

```javascript
//greet2.js

module.exports.something = () => console.log("Hello World!");
```

```javascript
//app.js

const greet = require("./greet2").something;

greet();
// => Hello World!
```

### Pattern 3

```javascript
//greet3.js

class Greet {
  constuctor() {
    this.greeting = "Hello World!!";
    this.sayHello = () => console.log(this.greeting);
  }
}

module.exports = new Greet();
```

```javascript
//app.js

const greet = require("./greet3");

greet.sayHello();

// => Hello World!!

greet.greeting = "New Greeting!";

const greet2 = require("./greet3");

greet2.sayHello();

// => New Greeting!
```

`require` caches (or stores) the results of the require function for any particular filename, which is why it will return the cached instance of `Greet()` even when we require it a second time as `greet2`.
