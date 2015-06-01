'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var autors = require('../../app/controllers/autors.server.controller');

	// Autors Routes
	app.route('/autors')
		.get(autors.list)
		.post(users.requiresLogin, autors.create);

	app.route('/autors/:autorId')
		.get(autors.read)
		.put(users.requiresLogin, autors.hasAuthorization, autors.update)
		.delete(users.requiresLogin, autors.hasAuthorization, autors.delete);

	// Finish by binding the Autor middleware
	app.param('autorId', autors.autorByID);
};
