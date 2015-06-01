'use strict';

//Autors service used to communicate Autors REST endpoints
angular.module('autors').factory('Autors', ['$resource',
	function($resource) {
		return $resource('autors/:autorId', { autorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);