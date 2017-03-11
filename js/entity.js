"use strict";

var app = app || {};

app.Entity = function(){

	var Entity = function(x,y,img,text){
		this.type = "entity";
		this.text = text;
		this.moving = true;
		this.opacity = 0;
		this.solved = false;
		this.radius = 33;
		this.lineWidth = 1;
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
		this.gravity = vec2.fromValues(0,0.01);
		this.image = new Image(66,66);
		this.image.src = img;
	};
	
	var p = Entity.prototype;
	
	p.update = function(dt){
		applyForce(this.gravity,this.acceleration);
		updateLocation(this.velocity,this.acceleration,this.location);
		if(this.location[1] >= 480-this.radius*2){
			this.moving = false;
			this.snapToGrid();
			this.velocity = vec2.create();
			this.acceleration = vec2.create();
		}
		if(this.velocity[1] >= 10){
			this.velocity[1] = 10;
		}
	};
	
	p.render = function(ctx){
		if(this.image){ 
			ctx.drawImage(this.image, this.location[0], this.location[1], this.radius*2, this.radius*2);
			if(this.solved){
				app.draw.rect(ctx,this.location[0],this.location[1],this.radius*2,this.radius*2,this.lineWidth,"rgba(200,200,20,0.5)");
			}else{
				app.draw.rect(ctx,this.location[0],this.location[1],this.radius*2,this.radius*2,this.lineWidth,"rgba(255,255,255," + this.opacity + ")");	
				if(this.opacity > 0){
					this.opacity -= 0.01;
				}
			}
		}else{
		}
	};
	
	p.checkEntityCollision = function(entity){
		var dx = entity.location[0] - this.location[0];
		var dy = entity.location[1] - this.location[1];
		var distance = Math.sqrt(dx*dx + dy*dy);
		return distance < entity.radius + this.radius;
	};
	
	p.snapToGrid = function(){
		var pos = parseInt(this.location[1]/(this.radius*2));
		this.location[1] = pos * this.radius*2 + 20;
	}
	
	return Entity;

}();