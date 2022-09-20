// Storage System - Standalone Mode
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

import Config from "./config.mjs";
import Storage from "./storage.mjs";
import EventEmitter from 'events';

export default class StandaloneStorage extends Storage {    
    
    constructor(config, callback) {
        super()
        this.server = new EventEmitter();
        this.server.debug = false;
        this.server.config = new Config({});
        this.server.logger = {
            get: function (key) { return (key == 'debugLevel') ? 9 : ''; },
            set: function (key, value) { this[key] = value; },
            debug: function (level, msg, data) {
                if (server.debug) {
                    if (data) msg += " (" + JSON.stringify(data) + ")";
                    console.log('[' + ((new Date()).getTime() / 1000) + '][DEBUG] ' + msg);
                }
            },
            error: function (code, msg, data) {
                if (data) msg += " (" + JSON.stringify(data) + ")";
                console.log('[' + ((new Date()).getTime() / 1000) + '][ERROR][' + code + '] ' + msg);
            },
            transaction: function (code, msg, data) {
                if (data) msg += " (" + JSON.stringify(data) + ")";
                console.log('[' + ((new Date()).getTime() / 1000) + '][TRANSACTION][' + code + '] ' + msg);
            }
        };

        if (config.logger) {
            this.server.logger = config.logger;
            delete config.logger;
        }

        this.config = new Config(config);
        this.server.debug = !!this.config.get('debug');

        this.init(this.server, this.config);
        this.server.Storage = this;

        let server = this.server

        process.nextTick(function () {
            server.Storage.startup(callback || function () { ; });
        });
    }

}
