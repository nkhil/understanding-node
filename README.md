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

### Pattern 4

Alternatively, you can also export the class instead of an instance of the class.

For eg:

```javascript
//greet4.js

class Greet {
  constuctor() {
    this.greeting = "Hello World!!!";
    this.sayHello = () => console.log(this.greeting);
  }
}

module.exports = Greet;
```

```javascript
//app.js

const Greet = require("./greet4");
const greet = new Greet();
greet.sayHello();
// => Hello World!!!

// You can also make more fresh instances which will not inherit from `greet`
// For eg:
const greet1 = new Greet();
const greet2 = new Greet();

// ...are their own instances and do not inherit from any other cached instances like in pattern 3.
```

### Pattern 5

This pattern is extremely popular and useful.

```javascript
//greet5.js
const greeting = "Hello World!!!!";

const greet = () => console.log(greeting);

module.exports = { greet };
```

```javascript
const greet = require("greet5").greet;

greet();
// => Hello World!!!!
```

Notice that you're only exporting the function `greet` and not touching the `greeting` constant. When greet is executed, `greet` will still have access to `greeting`, but you won't have direct access to `greeting` outside the module.

You're simply revealing only the functions or properties that you want the world to use. This is called `the revealing module pattern`, where you expose only the desired properties and methods to protect code within modules. Keep the module useful while protecting the contents.
