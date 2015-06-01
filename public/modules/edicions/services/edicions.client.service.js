'use strict';

//Edicions service used to communicate Edicions REST endpoints
angular.module('edicions').factory('Edicions', ['$resource',
	function($resource) {
		return $resource('edicions/:edicionId', { edicionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);