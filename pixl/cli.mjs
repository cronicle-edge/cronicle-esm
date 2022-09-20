// Tools for writing command-line apps in Node.
// Copyright (c) 2016 - 2018 Joseph Huckaby
// Released under the MIT License

import { readdirSync, statSync, readFileSync, writeFileSync, appendFileSync } from 'fs';
import { createInterface } from 'readline';
import { basename, join } from 'path';
import chalk from 'chalk';
import stringWidth from 'string-width';
import widestLine from 'widest-line';
import wordWrap from 'word-wrap';
import repeating from 'repeating';

import * as Tools from './tools.mjs';
import {pct as _pct, pluralize, commify, shortFloat, ucfirst, getNiceRemainingTime, getDateArgs, timeNow, copyHash, mergeHashInto } from './tools.mjs';
import Args from './args.mjs';

const args = new Args();

export function tty () {return process.stdout.isTTY }

export function applyStyles(text, styles) {
	// apply one or more chalk styles or functions to text string
	if (!styles) return text;
	styles.forEach( function(style) {
		if (typeof style === 'function') {
			text = style( text );
		} else {
			text = chalk[style]( text );
		}
	} );
	return text;
}

export function repeat(text, amount) {
	// repeat string by specified number of times
	if (!amount || (amount < 0)) return "";
	return repeating(amount, ''+text);
}

export function space(amount) {
	// generate some amount of whitespace
	return repeat(" ", amount);
}



// ------------ PROGRESS --------------

