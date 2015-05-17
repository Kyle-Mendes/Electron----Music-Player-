'use strict';

var ipc = require('ipc');
var fs = require('fs');

angular.module('myApp.directives', [])
.directive('directory', ['$rootScope', function($rootScope) {

	return {
		restrict: 'E',
		templateUrl: 'templates/directory.html',
		link: function (scope, elem, atr) {

			/**
			 * Listeners that get responses from Node and interpret them.
			 */
			ipc.on('directory-structure', function(payload) {
				scope.directoryStructure = payload;
				scope.$apply();
			});

			ipc.on('new-working-directory', function(payload) {
				$rootScope.workingDirectory = payload;
			});

			/**
			 * Directive functions
			 */
			function getDirectoryStructure() {
				ipc.send('get-directory-structure');
			};

			function changeDirectory(directory) {
				ipc.send('change-directory', directory);
			};

			scope.interpretClick = function(asset) {
				fs.stat($rootScope.workingDirectory + "/" + asset, function(err, stats) {
					if (stats.isDirectory()) {
						changeDirectory(asset);
					} else if (stats.isFile()) {
						$rootScope.$broadcast('play-song', asset);
					}
				});
			}

			scope.parentDirectory = function() {
				changeDirectory('../');
			}


			getDirectoryStructure();
		}
	}
}]);

