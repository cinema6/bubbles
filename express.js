(function() {
	'use strict';
	var express = require('express'),
		phantom = require('phantom'),
		browser,
		device = require('express-device'),
		app = express();

	function renderWithPhantom(res, route) {
		var navigate = function() {
			browser.createPage(function(page) {
				page.open('http://localhost:9000' + route, function(status) {
					console.log(status);
					if (status === 'success') {
						page.evaluate(function() {
							return document.getElementsByTagName('html')[0].getAttribute('data-ready');
						}, function() {
							var checkForReadiness = function(callback) {
								var doCheck = function() {
									page.evaluate(function() {
										return document.getElementsByTagName('html')[0].getAttribute('data-ready');
									}, function(mostRecentReady) {
										if (mostRecentReady === 'true') {
											page.evaluate(function() {
												return document.documentElement;
											}, function(document) {
												callback(document);
											});
										} else {
											console.log('App not ready, trying again!');
											setTimeout(doCheck, 100);
										}
									});
								};
								doCheck();
							};
							checkForReadiness(function(document) {
								res.send(document.innerHTML);
							});
						});
					}
				});
			});
		};

		if (browser) {
			navigate();
		} else {
			phantom.create(function(phantomBrowser) {
				browser = phantomBrowser;
				navigate();
			});
		}
	}

	app.configure(function() {
		app.use(require('grunt-contrib-livereload/lib/utils').livereloadSnippet);
		app.use('/assets', express.static('app/assets'));
		app.use(device.capture());
		app.use(app.router);
	});

	app.get('*', function(req, res) {
		var path = req.params[0];

		if (req.device.type !== 'bot') {
			res.sendfile('app' + '/');
		} else {
			renderWithPhantom(res, path);
		}
	});

	app.listen(9000);
	console.log('Listening on port 9000');
})();
