angular.module('c6.anim', [])

.animation('container-enter', ['$log', function($log) {
	return {
		setup: function($this) {
			if ($this.children('ul#categories').length) {
				var $lis = $this.children('ul').children();
				$lis.css({
					lineHeight: 0,
					opacity: 0
				});
			} else if ($this.children('ul#questions').length) {
				$($this[0]).css({
					opacity: 0
				});
				$($this[2]).css({
					opacity: 0,
					top: 10,
					position: 'relative'
				});
			}
		},
		start: function($this, done) {
			if ($this.children('ul#categories').length) {
				var $lis = $this.children('ul').children();
				$lis.each(function(index, li) {
					$(li).delay(index * 100).animate({
						opacity: 1,
						lineHeight: 1
					}, function() {
						if (index === $lis.length - 1) { done(); }
					});
				});
			} else if ($this.children('ul#questions').length) {
				$($this[0]).animate({
					opacity: 1
				}, 2000, done);
				$($this[2]).animate({
					opacity: 1,
					top: 0
				}, 750);
			}
		}
	}
}])

.animation('container-leave', ['$log', function($log) {
	return {
		start: function($this, done) {
			if ($this.children('ul#categories').length) {
				var $lis = $this.children('ul').children();
				$lis.each(function(index, li) {
					$(li).delay(index * 100).animate({
						opacity: 0,
						lineHeight: 0
					}, function() {
						if (index === $lis.length - 1) { done(); }
					});
				});
			} else if ($this.children('ul#questions').length) {
				$($this[0]).hide();
				$($this[2]).hide();
				done();
			}
		}
	}
}]);