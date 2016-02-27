var Controller = require ("./controller");
var UI = require ("./ui");
var DataStore = require ("./data_store.js");
var RSS = require ("./rss");

var controller = new Controller ({
	dataStore:	new DataStore (),
	ui:			new UI(document.getElementById ('feedUI')),
	rss:		new RSS ()
});
controller.run ();
