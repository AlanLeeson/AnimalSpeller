"use strict"

var app = app || {};

function applyForce(force,acceleration){
	//divide the force by the mass
	force = vec2.fromValues(force[0],force[1]);
	//add the force to acceleration
	vec2.add(acceleration, acceleration, force);
}

function updateLocation(velocity,acceleration,location){
	vec2.add(velocity,velocity,acceleration);
	//multiply the velocity by dampening value
	velocity = vec2.fromValues(velocity[0],
				velocity[1]);
	//add velocity to location
	vec2.add(location,location,velocity);
		
	//Zero the acceleration
	acceleration = vec2.create();	
}