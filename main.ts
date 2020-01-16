export {}
let message = "Welcome back"
console.log(message);

let x = 10;

const y = 20;

let sum;

const title = "Oefeningen Jurjen";
let isBeginner: boolean = true;
let name: string = "Jurjen";

let sentence: string = `My name is ${name} I am a beginner in Typescript`;

;console.log(sentence)

function add(num1: number, num2: number): number {
   if (num2)
    return num1 + num2;
    else
    return num1;
}

add(5, 10)


// objecten kunnen het type interface krijgen 


interface Person {
    firstName: string;
    lastName: string;
}

function fullName(person: Person) {
    console.log(`${person.firstName} ${person.lastName}`);
}

let p = {
    
}

interface Person {
    firtName: string,
    lastName: string
}

class Employee {
    public employeeName: string;

     constructor(name: string) {
         this.employeeName = name;
     }

     greet() {
         console.log(`Good Morning ${this.employeeName}`);
     }

}

let emp1 = new Employee('Vishwas');
console.log(emp1.employeeName);
emp1.greet();


class Manager extends Employee {
    constructor(managerName: string) {
        super(managerName);
    }

    delegateWork() {
        console.log(`Manager delegating task`);
    }
}

let m1 = new Manager('Bruce')
m1.delegateWork();
m1.greet();
console.log(m1.employeeName);

// met public kunnen class member buiten de class gebruikt worden.
// met private mogen de class members niet buiten de class gebruikt worden.
// met protected mogen de class members wel gebruikt worden in een gekopppelde class maar niet buiten deze classes om.

// waarom typescript :
// Strong typing, keuze om aan elke var een type te geven. maakt het makkelijk om te debuggen
// OOP features als classes, interfaces, constructors, access modifiers zoals public, private, protected, fills, properties.
// Errors compile ipv tijdens het builden/runnen.
// Tools: intelligentie, definitions 

