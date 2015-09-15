#!/usr/bin/env node
/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : meansfw
 *  File : generator.js
 *  Date : 9/14/15 8:46 PM
 *  Description :
 *
 */
'use strict';
var cli = require('cli');
var fs = require('fs-extra');
var path = require('path');

var REPO = "https://github.com/aksalj/meansfw.git";

var generatorDependencies = ["cli", "fs-extra"];

function checkPrerequisites(callback) {
    cli.info("Checking prerequisites...");

    // Check if the binaries exist by checking their versions.
    // HUH: Is there a cleaner/better way?

    cli.exec("git --version", function(stdout) {
        cli.ok(stdout);
        cli.exec("bower -v", function(stdout) {
            cli.ok("bower " + stdout);
            setTimeout(callback, 1000);
        }, function(err) {
            var cmd = '\x1B[36m\'sudo npm install -g bower\'\x1B[0m';
            cli.error("Bower not found; Please install by running " + cmd);
        });

    }, function(err) {
        var url = '\x1B[32m\'https://git-scm.com/downloads\'\x1B[0m';
        cli.error("Git not found; Please install from " + url);
    });

}

function downloadTemplate(dest, callback) {
    cli.info("Downloading template...");
    var cmd = "git clone " + REPO + " " + dest;
    cli.exec(cmd, callback, callback);
}

function updateTemplate(name, dest) {
    cli.info("Updating template...");

    // Update app package.json
    var pkgJSON = fs.readJsonSync(path.join(dest, "package.json"));
    cli.progress(0.3);
    pkgJSON.name = name;
    pkgJSON.version = "0.0.0";
    pkgJSON.description = "MEAN app";
    pkgJSON.keywords = [name, "meansfw"];
    pkgJSON.author = process.env.USER;

    // Delete generator dependencies & stuff
    delete pkgJSON.bin;
    delete pkgJSON.files;
    delete pkgJSON.preferGlobal;
    delete pkgJSON.homepage;
    delete pkgJSON.repository;
    delete pkgJSON.bugs;
    generatorDependencies.forEach(function (dep) {
        if (pkgJSON.dependencies.hasOwnProperty(dep)) {
            delete pkgJSON.dependencies[dep];
        }
    });
    cli.progress(0.35);

    fs.writeJsonSync(path.join(dest, "package.json"), pkgJSON);
    cli.progress(0.4);

    // Update app bower.json
    var bowerJSON = fs.readJsonSync(path.join(dest, "bower.json"));
    cli.progress(0.5);
    bowerJSON.name = name;
    bowerJSON.description = "MEAN app";
    bowerJSON.author = process.env.USER;
    fs.writeJsonSync(path.join(dest, "bower.json"), bowerJSON);
    cli.progress(0.6);

    // Update app config/default.json
    var defaultJSON = fs.readJsonSync(path.join(dest, "config/default.json"));
    cli.progress(0.7);
    defaultJSON.database.name = name;
    fs.writeJsonSync(path.join(dest, "config/default.json"), defaultJSON);
    cli.progress(0.8);

}

function installDependencies(dest, callback) {
    cli.info("Downloading dependencies...");

    // Clear git
    fs.removeSync(path.join(dest, ".git"));

    // Clean Generator & other bins
    fs.removeSync(path.join(dest, "bin"));

    // Install dependencies
    var cmd = "cd " + dest + " && npm install && bower install && git init . && git add . && git commit -m 'Initial commit'";
    cli.exec(cmd, callback, callback);
}

cli.parse({
    verbose: ["v", "verbose"]
});

cli.main(function (args, options) {

    // TODO:
    // Clone https://github.com/aksalj/meansfw.git into <myApp>
    // cd into <myApp>
    // Update package.json and bower.json with name <myApp>
    // Update config/default.json with db name <myApp>
    // npm install && bower install

    if (args.length === 0) {
        return cli.error("Invalid number of arguments");
    }

    var generate = function () {
        cli.spinner('Working...');
        cli.progress(0.0);

        var VERBOSE = options.verbose;
        var app = args[args.length - 1]; // Last arg should be app name
        var dest = path.join(process.cwd(), app);
        cli.ok("App Name: " + app);
        cli.ok("App folder: " + dest);

        cli.info("Checking app folder...");
        fs.remove(dest, function (err) { // Clear destination
            if (err) return cli.error(err);

            downloadTemplate(dest, function (err, stdout) {
                // FIXME: Need to check error!!
                if (VERBOSE) {
                    console.info(err);
                    console.info(stdout);
                }

                cli.progress(0.2);

                updateTemplate(app, dest);

                installDependencies(app, function (err, stdout) {
                    // FIXME: Need to check error!!
                    if (VERBOSE) {
                        console.info(err);
                        console.info(stdout);
                    }

                    cli.progress(1.0);
                    cli.spinner('Done!', true); //End the spinner
                });

            });

        });
    }

    checkPrerequisites(generate);

});
