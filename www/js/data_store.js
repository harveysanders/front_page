(function (extend) {
	/**
	*	private functions for accessing the actual data store
	*/
	function key (profile, index) {
		//	different profiles are like totally separate databases
		//	each index refers to a type of data, like feeds, config, etc.
		return profile + '.' + index;
	}
	function get (profile, index) {
		return localStorage.getItem (key (profile, index));
	}
	function set (profile, index, value) {
		return localStorage.setItem (key (profile, index), value);
	}
	function clear (profile, index) {
		return localStorage.removeItem (key (profile, index));
	}

	/**
	*	empty feeds data structure for new users
	*/
	function emptyFeeds (profile) {
		return {
			version: 1,
			profile: profile,
			feeds: []
		};
	};

	/**
	*	Define data store
	*/
	function DataStore (profile) {
		this.profile = profile || 'main';
	}
	DataStore.prototype.loadFeeds = function () {
		var data = get (this.profile, 'feeds'); 
		if (data) {
			return JSON.parse(data);
		} else {
			return emptyFeeds (this.profile);
		}
	};
	DataStore.prototype.saveFeeds = function (data) {
		set (this.profile, 'feeds', JSON.stringify (data));
	};
	DataStore.prototype.clearFeeds = function () {
		clear (this.profile, 'feeds');
	};

	/**
	*	Expose a method for creating a data store linked to a particular profile
	*/
	extend.frontpage = extend.frontpage || {};
	extend.frontpage.newDataStore = function (profile) {
		return new DataStore (profile);
	};
}(this));
