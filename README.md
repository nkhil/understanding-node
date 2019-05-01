## Patterns in node

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

  class Greet(){

    constuctor() {
      this.greeting = "Hello World!!";
      this.sayHello = () => console.log(this.greeting)
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

The `cacheModule` stores 

`require` (caches or stores) the results of the require function for any particular filename, which is why it will return the cached instance of `Greet()` even when we require it a second time as `greet2`. 
