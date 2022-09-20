#!/usr/bin/env node

// Simple Unit Test Runner
// Copyright (c) 2015 - 2018 Joseph Huckaby
// Released under the MIT License

// test runner version
let version = '2.0.0'

import { statSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";

import { eachSeries, eachLimit } from "async";
import chalk from "chalk";
let { level, bold, gray } = chalk
import Args from "./args.mjs";
import { require, timeNow, commify, getTextFromSeconds, shortFloat } from "./tools.mjs";
import { progress as _progress } from './cli.mjs'

/**
 * run unit test of each test class in array
 * @param {[{ new(): Class }]} tests 
 */
export default function unitTest(tests) {    

    // shift files off beginning of arg array
    var argv = JSON.parse(JSON.stringify(process.argv.slice(2)));
    var paths = [];
    while (argv.length && !argv[0].match(/^\-/)) {
        paths.push(resolve(argv.shift()));
    }

    // now parse rest of cmdline args, if any
    var args = new Args(argv, {
        threads: 1,
        verbose: 0,
        quiet: 0,
        color: 1,
        fatal: 0,
        output: ''
    });
    args = args.get(); // simple hash

    // color support?
    if (!args.color) chalk.level = 0


    // setup progress bar
    var progress = {
        active: false,

        start: function () {
            if (args.verbose) return;
            _progress.start();
            this.active = true;
        },
        update: function (amount) {
            if (!this.active || args.verbose) return;
            _progress.update(amount);
        },
        hide: function () {
            if (!this.active || args.verbose) return;
            _progress.erase();
        },
        show: function () {
            if (!this.active || args.verbose) return;
            _progress.draw();
        },
        end: function () {
            if (!this.active || args.verbose) return;
            _progress.end();
            this.active = false;
        }
    };

    var print = function (msg) {
        // print message to console
        if (!args.quiet) {
            progress.hide();
            process.stdout.write(msg);
            progress.show();
        }
    };
    var verbose = function (msg) {
        // print only in verbose mode
        if (args.verbose) print(msg);
    };
    var pct = function (amount, total) {
        // printable percent number
        if (!amount) amount = 0;
        if (!total) total = 1;
        return '' + Math.floor((amount / total) * 100) + '%';
    };

    let files = tests.map(e => e.name)

    print("\n" + bold.magenta("Simple Unit Test Runner v" + version) + "\n");
    print(gray((new Date()).toLocaleString()) + "\n");

    print("\n" + gray("Args: " + JSON.stringify(args)) + "\n");
    print(gray("Suites: " + JSON.stringify(files)) + "\n");

    var stats = {
        tests: 0,
        asserts: 0,
        passed: 0,
        failed: 0,
        errors: [],
        time_start: timeNow()
    };

    // -------------- MAIN PROC ------------------

    // iterate over files
    eachSeries(tests,
        function (test, callback) {
            // run each suite
            let suite = new test() 
            let file = suite.__name || test.name

            print("\n" + bold.yellow("Suite: " + file) + "\n");
            progress.start({
                catchInt: true,
                catchTerm: true,
                catchCrash: true,
                exitOnSig: true
            });

            // load js file and grab tests

            suite.args = args;
            suite.stats = stats;

            // stub out setUp and tearDown if not defined
            if (!suite.setUp) suite.setUp = function (callback) { callback(); };
            if (!suite.tearDown) suite.tearDown = function (callback) { callback(); };

            // setUp
            suite.setUp(function () {

                // execute tests
                eachLimit(suite.tests, args.threads,
                    function (test_func, callback) {
                        // execute single test
                        stats.tests++;
                        var test_name = test_func.testName || test_func.name || ("UnnamedTest" + stats.tests);

                        var test = {
                            file: file,
                            name: test_name,
                            expected: 0,
                            asserted: 0,
                            passed: 0,
                            failed: 0,
                            completed: false,

                            expect: function (num) {
                                this.expected = num;
                            },
                            assert: function (fact, msg, data) {
                                this.asserted++;
                                if (fact) {
                                    this.passed++;
                                    verbose('.');
                                }
                                else {
                                    this.failed++;
                                    verbose("F\n");
                                    if (!msg) msg = "(No message)";
                                    print("\n" + bold.red("Assert Failed: " + file + ": " + test_name + ": " + msg) + "\n");
                                    if (typeof (data) != 'undefined') {
                                        print(gray(bold("Data: ") + JSON.stringify(data)) + "\n");
                                    }
                                    stats.errors.push("Assert Failed: " + file + ": " + test_name + ": " + msg);
                                    if (args.verbose || args.fatal) {
                                        print("\n" + (new Error("Stack Trace:")).stack + "\n\n");
                                    }
                                    if (suite.onAssertFailure) {
                                        suite.onAssertFailure(test, msg, data);
                                    }
                                    if (args.fatal) {
                                        progress.end();
                                        if (args.die) process.exit(1); // die without tearDown
                                        suite.tearDown(function () { process.exit(1); });
                                    }
                                }
                            },
                            done: function () {
                                if (this.timer) clearTimeout(this.timer);
                                if (this.completed) {
                                    var msg = "Error: test.done() called twice: " + file + ": " + test_name;
                                    print(bold.red(msg) + "\n");
                                    stats.errors.push(msg);
                                    if (args.fatal) {
                                        progress.end();
                                        if (args.die) process.exit(1); // die without tearDown
                                        suite.tearDown(function () { process.exit(1); });
                                        return;
                                    }
                                }
                                this.completed = true;

                                progress.update(stats.tests / suite.tests.length);
                                stats.asserts += this.asserted;

                                if (this.expected && (this.asserted != this.expected)) {
                                    // wrong number of assertions
                                    this.failed++;
                                    verbose("F\n");
                                    var msg = "Error: Wrong number of assertions: " + file + ": " + test_name + ": " +
                                        "Expected " + this.expected + ", Got " + this.asserted + ".";
                                    print(bold.red(msg) + "\n");
                                    stats.errors.push(msg);
                                    if (args.fatal) {
                                        progress.end();
                                        if (args.die) process.exit(1); // die without tearDown
                                        suite.tearDown(function () { process.exit(1); });
                                        return;
                                    }
                                }
                                if (!this.failed) {
                                    // test passed
                                    stats.passed++;
                                    verbose(bold.green("✓ " + test_name) + "\n");
                                }
                                else {
                                    // test failed
                                    stats.failed++;
                                    print(bold.red("X " + test_name) + "\n");
                                }

                                if (suite.afterEach) suite.afterEach(this);
                                // callback();
                                process.nextTick(callback);
                            }, // done
                            verbose: function (msg, data) {
                                // log verbose message and data
                                verbose(bold.gray(msg) + "\n");
                                if (typeof (data) != 'undefined') {
                                    verbose(gray(JSON.stringify(data)) + "\n");
                                }
                            },
                            fatal: function (msg, data) {
                                // force a fatal error and immediate shutdown
                                args.fatal = true;
                                args.verbose = true;
                                this.verbose(msg, data);
                                this.assert(false, msg);
                            },
                            timeout: function (msec) {
                                // set a timeout for the test to complete
                                var self = this;
                                this.timer = setTimeout(function () {
                                    delete self.timer;
                                    self.ok(false, "Error: Maximum time exceeded for test (" + msec + " ms)");
                                    self.done();
                                }, msec);
                            }
                        }; // test object

                        // convenience, to better simulate nodeunit and others
                        test.ok = test.assert;
                        test.debug = test.verbose;

                        // invoke test
                        var runTest = function () {
                            verbose("Running test: " + test.name + "...\n");
                            if (suite.beforeEach) suite.beforeEach(test);
                            test_func.apply(suite, [test]);
                        };
                        if (args.delay) {
                            setTimeout(runTest, parseFloat(args.delay) * 1000);
                        }
                        else runTest();
                    },
                    function () {
                        // all tests complete in suite
                        progress.end();
                        suite.tearDown(function () {
                            callback();
                        }); // tearDown
                    } // all tests complete
                ); // each test

            }); // setUp
        },
        function () {
            // all suites complete
            stats.time_end = timeNow();
            stats.elapsed = stats.time_end - stats.time_start;
            stats.suites = files.length;
            stats.files = files;
            stats.args = args;

            print("\n");

            if (!stats.failed) {
                // all tests passed
                print(bold.green("✓ OK - All tests passed") + "\n");
            }
            else {
                print(bold.red("X - Errors occurred") + "\n");
                process.exitCode = 1;
            }

            // more stats
            var pass_color = stats.failed ? bold.yellow : bold.green;
            var fail_color = stats.failed ? bold.red : bold.gray;

            print("\n");
            print(pass_color("Tests passed: " + commify(stats.passed) + " of " + commify(stats.tests) + " (" + pct(stats.passed, stats.tests) + ")") + "\n");
            print(fail_color("Tests failed: " + commify(stats.failed) + " of " + commify(stats.tests) + " (" + pct(stats.failed, stats.tests) + ")") + "\n");
            print(gray("Assertions:   " + commify(stats.asserts)) + "\n");
            print(gray("Test Suites:  " + commify(stats.suites)) + "\n");

            if (stats.elapsed >= 61.0) {
                // 1 minute 1 second
                print(gray("Time Elapsed: " + getTextFromSeconds(stats.elapsed)) + "\n");
            }
            else {
                // 60.999 seconds
                print(gray("Time Elapsed: " + shortFloat(stats.elapsed) + " seconds") + "\n");
            }

            print("\n");

            // json file output
            if (args.output) {
                writeFileSync(args.output, JSON.stringify(stats));
            }
        }
    )

}