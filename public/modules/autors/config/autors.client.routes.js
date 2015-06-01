'use strict';

//Setting up route
angular.module('autors').config(['$stateProvider',
	function($stateProvider) {
		// Autors state routing
		$stateProvider.
		state('listAutors', {
			url: '/autors',
			templateUrl: 'modules/autors/views/list-autors.client.view.html'
		}).
		state('createAutor', {
			url: '/autors/create',
			templateUrl: 'modules/autors/views/create-autor.client.view.html'
		}).
		state('viewAutor', {
			url: '/autors/:autorId',
			templateUrl: 'modules/autors/views/view-autor.client.view.html'
		}).
		state('editAutor', {
			url: '/autors/:autorId/edit',
			templateUrl: 'modules/autors/views/edit-autor.client.view.html'
		});
	}
]);