export const progress = {
	// unicode progress bar
	args: {},
	defaults: {
		spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
		braces: ['⟦', '⟧'],
		filling: [' ', '⡀', '⡄', '⡆', '⡇', '⣇', '⣧', '⣷'],
		filled: '⣿',
		indent: "",
		styles: {
			spinner: ['bold', 'green'],
			braces: ['gray'],
			bar: ['bold', 'cyan'],
			pct: ['bold', 'yellow'],
			remain: ['green'],
			text: []
		},
		width: 30,
		freq: 100,
		remain: true,
		color: true,
		unicode: true,
		catchInt: false,
		catchTerm: false,
		catchCrash: false,
		exitOnSig: true
	},
	asciiOverrides: {
		spinner: ['|', '/', '-', "\\"],
		filling: [' ', '.', ':'],
		filled: '#',
		braces: ['[', ']']
	},
	
	start: function(overrides) {
		// start new progress session
		if (!tty()) return;
		
		// copy defaults and apply user overrides
		var args = copyHash( this.defaults );
		mergeHashInto( args, overrides || {} );
		
		if (!args.amount) args.amount = 0;
		if (!args.max) args.max = 1.0;
		if (!args.text) args.text = "";
		if (!args.lastRemainCheck) args.lastRemainCheck = 0;
		if (!args.timeStart) args.timeStart = timeNow();
		
		// no color?  wipe all chalk styles
		if (!args.color) args.styles = {};
		
		// ascii mode?  copy over safe chars
		if (!args.unicode) {
			mergeHashInto( args, this.asciiOverrides );
		}
		
		// make sure indent doesn't contain a hard tab
		if (typeof(args.indent) == 'number') args.indent = space(args.indent);
		args.indent = args.indent.replace(/\t/g, "    ");
		
		this.args = args;
		this.running = true;
		this.spinFrame = 0;
		this.lastLine = "";
		
		this.draw();
		this.timer = setInterval( this.draw.bind(this), args.freq );
		
		// hide CLI cursor
		if (!this.args.quiet) process.stdout.write('\u001b[?25l');
		
		// just in case
		process.once('exit', function() {
			if (progress.running) progress.end();
		} );
		
		if (args.catchInt) {
			process.once('SIGINT', function() {
				if (progress.running) progress.end();
				if (args.exitOnSig) process.exit(128 + 2);
			} );
		}
		if (args.catchTerm) {
			process.once('SIGTERM', function() {
				if (progress.running) progress.end();
				if (args.exitOnSig) process.exit(128 + 15);
			} );
		}
		if (args.catchCrash) {
			process.once('uncaughtException', function() {
				if (progress.running) progress.end();
			} );
		}
	},
	
	draw: function() {
		// draw progress bar, spinner
		if (!tty()) return;
		if (!this.running) return;
		
		var args = this.args;
		var line = args.indent;
		
		// spinner
		line += applyStyles( args.spinner[ this.spinFrame++ % args.spinner.length ], args.styles.spinner );
		line += " ";
		
		// progress bar
		line += applyStyles( args.braces[0], args.styles.braces );
		var bar = "";
		var width = Math.max(0, Math.min(args.amount / args.max, 1.0)) * args.width;
		var partial = width - Math.floor(width);
		
		bar += repeat(args.filled, Math.floor(width));
		if (partial > 0) {
			bar += args.filling[ Math.floor(partial * args.filling.length) ];
		}
		bar += space(args.width - stringWidth(bar));
		
		line += applyStyles( bar, args.styles.bar );
		line += applyStyles( args.braces[1], args.styles.braces );
		line += " ";
		
		// percentage
		var pct = _pct(args.amount, args.max, true);
		line += applyStyles( pct, args.styles.pct );
		
		// remaining
		var now = timeNow();
		var elapsed = now - args.timeStart;
		
		if ((args.amount > 0) && (args.amount < args.max) && (elapsed >= 5) && args.remain) {
			if (now - args.lastRemainCheck >= 1.0) {
				args.lastRemainString = getNiceRemainingTime( elapsed, args.amount, args.max, true, true );
				args.lastRemainCheck = now;
			}
			if (args.lastRemainString) {
				line += applyStyles( " (" + args.lastRemainString + " remain)", args.styles.remain );
			}
		}
		
		// custom text
		if (args.text) {
			line += " ";
			line += applyStyles( args.text.trim(), args.styles.text );
		}
		
		// clean up last line
		if (this.lastLine) {
			var curWidth = stringWidth(line);
			var lastWidth = stringWidth(this.lastLine);
			if (curWidth < lastWidth) {
				line += space(lastWidth - curWidth);
			}
		}
		
		if (!this.args.quiet) process.stdout.write( line + "\r" );
		this.lastLine = line;
	},
	
	update: function(args) {
		if (!tty()) return;
		if (!this.running) return;
		
		if (typeof(args) == 'number') {
			// just updating the amount
			this.args.amount = args;
		}
		else {
			// update any key/value pairs
			for (var key in args) { 
				this.args[key] = args[key]; 
			}
		}
		this.args.amount = Math.max(0, Math.min(this.args.max, this.args.amount));
	},
	
	erase: function() {
		// erase progress
		if (!tty()) return;
		if (this.lastLine && !this.args.quiet) {
			process.stdout.write( space( stringWidth(this.lastLine) ) + "\r" );
		}
	},
	
	end: function(erase) {
		// end of progress session
		if (!tty()) return;
		if (!this.running) return;
		
		if (erase !== false) {
		  this.erase();
		}
		clearTimeout( this.timer );
		this.running = false;
		this.args = {};
		
		// restore CLI cursor
		if (!this.args.quiet) process.stdout.write('\u001b[?25h');
	}
} // progress


// ------------ CLI class ---------------

export default class CLI  {
	
	// CLI args hash
	args = args.get()
	
	// expose some 3rd party utilities
	chalk = chalk
	stringWidth = stringWidth
	widestLine = widestLine
	wordWrap = wordWrap
	Tools = Tools
	
