// Cronicle API Layer - Server Groups
// Server => Engine => API [ Group ]
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

import Component from "../../pixl/component.mjs";

export default class APIGroup extends Component {
	
	api_create_server_group(args, callback) {
		// add new server group
		var self = this;
		var group = args.params;
		if (!this.requiremanager(args, callback)) return;
		
		if (!this.requireParams(group, {
			title: /\S/,
			regexp: /\S/
		}, callback)) return;
	    
		// make sure title doesn't contain HTML metacharacters
	    if (group.title && group.title.match(/[<>]/)) {
		   return this.doError('api', "Malformed title parameter: Cannot contain HTML metacharacters", callback);
	    }		
		
		this.loadSession(args, function(err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;
			
			args.user = user;
			args.session = session;
			
			if (group.id) group.id = group.id.toString().toLowerCase().replace(/\W+/g, '');
			if (!group.id) group.id = self.getUniqueID('g');
			
			self.logDebug(6, "Creating new server group: " + group.title, group);
			
			self.storage.listUnshift( 'global/server_groups', group, function(err) {
				if (err) {
					return self.doError('group', "Failed to create server group: " + err, callback);
				}
				
				self.logDebug(6, "Successfully created server group: " + group.title, group);
				self.logTransaction('group_create', group.title, self.getClientInfo(args, { group: group }));
				self.logActivity('group_create', { group: group }, args);
				
				callback({ code: 0, id: group.id });
				
				// broadcast update to all websocket clients
				self.updateClientData( 'server_groups' );
				
				// notify all worker servers about the change as well
				// this may have changed their manager server eligibility
				self.workerNotifyGroupChange();
			} ); // list insert
		} ); // load session
	}
	
	api_update_server_group(args, callback) {
		// update existing server group
		var self = this;
		var params = args.params;
		if (!this.requiremanager(args, callback)) return;
		
		if (!this.requireParams(params, {
			id: /^\w+$/
		}, callback)) return;


		// make sure title doesn't contain HTML metacharacters
		if (params.title && params.title.match(/[<>]/)) {
			return this.doError('api', "Malformed title parameter: Cannot contain HTML metacharacters", callback);
		}

		
		this.loadSession(args, function(err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;
			
			args.user = user;
			args.session = session;
			
			self.logDebug(6, "Updating server group: " + params.id, params);
			
			self.storage.listFindUpdate( 'global/server_groups', { id: params.id }, params, function(err, group) {
				if (err) {
					return self.doError('group', "Failed to update server group: " + err, callback);
				}
				
				self.logDebug(6, "Successfully updated server group: " + group.title, group);
				self.logTransaction('group_update', group.title, self.getClientInfo(args, { group: group }));
				self.logActivity('group_update', { group: group }, args);
				
				callback({ code: 0 });
				
				// broadcast update to all websocket clients
				self.updateClientData( 'server_groups' );
				
				// notify all worker servers about the change as well
				// this may have changed their manager server eligibility
				self.workerNotifyGroupChange();
			} );
		} );
	}
	
	api_delete_server_group(args, callback) {
		// delete existing server group
		var self = this;
		var params = args.params;
		if (!this.requiremanager(args, callback)) return;
		
		if (!this.requireParams(params, {
			id: /^\w+$/
		}, callback)) return;
		
		this.loadSession(args, function(err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;
			
			args.user = user;
			args.session = session;
			
			// Do not allow deleting group if any matching events in schedule
			self.storage.listFind( 'global/schedule', { target: params.id }, function(err, item) {
				if (item) {
					return self.doError('plugin', "Failed to delete server group: Still targeted by one or more events.", callback);
				}
					
				self.logDebug(6, "Deleting server group: " + params.id, params);
				
				self.storage.listFindDelete( 'global/server_groups', { id: params.id }, function(err, group) {
					if (err) {
						return self.doError('group', "Failed to delete server group: " + err, callback);
					}
					
					self.logDebug(6, "Successfully deleted server group: " + group.title, group);
					self.logTransaction('group_delete', group.title, self.getClientInfo(args, { group: group }));
					self.logActivity('group_delete', { group: group }, args);
					
					callback({ code: 0 });
					
					// broadcast update to all websocket clients
					self.updateClientData( 'server_groups' );
					
					// notify all worker servers about the change as well
					// this may have changed their manager server eligibility
					self.workerNotifyGroupChange();
					
				} ); // listFindDelete (group)
			} ); // listFind (schedule)
		} ); // load session
	}
	
} 

