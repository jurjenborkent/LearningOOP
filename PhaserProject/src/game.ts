import 'phaser';
import Enemy from './objects/enemy';

export default class map extends Phaser.Scene {
    enemies: Phaser.GameObjects.Group;

    constructor() {
        super('map');
    }

    preload() {
        this.load.atlas('sprites', '../assets/spritesheet.png', '../assets/spritesheet.json');
        this.load.image('bullet', '../assets/bullet.png');
    }

    create() {

        // const kleineEnemy = new Enemy(this, 0, 0, 'sprites', 'enemy');
        // const grooteEnemy = new Enemy(this, 10, 10, 'sprites', 'enemy2');

        let graphics = this.add.graphics();

        // path van de enemys
        // parameters zijn begin punt van x en y

        const path = this.add.path(96, -32);
        path.lineTo(96, 164);
        path.lineTo(480, 164);
        path.lineTo(480, 544);

        graphics.lineStyle(5, 0x000000, 1);
        path.draw(graphics);

        this.enemies = this.add.group({ classType: Enemy, runChildUpdate: true });
    
      
    }
    update() {

    }

}
const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    width: 800,
    height: 600,
    scene: map
};

const game = new Phaser.Game(config);

