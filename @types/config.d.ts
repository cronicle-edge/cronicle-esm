declare class CronicleConfig {

    "base_app_url": "http://localhost:3012"
    "email_from": "admin@cronicle.com"
    "smtp_hostname": "mailrelay.cronicle.com"
    "smtp_port": 25
    "secret_key": string
    "ad_domain": "corp.cronicle.com"
    "foreground": true
    "echo": true
    "color": true
    "manager": false
        
    "log_dir": "logs"
    "log_filename": "[component].log"
    "log_columns": ["hires_epoch", "date", "hostname", "pid", "component", "category", "code", "msg", "data"]
    "log_archive_path": "logs/archives/[yyyy]/[mm]/[dd]/[filename]-[yyyy]-[mm]-[dd].log.gz"
    "log_crashes": true
    "pid_file": "logs/cronicled.pid"
    "copy_job_logs_to": ""
    "queue_dir": "queue"
    "debug_level": 6
    "maintenance": "04:00"
    "list_row_max": 10000
    "job_data_expire_days": 180
    "child_kill_timeout": 10
    "dead_job_timeout": 120
    "manager_ping_freq": 20
    "manager_ping_timeout": 60
    "udp_broadcast_port": 3014
    "scheduler_startup_grace": 10
    "universal_web_hook": ""
    "track_manual_jobs": false
    "max_jobs": 0
    
    "server_comm_use_hostnames": true
    "web_direct_connect": false
    "web_socket_use_hostnames": true
    
    "job_memory_max": 1073741824
    "job_memory_sustain": 0
    "job_cpu_max": 0
    "job_cpu_sustain": 0
    "job_log_max_size": 0
    "job_env": {}
    
    "web_hook_text_templates": {
        "job_start": "🚀 *[event_title]* started on [hostname] <[job_details_url] | More details>",
        "job_complete": "✔️ *[event_title]* completed successfully on [hostname] <[job_details_url] | More details>",
        "job_warning": "⚠️ *[event_title]* completed with warning on [hostname]:\nWarning: _*[description]*_\n <[job_details_url] | More details>",
        "job_failure": "❌ *[event_title]* failed on [hostname]:\nError: _*[description]*_\n <[job_details_url] | More details>",
        "job_launch_failure": "💥 Failed to launch *[event_title]*:\n*[description]*\n<[edit_event_url] | More details>"
      }
    
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
    }

    "Storage": {
        "engine": "Filesystem",
        "list_page_size": 50,
        "concurrency": 4,
        "log_event_types": { "get": 1, "put": 1, "head": 1, "delete": 1, "expire_set": 1 },
        
        "Filesystem": {
            "base_dir": "data",
            "key_namespaces": 1
        }
    }
    
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
    }
    
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