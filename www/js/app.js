/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/cordova/cordova.d.ts"/>

var app = angular.module('popremote', ['ionic'])
.run(function($ionicPlatform, $http, $rootScope) {
	var user = localStorage.getItem('popcorn-time-user') || 'popcorn';
	var pass = localStorage.getItem('popcorn-time-pass') || 'popcorn';
	$http.defaults.headers.common.Authorization = 'Authorization ' + btoa(user + ':' + pass);
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			window.StatusBar.styleDefault();
		}
	});
});