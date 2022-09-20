import PixlServer from "../pixl/server.mjs";
import Storage from "../pixl/storage.mjs";
import API from "../pixl/api.mjs";
import WebServer from "../pixl/web.mjs";
import User from "../pixl/user.mjs";
import Engine from './engine.js'
import { require, timeNow, escapeRegExp } from "../pixl/tools.mjs";

import StandaloneStorage from '../pixl/storage-standalone.mjs'
import { eachSeries } from 'async'
import { hostname as getHost, networkInterfaces } from 'os'
import chalk from 'chalk';
const print = console.log

export default class Cronicle extends PixlServer {

    __name = 'Cronicle'

    Storage = new Storage()
    WebServer = new WebServer()
    API = new API()
    User = new User()
    Engine = new Engine()

    components = [this.Storage, this.WebServer, this.API, this.User, this.Engine]

    constructor(props) {
       // props.components = [Storage, WebServer, API, User, Engine]
        super(props)
    }

    /**
     * 
     * @param {string} config_file 
     * @returns {CronicleConfig}
     */
    static getConfig(config_file) {

        if (!config_file) {
            return {
                "base_app_url": "http://localhost:3012",
                "email_from": "admin@cronicle.com",
                "smtp_hostname": "mailrelay.cronicle.com",
                "smtp_port": 25,
                "ad_domain": "corp.cronicle.com",

                "log_dir": "cronicle/logs",
                "log_filename": "[component].log",
                "log_columns": ["hires_epoch", "date", "hostname", "pid", "component", "category", "code", "msg", "data"],
                "log_archive_path": "logs/archives/[yyyy]/[mm]/[dd]/[filename]-[yyyy]-[mm]-[dd].log.gz",
                "log_crashes": true,
                "pid_file": "cronicle/logs/cronicled.pid",
                "copy_job_logs_to": "",
                "queue_dir": "cronicle/queue",
                "debug_level": 6,
                "maintenance": "04:00",
                "list_row_max": 10000,
                "job_data_expire_days": 180,
                "child_kill_timeout": 10,
                "dead_job_timeout": 120,
                "manager_ping_freq": 20,
                "manager_ping_timeout": 60,
                "udp_broadcast_port": 3014,
                "scheduler_startup_grace": 10,
                "universal_web_hook": "",
                "track_manual_jobs": false,
                "max_jobs": 0,

                "server_comm_use_hostnames": true,
                "web_direct_connect": false,
                "web_socket_use_hostnames": true,

                "job_memory_max": 1073741824,
                "job_memory_sustain": 0,
                "job_cpu_max": 0,
                "job_cpu_sustain": 0,
                "job_log_max_size": 0,
                "job_env": {},

                "web_hook_text_templates": {
                    "job_start": "🚀 *[event_title]* started on [hostname] <[job_details_url] | More details>",
                    "job_complete": "✔️ *[event_title]* completed successfully on [hostname] <[job_details_url] | More details>",
                    "job_warning": "⚠️ *[event_title]* completed with warning on [hostname]:\nWarning: _*[description]*_\n <[job_details_url] | More details>",
                    "job_failure": "❌ *[event_title]* failed on [hostname]:\nError: _*[description]*_\n <[job_details_url] | More details>",
                    "job_launch_failure": "💥 Failed to launch *[event_title]*:\n*[description]*\n<[edit_event_url] | More details>"
                },

                "client": {
                    "name": "Cronicle",
                    "debug": 1,
                    "default_password_type": "password",
                    "privilege_list": [
                        { "id": "admin", "title": "Administrator" },
                        { "id": "create_events", "title": "Create Events" },
                        { "id": "edit_events", "title": "Edit Events" },
                        { "id": "delete_events", "title": "Delete Events" },
                        { "id": "run_events", "title": "Run Events" },
                        { "id": "abort_events", "title": "Abort Events" },
                        { "id": "state_update", "title": "Toggle Scheduler" }
                    ],
                    "new_event_template": {
                        "enabled": 1,
                        "params": {},
                        "timing": { "minutes": [0] },
                        "max_children": 1,
                        "timeout": 3600,
                        "catch_up": 0,
                        "queue_max": 1000
                    }
                },

                "Storage": {
                    "engine": "Filesystem",
                    "list_page_size": 50,
                    "concurrency": 4,
                    "log_event_types": { "get": 1, "put": 1, "head": 1, "delete": 1, "expire_set": 1 },

                    "Filesystem": {
                        "base_dir": "cronicle/data",
                        "key_namespaces": 1
                    }
                },

                "WebServer": {
                    "http_port": 3012,
                    "http_htdocs_dir": "htdocs",
                    "http_max_upload_size": 104857600,
                    "http_static_ttl": 3600,
                    "http_static_index": "index.html",
                    "http_server_signature": "Cronicle 1.0",
                    "http_gzip_text": true,
                    "http_timeout": 30,
                    "http_regex_json": "(text|javascript|js|json)",
                    "http_response_headers": {
                        "Access-Control-Allow-Origin": "*"
                    },

                    "https": false,
                    "https_port": 3013,
                    "https_cert_file": "conf/ssl.crt",
                    "https_key_file": "conf/ssl.key",
                    "https_force": false,
                    "https_timeout": 30,
                    "https_header_detect": {
                        "Front-End-Https": "^on$",
                        "X-Url-Scheme": "^https$",
                        "X-Forwarded-Protocol": "^https$",
                        "X-Forwarded-Proto": "^https$",
                        "X-Forwarded-Ssl": "^on$"
                    }
                },

                "User": {
                    "session_expire_days": 30,
                    "max_failed_logins_per_hour": 5,
                    "max_forgot_passwords_per_hour": 3,
                    "free_accounts": false,
                    "sort_global_users": true,
                    "use_bcrypt": true,

                    "email_templates": {
                        "welcome_new_user": "conf/emails/welcome_new_user.txt",
                        "changed_password": "conf/emails/changed_password.txt",
                        "recover_password": "conf/emails/recover_password.txt"
                    },

                    "default_privileges": {
                        "admin": 0,
                        "create_events": 1,
                        "edit_events": 1,
                        "delete_events": 1,
                        "run_events": 0,
                        "abort_events": 0,
                        "state_update": 0
                    }
                }

            }
        }
        else {
            return require(config_file)
        }

    }

