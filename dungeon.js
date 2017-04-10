/*
TO DO:
Features:
	- add title screen
	- add chests  ~ somewhat done
	- add shops (weapons, armor, potions)
	- add high scores
	- add level generator
	- orginize code
	- moving mobs
	- different characters/races
Bugs:
	- not damaging mobs
*/

var version = "2.0.5"; //first digit is huge updates, second is batch updates/additions, third is bug fixes

new p5();

var gameState = "play";

var level = 0;

function restart (){
	character.health = character.startingHealth;
	character.attack = character.startingAttack;
	edit = false;
	lightWidth = blockSize*10;
	world.x = 0;
	world.y = 0;
	world.map = world.levels.levels[0];
	
}

function hud (){
	textSize(32);
	fill("ffff");
	text("ver:  " + version,blockSize,innerHeight-blockSize);
	text("Health:  " + character.health,middleX - blockSize,innerHeight-blockSize)
}

var character = {
	startingHealth: 100,
	startingAttack: 5,
	health:0,
	damage:5,
	inventory : [],//item name, lore, damage modifier, health modifier, light modifier, 
	
}

function attack (xindex){
	world.map[xindex + 4] -= character.damage;//damaging the mob
	console.log(world.map[xindex + 4]);
	character.health-= world.map[xindex + 3];//getting damaged by mob
	console.log(character.health);
	if (world.map[xindex + 4] <= 0){
		world.map.splice(xindex,5);
	}
	if (character.health <= 0){
		gameState = "GameOver";
	}
}

var blockSize = 30;//the width/height of blocks

var lightWidth = blockSize*10;// how far you can see

var middleX = (innerWidth/2) - ((innerWidth/2) % blockSize);

var middleY = (innerHeight/2) - ((innerHeight/2) % blockSize);

var speed = 10;//fps and running speed 

var edit = false;// edit mode (m to turn on, n to turn off, b to print info, f = wall, g = mob)

function printInfo(){
	console.log("middle x:  " + middleX);
	console.log("middle y:  " + middleY);
	console.log("health:  " + character.health);
	console.log("attack:  " + character.attack);
	console.log("block size:  " + blockSize);
	console.log("world x:  " + world.x);
	console.log("world y:"  + world.y);
	console.log("map:  " + world.map);
}

function gameOver(){
	background(0);
	fill("fffff");
	text("Game Over", innerWidth / 2, innerHeight/2 - blockSize)
	if (keyIsPressed && keyCode == 32){
		gameState = "play";
		restart();
	}
}

var world = {
	

	x: 0,
	y: 0,
	levels : {
	levels : [
		[],
		[660, 240, "mob", 10, 10, 570, 270, "mob", 10, 10, 540, 270, "mob", 10, 10, 540, 300, "mob", 10, 10, 510, 360, "mob", 10, 10, 540, 390, "mob", 10, 10, 540, 420, "mob", 10, 10, 540, 450, "mob", 10, 10, 600, 420, "wall", 0, 0, 630, 420, "wall", 0, 0, 630, 390, "wall", 0, 0, 630, 360, "wall", 0, 0, 600, 330, "wall", 0, 0, 600, 300, "wall", 0, 0, 630, 120, "wall", 0, 0, 630, 90, "wall", 0, 0, 750, 150, "wall", 0, 0, 840, 240, "wall", 0, 0, 840, 300, "wall", 0, 0, 810, 300, "wall", 0, 0]
			]// array of arrays (levels/presets) 
},
	map: [],//x,y,"type",attack,health
	
	show_map: function () {
		var i = 0;
		while (i < this.map.length) {
			if (world.map[i + 2] == "wall"){
				fill(255,255,255);
				rect(this.map[i] + this.x, this.map[i + 1] + this.y, blockSize, blockSize);
			}
			if (world.map[i +2] == "mob"){
				if (world.map[i+3] < 20){
					fill('#e25f7b');
					rect(this.map[i] + this.x, this.map[i + 1] + this.y, blockSize, blockSize);
					text(this.map[i] + this.x, this.map[i + 1] + this.y, this.map[i + 4] )
				}
				if (world.map[i+3] <= 40 && world.map[i+3] >= 60){
					fill('e53d3d');
					rect(this.map[i] + this.x, this.map[i + 1] + this.y, blockSize, blockSize);
					text(this.map[i] + this.x, this.map[i + 1] + this.y, this.map[i + 4] )
				}
			}
			if (world.map[i + 2] == "chest"){
				fill("#ffcc66");
				rect(this.map[i] + this.x, this.map[i + 1] + this.y, blockSize, blockSize);
			}
			i += 5;
		}
	},
}

function roundToBlockSize (value){
	return value - (value % blockSize)
}

