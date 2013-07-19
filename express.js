(function() {
	'use strict';
	var express = require('express'),
		app = express();

	app.use(express.static('app'));
	app.use(app.router);

	app.get('*', function(req, res) {
		var path = req.params[0] || 'index.html';

		res.sendfile('app' + '/');
	});

	app.listen(9000);
	console.log('Listening on port 9000');
})();
