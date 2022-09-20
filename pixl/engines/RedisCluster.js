// RedisCluster Storage Plugin
// Copyright (c) 2015 - 2020 Joseph Huckaby
// Released under the MIT License

// Requires the 'ioredis' and 'ioredis-timeout' modules from npm
// npm install --save ioredis ioredis-timeout

import Component from "../../pixl/component.mjs";
import { digestHex, substitute } from "../../pixl/tools.mjs";
import { Cluster } from 'ioredis';
import RedisTimeout from 'ioredis-timeout';
import { Readable } from 'stream';

export default class RedisClusterEngine extends Component {
	
	__name = 'RedisCluster'
	//__parent: Component
	
	defaultConfig = {
		
		host: 'localhost',
		port: 6379,
		timeout: 1000,
		connectRetries: 5,
		clusterOpts: {
			scaleReads: "master"
		},
		
		keyPrefix: "",
		keyTemplate: ""
	}
	
	startup(callback) {
		// setup Redis connection
		var self = this;
		this.logDebug(2, "Setting up RedisClustr", this.config.get() );
		this.setup(callback);
	}
	
	setup(callback) {
		// setup Redis connection
		var self = this;
		var r_config = this.config.get();
		
		this.keyPrefix = (r_config.keyPrefix || '').replace(/^\//, '');
		if (this.keyPrefix && !this.keyPrefix.match(/\/$/)) this.keyPrefix += '/';
		
		this.keyTemplate = (r_config.keyTemplate || '').replace(/^\//, '').replace(/\/$/, '');
		
		r_config.clusterOpts.clusterRetryStrategy = function(attempts) {
			if (attempts > r_config.connectRetries) return false;
			return attempts;
		};
		
		this.redis = new Cluster(
			[{ port: r_config.port, host: r_config.host }],
			r_config.clusterOpts
		);
		
		this.redis.on('end', function() {
			self.logDebug(2, "Redis 'end' event fired" + (self.storage.started ? '' : ' (before connection succeeded)'));
			if (!self.storage.started) {
				callback( new Error("Redis end event fired before connection succeeded.") );
			}
			if (self.redis) self.redis.removeAllListeners();
		}); // end
		
		this.redis.on('error', function(err) {
			if (!self.storage.started) return callback(err);
			
			// error after startup?  Just log it I guess
			self.logError('redis', ''+err);
		}); // error
		
		this.redis.on('warning', function(err) {
			self.logError('redis', ''+err);
		}); // error
		
		this.redis.once('ready', function() {
			self.logDebug(8, "Successfully connected to Redis");
			
			if (r_config.timeout) {
				RedisTimeout(self.redis, parseInt(r_config.timeout));
			}
			
			callback();
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
		
		var func = this.storage.isBinaryKey(key) ? 'getBuffer' : 'get';
		this.redis[func]( key, function(err, result) {
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
		if (this.redis) {
			this.redis.disconnect();
			this.redis.removeAllListeners();
			this.redis = null;
		}
		callback();
	}
	
}


