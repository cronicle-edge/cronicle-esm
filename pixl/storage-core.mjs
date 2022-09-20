// PixlServer Storage System - List Mixin
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

// combo of Indexer/Hash/List/Transaction functions

import { statSync, readdir, unlinkSync, open, unlink, read, close, write, fsync } from "fs";
import { join, dirname } from "path";

import { whilst, eachLimit, series, queue, parallel, eachSeries, forEachOfLimit, waterfall, forEachOfSeries  } from 'async';
import unidecode from 'unidecode';
import nearley from "nearley";
const { Parser, Grammar } = nearley ;
import pxql_grammar from "./pxql.js";
import { stemmer } from 'porter-stemmer';
import he from 'he';
const { decode } = he

import {
	  getDateArgs, normalizeTime, timeNow, numKeys, digestHex, copyHashRemoveProto
	, mergeHashInto, mkdirp, copyHash, fileEachLine, copyHashRemoveKeys
	, findObject, isaHash, lookupPath, sub, hashKeysToArray
    } from "./tools.mjs";

import Perf from "./perf.mjs";
import Component from './component.mjs';

//#region ---- UTILS ----

const NUMBER_INDEX_MIN = -1000000;
const NUMBER_INDEX_MAX = 1000000;

const parseNumber = function(str) {
	// parse number, H# or T# keys
	var args = {};
	if (str.match(/^(N?)(\d+)$/)) {
		var neg = !!RegExp.$1;
		var value = parseInt( RegExp.$2 );
		args.value = value * (neg ? -1 : 1);
		args.tvalue = Math.floor( Math.floor(value / 1000) * 1000 ) * (neg ? -1 : 1);;
		args.hvalue = Math.floor( Math.floor(value / 100) * 100 ) * (neg ? -1 : 1);;
		args.exact = 1;
	}
	else if (str.match(/^H(N?)(\d+)$/)) {
		var neg = !!RegExp.$1;
		var value = parseInt( RegExp.$2 ) * (neg ? -1 : 1);
		args.hvalue = value;
		args.hundreds = 1;
	}
	else if (str.match(/^T(N?)(\d+)$/)) {
		var neg = !!RegExp.$1;
		var value = parseInt( RegExp.$2 ) * (neg ? -1 : 1);
		args.tvalue = value;
		args.thousands = 1;
	}
	else args = null;
	return args;
};

const parseDate = function(str) {
	// parse YYYY_MM_DD, YYYY_MM or YYYY specifically
	var args = {};
	if (str.match(/^(\d{4})_(\d{2})_(\d{2})$/)) {
		args.yyyy = RegExp.$1; args.mm = RegExp.$2; args.dd = RegExp.$3;
		args.yyyy_mm = args.yyyy + '_' + args.mm;
	}
	else if (str.match(/^(\d{4})_(\d{2})$/)) { 
		args.yyyy = RegExp.$1; args.mm = RegExp.$2; 
		args.yyyy_mm = args.yyyy + '_' + args.mm;
	}
	else if (str.match(/^(\d{4})$/)) { 
		args.yyyy = RegExp.$1; 
	}
	else args = null;
	return args;
};

class TransStorageFunctions  {

	__name = 'Storage'
	
	constructor() {
		// class constructor
		this.tempFileCounter = 1;
	}
	
	put = function(key, value, callback) {
		// store key+value pair in transaction
		var self = this;
		key = this.normalizeKey( key );
		
		// get current transaction
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) return callback( new Error("The transaction has completed.  This instance can no longer be used.") );
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		// binary keys not part of transaction system
		if (this.isBinaryKey(key)) return this.rawStorage.put(key, value, callback);
		if (!value) return callback( new Error("Value cannot be false.") );
		if (value.fill) return callback( new Error("Buffers not allowed in transactions.") );
		
		this.logDebug(9, "Storing JSON Object in transaction: " + key, this.debugLevel(10) ? value : null);
		value = JSON.stringify( value );
		
		// flag key as written
		trans.keys[key] = 'W';
		
		// store in memory during transaction
		trans.values[key] = {
			mod: timeNow(true),
			len: Buffer.byteLength(value, 'utf8'),
			data: JSON.parse( value )
		};
		
		setImmediate( function() {
			self.logDebug(9, "Store operation complete (in transaction): " + key);
			callback( null, null );
		} );
	}
	
	head = function(key, callback) {
		// fetch metadata given key: { mod, len }
		var self = this;
		key = this.normalizeKey( key );
		
		// get current transaction
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) return callback( new Error("The transaction has completed.  This instance can no longer be used.") );
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		// binary keys not part of transaction system
		if (this.isBinaryKey(key)) return this.rawStorage.head(key, callback);
		
		// if we haven't written key yet, use raw storage
		if (!(key in trans.keys)) return this.rawStorage.head(key, callback);
		
		if (trans.keys[key] == 'W') {
			// we've written the key, so fetch our version
			this.logDebug(9, "Pinging Object from transaction: " + key);
			
			setImmediate( function() {
				self.logDebug(9, "Head complete: " + key);
				var value = trans.values[key];
				callback( null, {
					mod: value.mod,
					len: value.len
				} );
			} );
		}
		else if (trans.keys[key] == 'D') {
			// simulate a deleted record
			// do this in next tick just to be safe (allow I/O to run)
			var err = new Error("Failed to head key: " + key + ": File not found");
			err.code = "NoSuchKey";
			
			setImmediate( function() {
				callback( err, null );
			} );
		}
	}
	
	get = function(key, callback) {
		// fetch value given key
		var self = this;
		key = this.normalizeKey( key );
		
		// get current transaction
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) return callback( new Error("The transaction has completed.  This instance can no longer be used.") );
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		// binary keys not part of transaction system
		if (this.isBinaryKey(key)) return this.rawStorage.get(key, callback);
		
		// if we haven't written key yet, use raw storage
		if (!(key in trans.keys)) return this.rawStorage.get(key, callback);
		
		if (trans.keys[key] == 'W') {
			// we've written the key, so fetch our version
			this.logDebug(9, "Fetching Object in transaction: " + key);
			
			setImmediate( function() {
				var data = trans.values[key].data;
				self.logDebug(9, "JSON fetch complete: " + key, self.debugLevel(10) ? data : null);
				callback( err, copyHash(data, true) );
			} );
		}
		else if (trans.keys[key] == 'D') {
			// simulate fetching a deleted record
			// do this in next tick just to be safe (allow I/O to run)
			var err = new Error("Failed to fetch key: " + key + ": File not found");
			err.code = "NoSuchKey";
			
			setImmediate( function() {
				callback( err, null );
			} );
		}
	}
	
	delete = function(key, callback) {
		// delete record given key
		var self = this;
		key = this.normalizeKey( key );
		
		// get current transaction
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) return callback( new Error("The transaction has completed.  This instance can no longer be used.") );
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		// binary keys not part of transaction system
		if (this.isBinaryKey(key)) return this.rawStorage.delete(key, callback);
		
		// if we haven't touched the key yet, then we need to simulate this using head()
		if (!(key in trans.keys)) {
			this.rawStorage.head(key, function(err, info) {
				if (err) return callback(err);
				
				// flag key as deleted
				trans.keys[key] = 'D';
				
				self.logDebug(9, "Deleting Object from transaction: " + key);
				
				if (callback) callback();
			});
			return;
		}
		
		this.logDebug(9, "Deleting Object from transaction: " + key);
		
		// flag key as deleted
		trans.keys[key] = 'D';
		delete trans.values[key];
		
		setImmediate( function() {
			self.logDebug(9, "Delete complete: " + key);
			if (callback) callback(null, null);
		} );
	}
	
	enqueue = function(task) {
		// enqueue task for execution AFTER commit
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) throw new Error("The transaction has completed.  This instance can no longer be used.");
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		trans.queue.push( task );
	}
	
	abort = function(callback) {
		// abort current transaction
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) throw new Error("The transaction has completed.  This instance can no longer be used.");
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		this.rawStorage.abortTransaction( this.currentTransactionPath, callback );
	}
	
	commit = function(callback) {
		// commit current transaction
		var trans = this.transactions[ this.currentTransactionPath ];
		if (!trans) throw new Error("The transaction has completed.  This instance can no longer be used.");
		if (trans.aborting) return callback( new Error("The transaction is being aborted.  This instance can no longer be used.") );
		
		this.rawStorage.commitTransaction( this.currentTransactionPath, callback );
	}
	
}
//#endregion

export default class StorageCore extends Component {

    __name = 'StorageCore'	

//#region ---- LIST SPLICE ----
    listSplice = function(key, idx, len, new_items, callback) {
		// Cut any size chunk out of list, optionally replacing it with a new chunk of any size
		var self = this;
		if (!new_items) new_items = [];
		if (!Array.isArray(new_items)) new_items = [new_items];
		var num_new = new_items.length;
		
		idx = parseInt( idx || 0 );
		if (isNaN(idx)) return callback( new Error("Position must be an integer.") );
		
		len = parseInt( len || 0 );
		if (isNaN(len)) return callback( new Error("Length must be an integer.") );
		
		this.logDebug(9, "Splicing " + len + " items at position " + idx + " in list: " + key, this.debugLevel(10) ? new_items : null);
		
		this._listLock( key, true, function() {
			// locked
			self._listLoad(key, false, function(err, list) {
				// check for error
				if (err) {
					self._listUnlock(key);
					return callback(err);
				}
				
				// Manage bounds, allow negative
				if (idx < 0) { idx += list.length; }
				// if (!len) { len = list.length - idx; }
				if (idx + len > list.length) { len = list.length - idx; }
				
				// bounds check
				if ((idx < 0) || (idx > list.length)) {
					self._listUnlock(key);
					return callback( new Error("List index out of bounds.") );
				}
				
				if (!len && !num_new) {
					// nothing to cut, nothing to insert, so we're already done
					self._listUnlock(key);
					return callback(null, []);
				}
				if (!len && (idx == list.length)) {
					// nothing to cut and idx is at the list end, so push instead
					self._listUnlock(key);
					return self.listPush( key, new_items, function(err) { callback(err, []); } );
				}
				if (!len && !idx) {
					// nothing to cut and idx is at the list beginning, so unshift instead
					self._listUnlock(key);
					return self.listUnshift( key, new_items, function(err) { callback(err, []); } );
				}
				
				if (!idx && list.length && (len == list.length) && !num_new) {
					// special case: cutting ALL items from list, and not replacing any
					// need to create a proper empty list, and return the items
					self._listUnlock(key);
					self.listGet( key, idx, len, function(err, items) {
						if (err) return callback(err);
						
						self.listDelete( key, false, function(err) {
							if (err) return callback(err);
							callback(null, items);
						} );
					} );
					return;
				}
				
				var complete = function(err, cut_items) {
					// finally, save list metadata
					if (err) {
						self._listUnlock(key);
						return callback(err, null);
					}
					
					self.put( key, list, function(err, data) {
						self._listUnlock(key);
						if (err) return callback(err, null);
						
						// success, return spliced items
						callback(null, cut_items);
					} );
				};
				
				// jump to specialized method for splice type
				var right_side = !!(idx + (len / 2) >= list.length / 2);
				var cut_func = right_side ? "_listCutRight" : "_listCutLeft";
				var ins_func = right_side ? "_listInsertRight" : "_listInsertLeft";
				
				if (num_new == len) {
					// simple replace
					self._listSpliceSimple( list, key, idx, len, new_items, complete );
				}
				else if (len) {
					// cut first, then maybe insert
					self[cut_func]( list, key, idx, len, function(err, cut_items) {
						if (err) return complete(err);
						
						// done with cut, now insert?
						if (num_new) {
							self[ins_func]( list, key, idx, new_items, function(err) {
								// insert complete
								return complete(err, cut_items);
							} ); // ins_func
						} // num_new
						else {
							// no insert needed, cut only
							complete(err, cut_items);
						}
					} ); // cut_func
				}
				else {
					// insert only
					self[ins_func]( list, key, idx, new_items, function(err) {
						// insert complete
						return complete(err, []);
					} ); // ins_func
				}
				
			} ); // loaded
		} ); // locked
	}

	_listSpliceSimple = function(list, key, idx, len, new_items, callback) {
		// perform simple list splice where replacement is the same length as the cut
		// i.e. list doesn't have to grow or shrink
		var self = this;
		var page_idx = list.first_page;
		var chunk_size = list.page_size;
		var num_fp_items = 0;
		var cut_items = [];
		
		this.logDebug(9, "Performing simple splice", { key: key, idx: idx, cut: len, add: new_items.length, list: list });
		
		whilst(
			function() { return page_idx <= list.last_page; },
			function(callback) {
				self._listLoadPage(key, page_idx, false, function(err, page) {
					if (err) return callback(err);
					
					var page_key = key + '/' + page_idx;
					var page_start_idx = 0;
					
					if (page_idx == list.first_page) {
						num_fp_items = page.items.length;
						if (idx >= num_fp_items) {
							// find page we need to jump to
							page_idx = list.first_page + 1 + Math.floor((idx - num_fp_items) / chunk_size);
							return callback(null);
						}
					} // first page
					else {
						page_start_idx = num_fp_items + ((page_idx - list.first_page - 1) * chunk_size);
					}
					
					var local_idx = idx - page_start_idx;
					
					while (len && (local_idx >= 0) && (local_idx < page.items.length)) {
						cut_items.push( page.items[local_idx] );
						page.items[local_idx++] = new_items.shift();
						idx++;
						len--;
					}
					
					if (!len) page_idx = list.last_page;
					page_idx++;
					
					self.put( page_key, page, callback );
				} );
			},
			function(err) {
				// all pages updated
				if (err) return callback(err, null);
				callback( null, cut_items );
			}
		); // pages loaded
	}

	_listCutRight = function(list, key, idx, len, callback) {
		// perform list cut on the "right" side (from last_page inward)
		var self = this;
		var page_idx = list.first_page;
		var chunk_size = list.page_size;
		var delta = 0 - len; // will be negative
		var num_fp_items = 0;
		var cut_items = [];
		var page_cache = [];
		
		this.logDebug(9, "Performing right-side cut", { key: key, idx: idx, cut: len, list: list });
		
		whilst(
			function() { return page_idx <= list.last_page; },
			function(callback) {
				self._listLoadPage(key, page_idx, true, function(err, page) {
					if (err) return callback(err);
					
					var page_key = key + '/' + page_idx;
					var page_start_idx = 0;
					
					if (page_idx == list.first_page) {
						num_fp_items = page.items.length;
						if (idx >= num_fp_items) {
							// find page we need to jump to
							page_idx = list.first_page + 1 + Math.floor((idx - num_fp_items) / chunk_size);
							return callback(null);
						}
					} // first page
					else {
						page_start_idx = num_fp_items + ((page_idx - list.first_page - 1) * chunk_size);
					}
					
					var local_idx = idx - page_start_idx;
					
					// cut mode
					while (len && (local_idx >= 0) && (local_idx < page.items.length)) {
						cut_items.push( page.items[local_idx] );
						page.items.splice( local_idx, 1 );
						idx++;
						len--;
					}
					
					// fill gaps
					var cidx = 0;
					while (!len && page.items.length && (cidx < page_cache.length)) {
						while (!len && page.items.length && (page_cache[cidx].page.items.length < chunk_size)) {
							page_cache[cidx].page.items.push( page.items.shift() );
						}
						cidx++;
					}
					
					// add current page to write cache
					page_cache.push({
						page_idx: page_idx,
						page_key: page_key,
						page: page
					});
					
					// advance page
					page_idx++;
					
					// eject page from cache if full and ready to write
					if (page_cache.length && (page_cache[0].page.items.length == chunk_size)) {
						var cpage = page_cache.shift();
						self.put( cpage.page_key, cpage.page, callback );
					}
					else callback();
				} );
			},
			function(err) {
				// all pages updated
				if (err) return callback(err, null);
				
				// write all remaining cache entries
				eachLimit(page_cache, self.concurrency, 
					function(cpage, callback) {
						// iterator for each page
						if (cpage.page.items.length || (list.first_page == list.last_page)) {
							self.put( cpage.page_key, cpage.page, callback );
						}
						else {
							// delete page
							list.last_page--;
							self.delete( cpage.page_key, callback );
						}
					}, 
					function(err) {
						// all pages stored
						list.length += delta; // will be negative
						callback( null, cut_items );
					}
				); // eachLimit
			} // all pages complete
		); // pages loaded
	}	

	_listCutLeft = function(list, key, idx, len, callback) {
		// perform list cut on the "left" side (from first_page inward)
		var self = this;
		var page_idx = list.last_page;
		var chunk_size = list.page_size;
		var delta = 0 - len; // will be negative
		var num_fp_items = 0;
		var num_lp_items = 0;
		var cut_items = [];
		var page_cache = [];
		
		this.logDebug(9, "Performing left-side cut", { key: key, idx: idx, cut: len, list: list });
		
		idx += (len - 1);
		var ridx = (list.length - 1) - idx;
		
		whilst(
			function() { return page_idx >= list.first_page; },
			function(callback) {
				self._listLoadPage(key, page_idx, true, function(err, page) {
					if (err) return callback(err);
					
					var page_key = key + '/' + page_idx;
					var page_start_idx = 0;
					
					if (page_idx == list.last_page) {
						num_lp_items = page.items.length;
						if (list.last_page == list.first_page) num_fp_items = num_lp_items;
						else {
							num_fp_items = ((list.length - num_lp_items) % chunk_size) || chunk_size;
						}
						if (ridx >= num_lp_items) {
							// find page we need to jump to
							page_idx = (list.last_page - 1) - Math.floor((ridx - num_lp_items) / chunk_size);
							return callback(null);
						}
					} // last page
					
					if (page_idx != list.first_page) {
						page_start_idx = num_fp_items + ((page_idx - list.first_page - 1) * chunk_size);
					}
					
					var local_idx = idx - page_start_idx;
					
					// cut mode
					while (len && (local_idx >= 0) && (local_idx < page.items.length)) {
						cut_items.unshift( page.items[local_idx] );
						page.items.splice( local_idx--, 1 );
						idx--;
						len--;
					}
					
					// fill gaps
					var cidx = 0;
					while (!len && page.items.length && (cidx < page_cache.length)) {
						while (!len && page.items.length && (page_cache[cidx].page.items.length < chunk_size)) {
							page_cache[cidx].page.items.unshift( page.items.pop() );
						}
						cidx++;
					}
					
					// add current page to write cache
					page_cache.push({
						page_idx: page_idx,
						page_key: page_key,
						page: page
					});

					// advance page
					page_idx--;
					
					// eject page from cache if full and ready to write
					if (page_cache.length && (page_cache[0].page.items.length == chunk_size)) {
						var cpage = page_cache.shift();
						self.put( cpage.page_key, cpage.page, callback );
					}
					else callback();
				} );
			},
			function(err) {
				// all pages updated
				if (err) return callback(err, null);
				
				// write all remaining cache entries
				eachLimit(page_cache, self.concurrency, 
					function(cpage, callback) {
						// iterator for each page
						if (cpage.page.items.length || (list.first_page == list.last_page)) {
							self.put( cpage.page_key, cpage.page, callback );
						}
						else {
							// delete page
							list.first_page++;
							self.delete( cpage.page_key, callback );
						}
					}, 
					function(err) {
						// all pages stored
						list.length += delta; // will be negative
						callback( null, cut_items );
					}
				); // eachLimit
			} // all pages complete
		); // pages loaded
	}	

	_listInsertRight = function(list, key, idx, new_items, callback) {
		// perform list insert on the "right" side (expand towards last_page)
		var self = this;
		var page_idx = list.first_page;
		var chunk_size = list.page_size;
		var delta = new_items.length;
		var num_fp_items = 0;
		var buffer = [];
		
		this.logDebug(9, "Performing right-side insert", { key: key, idx: idx, add: delta, list: list });
		
		whilst(
			function() { return page_idx <= list.last_page; },
			function(callback) {
				self._listLoadPage(key, page_idx, true, function(err, page) {
					if (err) return callback(err);
					
					var page_key = key + '/' + page_idx;
					var page_start_idx = 0;
					
					if (page_idx == list.first_page) {
						num_fp_items = page.items.length;
						if (num_fp_items && (idx >= num_fp_items)) {
							// find page we need to jump to
							page_idx = list.first_page + 1 + Math.floor((idx - num_fp_items) / chunk_size);
							
							// this may be an end-of-list insert, in which case we have to short circuit the page jump
							if (page_idx > list.last_page) page_idx = list.last_page;
							if (page_idx != list.first_page) return callback(null);
						}
					} // first page
					else {
						page_start_idx = num_fp_items + ((page_idx - list.first_page - 1) * chunk_size);
					}
					
					var local_idx = idx - page_start_idx;
					
					if (new_items.length) {
						// insert mode
						var orig_items_len = page.items.length;
						while (new_items.length && (local_idx >= 0) && (local_idx < chunk_size)) {
							if (local_idx < orig_items_len) buffer.push( page.items[local_idx] );
							page.items[local_idx++] = new_items.shift();
							idx++;
						}
					}
					
					// cleanup mode
					if (!new_items.length && buffer.length && (local_idx >= 0) && (local_idx < chunk_size)) {
						
						// page.items.splice( local_idx, 0, buffer );
						buffer.unshift( local_idx, 0 );
						[].splice.apply( page.items, buffer );
						
						if (page.items.length > chunk_size) buffer = page.items.splice(chunk_size);
						else buffer = [];
						idx = page_start_idx + page.items.length;
					}
					
					if (page_idx == list.first_page) num_fp_items = page.items.length;
					
					page_idx++;
					if ((page_idx > list.last_page) && (new_items.length || buffer.length)) {
						// extend list by a page
						list.last_page = page_idx;
					}
					
					self.put( page_key, page, callback );
				} );
			},
			function(err) {
				// all pages updated
				if (err) return callback(err, null);
				list.length += delta;
				callback( null );
			}
		); // pages loaded
	}

