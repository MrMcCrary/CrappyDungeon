/*
TO DO:
Features:
	- add title screen
	- add shops (weapons, armor, potions)
	- add high scores
	- add level generator
	- orginize code
	- moving mobs
	- different characters/races
Bugs:

*/

var version = "2.2.5"; //first digit is huge updates, second is batch updates/additions, third is bug fixes

new p5();

var gameState = "play";

var level = 0;

var chatSize = 20; 

var lootTables = {
	dungeon1 : [["Sword of Ayy LMAO", "Chosen by Ayy LMAO Himself", 10, 0, 0],["Chestplate of Dat Boi", "Oh Shit You Dead",0,0, -1],[]],
	pickLoot : function(lootTable){
		return (random(lootTable));
	}
}

var chat = {
	messages: [["hello",NORMAL,"#256b34"],["bloop",ITALIC,'#f10g00']],
	messagesShown:10,
	showChat:function(){
		textSize(chatSize);	
			if(chat.messagesShown <= chat.messages.length){
				for(i = chat.messages.length - 1; i > chat.messages.length - chat.messagesShown - 1; i -= 1){
					fill(this.messages[i][2]);
					textStyle(this.messages[i][1]);
					text(": " + chat.messages[i][0],blockSize,(innerHeight - blockSize) - (chat.messages.length - 1 - i)* chatSize);
				}
			} else {
				for(i = chat.messages.length - 1; i > - 1; i -= 1){
					fill(this.messages[i][2]);
					textStyle(this.messages[i][1]);
					text(": " + chat.messages[i][0],blockSize,(innerHeight - blockSize) - (chat.messages.length - 1 - i)* chatSize);
				}
			}
			
			
	}
}

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
	textSize(chatSize);
	fill("ffff");
	text("ver:  " + version,blockSize,chatSize);
	text("Health:  " + character.health,blockSize,chatSize*2)
	chat.showChat();
}

var character = {
	startingHealth: 100,
	startingAttack: 5,
	health:0,
	damage:0,
	inventory : [["sword of fubar","lalala",0,0,0],],
	itemAtributes : ["Item Name", "Lore", "Damage Modifier", "Max Health Modifier", "Defense Modifier"], 
	inventoryLoopLength : 5,
	applyModifier : function (modifierIndexPos){
		var modvalue = 0;
		for (i = 0; i < this.inventory.length; i +=1){
				modvalue += (this.inventory[i][modifierIndexPos]);
			}
		return modvalue;
		console.log(modvalue);
	}
	
}

function blockInteraction(xValue,yValue){
	if (world.map[checkSpot(world.map, xValue, yValue) + 2] == "mob"){
			console.log("mob!");
			attack(checkSpot(world.map, xValue , yValue));
		}
	if (world.map[checkSpot(world.map, xValue, yValue) + 2] == "chest"){
			console.log("chest!");
			chestInteraction(checkSpot(world.map, xValue, yValue));
		}
		
}

function attack (xindex){
	world.map[xindex + 4] -= (character.damage + character.applyModifier(2));//damaging the mob
	console.log(world.map[xindex + 4]);
	character.health -= (world.map[xindex + 3]) + character.applyModifier(4);//getting damaged by mob
	console.log(character.health);
	if (world.map[xindex + 4] <= 0){
		world.map.splice(xindex,5);
	}
	if (character.health <= 0){
		gameState = "GameOver";
	}
	chat.messages.push(["mob!",NORMAL, "#FFFFFF"]);//adding message to chat about mob
}

function chestInteraction (xindex){
	character.inventory.push(world.map[xindex + 4]);
	world.map.splice(xindex,5);
	chat.messages.push(["You Found An Item in The Chest!",BOLD,"#ffcc66"]);
	for (i = 0; i < character.inventoryLoopLength ; i ++){
		if(character.inventory[character.inventory.length - 1][i] != 0 && i != 1 ){
			chat.messages.push([character.itemAtributes[i] + ": " + character.inventory[character.inventory.length - 1][i], NORMAL, "#ffffff"]);
		}
	}	
	chat.messages.push(["Lore: " + character.inventory[character.inventory.length - 1][1], ITALIC, "#FFFFFF"]);
}

