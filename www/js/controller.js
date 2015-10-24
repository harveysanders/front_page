(function( extend ) {

	var default_options = {
		refresh_frequency: 60 * 60 * 2	//	don't refresh a feed more often than every X seconds 
	};

	function Controller (components, options) {
		this.dataStore = components.dataStore;
		this.ui = components.ui;
		this.rss = components.rss;
		this.options = $.extend({}, default_options, options);

		this.ui.bindEvent ('feedAdded', this.addFeed.bind(this));
		this.ui.bindEvent ('feedDeleted', this.deleteFeed.bind(this));
		this.ui.bindEvent ('itemRead', this.markItemRead.bind(this));
		this.ui.bindEvent ('feedRead', this.markFeedRead.bind(this));
		this.ui.bindEvent ('feedsSorted', this.sortFeeds.bind(this));
		this.ui.bindEvent ('refreshFeed', this.refreshFeed.bind(this));
	}
	Controller.prototype.run = function () {
		this.data = this.dataStore.loadFeeds ();
		this.ui.init (this.data);
		this.refreshFeeds();
	};
	Controller.prototype.addFeed = function (url) {
		this.rss.fetch (url, this.processFetchedFeed.bind(this));
	};
	Controller.prototype.processFetchedFeed = function (feed) {
		frontpage.dataset.mergeFeedInfo (this.data, feed);
		this.dataStore.saveFeeds (this.data);
		this.ui.refresh(this.data);
	};
	Controller.prototype.markItemRead = function (url) {
		frontpage.dataset.markItemRead (this.data, url);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.markFeedRead = function (url) {
		frontpage.dataset.markFeedRead (this.data, url);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.deleteFeed = function (url) {
		frontpage.dataset.removeFeed (this.data, url);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.refreshFeeds = function (queue) {
		//	if queue is not passed, it means refresh all
		if (typeof queue === 'undefined') {
			queue = [];
			var now = Math.floor(Date.now() / 1000);
			for (var i = 0; i < this.data.feeds.length; i++) {
				if (now - this.data.feeds[i].updated_at > this.options.refresh_frequency) {
					queue.push (this.data.feeds[i].feed_url);
				}
			}
		}
		if (queue.length == 0) {
			return;	//	nothing to do
		}

		//	fetch one feed. when it's done, call refreshFeeds again to work down the queue
		var controller = this;
		this.rss.fetch (queue.pop (), function (feed) {
			controller.processFetchedFeed (feed);
			controller.refreshFeeds (queue);
		});
	};
	Controller.prototype.sortFeeds = function (feed_urls) {
		frontpage.dataset.sortFeeds (this.data, feed_urls);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.refreshFeed = function (url) {
		var controller = this;
		this.rss.fetch (url, function (feed) {
			controller.processFetchedFeed (feed);
		});
	};

	/**
	*	Expose a method for creating a controller
	*/
	extend.frontpage = extend.frontpage || {};
	extend.frontpage.getController = function(components, options) {
		return new Controller(components, options);
	};

}(this));
