'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var edicions = require('../../app/controllers/edicions.server.controller');

	// Edicions Routes
	app.route('/edicions')
		.get(edicions.list)
		.post(users.requiresLogin, edicions.create);

	app.route('/edicions/:edicionId')
		.get(edicions.read)
		.put(users.requiresLogin, edicions.hasAuthorization, edicions.update)
		.delete(users.requiresLogin, edicions.hasAuthorization, edicions.delete);

	// Finish by binding the Edicion middleware
	app.param('edicionId', edicions.edicionByID);
};
