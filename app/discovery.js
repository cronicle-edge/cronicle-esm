// Cronicle Server Discovery Layer
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

import { createSocket } from "dgram";
import { networkInterfaces } from 'os';
import { Netmask } from 'netmask';

import { create } from "../pixl/class.mjs";
import { timeNow, findObject } from "../pixl/tools.mjs";
import Component from "../pixl/component.mjs";

export default class Discovery extends Component{
	
	nearbyServers = null
	lastDiscoveryBroadcast = 0
	
	setupDiscovery(callback) {
		// setup auto-discovery system
		// listen for UDP pings, and broadcast our own ping
		var self = this;
		
		this.nearbyServers = {};
		this.lastDiscoveryBroadcast = 0;
		
		// disable if port is unset
		if (!this.server.config.get('udp_broadcast_port')) {
			if (callback) callback();
			return;
		}
		
		// guess best broadcast IP
		this.broadcastIP = this.server.config.get('broadcast_ip') || this.calcBroadcastIP();
		this.logDebug(4, "Using broadcast IP: " + this.broadcastIP );
		
		// start UDP socket listener
		this.logDebug(4, "Starting UDP server on port: " + this.server.config.get('udp_broadcast_port'));
		var listener = this.discoveryListener = createSocket("udp4");
		
		listener.on("message", function (msg, rinfo) {
			self.discoveryReceive( msg, rinfo );
		} );
		
		listener.on("error", function (err) {
			self.logError('udp', "UDP socket listener error: " + err);
			self.discoveryListener = null;
		} );

				
		listener.bind( this.server.config.get('udp_broadcast_port'), function() {
			if (callback) callback();
		} );
	}
	
	discoveryTick() {
		// broadcast pings every N
		if (!this.discoveryListener) return;
		var now = timeNow(true);
		
		if (now - this.lastDiscoveryBroadcast >= this.server.config.get('manager_ping_freq')) {
			this.lastDiscoveryBroadcast = now;
			
			// only broadcast if not part of a cluster
			if (!this.multi.cluster) {
				this.discoveryBroadcast( 'heartbeat', {
					hostname: this.server.hostname,
					ip: this.server.ip
				} );
			}
			
			// prune servers who have stopped broadcasting
			for (var hostname in this.nearbyServers) {
				var server = this.nearbyServers[hostname];
				if (now - server.now >= this.server.config.get('manager_ping_timeout')) {
					delete this.nearbyServers[hostname];
					if (this.multi.manager) {
						this.authSocketEmit( 'update', { nearby: this.nearbyServers } );
					}
				}
			}
		}
	}
	
	discoveryBroadcast(type, message, callback) {
		// broadcast message via UDP
		const self = this;
		
		message.action = type;
		this.logDebug(10, "Broadcasting message: " + type, message);
		
		let client = createSocket('udp4');
		var message = Buffer.from( JSON.stringify(message) + "\n" );
		client.bind( 0, function() {
			client.setBroadcast( true );			
			client.send(message, 0, message.length, self.server.config.get('udp_broadcast_port'), self.broadcastIP, function(err) {
				if (err) self.logDebug(9, "UDP broadcast failed: " + err);
				client.close();
				if (callback) callback();
			
			} );
		} );
	}
	
	discoveryReceive(msg, rinfo) {
		// receive UDP message from another server
		this.logDebug(10, "Received UDP message: " + msg + " from " + rinfo.address + ":" + rinfo.port);
		
		var text = msg.toString();
		if (text.match(/^\{/)) {
			// appears to be JSON
			var json = null;
			try { json = JSON.parse(text); }
			catch (e) {
				this.logError(9, "Failed to parse UDP JSON message: " + e);
			}
			if (json && json.action) {
				switch (json.action) {
					
					case 'heartbeat':
						if (json.hostname && (json.hostname != this.server.hostname)) {
							json.now = timeNow();
							delete json.action;
							
							if (!this.nearbyServers[ json.hostname ]) {
								// first time we've seen this server
								this.nearbyServers[ json.hostname ] = json;
								if (this.multi.manager) {
									this.logDebug(6, "Discovered nearby server: " + json.hostname, json);
									this.authSocketEmit( 'update', { nearby: this.nearbyServers } );
								}
							}
							else {
								// update from existing server
								this.nearbyServers[ json.hostname ] = json;
							}
							this.logDebug(10, "Received heartbeat from: " + json.hostname, json);
						}
					break;
					
				} // switch action
			} // got json
		} // appears to be json
	}
	
	calcBroadcastIP() {
		// Attempt to determine server's Broadcast IP, using the first LAN IP and Netmask
		// https://en.wikipedia.org/wiki/Broadcast_address
		var ifaces = networkInterfaces();
		var addrs = [];
		for (var key in ifaces) {
			if (ifaces[key] && ifaces[key].length) {
				Array.from(ifaces[key]).forEach( function(item) { addrs.push(item); } );
			}
		}
		var addr = findObject( addrs, { family: 'IPv4', internal: false } );
		if (addr && addr.address && addr.address.match(/^\d+\.\d+\.\d+\.\d+$/) && addr.netmask && addr.netmask.match(/^\d+\.\d+\.\d+\.\d+$/)) {
			// well that was easy
			var ip = addr.address;
			var mask = addr.netmask;
			
			var block = null;
			try { block = new Netmask( ip + '/' + mask ); }
			catch (err) {;}
			
			if (block && block.broadcast && block.broadcast.match(/^\d+\.\d+\.\d+\.\d+$/)) {
				return block.broadcast;
			}
		}
		return '255.255.255.255';
	}
	
	shutdownDiscovery() {
		// shutdown
		var self = this;
		
		// shutdown UDP listener
		if (this.discoveryListener) {
			this.logDebug(3, "Shutting down UDP server");
			//this.discoveryListener.removeAllListeners()
			const self = this
			this.discoveryListener.close(function() { self.logDebug(3, "UDP server has shut down."); })
			
		}
	}
	
}

// export default Discovery
