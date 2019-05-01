class Greet {
  constructor() {
    this.greeting = "Hello World!!";
    this.sayHello = () => console.log(this.greeting);
  }
}

module.exports = new Greet();
