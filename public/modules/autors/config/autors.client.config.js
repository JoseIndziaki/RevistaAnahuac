'use strict';

// Configuring the Articles module
angular.module('autors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Autores', 'autors', '', 'autors');
		/*Menus.addSubMenuItem('topbar', 'autors', 'List Autors', 'autors');
		Menus.addSubMenuItem('topbar', 'autors', 'New Autor', 'autors/create');*/
	}
]);