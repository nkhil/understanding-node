## Problems that node solved (or added to the V8 engine)

**1. Provided better ways to organise code into reusable pieces**

For eg: `module.exports` and `require`

**2. Ways to deal with files**

For eg: `fs`

## Events & event emitter

An event is something that has happened in an app that you can respond to.

In node, we can talk about 2 different kinf of events:

**System events**
(comes from the C++ core) that deals with events coming from the computer system. For eg: 'finished reading a file', 'file is open', 'data received from the internet' etc.

**Custom Events**
(comes from the event emitter inside JavaScript core).

The JS side is 'faking it' i.e. they're not real events. JS doesn't have an `event` object. We can fake it with an event library that the `node event emitter` uses.

### Building your own event emitter to understand node's event emitter

```javascript
//emitter.js

class Emitter {
  constructor() {
    this.events = {};
  }

  on(type, listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  emit(type) {
    if (this.events[type]) {
      this.events[type].forEach(listener => listener());
    }
  }
}

module.exports = Emitter;
```

```javascript
//app.js

const Emitter = require("./emitter");

var emtr = new Emitter();

emtr.on("greet", () => console.log("something happened"));

emtr.on("greet", () => console.log("a greeting occured"));

console.log("Hello!");

emtr.emit("greet");

//=>Hello!
//=>something happened
//=>a greeting occured
```

The `event emitter` in node follows a similar idea.

### Using the node.js event emitter

```javascript
//app.js

// call node's emitter instead of the one built above
const Emitter = require("events");

var emtr = new Emitter();

emtr.on("greet", () => console.log("something happened"));

emtr.on("greet", () => console.log("a greeting occured"));

console.log("Hello!");

emtr.emit("greet");

//=>Hello!
//=>something happened
//=>a greeting occured
```

Gives us the same result as above.

**The magic string problem**

Relying on strings to be the basis for logic in your code can be problematic. This is referred to a `magic string`, a string that has some special meaning in your code. This is bad because it makes it easy for a typo to cause a bug - and it's something that is hard for tools (like VS Code for eg) to help us find.

**Here's one pattern to deal with that**

Let's remove the fact that we're relying on typing the string correctly without any help from a debugger.

**Creating a config module**

```javascript
//config.js

module.exports = {
  events: {
    GREET: "greet",
    FILESAVED: "filesaved",
    FILEOPENED: "fileopened"
  }
};
```

```javascript
//app.js

const eventConfig = require("./config").events;
const Emitter = require("events");

var emtr = new Emitter();

emtr.on(eventConfig.GREET, () => console.log("something happened"));

emtr.on(eventConfig.GREET, () => console.log("a greeting occured"));

console.log("Hello!");

emtr.emit(eventConfig.GREET);

//=>Hello!
//=>something happened
//=>a greeting occured
```

This ensures that the errors in the code will give us better error messages.

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
