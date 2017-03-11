"use strict";

var app = app || {};

app.Main = {

	canvas : undefined,
	ctx : undefined,
	textField : "",
	userText : "",
	wordBank : "",
	textIndex : 0,
	//var used for finding dt
	updatedTime : 0,
	scoreManager : undefined,
	
	entities : [],
	content : [],
	removed : [],
	dropDownPlacementY : -66,

	init : function(){
		
		//assign the canvas and the canvas context
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		
		this.scoreManager = new app.Score();
		
		this.content = [{"color":"images/Elephant.jpg","value":"ELEPHANT"},
				   {"color":"images/Lion.jpg","value":"LION"},
				   {"color":"images/Zebra.jpg","value":"ZEBRA"},
				   {"color":"images/Pig.jpg","value":"PIG"},
				   {"color":"images/Gorilla.jpg","value":"GORILLA"}];
		
		for(var i = 0; i < 6; i++){
			for(var j = 0; j < 5; j++){
				this.createEntity(i*67);
			}
		}
		
		this.textField = document.getElementById("textInput");
		this.textField.readOnly = true;

		document.addEventListener("keypress",this.onKeyPress,true);

		//call the game loop to start the game
		this.gameLoop();
	},
	
	//loops the game
	gameLoop : function(){
		//calls this method every frame
		requestAnimationFrame(this.gameLoop.bind(this));
    	this.update();
    	this.render(this.ctx);
	},
	
	//renders all objects in the game
	render : function(ctx){
		app.draw.rect(ctx,0,0,this.canvas.width,this.canvas.height,1,"#aaa");
		//text: function(ctx,string,x,y,size,col){
		app.draw.text(ctx,"Score: " + this.scoreManager.totalScore,10,30,this.scoreManager.scoreSize,"#fff");
		for(var i = 0; i < this.entities.length; i ++){
			this.entities[i].render(ctx);
		}
	},
	
	//updates the objects in the game
	update : function(){
		//find deltaTime
		var dt  = this.calculateDeltaTime();
	
		for(var i = 0; i < this.entities.length; i ++){
			dance:
			if(this.entities[i].moving){
				for(var j = 0; j < this.entities.length; j++){
					if(!this.entities[j].moving && this.entities[i].location[0] == this.entities[j].location[0]
					  && this.entities[i].checkEntityCollision(this.entities[j])){
						this.entities[i].moving = false;
						this.entities[i].snapToGrid();
						break dance;
					}
				}
				this.entities[i].update(dt);
			}
		}
		
		this.scoreManager.update();
	},
	
	calculateDeltaTime : function(){
		var now, fps;
		now = (+new Date);
		fps = 1000/(now - this.updatedTime);
		fps = this.clamp(fps,12,60);
		this.updatedTime = now;
		return 1/fps;
	},
	
	clamp : function(val,min,max){
		return Math.max(min,Math.min(max,val));
	},
	
	createEntity : function (x){
		var ran = parseInt(Math.random()*this.content.length)
		this.entities.push(new app.Entity(x,this.dropDownPlacementY,this.content[ran].color,this.content[ran].value));
		this.dropDownPlacementY -= 66;
	},
	
	
	//Text Logic
	checkValues : function(){
		document.getElementById('hiddenText').style.display = "none";
		this.textIndex ++;
		var val = this.userText.slice(0,this.textIndex);
		var found = 0;
		for(var i = 0; i < this.entities.length; i++){
		
			if(val.substring(0,val.length) == this.entities[i].text){
				this.entities[i].solved = true;
			}
		
			if(val === this.entities[i].text.slice(0,this.textIndex)){
				this.entities[i].opacity = 0.5;
			}
			else{
				found ++;
			}
			
			if(val.substring(val.length-1,val.length) == "\r"){
				this.entities[i].moving = true;
				this.entities[i].velocity = vec2.create();
				this.entities[i].lineWidth = 1;
			}
			
			if(val.substring(val.length-1,val.length) == "\r" &&
			  val.substring(0,val.length-1) == this.entities[i].text){
			  	this.removed.push(this.entities[i].location[0]);
				this.entities.splice(i,1);
    			i -= 1;
			}
		}
		if(found >= this.entities.length){
			this.textIndex --;
			this.userText = val.slice(0,this.textIndex);
			console.log(this.userText);
			this.wordBank += val.slice(-1);
			document.getElementById('wordBank').innerHTML = this.wordBank;
			this.scoreManager.dropMultiplier();
		}else{
			this.textField.innerHTML = val;
			this.wordBank = "";
			document.getElementById('wordBank').innerHTML = "";
			this.scoreManager.finishLetter();
		}
		
		this.dropDownPlacementY = -66;
	},
	
	valuesReset : function(){
		this.textField.innerHTML = "";
		this.userText = "";
		this.textIndex = 0;
		
		//Finish the word score
		this.scoreManager.finishWord(this.removed.length);
		
		for(var i = 0; i < this.removed.length; i++){
			this.createEntity(this.removed[i]);
		}
		this.removed = [];
		document.getElementById('hiddenText').style.display = "block";
	},
	
	onKeyPress : function(e){
		var ch = String.fromCharCode(e.which).toUpperCase();
		app.Main.userText += ch;
		app.Main.checkValues();
		if(ch == "\r" || ch == "\n"){
			app.Main.valuesReset();
		}
	},

};