// import ClockPlugin from '/lib/clock.js';

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // SpriteSheet
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});        
        // Images
        this.load.image('rocket', 'assets/shark1.png');        
        this.load.image('rocket2', 'assets/shark2.png');
        //this.load.image('spaceship', 'assets/fish_fast.png');
        this.load.image('fish_blue', 'assets/fish_blue.png');
        this.load.image('fish_yellow', 'assets/fish_yellow.png');
        this.load.image('fish_red', 'assets/fish_red.png');
        this.load.image('fish_fast', 'assets/fish_fast.png');

        this.load.image('starfield', 'assets/starfield.png');        
        this.load.image('fire eye', 'gallery/fire_eye2.png');
        this.load.image('rainbow', 'gallery/water2.png');
        this.load.image('spark0', 'assets/blue.png');
        this.load.image('spark1', 'assets/red.png');
        // Plugin
        this.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);        

    }

    create() {

        // title sprite        
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'rainbow').setOrigin(0, 0);
        
        //  borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x2b2a33).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x2b2a33).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x2b2a33).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x2b2a33).setOrigin(0, 0);
        
        // rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // rocket2 here
        this.p2Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket2').setOrigin(0.5, -10);        

        // keys/input setup 
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      
        // MY SHIPS
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5 + borderPadding*2, 'fish_blue', 0, 30, 0).setOrigin(0, 0); // 2nd to top
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*4, 'fish_yellow', 0, 20, 0).setOrigin(0,0);  // 
        this.ship03 = new Spaceship(this, game.config.width                 , borderUISize*7 + borderPadding*6, 'fish_red', 0, 10, 0).setOrigin(0,0);  // bottom
        this.ship04 = new Spaceship(this, game.config.width + borderUISize*9, borderUISize*4                  , 'fish_fast', 0, 40, 3).setOrigin(0, 0); // special, top
        

        // create anim
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            framRate: 30
        })

        // Particle Emitter
        this.emitter0 = this.add.particles('spark0').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',            
            on: false,
            lifespan: 600,
            gravityY: 800
        });
    
        this.emitter1 = this.add.particles('spark1').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            blendMode: 'SCREEN',
            on: false,
            lifespan: 300,
            gravityY: 800
        });

        // init score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 50
        }
        // Score
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*5, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // create clock
        this.clock = this.plugins.get('rexclockplugin').add(this);
        this.clock.start(); // start clock
        // init time
        this.p1time = this.game.settings.gameTimer;
        this.add_time = 0;
        this.to_ten = 0; // track 0-10 points
        this.rocket_flag = 0; // track rocket in use, 0=1, 1=2
        // // display time
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 50
        }

        // Time
        this.timeLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1time, timeConfig);
                
    }

    update() {

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // check end of game
        if (this.clock.now >= (this.game.settings.gameTimer + (this.add_time * 1000))) {
             this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', timeConfig).setOrigin(0.5);
             this.add.text(game.config.width/2, game.config.height/2 + 64, '← for Menu', timeConfig).setOrigin(0.5);
             //this.timeLeft.text = this.game.settings.gameTimer + (this.add_time * 1000); // set timer to full, time is one step behind
             this.timeLeft.text = 0;
             this.gameOver = true;
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        else if (this.gameOver && this.clock.now >= ((this.game.settings.gameTimer + (this.add_time * 1000)) + 3000)) { // return anyway, 3s
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 16; // was 4

        // rocket switcher        
        if (this.to_ten >= 10) {
            this.p1Rocket.setOrigin(0.5, -10);
            this.p1Rocket = this.p2Rocket;
            this.p1Rocket.setOrigin(0.5, 0);
            this.to_ten = 0; // reset
            this.rocket_flag = 1;
        }
            
        if (!this.gameOver) {
            this.p1Rocket.update(this.rocket_flag);
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
            
            // update time                               
            this.p1time = (this.game.settings.gameTimer + (this.add_time * 1000)) - this.clock.now;                      
            this.timeLeft.text = this.p1time;           
        }       

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       

        // Emitter Explosion
        this.emitter0.setPosition(ship.x, ship.y);
        this.emitter1.setPosition(ship.x, ship.y);
        this.emitter0.explode();
        this.emitter1.explode();
        //ship.reset();
        //ship.alpha = 1;


        // add points
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        
        // add time
        //this.p1time += ship.points / 10;
        //this.timeLeft.text = this.p1time;
        this.add_time += ship.points / 10;
        this.to_ten += ship.points / 10;

        // sound
        this.sound.play('sfx_explosion')
      }

}