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

const Emitter = require("events");

var emtr = new Emitter();

emtr.on("greet", () => console.log("something happened"));

emtr.on("greet", () => console.log("a greeting occured"));

console.log("Hello!");

emtr.emit("greet");