function move (){
	if (keyIsDown(83)){
		speed = 30;
	} else {
		speed = 10;
	}
	
	if (keyIsDown(77)){//m
		edit = true;
	}
	
	if (keyIsDown(78)){//n
		edit = false;
	}
	
	if (keyIsDown(66)){//b, print coords
		printInfo();
	}
	
	if (keyIsDown(DOWN_ARROW)){
		if (world.map[checkSpot(world.map, middleX - world.x , middleY + blockSize  - world.y) + 2] == "mob"){
			console.log("mob!");
			attack(checkSpot(world.map, middleX - world.x , middleY + blockSize  - world.y))
		}
		if (check(world.map, middleX - world.x , middleY + blockSize  - world.y) != true){
			world.y -=blockSize;
		}
		
	}
	
	if (keyIsDown(UP_ARROW)) {
		if (world.map[checkSpot(world.map, middleX - world.x , middleY - blockSize  - world.y) + 2] == "mob"){
			console.log("mob!");
			attack(checkSpot(world.map, middleX - world.x , middleY - blockSize - world.y))
		}
		if(check(world.map, middleX- world.x, middleY - blockSize - world.y) != true){
			world.y += blockSize;
		}
		
	}
	
	if (keyIsDown(LEFT_ARROW)){
		
		if (world.map[checkSpot(world.map, middleX - blockSize - world.x , middleY - world.y) + 2] == "mob"){
			console.log("mob!");
			attack(checkSpot(world.map, middleX - blockSize - world.x , middleY - world.y))
		}if( check(world.map,middleX - blockSize- world.x,middleY- world.y) != true){
			world.x += blockSize;
		}
		
	}
	
	if (keyIsDown(RIGHT_ARROW)){
		if (world.map[checkSpot(world.map, middleX + blockSize - world.x , middleY - world.y) + 2] == "mob"){
			console.log("mob!");
			attack(checkSpot(world.map, middleX + blockSize - world.x , middleY - world.y))
		}
		if(check(world.map, middleX + blockSize- world.x, middleY- world.y) != true){
			world.x -= blockSize;
		}
		
	}
}

function check (array, xValue, yValue) {
	for(var i=0; i <array.length; i +=5) {
        if (array[i] == xValue && array[i+1] == yValue) {
			return true;
		}
	}
}

function checkSpot (array, xValue, yValue) {
	for(var i=0; i <array.length; i +=5) {
        if (array[i] == xValue && array[i+1] == yValue) {
			return i;
		}
	}
} //returns x index of block at xValue and yValue if there is one

function mapEdit (){
	if (edit === true){
		if(keyIsDown(70) && check(world.map, roundToBlockSize(mouseX), roundToBlockSize(mouseY)) != true){
		 	world.map.push(roundToBlockSize(mouseX));
			world.map.push(mouseY - world.y - ((mouseY - world.y) % blockSize));
			world.map.push("wall");
			world.map.push(0);
			world.map.push(0);
		} 
		if(keyIsDown(71) && check(world.map, roundToBlockSize(mouseX), roundToBlockSize(mouseY)) != true){
			world.map.push(mouseX - world.x - ((mouseX - world.x) % blockSize));//x coord of new block
			world.map.push(mouseY - world.y - ((mouseY - world.y) % blockSize));//y coord of new block
			world.map.push("mob");//type of new block
			world.map.push(10);//attack of new mob
			world.map.push(10);// health of new mob
		}
		if(keyIsDown(67) && check(world.map, roundToBlockSize(mouseX), roundToBlockSize(mouseY)) != true){
			world.map.push(mouseX - world.x - ((mouseX - world.x) % blockSize));//x coord of new block
			world.map.push(mouseY - world.y - ((mouseY - world.y) % blockSize));//y coord of new block
			world.map.push("chest");//type of new block
			world.map.push(10);
			world.map.push(10);
		}
	}
}

function setup() {
    restart();
	createCanvas(innerWidth,innerHeight);
	frameRate(speed);
	background(0); //m = map editor," " = play
	
	
	
}

function draw() {
	if (gameState == "play"){
		frameRate(speed);
		background(0);
		fill("#4286f4");
		rect(middleX,middleY,blockSize,blockSize);// main character
		world.show_map(this.map);
		fill(0,0,0);
		rect(0,0,middleX-lightWidth,innerHeight);// narrowing out the view
		rect(0,0,innerWidth, middleY-lightWidth);
		rect(innerWidth,0,-lightWidth,innerHeight);
		rect(0,innerHeight,innerWidth,-(middleY-lightWidth));
		move();
		mapEdit();
		console.log(character.health);
		hud();
	}
	if (gameState == "GameOver"){
		gameOver();
	}
	
}