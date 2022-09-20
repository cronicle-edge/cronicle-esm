// Cronicle API Layer - Configuration
// Server => Engine => API [ Config ]
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License


import { mergeHashes } from "../../pixl/tools.mjs";
import Component from "../../pixl/component.mjs";

export default class APIConfig extends Component {
	
	api_config(args, callback) {
		// send config to client
		
		// do not cache this API response
		this.forceNoCacheResponse(args);
		
		// if there is no manager server, this has to fail (will be polled for retries)
		if (!this.multi.managerHostname) {
			return callback({ code: 'manager', description: "No manager server found" });
		}
		
		var resp = {
			code: 0,
			version: this.server.__version,
			config: mergeHashes( this.server.config.get('client'), {
				debug: this.server.debug ? 1 : 0,
				job_memory_max: this.server.config.get('job_memory_max'),
				base_api_uri: this.api.config.get('base_uri'),
				default_privileges: this.usermgr.config.get('default_privileges'),
				free_accounts: this.usermgr.config.get('free_accounts'),
				external_users: this.usermgr.config.get('external_user_api') ? 1 : 0,
				external_user_api: this.usermgr.config.get('external_user_api') || '',
				web_socket_use_hostnames: this.server.config.get('web_socket_use_hostnames') || 0,
				web_direct_connect: this.server.config.get('web_direct_connect') || 0,
				custom_live_log_socket_url: this.server.config.get('custom_live_log_socket_url'),
				ui: this.server.config.get('ui') || {},
				socket_io_transports: this.server.config.get('socket_io_transports') || 0
			} ),
			port: args.request.headers.ssl ? this.web.config.get('https_port') : this.web.config.get('http_port'),
			manager_hostname: this.multi.managerHostname
		};
		
		// if we're manager, then return our ip for websocket connect
		if (this.multi.manager) {
			resp.servers = {};
			resp.servers[ this.server.hostname ] = {
				hostname: this.server.hostname,
				ip: this.server.ip
			};
		}
		
		callback(resp);
	}
	
}