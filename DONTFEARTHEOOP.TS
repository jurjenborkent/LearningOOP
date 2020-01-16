export class WesternTown {
    public stables: number;
    public saloons: number;
    public sheriffs: number;
    public troublemakers: number;
    public location: string;
    public time: number;


    constructor() {
        this.stables = 3;
        this.location = "western America";
        this.time = 1850;
    }

}

export class Humans {
    public legs: number;
    public arms: number;
    public eyes: number;
    public nose: number;
    public mouth: number;
    public name: string;
    public sex: string;
    public horsename: string;
    public whiskeyPreference: string;

    constructor() {
        this.legs = 2;
        this.arms = 2;
        this.eyes = 2;
        this.nose = 1;
        this.mouth = 1;
    }

    whatIsYourName() {
        return this.name;
    }
}

export class Villain extends Humans {
    mustacheColor: string;
    hatColor: string;
    look: string;
    drunkenness: number;
    numberOfDamsels: number;
    damsel: Humans;

    constructor() {
        super();
        this.look = "Mean";
        this.drunkenness = 0;
        this.numberOfDamsels = 0;
    }

    drinkWiskey() {
        this.drunkenness++;
    }

    howDrunkAmI() {
        return this.drunkenness;
    }

    tieUpDamsel(damsel: Humans) {
        this.damsel = damsel;
        this.numberOfDamsels++;
        console.log("The Villian has tied up" + damsel.whatIsYourName());
    }
}

export class gunFight {
    constructor() {
        let sweatyPost = new WesternTown();
        sweatyPost.saloons = 10;
        sweatyPost.sheriffs = 1;
        sweatyPost.troublemakers = 5;

        let maurice = new Villain();
        maurice.hatColor = "black";
        maurice.mustacheColor = "red";
        maurice.sex = "Male";
        maurice.horsename = "Beer Gut";
        maurice.whiskeyPreference = "Jack Daniels";

        let mary = new Humans();
        mary.sex = "female";
        mary.horsename = "Midnight";
        mary.whiskeyPreference = "Stright";
        mary.name = "Mary";

        maurice.drinkWiskey();
        console.log(maurice.howDrunkAmI());
        maurice.tieUpDamsel(mary);
    }
}
























