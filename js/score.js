"use strict"

var app = app || {};

app.Score = function(){
	
	var Score = function(){
		this.type = "Score";
		this.totalScore = 0;
		this.wordScore = 0;
		this.START_SCORE = 10;
		this.multiplier = 4;
		this.scoreSize = 25;
	};
	
	var p = Score.prototype;
	
	p.update = function(){
		if(this.scoreSize > 25){
			this.scoreSize -= 0.5;
		}
	};
	
	p.finishWord = function(numOnScreen){
		this.wordScore *= numOnScreen;
		this.scoreSize = 30 + this.wordScore * 0.005;
		this.addToTotal(this.wordScore);
		this.wordScore = 0;
		this.multiplier = 4;
	};
	
	p.addToTotal = function(score){
		this.totalScore += score;
	};
	
	p.finishLetter = function(){
		this.wordScore += this.multiplier * this.START_SCORE;
		this.letterScore = 0;
		this.multiplier = 4;
	};
	
	p.dropMultiplier = function(){
		if(this.multiplier > 0){
			this.multiplier --;
		}
	};
	
	return Score;
	 
}();