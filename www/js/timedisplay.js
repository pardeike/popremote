app.directive('timeDisplay', function(popcorn) {
	var chart = null;
	return {
		scope: {
			movie: '='
		},
		templateUrl: 'partials/time-display.html',
		link: function(scope, element, attrs) {
			scope.$on('movie-update', function(evt, movie) {
				if(!movie.streamUrl) {
					if(chart && !document.getElementById('chart')) {
						chart.destroy();
						chart = null;
					}
					return;
				}
				if(chart) {
					chart.segments[0].value = Math.floor(movie.currentTime);
					chart.segments[1].value = Math.floor(movie.duration - movie.currentTime);
					chart.update();
				} else {
					var canvas = document.getElementById('chart');
					if(canvas) {
						var selectCanvas = function(canvas, x, y) {
							var r = window.devicePixelRatio;
							var rx = (canvas.width / r) / 2;
							var ry = (canvas.height / r) / 2;
							var fraction = Math.atan2(x - rx, ry - y);
							fraction = fraction / (2 * Math.PI);
							if (fraction < 0) fraction = fraction + 1;
							popcorn.jumpto(fraction);
						};
						canvas.addEventListener('mousedown', function(evt) {
							var x = evt.pageX - canvas.getBoundingClientRect().left;
							var y = evt.pageY - canvas.getBoundingClientRect().top;
							selectCanvas(canvas, x, y);
						});
						canvas.addEventListener('touchstart', function(evt) {
							var x = evt.changedTouches[0].pageX - canvas.getBoundingClientRect().left;
							var y = evt.changedTouches[0].pageY - canvas.getBoundingClientRect().top;
							selectCanvas(canvas, x, y);
						});
						chart = new Chart(canvas.getContext("2d")).Doughnut([
						    {
						        value: Math.floor(movie.currentTime),
						        color: "rgba(255,255,255,0.4)"
						    },
						    {
						        value: Math.floor(movie.duration  - movie.currentTime),
						        color: "rgba(255,255,255,0.05)"
						    }
						], {
							segmentShowStroke : false,
							percentageInnerCutout : 50,
							animateRotate : false,
							animateScale : false,
							animationSteps : 10,
						});
					}
				}
			});
		},
		controller: function($scope, popcorn) {
			$scope.format = function(n) {
				return popcorn.toHHMMSS(Math.floor(n));
			};
		}
	};
});