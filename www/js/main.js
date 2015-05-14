app.controller('main', function($scope, $q, popcorn, $timeout, $ionicPopup, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
	$scope.call = function(cmd, param, cb) {
		popcorn.call(cmd, cb, param);
	};
	
	$scope.refreshBGImage = function() {
		popcorn.call('getselection', function(data) {
			$scope.episode = data ? data.selectedEpisode : null;
			var src = null;
			if(data && data.image) src = data.image;
			if(data && data.images && data.images.poster) src = data.images.poster;
			document.getElementById('content').style.backgroundImage = src ? 'url(' + src + ')' : '';
		});
	};
	
	$scope.slideHasChanged = function(n) {
		//
	};
	
	$scope.settings = function(params) {
		
		$scope.storage = {
			host: localStorage.getItem('popcorn-time-host') || 'localhost',
			port: localStorage.getItem('popcorn-time-port') || 8008,
			user: localStorage.getItem('popcorn-time-user') || 'popcorn',
			pass: localStorage.getItem('popcorn-time-pass') || 'popcorn'
		};
		
		var ask = function(name, prop, cb) {
			$ionicPopup.show({
				title: 'Settings',
				subTitle: name,
				scope: $scope,
				template: '<input type="text" ng-model="storage.' + prop + '">',
				buttons: [{
					text: '<b>OK</b>',
					type: 'button-positive'
				}]
			}).then(function() {
				localStorage.setItem('popcorn-time-' + prop, $scope.storage[prop]);
				cb();
			});
		};
		
		ask('Hostname', 'host', function() {
			ask('Port', 'port', function() {
				ask('Username', 'user', function() {
					ask('Password', 'pass', function() {
					});
				});
			});
		});
		
	};
	
	var playing = function() {
		return $q(function(resolve) {
			popcorn.call('getplaying', function(data) {
				resolve(data);
			});
		});
	};
	
	$scope.movie = null;
	$scope.episode = null;
	$scope.volume = -1;
	
	$scope.values = {
		'genres': [],
		'sorters': [],
		'types': []
	}
	
	$scope.sortName = function(s) {
		return {
			'popularity': 'Popularity',
			'last added': 'Last Added',
			'year': 'Year',
			'rating': 'Rating',
			'title': 'Title',
		}[s];
	};
	
	var updateMovieInfo = function(firstTime) {
		if(firstTime) {
			popcorn.call('getgenres', function(data) {
				$scope.values.genres = data.genres;
			});
			popcorn.call('getsorters', function(data) {
				$scope.values.sorters = data.sorters;
			});
			popcorn.call('gettypes', function(data) {
				$scope.values.types = data.types;
			});
		}
		
		playing().then(function(data) {
			$scope.movie = data;
			$scope.$broadcast('movie-update', data);
			$scope.volume = Math.floor(data.volume * 100);
			if(firstTime && !data.streamUrl) {
				setTimeout(function(){
					$ionicSlideBoxDelegate.slide(1, 0);
				}, 1);
			}
		});
		$scope.refreshBGImage();
		setTimeout(updateMovieInfo, 1000);
	};
	updateMovieInfo(true);
	
	var lastVolUpdate = 0;
	$scope.volChange = function(vol) {
		if(vol) $scope.volume = vol;
		var now = Date.now();
		if(now > lastVolUpdate + 200 || !vol || vol == 0 || vol == 100) {
			lastVolUpdate = now;
			$scope.call('volume', [$scope.volume / 100]);
		}
	};
	
	$scope.playing = playing;
	
	$scope.$on('jumpto', function(evt, fraction) {
		var t = $scope.movie.duration * fraction;
		var delta = t - $scope.movie.currentTime;
		$scope.call('seek', [delta]);
	});
	
	$scope.playingClass = '';
	$scope.$watch('movie.playing', function(newValue, oldValue) {
		if(newValue) {
			$ionicSlideBoxDelegate.slide(0);
		}
		$scope.playingClass = newValue ? 'ion-pause' : 'ion-play';
	});
	
	$scope.start = function() {
		var delta = - $scope.movie.currentTime;
		$scope.call('seek', [delta]);
	}
	
	$scope.stream = function() {
		var url = $scope.movie.streamUrl;
		url = url.replace('127.0.0.1', '10.0.1.99');
		document.location = url;
	}
	
	$scope.left = function() {
		$scope.call($scope.episode ? 'previousseason' : 'left');
	};
	
	$scope.right = function() {
		$scope.call($scope.episode ? 'nextseason' : 'right');
	};
	
	$scope.term = '';
	
	$scope.clearsearch = function() {
		$scope.term = '';
		document.getElementById('search').value = '';
		$scope.call('clearsearch');
	};
	
	$scope.search = function(term) {
		document.getElementById('search').blur();
		if(term && term.length > 0) { 
			popcorn.call('filtersearch', null, [term]);
			return;
		}
		$scope.call('clearsearch');
	};
	
	$scope.currentGenre = 'All';
	$scope.appyGenre = function(genre) {
		popcorn.call('filtergenre', null, [genre]);
	};
	
	$scope.currentSort = 'popularity';
	$scope.applySort = function(sort) {
		popcorn.call('filtersorter', null, [sort]);
	};
	
	if(false) {
		popcorn.call('filtergenre', null, [$scope.currentGenre]);
		popcorn.call('filtersorter', null, [$scope.currentSort]);
	}
});