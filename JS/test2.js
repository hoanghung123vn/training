class Person {
  constructor(name) {
    this._name = name;
  }

  get _name() {
    return this.name.toUpperCase();
  }

  set _name(newName) {
    if (newName === "hello") console.log("err");
    else return this.name = newName;
  }

  walk() {
    console.log(this.name + ' is walking.');
  }
}

let bob = new Person('Bob');
bob.name = "hello";
console.log(bob.name);  // Outputs 'BOB'