var blockSize = 40;//the width/height of blocks

var lightWidth = blockSize*10;// how far you can see

var middleX = (innerWidth/2) - ((innerWidth/2) % blockSize);

var middleY = (innerHeight/2) - ((innerHeight/2) % blockSize);

var speed = 10;//fps and running speed 

var edit = false;// edit mode (m to turn on, n to turn off, b to print info, f = wall, g = mob)

function printInfo(){
	chat.messages.push(["middle x:  " + middleX, NORMAL, "#FFFFFF"]);
	chat.messages.push(["middle y:  " + middleY, NORMAL, "#FFFFFF"]);
	chat.messages.push(["health:  " + character.health, NORMAL, "FFFFFF"]);
	chat.messages.push(["attack:  " + (character.attack + character.applyModifier(2)), NORMAL, "#FFFFFF"]);
	chat.messages.push(["block size:  " + blockSize, NORMAL, "#FFFFFF"]);
	chat.messages.push(["world x:  " + world.x, NORMAL,"#FFFFFF"]);
	chat.messages.push(["world y:"  + world.y,NORMAL,"#FFFFFF"]);
	//chat.messages.push(["["+"map:  " + world.map,NORMAL,"#ffffff"+"]"]);
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
					//text(this.map[i] + this.x, this.map[i + 1] + this.y, this.map[i + 4] )
				}
				if (world.map[i+3] <= 40 && world.map[i+3] >= 60){
					fill('e53d3d');
					rect(this.map[i] + this.x, this.map[i + 1] + this.y, blockSize, blockSize);
					//text(this.map[i] + this.x, this.map[i + 1] + this.y, this.map[i + 4] )
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
	return value - (value % blockSize);
}

function move (){
	if (keyIsDown(83)){
		speed = 30;
	} else {
		speed = 10;
	}
	
	//if (keyIsDown())
	
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
		blockInteraction(middleX - world.x,middleY + blockSize - world.y);
		if (check(world.map, middleX - world.x , middleY + blockSize  - world.y) != true){
			world.y -=blockSize;
		}
		
	}
	
	if (keyIsDown(UP_ARROW)) {
		blockInteraction(middleX- world.x, middleY - blockSize - world.y);
		if(check(world.map, middleX- world.x, middleY - blockSize - world.y) != true){
			world.y += blockSize;
		}
		
	}
	
	if (keyIsDown(LEFT_ARROW)){
		blockInteraction(middleX - blockSize- world.x,middleY- world.y);
		if( check(world.map,middleX - blockSize- world.x,middleY- world.y) != true){
			world.x += blockSize;
		}
		
	}
	
	if (keyIsDown(RIGHT_ARROW)){
		blockInteraction(middleX + blockSize- world.x, middleY- world.y);
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
		 	world.map.push(roundToBlockSize(mouseX - world.x));
			world.map.push(roundToBlockSize(mouseY - world.y));
			world.map.push("wall");
			world.map.push(0);
			world.map.push(0);
		} 
		if(keyIsDown(71) && check(world.map, roundToBlockSize(mouseX), roundToBlockSize(mouseY)) != true){
			world.map.push(roundToBlockSize(mouseX - world.x));//x coord of new block
			world.map.push(roundToBlockSize(mouseY - world.y));//y coord of new block
			world.map.push("mob");//type of new block
			world.map.push(10);//attack of new mob
			world.map.push(10);// health of new mob
			
		}
		if(keyIsDown(67) && check(world.map, roundToBlockSize(mouseX), roundToBlockSize(mouseY)) != true){
			world.map.push(roundToBlockSize(mouseX - world.x));//x coord of new block
			world.map.push(roundToBlockSize(mouseY - world.y));//y coord of new block
			world.map.push("chest");//type of new block
			world.map.push(10); //# of ran items
			world.map.push(lootTables.pickLoot(lootTables.dungeon1)); //specific items
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