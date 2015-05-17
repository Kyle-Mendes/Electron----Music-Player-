'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

var ipc = require('ipc');
var fs = require('fs');
var async = require('async');

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;

/*
 * DIRECTORY MANAGEMENT
 */
ipc.on('get-working-directory', getWorkingDirectory);
ipc.on('get-directory-structure', getDirectoryStructure);
ipc.on('change-directory', function(e, directory) {
	changeDirectory(directory);
});

function getWorkingDirectory() {
	mainWindow.send('put-working-directory', process.cwd());
}

function getDirectoryStructure() {
	var directoryStructure = [];
	
	var files = fs.readdirSync(process.cwd());
	async.map(files, fs.stat, function(err, results) {
		for (var i = 0; i < files.length; i++) {
			if (results[i].isDirectory()) {
				directoryStructure.push({
					name: files[i],
					type: 'directory'
				});
			} else if (results[i].isFile()) {
				directoryStructure.push({
					name: files[i],
					type: 'file'
				});
			} else {
				directoryStructure.push({
					name: files[i],
					type: 'unknown'
				});
			}
		};
		mainWindow.send('directory-structure', directoryStructure);
	});
};

function changeDirectory(directory) {
	process.chdir(directory);
	mainWindow.send('new-working-directory', process.cwd())
	getDirectoryStructure();
}


app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 1000
	});

	mainWindow.loadUrl(`file://${__dirname}/index.html`);

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;
	});
});

