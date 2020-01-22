import 'phaser';
import 'game.ts';
import { Follower } from '../models'


export default class Enemy extends Phaser.GameObjects.Image {
    // private scene: Phaser.Scene;
    follower: Follower;
    enemySpeed: number;
    path: Phaser.Curves.Path;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string,
        frame: string | number, path: Phaser.Curves.Path) {
        super(scene, x, y, texture, frame);
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.enemySpeed = 1 / 10000;
        this.path = path;
        console.log('enemy created')
    }

    create() {
        Phaser.GameObjects.Image.call(this.scene, this.x, this.y, this.texture, this.frame);
        console.log('enemy spawn');
    }

    startOnPath() {
        this.follower.t = 0;
        this.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        console.log('enemy start on path')
    }

    update(time: number, delta: number) {
        this.follower.t += this.enemySpeed * delta;
        this.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

}