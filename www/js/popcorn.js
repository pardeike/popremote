app.service('popcorn', function($http, $rootScope) {
	var host = '10.0.1.99';
	var api = {
		call: function(method, cb, params) {
			$http.post('http://' + host + ':8008', {
				params: params || [],
				id: 10,
				method: method,
				jsonrpc: '2.0'
			}).success(function(data, status, headers, config) {
				if(data.error) {
					console.log(data.error.message);
				} else {
					if(cb) cb(data.result);
				}
			}).error(function(data, status, headers, config) {
				if(data) console.log(data);
			});
		},
		jumpto: function(fraction) {
			$rootScope.$broadcast('jumpto', fraction);
		},
		toHHMMSS: function (sec_num) {
			if(sec_num >= 0) { 
				var hours = Math.floor(sec_num / 3600);
				var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
				var seconds = sec_num - (hours * 3600) - (minutes * 60);
	
				if (hours < 10) { hours = "0" + hours; }
				if (minutes < 10) { minutes = "0" + minutes; }
				if (seconds < 10) { seconds = "0" + seconds; }
				var time = hours + ':' + minutes + ':' + seconds;
				return time;
			}
			return '';
		}
	};
	return api;
});