	// for stripping colors:
	ansiPattern = new RegExp([
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|'), 'g')
	
	tty() {
		// return true if stdout is connected to a TTY, 
		// i.e. so we can ask the user things
		return process.stdout.isTTY;
	}
	
	width() {
		// returns current terminal width
		if (!this.tty()) return 0;
		return process.stdout.columns;
	}
	
	prompt(text, def, callback) {
		// prompt user for input, send answer to callback
		var self = this;
		if (!this.tty()) return callback(def);
		var rl = createInterface(process.stdin, process.stdout);
		
		if (!text.match(/\s$/)) text += ' ';
		if (def) text += '[' + def + '] ';
		
		this.currentPrompt = text;
		
		rl.question(text, function(answer) {
			rl.close();
			delete self.currentPrompt;
			callback( answer || def );
		} );
	}
	
	clearPrompt() {
		// erase previous prompt text, if any
		if (this.currentPrompt) {
			process.stdout.write( "\r" + this.space( stringWidth(this.currentPrompt) ) + "\r" );
		}
	}
	
	restorePrompt() {
		// restore previous prompt text, if any
		if (this.currentPrompt) {
			process.stdout.write( this.currentPrompt );
		}
	}
	
	yesno(text, def, callback) {
		// prompt user with a yes/no question
		// callback will be sent a true/false value
		this.prompt( text.trim() + " (y/n) ", def, function(answer) {
			callback( answer && answer.match(/y/i) );
		} );
	}
	
	repeat(text, amount) {
		// repeat string by specified number of times
		if (!amount || (amount < 0)) return "";
		return repeating(amount, ''+text);
	}
	
	space(amount) {
		// generate some amount of whitespace
		return this.repeat(" ", amount);
	}
	
	pad(text, width) {
		// pad a string with spaces on right side to take up specified width
		return text + this.space(width - stringWidth(text));
	}
	
	center(text, width) {
		// center string horizontally
		var self = this;
		text = text.toString().trim();
		if (!width) width = widestLine(text);
		
		// recurse for multi-line text blobs
		if (text.match(/\n/)) {
			return text.split(/\n/).map(function(line) {
				return self.center(line, width);
			}).join("\n");
		} // multi-line
		
		var margin = Math.floor( (width - stringWidth(text)) / 2 );
		var output = this.space(margin) + text;
		var remain = width - stringWidth(output);
		output += this.space(remain);
		return output;
	}
	
	wrap(text, width) {
		// return word-wrapped text block
		return wordWrap( text, {
			width: width,
			indent: "",
			newline: "\n",
			trim: true,
			cut: false
		} );
	}
	
	box(text, args) {
		// ┌───────────────────────────────────────┐
		// │  Wrap a text string in an ASCII box.  │
		// └───────────────────────────────────────┘
		var self = this;
		text = text.toString();
		
		if (!args) args = {};
		var width = args.width || 0;
		var hspace = ("hspace" in args) ? args.hspace : 1;
		var vspace = args.vspace || 0;
		var styles = args.styles || ["gray"];
		var indent = args.indent || "";
		if (typeof(indent) == 'number') indent = space(indent);
		
		var output = [];
		
		// calc width / wrap text
		if (width) text = this.wrap(text, width);
		else width = widestLine(text);
		width += (hspace * 2);
		
		// top border
		output.push( indent + this.applyStyles("┌" + this.repeat("─", width) + "┐", styles) );
		
		// left, content, right
		var lines = text.split(/\n/);
		while (vspace-- > 0) {
			lines.unshift( "" );
			lines.push( "" );
		}
		lines.forEach( function(line) {
			line = self.space(hspace) + line + self.space(hspace);
			output.push(
				indent + 
				self.applyStyles("│", styles) + 
				self.pad(line, width) + 
				self.applyStyles("│", styles) 
			);
		} );
		
		// bottom border
		output.push( indent + this.applyStyles("└" + this.repeat("─", width) + "┘", styles) );
		
		return output.join("\n");
	}
	
	applyStyles(text, styles) {
		// apply one or more chalk styles or functions to text string
		if (!styles) return text;
		styles.forEach( function(style) {
			if (typeof style === 'function') {
				text = style( text );
			} else {
				text = chalk[style]( text );
			}
		} );
		return text;
	}
	
	tree(dir, indent, args) {
		// render dir/file tree view based on array of files/dirs
		var self = this;
		if (!dir) dir = ".";
		if (!indent) indent = "";
		if (!args) args = {};
		var output = [];
		
		args.folderStyles = args.folderStyles || ["bold", "yellow"];
		args.fileStyles = args.fileStyles || ["green"];
		args.symlinkStyles = args.symlinkStyles || ["purple"];
		args.lineStyles = args.lineStyles || ["gray"];
		args.includeFilter = args.includeFilter || /./;
		args.excludeFilter = args.excludeFilter || /(?!)/;
		
		if (!indent) {
			output.push( this.applyStyles( basename(dir) + "/", args.folderStyles ) );
		}
		
		readdirSync(dir).forEach( function(filename, idx, arr) {
			if (!filename.match(args.includeFilter) || filename.match(args.excludeFilter)) return;
			var file = join( dir, filename );
			var stats = statSync(file);
			var last = (idx == arr.length - 1);
			var prefix = indent + self.applyStyles( " " + (last ? "└" : "├"), args.lineStyles ) + " ";
			
			if (stats.isDirectory()) {
				output.push( prefix + self.applyStyles(filename + "/", args.folderStyles) );
				var results = self.tree(file, indent + self.applyStyles( last ? "  " : " │", args.lineStyles ) + " ", args );
				if (results) output.push( results );
			}
			else if (stats.isSymbolicLink()) {
				output.push( prefix + self.applyStyles(filename, args.symlinkStyles) );
			}
			else {
				output.push( prefix + self.applyStyles(filename, args.fileStyles) );
			}
		} );
		
		return output.length ? output.join("\n") : "";
	}
	
	table(rows, args) {
		// render table of cols/rows with unicode borders
		// rows should be an array of arrays (columns), with row 0 being the header
		var self = this;
		
		// optional args
		if (!args) args = {};
		args.headerStyles = args.headerStyles || ["bold", "yellow"];
		args.borderStyles = args.borderStyles || ["gray"];
		args.textStyles = args.textStyles || ["cyan"];
		args.indent = args.indent || "";
		if (typeof(args.indent) == 'number') args.indent = space(args.indent);
		
		// calculate widest columns (+1spc of hpadding)
		var widestCols = [];
		rows.forEach( function(cols, idx) {
			cols.forEach( function(col, idy) {
				widestCols[idy] = Math.max( widestCols[idy] || 0, stringWidth(''+col) + 2 );
			} );
		} );
		
		var numCols = widestCols.length;
		var output = [];
		
		// top border
		var line = "┌";
		widestCols.forEach( function(num, idx) {
			line += self.repeat("─", num);
			if (idx < numCols - 1) line += "┬";
		} );
		line += "┐";
		output.push( args.indent + this.applyStyles(line, args.borderStyles) );
		
		// header row
		var line = this.applyStyles("│", args.borderStyles);
		rows.shift().forEach( function(col, idx) {
			col = self.applyStyles(" " + col + " ", args.headerStyles);
			line += self.pad(col, widestCols[idx]) + self.applyStyles("│", args.borderStyles);
		} );
		output.push(args.indent + line);
		
		// header divider
		var line = "├";
		widestCols.forEach( function(num, idx) {
			line += self.repeat("─", num);
			if (idx < numCols - 1) line += "┼";
		} );
		line += "┤";
		output.push( args.indent + this.applyStyles(line, args.borderStyles) );
		
		// main content
		rows.forEach( function(cols, idx) {
			var line = self.applyStyles("│", args.borderStyles);
			cols.forEach( function(col, idy) {
				col = self.applyStyles(" " + col + " ", args.textStyles);
				line += self.pad(col, widestCols[idy]) + self.applyStyles("│", args.borderStyles);
			} );
			output.push(args.indent + line);
		} );
		
		// bottom border
		var line = "└";
		widestCols.forEach( function(num, idx) {
			line += self.repeat("─", num);
			if (idx < numCols - 1) line += "┴";
		} );
		line += "┘";
		output.push( args.indent + this.applyStyles(line, args.borderStyles) );
		
		return output.join("\n");
	}
	
	loadFile(file) {
		// load file into memory synchronously, return string
		return readFileSync( file, { encoding: 'utf8' } );
	}
	
	saveFile(file, content) {
		// save file to disk synchronously
		writeFileSync( file, content );
	}
	
	appendFile(file, content) {
		// append to file synchronously
		appendFileSync( file, content );
	}
	
	jsonPretty(mixed) {
		// return pretty-printed JSON (which I always forget how to do in Node)
		return JSON.stringify( mixed, null, "\t" );
	}
	
	stripColor(text) {
		// strip ANSI colors from text
		return text.replace( this.ansiPattern, '' );
	}
	
	setLogFile(file) {
		// log all output from our print methods to file
		this.logFile = file;
	}
	
	log(msg) {
		// log something (if log file is configured)
		if (this.logFile) {
			if (typeof(msg) == 'object') msg = JSON.stringify(msg);
			else if (!msg.match(/\S/)) return; // skip whitespace
			var dargs = getDateArgs( timeNow() );
			var line = '[' + dargs.yyyy_mm_dd + ' ' + dargs.hh_mi_ss + '] ' + this.stripColor(msg.trim()).trim() + "\n";
			appendFileSync( this.logFile, line );
		}
	}
	
	print(msg) {
		// print message to console
		if (!this.args.quiet) process.stdout.write(msg);
		this.log(msg);
	}
	
	println(msg) {
		// print plus EOL
		this.print( msg + "\n" );
	}
	
	verbose(msg) {
		// print only in verbose mode
		if (this.args.verbose) this.print(msg);
		else this.log(msg);
	}
	
	verboseln(msg) {
		// verbose print plus EOL
		this.verbose( msg + "\n" );
	}
	
	warn(msg) {
		// print to stderr
		if (!this.args.quiet) process.stderr.write(msg);
		this.log(msg);
	}
	
	warnln(msg) {
		// warn plus EOL
		this.warn( msg + "\n" );
	}
	
	die(msg) {
		// print to stderr and exit with non-zero code
		this.warn(msg);
		process.exit(1);
	}
	
	dieln(msg) {
		// die plus EOL
		this.die( msg + "\n" );
	}
	
	global() {
		// pollute global namespace with our wares
		var self = this;
		
		// copy over some objects
		global.args = this.args;
		global.progress = this.progress;
		global.Tools = Tools;
		
		// bind wrap functions
		["prompt", "yesno", "table", "box", "wrap", "center", "print", "println", "verbose", "verboseln", "warn", "warnln", "die", "dieln", "loadFile", "saveFile", "appendFile"].forEach( function(func) {
			global[func] = self[func].bind(self);
		} );
		
		// copy over some common pixl-tools functions
		["commify", "shortFloat", "pct", "pluralize", "ucfirst"].forEach( function(func) {
			global[func] = self[func]; // these are already bound to Tools
		} );
		
		// expose chalk styles as global keywords
		["reset","bold","dim","italic","underline","inverse","hidden","strikethrough","black","red","green","yellow","blue","magenta","cyan","white","gray","grey","bgBlack","bgRed","bgGreen","bgYellow","bgBlue","bgMagenta","bgCyan","bgWhite"].forEach( function(key) {
			global[key] = chalk[key];
		} );
	}
	
}





// // import some common utilities
// ["getTextFromBytes", "commify", "shortFloat", "pct", "zeroPad", "getTextFromSeconds", "getNiceRemainingTime", "pluralize", "ucfirst"].forEach( function(func) {
// 	module.exports[func] = Tools[func].bind(Tools);
// } );

// // import chalk into our module
// ["reset","bold","dim","italic","underline","inverse","hidden","strikethrough","black","red","green","yellow","blue","magenta","cyan","white","gray","grey","bgBlack","bgRed","bgGreen","bgYellow","bgBlue","bgMagenta","bgCyan","bgWhite"].forEach( function(key) {
// 	module.exports[key] = chalk[key];
// } );