    static printHelp() {
        console.log(`        
        --config, -C       path to config file
        --nocolor          turn off colors
        --secret-key       specify secret key for cluster/encryption 
        --secret-key-file  get secret key from file    
        `.split('\n').map(e => e.trim()).join("\n"))
    }

    static initStorage(config_file, setup_file) {

        let conf = require(config_file)
        let setup = require(setup_file)
        let hostname = getHost()
        let ip = Object.entries(networkInterfaces()).map(e => e[1]).flat().filter(e => !e.internal && e.family == 'IPv4')[0].address

        conf.Storage.debug = false
        // prevent logging transactions to STDOUT
        if (!conf.Storage.debug) conf.Storage.log_event_types = {};

        const storage = new StandaloneStorage(conf.Storage, (err) => {

            if (err) throw err

            storage.get('global/users', function (err) {
                if (!err) {
                    print("Storage has already been set up.  There is no need to run this command again.\n");
                    storage.shutdown(() => process.exit(0))
                }

                print(`\nSetting up storage for ${chalk.bold(hostname)} [${chalk.italic.gray(ip)}] \n`)

                eachSeries(setup.storage, (params, callback) => {

                    let func = params.shift();
                    params.push(callback);

                    // massage a few params
                    if (typeof (params[1]) == 'object') {
                        let obj = params[1];
                        if (obj.created) obj.created = timeNow(true);
                        if (obj.modified) obj.modified = timeNow(true);
                        if (obj.regexp && (obj.regexp == '_HOSTNAME_')) obj.regexp = '^(' + escapeRegExp(hostname) + ')$';
                        if (obj.hostname && (obj.hostname == '_HOSTNAME_')) obj.hostname = hostname;
                        if (obj.ip && (obj.ip == '_IP_')) obj.ip = ip;
                    }

                    // call storage directly
                    storage[func].apply(storage, params);
                },
                    function (err) {
                        if (err) throw err;

                        print(chalk.bold.greenBright("Setup completed successfully!\n"));
                        print("This server has been added as the single primary manager server.");
                        print("An administrator account has been created with username 'admin' and password 'admin'.");
                        print(`Then, the web interface should be available at: http://${hostname}:${conf.WebServer.http_port} \n`);

                        storage.shutdown(function () { process.exit(0); });
                    }
                );

                // storage.shutdown( ()=>process.exit(0))
            }); // check
        });
    }

}



