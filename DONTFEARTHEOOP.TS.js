"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var WesternTown = /** @class */ (function () {
    function WesternTown() {
        this.stables = 3;
        this.location = "western America";
        this.time = 1850;
    }
    return WesternTown;
}());
exports.WesternTown = WesternTown;
var Humans = /** @class */ (function () {
    function Humans() {
        this.legs = 2;
        this.arms = 2;
        this.eyes = 2;
        this.nose = 1;
        this.mouth = 1;
    }
    Humans.prototype.whatIsYourName = function () {
        return this.name;
    };
    return Humans;
}());
exports.Humans = Humans;
var Villain = /** @class */ (function (_super) {
    __extends(Villain, _super);
    function Villain() {
        var _this = _super.call(this) || this;
        _this.look = "Mean";
        _this.drunkenness = 0;
        _this.numberOfDamsels = 0;
        return _this;
    }
    Villain.prototype.drinkWiskey = function () {
        this.drunkenness++;
    };
    Villain.prototype.howDrunkAmI = function () {
        return this.drunkenness;
    };
    Villain.prototype.tieUpDamsel = function (damsel) {
        this.damsel = damsel;
        this.numberOfDamsels++;
        console.log("The Villian has tied up" + damsel.whatIsYourName());
    };
    return Villain;
}(Humans));
exports.Villain = Villain;
var gunFight = /** @class */ (function () {
    function gunFight() {
        var sweatyPost = new WesternTown();
        sweatyPost.saloons = 10;
        sweatyPost.sheriffs = 1;
        sweatyPost.troublemakers = 5;
        var maurice = new Villain();
        maurice.hatColor = "black";
        maurice.mustacheColor = "red";
        maurice.sex = "Male";
        maurice.horsename = "Beer Gut";
        maurice.whiskeyPreference = "Jack Daniels";
        var mary = new Humans();
        mary.sex = "female";
        mary.horsename = "Midnight";
        mary.whiskeyPreference = "Stright";
        mary.name = "Mary";
        maurice.drinkWiskey();
        console.log(maurice.howDrunkAmI());
        maurice.tieUpDamsel(mary);
    }
    gunFight.prototype.getGunFight = function () {
        return gunFight;
    };
    return gunFight;
}());
exports.gunFight = gunFight;
