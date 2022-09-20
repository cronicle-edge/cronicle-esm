// Redis Storage Plugin
// Copyright (c) 2015 - 2019 Joseph Huckaby
// Released under the MIT License

// Requires the 'redis' module from npm
// npm install redis

import Component from "../../pixl/component.mjs";
import { copyHashRemoveKeys, digestHex, substitute } from "../../pixl/tools.mjs";
import { createClient } from 'redis';
import { Readable } from 'stream';

export default class RedisEngine extends Component {
	
	__name = 'Redis'
	// __parent = Component
	
	defaultConfig = {
		host: "127.0.0.1",
		port: 6379,
		keyPrefix: "",
		keyTemplate: ""
	}
	
	startup(callback) {
		// setup Redis connection
		var self = this;
		
		this.logDebug(2, "Setting up Redis", 
			copyHashRemoveKeys( this.config.get(), { password:1 }) );
		
		this.setup(callback);
	}
	
	setup(callback) {
		// setup Redis connection
		var self = this;
		var r_config = this.config.get();
		
		this.keyPrefix = (r_config.keyPrefix || '').replace(/^\//, '');
		if (this.keyPrefix && !this.keyPrefix.match(/\/$/)) this.keyPrefix += '/';
		
		this.keyTemplate = (r_config.keyTemplate || '').replace(/^\//, '').replace(/\/$/, '');
		
		r_config.return_buffers = true;
		r_config.retry_strategy = function(opts) {
			// simple backoff strategy
			return Math.min(opts.attempt * 100, 3000);
		};
		
		this.redis = createClient( copyHashRemoveKeys(r_config, { keyPrefix:1, keyTemplate:1 }) );
		
		this.redis.on('error', function(err) {
			if (!self.storage.started) return callback(err);
			
			// error after startup?  Just log it I guess
			self.logError('redis', ''+err);
		});
		
		this.redis.on('connect', function() {
			self.logDebug(3, "Redis connected successfully");
			if (!self.storage.started) return callback();
		});
		
		this.redis.on('reconnecting', function(opts) {
			self.logDebug(3, "Redis is reconnecting", opts);
		});
		
		this.redis.on('end', function() {
			self.logDebug(3, "Redis disconnected");
		});
	}
	
	prepKey(key) {
		// prepare key for S3 based on config
		var md5 = digestHex(key, 'md5');
		
		if (this.keyPrefix) {
			key = this.keyPrefix + key;
		}
		
		if (this.keyTemplate) {
			var idx = 0;
			var temp = this.keyTemplate.replace( /\#/g, function() {
				return md5.substr(idx++, 1);
			} );
			key = substitute( temp, { key: key, md5: md5 } );
		}
		
		return key;
	}
	
	put(key, value, callback) {
		// store key+value in Redis
		var self = this;
		key = this.prepKey(key);
		
		if (this.storage.isBinaryKey(key)) {
			this.logDebug(9, "Storing Redis Binary Object: " + key, '' + value.length + ' bytes');
		}
		else {
			this.logDebug(9, "Storing Redis JSON Object: " + key, this.debugLevel(10) ? value : null);
			value = JSON.stringify( value );
		}
		
		this.redis.set( key, value, function(err) {
			if (err) {
				err.message = "Failed to store object: " + key + ": " + err;
				self.logError('redis', ''+err);
			}
			else self.logDebug(9, "Store complete: " + key);
			
			if (callback) callback(err);
		} );
	}
	
	putStream(key, inp, callback) {
		// store key+value in Redis using read stream
		var self = this;
		
		// The Redis API has no stream support.
		// So, we have to do this the RAM-hard way...
		
		var chunks = [];
		inp.on('data', function(chunk) {
			chunks.push( chunk );
		} );
		inp.on('end', function() {
			var buf = Buffer.concat(chunks);
			self.put( key, buf, callback );
		} );
	}
	
	head(key, callback) {
		// head redis value given key
		var self = this;
		key = this.prepKey(key);
		
		// The Redis API has no way to head / ping an object.
		// So, we have to do this the RAM-hard way...
		
		this.redis.get( key, function(err, data) {
			if (err) {
				// an actual error
				err.message = "Failed to head key: " + key + ": " + err;
				self.logError('redis', ''+err);
				callback(err);
			}
			else if (!data) {
				// record not found
				// always use "NoSuchKey" in error code
				var err = new Error("Failed to head key: " + key + ": Not found");
				err.code = "NoSuchKey";
				
				callback( err, null );
			}
			else {
				callback( null, { mod: 1, len: data.length } );
			}
		} );
	}
	
	get(key, callback) {
		// fetch Redis value given key
		var self = this;
		key = this.prepKey(key);
		
		this.logDebug(9, "Fetching Redis Object: " + key);
		
		this.redis.get( key, function(err, result) {
			if (!result) {
				if (err) {
					// an actual error
					err.message = "Failed to fetch key: " + key + ": " + err;
					self.logError('redis', ''+err);
					callback( err, null );
				}
				else {
					// record not found
					// always use "NoSuchKey" in error code
					var err = new Error("Failed to fetch key: " + key + ": Not found");
					err.code = "NoSuchKey";
					
					callback( err, null );
				}
			}
			else {
				if (self.storage.isBinaryKey(key)) {
					self.logDebug(9, "Binary fetch complete: " + key, '' + result.length + ' bytes');
				}
				else {
					try { result = JSON.parse( result.toString() ); }
					catch (err) {
						self.logError('redis', "Failed to parse JSON record: " + key + ": " + err);
						callback( err, null );
						return;
					}
					self.logDebug(9, "JSON fetch complete: " + key, self.debugLevel(10) ? result : null);
				}
				
				callback( null, result );
			}
		} );
	}
	
	getStream(key, callback) {
		// get readable stream to record value given key
		var self = this;
		
		// The Redis API has no stream support.
		// So, we have to do this the RAM-hard way...
		
		this.get( key, function(err, buf) {
			if (err) {
				// an actual error
				err.message = "Failed to fetch key: " + key + ": " + err;
				self.logError('redis', ''+err);
				return callback(err);
			}
			else if (!buf) {
				// record not found
				var err = new Error("Failed to fetch key: " + key + ": Not found");
				err.code = "NoSuchKey";
				return callback( err, null );
			}
			
			var stream = Readable.from(buf);
			callback(null, stream, { mod: 1, len: buf.length });
		} );
	}
	
	getStreamRange(key, start, end, callback) {
		// get readable stream to record value given key and range
		var self = this;
		
		// The Redis API has no stream support.
		// So, we have to do this the RAM-hard way...
		
		this.get( key, function(err, buf) {
			if (err) {
				// an actual error
				err.message = "Failed to fetch key: " + key + ": " + err;
				self.logError('redis', ''+err);
				return callback(err);
			}
			else if (!buf) {
				// record not found
				var err = new Error("Failed to fetch key: " + key + ": Not found");
				err.code = "NoSuchKey";
				return callback( err, null );
			}
			
			// validate byte range, now that we have the head info
			if (isNaN(start) && !isNaN(end)) {
				start = buf.length - end;
				end = buf.length ? buf.length - 1 : 0;
			} 
			else if (!isNaN(start) && isNaN(end)) {
				end = buf.length ? buf.length - 1 : 0;
			}
			if (isNaN(start) || isNaN(end) || (start < 0) || (start >= buf.length) || (end < start) || (end >= buf.length)) {
				download.destroy();
				callback( new Error("Invalid byte range (" + start + '-' + end + ") for key: " + key + " (len: " + buf.length + ")"), null );
				return;
			}
			
			var range = buf.slice(start, end + 1);
			var stream = Readable.from(range);
			callback(null, stream, { mod: 1, len: buf.length });
		} );
	}
	
	delete(key, callback) {
		// delete Redis key given key
		var self = this;
		key = this.prepKey(key);
		
		this.logDebug(9, "Deleting Redis Object: " + key);
		
		this.redis.del( key, function(err, deleted) {
			if (!err && !deleted) {
				err = new Error("Failed to fetch key: " + key + ": Not found");
				err.code = "NoSuchKey";
			}
			if (err) {
				self.logError('redis', "Failed to delete object: " + key + ": " + err);
			}
			else self.logDebug(9, "Delete complete: " + key);
			
			callback(err);
		} );
	}
	
	runMaintenance(callback) {
		// run daily maintenance
		callback();
	}
	
	shutdown(callback) {
		// shutdown storage
		this.logDebug(2, "Shutting down Redis");
		if (this.redis) this.redis.quit();
		callback();
	}
	
}
