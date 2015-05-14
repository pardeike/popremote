app.directive('preventDrag', function($ionicGesture, $ionicSlideBoxDelegate) {
	return {
      restrict: 'A',
      link: function (scope, elem) {
			var reportEvent = function (e) {
				if (e.target.tagName.toLowerCase() === 'input') {
					$ionicSlideBoxDelegate.enableSlide(false);
				} else {
					$ionicSlideBoxDelegate.enableSlide(true);
				}
			};
			$ionicGesture.on('touch', reportEvent, elem);
      }
	};
});