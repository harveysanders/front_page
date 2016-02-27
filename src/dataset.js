
function getFeedIndex (data, url) {
	var foundIndex = -1;
	$.each (data.feeds, function (index, feedInfo) {
		if (feedInfo.feed_url == url) {
			foundIndex = index;
			return false;
		}
	});
	return foundIndex;
}
  
function insertNewFeed(data, feed) { data.feeds.push(feed); }

function updateFeed (data, feedIndex, feed) {
	var existing = {};
	$.each (data.feeds[feedIndex].items, function (index, item) {
		existing[item.url] = { 
			is_read: item.is_read
		};
	});
	$.each (feed.items, function (index, item) {
		var url = item.url;
		if (existing[url]) {
			feed.items[index].is_read = existing[url].is_read;
		}
	});
	data.feeds[feedIndex] = feed;
}

function sortFeeds (data, feed_urls) {
	var old_feeds = data.feeds;
	data.feeds = [];
	for (var i = 0; i < feed_urls.length; i++) {
		var index = getFeedIndex ({ feeds: old_feeds }, feed_urls[i]);
		data.feeds.push (old_feeds[index]);
	}
}

var dataset = {
	mergeFeedInfo: function (data, feed) {
		var feedIndex = this.getFeedIndex (data, feed.feed_url);
		if (feedIndex < 0) {
			this.insertNewFeed (data, feed);
		} else {
			this.updateFeed (data, feedIndex, feed);
		}
	},
	getFeedIndex: function (data, url) {
		return getFeedIndex (data, url);
	},
	insertNewFeed: function (data, feed) {
		insertNewFeed (data, feed);
	},
	updateFeed: function (data, feedIndex, feed) {
		updateFeed (data, feedIndex, feed);
	},
	removeFeed: function (data, url) {
		var feedIndex = this.getFeedIndex (data, url);
		if (feedIndex >= 0) {
			data.feeds.splice (feedIndex, 1);
		}
	},
	markItemRead: function (data, url) {
		for (var feedIndex = 0; feedIndex < data.feeds.length; feedIndex++) {
			for (var itemIndex = 0; itemIndex < data.feeds[feedIndex].items.length; itemIndex++) {
				if (data.feeds[feedIndex].items[itemIndex].url == url) {
					data.feeds[feedIndex].items[itemIndex].is_read = true;
				}
			}
		}
	},
	markFeedRead: function (data, url) {
		var feedIndex = this.getFeedIndex (data, url);
		$.each(data.feeds[feedIndex].items, function (index, item) {
			data.feeds[feedIndex].items[index].is_read = true;
		});
	},
	sortFeeds: function (data, feed_urls) {
		sortFeeds (data, feed_urls);
	}
};

module.exports = dataset;