	_listInsertLeft = function(list, key, idx, new_items, callback) {
		// perform list insert on the "left" side (expand towards first_page)
		var self = this;
		var page_idx = list.last_page;
		var chunk_size = list.page_size;
		var delta = new_items.length;
		var num_fp_items = 0;
		var num_lp_items = 0;
		var num_new_pages = 0;
		var buffer = [];
		
		this.logDebug(9, "Performing left-side insert", { key: key, idx: idx, add: delta, list: list });
		
		idx--;
		var ridx = (list.length - 1) - idx;
		
		whilst(
			function() { 
				return( (page_idx >= list.first_page) || new_items.length || buffer.length ); 
			},
			function(callback) {
				self._listLoadPage(key, page_idx, true, function(err, page) {
					if (err) return callback(err);
					
					var page_key = key + '/' + page_idx;
					var page_start_idx = 0;
					
					if (page_idx == list.last_page) {
						num_lp_items = page.items.length;
						if (list.last_page == list.first_page) num_fp_items = num_lp_items;
						else {
							num_fp_items = ((list.length - num_lp_items) % chunk_size) || chunk_size;
						}
						if (num_lp_items && (ridx >= num_lp_items)) {
							// find page we need to jump to
							page_idx = (list.last_page - 1) - Math.floor((ridx - num_lp_items) / chunk_size);
							
							// this may be an start-of-list insert, in which case we have to short circuit the page jump
							if (page_idx < list.first_page) page_idx = list.first_page;
							if (page_idx != list.last_page) return callback(null);
						}
					} // last page
					
					if (page_idx != list.first_page) {
						page_start_idx = num_fp_items + ((page_idx - list.first_page - 1) * chunk_size);
					}
					
					var local_idx = idx - page_start_idx;
					if (local_idx >= page.items.length) local_idx = page.items.length - 1;
					
					if (new_items.length) {
						// insert mode
						while (new_items.length) {
							if (local_idx >= 0) {
								buffer.unshift( page.items[local_idx] );
								page.items[local_idx--] = new_items.pop();
							}
							else if (page.items.length < chunk_size) {
								page.items.unshift( new_items.pop() );
							}
							else break;
							idx--;
						}
					}
					
					// cleanup mode
					if (!new_items.length && buffer.length && (local_idx >= -1) && (local_idx < chunk_size)) {
						
						// page.items.splice( local_idx + 1, 0, buffer );
						buffer.unshift( local_idx + 1, 0 );
						[].splice.apply( page.items, buffer );
						
						if (page.items.length > chunk_size) buffer = page.items.splice( 0, page.items.length - chunk_size );
						else buffer = [];
						// idx = page_start_idx - 1;
					}
					idx = page_start_idx - 1;
					
					if (page_idx == list.first_page) num_fp_items = page.items.length;
					if (page_idx == list.last_page) num_lp_items = page.items.length;
					
					page_idx--;
					if ((page_idx < list.first_page) && (new_items.length || buffer.length)) {
						// extend list by a page
						num_new_pages++;
					}
					
					self.put( page_key, page, callback );
				} );
			},
			function(err) {
				// all pages updated
				if (err) return callback(err, null);
				list.first_page -= num_new_pages;
				list.length += delta;
				callback( null );
			}
		); // pages loaded
	}
//#endregion

//#region ---- LIST MAIN ----

	listCreate = function(key, opts, callback) {
		// Create new list
		var self = this;
		
		if (!opts) opts = {};
		if (!opts.page_size) opts.page_size = this.listItemsPerPage;
		opts.first_page = 0;
		opts.last_page = 0;
		opts.length = 0;
		opts.type = 'list';
		
		this.logDebug(9, "Creating new list: " + key, opts);
		
		this.get(key, function(err, list) {
			if (list) {
				// list already exists
				return callback(null, list);
			}
			self.put( key, opts, function(err) {
				if (err) return callback(err);
				
				// create first page
				self.put( key + '/0', { type: 'list_page', items: [] }, function(err) {
					if (err) return callback(err);
					else callback(null, opts);
				} );
			} ); // header created
		} ); // get check
	}
	
	_listLoad = function(key, create_opts, callback) {
		// Internal method, load list root, create if doesn't exist
		var self = this;
		if (create_opts && (typeof(create_opts) != 'object')) create_opts = {};
		this.logDebug(9, "Loading list: " + key);
		
		this.get(key, function(err, data) {
			if (data) {
				// list already exists
				callback(null, data);
			}
			else if (create_opts && err && (err.code == "NoSuchKey")) {
				// create new list, ONLY if record was not found (and not some other error)
				self.logDebug(9, "List not found, creating it: " + key, create_opts);
				self.listCreate(key, create_opts, function(err, data) {
					if (err) callback(err, null);
					else callback( null, data );
				} );
			}
			else {
				// no exist and no create, or some other error
				self.logDebug(9, "List could not be loaded: " + key + ": " + err);
				callback(err, null);
			}
		} ); // get
	}
	
	_listLoadPage = function(key, idx, create, callback) {
		// Internal method, load page from list, create if doesn't exist
		var self = this;
		var page_key = key + '/' + idx;
		this.logDebug(9, "Loading list page: " + page_key);
		
		this.get(page_key, function(err, data) {
			if (data) {
				// list page already exists
				callback(null, data);
			}
			else if (create && err && (err.code == "NoSuchKey")) {
				// create new list page, ONLY if record was not found (and not some other error)
				self.logDebug(9, "List page not found, creating it: " + page_key);
				callback( null, { type: 'list_page', items: [] } );
			}
			else {
				// no exist and no create
				self.logDebug(9, "List page could not be loaded: " + page_key + ": " + err);
				callback(err, null);
			}
		} ); // get
	}
	
	_listLock = function(key, wait, callback) {
		// internal list lock wrapper
		// uses unique key prefix so won't deadlock with user locks
		this.lock( '|'+key, wait, callback );
	}
	
	_listUnlock = function(key) {
		// internal list unlock wrapper
		this.unlock( '|'+key );
	}
	
	_listShareLock = function(key, wait, callback) {
		// internal list shared lock wrapper
		// uses unique key prefix so won't deadlock with user locks
		this.shareLock( '|'+key, wait, callback );
	}
	
	_listShareUnlock = function(key) {
		// internal list shared unlock wrapper
		this.shareUnlock( '|'+key );
	}
	
	listPush = function(key, items, create_opts, callback) {
		// Push new items onto end of list
		var self = this;
		if (!callback && (typeof(create_opts) == 'function')) {
			callback = create_opts;
			create_opts = {};
		}
		var list = null;
		var page = null;
		if (!Array.isArray(items)) items = [items];
		this.logDebug(9, "Pushing " + items.length + " items onto end of list: " + key, this.debugLevel(10) ? items : null);
		
		this._listLock(key, true, function() {
			series([
				function(callback) {
					// first load list header
					self._listLoad(key, create_opts, function(err, data) {
						list = data; 
						callback(err, data);
					} );
				},
				function(callback) {
					// now load last page in list
					self._listLoadPage(key, list.last_page, 'create', function(err, data) {
						page = data;
						callback(err, data);
					} );
				}
			],
			function(err, results) {
				// list and page loaded, proceed with push
				if (err) {
					self._listUnlock(key);
					return callback(err, null);
				}
				
				// populate tasks array with records to save
				var tasks = [];
				
				// split items into pages
				var item = null;
				var count = 0;
				while (item = items.shift()) {
					// make sure item is an object
					if (typeof(item) != 'object') continue;
					
					// if last page is full, we need to create a new one
					if (page.items.length >= list.page_size) {
						// complete current page, queue for save
						if (count) tasks.push({ key: key + '/' + list.last_page, data: page });
						
						// add new page
						list.last_page++;
						page = { type: 'list_page', items: [] };
					}
					
					// push item onto list
					page.items.push( item );
					list.length++;
					count++;
				} // foreach item
				
				if (!count) {
					self._listUnlock(key);
					return callback(new Error("No valid objects found to add."), null);
				}
				
				// add current page, and main list record
				tasks.push({ key: key + '/' + list.last_page, data: page });
				tasks.push({ key: key, data: list });
				
				// save all pages and main list
				var lastErr = null;
				var q = queue(function (task, callback) {
					self.put( task.key, task.data, callback );
				}, self.concurrency );
				
				q.drain = function() {
					// all pages saved, complete
					self._listUnlock(key);
					callback(lastErr, list);
				};
				
				q.push( tasks, function(err) {
					lastErr = err;
				} );
				
			} ); // loaded
		} ); // locked
	}
	
	listUnshift = function(key, items, create_opts, callback) {
		// Unshift new items onto beginning of list
		var self = this;
		if (!callback && (typeof(create_opts) == 'function')) {
			callback = create_opts;
			create_opts = {};
		}
		var list = null;
		var page = null;
		if (!Array.isArray(items)) items = [items];
		this.logDebug(9, "Unshifting " + items.length + " items onto beginning of list: " + key, this.debugLevel(10) ? items : null);
		
		this._listLock( key, true, function() {
			series([
				function(callback) {
					// first load list header
					self._listLoad(key, create_opts, function(err, data) {
						list = data; 
						callback(err, data);
					} );
				},
				function(callback) {
					// now load first page in list
					self._listLoadPage(key, list.first_page, 'create', function(err, data) {
						page = data;
						callback(err, data);
					} );
				}
			],
			function(err, results) {
				// list and page loaded, proceed with unshift
				if (err) {
					self._listUnlock(key);
					return callback(err, null);
				}
				
				// populate tasks array with records to save
				var tasks = [];
				
				// split items into pages
				var item = null;
				var count = 0;
				while (item = items.pop()) {
					// make sure item is an object
					if (typeof(item) != 'object') continue;
					
					// if last page is full, we need to create a new one
					if (page.items.length >= list.page_size) {
						// complete current page, queue for save
						if (count) tasks.push({ key: key + '/' + list.first_page, data: page });
						
						// add new page
						list.first_page--;
						page = { type: 'list_page', items: [] };
					}
					
					// push item onto list
					page.items.unshift( item );
					list.length++;
					count++;
				} // foreach item
				
				if (!count) {
					self._listUnlock(key);
					return callback(new Error("No valid objects found to add."), null);
				}
				
				// add current page, and main list record
				tasks.push({ key: key + '/' + list.first_page, data: page });
				tasks.push({ key: key, data: list });
				
				// save all pages and main list
				var lastErr = null;
				var q = queue(function (task, callback) {
					self.put( task.key, task.data, callback );
				}, self.concurrency );
				
				q.drain = function() {
					// all pages saved, complete
					self._listUnlock(key);
					callback(lastErr, list);
				};
				
				q.push( tasks, function(err) {
					lastErr = err;
				} );
				
			} ); // loaded
		} ); // locked
	}
	
	listPop = function(key, callback) {
		// Pop last item off end of list, shrink as necessary, return item
		var self = this;
		var list = null;
		var page = null;
		this.logDebug(9, "Popping item off end of list: " + key);
		
		this._listLock( key, true, function() {
			series([
				function(callback) {
					// first load list header
					self._listLoad(key, false, function(err, data) {
						list = data; 
						callback(err, data);
					} );
				},
				function(callback) {
					// now load last page in list
					self._listLoadPage(key, list.last_page, false, function(err, data) {
						page = data;
						callback(err, data);
					} );
				}
			],
			function(err, results) {
				// list and page loaded, proceed with pop
				if (err) {
					self._listUnlock(key);
					return callback(err, null);
				}
				if (!page.items.length) {
					self._listUnlock(key);
					return callback( null, null );
				}
				
				var actions = [];
				var item = page.items.pop();
				var old_last_page = list.last_page;
				
				if (!page.items.length) {
					// out of items in this page, delete page, adjust list
					if (list.last_page > list.first_page) {
						list.last_page--;
						
						actions.push( 
							function(callback) { self.delete( key + '/' + old_last_page, callback ); } 
						);
					}
					else {
						// list is empty, create new first page
						actions.push( 
							function(callback) { self.put( key + '/' + old_last_page, { type: 'list_page', items: [] }, callback ); } 
						);
					}
				}
				else {
					// still have items left, save page
					actions.push( 
						function(callback) { self.put( key + '/' + list.last_page, page, callback ); } 
					);
				}
				
				// shrink list
				list.length--;
				actions.push( 
					function(callback) { self.put( key, list, callback ); } 
				);
				
				// save everything in parallel
				parallel( actions, function(err, results) {
					// success, fire user callback
					self._listUnlock(key);
					callback(err, err ? null : item);
				} ); // save complete
				
			} ); // loaded
		} ); // locked
	}
	
	listShift = function(key, callback) {
		// Shift first item off beginning of list, shrink as necessary, return item
		var self = this;
		var list = null;
		var page = null;
		this.logDebug(9, "Shifting item off beginning of list: " + key);
		
		this._listLock( key, true, function() {
			series([
				function(callback) {
					// first load list header
					self._listLoad(key, false, function(err, data) {
						list = data; 
						callback(err, data);
					} );
				},
				function(callback) {
					// now load first page in list
					self._listLoadPage(key, list.first_page, false, function(err, data) {
						page = data;
						callback(err, data);
					} );
				}
			],
			function(err, results) {
				// list and page loaded, proceed with shift
				if (err) {
					self._listUnlock(key);
					return callback(err, null);
				}
				if (!page.items.length) {
					self._listUnlock(key);
					return callback( null, null );
				}
				
				var actions = [];
				var item = page.items.shift();
				var old_first_page = list.first_page;
				
				if (!page.items.length) {
					// out of items in this page, delete page, adjust list
					if (list.first_page < list.last_page) {
						list.first_page++;
						
						actions.push( 
							function(callback) { self.delete( key + '/' + old_first_page, callback ); } 
						);
					}
					else {
						// list is empty, create new first page
						actions.push( 
							function(callback) { self.put( key + '/' + old_first_page, { type: 'list_page', items: [] }, callback ); } 
						);
					}
				}
				else {
					// still have items left, save page
					actions.push( 
						function(callback) { self.put( key + '/' + list.first_page, page, callback ); } 
					);
				}
				
				// shrink list
				list.length--;
				actions.push( 
					function(callback) { self.put( key, list, callback ); } 
				);
				
				// save everything in parallel
				parallel( actions, function(err, results) {
					// success, fire user callback
					self._listUnlock(key);
					callback(err, err ? null : item);
				} ); // save complete
				
			} ); // loaded
		} ); // locked
	}
	
	listGet = function(key, idx, len, callback) {
		// Fetch chunk from list of any size, in any location
		// Use negative idx to fetch from end of list
		var self = this;
		var list = null;
		var page = null;
		var items = [];
		if (!this.started) return callback( new Error("Storage has not completed startup.") );
		
		idx = parseInt( idx || 0 );
		if (isNaN(idx)) return callback( new Error("Position must be an integer.") );
		
		len = parseInt( len || 0 );
		if (isNaN(len)) return callback( new Error("Length must be an integer.") );
		
		this.logDebug(9, "Fetching " + len + " items at position " + idx + " from list: " + key);
		
		series([
			function(callback) {
				// first we share lock
				self._listShareLock(key, true, callback);
			},
			function(callback) {
				// next load list header
				self._listLoad(key, false, function(err, data) {
					list = data; 
					callback(err, data);
				} );
			},
			function(callback) {
				// now load first page in list
				self._listLoadPage(key, list.first_page, false, function(err, data) {
					page = data;
					callback(err, data);
				} );
			}
		],
		function(err, results) {
			// list and page loaded, proceed with get
			if (err) {
				self._listShareUnlock(key);
				return callback(err, null, list);
			}
			
			// apply defaults if applicable
			if (!idx) idx = 0;
			if (!len) len = list.length;
			
			// range check
			if (list.length && (idx >= list.length)) {
				self._listShareUnlock(key);
				return callback( new Error("Index out of range"), null, list );
			}
			
			// Allow user to get items from end of list
			if (idx < 0) { idx += list.length; }
			if (idx < 0) { idx = 0; }
			
			if (idx + len > list.length) { len = list.length - idx; }
			
			// First page is special, as it is variably sized
			// and shifts the paging algorithm
			while (idx < page.items.length) {
				items.push( page.items[idx++] );
				len--;
				if (!len) break;
			}
			if (!len || (idx >= list.length)) {
				// all items were on first page, return now
				self._listShareUnlock(key);
				return callback( null, items, list );
			}
			
			// we need items from other pages
			var num_fp_items = page.items.length;
			var chunk_size = list.page_size;
			
			var first_page_needed = list.first_page + 1 + Math.floor((idx - num_fp_items) / chunk_size);
			var last_page_needed = list.first_page + 1 + Math.floor(((idx - num_fp_items) + len - 1) / chunk_size);
			var page_idx = first_page_needed;
			
			whilst(
				function() { return page_idx <= last_page_needed; },
				function(callback) {
					self._listLoadPage(key, page_idx, false, function(err, data) {
						if (err) return callback(err);
						var page = data;
						
						var page_start_idx = num_fp_items + ((page_idx - list.first_page - 1) * chunk_size);
						var local_idx = idx - page_start_idx;
						
						while ((local_idx >= 0) && (local_idx < page.items.length)) {
							items.push( page.items[local_idx++] );
							idx++;
							len--;
							if (!len) break;
						}
						
						if (!len) page_idx = last_page_needed;
						page_idx++;
						callback();
					} );
				},
				function(err) {
					// all pages loaded
					self._listShareUnlock(key);
					if (err) return callback(err, null);
					callback( null, items, list );
				}
			); // pages loaded
		} ); // list loaded
	}
	
