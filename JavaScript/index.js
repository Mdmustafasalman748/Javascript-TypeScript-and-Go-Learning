class Car {
  constructor(color, plate) {
	this.color = color;
	this.plate = plate;
	this.wheel = "R12";
	this.engine = "v6";
  }
  display() {
	console.log(`This is the color ${this.color} and number of car ${this.plate}`);
  }
}

const c = new Car("black", 123);
const c1 = new Car("white", 987);
c.display();
c1.display();
