// Simple HTTP / HTTPS Web Server
// A component for the pixl-server daemon framework.
// Copyright (c) 2015 - 2022 Joseph Huckaby
// Released under the MIT License

import { stat, createReadStream, readFileSync, existsSync, mkdirSync, writeFile, unlink } from 'fs';
import { tmpdir, hostname as _hostname } from 'os';
import { resolve, join } from 'path';
import zlib, { constants, BrotliCompress, createBrotliCompress, createGzip, createDeflate } from 'zlib';
import { createServer as _createHTTPServer } from 'http'
import { createServer as _createHTTPSServer } from 'https'

import StreamMeter from "stream-meter";
import { queue, series, eachSeries } from 'async';
import { code } from 'errno';
import Formidable from 'formidable';
import { parse } from 'querystring';
import mime from 'mime';
const { getType }  = mime

import Component from "./component.mjs";
import ACL from './acl.mjs';
import Perf from './perf.mjs';


export default class WebServer extends Component {

	__name = 'WebServer'

	version = "1.0.0"
		
	defaultConfig = {
		"http_private_ip_ranges": ['127.0.0.1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '::1/128', 'fd00::/8', '169.254.0.0/16', 'fe80::/10'],
		"http_regex_text": "(text|javascript|json|css|html)",
		"http_regex_json": "(javascript|js|json)",
		"http_keep_alives": "default",
		"http_timeout": 120,
		"http_static_index": "index.html",
		"http_static_ttl": 0,
		"http_max_upload_size": 32 * 1024 * 1024,
		"http_temp_dir": tmpdir(),
		"http_gzip_opts": {
			"level": constants.Z_DEFAULT_COMPRESSION, 
			"memLevel": 8 
		},
		"http_brotli_opts": {
			"chunkSize": 16 * 1024,
			"mode": "text",
			"level": 4
		},
		"http_compress_text": false,
		"http_enable_brotli": false,
		"http_default_acl": ['127.0.0.1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '::1/128', 'fd00::/8', '169.254.0.0/16', 'fe80::/10'],
		"http_log_requests": false,
		"http_log_perf": false,
		"http_perf_threshold_ms": 100,
		"http_perf_report": false,
		"http_recent_requests": 10,
		"http_max_connections": 0,
		"http_max_requests_per_connection": 0,
		"http_max_concurrent_requests": 0,
		"http_max_queue_length": 0,
		"http_max_queue_active": 0,
		"http_queue_skip_uri_match": false,
		"http_clean_headers": false,
		"http_log_socket_errors": true,
		"http_full_uri_match": false,
		"http_request_timeout": 0,
		
		"http_req_max_dump_enabled": false,
		"http_req_max_dump_dir": "",
		"http_req_max_dump_debounce": 10,
		
		"http_code_response_headers": null
	}
	
	conns = null
	numConns = 0
	nextId = 1
	uriFilters = null
	uriHandlers = null
	methodHandlers = null
	defaultACL = null
	stats = null
	recent = null
	
	badHeaderCharPattern = /([\x7F-\xFF\x00-\x1F\u00FF-\uFFFF])/g

//#region ---- MAIN ----
	
	startup(callback) {
		// start http server
		var self = this;
		
		this.logDebug(2, "pixl-server-web v" + this.version + " starting up");
		
		// setup connections and handlers
		this.conns = {};
		this.requests = {};
		this.uriFilters = [];
		this.uriHandlers = [];
		this.methodHandlers = [];
		this.defaultACL = new ACL();
		this.aclPrivateRanges = new ACL( this.config.get('http_private_ip_ranges') );
		this.regexTextContent = new RegExp( this.config.get('http_regex_text'), "i" );
		this.regexJSONContent = new RegExp( this.config.get('http_regex_json'), "i" );
		this.logRequests = this.config.get('http_log_requests');
		this.regexLogRequests = this.logRequests ? (new RegExp( this.config.get('http_regex_log') || '.+' )) : null;
		this.logPerfEnabled = this.config.get('http_log_perf');
		this.logPerfThreshold = this.config.get('http_perf_threshold_ms');
		this.logPerfReport = this.config.get('http_perf_report');
		this.keepRecentRequests = this.config.get('http_recent_requests');
		this.stats = { current: {}, last: {} };
		this.recent = [];
		
		// optionally compress text
		this.compressText = this.config.get('http_compress_text') || this.config.get('http_gzip_text');
		
		// brotli compression support
		this.hasBrotli = !!BrotliCompress && this.config.get('http_enable_brotli');
		this.acceptEncodingMatch = this.hasBrotli ? /\b(gzip|deflate|br)\b/i : /\b(gzip|deflate)\b/i;
		
		// map friendly keys to brotli constants
		var brotli_opts = this.config.get('http_brotli_opts');
		if ("mode" in brotli_opts) {
			switch (brotli_opts.mode) {
				case 'text': brotli_opts.mode = constants.BROTLI_MODE_TEXT; break;
				case 'font': brotli_opts.mode = constants.BROTLI_MODE_FONT; break;
				case 'generic': brotli_opts.mode = constants.BROTLI_MODE_GENERIC; break;
			}
			if (!brotli_opts.params) brotli_opts.params = {};
			brotli_opts.params[ constants.BROTLI_PARAM_MODE ] = brotli_opts.mode;
			delete brotli_opts.mode;
		}
		if ("level" in brotli_opts) {
			if (!brotli_opts.params) brotli_opts.params = {};
			brotli_opts.params[ constants.BROTLI_PARAM_QUALITY ] = brotli_opts.level;
			delete brotli_opts.level;
		}
		if ("hint" in brotli_opts) {
			if (!brotli_opts.params) brotli_opts.params = {};
			brotli_opts.params[ constants.BROTLI_PARAM_SIZE_HINT ] = brotli_opts.hint;
			delete brotli_opts.hint;
		}
		
		// keep-alives
		this.keepAlives = this.config.get('http_keep_alives');
		if (this.keepAlives === false) this.keepAlives = 0;
		else if (this.keepAlives === true) this.keepAlives = 1;
		
		// optional max requests per KA connection
		this.maxReqsPerConn = this.config.get('http_max_requests_per_connection');
		
		// setup queue to handle all requests
		this.maxConcurrentReqs = this.config.get('http_max_concurrent_requests') || this.config.get('http_max_connections');
		this.maxQueueLength = this.config.get('http_max_queue_length');
		this.maxQueueActive = this.config.get('http_max_queue_active');
		
		this.queueSkipMatch = this.config.get('http_queue_skip_uri_match') ? 
			new RegExp( this.config.get('http_queue_skip_uri_match') ) : false;
		
		// if both max concurrent req AND max connections are not set, just use a very large number
		this.queue = queue( this.parseHTTPRequest.bind(this), this.maxConcurrentReqs || 8192 );
		
		// front-end https header detection
		var ssl_headers = this.config.get('https_header_detect');
		if (ssl_headers) {
			this.ssl_header_detect = {};
			for (var key in ssl_headers) {
				this.ssl_header_detect[ key.toLowerCase() ] = new RegExp( ssl_headers[key] );
			}
		}
		
		// initialize default ACL blocks
		if (this.config.get('http_default_acl')) {
			try {
				this.config.get('http_default_acl').forEach( function(block) {
					self.defaultACL.add( block );
				} );
			}
			catch (err) {
				var err_msg = "Failed to initialize ACL: " + err.message;
				this.logError('acl', err_msg);
				throw new Error(err_msg);
			}
		}
		
		// initialize request max dump system, if enabled
		this.reqMaxDumpEnabled = this.config.get('http_req_max_dump_enabled');
		this.reqMaxDumpDir = this.config.get('http_req_max_dump_dir');
		this.reqMaxDumpDebounce = this.config.get('http_req_max_dump_debounce');
		this.reqMaxDumpLast = 0;
		
		if (this.reqMaxDumpEnabled && this.reqMaxDumpDir && !existsSync(this.reqMaxDumpDir)) {
			mkdirSync( this.reqMaxDumpDir, { mode: 0o777, recursive: true } );
		}
		
		// listen for tick events to swap stat buffers
		this.server.on( 'tick', this.tick.bind(this) );
		
		// start listeners
		this.startHTTP( function(err) {
			if (err) return callback(err);
			
			// also start HTTPS listener?
			if (self.config.get('https')) {
				self.startHTTPS( callback );
			}
			else callback(err);
		} );
	}
	
	dumpAllRequests(callback) {
		// create dump file containing info on all active/pending requests
		// this is called when requests or sockets are maxed out
		// only write file every N seconds
		var self = this;
		var now = Date.now() / 1000;
		if (now - this.reqMaxDumpLast < this.reqMaxDumpDebounce) return;
		this.reqMaxDumpLast = now;
		
		var dump_file = this.reqMaxDumpDir + '/req-dump-' + _hostname() + '-' + process.pid + '-' + Date.now().toString(36) + '.json';
		var json = this.getStats();
		json.requests = {};
		
		for (var id in this.requests) {
			var args = this.requests[id];
			var info = {
				uri: args.request.url,
				ip: args.ip,
				ips: args.ips,
				headers: args.request.headers,
				state: args.state,
				date: args.date,
				elapsed: now - args.date
			};
			if (args.request.socket && args.request.socket._pixl_data && args.request.socket._pixl_data.aborted) {
				info.aborted = true;
			}
			json.requests[id] = info;
		}
		
		this.logDebug(5, "Writing dump file: " + dump_file );
		writeFile( dump_file, JSON.stringify(json, null, "\t") + "\n", function(err) {
			if (err) self.logError('dump', "Failed to write dump file: " + dump_file + ": " + err, err);
			if (callback) callback(err);
		} );
	}
	
	deleteUploadTempFiles(args) {
		// delete leftover temp files created by Formidable
		for (var key in args.files) {
			var file = args.files[key];
			unlink( file.path, function(err) {
				// file may have been moved / deleted already, so ignore error here
			} );
		}
	}
	
	tick() {
		// swap current and last stat buffers
		// called every 1s via server tick event
		this.stats.last = this.stats.current;
		this.stats.current = {};
	}
	
	getStats() {
		// get current stats, merged with live socket and request info
		var socket_info = {};
		var listener_info = {};
		var now = (new Date()).getTime();
		var num_sockets = 0;
		
		if (this.http) listener_info.http = this.http.address();
		if (this.https) listener_info.https = this.https.address();
		
		for (var key in this.conns) {
			var socket = this.conns[key];
			var socket_data = socket._pixl_data;
			var info = {
				state: 'idle',
				ip: socket.remoteAddress,
				proto: socket_data.proto,
				port: socket_data.port,
				uptime_ms: now - socket_data.time_start,
				num_requests: socket_data.num_requests,
				bytes_in: socket_data.bytes_in,
				bytes_out: socket_data.bytes_out
			};
			if (socket_data.current) {
				// current request in progress, merge this in
				var args = socket_data.current;
				info.ips = args.ips;
				info.state = args.state;
				info.method = args.request.method;
				info.uri = args.request.url;
				info.host = args.request.headers['host'] || '';
				info.elapsed_ms = args.perf.calcElapsed( args.perf.perf.total.start );
			}
			socket_info[key] = info;
			num_sockets++;
		}
		
		var stats = this.stats.last;
		stats.num_sockets = num_sockets;
		if (!stats.num_requests) stats.num_requests = 0;
		if (!stats.bytes_in) stats.bytes_in = 0;
		if (!stats.bytes_out) stats.bytes_out = 0;
		
		['total', 'queue', 'read', 'filter', 'process', 'encode', 'write'].forEach( function(key) {
			if (!stats[key]) stats[key] = { "st": "mma", "min": 0, "max": 0, "total": 0, "count": 0 };
		} );
		
		for (var key in stats) {
			var stat = stats[key];
			if ((stat.st == "mma") && ("total" in stat) && ("count" in stat)) {
				stat.avg = stat.total / (stat.count || 1);
			}
		}
		
		return {
			server: {
				uptime_sec: Math.floor(now / 1000) - this.server.started,
				hostname: this.server.hostname,
				ip: this.server.ip,
				name: this.server.__name,
				version: this.server.__version
			},
			stats: stats,
			listeners: listener_info,
			sockets: socket_info,
			recent: this.recent,
			queue: {
				pending: this.queue.length(),
				running: this.queue.running()
			}
		};
	}
	
	getAllClientIPs(request) {
		// create array of all IPs from the request, using the socket IP and X-Forwarded-For, if applicable
		var ips = [];
		var headers = request.headers || {};
		
		// single IP headers
		['x-client-ip', 'cf-connecting-ip', 'true-client-ip', 'x-real-ip', 'x-cluster-client-ip'].forEach( function(key) {
			if (headers[key]) ips.push( headers[key] );
		} );
		
		// multi-CSV IP headers
		['x-forwarded-for', 'forwarded-for'].forEach( function(key) {
			if (headers[key]) [].push.apply( ips, headers[key].split(/\,\s*/) );
		} );
		
		// special headers
		// e.g. Forwarded: for=192.0.2.43, for="[2001:db8:cafe::17]"
		['x-forwarded', 'forwarded'].forEach( function(key) {
			if (headers[key]) headers[key].replace( /\bfor\=\"?\[?([^\,\]\"]+)/g, function(m_all, m_g1) {
				ips.push( m_g1 );
			} );
		} );
		
		// add socket ip to end of array
		var ip = ''+request.socket.remoteAddress;
		if (ip.match(/\:(\d+\.\d+\.\d+\.\d+)/)) ip = RegExp.$1; // extract IPv4 from IPv6 wrapper
		ips.push( ip );
		
		return ips;
	}
	
	getPublicIP(ips) {
		// filter out garbage that doesn't resemble ips
		var real_ips = ips.filter( function(ip) {
			return ip.match( /^([\d\.]+|[a-f0-9:]+)$/ );
		} );
		
		// determine first public IP from list of IPs
		for (var idx = 0, len = real_ips.length; idx < len; idx++) {
			if (!this.aclPrivateRanges.check(real_ips[idx])) return real_ips[idx];
		}
		
		// default to first ip
		return real_ips[0];
	}
	
	getSelfURL(request, uri) {
		// build self referencing URL given request object
		// and optional replacement URI
		if (!request.headers.host) return null;
		
		var ssl = !!request.headers.ssl;
		var url = ssl ? 'https://' : 'http://';
		url += request.headers.host.replace(/\:\d+$/, '');
		
		// only re-add port number if original incoming request had one
		if (request.headers.host.match(/\:\d+$/)) {
			if (ssl && this.config.get('https_port') && (this.config.get('https_port') != 443)) {
				url += ':' + this.config.get('https_port');
			}
			else if (!ssl && this.config.get('http_port') && (this.config.get('http_port') != 80)) {
				url += ':' + this.config.get('http_port');
			}
		}
		
		url += (uri || '/');
		
		return url;
	}
	
	getNextId(prefix) {
		// get unique ID with prefix
		return '' + prefix + Math.floor(this.nextId++);
	}
	
	ucfirst(text) {
		// capitalize first character only, lower-case rest
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	}
	
	shutdown(callback) {
		// shutdown http server
		var self = this;
		
		if (this.http) {
			this.logDebug(2, "Shutting down HTTP server");
			
			for (var id in this.requests) {
				var args = this.requests[id];
				this.logDebug(4, "Request still active: " + args.id, {
					id: args.id,
					ips: args.ips,
					uri: args.request ? args.request.url : '',
					headers: args.request ? args.request.headers : {},
					socket: (args.request && args.request.socket && args.request.socket._pixl_data) ? args.request.socket._pixl_data.id : '',
					stats: args.state,
					date: args.date,
					age: (Date.now() / 1000) - args.date
				});
				if (args.callback) {
					args.callback();
					delete args.callback;
				}
			} // foreach req
			
			for (var id in this.conns) {
				this.logDebug(4, "Closing HTTP connection: " + id);
				// this.conns[id].destroy();
				this.conns[id].end();
				this.conns[id].unref();
				this.numConns--;
			} // foreach conn
			
			this.http.close( function() { self.logDebug(3, "HTTP server has shut down."); } );
			
			if (this.https) {
				this.https.close( function() { self.logDebug(3, "HTTPS server has shut down."); } );
			}
			// delete this.http;
			
			this.requests = {};
			this.queue.kill();
		}
		
		callback();
	}
//#endregion

    // ---- HTTP ----
    startHTTP(callback) {
		// start http server
		var self = this;
		var port = this.config.get('http_port');
		var bind_addr = this.config.get('http_bind_address') || '';
		var max_conns = this.config.get('http_max_connections') || 0;
		var https_force = self.config.get('https_force') || false;
		var socket_prelim_timeout = self.config.get('http_socket_prelim_timeout') || 0;
		
		this.logDebug(2, "Starting HTTP server on port: " + port, bind_addr);
		
		var handler = function(request, response) {
			if (socket_prelim_timeout && request.socket._pixl_data.prelim_timer) {
				clearTimeout( request.socket._pixl_data.prelim_timer );
				delete request.socket._pixl_data.prelim_timer;
			}
			if (https_force) {
				self.logDebug(6, "Forcing redirect to HTTPS (SSL)");
				request.headers.ssl = 1; // force SSL url
				
				var args = {
					request: request,
					response: response,
					perf: new Perf()
				};
				args.perf.begin();
				
				var redirect_url = self.getSelfURL(request, request.url);
				if (!redirect_url) {
					self.sendHTTPResponse( args, "400 Bad Request", {}, "" );
					return;
				}
				
				self.sendHTTPResponse( args, 
					"301 Moved Permanently", 
					{ 'Location': redirect_url }, 
					"" // empty body
				);
			}
			else {
				self.enqueueHTTPRequest( request, response );
			}
		};
		
		this.http = _createHTTPServer( handler );
		
		this.http.on('connection', function(socket) {
			var ip = socket.remoteAddress || '';
			
			if (max_conns && (self.numConns >= max_conns)) {
				// reached maximum concurrent connections, abort new ones
				self.logError('maxconns', "Maximum concurrent connections reached, denying connection from: " + ip, { ip: ip, max: max_conns });
				socket.end();
				socket.unref();
				socket.destroy(); // hard close
				self.dumpAllRequests();
				return;
			}
			if (self.server.shut) {
				// server is shutting down, abort new connections
				self.logError('shutdown', "Server is shutting down, denying connection from: " + ip, { ip: ip });
				socket.end();
				socket.unref();
				socket.destroy(); // hard close
				return;
			}
			
			var id = self.getNextId('c');
			self.conns[ id ] = socket;
			self.numConns++;
			self.logDebug(8, "New incoming HTTP connection: " + id, { ip: ip, num_conns: self.numConns });
			
			// Disable the Nagle algorithm.
			socket.setNoDelay( true );
			
			// add our own metadata to socket
			socket._pixl_data = {
				id: id,
				proto: 'http',
				port: port,
				time_start: (new Date()).getTime(),
				num_requests: 0,
				bytes_in: 0,
				bytes_out: 0
			};
			
			// optional preliminary socket timeout for first request
			if (socket_prelim_timeout) {
				socket._pixl_data.prelim_timer = setTimeout( function() {
					delete socket._pixl_data.prelim_timer;
					var msg = "Socket preliminary timeout waiting for initial request (" + socket_prelim_timeout + " seconds)";
					var err_args = {
						ip: ip,
						pending: self.queue.length(),
						active: self.queue.running(),
						sockets: self.numConns
					};
					if (self.config.get('http_log_socket_errors')) {
						self.logError('socket', "Socket error: " + socket._pixl_data.id + ": " + msg, err_args);
					}
					else {
						self.logDebug(5, "Socket error: " + socket._pixl_data.id + ": " + msg, err_args);
					}
					
					socket._pixl_data.aborted = true;
					socket.end();
					socket.unref();
					socket.destroy(); // hard close
				}, socket_prelim_timeout * 1000 );
			} // socket_prelim_timeout
			
			self.emit('socket', socket);
			
			socket.on('error', function(err) {
				// client aborted connection?
				var args = socket._pixl_data.current || { request: {} };
				var msg = err.message;
				if (err.errno && code[err.errno]) {
					msg = self.ucfirst(code[err.errno].description) + " (" + err.message + ")";
				}
				if (self.config.get('http_log_socket_errors')) {
					self.logError(err.code || 'socket', "Socket error: " + id + ": " + msg, {
						ip: ip,
						ips: args.ips,
						state: args.state,
						method: args.request.method,
						uri: args.request.url,
						pending: self.queue.length(),
						active: self.queue.running(),
						sockets: self.numConns
					});
				}
				if (args.callback) {
					args.callback();
					delete args.callback;
				}
			} );
			
			socket.on('close', function() {
				// socket has closed
				if (socket._pixl_data.prelim_timer) {
					clearTimeout( socket._pixl_data.prelim_timer );
					delete socket._pixl_data.prelim_timer;
				}
				var now = (new Date()).getTime();
				self.logDebug(8, "HTTP connection has closed: " + id, {
					ip: ip,
					total_elapsed: now - socket._pixl_data.time_start,
					num_requests: socket._pixl_data.num_requests,
					bytes_in: socket._pixl_data.bytes_in,
					bytes_out: socket._pixl_data.bytes_out
				});
				delete self.conns[ id ];
				self.numConns--;
				socket._pixl_data.aborted = true;
			} );
		} );
		
		this.http.on('clientError', function(err, socket) {
			// https://nodejs.org/api/http.html#http_event_clienterror
			if (!socket._pixl_data) socket._pixl_data = {};
			var args = socket._pixl_data.current || { request: {}, id: 'n/a' };
			var msg = err.message;
			
			if (err.errno && code[err.errno]) {
				msg = self.ucfirst(code[err.errno].description) + " (" + err.message + ")";
			}
			
			var err_args = {
				id: args.id,
				ip: socket.remoteAddress,
				ips: args.ips,
				state: args.state,
				method: args.request.method,
				uri: args.request.url,
				pending: self.queue.length(),
				active: self.queue.running(),
				sockets: self.numConns
			};
			if (self.config.get('http_log_socket_errors')) {
				self.logError(err.code || 'socket', "Client error: " + socket._pixl_data.id + ": " + msg, err_args);
			}
			else {
				self.logDebug(5, "Client error: " + socket._pixl_data.id + ": " + msg, err_args);
			}
			
			// do not try to write to socket if already closed
			if ((err.code != 'ECONNRESET') && socket.writable) {
				socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
			}
			socket._pixl_data.aborted = true;
			
			if (args.callback) {
				args.callback();
				delete args.callback;
			}
		});
		
		this.http.once('error', function(err) {
			// fatal startup error on HTTP server, probably EADDRINUSE
			self.logError('startup', "Failed to start HTTP listener: " + err.message);
			return callback(err);
		} );
		
		var listen_opts = { port: port };
		if (bind_addr) listen_opts.host = bind_addr;
		
		this.http.listen( listen_opts, function(err) {
			if (err) {
				self.logError('startup', "Failed to start HTTP listener: " + err.message);
				return callback(err);
			}
			var info = self.http.address();
			self.logDebug(3, "Now listening for HTTP connections", info);
			if (!port) {
				port = info.port;
				self.config.set('http_port', port);
				self.logDebug(3, "Actual HTTP listener port chosen: " + port);
			}
			callback();
		} );
		
		// set idle socket timeout
		if (this.config.get('http_timeout')) {
			this.http.setTimeout( this.config.get('http_timeout') * 1000 );
		}
		if (this.config.get('http_keep_alive_timeout')) {
			this.http.keepAliveTimeout = this.config.get('http_keep_alive_timeout') * 1000;
		}
	}
    // ---- HTTPS -------
    startHTTPS(callback) {
		// start https server
		var self = this;
		var port = this.config.get('https_port');
		var bind_addr = this.config.get('https_bind_address') || this.config.get('http_bind_address') || '';
		var max_conns = this.config.get('https_max_connections') || this.config.get('http_max_connections') || 0;
		var socket_prelim_timeout = self.config.get('https_socket_prelim_timeout') || self.config.get('http_socket_prelim_timeout') || 0;
		
		this.logDebug(2, "Starting HTTPS (SSL) server on port: " + port, bind_addr );
		
		var handler = function(request, response) {
			if (socket_prelim_timeout && request.socket._pixl_data.prelim_timer) {
				clearTimeout( request.socket._pixl_data.prelim_timer );
				delete request.socket._pixl_data.prelim_timer;
			}
			
			// add a flag in headers for downstream code to detect
			request.headers['ssl'] = 1;
			request.headers['https'] = 1;
			
			self.enqueueHTTPRequest( request, response );
		};
		
		// standard SSL, cert files need to be specified
		var opts = {
			cert: readFileSync( this.config.get('https_cert_file') ),
			key: readFileSync( this.config.get('https_key_file') )
		};
		if (this.config.get('https_ca_file')) {
			// optional chain.pem or the like
			opts.ca = readFileSync( this.config.get('https_ca_file') );
		}
		this.https = _createHTTPSServer( opts, handler );
		
		this.https.on('secureConnection', function(socket) {
			var ip = socket.remoteAddress || '';
			
			if (max_conns && (self.numConns >= max_conns)) {
				// reached maximum concurrent connections, abort new ones
				self.logError('maxconns', "Maximum concurrent connections reached, denying request from: " + ip, { ip: ip, max: max_conns });
				socket.end();
				socket.unref();
				socket.destroy(); // hard close
				self.dumpAllRequests();
				return;
			}
			if (self.server.shut) {
				// server is shutting down, abort new connections
				self.logError('shutdown', "Server is shutting down, denying connection from: " + ip, { ip: ip });
				socket.end();
				socket.unref();
				socket.destroy(); // hard close
				return;
			}
			
			var id = self.getNextId('cs');
			self.conns[ id ] = socket;
			self.numConns++;
			self.logDebug(8, "New incoming HTTPS (SSL) connection: " + id, { ip: ip, num_conns: self.numConns });
			
			// Disable the Nagle algorithm.
			socket.setNoDelay( true );
			
			// add our own metadata to socket
			socket._pixl_data = {
				id: id,
				proto: 'https',
				port: port,
				time_start: (new Date()).getTime(),
				num_requests: 0,
				bytes_in: 0,
				bytes_out: 0
			};
			
			// optional preliminary socket timeout for first request
			if (socket_prelim_timeout) {
				socket._pixl_data.prelim_timer = setTimeout( function() {
					delete socket._pixl_data.prelim_timer;
					var msg = "Socket preliminary timeout waiting for initial request (" + socket_prelim_timeout + " seconds)";
					var err_args = {
						ip: ip,
						pending: self.queue.length(),
						active: self.queue.running(),
						sockets: self.numConns
					};
					if (self.config.get('http_log_socket_errors')) {
						self.logError('socket', "Socket error: " + socket._pixl_data.id + ": " + msg, err_args);
					}
					else {
						self.logDebug(5, "Socket error: " + socket._pixl_data.id + ": " + msg, err_args);
					}
					
					socket._pixl_data.aborted = true;
					socket.end();
					socket.unref();
					socket.destroy(); // hard close
				}, socket_prelim_timeout * 1000 );
			} // socket_prelim_timeout
			
			self.emit('socket', socket);
			
			socket.on('error', function(err) {
				// client aborted connection?
				var args = socket._pixl_data.current || { request: {} };
				var msg = err.message;
				if (err.errno && code[err.errno]) {
					msg = self.ucfirst(code[err.errno].description) + " (" + err.message + ")";
				}
				if (self.config.get('http_log_socket_errors')) {
					self.logError(err.code || 'socket', "Socket error: " + id + ": " + msg, {
						ip: ip,
						ips: args.ips,
						state: args.state,
						method: args.request.method,
						uri: args.request.url,
						pending: self.queue.length(),
						active: self.queue.running(),
						sockets: self.numConns
					});
				}
				if (args.callback) {
					args.callback();
					delete args.callback;
				}
			} );
			
			socket.on('close', function() {
				// socket has closed
				if (socket._pixl_data.prelim_timer) {
					clearTimeout( socket._pixl_data.prelim_timer );
					delete socket._pixl_data.prelim_timer;
				}
				var now = (new Date()).getTime();
				self.logDebug(8, "HTTPS (SSL) connection has closed: " + id, {
					ip: ip,
					total_elapsed: now - socket._pixl_data.time_start,
					num_requests: socket._pixl_data.num_requests,
					bytes_in: socket._pixl_data.bytes_in,
					bytes_out: socket._pixl_data.bytes_out
				});
				delete self.conns[ id ];
				self.numConns--;
				socket._pixl_data.aborted = true;
			} );
		} );
		
		this.https.on('clientError', function(err, socket) {
			// https://nodejs.org/api/http.html#http_event_clienterror
			if (!socket._pixl_data) socket._pixl_data = {};
			var args = socket._pixl_data.current || { request: {}, id: 'n/a' };
			var msg = err.message;
			
			if (err.errno && code[err.errno]) {
				msg = self.ucfirst(code[err.errno].description) + " (" + err.message + ")";
			}
			
			var err_args = {
				id: args.id,
				ip: socket.remoteAddress,
				ips: args.ips,
				state: args.state,
				method: args.request.method,
				uri: args.request.url,
				pending: self.queue.length(),
				active: self.queue.running(),
				sockets: self.numConns
			};
			if (self.config.get('http_log_socket_errors')) {
				self.logError(err.code || 'socket', "Client error: " + socket._pixl_data.id + ": " + msg, err_args);
			}
			else {
				self.logDebug(5, "Client error: " + socket._pixl_data.id + ": " + msg, err_args);
			}
			
			// do not try to write to socket if already closed
			if ((err.code != 'ECONNRESET') && socket.writable) {
				socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
			}
			socket._pixl_data.aborted = true;
			
			if (args.callback) {
				args.callback();
				delete args.callback;
			}
		});
		
		this.https.once('error', function(err) {
			// fatal startup error on HTTPS server, probably EADDRINUSE
			self.logError('startup', "Failed to start HTTPS listener: " + err.message);
			return callback(err);
		} );
		
		var listen_opts = { port: port };
		if (bind_addr) listen_opts.host = bind_addr;
		
		this.https.listen( listen_opts, function(err) {
			if (err) {
				self.logError('startup', "Failed to start HTTPS listener: " + err.message);
				return callback(err);
			}
			var info = self.https.address();
			self.logDebug(3, "Now listening for HTTPS connections", info);
			if (!port) {
				port = info.port;
				self.config.set('https_port', port);
				self.logDebug(3, "Actual HTTPS listener port chosen: " + port);
			}
			callback();
		} );
		
		// set idle socket timeout
		var timeout_sec = this.config.get('https_timeout') || this.config.get('http_timeout') || 0;
		if (timeout_sec) {
			this.https.setTimeout( timeout_sec * 1000 );
		}
		if (this.config.get('https_keep_alive_timeout')) {
			this.https.keepAliveTimeout = this.config.get('https_keep_alive_timeout') * 1000;
		}
		else if (this.config.get('http_keep_alive_timeout')) {
			this.https.keepAliveTimeout = this.config.get('http_keep_alive_timeout') * 1000;
		}
	}

//#region ---- RESPONSE ----

    sendHTTPResponse(args, status, headers, body) {
		// send http response
		var self = this;
		var request = args.request;
		var response = args.response;
		
		// copy headers object so we don't clobber user data
		if (headers) headers = Object.assign({}, headers);
		else headers = {};
		
		// in case the URI handler called sendHTTPResponse() directly, end the process metric
		if (args.perf && args.perf.perf.process && !args.perf.perf.process.end) args.perf.end('process');
		
		// check for destroyed socket
		if (args.request.socket.destroyed) {
			var socket_data = args.request.socket._pixl_data;
			delete socket_data.current;
			socket_data.total_elapsed = (new Date()).getTime() - socket_data.time_start;
			socket_data.url = this.getSelfURL(request, request.url) || request.url;
			socket_data.ips = args.ips;
			socket_data.req_id = args.id;
			if (this.config.get('http_log_socket_errors')) {
				this.logError('socket', "Socket closed unexpectedly: " + socket_data.id, socket_data);
			}
			else {
				this.logDebug(9, "Socket closed unexpectedly: " + socket_data.id, socket_data);
			}
			if (args.callback) {
				args.callback();
				delete args.callback;
			}
			
			// destroy stream if appliable (prevents filehandle leak)
			if (body && body.pipe && body.destroy) body.destroy();
			
			return;
		}
		
		// catch double-callback
		if (args.state == 'writing') {
			this.logError('write', "Warning: Double call to sendHTTPResponse on same request detected.  Aborting second call.");
			return;
		}
		
		args.state = 'writing';
		
		// merge in default response headers
		var default_headers = this.config.get('http_response_headers') || null;
		if (default_headers) {
			for (var key in default_headers) {
				if (typeof(headers[key]) == 'undefined') headers[key] = default_headers[key];
			}
		}
		if (typeof(headers['Server']) == 'undefined') {
			headers['Server'] = this.config.get('http_server_signature') || this.__name;
		}
		
		// possibly overwrite 'Connection' header for KA closure
		this.manageKeepAliveResponse(args, headers);
		
		// parse code and status
		var http_code = 200;
		var http_status = "OK";
		if (status.match(/^(\d+)\s+(.+)$/)) {
			http_code = parseInt( RegExp.$1 );
			http_status = RegExp.$2;
		}
		args.http_code = http_code;
		args.http_status = http_status;
		
		// merge in conditional headers based on response code
		var code_headers = this.config.get('http_code_response_headers');
		if (code_headers && (http_code in code_headers)) {
			for (var key in code_headers[http_code]) {
				headers[key] = code_headers[http_code][key];
			}
		}
		
		// use duck typing to see if we have a stream, buffer or string
		var is_stream = (body && body.pipe);
		var is_buffer = (body && body.fill);
		var is_string = (body && !is_stream && !is_buffer);
		
		// if string, convert to buffer so content length is correct (unicode)
		if (is_string) {
			body = Buffer.from(body);
		}
		
		// set content-type if not already set
		if (body && !is_stream && (typeof(headers['Content-Length']) == 'undefined')) {
			headers['Content-Length'] = body.length;
		}
		
		// track stream bytes, if applicable
		var meter = null;
		
		response.on('finish', function() {
			// response actually completed writing
			self.logDebug(9, "Response finished writing to socket", { id: args.id });
			
			// guess number of bytes in response header, minus data payload
			args.perf.count('bytes_out', ("HTTP " + args.http_code + " OK\r\n").length);
			for (var key in headers) {
				args.perf.count('bytes_out', (key + ": " + headers[key] + "\r\n").length);
			}
			args.perf.count('bytes_out', 4); // CRLFx2
			
			// add metered bytes if streamed
			if (meter) args.perf.count('bytes_out', meter.bytes || 0);
			
			// done writing
			args.perf.end('write');
			self.finishRequest(args);
		} );
		
		response.on('close', function() {
			if (args.callback) { 
				// socket closed during active response
				if (self.config.get('http_log_socket_errors')) {
					self.logError('socket', "Socket connection terminated unexpectedly during response", {
						id: args.id,
						ips: args.ips,
						useragent: request.headers['user-agent'] || '',
						referrer: request.headers['referer'] || '',
						cookie: request.headers['cookie'] || '',
						url: self.getSelfURL(request, request.url) || request.url
					});
				}
				args.callback(); // queue
				delete args.callback;
			}
		});
		
		// handle stream errors (abort response)
		if (is_stream) {
			body.on('error', function(err) {
				self.logError('stream', "Stream error serving response: " + request.url + ": " + err.message, {
					id: args.id,
					ips: args.ips,
					useragent: request.headers['user-agent'] || '',
					referrer: request.headers['referer'] || '',
					cookie: request.headers['cookie'] || '',
					url: self.getSelfURL(request, request.url) || request.url
				});
				
				args.http_code = 500;
				args.http_status = "Internal Server Error";
				args.perf.count('errors', 1);
				
				body.unpipe();
				response.end();
			});
		}
		
		// see if handler has requested gzip, or auto-detect it
		var do_compress = headers['X-Compress'] || headers['x-compress'] || false;
		if (!do_compress) {
			do_compress = !!(
				this.compressText && 
				headers['Content-Type'] && 
				headers['Content-Type'].match(this.regexTextContent)
			);
		}
		
		// auto-gzip response based on content type
		if (body && 
			(http_code == 200) && 
			do_compress && 
			!headers['Content-Encoding'] && // do not encode if already encoded
			args.request && 
			args.request.headers['accept-encoding'] && 
			args.request.headers['accept-encoding'].match(self.acceptEncodingMatch)) {
			
			// prep encoding compression
			var compressor = null;
			var zlib_opts = null;
			var zlib_func = '';
			var accept_encoding = args.request.headers['accept-encoding'].toLowerCase();
			
			if (self.hasBrotli && accept_encoding.match(/\b(br)\b/)) {
				// prefer brotli first, if supported by Node.js
				zlib_func = 'brotliCompress';
				zlib_opts = self.config.get('http_brotli_opts') || {};
				headers['Content-Encoding'] = 'br';
				if (is_stream) compressor = createBrotliCompress( zlib_opts );
			}
			else if (accept_encoding.match(/\b(gzip)\b/)) {
				// prefer gzip second
				zlib_func = 'gzip';
				zlib_opts = self.config.get('http_gzip_opts') || {};
				headers['Content-Encoding'] = 'gzip';
				if (is_stream) compressor = createGzip( zlib_opts );
			}
			else if (accept_encoding.match(/\b(deflate)\b/)) {
				// prefer deflate third
				zlib_func = 'deflate';
				zlib_opts = self.config.get('http_gzip_opts') || {}; // yes, same opts as gzip
				headers['Content-Encoding'] = 'deflate';
				if (is_stream) compressor = createDeflate( zlib_opts );
			}
			
			if (is_stream) {
				// send response as stream pipe
				delete headers['Content-Length'];
				self.logDebug(9, "Sending compressed streaming HTTP response with " + zlib_func + ": " + status, headers);
				args.perf.begin('write');
				
				if (self.writeHead( args, http_code, http_status, headers )) {
					meter = new StreamMeter();
					body.pipe( compressor ).pipe( meter ).pipe( response );
					self.logDebug(9, "Request complete");
				}
			}
			else {
				// compress and send response as buffer
				args.perf.begin('encode');
				zlib[ zlib_func ]( body, zlib_opts, function(err, data) {
					args.perf.end('encode');
					args.perf.begin('write');
					if (err) {
						// should never happen
						self.logError('zlib', "Failed to compress content with " + zlib_func + ": " + err);
						data = body;
					}
					else {
						// no error
						body = null; // free up memory
						self.logDebug(9, "Compressed text output with " + zlib_func + ": " + headers['Content-Length'] + " bytes down to: " + data.length + " bytes");
						headers['Content-Length'] = data.length;
					}
					
					self.logDebug(9, "Sending compressed HTTP response with " + zlib_func + ": " + status, headers);
					
					// send data
					if (self.writeHead( args, http_code, http_status, headers )) {
						response.write( data );
						response.end();
						
						args.perf.count('bytes_out', data.length);
						self.logDebug(9, "Request complete");
					}
				}); // zlib
			} // buffer or string
		} // compress
		else {
			// no compression
			args.perf.begin('write');
			
			if (is_stream) {
				this.logDebug(9, "Sending streaming HTTP response: " + status, headers);
				
				if (self.writeHead( args, http_code, http_status, headers )) {
					meter = new StreamMeter();
					body.pipe( meter ).pipe( response );
				}
			}
			else {
				this.logDebug(9, "Sending HTTP response: " + status, headers);
				
				// send data
				if (self.writeHead( args, http_code, http_status, headers )) {
					if (body) {
						response.write( body );
						args.perf.count('bytes_out', body.length);
					}
					response.end();
				}
			}
			this.logDebug(9, "Request complete", { id: args.id });
		}
	}
	
	writeHead(args, http_code, http_status, headers) {
		// wrap call to response.writeHead(), as it can throw
		var request = args.request;
		var response = args.response;
		
		if (headers && this.config.get('http_clean_headers')) {
			// prevent bad characters in headers, which can crash node's writeHead() call
			for (var key in headers) {
				if (typeof(headers[key]) == 'object') {
					for (var idx = 0, len = headers[key].length; idx < len; idx++) {
						headers[key][idx] = headers[key][idx].toString().replace(this.badHeaderCharPattern, '');
					}
				}
				else {
					headers[key] = headers[key].toString().replace(this.badHeaderCharPattern, '');
				}
			}
		}
		
		response.writeHead( http_code, http_status, headers || {} );
		return true;
	}
	
	finishRequest(args) {
		// finish up request tracking
		args.perf.count('num_requests', 1);
		args.perf.end();
		
		var socket_data = args.request.socket._pixl_data;
		var metrics = args.perf.metrics();
		this.emit('metrics', metrics, args);
		
		this.logDebug(9, "Request performance metrics:", metrics);
		
		// write to access log
		if (this.logRequests && args.request.url.match(this.regexLogRequests)) {
			this.logTransaction( 'HTTP ' + args.http_code + ' ' + args.http_status, args.request.url, {
				id: args.id,
				proto: args.request.headers['ssl'] ? 'https' : socket_data.proto,
				ips: args.ips,
				host: args.request.headers['host'] || '',
				ua: args.request.headers['user-agent'] || '',
				perf: metrics
			} );
		}
		
		// optional threshold-based perf log
		if (this.logPerfEnabled && (metrics.perf.total >= this.logPerfThreshold)) {
			var epoch = (Date.now() - metrics.perf.total) / 1000;
			var log_data = {
				id: args.id,
				proto: args.request.headers['ssl'] ? 'https' : socket_data.proto,
				ips: args.ips,
				host: args.request.headers['host'] || '',
				ua: args.request.headers['user-agent'] || '',
				perf: metrics,
				pending: args._start.pending,
				running: args._start.running,
				sockets: args._start.sockets
			};
			if (this.logPerfReport) {
				var report = process.report.getReport();
				if (Array.isArray(this.logPerfReport)) {
					log_data.report = {};
					this.logPerfReport.forEach( function(key) {
						if (key in report) log_data.report[key] = report[key];
					} );
				}
				else log_data.report = report;
			}
			this.logger.print({
				now: epoch, // retroactive time (start of request)
				category: 'perf', 
				code: args.http_code + ' ' + args.http_status, 
				msg: args.request.url,
				data: log_data
			});
		}
		
		// keep a list of the most recent N requests
		if (this.keepRecentRequests) {
			this.recent.unshift({
				id: args.id,
				when: (new Date()).getTime() / 1000,
				proto: args.request.headers['ssl'] ? 'https' : socket_data.proto,
				port: socket_data.port,
				code: args.http_code,
				status: args.http_status,
				method: args.request.method,
				uri: args.request.url,
				ips: args.ips,
				host: args.request.headers['host'] || '',
				ua: args.request.headers['user-agent'] || '',
				perf: metrics
			});
			if (this.recent.length > this.keepRecentRequests) this.recent.pop();
		}
		
		// add metrics to socket
		socket_data.num_requests++;
		socket_data.bytes_in += metrics.counters.bytes_in || 0;
		socket_data.bytes_out += metrics.counters.bytes_out || 0;
		
		// add metrics to stats system
		var stats = this.stats.current;
		
		for (var key in metrics.perf) {
			var elapsed = metrics.perf[key];
			if (!stats[key]) {
				stats[key] = {
					'st': 'mma', // stat type: "min max avg"
					'min': elapsed,
					'max': elapsed,
					'total': elapsed,
					'count': 1
				};
			}
			else {
				var stat = stats[key];
				if (elapsed < stat.min) stat.min = elapsed;
				else if (elapsed > stat.max) stat.max = elapsed;
				stat.total += elapsed;
				stat.count++;
			}
		}
		
		for (var key in metrics.counters) {
			var amount = metrics.counters[key];
			if (!stats[key]) stats[key] = 0;
			stats[key] += amount;
		}
		
		// remove reference to current request
		delete socket_data.current;
		
		// Handle HTTP Keep-Alives
		var request = args.request;
		
		switch (this.keepAlives) {
			case 0:
			case 'close':
				// KA disabled, always close
				this.logDebug(9, "Closing socket: " + socket_data.id);
				request.socket.end(); // close nicely
			break;
			
			case 1:
			case 'request':
				// KA enabled only if client explicitly requests it
				if (!request.headers.connection || !request.headers.connection.match(/keep\-alive/i)) {
					// close socket
					this.logDebug(9, "Closing socket: " + socket_data.id);
					request.socket.end(); // close nicely
				}
				else {
					this.logDebug(9, "Keeping socket open for keep-alives: " + socket_data.id);
				}
			break;
			
			case 2:
			case 'default':
				// KA enabled by default, only disable if client says close
				if (request.headers.connection && request.headers.connection.match(/close/i)) {
					this.logDebug(9, "Closing socket: " + socket_data.id);
					request.socket.end(); // close nicely
				}
				else {
					this.logDebug(9, "Keeping socket open for keep-alives: " + socket_data.id);
				}
			break;
		} // switch
		
		// fire final request callback (queue)
		if (args.callback) {
			args.callback();
			delete args.callback;
		}
	}
	
	manageKeepAliveResponse(args, headers) {
		// massage outgoing headers for keep-alive requests
		// possibly override response 'Connection' header, if we want the client to close
		var request = args.request;
		var socket_data = request.socket._pixl_data || { num_requests: 0 };
		
		switch (this.keepAlives) {
			case 0:
			case 'close':
				// KA disabled, always close
				headers['Connection'] = 'close';
			break;
			
			case 1:
			case 'request':
				// KA enabled only if client explicitly requests it
				if (!request.headers.connection || !request.headers.connection.match(/keep\-alive/i)) {
					headers['Connection'] = 'close';
				}
				else if (this.maxReqsPerConn && (socket_data.num_requests >= this.maxReqsPerConn - 1)) {
					this.logDebug(8, "Closing socket after " + this.maxReqsPerConn + " keep-alive requests: " + socket_data.id);
					headers['Connection'] = 'close';
				}
				else if (this.server.shut) {
					this.logDebug(8, "Closing socket due to server shutting down: " + socket_data.id);
					headers['Connection'] = 'close';
				}
			break;
			
			case 2:
			case 'default':
				// KA enabled by default, only disable if client says close
				if (request.headers.connection && request.headers.connection.match(/close/i)) {
					headers['Connection'] = 'close';
				}
				else if (this.maxReqsPerConn && (socket_data.num_requests >= this.maxReqsPerConn - 1)) {
					this.logDebug(8, "Closing socket after " + this.maxReqsPerConn + " keep-alive requests: " + socket_data.id);
					headers['Connection'] = 'close';
				}
				else if (this.server.shut) {
					this.logDebug(8, "Closing socket due to server shutting down: " + socket_data.id);
					headers['Connection'] = 'close';
				}
			break;
		} // switch
	}
//#endregion

//#region ---- REQUEST ----

	enqueueHTTPRequest(request, response) {
		// enqueue request for handling as soon as concurrency limits allow
		var args = {
			id: this.getNextId('r'),
			date: Date.now() / 1000,
			request: request,
			response: response,
			state: 'queued',
			perf: new Perf()
		};
		
		// take snapshot of req and socket counts at start of request, used by perf logger at end
		if (this.logPerfEnabled) {
			args._start = {
				pending: this.queue.length(),
				running: this.queue.running(),
				sockets: this.numConns
			};
		}
		
		args.perf.begin();
		
		var ips = args.ips = this.getAllClientIPs(request);
		var ip = args.ip = this.getPublicIP(ips);
		
		if (this.server.shut) {
			// server is shutting down, deny new requests
			this.logError(503, "Server is shutting down, denying request from: " + ip, 
				{ id: args.id, ips: ips, uri: request.url, headers: request.headers }
			);
			this.sendHTTPResponse( args, "503 Service Unavailable", {}, "503 Service Unavailable (server shutting down)" );
			return;
		}
		
		// allow special URIs to skip the line
		if (this.queueSkipMatch && request.url.match(this.queueSkipMatch)) {
			this.logDebug(8, "Bumping request to front of queue: " + request.url);
			this.requests[ args.id ] = args;
			args.perf.begin('queue');
			this.queue.unshift(args);
			return;
		}
		
		if (this.maxQueueActive && (this.queue.running() >= this.maxQueueActive)) {
			// queue is maxed out on active reqs, reject request immediately
			this.logError(429, "Queue is maxed out (" + this.queue.running() + " active reqs), denying new request from: " + ip, { 
				id: args.id,
				ips: ips, 
				uri: request.url, 
				headers: request.headers,
				pending: this.queue.length(),
				active: this.queue.running(),
				sockets: this.numConns
			});
			this.sendHTTPResponse( args, "429 Too Many Requests", {}, "429 Too Many Requests (queue active maxed out)" );
			this.dumpAllRequests();
			return;
		}
		
		if (this.maxQueueLength && (this.queue.length() >= this.maxQueueLength)) {
			// queue is maxed out on pending reqs, reject request immediately
			this.logError(429, "Queue is maxed out (" + this.queue.length() + " pending reqs), denying new request from: " + ip, { 
				id: args.id,
				ips: ips, 
				uri: request.url, 
				headers: request.headers,
				pending: this.queue.length(),
				active: this.queue.running(),
				sockets: this.numConns
			});
			this.sendHTTPResponse( args, "429 Too Many Requests", {}, "429 Too Many Requests (queue pending maxed out)" );
			this.dumpAllRequests();
			return;
		}
		
		this.requests[ args.id ] = args;
		
		args.perf.begin('queue');
		this.queue.push(args);
	}
	
	parseHTTPRequest(args, callback) {
		// handle raw http request
		// (async dequeue handler function)
		var self = this;
		var request = args.request;
		var ips = args.ips;
		var ip = args.ip;
		
		args.perf.end('queue');
		
		// all requests will end up in this callback here
		args.callback = function() {
			if (args.timer) { clearTimeout(args.timer); delete args.timer; }
			delete self.requests[ args.id ];
			callback();
		};
		
		// add timer for request timeout
		if (this.config.get('http_request_timeout')) {
			args.timer = setTimeout( function() {
				// request took too long
				delete args.timer;
				
				self.logError(408, "Request timed out: " + self.config.get('http_request_timeout') + " seconds", {
					id: args.id,
					socket: request.socket._pixl_data.id,
					ips: args.ips,
					url: self.getSelfURL(args.request, request.url) || request.url,
					state: args.state
				});
				
				self.sendHTTPResponse( args, 
					"408 Request Timeout", 
					{ 'Content-Type': "text/html" }, 
					"408 Request Timeout: " + self.config.get('http_request_timeout') + " seconds.\n"
				);
				
				self.deleteUploadTempFiles(args);
			}, this.config.get('http_request_timeout') * 1000 );
		}
		
		// check for early abort (client error)
		if (request.socket._pixl_data.aborted) {
			if (args.callback) {
				args.callback();
				delete args.callback;
			}
			return;
		}
		
		this.logDebug(8, "New HTTP request: " + request.method + " " + request.url + " (" + ips.join(', ') + ")", {
			id: args.id,
			socket: request.socket._pixl_data.id,
			version: request.httpVersion
		});
		this.logDebug(9, "Incoming HTTP Headers:", request.headers);
		
		// detect front-end https
		if (!request.headers.ssl && this.ssl_header_detect) {
			for (var key in this.ssl_header_detect) {
				if (request.headers[key] && request.headers[key].match(this.ssl_header_detect[key])) {
					this.logDebug(9, "Detected front-end HTTPS request: " + key + ": " + request.headers[key]);
					request.headers.ssl = 1;
					request.headers.https = 1;
					break;
				}
			}
		}
		
		// parse query string
		var query = {};
		if (request.url.match(/\?(.+)$/)) {
			query = parse( RegExp.$1 );
		}
		
		// determine how to process request body
		var params = {};
		var files = {};
		
		// setup args for call to handler
		args.ip = ip;
		args.ips = ips;
		args.query = query;
		args.params = params;
		args.files = files;
		args.server = this;
		args.state = 'reading';
		
		// parse HTTP cookies, if present
		args.cookies = {};
		if (request.headers['cookie']) {
			var pairs = request.headers['cookie'].split(/\;\s*/);
			for (var idx = 0, len = pairs.length; idx < len; idx++) {
				if (pairs[idx].match(/^([^\=]+)\=(.*)$/)) {
					args.cookies[ RegExp.$1 ] = RegExp.$2;
				}
			} // foreach cookie
		} // headers.cookie
		
		if (this.server.shut) {
			// server is shutting down, deny new requests
			this.logError(503, "Server is shutting down, denying request from: " + ip, 
				{ id: args.id, ips: ips, uri: request.url, headers: request.headers }
			);
			this.sendHTTPResponse( args, "503 Service Unavailable", {}, "503 Service Unavailable (server shutting down)" );
			return;
		}
		
		args.perf.begin('read');
		
		// we have to guess at the http raw status + raw header size
		// as Node's http.js has already parsed it
		var raw_bytes_read = 0;
		raw_bytes_read += [request.method, request.url, 'HTTP/' + request.httpVersion + "\r\n"].join(' ').length;
		raw_bytes_read += request.rawHeaders.join("\r\n").length + 4; // CRLFx2
		args.perf.count('bytes_in', raw_bytes_read);
		
		// track current request in socket metadata
		request.socket._pixl_data.current = args;
		
		// post or get/head
		if ((request.method != 'HEAD') && (request.headers['content-length'] || request.headers['transfer-encoding'])) {
			var content_type = request.headers['content-type'] || '';
			var content_encoding = request.headers['content-encoding'] || '';
			
			if (content_type.match(/(multipart|urlencoded)/i) && !content_encoding) {
				// use formidable for the heavy lifting
				var form = Formidable({
					keepExtensions: true,
					maxFieldsSize: self.config.get('http_max_upload_size'),
					maxFileSize: self.config.get('http_max_upload_size'),
					uploadDir: self.config.get('http_temp_dir'),
					allowEmptyFiles: self.config.get('http_allow_empty_files') || false
				});
				
				form.on('progress', function(bytesReceived, bytesExpected) {
					self.logDebug(9, "Upload progress: " + bytesReceived + " of " + bytesExpected + " bytes", {
						socket: request.socket._pixl_data.id
					});
					args.perf.count('bytes_in', bytesReceived);
				} );
				
				form.parse(request, function(err, _fields, _files) {
					args.perf.end('read');
					if (err) {
						self.logError(400, "Error processing data from: " + ip + ": " + request.url + ": " + (err.message || err), 
							{ id: args.id, ips: ips, uri: request.url, headers: request.headers }
						);
						self.sendHTTPResponse( args, "400 Bad Request", {}, "400 Bad Request" );
						return;
					}
					else {
						args.params = _fields || {};
						
						// restore original formidable v1 API for our files
						args.files = {};
						if (_files) {
							for (var key in _files) {
								var file = _files[key];
								args.files[key] = {
									path: file.filepath,
									type: file.mimetype,
									name: file.originalFilename,
									size: file.size,
									mtime: file.mtime || file.lastModifiedDate
								};
							}
						}
						
						self.filterHTTPRequest(args);
					}
				} );
			}
			else {
				// parse ourselves (i.e. raw json)
				var bytesMax = self.config.get('http_max_upload_size');
				var bytesExpected = request.headers['content-length'] || "(Unknown)";
				var total_bytes = 0;
				var chunks = [];
				
				request.on('data', function(chunk) {
					// receive data chunk
					chunks.push( chunk );
					total_bytes += chunk.length;
					args.perf.count('bytes_in', chunk.length);
					
					self.logDebug(9, "Upload progress: " + total_bytes + " of " + bytesExpected + " bytes", {
						socket: request.socket._pixl_data.id
					});
					if (total_bytes > bytesMax) {
						self.logError(413, "Error processing data from: " + ip + ": " + request.url + ": Max data size exceeded", 
							{ id: args.id, ips: ips, uri: request.url, headers: request.headers }
						);
						request.socket.end();
						
						// note: request ending here without a call to sendHTTPResponse, hence the args.callback is fired
						if (args.callback) {
							args.callback();
							delete args.callback;
						}
						return;
					}
				} );
				request.on('end', function() {
					// request body is complete
					var body = Buffer.concat(chunks, total_bytes);
					
					if (content_type.match(self.regexJSONContent) && !content_encoding) {
						// parse json
						try {
							args.params = JSON.parse( body.toString() );
						}
						catch (e) {
							self.logError(400, "Error processing data from: " + ip + ": " + request.url + ": Failed to parse JSON: " + e, 
								{ id: args.id, ips: ips, uri: request.url, headers: request.headers, body: body.toString() }
							);
							self.sendHTTPResponse( args, "400 Bad Request", {}, "400 Bad Request" );
							return;
						}
					}
					else {
						// raw post, no parse
						args.params.raw = body;
					}
					
					// now we can handle the full request
					args.perf.end('read');
					self.filterHTTPRequest(args);
				} );
			}
		} // post
		else {
			// non-post, i.e. get or head, handle right away
			args.perf.end('read');
			this.filterHTTPRequest(args);
		}
	}
	
	filterHTTPRequest(args) {
		// apply URL filters to request, if any, before calling handlers
		var self = this;
		
		// quick early exit: no filters, jump out now
		if (!this.uriFilters.length) return this.handleHTTPRequest(args);
		
		// see which filters need to be applied
		var uri = args.request.url.replace(/\?.*$/, '');
		var filters = [];
		
		for (var idx = 0, len = this.uriFilters.length; idx < len; idx++) {
			if (uri.match(this.uriFilters[idx].regexp)) filters.push( this.uriFilters[idx] );
		}
		
		// if no filters matched, another quick early exit
		if (!filters.length) return this.handleHTTPRequest(args);
		
		args.state = 'filtering';
		
		// use async to allow filters to run in sequence
		eachSeries( filters,
			function(filter, callback) {
				self.logDebug(8, "Invoking filter for request: " + args.request.method + ' ' + uri + ": " + filter.name, { id: args.id });
				
				args.perf.begin('filter');
				filter.callback( args, function() {
					// custom filter complete
					args.perf.end('filter');
					
					if ((arguments.length == 3) && (typeof(arguments[0]) == "string")) {
						// filter sent status, headers and body
						self.sendHTTPResponse( args, arguments[0], arguments[1], arguments[2] );
						return callback("ABORT");
					}
					else if (arguments[0] === true) {
						// true means filter sent the raw response itself
						self.logDebug(9, "Filter sent custom response");
						return callback("ABORT");
					}
					else if (arguments[0] === false) {
						// false means filter exited normally
						self.logDebug(9, "Filter passthru, continuing onward");
						return callback();
					}
					else {
						// unknown response
						self.sendHTTPResponse( args, 
							"500 Internal Server Error", 
							{ 'Content-Type': "text/html" }, 
							"500 Internal Server Error: URI filter " + filter.name + " returned unknown data type.\n"
						);
						return callback("ABORT");
					}
				} );
			},
			function(err) {
				// all filters complete
				// if a filter handled the response, we're done
				if (err === "ABORT") {
					if (args.callback) {
						args.callback();
						delete args.callback;
					}
					return;
				}
				
				// otherwise, proceed to handling the request proper (method / URI handlers)
				self.handleHTTPRequest(args);
			}
		); // eachSeries
	}
	
	handleHTTPRequest(args) {
		// determine if we have an API route
		var self = this;
		var uri = args.request.url;
		if (!this.config.get('http_full_uri_match')) uri = uri.replace(/\?.*$/, '');
		var handler = null;
		
		args.state = 'processing';
		args.perf.begin('process');
		
		// check method handlers first, e.g. OPTIONS
		for (var idx = 0, len = this.methodHandlers.length; idx < len; idx++) {
			if (this.methodHandlers[idx].method && (this.methodHandlers[idx].method == args.request.method)) {
				handler = this.methodHandlers[idx];
				idx = len;
			}
		}
		
		// only check URI handlers if no method handler matched
		if (!handler) {
			for (var idx = 0, len = this.uriHandlers.length; idx < len; idx++) {
				var matches = uri.match(this.uriHandlers[idx].regexp);
				if (matches) {
					args.matches = matches;
					handler = this.uriHandlers[idx];
					idx = len;
				}
			}
		}
		
		if (handler) {
			this.logDebug(6, "Invoking handler for request: " + args.request.method + ' ' + uri + ": " + handler.name, { id: args.id });
			
			// Check ACL here
			if (handler.acl) {
				if (handler.acl.checkAll(args.ips)) {
					// yay!
					this.logDebug(9, "ACL allowed request", args.ips);
				}
				else {
					// nope
					this.logError(403, "Forbidden: IP addresses rejected by ACL: " + args.ips.join(', '), {
						id: args.id,
						acl: handler.acl.toString(),
						useragent: args.request.headers['user-agent'] || '',
						referrer: args.request.headers['referer'] || '',
						cookie: args.request.headers['cookie'] || '',
						url: this.getSelfURL(args.request, args.request.url) || args.request.url
					});
					
					args.perf.end('process');
					
					this.sendHTTPResponse( args, 
						"403 Forbidden", 
						{ 'Content-Type': "text/html" }, 
						"403 Forbidden: ACL disallowed request.\n"
					);
					
					this.deleteUploadTempFiles(args);
					return;
				} // not allowed
			} // acl check
			
			handler.callback( args, function() {
				// custom handler complete, send response
				if ((arguments.length == 3) && (typeof(arguments[0]) == "string")) {
					// handler sent status, headers and body
					args.perf.end('process');
					self.sendHTTPResponse( args, arguments[0], arguments[1], arguments[2] );
				}
				else if (arguments[0] === true) {
					// true means handler sent the raw response itself
					self.logDebug(9, "Handler sent custom response");
					if (args.callback) {
						args.callback();
						delete args.callback;
					}
				}
				else if (arguments[0] === false) {
					// false means handler did nothing, fall back to static
					self.logDebug(9, "Handler declined, falling back to static file");
					args.perf.end('process');
					self.sendStaticResponse( args );
				}
				else if (typeof(arguments[0]) == "object") {
					// REST-style JSON response
					var json = arguments[0];
					self.logDebug(10, "API Response JSON:", json);
					args.perf.end('process');
					
					var status = arguments[1] || "200 OK";
					var headers = arguments[2] || {};
					var payload = args.query.pretty ? JSON.stringify(json, null, "\t") : JSON.stringify(json);
					
					if (args.query.format && (args.query.format.match(/html/i)) && args.query.callback) {
						// old school IFRAME style response
						headers['Content-Type'] = "text/html";
						self.sendHTTPResponse( args, 
							status, 
							headers, 
							'<html><head><script>' + 
								args.query.callback + "(" + payload + ");\n" + 
								'</script></head><body>&nbsp;</body></html>' + "\n"
						);
					}
					else if (args.query.callback) {
						// JSON with JS callback wrapper
						headers['Content-Type'] = "text/javascript";
						self.sendHTTPResponse( args, 
							status, 
							headers, 
							args.query.callback + "(" + payload + ");\n"
						);
					}
					else {
						// pure json
						headers['Content-Type'] = "application/json";
						self.sendHTTPResponse( args, 
							status, 
							headers, 
							payload + "\n"
						);
					} // pure json
				} // json response
				else {
					// unknown response
					self.sendHTTPResponse( args, 
						"500 Internal Server Error", 
						{ 'Content-Type': "text/html" }, 
						"500 Internal Server Error: URI handler " + handler.name + " returned unknown data type.\n"
					);
				}
				
				// delete temp files
				self.deleteUploadTempFiles(args);
			} );
		} // uri handler
		else {
			// no uri handler, serve static file instead
			args.perf.end('process');
			this.sendStaticResponse( args );
			
			// delete temp files
			this.deleteUploadTempFiles(args);
		}
	}
//#endregion

//#region ---- STATIC ----

    sendStaticResponse(args) {
		// serve static file for URI
		var self = this;
		var request = args.request;
		var response = args.response;
		var headers = {};
		
		// catch double-callback
		if (args.state == 'writing') {
			this.logError('write', "Warning: Double call to sendStaticResponse on same request detected.  Aborting second call.");
			return;
		}
		
		// convert URI to file path
		var file = '';
		if (args.internalFile) {
			file = args.internalFile;
			this.logDebug(9, "Serving static file for internal redirect: " + file);
		}
		else {
			var base_dir = resolve( this.config.get('http_htdocs_dir') );
			file = resolve( base_dir + request.url.replace(/\?.*$/, '').replace(/\/$/, '') );
			this.logDebug(9, "Serving static file for: " + args.request.url, { file });
			
			if (file.indexOf(base_dir) !== 0) {
				// trying to access file outside base -- just 404 it
				return self.sendHTTPResponse( args, 
					"404 Not Found", 
					{ 'Content-Type': "text/html" }, 
					"404 Not Found: " + request.url + "\n"
				);
			}
		}
		
		// determine format
		var http_status = "200 OK";
		var mime_type = getType(file) || 'application/octet-stream';
		var file_stats = null;
		var is_dir = false;
		
		series([
			function(callback) {
				// first check if it's a directory, and if so, add /index.html
				stat( file, function(err, stats) {
					if (err) return callback(err);
					file_stats = stats;
					
					if (stats.isDirectory()) {
						is_dir = true;
						file += '/' + self.config.get('http_static_index');
						mime_type = getType(file) || 'application/octet-stream';
						self.logDebug(9, "Serving directory index: " + file);
						
						stat( file, function(err, stats) {
							if (err) return callback(err);
							file_stats = stats;
							callback();
						}); // fs.stat
					}
					else callback();
				}); // fs.stat
			},
			function(callback) {
				// if mime is textish, check for gz file variant
				if (mime_type.match(self.regexTextContent) && request.headers['accept-encoding'] && request.headers['accept-encoding'].match(/\bgzip\b/i)) {
					var gz_file = file + '.gz';
					
					stat( gz_file, function(err, stats) {
						if (err) return callback(); // non-fatal, fallback to non-gz
						
						// go for gz version
						file = gz_file;
						file_stats = stats;
						headers['Content-Encoding'] = 'gzip';
						self.logDebug(9, "Serving pre-gzipped version of file: " + file);
						callback();
					}); // fs.stat
				}
				else process.nextTick(callback);
			}
		],
		function(err) {
			if (err) {
				return self.sendHTTPResponse( args, 
					"404 Not Found", 
					{ 'Content-Type': "text/html" }, 
					"404 Not Found: " + request.url + "\n"
				);
			}
			
			// redirect for dir index without trailing slash
			if (is_dir && !request.url.match(/\/(\?|$)/)) {
				var new_url = self.getSelfURL( request, request.url.replace( /^(.+?)(\?.*)?$/, '$1/$2' ) );
				self.logDebug(9, "Redirecting for directory (adding trailing slash): " + new_url);
				return self.sendHTTPResponse( args, 
					"302 Found", 
					{ 'Location': new_url.replace(self.badHeaderCharPattern, '') }, 
					""
				);
			}
			
			// range request or nah
			var range = self.parseByteRange(request, file_stats);
			if (range) {
				headers['Content-Range'] = 'bytes ' + range.from + '-' + range.to + '/' + file_stats.size;
				http_status = "206 Partial Content";
				self.logDebug(9, "Serving partial file content: " + headers['Content-Range']);
			}
			else {
				range = { from: 0, to: file_stats.size - 1 };
			}
			
			// conditional get
			const file_mtime = file_stats.mtime.getTime();
			const file_etag = JSON.stringify([file_stats.ino, file_stats.size, file_mtime].join('-'));
			const req_etag = request.headers['if-none-match'];
			const req_mtime = Date.parse( request.headers['if-modified-since'] );
			
			if ((req_mtime || req_etag) && (!req_etag || (req_etag === file_etag)) && (!req_mtime || (req_mtime >= file_mtime))) {
				// file has not changed, send back 304
				return self.sendHTTPResponse( args, "304 Not Modified", {}, "" );
			}
			
			// standard headers
			headers['Etag'] = file_etag;
			headers['Last-Modified'] = (new Date(file_stats.mtime)).toUTCString();
			headers['Content-Type'] = mime_type;
			headers['Content-Length'] = (range.to - range.from) + 1;
			
			// cache-control
			var ttl = args.internalTTL || self.config.get('http_static_ttl') || 0;
			if (typeof(ttl) == 'number') headers['Cache-Control'] = "public, max-age=" + ttl;
			else headers['Cache-Control'] = ttl;
			
			// check for HEAD request
			if (request.method == 'HEAD') {
				return self.sendHTTPResponse( args, http_status, headers, "" );
			}
			
			// open file stream
			var stream = createReadStream( file, {
				start: range.from,
				end: range.to
			} );
			
			// send it
			self.sendHTTPResponse( args, http_status, headers, stream );
			
		}); // async.series
	}
	
	parseByteRange(req, stat) {
		// parse byte range header from request
		// Example header: Range: bytes=31-49
		const byteRange = {
			from: 0,
			to: 0
		}
		
		let rangeHeader = req.headers['range'];
		const flavor = 'bytes=';
		
		if (rangeHeader && rangeHeader.startsWith(flavor) && !rangeHeader.includes(',')) {
			// Parse
			rangeHeader = rangeHeader.substr(flavor.length).split('-');
			byteRange.from = parseInt(rangeHeader[0]);
			byteRange.to = parseInt(rangeHeader[1]);
			
			// Replace empty fields of differential requests by absolute values 
			if (isNaN(byteRange.from) && !isNaN(byteRange.to)) {
				byteRange.from = stat.size - byteRange.to;
				byteRange.to = stat.size ? stat.size - 1 : 0;
			} 
			else if (!isNaN(byteRange.from) && isNaN(byteRange.to)) {
				byteRange.to = stat.size ? stat.size - 1 : 0;
			}
			
			// General byte range validation
			if (!isNaN(byteRange.from) && !isNaN(byteRange.to) && (0 <= byteRange.from) && (byteRange.from <= byteRange.to) && (byteRange.to < stat.size)) {
				return byteRange;
			}
		}
		
		return null;
	}
//#endregion

//#region ---- HANDLERS ----

	addURIFilter(uri, name, callback) {
		// add custom filter (chainable pre-handler) for URI
		this.logDebug(3, "Adding custom URI filter: " + uri + ": " + name);
		
		if (typeof(uri) == 'string') {
			uri = new RegExp("^" + uri + "$");
		}
		
		this.uriFilters.push({
			regexp: uri,
			name: name,
			callback: callback
		});
	}
	
	removeURIFilter(name) {
		// remove filter for URI given name
		this.uriFilters = this.uriFilters.filter( function(item) {
			return( item.name != name );
		} );
	}
	
	addURIHandler() {
		// add custom handler for URI
		// Calling conventions:
		//		uri, name, callback
		//		uri, name, acl, callback
		var self = this;
		var uri = arguments[0];
		var name = arguments[1];
		var acl = false;
		var callback = null;
		
		if (arguments.length == 4) { acl = arguments[2]; callback = arguments[3]; }
		else { callback = arguments[2]; }
		
		if (acl) {
			if (Array.isArray(acl)) {
				// custom ACL for this handler
				var blocks = new ACL();
				try {
					acl.forEach( function(block) {
						blocks.add( block );
					} );
					acl = blocks;
				}
				catch (err) {
					var err_msg = "Failed to initialize custom ACL: " + err.message;
					this.logError('acl', err_msg);
					throw new Error(err_msg);
				}
			}
			else {
				// use default ACL list
				acl = this.defaultACL;
			}
		} // acl
		
		this.logDebug(3, "Adding custom URI handler: " + uri + ": " + name);
		if (typeof(uri) == 'string') {
			uri = new RegExp("^" + uri + "$");
		}
		
		// special case: pass string as callback for internal file redirect
		if (typeof(callback) == 'string') {
			var target_file = callback;
			callback = function(args, cb) {
				self.logDebug(9, "Performing internal redirect to: " + target_file);
				args.internalFile = target_file;
				cb(false);
			};
		}
		
		this.uriHandlers.push({
			regexp: uri,
			name: name,
			acl: acl,
			callback: callback
		});
	}
	
	removeURIHandler(name) {
		// remove handler for URI given name
		this.uriHandlers = this.uriHandlers.filter( function(item) {
			return( item.name != name );
		} );
	}
	
	addMethodHandler(method, name, callback) {
		// add a handler for an entire request method, e.g. OPTIONS
		this.logDebug(3, "Adding custom request method handler: " + method + ": " + name);
		this.methodHandlers.push({
			method: method,
			name: name,
			callback: callback
		});
	}
	
	removeMethodHandler(name) {
		// remove handler for method given name
		this.methodHandlers = this.methodHandlers.filter( function(item) {
			return( item.name != name );
		} );
	}
	
	addDirectoryHandler(uri_match, base_path, opts) {
		// special URI handler that serves up a static directory
		// opts: { acl, ttl, headers }
		var self = this;
		if (!opts) opts = {};
		
		if (typeof(uri_match) == 'string') {
			// if string, assume is uri prefix
			uri_match = new RegExp("^" + uri_match);
		}
		
		this.addURIHandler(uri_match, "Static Directory: " + uri_match, opts.acl, function(args, callback) {
			var uri = args.request.url.replace(/\?.*$/, '');
			var file = join( base_path, uri.replace(uri_match, '') ).replace(/\/$/, '');
			
			self.logDebug(9, "Routing static request for: " + uri, {
				base_path: base_path,
				file: file
			});
			
			if (opts.headers) {
				for (var key in opts.headers) {
					args.response.setHeader( key, opts.headers[key] );
				}
			}
			
			args.internalTTL = opts.ttl || 0;
			args.internalFile = file;
			callback(false);
		});
	}
	
	removeDirectoryHandler(uri_match) {
		// remove static directory handler by uri match specifier
		if (typeof(uri_match) == 'string') {
			// if string, assume is uri prefix
			uri_match = new RegExp("^" + uri_match);
		}
		this.removeURIHandler( "Static Directory: " + uri_match );
	}
	
//#endregion

}


