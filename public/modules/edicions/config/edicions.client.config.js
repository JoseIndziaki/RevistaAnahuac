'use strict';

// Configuring the Articles module
angular.module('edicions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Histórico', 'edicions', '', 'edicions');
		/*Menus.addSubMenuItem('topbar', 'edicions', 'List Edicions', 'edicions');
		Menus.addSubMenuItem('topbar', 'edicions', 'New Edicion', 'edicions/create');*/
	}
]);