'use strict';

//Setting up route
angular.module('edicions').config(['$stateProvider',
	function($stateProvider) {
		// Edicions state routing
		$stateProvider.
		state('listEdicions', {
			url: '/edicions',
			templateUrl: 'modules/edicions/views/list-edicions.client.view.html'
		}).
		state('createEdicion', {
			url: '/edicions/create',
			templateUrl: 'modules/edicions/views/create-edicion.client.view.html'
		}).
		state('viewEdicion', {
			url: '/edicions/:edicionId',
			templateUrl: 'modules/edicions/views/view-edicion.client.view.html'
		}).
		state('editEdicion', {
			url: '/edicions/:edicionId/edit',
			templateUrl: 'modules/edicions/views/edit-edicion.client.view.html'
		});
	}
]);