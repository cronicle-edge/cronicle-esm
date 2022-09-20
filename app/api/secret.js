// Cronicle API Layer - Secrets
// Server => Engine => API [ Secret ]
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

import { timeNow } from "../../pixl/tools.mjs";
import Component from "../../pixl/component.mjs";

export default class APISecret extends Component {

	api_get_secret(args, callback) {
		// get single Secret for editing
		const self = this;
		let params = args.params;
		if (!this.requiremanager(args, callback)) return;

		if (!this.requireParams(params, {
			id: /^\w+$/
		}, callback)) return;

		this.loadSession(args, function (err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;

			self.storage.listFind('global/secrets', { id: params.id }, async function (err, item) {
				if (err || !item) {
					return self.doError('secret', "Failed to locate Secret: " + params.id, callback);
				}

				let secret = JSON.parse(JSON.stringify(item)); // copy object 

				if (secret.encrypted && secret.data) {
					try {
						secret.data = self.decryptObject(secret.data)
					}
					catch (err) {
						secret.data = "Failed to decrypt secret:\n" + err;
					}
				}

				callback({ code: 0, secret: secret });

			}); // got secret
		}); // loaded session
	}

	api_create_secret(args, callback) {
		// add new Secret
		const self = this;
		let params = args.params;
		if (!this.requiremanager(args, callback)) return;

		if (!this.requireParams(params, {
			id: /\S/,
			data: /\S/
		}, callback)) return;

		this.loadSession(args, async function (err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;

			args.user = user;
			args.session = session;

			params.id = params.id || self.getUniqueID('s');
			params.username = user.username;
			params.created = params.modified = timeNow(true);

			if (!params.active) params.active = 1;
			if (!params.description) params.description = "";
			params.encrypted = params.encrypted ? true : false;

			if (params.encrypted) {
				try {
					params.data = self.encryptObject(params.data)
				}
				catch (err) {
					self.logDebug(6, "Failed to encrypt secret", err);
					return self.doError('secret', "Failed to encrypt secret", callback);
				}
			}

			self.logDebug(6, "Creating new Secret: " + params.id, params.id);

			self.storage.listUnshift('global/secrets', params, function (err) {
				if (err) {
					return self.doError('secret', "Failed to create secret: " + err, callback);
				}

				self.logDebug(6, "Successfully created secret: " + params.id, params.id);
				self.logTransaction('secret_create', params.id, self.getClientInfo(args, { secret: params.id }));
				self.logActivity('secret_create', { secret: params.id, encrypted: params.encrypted }, args);

				callback({ code: 0, id: params.id, key: params.key });

				// broadcast update to all websocket clients
				self.authSocketEmit('update', { secrets: {} });
				self.updateSecrets();
			}); // list insert
		}); // load session
	}

	api_update_secret(args, callback) {
		// update existing Secret
		const self = this;
		let params = args.params;
		if (!this.requiremanager(args, callback)) return;

		if (!this.requireParams(params, {
			id: /^\w+$/,
			data: /\S/
		}, callback)) return;

		this.loadSession(args, async function (err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;

			args.user = user;
			args.session = session;

			params.modified = timeNow(true);

			self.logDebug(6, "Updating Secret: " + params.id, params.id);

			if (params.encrypted) {
				try {
					params.data = self.encryptObject(params.data)
				}
				catch (err) {
					self.logDebug(6, "Failed to encrypt secret", err);
					return self.doError('secret', "Failed to encrypt secret", callback);
				}
			}

			self.storage.listFindUpdate('global/secrets', { id: params.id }, params, function (err, secret) {
				if (err) {
					return self.doError('secret', "Failed to update secretX: " + err, callback);
				}

				self.logDebug(6, "Successfully updated secret: " + secret.id, secret.id);
				self.logTransaction('secret_update', secret.id, self.getClientInfo(args, { secret: secret.id }));
				self.logActivity('secret_update', { secret: secret.id, encrypted: secret.encrypted }, args);

				callback({ code: 0 });

				// broadcast update to all websocket clients
				self.authSocketEmit('update', { secrets: {} });
				self.updateSecrets();
			});

		});
	}

	api_delete_secret(args, callback) {
		// delete existing Secret
		const self = this;
		let params = args.params;
		if (!this.requiremanager(args, callback)) return;

		if (!this.requireParams(params, {
			id: /^\w+$/
		}, callback)) return;

		this.loadSession(args, function (err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;

			args.user = user;
			args.session = session;

			self.logDebug(6, "Deleting Secret: " + params.id, params.id);

			self.storage.listFindDelete('global/secrets', { id: params.id }, function (err, secret) {
				if (err) {
					return self.doError('secret', "Failed to delete Secret: " + err, callback);
				}

				self.logDebug(6, "Successfully deleted Secret: " + secret.id, secret.id);
				self.logTransaction('secret_delete', secret.id, self.getClientInfo(args, { secret: secret.id }));
				self.logActivity('secret_delete', { secret: secret.id, encrypted: secret.encrypted }, args);

				callback({ code: 0 });

				// broadcast update to all websocket clients
				self.authSocketEmit('update', { secrets: {} });
				self.updateSecrets();
			});
		});
	}

}

