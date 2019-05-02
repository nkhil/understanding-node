// const greet = require("./greet");

// // 1.1
// greet.spanish();
// greet.english();

// //1.2
// const greet1 = require("./patterns/pattern1");
// greet1();
// const greet2 = require("./patterns/pattern2").something;
// greet2();
// const greet3 = require("./patterns/pattern3");
// greet3.sayHello();
// greet3.greeting = "New Greeting!";
// const greet5 = require("./patterns/pattern5").greet;
// greet5();

// const eventConfig = require("./config").events;
// const Emitter = require("events");

// var emtr = new Emitter();

// emtr.on(eventConfig.GREET, () => console.log("something happened"));

// emtr.on(eventConfig.GREET, () => console.log("a greeting occured"));

// console.log("Hello!");

// emtr.emit(eventConfig.GREET);

const EventEmitter = require("events");
const util = require("util");

class Greetr {
  constructor() {
    this.greeting = "Hello world!";
  }
}

util.inherits(Greetr, EventEmitter);

Greetr.prototype.greet = function() {
  console.log(this.greeting);
  this.emit("greet");
};

const greetr1 = new Greetr();

greetr1.on("greet", () => console.log("someone greeted"));

greetr1.greet();
