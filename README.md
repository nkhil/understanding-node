_These are notes taken by me while doing a couple of online courses and reading the node documentation. These might not be entirely straightforward for you. If you spot any inaccuracies, please feel free to make a PR._

## Problems that node solved (or added to the V8 engine)

**1. Provided better ways to organise code into reusable pieces**

For eg: `module.exports` and `require`

**2. Ways to deal with files**

For eg: `fs`

## Event driven non blocking I/O in V8 JavaScript

We know that V8 is embedded inside of node, and that's what is executing the JavaScript code. The I/O stuff is happening at the OS level (things like opening files, sending information over http etc), so the event driven part is where the OS is being asked to do things, which in turn returns the events to the `libuv event loop`. And because the JS code can continue to run (using the V8 engine) while `libuv` can do the OS level work - it's referred to as `non blocking`. 

System events handled inside the C++ core are handled by a C library called **Libuv**. 

[![Untitled-2.jpg](https://i.postimg.cc/DZDtcj0W/Untitled-2.jpg)](https://postimg.cc/FdyWrxjm)

The V8 engine runs the code synchronously - one line of code at a time, as functions are called etc. 

Libuv is written to deal with events happening in the operating system. Libuv interfaces with the OS. Libuv has a queue of events that have completed - note that this happens at the same time that the V8 engine is executing its code. 

At some point, the operating system will place an event (response) on Libuv's event stack. 

Libuv will then see that something is complete, it processes it and runs a callback i.e. code that is meant to be run when an event completes. 

The callback will involve JS code running. But it will run only when the V8 engine has completed doing its operations. 

The entire process is asynchronous, as there are things happening inside V8 as well as Libuv, making it event driven and non blocking. 

### Quick aside on blocking Vs non-blocking code

An example of blocking process would be if calling a function that was responsible for getting and reading a file, and waiting for that function to complete before going further. 

Non-blocking process means that you can delegate the task of file fetching to Libuv, and V8 can continue onto the next line or block.



## Events & event emitter

An event is something that has happened in an app that you can respond to.

In node, we can talk about 2 different kinds of events:

**System events**
(comes from the C++ core) that deals with events coming from the computer system. For eg: 'finished reading a file', 'file is open', 'data received from the internet' etc.

**Custom Events**
(comes from the event emitter inside JavaScript core).

these are events are technically 'faking it' i.e. they're not real events. JS doesn't have an `event` object. We can fake it with an event library that the `node event emitter` uses.

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

const emtr = new Emitter();

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

Relying on strings to be the basis for logic in your code can be problematic. This is referred to **`a magic string`**, a string that has some special meaning in your code. This is bad because it makes it easy for a typo to cause a bug - and it's something that is hard for tools (like VS Code for eg) to help us find.

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

## Inheriting from the event emitter

Within `util.js` (part of the node library), there's a method called `inherits` that can help with this.

`inherits` takes 2 constructors `ctor` and `superCtor`.

**ctor**: a function constructor upon which you want to add new methods and properties to be available to objects created with it.

**superCtor**: The super constructor where the properties and methods you want to be made available to your `ctor` object sit.

For eg:

```javascript
//app.js

const EventEmitter = require("events");
const util = require("util");

// Declare a Greetr object
class Greetr {
  constructor() {
    this.greeting = "Hello world!";
  }
}

// Give Greetr methods from EventEmitter
util.inherits(Greetr, EventEmitter);

// Add a greet method on Greetr's prototype
// use the emit method that's inherited from EventEmitter
Greetr.prototype.greet = function() {
  console.log(this.greeting);
  this.emit("greet");
};

const greetr1 = new Greetr();

// Use the on method inherited from EventEmitter
greetr1.on("greet", () => console.log("someone greeted"));

greetr1.greet();

//=> Hello World!
//=> someone greeted
```

The chain of events when `greetr1.greet()` is called is:

- The `console.log()` is called giving us `Hello World!`.
- `emit` is called, which checks to see if the `greet` argument that's passed to it, already exists inside the `events` object in its constructor.
- In this case, as `greetr1.on` is called with `greet` as the first argument, emit then triggers a call to the other argument passed into `greetr1.on`, which in this case logs `someone greeted` to the console.

## Inheriting from the event emitter 2

It seems like `util.inherits()` is discouraged.

**From the [documentation](https://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor)**

> Usage of util.inherits() is discouraged. Please use the ES6 class and extends keywords to get language level inheritance support

Here's how to use the `extends` keyword, and to call `super()` to give your `Child` class access to the constructor properties on the super class.

```javascript
//app.js

class Parent {
  constructor() {
    this.age = 23;
  }

  sayHello() {
    console.log("Hello");
  }
}

class Child extends Parent {
  constructor() {
    super();
    this.name = "Rick";
  }
}

const child = new Child();
child.sayHello();
console.log(child.age);

//=> Hello
//=> 23
```

## `.call` in JavaScript

```javascript
// app.js
const obj = {
  name: "James",
  greet: function() {
    console.log(`Hello ${this.name}`);
  }
};

obj.greet();
//=> Hello James
```

You can also use `.call` on an object to invoke it, and it works just like using parenthesis

```javascript
obj.greet();
//=> Hello James
obj.greet.call;
//=> Hello James
```

However, you can also pass in an argument via the `call` method to change what the keyword `this` refers to when that function runs.

For eg:

```javascript
obj.greet.call({ name: "Jane" });

//=> Hello Jane
```

In case the original function takes arguments, here's how you pass them in.

```javascript
// app.js

const obj = {
  name: "James",
  greet: function(year, age) {
    console.log(
      `My name is ${
        this.name
      }. I am ${age} year(s) old and I was born in ${year}`
    );
  }
};

obj.greet.call({ name: "Jane" }, 1998, 19);

//=> My name is Jane. I am 19 years old and I was born in 1998

obj.greet(1987, 31);

//=> My name is James. I am 31 years old and I was born in 1987
```

## `.apply` in JavaScript

Similar to using `.call` above, `.apply` can be used like so:

```javascript
obj.greet();
//=> Hello James

obj.greet.call;
//=> Hello James

obj.greet.apply;
//=> Hello James
```

However, if the original function has parametres, you pass it as an array.

```javascript
// app.js

const obj = {
  name: "James",
  greet: function(year, age) {
    console.log(
      `My name is ${
        this.name
      }. I am ${age} year(s) old and I was born in ${year}`
    );
  }
};

obj.greet.apply({ name: "Jane" }, [1998, 19]);

//=> My name is Jane. I am 19 years old and I was born in 1998
```

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

## Handling errors in your code[](#errorhandling)

Usually, you'd use the `fetch` method inside `async` functions, and have `try / catch` blocks to catch your errors.

A useful pattern is to not have the `try / catch` block to make your code more readable. When you call your method, wrap it in a helper method that takes care of catching your errors.

```javascript
// errorHandlers.js
exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
```

```javascript
//controller.js

exports.doStuff = async (req, res) => {
  const names = await Name.find();
  res.render("names", { title: "names", names });
};
```

```javascript
//router.js

const { catchErrors } = require("../handlers/errorHandlers");
const controller = require("../controllers/controller");

router.get("/", catchErrors(controller.doStuff));
```
