// Simple OOP Tools for Node.JS
// Copyright (c) 2014 Joseph Huckaby
// Released under the MIT License

import { inherits, promisify } from "util";
import { EventEmitter } from "events";
/**
 * 
 * @param {Object} members 
 * @returns 
 */
export function create(members) {
	// create new class using php-style syntax (sort of)
	if (!members) members = {};
	
	// setup constructor
	var constructor = null;
	
	// inherit from parent class
	if (members.__parent) {
		if (members.__construct) {
			// explicit constructor passed in
			constructor = members.__construct;
		}
		else {
			// inherit parent's constructor
			let parent = members.__parent;
			constructor = function() {
				let args = Array.prototype.slice.call(arguments);
				parent.apply( this, args );
			};
		}
		
		// inherit rest of parent members
		inherits(constructor, members.__parent);
		delete members.__parent;
	}
	else {
		// create new base class
		constructor = members.__construct || function() {};
	}
	delete members.__construct;
	
	// handle static variables
	if (members.__static) {
		for (let key in members.__static) {
			constructor[key] = members.__static[key];
		}
		delete members.__static;
	}
	
	// all classes are event emitters unless explicitly disabled
	if (members.__events !== false) {
		if (!members.__mixins) members.__mixins = [];
		if (members.__mixins.indexOf(EventEmitter) == -1) {
			members.__mixins.push( EventEmitter );
		}
	}
	delete members.__events;
	
	// handle mixins
	if (members.__mixins) {
		for (let idx = 0, len = members.__mixins.length; idx < len; idx++) {
			let class_obj = members.__mixins[idx];
			
			for (let key in class_obj.prototype) {
				if (!key.match(/^__/) && (typeof(constructor.prototype[key]) == 'undefined')) {
					constructor.prototype[key] = class_obj.prototype[key];
				}
			}
			let static_members = class_obj.__static;
			if (static_members) {
				for (let key in static_members) {
					if (typeof(constructor[key]) == 'undefined') constructor[key] = static_members[key];
				}
			}
		} // foreach mixin
		delete members.__mixins;
	} // mixins
	
	// handle promisify (node 8+)
	if (members.__promisify && promisify) {
		if (Array.isArray(members.__promisify)) {
			// promisify some
			members.__promisify.forEach( function(key) {
				if (typeof(members[key]) == 'function') {
					members[key] = promisify( members[key] );
				}
			} );
		}
		else {
			// promisify all
			for (let key in members) {
				if (!key.match(/^__/) && (typeof(members[key]) == 'function')) {
					members[key] = promisify( members[key] );
				}
			}
		}
		delete members.__promisify;
	}
	
	// fill prototype members
	for (let key in members) {
		constructor.prototype[key] = members[key];
	}
	
	// return completed class definition
	return constructor;
}
