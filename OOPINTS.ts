class Person {
    firstName: string;
    lastName: string;

    getFullName()  {
        return this.firstName + this.lastName;
    }
}

let aPerson = new Person(); 
aPerson.firstName = "Jurjen";
console.log(aPerson);


class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");


// hello world 


// enums in TS

export enum gameControls {
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39,
}

let huidigeControl: gameControls.DOWN

if (huidigeControl === gameControls.DOWN) {
    console.log('We gaan naar beneden');
}



