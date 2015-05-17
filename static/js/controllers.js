/**
 * @TODO: Actually change working directory	
 *		  We might need to do the logic in node and then broadcast back to angular
 *		  Right now, need to preppend currentDirectory + "/" + file... this sucks.
 *
 * @TODO: Broadcast on song play.  Use electron to display banner notification about song.
 *
 * @TODO: Add settings
 */


'use strict';

angular.module('myApp.controllers', [])
	.controller('SiteCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

		var player = this;
		var nowPlaying = new Audio();
		getWorkingDirectory();

		function getWorkingDirectory() {
			ipc.send('get-working-directory');
			ipc.on('put-working-directory', function(directory) {
				$rootScope.workingDirectory = directory;
			});
		}

    /**
     * Event Listeners
     */
		window.onkeyup = function(e) {
			// console.log(e);
			// if(e.keyCode == 39) { player.AdvanceHour() }
			// if(e.keyCode == 37) { player.RegressHour() }
			if(e.keyCode == 32) { player.ToggleMusic() }
		}

		$rootScope.$on('play-song', function(e, song) {
			console.log(e, song);
			nowPlaying.src = $rootScope.workingDirectory + "/" + song;
			player.StartMusic();
		});




    /**
     * Player Commands
     */
		function Timer() {
			var date = new Date();

			$scope.hours = date.getHours();
			$scope.minutes = ('0'+date.getMinutes()).substr(-2,2)
			$scope.seconds = ('0'+date.getSeconds()).substr(-2,2)
			// $scope.$apply();

			setTimeout(function() {
				Timer();
			}, 1000);
		};

		player.StartMusic = function() {
			nowPlaying.play();
			nowPlaying.addEventListener('ended', function() { //Event listener needs to be removed when the audio is changed
			});
			nowPlaying.addEventListener('abort', function() { //Event listener needs to be removed when the audio is changed
				// nowPlaying.removeEventListener('ended', listener); // this isn't working
			});
		}

		player.ToggleMusic = function() {
			if (nowPlaying.paused) {
				nowPlaying.play();
			} else {
				nowPlaying.pause();
			}
		}

		Timer();
	}]);

