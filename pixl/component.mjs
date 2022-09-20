// Server Component Base Class
// Copyright (c) 2014 Joseph Huckaby
// Released under the MIT License

import { EventEmitter } from "events";
import Config from "./config.mjs";
import PixlServer from "./server.mjs";
import { HookHelper } from "./class-plus.mjs";

export default class Component extends EventEmitter {
	
	__name = ''
	
	/** @type {PixlServer} */
	server = null

	/** @type {Config} */
	config = null

	defaultConfig = null
	logger = null
	
	__construct() {
		// class constructor
	}
	
	init(server, config) {
		// initialize and attach to server
		this.server = server;
		this.config = config || server.config.getSub( this.__name );
		this.logger = server.logger;
		
		// init config and monitor for reloads
		this.initConfig();
		this.config.on('reload', this.initConfig.bind(this));
	}
	
	initConfig() {
		// import default config
		if (this.defaultConfig) {
			var config = this.config.get();
			for (var key in this.defaultConfig) {
				if (typeof(config[key]) == 'undefined') {
					config[key] = this.defaultConfig[key];
				}
			}
		}
	}
	
	earlyStart() {
		// override in subclass, return false to interrupt startup
		return true;
	}
	
	startup(callback) {
		// override in subclass
		callback();
	}
	
	shutdown(callback) {
		// override in subclass
		callback();
	}
	
	debugLevel(level) {
		// check if we're logging at or above the requested level
		if (!this.config || !this.config.get) return true; // sanity
		var debug_level = this.config.get('debug_level') || this.logger.get('debugLevel');
		return (debug_level >= level);
	}
	
	logDebug(level, msg, data) {
		// proxy request to system logger with correct component
		if (!this.logger.print && this.logger.debug) return this.logger.debug(level, msg, data);
		
		if (this.debugLevel(level)) {
			this.logger.set( 'component', this.__name );
			this.logger.print({ 
				category: 'debug', 
				code: level, 
				msg: msg, 
				data: data 
			});
		}
	}
	
	logError(code, msg, data) {
		// proxy request to system logger with correct component
		this.logger.set( 'component', this.__name );
		this.logger.error( code, msg, data );
	}
	
	logTransaction(code, msg, data) {
		// proxy request to system logger with correct component
		this.logger.set( 'component', this.__name );
		this.logger.transaction( code, msg, data );
	}
	
}

// this is to replace Class function from class-plus

export class Expandable extends Component {
      /**
	   * Use this instead of Class(args, ClassName)
	   * This function will inject mixins and other stuff in a new class, e.g.:
	   * class NewClass extends Expandle { ... }
	   * NewClass.expand(args)	   * 
	   * @param {Object} args 
	   */
	  static expand(args) {
		// class builder
		var proto = this.prototype;
		
		// handle static variables
		if (args.__static) {
			for (let key in args.__static) {
				this[key] = args.__static[key];
			}
		}
		
		// optional asyncify
		if (args.__asyncify) {
			if ((typeof(args.__asyncify) == 'object') && args.__asyncify.length) {
				// specific set of methods to asyncify
				args.__asyncify.forEach( function(key) {
					if (proto[key] && !proto[key].__async && (proto[key].constructor.name !== "AsyncFunction")) {
						proto[key] = promisify( proto[key] );
						proto[key].__async = true;
					}
				} );
			}
			else if ((typeof(args.__asyncify) == 'object') && args.__asyncify.match) {
				// regular expression to match against method names
				Object.getOwnPropertyNames(proto).forEach( function(key) { 
					if (!key.match(/^(__name|constructor|prototype)$/) && (typeof(proto[key]) == 'function') && key.match(args.__asyncify) && !proto[key].__async && (proto[key].constructor.name !== "AsyncFunction")) { 
						proto[key] = promisify( proto[key] ); 
						proto[key].__async = true;
					} 
				}); 
			}
			else {
				// try to sniff out callback based methods using reflection
				Object.getOwnPropertyNames(proto).forEach( function(key) { 
					if (!key.match(/^(__name|constructor|prototype)$/) && (typeof(proto[key]) == 'function') && (proto[key].toString().match(/^\s*\S+\s*\([^\)]*(callback|cb)\s*\)\s*\{/)) && !proto[key].__async && (proto[key].constructor.name !== "AsyncFunction")) { 
						proto[key] = promisify( proto[key] ); 
						proto[key].__async = true;
					} 
				}); 
			}
		}
		
		// merge in mixins
		var mixins = args.__mixins || [];
		if (args.__events) mixins.unshift( EventEmitter );
		if (args.__hooks) mixins.unshift( HookHelper );
		
		for (let idx = 0, len = mixins.length; idx < len; idx++) {
			let class_obj = mixins[idx];
			let class_proto = class_obj.prototype;
			if (!class_proto) throw "All items specified in __mixins must be classes.";
			
			// prototype members
			Object.getOwnPropertyNames(class_proto).forEach( function(key) {
				if (!key.match(/^(__name|constructor|prototype)$/) && !(key in proto)) {
					proto[key] = class_proto[key];
				}
			});
			
			// static members
			Object.getOwnPropertyNames(class_obj).forEach( function(key) {
				if (!key.match(/^(name|length|prototype)$/) && !(key in obj)) {
					obj[key] = class_obj[key];
				}
			});
		} // foreach mixin
		
		// asyncify fireHook if applicable
		if (args.__hooks && !proto.fireHook.__async) {
			proto.fireHook = promisify( proto.fireHook );
			proto.fireHook.__async = true;
		}
		
		// add non-meta args as prototype properties
		for (let key in args) {
			if (!key.match(/^__(static|asyncify|events|hooks)/)) {
				proto[key] = args[key];
			}
		}
	

	};
}
//export default Component