	listFind = function(key, criteria, callback) {
		// Find single item in list given criteria -- WARNING: this can be slow with long lists
		var self = this;
		var num_crit = numKeys(criteria);
		this.logDebug(9, "Locating item in list: " + key, criteria);
		
		this._listShareLock(key, true, function() {
			// share locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listShareUnlock(key);
					return callback(err, null);
				}
				
				var item = null;
				var item_idx = 0;
				var page_idx = list.first_page;
				if (!list.length) {
					self._listShareUnlock(key);
					return callback(null, null);
				}
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						self._listLoadPage(key, page_idx, false, function(err, page) {
							if (err) return callback(err, null);
							// now scan page's items
							for (var idx = 0, len = page.items.length; idx < len; idx++) {
								var matches = 0;
								for (var k in criteria) {
									if (criteria[k].test) {
										if (criteria[k].test(page.items[idx][k])) { matches++; }
									}
									else if (criteria[k] == page.items[idx][k]) { matches++; }
								}
								if (matches == num_crit) {
									// we found our item!
									item = page.items[idx];
									idx = len;
									page_idx = list.last_page;
								}
								else item_idx++;
							} // foreach item
							
							page_idx++;
							callback();
						} ); // page loaded
					},
					function(err) {
						// all pages loaded
						self._listShareUnlock(key);
						if (err) return callback(err, null);
						if (!item) item_idx = -1;
						callback( null, item, item_idx );
					}
				); // whilst
			} ); // loaded
		} ); // _listShareLock
	}
	
	listFindCut = function(key, criteria, callback) {
		// Find single object by criteria, and if found, delete it -- WARNING: this can be slow with long lists
		var self = this;
		
		// This is a two-part macro function, which performs a find followed by a splice,
		// so we need an outer lock that lasts the entire duration of both ops, but we can't collide
		// with the natural lock that splice invokes, so we must add an additional '|' lock prefix.
		
		this._listLock( '|'+key, true, function() {	
			self.listFind(key, criteria, function(err, item, idx) {
				if (err) {
					self._listUnlock( '|'+key );
					return callback(err, null);
				}
				if (!item) {
					self._listUnlock( '|'+key );
					return callback(new Error("Item not found"), null);
				}
				
				self.listSplice(key, idx, 1, null, function(err, items) {
					self._listUnlock( '|'+key );
					callback(err, items ? items[0] : null);
				}); // splice
			} ); // find
		} ); // locked
	}
	
	listFindDelete = function(key, criteria, callback) {
		// alias for listFindCut
		return this.listFindCut(key, criteria, callback);
	}
	
	listFindReplace = function(key, criteria, new_item, callback) {
		// Find single object by criteria, and if found, replace it -- WARNING: this can be slow with long lists
		var self = this;
		
		// This is a two-part macro function, which performs a find followed by a splice,
		// so we need an outer lock that lasts the entire duration of both ops, but we can't collide
		// with the natural lock that splice invokes, so we must add an additional '|' lock prefix.
		
		this._listLock( '|'+key, true, function() {	
			self.listFind(key, criteria, function(err, item, idx) {
				if (err) {
					self._listUnlock( '|'+key );
					return callback(err, null);
				}
				if (!item) {
					self._listUnlock( '|'+key );
					return callback(new Error("Item not found"), null);
				}
				
				self.listSplice(key, idx, 1, [new_item], function(err, items) {
					self._listUnlock( '|'+key );
					callback(err);
				}); // splice
			} ); // find
		} ); // locked
	}
	
	listFindUpdate = function(key, criteria, updates, callback) {
		// Find single object by criteria, and if found, update it -- WARNING: this can be slow with long lists
		// Updates are merged into original item, with numerical increments starting with "+" or "-"
		var self = this;
		
		// This is a two-part macro function, which performs a find followed by a splice,
		// so we need an outer lock that lasts the entire duration of both ops, but we can't collide
		// with the natural lock that splice invokes, so we must add an additional '|' lock prefix.
		
		this._listLock( '|'+key, true, function() {	
			self.listFind(key, criteria, function(err, item, idx) {
				if (err) {
					self._listUnlock( '|'+key );
					return callback(err, null);
				}
				if (!item) {
					self._listUnlock( '|'+key );
					return callback(new Error("Item not found"), null);
				}
				
				// apply updates
				for (var ukey in updates) {
					var uvalue = updates[ukey];
					if ((typeof(uvalue) == 'string') && (typeof(item[ukey]) == 'number') && uvalue.match(/^(\+|\-)([\d\.]+)$/)) {
						var op = RegExp.$1;
						var amt = parseFloat(RegExp.$2);
						if (op == '+') item[ukey] += amt;
						else item[ukey] -= amt;
					}
					else item[ukey] = uvalue;
				}
				
				self.listSplice(key, idx, 1, [item], function(err, items) {
					self._listUnlock( '|'+key );
					callback(err, item);
				}); // splice
			} ); // find
		} ); // locked
	}
	
	listFindEach = function(key, criteria, iterator, callback) {
		// fire iterator for every matching element in list, only load one page at a time
		var self = this;
		var num_crit = numKeys(criteria);
		this.logDebug(9, "Locating items in list: " + key, criteria);
		
		this._listShareLock(key, true, function() {
			// share locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listShareUnlock(key);
					callback(err);
					return;
				}
				var page_idx = list.first_page;
				var item_idx = 0;
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						// load each page
						self._listLoadPage(key, page_idx++, false, function(err, page) {
							if (err) return callback(err);
							
							// iterate over page items
							if (page && page.items && page.items.length) {
								eachSeries( page.items, function(item, callback) {
									// for each item, check against criteria
									var matches = 0;
									for (var k in criteria) {
										if (criteria[k].test) {
											if (criteria[k].test(item[k])) { matches++; }
										}
										else if (criteria[k] == item[k]) { matches++; }
									}
									if (matches == num_crit) {
										iterator(item, item_idx++, callback);
									}
									else {
										item_idx++;
										callback();
									}
								}, callback );
							}
							else callback();
						} ); // page loaded
					},
					function(err) {
						// all pages iterated
						self._listShareUnlock(key);
						if (err) return callback(err);
						else callback(null);
					} // pages complete
				); // whilst
			} ); // loaded
		} ); // _listShareLock
	}
	
	listDelete = function(key, entire, callback) {
		// Delete entire list and all pages
		var self = this;
		this.logDebug(9, "Deleting list: " + key);
		
		this._listLock( key, true, function() {
			// locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listUnlock(key);
					return callback(err, null);
				}
				
				var page_idx = list.first_page;
				if (!entire) page_idx++; // skip first page, will be rewritten
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						// delete each page
						self.delete( key + '/' + page_idx, function(err, data) {
							page_idx++;
							return callback(err);
						} ); // delete
					},
					function(err) {
						// all pages deleted
						if (err) {
							self._listUnlock(key);
							return callback(err, null);
						}
						
						// delete list itself, or just clear it?
						if (entire) {
							// delete entire list
							self.delete(key, function(err, data) {
								// final delete complete
								self._listUnlock(key);
								callback(err);
							} ); // deleted
						} // entire
						else {
							// zero list for reuse
							list.length = 0;
							list.first_page = 0;
							list.last_page = 0;
							
							self.put( key, list, function(err, data) {
								// finished saving list header
								if (err) {
									self._listUnlock(key);
									return callback(err);
								}
								
								// now save a blank first page
								self.put( key + '/0', { type: 'list_page', items: [] }, function(err, data) {
									// save complete
									self._listUnlock(key);
									callback(err);
								} ); // saved
							} ); // saved header
						} // reuse
					} // pages deleted
				); // whilst
			} ); // loaded
		} ); // locked
	}
	
	listGetInfo = function(key, callback) {
		// Return info about list (number of items, etc.)
		this._listLoad( key, false, callback );
	}
	
	listCopy = function(old_key, new_key, callback) {
		// Copy list to new path (and all pages)
		var self = this;
		this.logDebug(9, "Copying list: " + old_key + " to " + new_key);
		
		this._listLoad(old_key, false, function(err, list) {
			// list loaded, proceed
			if (err) {
				callback(err);
				return;
			}
			var page_idx = list.first_page;
			
			whilst(
				function() { return page_idx <= list.last_page; },
				function(callback) {
					// load each page
					self._listLoadPage(old_key, page_idx, false, function(err, page) {
						if (err) return callback(err);
						
						// and copy it
						self.copy( old_key + '/' + page_idx, new_key + '/' + page_idx, function(err, data) {
							page_idx++;
							return callback(err);
						} ); // copy
					} ); // page loaded
				},
				function(err) {
					// all pages copied
					if (err) return callback(err);
					
					// now copy list header
					self.copy(old_key, new_key, function(err, data) {
						// final copy complete
						callback(err);
					} ); // deleted
				} // pages copied
			); // whilst
		} ); // loaded
	}
	
	listRename = function(old_key, new_key, callback) {
		// Copy, then delete list (and all pages)
		var self = this;
		this.logDebug(9, "Renaming list: " + old_key + " to " + new_key);
		
		this.listCopy( old_key, new_key, function(err) {
			// copy complete, now delete old list
			if (err) return callback(err);
			
			self.listDelete( old_key, true, callback );
		} ); // copied
	}
	
	listEach = function(key, iterator, callback) {
		// fire iterator for every element in list, only load one page at a time
		var self = this;
		
		this._listShareLock(key, true, function() {
			// share locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listShareUnlock(key);
					callback(err);
					return;
				}
				var page_idx = list.first_page;
				var item_idx = 0;
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						// load each page
						self._listLoadPage(key, page_idx++, false, function(err, page) {
							if (err) return callback(err);
							
							// iterate over page items
							if (page && page.items && page.items.length) {
								eachSeries( page.items, function(item, callback) {
									iterator(item, item_idx++, callback);
								}, callback );
							}
							else callback();
						} ); // page loaded
					},
					function(err) {
						// all pages iterated
						self._listShareUnlock(key);
						if (err) return callback(err);
						else callback(null);
					} // pages complete
				); // whilst
			} ); // loaded
		} ); // _listShareLock
	}
	
	listEachPage = function(key, iterator, callback) {
		// fire iterator for every page in list
		var self = this;
		
		this._listShareLock(key, true, function() {
			// share locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listShareUnlock(key);
					callback(err);
					return;
				}
				var page_idx = list.first_page;
				var item_idx = 0;
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						// load each page
						self._listLoadPage(key, page_idx++, false, function(err, page) {
							if (err) return callback(err);
							
							// call iterator for page items
							if (page && page.items && page.items.length) {
								iterator(page.items, callback);
							}
							else callback();
						} ); // page loaded
					},
					function(err) {
						// all pages iterated
						self._listShareUnlock(key);
						callback( err || null );
					} // pages complete
				); // whilst
			} ); // loaded
		} ); // _listShareLock
	}
	
	listEachUpdate = function(key, iterator, callback) {
		// fire iterator for every element in list, only load one page at a time
		// iterator can signal that a change was made to any items, triggering an update
		var self = this;
		
		this._listLock(key, true, function() {
			// exclusively locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listUnlock(key);
					callback(err);
					return;
				}
				var page_idx = list.first_page;
				var item_idx = 0;
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						// load each page
						var page_key = key + '/' + page_idx;
						
						self._listLoadPage(key, page_idx++, false, function(err, page) {
							if (err) return callback(err);
							
							// iterate over page items
							if (page && page.items && page.items.length) {
								var num_updated = 0;
								
								eachSeries( page.items, 
									function(item, callback) {
										iterator(item, item_idx++, function(err, updated) {
											if (updated) num_updated++;
											callback(err);
										});
									}, 
									function(err) {
										if (err) return callback(err);
										if (num_updated) self.put( page_key, page, callback );
										else callback();
									}
								); // async.eachSeries
							}
							else callback();
						} ); // page loaded
					},
					function(err) {
						// all pages iterated
						self._listUnlock(key);
						callback( err || null );
					} // pages complete
				); // whilst
			} ); // loaded
		} ); // _listLock
	}
	
	listEachPageUpdate = function(key, iterator, callback) {
		// fire iterator for every page in list
		// iterator can signal that a change was made to any page, triggering an update
		var self = this;
		
		this._listLock(key, true, function() {
			// exclusively locked
			self._listLoad(key, false, function(err, list) {
				// list loaded, proceed
				if (err) {
					self._listUnlock(key);
					callback(err);
					return;
				}
				var page_idx = list.first_page;
				var item_idx = 0;
				
				whilst(
					function() { return page_idx <= list.last_page; },
					function(callback) {
						// load each page
						var page_key = key + '/' + page_idx;
						
						self._listLoadPage(key, page_idx++, false, function(err, page) {
							if (err) return callback(err);
							
							// call iterator for page items
							if (page && page.items && page.items.length) {
								iterator(page.items, function(err, updated) {
									if (!err && updated) self.put( page_key, page, callback );
									else callback(err);
								});
							}
							else callback();
						} ); // page loaded
					},
					function(err) {
						// all pages iterated
						self._listUnlock(key);
						callback( err || null );
					} // pages complete
				); // whilst
			} ); // loaded
		} ); // _listLock
	}
	
	listInsertSorted = function(key, insert_item, comparator, callback) {
		// insert item into list while keeping it sorted
		var self = this;
		var loc = false;
		
		if (Array.isArray(comparator)) {
			// convert to closure
			var sort_key = comparator[0];
			var sort_dir = comparator[1] || 1;
			comparator = function(a, b) {
				return( ((a[sort_key] < b[sort_key]) ? -1 : 1) * sort_dir );
			};
		}
		
		// This is a two-part macro function, which performs a find followed by a splice,
		// so we need an outer lock that lasts the entire duration of both ops, but we can't collide
		// with the natural lock that splice invokes, so we must add an additional '|' lock prefix.
		
		this._listLock( '|'+key, true, function() {	
			// list is locked
			self.listEach( key, 
				function(item, idx, callback) {
					// listEach iterator
					var result = comparator(insert_item, item);
					if (result < 0) {
						// our item should come before compared item, so splice here!
						loc = idx;
						callback("break");
					}
					else callback();
				}, // listEach iterator
				function(err) {
					// listEach complete
					// Ignoring error here, as we'll just create a new list
					
					if (loc !== false) {
						// found location, so perform non-removal splice
						self.listSplice( key, loc, 0, [insert_item], function(err) {
							self._listUnlock( '|'+key );
							callback(err);
						} );
					}
					else {
						// no suitable location found, so add to end of list
						self.listPush( key, insert_item, function(err) {
							self._listUnlock( '|'+key );
							callback(err);
						} );
					}
				} // listEach complete
			); // listEach
		} ); // list locked
	}
//#endregion

