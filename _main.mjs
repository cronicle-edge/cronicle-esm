#!/usr/bin/env node 

import Cronicle from './app/cronicle.js'
import { createRequire } from 'module';
import Args from './pixl/args.mjs'
import {readFileSync, existsSync} from 'fs'

//const require = createRequire(import.meta.url);

let args = (new Args()).get()
const print = console.log

// -------------------------  INIT STORAGE -------------------------
if(args.other && args.other[0] === 'init') {
    if(args.help) {
        print('\nInit storage system. Options:')
        print(' --config, -C       use specific config file (conf/config.json or built in by default)')
        print(' --setup            use specific setup.json file (conf/setup.json by default)\n')
        process.exit(0)
    }    
    Cronicle.initStorage(args.C || args.config || './conf/config.json', args.setup || './conf/setup.json')
}

// -------------------------  HELP MESSAGE -------------------------
else if (args.help) { Cronicle.printHelp(); process.exit(0) }

else {

// ------------------------- NORMAL STARTUP -------------------------

let defaultConf = existsSync('./conf/config.json') ? './conf/config.json' : null // null will load baked-in configs
let conf = Cronicle.getConfig(args.C || args.config || defaultConf)

// resolve secret key. Can also be set via CRONCILE_secret_key variable
if(args.secret_key) conf.secret_key = args.secret_key
if(args.secret_key_file) conf.secret_key = readFileSync(args.secret_key_file)
if(Number.isInteger(conf.secret_key)) throw new Error("Secret key cannot be numeric")

conf.manager = true //!!args.manager
conf.echo = true
conf.foreground = true 
conf.color = !args.nocolor // enable colors by default
conf.debug_level  = args.debug_level || 6

const server = new Cronicle({
    __version: process.env.CRONICLE_version || ( createRequire(import.meta.url)(('./package.json')).version + ` @ Node: ${process.version}`),
    //configFile: process.env['config_file'] || './conf/config.json'
    config: conf // will be overwritten by --config argument if provided
})

// server startup complete
server.startup( ()=> { process.title = server.__name + ' Server' })

}


