/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/cordova/cordova.d.ts"/>

var app = angular.module('popremote', ['ionic'])
.run(function($ionicPlatform, $http, $rootScope) {
	$http.defaults.headers.common.Authorization = 'Authorization ' + btoa('popcorn:popcorn');
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			window.StatusBar.styleDefault();
		}
	});
});