//#region ---- HASH ---
	
	hashCreate = function(path, opts, callback) {
		// Create new hash table
		var self = this;
		
		if (!opts) opts = {};
		if (!opts.page_size) opts.page_size = this.hashItemsPerPage;
		opts.length = 0;
		opts.type = 'hash';
		
		this.logDebug(9, "Creating new hash: " + path, opts);
		
		this.get(path, function(err, hash) {
			if (hash) {
				// hash already exists
				self.logDebug(9, "Hash already exists: " + path, hash);
				return callback(null, hash);
			}
			self.put( path, opts, function(err) {
				if (err) return callback(err);
				
				// create first page
				self.put( path + '/data', { type: 'hash_page', length: 0, items: {} }, function(err) {
					if (err) return callback(err);
					else callback(null, opts);
				} ); // put
			} ); // header created
		} ); // get check
	}
	
	_hashLoad = function(path, create_opts, callback) {
		// Internal method, load hash root, possibly create if doesn't exist
		var self = this;
		if (create_opts && (typeof(create_opts) != 'object')) create_opts = {};
		this.logDebug(9, "Loading hash: " + path);
		
		this.get(path, function(err, hash) {
			if (hash) {
				// hash already exists
				callback(null, hash);
			}
			else if (create_opts && err && (err.code == "NoSuchKey")) {
				// create new hash, ONLY if record was not found (and not some other error)
				self.logDebug(9, "Hash not found, creating it: " + path);
				self.hashCreate(path, create_opts, function(err, hash) {
					if (err) callback(err);
					else callback( null, hash );
				} );
			}
			else {
				// no exist and no create, or some other error
				self.logDebug(9, "Hash could not be loaded: " + path + ": " + err);
				callback(err);
			}
		} ); // get
	}
	
	_hashLock = function(key, wait, callback) {
		// internal hash lock wrapper
		// uses unique key prefix so won't deadlock with user locks
		this.lock( '|'+key, wait, callback );
	}
	
	_hashUnlock = function(key) {
		// internal hash unlock wrapper
		this.unlock( '|'+key );
	}
	
	_hashShareLock = function(key, wait, callback) {
		// internal hash shared lock wrapper
		// uses unique key prefix so won't deadlock with user locks
		this.shareLock( '|'+key, wait, callback );
	}
	
	_hashShareUnlock = function(key) {
		// internal hash shared unlock wrapper
		this.shareUnlock( '|'+key );
	}
	
	hashPut = function(path, hkey, hvalue, create_opts, callback) {
		// store key/value pair into hash table
		var self = this;
		if (!callback && (typeof(create_opts) == 'function')) {
			callback = create_opts;
			create_opts = {};
		}
		if (!path) return callback(new Error("Hash path must be a valid string."));
		if (!hkey) return callback(new Error("Hash key must be a valid string."));
		if (typeof(hvalue) == 'undefined') return callback(new Error("Hash value must not be undefined."));
		
		this.logDebug(9, "Storing hash key: " + path + ": " + hkey, this.debugLevel(10) ? hvalue : null);
		
		// lock hash for this
		this._hashLock(path, true, function() {
			
			// load header
			self._hashLoad(path, create_opts, function(err, hash) {
				if (err) {
					self._hashUnlock(path);
					return callback(err);
				}
				
				var state = {
					path: path,
					data_path: path + '/data',
					hkey: ''+hkey,
					hvalue: hvalue,
					hash: hash,
					index_depth: -1,
					key_digest: digestHex(hkey, 'md5')
				};
				
				self._hashPutKey(state, function(err) {
					// done
					self._hashUnlock(path);
					return callback(err);
				}); // _hashPutKey
			}); // load
		}); // lock
	}
	
	_hashPutKey = function(state, callback) {
		// internal hash put method, store at one hashing level
		// recurse for deeper indexes
		var self = this;
		
		self.get(state.data_path, function(err, data) {
			if (err) data = { type: 'hash_page', length: 0, items: {} };
			
			if (data.type == 'hash_index') {
				// recurse for deeper level
				state.index_depth++;
				state.data_path += '/' + state.key_digest.substring(state.index_depth, state.index_depth + 1);
				return self._hashPutKey(state, callback);
			}
			else {
				// got page, store at this level
				var new_key = false;
				data.items = copyHashRemoveProto( data.items );
				
				if (!(state.hkey in data.items)) {
					data.length++;
					state.hash.length++;
					new_key = true;
				}
				
				data.items[state.hkey] = state.hvalue;
				
				var finish = function(err) {
					if (err) return callback(err);
					
					if (data.length > state.hash.page_size) {
						// enqueue page reindex task
						self.logDebug(9, "Hash page has grown beyond max keys, running index split: " + state.data_path, {
							num_keys: data.length,
							page_size: state.hash.page_size
						});
						self._hashSplitIndex(state, callback);
					} // reindex
					else {
						// no reindex needed
						callback();
					}
				}; // finish
				
				// save page and possibly hash header
				self.put(state.data_path, data, function(err) {
					if (err) return callback(err);
					
					if (new_key) self.put(state.path, state.hash, finish);
					else finish();
				}); // put
			} // hash_page
		}); // get
	}
	
	_hashSplitIndex = function(state, callback) {
		// hash split index
		// split hash level into 16 new index buckets
		var self = this;
		state.index_depth++;
		
		this.logDebug(9, "Splitting hash data into new index: " + state.data_path + " (" + state.index_depth + ")");
		
		// load data page which will be converted to a hash index
		self.get(state.data_path, function(err, data) {
			// check for error or if someone stepped on our toes
			if (err) {
				// normal, hash may have been deleted
				self.logError('hash', "Failed to fetch data record for hash split: " + state.data_path + ": " + err);
				return callback();
			}
			if (data.type == 'hash_index') {
				// normal, hash may already have been indexed
				self.logDebug(9, "Data page has been reindexed already, skipping: " + state.data_path, data);
				return callback();
			}
			
			// rehash keys at new index depth
			var pages = {};
			data.items = copyHashRemoveProto( data.items );
			
			for (var hkey in data.items) {
				var key_digest = digestHex(hkey, 'md5');
				var ch = key_digest.substring(state.index_depth, state.index_depth + 1);
				
				if (!pages[ch]) pages[ch] = { type: 'hash_page', length: 0, items: {} };
				pages[ch].items[hkey] = data.items[hkey];
				pages[ch].length++;
				
				// Note: In the very rare case where a subpage also overflows,
				// the next hashPut will take care of the nested reindex.
			} // foreach key
			
			// save all pages in parallel, then rewrite data page as an index
			forEachOfLimit(pages, self.concurrency, 
				function (page, ch, callback) {
					self.put( state.data_path + '/' + ch, page, callback );
				},
				function(err) {
					if (err) {
						return callback( new Error("Failed to write data records for hash split: " + state.data_path + "/*: " + err.message) );
					}
					
					// final conversion of original data path
					self.put( state.data_path, { type: 'hash_index' }, function(err) {
						if (err) {
							return callback( new Error("Failed to write data record for hash split: " + state.data_path + ": " + err.message) );
						}
						
						self.logDebug(9, "Hash split complete: " + state.data_path);
						callback();
					}); // final put
				} // complete
			); // forEachOf
		}); // get
	}
	
	hashPutMulti = function(path, records, create_opts, callback) {
		// put multiple hash records at once, given object of keys and values
		// need concurrency limit of 1 because hashPut locks
		var self = this;
		if (!callback && (typeof(create_opts) == 'function')) {
			callback = create_opts;
			create_opts = {};
		}
		
		eachLimit(Object.keys(records), 1, 
			function(hkey, callback) {
				// iterator for each key
				self.hashPut(path, hkey, records[hkey], create_opts, function(err) {
					callback(err);
				} );
			}, 
			function(err) {
				// all keys stored
				callback(err);
			}
		);
	}
	
	hashGet = function(path, hkey, callback) {
		// fetch key/value pair from hash table
		var self = this;
		var state = {
			path: path,
			data_path: path + '/data',
			hkey: hkey,
			index_depth: -1,
			key_digest: digestHex(hkey, 'md5')
		};
		this.logDebug(9, "Fetching hash key: " + path + ": " + hkey);
		
		this._hashShareLock(path, true, function() {
			// share locked
			self._hashGetKey(state, function(err, value) {
				// done
				self._hashShareUnlock(path);
				callback(err, value);
			}); // _hashGetKey
		} ); // _hashShareLock
	}
	
	_hashGetKey = function(state, callback) {
		// internal hash get method, fetch at one hashing level
		// recurse for deeper indexes
		var self = this;
		
		self.get(state.data_path, function(err, data) {
			if (err) return callback(err);
			
			if (data.type == 'hash_index') {
				// recurse for deeper level
				state.index_depth++;
				state.data_path += '/' + state.key_digest.substring(state.index_depth, state.index_depth + 1);
				return self._hashGetKey(state, callback);
			}
			else {
				// got page, fetch at this level
				data.items = copyHashRemoveProto( data.items );
				
				if (!(state.hkey in data.items)) {
					// key not found
					var err = new Error("Failed to fetch key: " + state.hkey + ": Not found");
					err.code = "NoSuchKey";
					return callback(err);
				}
				
				callback(null, data.items[state.hkey]);
			} // hash_page
		}); // get
	}
	
	hashGetMulti = function(path, hkeys, callback) {
		// fetch multiple hash records at once, given array of keys
		// callback is provided an array of values in matching order to keys
		var self = this;
		var records = {};
		
		eachLimit(hkeys, this.concurrency, 
			function(hkey, callback) {
				// iterator for each key
				self.hashGet(path, hkey, function(err, value) {
					if (err) return callback(err);
					records[hkey] = value;
					callback();
				} );
			}, 
			function(err) {
				if (err) return callback(err);
				
				// sort records into array of values ordered by keys
				var values = [];
				for (var idx = 0, len = hkeys.length; idx < len; idx++) {
					values.push( records[hkeys[idx]] );
				}
				
				callback(null, values);
			}
		);
	}
	
	hashEachPage = function(path, iterator, callback) {
		// call user iterator for each populated hash page, data only
		// iterator will be passed page items hash object
		var self = this;
		
		this._hashShareLock(path, true, function() {
			// share locked
			self._hashEachPage(path + '/data', 
				function(data, callback) {
					if ((data.type == 'hash_page') && (data.length > 0)) {
						data.items = copyHashRemoveProto( data.items );
						iterator(data.items, callback);
					}
					else callback();
				}, 
				function(err) {
					self._hashShareUnlock(path);
					callback(err);
				}
			); // _hashEachPage
		} ); // _hashShareLock
	}
	
	_hashEachPage = function(data_path, iterator, callback) {
		// internal method for iterating over hash pages
		// invokes interator for both index and data pages
		var self = this;
		
		self.get(data_path, function(err, data) {
			if (err) return callback(); // normal, page may not exist
			data.path = data_path;
			
			iterator(data, function(err) {
				if (err) return callback(err); // abnormal
				
				if (data.type == 'hash_index') {
					// recurse for deeper level
					eachSeries( [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'],
						function(ch, callback) {
							self._hashEachPage( data_path + '/' + ch, iterator, callback );
						},
						callback
					);
				}
				else callback();
			}); // complete
		}); // get
	}
	
	hashGetAll = function(path, callback) {
		// return ALL keys/values as a single, in-memory hash
		var self = this;
		var everything = Object.create(null);
		
		this._hashShareLock(path, true, function() {
			// share locked
			self._hashEachPage( path + '/data',
				function(page, callback) {
					// called for each hash page (index or data)
					if (page.type == 'hash_page') {
						page.items = copyHashRemoveProto( page.items );
						mergeHashInto( everything, page.items );
					}
					callback();
				},
				function(err) {
					self._hashShareUnlock(path);
					callback(err, err ? null : everything);
				} // done
			); // _hashEachPage
		} ); // _hashShareLock
	}
	
	hashEach = function(path, iterator, callback) {
		// iterate over hash and invoke function for every key/value
		// iterator function is asynchronous (callback), like async.forEachOfSeries
		var self = this;
		
		this._hashShareLock(path, true, function() {
			// share locked
			self._hashEachPage( path + '/data',
				function(page, callback) {
					// called for each hash page (index or data)
					if (page.type == 'hash_page') {
						page.items = copyHashRemoveProto( page.items );
						forEachOfSeries( page.items,
							function(hvalue, hkey, callback) {
								// swap places of hkey,hvalue in iterator args because I HATE how async does it
								iterator(hkey, hvalue, callback);
							},
							callback
						); // forEachOfSeries
					} // hash_page
					else callback();
				}, // page
				function(err) {
					self._hashShareUnlock(path);
					callback(err);
				}
			); // _hashEachPage
		} ); // _hashShareLock
	}
	
	hashEachSync = function(path, iterator, callback) {
		// iterate over hash and invoke function for every key/value
		// iterator function is synchronous (no callback), like Array.forEach()
		var self = this;
		
		this._hashShareLock(path, true, function() {
			// share locked
			self._hashEachPage( path + '/data',
				function(page, callback) {
					// called for each hash page (index or data)
					if (page.type == 'hash_page') {
						page.items = copyHashRemoveProto( page.items );
						for (var hkey in page.items) {
							if (iterator( hkey, page.items[hkey] ) === false) {
								// user abort
								return callback( new Error("User Abort") );
							}
						}
					} // hash_page
					callback();
				}, // page
				function(err) {
					self._hashShareUnlock(path);
					callback(err);
				}
			); // _hashEachPage
		} ); // _hashShareLock
	}
	
	hashCopy = function(old_path, new_path, callback) {
		// copy entire hash to new location
		var self = this;
		this.logDebug(9, "Copying hash: " + old_path + " to " + new_path);
		
		this._hashLock( new_path, true, function() {
			// copy header
			self.copy( old_path, new_path, function(err) {
				if (err) {
					self._hashUnlock(new_path);
					return callback(err);
				}
				
				// iterate over each page
				self._hashEachPage( old_path + '/data',
					function(page, callback) {
						// called for each hash page (index or data)
						var new_page_path = page.path.replace( old_path, new_path );
						
						// copy page
						self.copy(page.path, new_page_path, callback);
					}, // page
					function(err) {
						// all pages copied
						self._hashUnlock(new_path);
						callback(err);
					}
				); // _hashEachPage
			} ); // copy header
		}); // lock
	}
	
	hashRename = function(old_path, new_path, callback) {
		// Copy, then delete hash (and all keys)
		var self = this;
		this.logDebug(9, "Renaming hash: " + old_path + " to " + new_path);
		
		this.hashCopy( old_path, new_path, function(err) {
			// copy complete, now delete old hash
			if (err) return callback(err);
			
			self.hashDeleteAll( old_path, true, callback );
		} ); // copied
	}
	
	hashDeleteAll = function(path, entire, callback) {
		// delete entire hash
		var self = this;
		
		// support 2-arg calling convention (no entire)
		if (!callback && (typeof(entire) == 'function')) {
			callback = entire;
			entire = false;
		}
		
		this.logDebug(9, "Deleting hash: " + path);
		
		this._hashLock( path, true, function() {
			// load header
			self._hashLoad(path, false, function(err, hash) {
				if (err) {
					self._hashUnlock(path);
					return callback(err);
				}
				
				// iterate over each page
				self._hashEachPage( path + '/data',
					function(page, callback) {
						// called for each hash page (index or data)
						self.delete(page.path, callback);
					}, // page
					function(err) {
						// all pages deleted
						if (err) {
							self._hashUnlock(path);
							return callback(err);
						}
						
						if (entire) {
							// delete hash header as well
							self.delete( path, function(err) {
								self._hashUnlock(path);
								callback(err);
							} ); // delete
						}
						else {
							// reset hash for future use
							hash.length = 0;
							self.put( path, hash, function(err) {
								self._hashUnlock(path);
								callback(err);
							} ); // put
						}
					} // complete
				); // _hashEachPage
			}); // _hashLoad
		}); // lock
	}
	
	hashDelete = function(path, hkey, entire, callback) {
		// delete single key from hash
		var self = this;
		
		// support 3-arg calling convention (no entire)
		if (!callback && (typeof(entire) == 'function')) {
			callback = entire;
			entire = false;
		}
		
		this.logDebug(9, "Deleting hash key: " + path + ": " + hkey);
		
		// lock hash for this
		this._hashLock(path, true, function() {
			
			// load header
			self._hashLoad(path, false, function(err, hash) {
				if (err) {
					self._hashUnlock(path);
					return callback(err);
				}
				
				var state = {
					path: path,
					data_path: path + '/data',
					hkey: hkey,
					hash: hash,
					index_depth: -1,
					key_digest: digestHex(hkey, 'md5'),
					entire: entire
				};
				
				self._hashDeleteKey(state, function(err) {
					// done
					self._hashUnlock(path);
					return callback(err);
				}); // _hashDeleteKey
			}); // load
		}); // lock
	}
	
	_hashDeleteKey = function(state, callback) {
		// internal hash delete method, delete from one hashing level
		// recurse for deeper indexes
		var self = this;
		
		self.get(state.data_path, function(err, data) {
			if (err) return callback(err);
			
			if (data.type == 'hash_index') {
				// recurse for deeper level
				state.index_depth++;
				state.data_path += '/' + state.key_digest.substring(state.index_depth, state.index_depth + 1);
				return self._hashDeleteKey(state, callback);
			}
			else {
				// got page, delete from this level
				data.items = copyHashRemoveProto( data.items );
				
				if (!(state.hkey in data.items)) {
					var err = new Error("Failed to delete hash key: " + state.path + ": " + state.hkey + ": Not found");
					err.code = 'NoSuchKey';
					self.logError('hash', err.message);
					return callback(err);
				}
				
				data.length--;
				state.hash.length--;
				
				delete data.items[state.hkey];
				
				// check for delete entire on empty
				if (!state.hash.length && state.entire) {
					self.delete(state.data_path, function(err) {
						if (err) return callback(err);
						self.delete(state.path, callback);
					}); // put
					return;
				}
				
				// save page and hash header
				self.put(state.data_path, data, function(err) {
					if (err) return callback(err);
					
					self.put(state.path, state.hash, function(err) {
						if (err) return callback(err);
						
						// index unsplit time?
						if (!data.length && (state.index_depth > -1)) {
							// index unsplit task
							self.logDebug(9, "Hash page has no more keys, running unsplit check: " + state.data_path);
							self._hashUnsplitIndexCheck(state, callback);
						} // unsplit
						else {
							// no unsplit check needed
							callback();
						}
						
					}); // put
				}); // put
			} // hash_page
		}); // get
	}
	
	_hashUnsplitIndexCheck = function(state, callback) {
		// unsplit hash index
		// check if all sub-pages are empty, and if so, delete all and convert index back into page
		var self = this;
		var data_path = state.data_path.replace(/\/\w+$/, '');
		var found_keys = false;
		var sub_pages = [];
		
		this.logDebug(9, "Checking all hash index sub-pages for unsplit: " + data_path + "/*");
		
		// make sure page is still an index
		self.get(data_path, function(err, data) {
			if (err) {
				self.logDebug(9, "Hash page could not be loaded, aborting unsplit: " + data_path);
				return callback();
			}
			
			if (data.type != 'hash_index') {
				self.logDebug(9, "Hash page is no longer an index, aborting unsplit: " + data_path);
				return callback();
			}
			
			// test each sub-page, counting keys
			// abort on first key (i.e. no need to load all pages in that case)
			eachLimit( [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'], self.concurrency,
				function(ch, callback) {
					self.get( data_path + '/' + ch, function(err, data) {
						if (data) sub_pages.push( ch );
						if (data && ((data.type != 'hash_page') || data.length)) {
							self.logDebug(9, "Index page still has keys: " + data_path + '/' + ch);
							found_keys = true;
							callback( new Error("ABORT") );
						}
						else callback();
					} );
				},
				function(err) {
					// scanned all pages
					if (found_keys || !sub_pages.length) {
						// nothing to be done
						self.logDebug(9, "Nothing to do, aborting unsplit: " + data_path);
						return callback();
					}
					
					self.logDebug(9, "Proceeding with unsplit: " + data_path);
					
					// proceed with unsplit
					eachLimit( sub_pages, self.concurrency,
						function(ch, callback) {
							self.delete( data_path + '/' + ch, callback );
						},
						function(err) {
							// all pages deleted, now rewrite index
							if (err) {
								// this should never happen, but we must continue the op.
								// we cannot leave the index in a partially unsplit state.
								self.logError('hash', "Failed to delete index sub-pages: " + data_path + "/*: " + err);
							}
							
							self.put( data_path, { type: 'hash_page', length: 0, items: {} }, function(err) {
								// all done
								if (err) {
									self.logError('hash', "Failed to put index page: " + data_path + ": " + err);
								}
								else {
									self.logDebug(9, "Unsplit operation complete: " + data_path);
								}
								callback();
							} ); // put
						} // pages deleted
					); // eachLimit
				} // key check
			); // eachLimit
		} ); // load
	}
	
	hashDeleteMulti = function(path, hkeys, callback) {
		// delete multiple hash records at once, given array of keys
		// need concurrency limit of 1 because hashDelete locks
		var self = this;
		
		eachLimit(hkeys, 1, 
			function(hkey, callback) {
				// iterator for each key
				self.hashDelete(path, hkey, function(err) {
					callback(err);
				} );
			}, 
			function(err) {
				// all keys deleted
				callback(err);
			}
		);
	}
	
	hashGetInfo = function(path, callback) {
		// Return info about hash (number of items, etc.)
		this._hashLoad( path, false, callback );
	}
//#endregion

//#region ---- TRANSACTION ----

	transactions = null
	
	transEarlyStart = function() {
		// early check for unclean shutdown
		var pid_file = this.server.config.get('pid_file');
		if (!pid_file) return true; // need pid file to check
		
		try { statSync( pid_file ); }
		catch (e) { return true; } // no pid file, clean startup
		
		// if 'trans_auto_recover' is set, return normally
		if (this.config.get('trans_auto_recover')) return true;
		
		// if we got here then we found a PID file -- force recovery mode
		if (this.server.config.get('recover')) {
			// user added '--recovery' CLI param, good
			// force debug mode (no daemon fork) and allow startup to continue
			this.server.debug = true;
			this.server.echo = true;
			this.server.logger.set('echo', true);
			this.logDebug(1, "Entering database recovery mode");
			return true;
		}
		else {
			var msg = '';
			msg += "\n";
			msg += this.server.__name + " was shut down uncleanly and needs to run database recovery operations.\n";
			msg += "Please start it in recovery mode by issuing this command:\n\n";
			msg += "\t" + process.argv.join(' ') + " --recover\n";
			msg += "\n";
			process.stdout.write(msg);
			process.exit(1);
		}
	}
	
	initTransactions = function(callback) {
		// initialize transaction system, look for recovery files
		var self = this;
		if (!this.config.get('transactions')) return callback();
		
		// keep in-memory hash of active transactions
		this.transactions = {};
		
		// transaction IDs are sequence numbers starting from 1
		this.nextTransID = 1;
		
		// create temp trans dirs
		this.transDir = 'transactions';
		if (this.config.get('trans_dir')) this.transDir = this.config.get('trans_dir');
		else if (this.engine.baseDir) this.transDir = join( this.engine.baseDir, "_transactions" );
		
		try {
			mkdirp.sync( join(this.transDir, "logs") );
			mkdirp.sync( join(this.transDir, "data") );
		}
		catch (err) {
			var msg = "FATAL ERROR: Transaction directory could not be created: " + this.transDir + "/*: " + err;
			this.logError('startup', msg);
			return callback( new Error(msg) );
		}
		
		// construct special subclass for cloning storage
		this.TransStorage = TransStorageFunctions
		
		// hoist compound functions to use transaction wrappers
		this.transHoistCompounds();
		
		// look for recovery logs
		var log_dir = join(this.transDir, "logs");
		
		readdir(log_dir, function(err, files) {
			if (err) return callback(err);
			
			// if no files found, then good, no recovery necessary, return ASAP
			if (!files || !files.length) {
				if (self.server.config.get('recover')) {
					self.logDebug(1, "Database recovery is complete (no recovery actions were required).");
					// self.logDebug(1, "Resuming normal startup");
					
					// we got here from '--recover' mode, so print message and exit now
					var msg = '';
					msg += "\n";
					msg += "Database recovery is complete.  No actions were required.\n";
					msg += self.server.__name + " can now be started normally.\n";
					msg += "\n";
					process.stdout.write(msg);
					
					var pid_file = self.server.config.get('pid_file');
					if (pid_file) try { unlinkSync( pid_file ); } catch(e) {;}
					
					process.exit(0);
				}
				return callback();
			}
			
			// take over logging for this part
			var orig_log_path = self.logger.path;
			var recovery_log_path = join( dirname(orig_log_path), 'recovery.log' );
			var recovery_trans_count = 0;
			
			self.logDebug(1, "Beginning database recovery, see " + recovery_log_path + " for details");
			self.logger.path = recovery_log_path;
			self.logDebug(1, "Beginning database recovery");
			
			// sort logs by their IDs descending, so we roll back transactions in reverse order
			files.sort( function(a, b) {
				return parseInt(b) - parseInt(a);
			});
			
			// damn, unclean shutdown, iterate over recovery logs
			eachSeries( files,
				function(filename, callback) {
					var file = join( log_dir, filename );
					self.logDebug(3, "Processing recovery log: " + file);
					
					open(file, "r", function(err, fh) {
						if (err) {
							self.logError('rollback', "Failed to open recovery log: " + file + ": " + err.message);
							unlink(file, function() { callback(); });
							return;
						}
						
						// read just enough to ensure we get the header
						var chunk = Buffer.alloc(8192);
						read(fh, chunk, 0, 8192, null, function(err, num_bytes, chunk) {
							close(fh, function() {});
							
							if (err) {
								self.logError('rollback', "Failed to read recovery log: " + file + ": " + err.message);
								unlink(file, function() { callback(); });
								return;
							}
							if (!num_bytes) {
								self.logError('rollback', "Failed to read recovery log: " + file + ": 0 bytes read");
								unlink(file, function() { callback(); });
								return;
							}
							
							var data = chunk.slice(0, num_bytes).toString().split("\n", 2)[0];
							
							// parse header (JSON)
							var trans = null;
							try { trans = JSON.parse( data ); }
							catch (err) {
								self.logError('rollback', "Failed to read recovery header: " + file + ": " + err.message);
								unlink(file, function() { callback(); });
								return;
							}
							if (!trans.id || !trans.path || !trans.log || !trans.date || !trans.pid) {
								self.logError('rollback', "Failed to read recovery header: " + file + ": Malformed data");
								unlink(file, function() { callback(); });
								return;
							}
							
							self.logDebug(1, "Rolling back partial transaction: " + trans.path, trans);
							
							// restore transaction info
							self.transactions[ trans.path ] = trans;
							
							// abort (rollback) transaction
							recovery_trans_count++;
							self.abortTransaction( trans.path, callback );
							
						}); // fs.read
					}); // fs.open
				}, // foreach file
				function(err) {
					// all logs complete
					// delete ALL temp data files (these are not used for recovery)
					var data_dir = join(self.transDir, "data");
					
					readdir(data_dir, function(err, files) {
						if (err) return callback(err);
						if (!files) files = [];
						
						eachLimit( files, self.concurrency,
							function(filename, callback) {
								var file = join( data_dir, filename );
								unlink( file, function() { callback(); } ); // ignoring error
							},
							function() {
								// recovery complete
								self.logDebug(1, "Database recovery is complete. " + recovery_trans_count + " transactions rolled back.");
								
								// restore original log setup
								self.logger.path = orig_log_path;
								self.logDebug(1, "Database recovery is complete, see " + recovery_log_path + " for details.");
								
								// save info in case app wants to sniff this on startup and notify user
								self.recovery_log = recovery_log_path;
								self.recovery_count = recovery_trans_count;
								
								if (self.server.config.get('recover')) {
									// we got here from '--recover' mode, so print message and exit now
									var msg = '';
									msg += "\n";
									msg += "Database recovery is complete.  Please see " + recovery_log_path + " for full details.\n";
									msg += self.server.__name + " can now be started normally.\n";
									msg += "\n";
									process.stdout.write(msg);
									
									var pid_file = self.server.config.get('pid_file');
									if (pid_file) try { unlinkSync( pid_file ); } catch(e) {;}
									
									process.exit(0);
								}
								else {
									// continue startup
									callback();
								}
							}
						); // eachSeries (data)
					}); // readdir (data)
				} // all logs complete
			); // eachSeries (logs)
		}); // readdir (logs)
	}
	
	transHoistCompounds = function() {
		// hoist all compound storage API calls to use transaction wrappers
		// 1st arg MUST be key, last arg MUST be callback, errs are FATAL (trigger rollback)
		var self = this;
		var api_list = [
			'listCreate', 
			'listPush', 
			'listUnshift', 
			'listPop', 
			'listShift', 
			'listSplice', 
			'listDelete', 
			'listCopy', 
			'listRename', 
			'listEachUpdate',
			'listEachPageUpdate',
			'hashCreate', 
			'hashPut', 
			'hashPutMulti', 
			'hashCopy', 
			'hashRename', 
			'hashDeleteMulti', 
			'hashDeleteAll', 
			'hashDelete' 
		];
		
		api_list.forEach( function(name) {
			// replace function with transaction-aware wrapper
			self[name] = function() {
				var self = this;
				var args = Array.prototype.slice.call(arguments);
				
				// if transaction already in progress, tag along
				if (self.currentTransactionPath) {
					return self.TransStorage.prototype[name].apply(self, args);
				}
				
				// 1st arg MUST be key, last arg MUST be callback
				var path = args[0];
				var origCallback = args.pop();
				
				// here we go
				self.beginTransaction(path, function(err, clone) {
					// transaction has begun, now insert our own callback to commit it
					
					var finish = function() {
						var args = Array.prototype.slice.call(arguments);
						var err = args[0];
						if (err) {
							// compound function generated an error
							// emergency abort, rollback
							self.abortTransaction(path, function() {
								// call original callback with error that triggered rollback
								origCallback( err );
							}); // abort
						}
						else {
							// no error, commit transaction
							self.commitTransaction(path, function(err) {
								if (err) {
									// commit failed, trigger automatic rollback
									self.abortTransaction(path, function() {
										// call original callback with commit error
										origCallback( err );
									}); // abort
								} // commit error
								else {
									// success!  call original callback with full args
									origCallback.apply( null, args );
								}
							}); // commit
						} // no error
					}; // finish
					
					// call original function on CLONE (transaction-aware version)
					args.push( finish );
					clone[name].apply(clone, args);
				}); // beginTransaction
			}; // hoisted func
		}); // forEach
	}
	
	begin = function(path, callback) {
		// shortcut for beginTransaction
		this.beginTransaction(path, callback);
	}
	
	beginTransaction = function(path, callback) {
		// begin a new transaction, starting at 'path' and encapsulating everything under it
		var self = this;
		if (!this.started) return callback( new Error("Storage has not completed startup.") );
		if (!this.transactions) return callback(null, this);
		if (this.currentTransactionPath) return callback(null, this);
		
		this._transLock(path, true, function() {
			// got lock for transaction
			var id = '' + Math.floor(self.nextTransID++);
			var log_file = join( self.transDir, "logs", id + '.log' );
			var trans = { id: id, path: path, log: log_file, date: timeNow(), pid: process.pid };
			
			self.logDebug(5, "Beginning new transaction on: " + path, trans);
			
			// transaction is ready to begin
			trans.keys = {};
			trans.values = {};
			trans.queue = [];
			self.transactions[path] = trans;
			
			// clone self with currentTransactionPath set
			var clone = new self.TransStorage();
			
			['config', 'server', 'logger', 'cache', 'cacheKeyRegEx', 'listItemsPerPage', 'hashItemsPerPage', 'concurrency', 'cacheKeyRegex', 'engine', 'queue', 'transactions', 'transDir', 'started', 'perf', 'logEventTypes' ].forEach( function(key) {
				clone[key] = self[key];
			});
			
			clone.currentTransactionPath = trans.path;
			clone.rawStorage = self;
			clone.locks = {};
			
			callback(null, clone);
		}); // lock
	}
	
	abortTransaction = function(path, callback) {
		// abort transaction in progress, rollback any actions taken
		var self = this;
		if (!this.transactions) return callback();
		if (this.currentTransactionPath) return callback();
		
		var trans = this.transactions[path];
		if (!trans) return callback( new Error("Unable to find transaction matching path: " + path) );
		
		if (trans.aborting) return callback( new Error("Transaction is already being aborted: " + path) );
		trans.aborting = true;
		
		var num_actions = numKeys(trans.keys || {});
		this.logError('rollback', "Aborting transaction: " + trans.id, { path: path, actions: num_actions });
		
		// read in file line by line
		// (file may not exist, which is fine, hence 'ignore_not_found')
		fileEachLine( trans.log, { ignore_not_found: true },
			function(line, callback) {
				var json = null;
				try { json = JSON.parse(line); }
				catch (err) {
					// non-fatal, file may have been partially written
					self.logError('rollback', "Failed to parse JSON in recovery log: " + err, line);
					return callback();
				}
				if (json) {
					if (json.key) {
						// restore or delete record
						if (json.value) {
							self.put( json.key, json.value, function(err) {
								if (err) {
									var msg = "Could not rollback transaction: " + path + ": Failed to restore record: " + json.key + ": " + err.message;
									self.logError('rollback', msg);
									return callback( new Error(msg) ); // this is fatal
								}
								callback();
							} );
						}
						else {
							self.delete( json.key, function(err) {
								if (err && (err.code != "NoSuchKey")) {
									var msg = "Could not rollback transaction: " + path + ": Failed to delete record: " + json.key + ": " + err.message;
									self.logError('rollback', msg);
									return callback( new Error(msg) ); // this is fatal
								}
								callback(); // record already deleted, non-fatal
							} );
						}
					}
					else if (json.id) {
						// must be the file header
						self.logDebug(3, "Transaction rollback metadata", json);
						return callback();
					}
					else {
						// non-fatal, file may have been partially written
						self.logError('rollback', "Unknown JSON record type", json);
						return callback();
					}
				}
			},
			function(err) {
				// check for fatal error
				if (err) {
					// rollback errors are fatal, as the DB cannot continue in a partial state
					self.transFatalError(err);
					return;
				}
				
				// delete transaction log
				self.logDebug(9, "Deleting transaction log: " + trans.log);
				
				unlink( trans.log, function(err) {
					if (err && !err.message.match(/ENOENT/)) {
						self.logError('rollback', "Unable to delete rollback log: " + trans.log + ": " + err);
					}
					
					// complete, unlock and remove transaction from memory
					self.transactions[path].keys = {}; // release memory
					self.transactions[path].values = {}; // release memory
					self.transactions[path].queue = []; // release memory
					delete self.transactions[path];
					
					self.logDebug(3, "Transaction rollback complete: " + trans.id, { path: path });
					
					// unlock at the VERY end, as a new transaction may be waiting on the same path
					self.unlock( 'C|'+path );
					self._transUnlock(path);
					
					callback();
				}); // fs.unlink
			} // done with log
		); // fileEachLine
	}
	
	commitTransaction = function(path, callback) {
		// commit transaction to storage
		var self = this;
		if (!this.transactions) return callback();
		if (this.currentTransactionPath) return callback();
		
		var trans = this.transactions[path];
		if (!trans) return callback( new Error("Unable to find transaction matching path: " + path) );
		
		if (trans.committing) return callback( new Error("Transaction is already being committed: " + path) );
		trans.committing = true;
		
		if (trans.aborting) return callback( new Error("Transaction has already been aborted: " + path) );
		
		var num_actions = numKeys(trans.keys);
		this.logDebug(5, "Committing transaction: " + trans.id, { path: path, actions: num_actions });
		
		if (!num_actions) {
			// transaction is complete
			this.logDebug(5, "Transaction has no actions, committing instantly");
			
			// transaction is complete
			trans.keys = {}; // release memory
			trans.values = {}; // release memory
			delete this.transactions[path];
			
			this._transUnlock(path);
			if (callback) callback();
			
			// enqueue any pending tasks that got added during the transaction
			if (trans.queue.length) {
				trans.queue.forEach( this.enqueue.bind(this) );
				trans.queue = []; // release memory
			}
			
			return;
		}
		
		// start commit and track perf
		var num_bytes = 0;
		var pf = this.perf.begin('commit');
		
		waterfall(
			[
				function(callback) {
					// acquire commit lock
					self.lock( 'C|'+path, true, function() { callback(); } );
				},
				function(callback) { 
					// open transaction log (exclusive append mode)
					open( trans.log, "ax", callback ); 
				},
				function(fh, callback) {
					// store file handle, write file header
					trans.fh = fh;
					var header = copyHashRemoveKeys(trans, { keys: 1, values: 1, queue: 1, fh: 1, committing: 1 });
					write( fh, JSON.stringify(header) + "\n", callback );
				},
				function(num_bytes, buf, callback) {
					// fetch all affected keys and append records to rollback log
					forEachOfLimit( trans.keys, self.concurrency, 
						function(record_state, key, callback) {
							self.get( key, function(err, value) {
								if (err && (err.code != "NoSuchKey")) return callback(err);
								write( trans.fh, JSON.stringify({ key: key, value: value || 0 }) + "\n", callback );
							});
						},
						callback
					); // forEachOfLimit
				},
				function(callback) {
					// flush log contents to disk
					fsync( trans.fh, function(err) {
						if (err) return callback(err);
						
						close( trans.fh, callback );
						delete trans.fh;
					} );
				},
				function(callback) {
					// We must fsync the directory as well, as per: http://man7.org/linux/man-pages/man2/fsync.2.html
					// Note: Yes, read-only is the only way: https://www.reddit.com/r/node/comments/4r8k11/how_to_call_fsync_on_a_directory/
					open( dirname(trans.log), "r", function(err, dh) {
						if (err) return callback(err);
						
						fsync(dh, function(err) {
							// ignoring error here, as some filesystems may not allow this
							close(dh, callback);
						});
					} );
				},
				function(callback) {
					// we now have a complete, 100% synced rollback log
					// now commit actual changes to storage -- as fast as possible
					forEachOfLimit( trans.keys, self.concurrency, 
						function(record_state, key, callback) {
							if (record_state == 'W') {
								// overwrite record with our transaction's state
								var value = trans.values[key];
								num_bytes += value.len;
								self.put( key, value.data, callback );
							}
							else if (record_state == 'D') {
								self.delete(key, function(err) {
									if (err) {
										if (err.code == "NoSuchKey") {
											// no problem - someone may have deleted the record, or it was already deleted to begin with
											self.logDebug(5, "Record already deleted: " + key);
										}
										else {
											// this should not happen
											return callback(err);
										}
									} // err
									callback();
								});
							} // state 'D'
						},
						callback
					); // forEachOfLimit
				}
			],
			function(err) {
				// commit complete
				var elapsed = pf.end();
				
				if (err) {
					var msg = "Failed to commit transaction: " + path + ": " + err.message;
					self.logError('commit', msg, { id: trans.id });
					return callback( new Error(msg) );
				}
				
				self.logDebug(5, "Transaction committed successfully: " + trans.id, { path: path, actions: num_actions });
				self.logTransaction('commit', path, {
					id: trans.id,
					elapsed_ms: elapsed,
					actions: num_actions,
					bytes_written: num_bytes
				});
				
				// transaction is complete
				delete trans.values; // release memory
				delete self.transactions[path];
				
				// enqueue any pending tasks that got added during the transaction
				if (trans.queue.length) {
					trans.queue.forEach( self.enqueue.bind(self) );
					trans.queue = []; // release memory
				}
				
				// engine may need to sync data records separately (i.e. fsync)
				// do this after releasing transaction lock, but hold log delete until after
				if (self.engine.sync) {
					self.enqueue( function(task, callback) {
						self.transPostSync( trans, callback );
					} );
				}
				else {
					// no sync needed for engine, just delete rollback log
					self.logDebug(9, "No sync needed, deleting transaction log: " + trans.log);
					unlink( trans.log, function() {} );
					delete trans.keys; // release memory
				}
				
				self.unlock( 'C|'+path );
				self._transUnlock(path);
				callback();
			}
		); // waterfall
	}
	
	transPostSync = function(trans, callback) {
		// call sync after commit completes
		var self = this;
		var wrote_keys = Object.keys(trans.keys).filter( function(key) {
			return trans.keys[key] == 'W';
		});
		delete trans.keys; // release memory
		
		eachLimit( wrote_keys, self.concurrency,
			function(key, callback) {
				self.engine.sync( key, function() {
					// ignore error here, as key may be deleted
					callback();
				});
			},
			function(err) {
				// finally we can safely delete the transaction log
				self.logDebug(9, "All " + wrote_keys.length + " syncs complete, deleting transaction log: " + trans.log);
				unlink( trans.log, callback );
			}
		); // forEachOfLimit
	}
	
	transFatalError = function(err) {
		// fatal error: scream loudly and shut down immediately
		var self = this;
		this.server.logger.set('sync', true);
		
		this.logError('fatal', "Fatal transaction error: " + err.message);
		
		// log to crash.log as well (in typical log configurations)
		this.server.logger.set( 'component', 'crash' );
		this.server.logger.debug( 1, "Emergency shutdown: " + err.message );
		
		// stop all future storage actions
		this.started = false;
		
		// allow application to hook fatal event and handle shutdown
		if (this.listenerCount('fatal')) {
			this.emit('fatal', err);
		}
		else {
			// just exit immediately
			self.logDebug(1, "Exiting");
			process.exit(1);
		}
	}
	
	_transLock = function(key, wait, callback) {
		// internal transaction lock wrapper
		// uses unique key prefix so won't deadlock with user locks
		this.lock( 'T|'+key, wait, callback );
	}
	
	_transUnlock = function(key) {
		// internal transaction unlock wrapper
		this.unlock( 'T|'+key );
	}
//#endregion

//#region ---- INDEXER SINGLE ----

	removeWordCache = null

	searchSingle = function(query, record_id, config, callback) {
		// run search query on single record
		// load record idx_data
		var self = this;
		
		// parse search string if required
		if (typeof(query) == 'string') {
			query = query.trim();
			
			if (query == '*') {
				// search wildcard -- special instant result of always true
				return callback(null, true);
			}
			else if (query.match(/^\([\s\S]+\)$/)) {
				// PxQL syntax, parse grammar
				query = this.parseGrammar(query, config);
				if (query.err) {
					this.logError('index', "Invalid search query: " + query.err, query);
					return callback(query.err, false);
				}
			}
			else {
				// simple query syntax
				query = this.parseSearchQuery(query, config);
			}
		}
		
		if (!query.criteria || !query.criteria.length) {
			this.logError('index', "Invalid search query", query);
			return callback(null, false);
		}
		
		this.get( config.base_path + '/_data/' + record_id, function(err, idx_data) {
			if (err) return callback(err);
			
			var results = self._searchSingle(query, record_id, idx_data, config);
			callback( null, !!results[record_id] );
		});
	}
	
	_searchSingle = function(query, record_id, idx_data, config) {
		// execute single search on idx_data (sync)
		// query must be pre-compiled and idx_data must be pre-loaded
		var self = this;
		
		// prep idx_data, but only once
		if (!idx_data.hashed) {
			for (var def_id in idx_data) {
				var data = idx_data[def_id];
				data.word_hash = this.getWordHashFromList( data.words || [] );
			}
			idx_data.hashed = true;
		}
		
		var state = query;
		state.config = config;
		state.record_ids = Object.create(null);
		state.first = true;
		
		// first, split criteria into subs (sub-queries), 
		// stds (standard queries) and negs (negative queries)
		var subs = [], stds = [], negs = [];
		for (var idx = 0, len = query.criteria.length; idx < len; idx++) {
			var crit = query.criteria[idx];
			if (crit.criteria) subs.push( crit );
			else {
				var def = findObject( config.fields, { id: crit.index } );
				if (!def) {
					this.logError('index', "Invalid search query: Index not found: " + crit.index, query);
					return {};
				}
				crit.def = def;
				
				if (crit.negative) negs.push( crit );
				else stds.push( crit );
			}
		}
		
		// generate series of tasks, starting with any sub-queries,
		// then standard positive criteria, then negative criteria
		var tasks = [].concat( subs, stds, negs );
		
		tasks.forEach( function(task) {
			if (task.criteria) {
				// sub-query
				var records = self._searchSingle( task, record_id, idx_data, config );
				self.mergeIndex( state.record_ids, records, state.first ? 'or' : state.mode );
				state.first = false;
			}
			else if (task.skip) {
				// skip this task (all words removed)
			}
			else if (task.def.type) {
				// custom index type, e.g. date, time, number
				var func = 'searchSingle_' + task.def.type;
				if (self[func]) self[func]( task, record_id, idx_data, state );
				else self.logError('index', "Unknown index type: " + task.def.type);
			}
			else if (task.literal) {
				self._searchSingleWordIndexLiteral(task, record_id, idx_data, state);
			}
			else {
				self._searchSingleWordIndex(task, record_id, idx_data, state);
			}
		} ); // foreach task
		
		return state.record_ids;
	}
	
	_searchSingleWordIndex = function(query, record_id, idx_data, state) {
		// run one search query (list of words against one index)
		var self = this;
		var config = state.config;
		var def = query.def;
		
		var mode = state.first ? 'or' : state.mode;
		if (query.negative) mode = 'not';
		state.first = false;
		
		var cur_items = state.record_ids;
		var new_items = Object.create(null);
		
		// create "fake" hash index for word, containing only our one record
		var items = Object.create(null);
		if (idx_data[def.id] && idx_data[def.id].word_hash && idx_data[def.id].word_hash[query.word]) {
			items[ record_id ] = idx_data[def.id].word_hash[query.word];
		}
		
		switch (mode) {
			case 'and':
				for (var key in items) {
					if (key in cur_items) new_items[key] = 1;
				}
			break;
			
			case 'or':
				for (var key in items) {
					cur_items[key] = 1;
				}
			break;
			
			case 'not':
				for (var key in items) {
					delete cur_items[key];
				}
			break;
		}
		
		if (mode == 'and') state.record_ids = new_items;
	}
	
	_searchSingleWordIndexLiteral = function(query, record_id, idx_data, state) {
		// run literal search query (list of words which must be in sequence)
		var self = this;
		var def = query.def;
		
		var mode = state.first ? 'or' : state.mode;
		if (query.negative) mode = 'not';
		state.first = false;
		
		var record_ids = state.record_ids;
		var temp_results = Object.create(null);
		var temp_idx = 0;
		
		query.words.forEach( function(word) {
			// for each word, iterate over record ids
			var keepers = Object.create(null);
			
			// create "fake" hash index for word, containing only our one record
			var items = Object.create(null);
			if (idx_data[def.id] && idx_data[def.id].word_hash && idx_data[def.id].word_hash[word]) {
				items[ record_id ] = idx_data[def.id].word_hash[word];
			}
			
			Object.keys(items).forEach( function(record_id) {
				var raw_value = items[record_id];
				
				// instant rejection if temp_idx and record_id isn't already present
				if (temp_idx && !(record_id in temp_results)) return;
				
				var offset_list = raw_value.split(/\,/);
				var still_good = 0;
				
				for (var idx = offset_list.length - 1; idx >= 0; idx--) {
					var word_idx = parseInt( offset_list[idx] );
					
					if (temp_idx) {
						// Subsequent pass -- make sure offsets are +1
						var arr = temp_results[record_id];
						for (var idy = 0, ley = arr.length; idy < ley; idy++) {
							var elem = arr[idy];
							if (word_idx == elem + 1) {
								arr[idy]++;
								still_good = 1;
							}
						}
					} // temp_idx
					else {
						// First pass -- get word idx into temp_results
						if (!temp_results[record_id]) temp_results[record_id] = [];
						temp_results[record_id].push( word_idx );
						still_good = 1;
					}
				} // foreach word_idx
				
				if (!still_good) delete temp_results[record_id];
				else keepers[record_id] = 1;
			} ); // foreach fake hash key
			
			// If in a subsequent word pass, make sure all temp_results
			// ids are still matched in the latest word
			if (temp_idx > 0) self.mergeIndex( temp_results, keepers, 'and' );
			temp_idx++;
		} ); // foreach word
		
		// all done, now merge data into record ids
		for (var record_id in temp_results) {
			temp_results[record_id] = 1; // cleanup values
		}
		
		this.mergeIndex( record_ids, temp_results, mode );
	}
//#endregion

//#region ---- INDEXER NUMBER ----

	prepIndex_number = function(words, def, state) {
		// prep index write for number type
		var value = words[0] || '';
		words = [];
		
		// numbers always require a master_list (summary)
		def.master_list = 1;
		
		if (value.match(/^(N?)(\d+)$/i)) {
			var neg = RegExp.$1.toUpperCase();
			var value = parseInt( RegExp.$2 );
			value = Math.min( NUMBER_INDEX_MAX, value );
			
			var tkey = 'T' + neg + Math.floor( Math.floor(value / 1000) * 1000 );
			var hkey = 'H' + neg + Math.floor( Math.floor(value / 100) * 100 );
			
			words.push( neg + value );
			words.push( hkey );
			words.push( tkey );
			
			return words;
		}
		else return false;
	}
	
	prepDeleteIndex_number = function(words, def, state) {
		// prep for index delete (no return value)
		
		// numbers require a master_list (summary)
		def.master_list = 1;
	}
	
	filterWords_number = function(value) {
		// filter number queries
		value = value.replace(/[^\d\-]+/g, '').replace(/\-/, 'N');
		return value;
	}
	
	searchIndex_number = function(query, state, callback) {
		// search number index
		var self = this;
		var record_ids = state.record_ids;
		var word = query.word;
		var base_path = state.config.base_path + '/' + query.def.id;
		var sum_path = base_path + '/summary';
		var temp_results = {};
		var words = [];
		
		if (!query.operator) query.operator = '=';
		
		this.logDebug(10, "Running number query", query);
		
		// clean number up
		word = word.replace(/^N/i, '-').replace(/[^\d\-]+/g, '');
		word = '' + Math.min( NUMBER_INDEX_MAX, Math.max( NUMBER_INDEX_MIN, parseInt(word) ) );
		word = word.replace(/\-/, 'N');
		query.word = word;
		
		// syntax check
		var num = parseNumber(word);
		if (!num) {
			return callback( new Error("Invalid number format: " + word) );
		}
		
		// check for simple equals
		if (query.operator == '=') {
			return this.searchWordIndex(query, state, callback);
		}
		
		// load index summary for list of all populated numbers
		var nspf = state.perf.begin('number_summary');
		this.get( sum_path, function(err, summary) {
			nspf.end();
			if (err || !summary) {
				summary = { id: query.def.id, values: {} };
			}
			var values = summary.values;
			var lesser = !!query.operator.match(/</);
			
			// operator includes exact match
			if (query.operator.match(/=/)) words.push( word );
			
			// add matching number tags based on operator
			for (var value in values) {
				var temp = parseNumber(value) || {};
				if (temp.exact) {
					// only compare if T and H match
					if (temp.hvalue == num.hvalue) {
						if (lesser) { if (temp.value < num.value) words.push(value); }
						else { if (temp.value > num.value) words.push(value); }
					}
				}
				else if (temp.hundreds) {
					if (lesser) { if (temp.hvalue < num.hvalue) words.push(value); }
					else { if (temp.hvalue > num.hvalue) words.push(value); }
				}
				else if (temp.thousands) {
					if (lesser) { if (temp.tvalue < num.tvalue) words.push(value); }
					else { if (temp.tvalue > num.tvalue) words.push(value); }
				}
			}
			
			// now perform OR search for all applicable words
			var nrpf = state.perf.begin('number_range');
			eachLimit( words, self.concurrency,
				function(word, callback) {
					// for each word, iterate over record ids
					self.hashEachPage( base_path + '/word/' + word,
						function(items, callback) {
							for (var record_id in items) temp_results[record_id] = 1;
							callback();
						},
						callback
					); // hashEachPage
				},
				function(err) {
					// all done, perform final merge
					nrpf.end();
					state.perf.count('number_buckets', words.length);
					if (err) return callback(err);
					self.mergeIndex( record_ids, temp_results, state.first ? 'or' : state.mode );
					state.first = false;
					callback();
				}
			); // eachSeries
		} ); // get (summary)
	}
	
	searchSingle_number = function(query, record_id, idx_data, state) {
		// search number index vs single record (sync)
		var self = this;
		var record_ids = state.record_ids;
		var word = query.word;
		var temp_results = {};
		var words = [];
		var def = query.def;
		
		if (!query.operator) query.operator = '=';
		
		// clean number up
		word = word.replace(/^N/i, '-').replace(/[^\d\-]+/g, '');
		word = '' + Math.min( NUMBER_INDEX_MAX, Math.max( NUMBER_INDEX_MIN, parseInt(word) ) );
		word = word.replace(/\-/, 'N');
		query.word = word;
		
		// syntax check
		var num = parseNumber(word);
		if (!num) {
			this.logError('index', "Invalid number format: " + word);
			return;
		}
		
		// check for simple equals
		if (query.operator == '=') {
			this._searchSingleWordIndex( query, record_id, idx_data, state );
			return;
		}
		
		// create "fake" summary index for record
		var summary = { id: def.id, values: {} };
		if (idx_data[def.id] && idx_data[def.id].word_hash) {
			summary.values = idx_data[def.id].word_hash;
		}
		
		var values = summary.values;
		var lesser = !!query.operator.match(/</);
		
		// operator includes exact match
		if (query.operator.match(/=/)) words.push( word );
		
		// add matching number tags based on operator
		for (var value in values) {
			var temp = parseNumber(value) || {};
			if (temp.exact) {
				// only compare if T and H match
				if (temp.hvalue == num.hvalue) {
					if (lesser) { if (temp.value < num.value) words.push(value); }
					else { if (temp.value > num.value) words.push(value); }
				}
			}
			else if (temp.hundreds) {
				if (lesser) { if (temp.hvalue < num.hvalue) words.push(value); }
				else { if (temp.hvalue > num.hvalue) words.push(value); }
			}
			else if (temp.thousands) {
				if (lesser) { if (temp.tvalue < num.tvalue) words.push(value); }
				else { if (temp.tvalue > num.tvalue) words.push(value); }
			}
		}
		
		// now perform OR search for all applicable words
		words.forEach( function(word) {
			// create "fake" hash index for word, containing only our one record
			var items = {};
			if (idx_data[def.id] && idx_data[def.id].word_hash && idx_data[def.id].word_hash[word]) {
				items[ record_id ] = idx_data[def.id].word_hash[word];
			}
			
			for (var key in items) temp_results[key] = 1;
		} );
		
		this.mergeIndex( record_ids, temp_results, state.first ? 'or' : state.mode );
		state.first = false;
	}
//#endregion

//#region ---- INDEXER DATE ----

	prepIndex_date = function(words, def, state) {
		// prep index write for date type
		// dates always require a master_list (summary)
		def.master_list = 1;
		
		// if (!words || !words.length) return false;
		var unique_words = {};
		var good = false;
		
		words.forEach( function(date) {
			if (date.match(/^(\d{4})_(\d{2})_(\d{2})$/)) {
				var yyyy = RegExp.$1;
				var mm = RegExp.$2;
				var dd = RegExp.$3;
				
				unique_words[ yyyy + '_' + mm + '_' + dd ] = 1;
				unique_words[ yyyy + '_' + mm ] = 1;
				unique_words[ yyyy ] = 1;
				good = true;
			}
		});
		
		return hashKeysToArray(unique_words);
	}
	
	prepDeleteIndex_date = function(words, def, state) {
		// prep for index delete (no return value)
		
		// dates require a master_list (summary)
		def.master_list = 1;
	}
	
	filterWords_date = function(orig_value) {
		// filter date queries
		return orig_value.trim().replace(/\,/g, ' ').split(/\s+/).map( function(value) {
			if (!value.match(/\S/)) return '';
			
			// MM/DD/YYYY --> YYYY_MM_DD
			// FUTURE: This is a very US-centric format assumption here
			if (value.match(/^(\d{2})\D+(\d{2})\D+(\d{4})$/)) {
				value = RegExp.$3 + '_' + RegExp.$1 + '_' + RegExp.$2;
			}
			
			// special search month/year formats
			else if (value.match(/^(\d{4})\D+(\d{2})$/)) { value = RegExp.$1 + '_' + RegExp.$2; }
			else if (value.match(/^(\d{4})$/)) { value = RegExp.$1; }
			
			// special search keywords
			else if (value.match(/^(today|now)$/i)) {
				var dargs = getDateArgs( timeNow(true) );
				value = dargs.yyyy_mm_dd;
			}
			else if (value.match(/^(yesterday)$/i)) {
				var midnight = normalizeTime( timeNow(true), { hour:0, min:0, sec:0 } );
				var yesterday_noonish = midnight - 43200;
				var dargs = getDateArgs( yesterday_noonish );
				value = dargs.yyyy_mm_dd;
			}
			else if (value.match(/^(this\s+month)$/i)) {
				var dargs = getDateArgs( timeNow(true) );
				value = dargs.yyyy + '_' + dargs.mm;
			}
			else if (value.match(/^(this\s+year)$/i)) {
				var dargs = getDateArgs( timeNow(true) );
				value = dargs.yyyy;
			}
			else if (value.match(/^\d+(\.\d+)?$/)) {
				// convert epoch date (local server timezone)
				var epoch = parseInt(value);
				if (!epoch) return '';
				var dargs = getDateArgs( epoch );
				value = dargs.yyyy_mm_dd;
			}
			else if (!value.match(/^(\d{4})\D+(\d{2})\D+(\d{2})$/)) {
				// try to convert using node date (local timezone)
				var dargs = getDateArgs( value + " 00:00:00" );
				value = dargs.epoch ? dargs.yyyy_mm_dd : '';
			}
			
			value = value.replace(/\D+/g, '_');
			return value;
		} ).join(' ').replace(/\s+/g, ' ').trim();
	}
	
	searchIndex_date = function(query, state, callback) {
		// search date index
		var self = this;
		var record_ids = state.record_ids;
		var word = query.word || query.words[0];
		var base_path = state.config.base_path + '/' + query.def.id;
		var sum_path = base_path + '/summary';
		var temp_results = {};
		var words = [];
		
		if (!query.operator) query.operator = '=';
		
		this.logDebug(10, "Running date query", query);
		
		word = word.replace(/\D+/g, '_');
		query.word = word;
		
		if (word.match(/^\d{5,}$/)) {
			// epoch date (local server timezone)
			var dargs = getDateArgs( parseInt(word) );
			word = dargs.yyyy + '_' + dargs.mm + '_' + dargs.dd;
			query.word = word;
		}
		
		// check for simple equals
		if (query.operator == '=') {
			return this.searchWordIndex(query, state, callback);
		}
		
		// adjust special month/date search tricks for first of month/year
		if (word.match(/^(\d{4})_(\d{2})$/)) word += "_01";
		else if (word.match(/^(\d{4})$/)) word += "_01_01";
		query.word = word;
		
		// syntax check
		var date = parseDate(word);
		if (!date) {
			return callback( new Error("Invalid date format: " + word) );
		}
		
		// load index summary for list of all populated dates
		var dspf = state.perf.begin('date_summary');
		this.get( sum_path, function(err, summary) {
			dspf.end();
			if (err || !summary) {
				summary = { id: query.def.id, values: {} };
			}
			var values = summary.values;
			var lesser = !!query.operator.match(/</);
			
			// operator includes exact match
			if (query.operator.match(/=/)) words.push( word );
			
			// add matching date tags based on operator
			for (var value in values) {
				var temp = parseDate(value) || {};
				if (temp.dd) {
					// only compare if yyyy and mm match
					if (temp.yyyy_mm == date.yyyy_mm) {
						if (lesser) { if (value < word) words.push(value); }
						else { if (value > word) words.push(value); }
					}
				}
				else if (temp.mm) {
					if (lesser) { if (temp.yyyy_mm < date.yyyy_mm) words.push(value); }
					else { if (temp.yyyy_mm > date.yyyy_mm) words.push(value); }
				}
				else if (temp.yyyy) {
					if (lesser) { if (temp.yyyy < date.yyyy) words.push(value); }
					else { if (temp.yyyy > date.yyyy) words.push(value); }
				}
			}
			
			// now perform OR search for all applicable words
			var drpf = state.perf.begin('date_range');
			eachLimit( words, self.concurrency,
				function(word, callback) {
					// for each word, iterate over record ids
					self.hashEachPage( base_path + '/word/' + word,
						function(items, callback) {
							for (var record_id in items) temp_results[record_id] = 1;
							callback();
						},
						callback
					); // hashEachPage
				},
				function(err) {
					// all done, perform final merge
					drpf.end();
					state.perf.count('date_buckets', words.length);
					if (err) return callback(err);
					self.mergeIndex( record_ids, temp_results, state.first ? 'or' : state.mode );
					state.first = false;
					callback();
				}
			); // eachSeries
		} ); // get (summary)
	}
	
	searchSingle_date = function(query, record_id, idx_data, state) {
		// search date index vs single record (sync)
		var self = this;
		var record_ids = state.record_ids;
		var word = query.word || query.words[0];
		var def = query.def;
		var temp_results = {};
		var words = [];

		if (!query.operator) query.operator = '=';
		
		word = word.replace(/\D+/g, '_');
		query.word = word;
		
		if (word.match(/^\d{5,}$/)) {
			// epoch date (local server timezone)
			var dargs = getDateArgs( parseInt(word) );
			word = dargs.yyyy + '_' + dargs.mm + '_' + dargs.dd;
			query.word = word;
		}
		
		// check for simple equals
		if (query.operator == '=') {
			this._searchSingleWordIndex( query, record_id, idx_data, state );
			return;
		}
		
		// adjust special month/date search tricks for first of month/year
		if (word.match(/^(\d{4})_(\d{2})$/)) word += "_01";
		else if (word.match(/^(\d{4})$/)) word += "_01_01";
		query.word = word;
		
		// syntax check
		var date = parseDate(word);
		if (!date) {
			this.logError('index', "Invalid date format: " + word);
			return;
		}
		
		// create "fake" summary index for record
		var summary = { id: def.id, values: {} };
		if (idx_data[def.id] && idx_data[def.id].word_hash) {
			summary.values = idx_data[def.id].word_hash;
		}
		
		var values = summary.values;
		var lesser = !!query.operator.match(/</);
		
		// operator includes exact match
		if (query.operator.match(/=/)) words.push( word );
		
		// add matching date tags based on operator
		for (var value in values) {
			var temp = parseDate(value) || {};
			if (temp.dd) {
				// only compare if yyyy and mm match
				if (temp.yyyy_mm == date.yyyy_mm) {
					if (lesser) { if (value < word) words.push(value); }
					else { if (value > word) words.push(value); }
				}
			}
			else if (temp.mm) {
				if (lesser) { if (temp.yyyy_mm < date.yyyy_mm) words.push(value); }
				else { if (temp.yyyy_mm > date.yyyy_mm) words.push(value); }
			}
			else if (temp.yyyy) {
				if (lesser) { if (temp.yyyy < date.yyyy) words.push(value); }
				else { if (temp.yyyy > date.yyyy) words.push(value); }
			}
		}
		
		// now perform OR search for all applicable words
		words.forEach( function(word) {
			// create "fake" hash index for word, containing only our one record
			var items = {};
			if (idx_data[def.id] && idx_data[def.id].word_hash && idx_data[def.id].word_hash[word]) {
				items[ record_id ] = idx_data[def.id].word_hash[word];
			}
			
			for (var key in items) temp_results[key] = 1;
		} );
		
		this.mergeIndex( record_ids, temp_results, state.first ? 'or' : state.mode );
		state.first = false;
	}
//#endregion

//#region ---- INDEXER MAIN ---- 
	
	indexRecord = function(id, record, config, callback) {
		// index record (transaction version)
		var self = this;
		
		// if no transactions, or transaction already in progress, jump to original func
		if (!this.transactions || this.currentTransactionPath) {
			return this._indexRecord(id, record, config, function(err, state) {
				if (err) self.logError('index', "Indexing failed on record: " + id + ": " + err);
				callback(err, state);
			});
		}
		
		// use base path for transaction lock
		var path = config.base_path;
		
		// here we go
		this.beginTransaction(path, function(err, clone) {
			// transaction has begun
			// call _indexRecord on CLONE (transaction-aware storage instance)
			clone._indexRecord(id, record, config, function(err, state) {
				if (err) {
					// index generated an error
					self.logError('index', "Indexing failed on record: " + id + ": " + err);
					
					// emergency abort, rollback
					self.abortTransaction(path, function() {
						// call original callback with error that triggered rollback
						if (callback) callback( err );
					}); // abort
				}
				else {
					// no error, commit transaction
					self.commitTransaction(path, function(err) {
						if (err) {
							// commit failed, trigger automatic rollback
							self.abortTransaction(path, function() {
								// call original callback with commit error
								if (callback) callback( err );
							}); // abort
						} // commit error
						else {
							// success!  call original callback
							if (callback) callback(null, state);
						}
					}); // commit
				} // no error
			}); // _indexRecord
		}); // beginTransaction
	}
	
	validateIndexConfig = function(config) {
		// make sure index config is kosher
		// return false for success, or error on failure
		if (!config || !config.fields || !config.fields.length) {
			return( new Error("Invalid index configuration object.") );
		}
		if (findObject(config.fields, { _primary: 1 })) {
			return( new Error("Invalid index configuration key: _primary") );
		}
		
		// validate each field def
		for (var idx = 0, len = config.fields.length; idx < len; idx++) {
			var def = config.fields[idx];
			
			if (!def.id || !def.id.match(/^\w+$/)) {
				return( new Error("Invalid index field ID: " + def.id) );
			}
			if (def.id.match(/^(_id|_data|_sorters|constructor|__defineGetter__|__defineSetter__|hasOwnProperty|__lookupGetter__|__lookupSetter__|isPrototypeOf|propertyIsEnumerable|toString|valueOf|__proto__|toLocaleString)$/)) {
				return( new Error("Invalid index field ID: " + def.id) );
			}
			
			if (def.type && !this['prepIndex_' + def.type]) {
				return( new Error("Invalid index type: " + def.type) );
			}
			
			if (def.filter && !this['filterWords_' + def.filter]) {
				return( new Error("Invalid index filter: " + def.filter) );
			}
		} // foreach def
		
		// validate each sorter def
		if (config.sorters) {
			for (var idx = 0, len = config.sorters.length; idx < len; idx++) {
				var sorter = config.sorters[idx];
				
				if (!sorter.id || !sorter.id.match(/^\w+$/)) {
					return( new Error("Invalid index sorter ID: " + sorter.id) );
				}
				if (sorter.id.match(/^(_id|_data|_sorters|constructor|__defineGetter__|__defineSetter__|hasOwnProperty|__lookupGetter__|__lookupSetter__|isPrototypeOf|propertyIsEnumerable|toString|valueOf|__proto__|toLocaleString)$/)) {
					return( new Error("Invalid index sorter ID: " + sorter.id) );
				}
				if (sorter.type && !sorter.type.match(/^(string|number)$/)) {
					return( new Error("Invalid index sorter type: " + sorter.type) );
				}
			} // foreach sorter
		} // config.sorters
		
		return false; // no error
	}
	
	_indexRecord = function(id, record, config, callback) {
		// index record (internal)
		var self = this;
		this.logDebug(8, "Indexing record: " + id, record);
		
		var state = {
			id: id,
			config: config
		};
		
		// sanity checks
		if (!id) {
			if (callback) callback( new Error("Missing Record ID for indexing.") );
			return;
		}
		
		// make sure ID is a string, and has some alphanumeric portion
		id = '' + id;
		var normal_id = this.normalizeKey(id);
		if (!normal_id || !normal_id.match(/^\w/)) {
			if (callback) callback( new Error("Invalid Record ID for indexing: " + id) );
			return;
		}
		
		if (!record || !isaHash(record)) {
			if (callback) callback( new Error("Invalid record object for index.") );
			return;
		}
		
		// make sure we have a good config
		var err = this.validateIndexConfig(config);
		if (err) {
			if (callback) callback(err);
			return;
		}
		
		// generate list of fields based on available values in record
		// i.e. support partial updates by only passing in those fields
		var fields = [];
		
		config.fields.forEach( function(def) {
			var value = def.source.match(/^\//) ? lookupPath(def.source, record) : sub(def.source, record, true);
			if ((value === null) && ("default_value" in def)) value = def.default_value;
			if (value !== null) fields.push(def);
		} );
		
		if (!fields.length) {
			// nothing to index!
			this.logDebug(6, "Nothing to index, skipping entire record");
			if (callback) callback();
			return;
		}
		
		// start index and track perf
		var pf = this.perf.begin('index');
		
		// lock record (non-existent key, but it's record specific for the lock)
		this.lock( config.base_path + '/' + id, true, function() {
			
			// see if we've already indexed this record before
			self.get( config.base_path + '/_data/' + id, function(err, idx_data) {
				// check for fatal I/O error
				if (err && (err.code != 'NoSuchKey')) {
					self.unlock( config.base_path + '/' + id );
					pf.end();
					return callback(err);
				}
				
				if (!idx_data) {
					idx_data = {};
					state.new_record = true;
					
					// add special index for primary ID (just a hash -- new records only)
					fields.push({ _primary: 1 });
				}
				state.idx_data = idx_data;
				state.changed = {};
				
				// walk all fields in parallel (everything gets enqueued anyway)
				each( fields,
					function(def, callback) {
						// process each index
						if (def._primary) {
							// primary id hash
							var opts = { page_size: config.hash_page_size || 1000 };
							self.hashPut( config.base_path + '/_id', id, 1, opts, callback );
							return;
						}
						
						var value = def.source.match(/^\//) ? lookupPath(def.source, record) : sub(def.source, record, true);
						if ((value === null) && ("default_value" in def)) value = def.default_value;
						if (typeof(value) == 'object') value = JSON.stringify(value);
						
						var words = self.getWordList( ''+value, def, config );
						var checksum = digestHex( words.join(' '), 'md5' );
						var data = { words: words, checksum: checksum };
						var old_data = idx_data[ def.id ];
						
						self.logDebug(9, "Preparing data for index: " + def.id, {
							value: value,
							words: words,
							checksum: checksum
						});
						
						if (def.delete) {
							// special mode: delete index data
							if (old_data) {
								state.changed[ def.id ] = 1;
								self.deleteIndex( old_data, def, state, callback );
							}
							else callback();
						}
						else if (old_data) {
							// index exists, check if data has changed
							if (checksum != old_data.checksum) {
								// must reindex
								state.changed[ def.id ] = 1;
								self.updateIndex( old_data, data, def, state, callback );
							}
							else {
								// data not changed, no action required
								self.logDebug(9, "Index value unchanged, skipping: " + def.id);
								callback();
							}
						}
						else {
							// index doesn't exist for this record, create immediately
							state.changed[ def.id ] = 1;
							self.writeIndex( data, def, state, callback );
						}
					}, // iterator
					function(err) {
						// everything indexed
						if (err) {
							self.unlock( config.base_path + '/' + id );
							pf.end();
							if (callback) callback(err);
							return;
						}
						
						// now handle the sorters
						eachLimit( config.sorters || [], self.concurrency,
							function(sorter, callback) {
								if (sorter.delete) self.deleteSorter( id, sorter, state, callback );
								else self.updateSorter( record, sorter, state, callback );
							},
							function(err) {
								// all sorters sorted
								// save idx data for record
								self.put( config.base_path + '/_data/' + id, idx_data, function(err) {
									if (err) {
										self.unlock( config.base_path + '/' + id );
										pf.end();
										if (callback) callback(err);
										return;
									}
									
									var elapsed = pf.end();
									
									if (!err) self.logTransaction('index', config.base_path, {
										id: id,
										elapsed_ms: elapsed
									});
									
									self.unlock( config.base_path + '/' + id );
									if (callback) callback(err, state);
								} ); // put (_data)
							}
						); // eachLimit (sorters)
					} // done with fields
				); // each (fields)
			} ); // get (_data)
		} ); // lock
	}
	
	unindexRecord = function(id, config, callback) {
		// unindex record (transaction version)
		var self = this;
		
		// if no transactions, or transaction already in progress, jump to original func
		if (!this.transactions || this.currentTransactionPath) {
			return this._unindexRecord(id, config, callback);
		}
		
		// use base path for transaction lock
		var path = config.base_path;
		
		// here we go
		this.beginTransaction(path, function(err, clone) {
			// transaction has begun
			// call _unindexRecord on CLONE (transaction-aware storage instance)
			clone._unindexRecord(id, config, function(err, state) {
				if (err) {
					// index generated an error
					// emergency abort, rollback
					self.abortTransaction(path, function() {
						// call original callback with error that triggered rollback
						if (callback) callback( err );
					}); // abort
				}
				else {
					// no error, commit transaction
					self.commitTransaction(path, function(err) {
						if (err) {
							// commit failed, trigger automatic rollback
							self.abortTransaction(path, function() {
								// call original callback with commit error
								if (callback) callback( err );
							}); // abort
						} // commit error
						else {
							// success!  call original callback
							if (callback) callback(null, state);
						}
					}); // commit
				} // no error
			}); // _unindexRecord
		}); // beginTransaction
	}
	
	_unindexRecord = function(id, config, callback) {
		// unindex record (internal)
		var self = this;
		this.logDebug(8, "Unindexing record: " + id);
		
		var state = {
			id: id,
			config: config
		};
		
		// sanity checks
		if (!id) {
			if (callback) callback( new Error("Invalid ID for record index.") );
			return;
		}
		
		// make sure we have a good config
		var err = this.validateIndexConfig(config);
		if (err) {
			if (callback) callback(err);
			return;
		}
		
		// copy fields so we can add the special primary one
		var fields = [];
		for (var idx = 0, len = config.fields.length; idx < len; idx++) {
			fields.push( config.fields[idx] );
		}
		
		// add special index for primary ID (just a hash)
		fields.push({ _primary: 1 });
		
		// start unindex and track perf
		var pf = this.perf.begin('unindex');
		
		// lock record (non-existent key, but it's record specific for the lock)
		this.lock( config.base_path + '/' + id, true, function() {
			
			// see if we've indexed this record before
			self.get( config.base_path + '/_data/' + id, function(err, idx_data) {
				// check for error
				if (err) {
					self.unlock( config.base_path + '/' + id );
					pf.end();
					return callback(err);
				}
				
				state.idx_data = idx_data;
				state.changed = {};
				
				// walk all fields in parallel (everything gets enqueued anyway)
				each( fields,
					function(def, callback) {
						// primary id hash
						if (def._primary) {
							self.hashDelete( config.base_path + '/_id', id, callback );
							return;
						}
						
						// check if index exists
						var data = idx_data[ def.id ];
						
						if (data) {
							// index exists, proceed with delete
							state.changed[ def.id ] = 1;
							self.deleteIndex( data, def, state, callback );
						}
						else callback();
					},
					function(err) {
						// everything unindexed
						if (err) {
							self.unlock( config.base_path + '/' + id );
							pf.end();
							if (callback) callback(err);
							return;
						}
						
						// delete main idx data record
						self.delete( config.base_path + '/_data/' + id, function(err) {
							if (err) {
								self.unlock( config.base_path + '/' + id );
								pf.end();
								if (callback) callback(err);
								return;
							}
							
							// now handle the sorters
							eachLimit( config.sorters || [], self.concurrency,
								function(sorter, callback) {
									self.deleteSorter( id, sorter, state, callback );
								},
								function(err) {
									// all sorters sorted
									var elapsed = pf.end();
									
									if (!err) self.logTransaction('unindex', config.base_path, {
										id: id,
										elapsed_ms: elapsed
									});
									
									self.unlock( config.base_path + '/' + id );
									if (callback) callback(err, state);
								}
							); // eachLimit (sorters)
						} ); // delete (_data)
					} // done (fields)
				); // each (fields)
			} ); // get (_data)
		} ); // lock
	}
	
	writeIndex = function(data, def, state, callback) {
		// create or update single field index
		var self = this;
		var words = data.words;
		
		// check for custom index prep function
		if (def.type) {
			var func = 'prepIndex_' + def.type;
			if (self[func]) {
				var result = self[func]( words, def, state );
				if (result === false) {
					if (callback) {
						callback( new Error("Invalid data for index: " + def.id + ": " + words.join(' ')) );
					}
					return;
				}
				data.words = words = result;
			}
		}
		
		this.logDebug(9, "Indexing field: " + def.id + " for record: " + state.id, words);
		
		var base_path = state.config.base_path + '/' + def.id;
		var word_hash = this.getWordHashFromList( words );
		
		// first, save idx record (word list and checksum)
		state.idx_data[ def.id ] = data;
		
		// word list may be empty
		if (!words.length && !def.master_list) {
			self.logDebug(9, "Word list is empty, skipping " + def.id + " for record: " + state.id);
			if (callback) callback();
			return;
		}
		
		// now index each unique word
		var group = {
			count: numKeys(word_hash),
			callback: callback || null
		};
		
		// lock index for this
		self.lock( base_path, true, function() {
			// update master list if applicable
			if (def.master_list) {
				group.count++;
				self.indexEnqueue({
					action: 'custom', 
					label: 'writeIndexSummary',
					handler: self.writeIndexSummary.bind(self),
					def: def,
					group: group,
					base_path: base_path,
					word_hash: word_hash
				});
			} // master_list
			
			for (var word in word_hash) {
				var value = word_hash[word];
				var path = base_path + '/word/' + word;
				
				self.indexEnqueue({
					action: 'custom', 
					label: 'writeIndexWord',
					handler: self.writeIndexWord.bind(self),
					hash_page_size: state.config.hash_page_size || 1000,
					// config: state.config,
					group: group,
					word: word,
					id: state.id,
					base_path: base_path,
					path: path,
					value: value
				});
			} // foreach word
			
		} ); // lock
	}
	
	writeIndexWord = function(task, callback) {
		// index single word, invoked from storage queue
		var self = this;
		var opts = { page_size: task.hash_page_size || 1000, word: task.word };
		
		this.logDebug(10, "Indexing word: " + task.path + " for record: " + task.id);
		
		this.hashPut( task.path, task.id, task.value, opts, function(err) {
			if (err) {
				// this will bubble up at the end of the group
				task.group.error = "Failed to write index data: " + task.path + ": " + err.message;
				self.logError('index', task.group.error);
			}
			
			// check to see if we are the last task in the group
			task.group.count--;
			if (!task.group.count) {
				// group is complete, unlock and fire secondary callback if applicable
				self.unlock(task.base_path);
				if (task.group.callback) task.group.callback(task.group.error);
			} // last item in group
			
			// queue callback
			callback();
		} ); // hashPut
	}
	
	writeIndexSummary = function(task, callback) {
		// index summary of words (record counts per word), invoked from storage queue
		var self = this;
		this.logDebug(10, "Updating summary index: " + task.base_path);
		
		var path = task.base_path + '/summary';
		var word_hash = task.word_hash;
		
		this.lock( path, true, function() {
			// locked
			self.get( path, function(err, summary) {
				if (err && (err.code != 'NoSuchKey')) {
					// serious I/O error, need to bubble this up
					task.group.error = "Failed to get index summary data: " + path + ": " + err.message;
					self.logError('index', task.group.error);
				}
				if (err || !summary) {
					summary = { id: task.def.id, values: {} };
				}
				summary.values = copyHashRemoveProto( summary.values );
				summary.modified = timeNow(true);
				
				for (var word in word_hash) {
					if (!summary.values[word]) summary.values[word] = 0;
					summary.values[word]++;
				} // foreach word
				
				// save summary back to storage
				self.put( path, summary, function(err) {
					self.unlock( path );
					if (err) {
						// this will bubble up at the end of the group
						task.group.error = "Failed to write index summary data: " + path + ": " + err.message;
						self.logError('index', task.group.error);
					}
					
					// check to see if we are the last task in the group
					task.group.count--;
					if (!task.group.count) {
						// group is complete, unlock and fire secondary callback if applicable
						self.unlock(task.base_path);
						if (task.group.callback) task.group.callback(task.group.error);
					} // last item in group
					
					// queue callback
					callback();
					
				} ); // put
			} ); // get
		} ); // lock
	}
	
	deleteIndex = function(data, def, state, callback) {
		// delete index
		// this must be sequenced before a reindex
		var self = this;
		var words = data.words;
		
		// check for custom index prep delete function
		if (def.type) {
			var func = 'prepDeleteIndex_' + def.type;
			if (self[func]) {
				self[func]( words, def, state );
			}
		}
		
		this.logDebug(9, "Unindexing field: " + def.id + " for record: " + state.id, words);
		
		var base_path = state.config.base_path + '/' + def.id;
		var word_hash = this.getWordHashFromList( words );
		
		// first, delete idx record (word list and checksum)
		delete state.idx_data[ def.id ];
		
		// word list may be empty
		if (!words.length && !def.master_list) {
			self.logDebug(9, "Word list is empty, skipping " + def.id + " for record: " + state.id);
			if (callback) callback();
			return;
		}
		
		// now unindex each unique word
		var group = {
			count: numKeys(word_hash),
			callback: callback || null
		};
		
		// lock index for this
		self.lock( base_path, true, function() {
			// update master list if applicable
			if (def.master_list) {
				group.count++;
				self.indexEnqueue({
					action: 'custom', 
					label: 'deleteIndexSummary',
					handler: self.deleteIndexSummary.bind(self),
					def: def,
					group: group,
					base_path: base_path,
					word_hash: word_hash
				});
			} // master_list
			
			for (var word in word_hash) {
				var path = base_path + '/word/' + word;
				
				self.indexEnqueue({
					action: 'custom', 
					label: 'deleteIndexWord',
					handler: self.deleteIndexWord.bind(self),
					group: group,
					word: word,
					id: state.id,
					base_path: base_path,
					path: path
				});
			} // foreach word
			
		} ); // lock
	}
	
	deleteIndexWord = function(task, callback) {
		// delete single word, invoked from storage queue
		var self = this;
		this.logDebug(10, "Unindexing word: " + task.path + " for record: " + task.id);
		
		this.hashDelete( task.path, task.id, true, function(err) {
			if (err) {
				var err_msg = "Failed to write index data: " + task.path + ": " + err.message;
				self.logError('index', err_msg);
				
				// check for fatal I/O
				if (err.code != 'NoSuchKey') {
					// this will bubble up at end
					task.group.error = err_msg;
				}
			}
			
			// check to see if we are the last task in the group
			task.group.count--;
			if (!task.group.count) {
				// group is complete, unlock and fire secondary callback if applicable
				self.unlock(task.base_path);
				if (task.group.callback) task.group.callback(task.group.error);
			} // last item in group
			
			// queue callback
			callback();
		} ); // hashDelete
	}
	
	deleteIndexSummary = function(task, callback) {
		// delete summary of words (record counts per word), invoked from storage queue
		var self = this;
		this.logDebug(10, "Removing words from summary index: " + task.base_path, task.word_hash);
		
		var path = task.base_path + '/summary';
		var word_hash = task.word_hash;
		
		this.lock( path, true, function() {
			// locked
			self.get( path, function(err, summary) {
				if (err && (err.code != 'NoSuchKey')) {
					// serious I/O error, need to bubble this up
					task.group.error = "Failed to get index summary data: " + path + ": " + err.message;
					self.logError('index', task.group.error);
				}
				if (err || !summary) {
					// index summary doesn't exist, huh
					self.logDebug(5, "Index summary doesn't exist: " + path);
					summary = { id: task.def.id, values: {} };
				}
				summary.values = copyHashRemoveProto( summary.values );
				summary.modified = timeNow(true);
				
				for (var word in word_hash) {
					if (summary.values[word]) summary.values[word]--;
					if (!summary.values[word]) delete summary.values[word];
				} // foreach word
				
				// save summary back to storage
				self.put( path, summary, function(err) {
					self.unlock( path );
					if (err) {
						// this will bubble up at the end of the group
						task.group.error = "Failed to write index summary data: " + path + ": " + err.message;
						self.logError('index', task.group.error);
					}
					
					// check to see if we are the last task in the group
					task.group.count--;
					if (!task.group.count) {
						// group is complete, unlock and fire secondary callback if applicable
						self.unlock(task.base_path);
						if (task.group.callback) task.group.callback(task.group.error);
					} // last item in group
					
					// queue callback
					callback();
					
				} ); // put
			} ); // get
		} ); // lock
	}
	
	updateIndex = function(old_data, new_data, def, state, callback) {
		// efficiently update single field index
		var self = this;
		var old_words = old_data.words;
		var new_words = new_data.words;
		
		// check for custom index prep function
		// we only need this on the new words
		if (def.type) {
			var func = 'prepIndex_' + def.type;
			if (self[func]) {
				var result = self[func]( new_words, def, state );
				if (result === false) {
					if (callback) {
						callback( new Error("Invalid data for index: " + def.id + ": " + new_words.join(' ')) );
					}
					return;
				}
				new_data.words = new_words = result;
			}
		}
		
		this.logDebug(9, "Updating Index: " + def.id + " for record: " + state.id, new_words);
		
		var base_path = state.config.base_path + '/' + def.id;
		var old_word_hash = this.getWordHashFromList( old_words );
		var new_word_hash = this.getWordHashFromList( new_words );
		
		// calculate added, changed and removed words
		var added_words = Object.create(null);
		var changed_words = Object.create(null);
		var removed_words = Object.create(null);
		
		for (var new_word in new_word_hash) {
			var new_value = new_word_hash[new_word];
			if (!(new_word in old_word_hash)) {
				// added new word
				added_words[new_word] = new_value;
			}
			if (new_value != old_word_hash[new_word]) {
				// also includes added, which is fine
				changed_words[new_word] = new_value;
			}
		}
		for (var old_word in old_word_hash) {
			if (!(old_word in new_word_hash)) {
				// word removed
				removed_words[old_word] = 1;
			}
		}
		
		// write idx record (word list and checksum)
		state.idx_data[ def.id ] = new_data;
		
		// now index each unique word
		var group = {
			count: numKeys(changed_words) + numKeys(removed_words),
			callback: callback || null
		};
		
		// lock index for this
		self.lock( base_path, true, function() {
			// update master list if applicable
			if (def.master_list) {
				if (numKeys(added_words) > 0) {
					group.count++;
					self.indexEnqueue({
						action: 'custom', 
						label: 'writeIndexSummary',
						handler: self.writeIndexSummary.bind(self),
						def: def,
						group: group,
						base_path: base_path,
						word_hash: added_words
					});
				}
				if (numKeys(removed_words) > 0) {
					group.count++;
					self.indexEnqueue({
						action: 'custom', 
						label: 'deleteIndexSummary',
						handler: self.deleteIndexSummary.bind(self),
						def: def,
						group: group,
						base_path: base_path,
						word_hash: removed_words
					});
				}
			} // master_list
			
			for (var word in changed_words) {
				var value = changed_words[word];
				var path = base_path + '/word/' + word;
				
				self.indexEnqueue({
					action: 'custom', 
					label: 'writeIndexWord',
					handler: self.writeIndexWord.bind(self),
					hash_page_size: state.config.hash_page_size || 1000,
					// config: state.config,
					group: group,
					word: word,
					id: state.id,
					base_path: base_path,
					path: path,
					value: value
				});
			} // foreach changed word
			
			for (var word in removed_words) {
				var path = base_path + '/word/' + word;
				
				self.indexEnqueue({
					action: 'custom', 
					label: 'deleteIndexWord',
					handler: self.deleteIndexWord.bind(self),
					group: group,
					word: word,
					id: state.id,
					base_path: base_path,
					path: path
				});
			} // foreach removed word
			
		} ); // lock
	}
	
	indexEnqueue = function(task) {
		// special index version of enqueue()
		// if we're in a transaction, call ORIGINAL enqueue() from parent
		// this is because index queue items must execute right away -- they CANNOT wait until commit()
		if (this.rawStorage) this.rawStorage.enqueue(task);
		else this.enqueue(task);
	}
	
	updateSorter = function(record, sorter, state, callback) {
		// add record to sorter index
		var config = state.config;
		
		var value = lookupPath(sorter.source, record);
		if ((value === null) && ("default_value" in sorter)) value = sorter.default_value;
		if (value === null) {
			if (state.new_record) value = ((sorter.type == 'number') ? 0 : '');
			else return callback();
		}
		
		// store value in idx_data as well
		if (!state.idx_data._sorters) state.idx_data._sorters = {};
		else if ((sorter.id in state.idx_data._sorters) && (value == state.idx_data._sorters[sorter.id])) {
			// sorter value unchanged, return immediately
			this.logDebug(10, "Sorter value unchanged, skipping write: " + sorter.id + ": " + state.id + ": " + value);
			return callback();
		}
		
		state.idx_data._sorters[sorter.id] = value;
		
		var path = config.base_path + '/' + sorter.id + '/sort';
		var opts = { page_size: config.sorter_page_size || 1000 };
		
		this.logDebug(10, "Setting value in sorter: " + sorter.id + ": " + state.id + ": " + value);
		this.hashPut( path, state.id, value, opts, callback );
	}
	
	deleteSorter = function(id, sorter, state, callback) {
		// remove record from sorter index
		var config = state.config;
		var path = config.base_path + '/' + sorter.id + '/sort';
		
		this.logDebug(10, "Removing record from sorter: " + sorter.id + ": " + id);
		this.hashDelete( path, id, function(err) {
			// only report actual I/O errors
			if (err && (err.code != 'NoSuchKey')) {
				return callback(err);
			}
			callback();
		} );
	}
	
	filterWords_markdown = function(value) {
		// filter out markdown syntax and html tags, entities
		value = value.replace(/\n\`\`\`(.+?)\`\`\`/g, ''); // fenced code
		return this.filterWords_html(value);
	}
	
	filterWords_html = function(value) {
		// filter out html tags, entities
		return decode( value.replace(/<.+?>/g, '') );
	}
	
	getWordList = function(value, def, config) {
		// clean and filter text down to list of alphanumeric words
		// return array of clean words
		if (def.filter && this['filterWords_' + def.filter]) {
			value = this['filterWords_' + def.filter]( value );
		}
		if (def.type && this['filterWords_' + def.type]) {
			value = this['filterWords_' + def.type]( value );
		}
		
		// more text cleanup
		if (!def.no_cleanup) {
			value = unidecode( value ); // convert unicode to ascii
			value = value.replace(/\w+\:\/\/([\w\-\.]+)\S*/g, '$1'); // index domains, not full urls
			value = value.replace(/\'/g, ''); // index nancy's as nancys
			value = value.replace(/\d+\.\d[\d\.]*/g, function(m) { return m.replace(/\./g, '_').replace(/_+$/, ''); }); // 2.5 --> 2_5
		}
		
		// special filter for firstname.lastname usernames
		if (def.username_join) {
			value = value.replace(/\w+\.\w[\w\.]*/g, function(m) { return m.replace(/\./g, '_').replace(/_+$/, ''); });
		}
		
		value = value.toLowerCase();
		
		var min_len = def.min_word_length || 1;
		var max_len = def.max_word_length || 255;
		var items = value.split(/\b/);
		var words = [];
		
		var remove_words = Object.create(null);
		if (def.use_remove_words && config.remove_words) {
			remove_words = this.cacheRemoveWords(config);
		}
		
		for (var idx = 0, len = items.length; idx < len; idx++) {
			var word = items[idx];
			if (word.match(/^\w+$/) && (word.length >= min_len) && (word.length <= max_len) && !remove_words[word]) {
				if (def.use_stemmer) word = stemmer(word);
				words.push( word );
			}
		}
		
		if (def.max_words && (words.length > def.max_words)) {
			words.splice( def.max_words );
		}
		
		return words;
	}
	
	getWordHashFromList = function(words) {
		// convert word list to hash of unique words and offset CSV
		var hash = Object.create(null);
		var word = '';
		
		for (var idx = 0, len = words.length; idx < len; idx++) {
			word = words[idx];
			if (word in hash) hash[word] += ','; else hash[word] = '';
			hash[word] += '' + Math.floor(idx + 1);
		} // foreach word
		
		return hash;
	}
	
	parseSearchQuery = function(value, config) {
		// parse search query string into array of criteria
		var criteria = [];
		var cur_index = config.default_search_field || '';
		
		this.logDebug(9, "Parsing simple search query: " + value);
		
		// basic pre-cleanup
		value = value.replace(/\s*\:\s*/g, ':');
		value = value.replace(/\s*\|\s*/g, '|');
		
		// escape literals (they will be re-unescaped below after splitting)
		value = value.replace(/\"(.+?)\"/g, function(m_all, m_g1) { return '"' + escape(m_g1) + '"'; } );
		
		var parts = value.split(/\s+/);
		
		for (var idx = 0, len = parts.length; idx < len; idx++) {
			var part = parts[idx];
			var crit = {};
			if (part.match(/^(\w+)\:(.+)$/)) {
				cur_index = RegExp.$1;
				part = RegExp.$2;
			}
			var def = findObject( config.fields, { id: cur_index || '_NOPE_' } );
			if (def) {
				if (part.match(/\|/)) {
					// piped OR list of values, must create sub-query
					crit.mode = 'or';
					crit.criteria = [];
					
					var pipes = part.split(/\|/);
					for (var idy = 0, ley = pipes.length; idy < ley; idy++) {
						var pipe = pipes[idy];
						
						var sub_words = this.getWordList(pipe, def, config);
						for (var idz = 0, lez = sub_words.length; idz < lez; idz++) {
							crit.criteria.push({ index: cur_index, word: sub_words[idz] });
						}
					}
					
					if (crit.criteria.length) criteria.push( crit );
				}
				else {
					crit.index = cur_index;
					
					part = part.replace(/^\+/, '');
					if (part.match(/^\-/)) {
						crit.negative = 1;
						part = part.replace(/^\-/, '');
					}
					if (part.match(/^\"(.+)\"$/)) {
						crit.literal = 1;
						part = unescape( RegExp.$1 );
						crit.words = this.getWordList(part, def, config);
					}
					else if (def.type) {
						// all defs with a 'type' are assumed to support ranges and lt/gt
						if (part.match(/^(.+)\.\.(.+)$/)) {
							// range between two values (inclusive)
							var low = RegExp.$1;
							var high = RegExp.$2;
							crit = {
								mode: 'and', 
								criteria: [
									{ index: cur_index, operator: ">=", word: low },
									{ index: cur_index, operator: "<=", word: high }
								]
							};
							criteria.push( crit );
						}
						else {
							// exact match or open-ended range
							var op = '=';
							if (part.match(/^(=|>=|>|<=|<)(.+)$/)) {
								op = RegExp.$1;
								part = RegExp.$2;
							}
							crit.operator = op;
							// crit.word = part;
							var words = this.getWordList(part, def, config);
							if (words.length) crit.word = words[0];
						}
					}
					else {
						var words = this.getWordList(part, def, config);
						if (words.length > 1) {
							crit.literal = 1;
							crit.words = words;
						}
						else if (words.length) crit.word = words[0];
					}
					
					if (crit.word || (crit.words && crit.words.length)) criteria.push( crit );
				}
			} // cur_index
		} // foreach part
		
		var query = { mode: 'and', criteria: criteria };
		
		this.logDebug(10, "Compiled search query:", query);
		return query;
	}
	
	parseGrammar = function(value, config) {
		// parse PxQL syntax, convert to native format
		var self = this;
		var parser = new Parser( Grammar.fromCompiled(pxql_grammar) );
		
		// pre-cleanup, normalize whitespace
		value = value.replace(/\s+/g, " ");
		
		this.logDebug(9, "Parsing PxQL search query: " + value);
		
		try {
			parser.feed( value );
		}
		catch (err) {
			return { err: err };
		}
		
		var query = parser.results[0];
		if (!query) {
			return { err: new Error("Failed to parse") };
		}
		if (!query.criteria && query.index) {
			// single criteria collapsed into parent
			query = { mode: 'and', criteria: [ query ] };
		}
		if (!query.criteria || !query.criteria.length) {
			return { err: new Error("Failed to parse") };
		}
		delete query.err;
		
		// apply post-processing for exact phrases, remove words
		var processCriteria = function(criteria) {
			// walk array, recurse for inner sub-queries
			criteria.forEach( function(crit) {
				if (query.err) return;
				
				if (crit.word) {
					// standard word query
					var def = findObject( config.fields, { id: crit.index || '_NOPE_' } );
					if (def) {
						var words = self.getWordList(crit.word, def, config);
						if (words.length > 1) {
							// literal multi-word phrase
							crit.words = words;
							crit.literal = 1;
							delete crit.word;
						}
						else if (words.length == 1) {
							// single word match
							crit.word = words[0];
						}
						else {
							// all words were removed
							// not technically an error, but this clause needs to be skipped
							self.logDebug(9, "All words removed from criteron: " + crit.word, crit);
							crit.skip = 1;
						}
					}
					else {
						query.err = new Error("Index not found: " + crit.index);
						return;
					}
				}
				if (crit.criteria && !query.err) processCriteria( crit.criteria );
			} );
		};
		
		processCriteria( query.criteria );
		return query;
	}
	
	weighCriterion = function(crit, config, callback) {
		// weigh single criterion for estimated memory usage
		var base_path = config.base_path + '/' + crit.index;
		var word = crit.word || crit.words[0];
		var path = base_path + '/word/' + word;
		
		// this doesn't work on ranged queries with typed columns, e.g. dates and numbers
		// as those use a master index for searching
		var def = findObject( config.fields, { id: crit.index } );
		if (def && def.type && crit.operator && crit.operator.match(/<|>/)) {
			crit.weight = 0;
			process.nextTick( function() { callback(); } );
			return;
		}
		
		this.hashGetInfo(path, function(err, hash) {
			if (hash && hash.length) crit.weight = hash.length;
			else crit.weight = 0;
			callback();
		});
	}
	
	searchRecords = function(query, config, callback) {
		// search fields (public API with shared lock on trans commit key)
		// this will block only if a transaction is currently committing
		var self = this;
		var path = config.base_path;
		var pf = this.perf.begin('search');
		
		var orig_query = query;
		if (typeof(query) == 'object') query = copyHash(query, true);
		
		this.shareLock( 'C|'+path, true, function(err, lock) {
			// got shared lock
			self._searchRecords( query, config, function(err, results, state) {
				// search complete
				if (!err) self.logTransaction('search', path, {
					query: orig_query,
					perf: state.perf ? state.perf.metrics() : {},
					results: (self.logEventTypes.search || self.logEventTypes.all) ? numKeys(results) : 0
				});
				
				self.shareUnlock( 'C|'+path );
				callback( err, results, state );
			} ); // search
		} ); // lock
	}
	
	_searchRecords = function(query, config, callback) {
		// search index for criteria, e.g. status:bug|enhancement assigned:jhuckaby created:2016-05-08
		// or main_text:google +style "query here" -yay status:open
		// return hash of matching record ids
		var self = this;
		
		// parse search string if required
		if (typeof(query) == 'string') {
			query = query.trim();
			
			if (query == '*') {
				// fetch all records
				this.logDebug(8, "Fetching all records: " + config.base_path);
				var apf = new Perf();
				apf.begin();
				apf.begin('all');
				
				return this.hashGetAll( config.base_path + '/_id', function(err, results) {
					// ignore error, just return empty hash
					apf.end('all');
					apf.end();
					callback( null, results || {}, { perf: apf } );
				} );
			}
			else if (query.match(/^\([\s\S]+\)$/)) {
				// PxQL syntax, parse grammar
				query = this.parseGrammar(query, config);
				if (query.err) {
					this.logError('index', "Invalid search query: " + query.err, query);
					return callback(query.err, null);
				}
			}
			else {
				// simple query syntax
				query = this.parseSearchQuery(query, config);
			}
		}
		
		if (!query.criteria || !query.criteria.length) {
			this.logError('index', "Invalid search query", query);
			return callback(null, {}, {});
		}
		
		this.logDebug(8, "Performing index search", query);
		
		var state = query;
		state.config = config;
		state.record_ids = Object.create(null);
		state.first = true;
		
		// track detailed perf of search operations
		if (!state.perf) {
			state.perf = new Perf();
			state.perf.begin();
		}
		
		// first, split criteria into subs (sub-queries), 
		// stds (standard queries) and negs (negative queries)
		var subs = [], stds = [], negs = [];
		for (var idx = 0, len = query.criteria.length; idx < len; idx++) {
			var crit = query.criteria[idx];
			if (crit.criteria) subs.push( crit );
			else {
				var def = findObject( config.fields, { id: crit.index } );
				if (!def) {
					this.logError('index', "Invalid search query: Index not found: " + crit.index, query);
					return callback(null, {}, state);
				}
				crit.def = def;
				
				if (crit.negative) negs.push( crit );
				else stds.push( crit );
			}
		}
		
		// stds need to be weighed and sorted by weight ascending
		var wpf = state.perf.begin('weigh');
		eachLimit( (query.mode == 'and') ? stds : [], this.concurrency,
			function(crit, callback) {
				self.weighCriterion(crit, config, callback);
			},
			function(err) {
				wpf.end();
				
				// sort stds by weight ascending (only needed in AND mode)
				if (query.mode == 'and') {
					stds = stds.sort( function(a, b) { return a.weight - b.weight; } );
				}
				
				// generate series of tasks, starting with any sub-queries,
				// then sorted weighed criteria, then negative criteria
				var tasks = [].concat( subs, stds, negs );
				eachSeries( tasks,
					function(task, callback) {
						task.perf = state.perf;
						
						if (task.criteria) {
							// sub-query	
							self._searchRecords( task, config, function(err, records) {
								state.perf.count('subs', 1);
								self.mergeIndex( state.record_ids, records, state.first ? 'or' : state.mode );
								state.first = false;
								callback();
							} );
						}
						else if (task.skip) {
							// skip this task (all words removed)
							process.nextTick( function() { callback(); } );
						}
						else if (task.def.type) {
							// custom index type, e.g. date, time, number
							var func = 'searchIndex_' + task.def.type;
							if (!self[func]) return callback( new Error("Unknown index type: " + task.def.type) );
							
							var cpf = state.perf.begin('search_' + task.def.id + '_' + task.def.type);
							self[func]( task, state, function(err) {
								cpf.end();
								state.perf.count(task.def.type + 's', 1);
								callback(err);
							} );
						}
						else if (task.literal) {
							// literal multi-word phrase
							var spf = state.perf.begin('search_' + task.def.id + '_literal');
							self.searchWordIndexLiteral(task, state, function(err) {
								spf.end();
								state.perf.count('literals', 1);
								callback(err);
							});
						}
						else {
							// single word search
							var spf = state.perf.begin('search_' + task.def.id + '_word');
							self.searchWordIndex(task, state, function(err) {
								spf.end();
								state.perf.count('words', 1);
								callback(err);
							});
						}
					},
					function(err) {
						// complete
						if (err) {
							self.logError('index', "Index search failed: " + err);
							state.record_ids = {};
							state.err = err;
						}
						self.logDebug(10, "Search complete", state.record_ids);
						callback(null, state.record_ids, copyHashRemoveKeys(state, { config:1, record_ids:1, first:1 }));
					}
				); // eachSeries (tasks)
			} // weigh done
		); // eachLimit (weigh)
	}
	
	searchWordIndex = function(query, state, callback) {
		// run one word query (single word against one index)
		var self = this;
		var config = state.config;
		var def = query.def;
		this.logDebug(10, "Running word query", query);
		
		var mode = state.first ? 'or' : state.mode;
		if (query.negative) mode = 'not';
		state.first = false;
		
		var path = config.base_path + '/' + def.id + '/word/' + query.word;
		var cur_items = state.record_ids;
		var new_items = Object.create(null);
		
		// query optimizations
		var num_cur_items = numKeys(cur_items);
		
		// if current items is empty and mode = and|not, we can exit early
		if (!num_cur_items && ((mode == 'and') || (mode == 'not'))) {
			process.nextTick( callback );
			return;
		}
		
		// Decide on row scan or hash merge:
		// If query weight (hash length) divided by page size is greater than num_cur_items
		// then it would probably be faster to apply the logic using _data getMulti (a.k.a row scan).
		// Otherwise, perform a normal hash merge (which has to read every hash page).
		var hash_page_size = config.hash_page_size || 1000;
		var wpf = state.perf.begin('word_' + query.word);
		
		if ((mode == 'and') && query.weight && (query.weight / hash_page_size > num_cur_items)) {
			this.logDebug(10, "Performing row scan on " + num_cur_items + " items", query);
			
			var record_ids = Object.keys( cur_items );
			var data_paths = record_ids.map( function(record_id) {
				return config.base_path + '/_data/' + record_id;
			} );
			
			var rspf = state.perf.begin('row_scan');
			this.getMulti( data_paths, function(err, datas) {
				rspf.end();
				if (err) return callback(err);
				
				datas.forEach( function(data, idx) {
					var record_id = record_ids[idx];
					if (!data || !data[def.id] || !data[def.id].words || (data[def.id].words.indexOf(query.word) == -1)) {
						delete cur_items[record_id];
					}
				} );
				
				state.perf.count('rows_scanned', datas.length);
				wpf.end();
				callback();
			} ); // getMulti
		} // row scan
		else {
			this.logDebug(10, "Performing '" + mode + "' hash merge on " + num_cur_items + " items", query);
			
			var hmpf = state.perf.begin('hash_merge');
			this.hashEachPage( path,
				function(items, callback) {
					switch (mode) {
						case 'and':
							for (var key in items) {
								if (key in cur_items) new_items[key] = 1;
							}
						break;
						
						case 'or':
							for (var key in items) {
								cur_items[key] = 1;
							}
						break;
						
						case 'not':
							for (var key in items) {
								delete cur_items[key];
							}
						break;
					}
					state.perf.count('hash_pages', 1);
					callback();
				},
				function(err) {
					hmpf.end();
					wpf.end();
					if (mode == 'and') state.record_ids = new_items;
					callback(err);
				}
			);
		} // hash merge
	}
	
	searchWordIndexLiteral = function(query, state, callback) {
		// run literal search query (list of words which must be in sequence)
		var self = this;
		var def = query.def;
		this.logDebug(10, "Running literal word query", query);
		
		var mode = state.first ? 'or' : state.mode;
		if (query.negative) mode = 'not';
		state.first = false;
		
		var path_prefix = state.config.base_path + '/' + def.id + '/word/';
		var record_ids = state.record_ids;
		
		var temp_results = Object.create(null);
		var temp_idx = 0;
		
		eachSeries( query.words,
			function(word, callback) {
				// for each word, iterate over record ids
				var keepers = Object.create(null);
				var wpf = state.perf.begin('literal_' + word);
				
				self.hashEachSync( path_prefix + word,
					function(record_id, raw_value) {
						// instant rejection if temp_idx and record_id isn't already present
						if (temp_idx && !(record_id in temp_results)) return;
						
						var offset_list = raw_value.split(/\,/);
						var still_good = 0;
						
						for (var idx = offset_list.length - 1; idx >= 0; idx--) {
							var word_idx = parseInt( offset_list[idx] );
							
							if (temp_idx) {
								// Subsequent pass -- make sure offsets are +1
								var arr = temp_results[record_id];
								for (var idy = 0, ley = arr.length; idy < ley; idy++) {
									var elem = arr[idy];
									if (word_idx == elem + 1) {
										arr[idy]++;
										still_good = 1;
									}
								}
							} // temp_idx
							else {
								// First pass -- get word idx into temp_results
								if (!temp_results[record_id]) temp_results[record_id] = [];
								temp_results[record_id].push( word_idx );
								still_good = 1;
							}
						} // foreach word_idx
						
						if (!still_good) delete temp_results[record_id];
						else keepers[record_id] = 1;
					},
					function(err) {
						wpf.end();
						// If in a subsequent word pass, make sure all temp_results
						// ids are still matched in the latest word
						if (temp_idx > 0) self.mergeIndex( temp_results, keepers, 'and' );
						temp_idx++;
						
						callback();
					}
				); // hashEachSync (word)
			},
			function(err) {
				// all done, now merge data into record ids
				for (var record_id in temp_results) {
					temp_results[record_id] = 1; // cleanup values
				}
				
				self.mergeIndex( record_ids, temp_results, mode );
				callback(err);
			}
		);
	}
	
	mergeIndex = function(record_ids, dbh, mode) {
		// Merge record ID keys from index subnode into hash
		switch (mode || 'or') {
			case 'and':
				for (var key in record_ids) {
					if (!(key in dbh)) delete record_ids[key];
				}
			break;
			
			case 'not':
				for (var key in dbh) {
					delete record_ids[key];
				}
			break;
			
			case 'or':
				for (var key in dbh) {
					record_ids[key] = dbh[key];
				}
			break;
		}
	}
	
	sortRecords = function(record_hash, sorter_id, sort_dir, config, callback) {
		// sort records by sorter index
		var self = this;
		if (!sort_dir) sort_dir = 1;
		
		if (self.debugLevel(8)) {
			self.logDebug(8, "Sorting " + numKeys(record_hash) + " records by " + sorter_id + " (" + sort_dir + ")", {
				path: config.base_path
			});
		}
		
		var sorter = findObject( config.sorters, { id: sorter_id } );
		if (!sorter) return callback( new Error("Cannot find sorter: " + sorter_id) );
		
		// apply sort values to record hash
		var path = config.base_path + '/' + sorter.id + '/sort';
		var sort_pairs = [];
		var pf = this.perf.begin('sort');
		
		this.hashEachPage( path, 
			function(items, callback) {
				for (var key in items) {
					if (key in record_hash) {
						sort_pairs.push([ key, items[key] ]);
					}
				}
				callback();
			},
			function() {
				// setup comparator function
				var comparator = (sorter.type == 'number') ?
					function(a, b) { return (a[1] - b[1]) * sort_dir; } :
					function(a, b) { return a[1].toString().localeCompare( b[1] ) * sort_dir; };
				
				// now we can sort
				sort_pairs.sort( comparator );
				
				// copy ids back to simple array
				var record_ids = [];
				for (var idx = 0, len = sort_pairs.length; idx < len; idx++) {
					record_ids.push( sort_pairs[idx][0] );
				}
				
				var elapsed = pf.end();
				self.logTransaction('sort', config.base_path, {
					sorter_id: sorter_id,
					sorter_type: sorter.type || 'string',
					sort_dir: sort_dir,
					elapsed_ms: elapsed,
					records: record_ids.length
				});
				
				self.logDebug(8, "Sort complete, returning results");
				callback( null, record_ids, sort_pairs, comparator );
			}
		); // hashEachPage
	}
	
	getFieldSummary = function(id, config, callback) {
		// get field summary for specified field
		this.get( config.base_path + '/' + id + '/summary', function(err, data) {
			if (err) return callback(err);
			if (!data) return callback( new Error("Index field not found: " + config.base_path + '/' + id) );
			if (!data.values) data.values = {};
			data.values = copyHashRemoveProto( data.values );
			callback( null, data.values );
		} );
	}
	
	cacheRemoveWords = function(config) {
		// cache remove words in hash for speed
		if (!this.removeWordCache) this.removeWordCache = {};
		
		if (this.removeWordCache[config.base_path]) {
			return this.removeWordCache[config.base_path];
		}
		
		// build cache
		var cache = Object.create(null);
		this.removeWordCache[config.base_path] = cache;
		
		for (var idx = 0, len = config.remove_words.length; idx < len; idx++) {
			cache[ config.remove_words[idx] ] = 1;
		}
		
		return cache;
	}
//#endregion
	
}

