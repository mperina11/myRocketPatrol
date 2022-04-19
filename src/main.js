/*
 * 
 *  BreakDown of Points
 * 
 * Intermediate Tier
 *  - Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
 *      - The topmost fish
 *  - Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
 *      - Seen in top left, time is added when fish hit
 *  - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
 *      - Can see blue and red particles on fish hit
 *  - Create and implement a new weapon (w/ new behavior and graphics) (20)
 *      - There are 2 sharks
 *          - 1: can move x/y axis on bottom and fire
 *          - 2: can move x/y axis on bottom and in flight after fire
 *  - Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20) 
 *      - rocker is now shark
 *      - spaceship is now diff fish
 *      - explosion is reskinned
 * 
 *  Novice Tier
 *  - Display the time remaining (in seconds) on the screen (10)
 *      - seen in top left of screen
 * 
*/



let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
};

// Game object
let game = new Phaser.Game(config);

// UI setup
let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyLEFT, keyRIGHT;
