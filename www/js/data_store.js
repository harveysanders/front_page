(function (window) {
	/**
	*	The key we use to store the data in localStorage is made up of two parts:
	*	* The key prefix is just a namespace, in case we end up wanting to store different kinds of
	*		data (e.g. appearance / layout settings) separately from the feeds.
	*	* The profile can be changed to store multiple distinct sets of feeds side-by-side.
	*		Even if that's never a feature, automated tests use it to avoid blowing away real data
	*/
	var KEY_PREFIX = 'feeds:';
	var profile = 'main';
	function getKey () {
		return KEY_PREFIX + profile;
	}

	function empty () {
		return {
			version: 1,
			profile: profile,
			feeds: []
		};
	};

	window.frontpage = window.frontpage || {};
	window.frontpage.dataStore = {
		load: function () {
			var data = localStorage.getItem (getKey ());
			if (data) {
				return JSON.parse(data);
			} else {
				return empty ();
			}
		},
		save: function (data) {
			localStorage.setItem(getKey (), JSON.stringify(data));
		},
		clear: function () {
			localStorage.removeItem(getKey ());
		},
		set_profile: function (new_profile) {
			profile = new_profile;
		}
	};
}(window));
