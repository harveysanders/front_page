var default_options = {
	article_count: 10,
};

/**
*	Define the RSS fetcher component
*/
function RSS (options) {
	this.options = $.extend({}, default_options, options);
}
RSS.prototype.fetch = function (url, callback) {
	var rss = this;
	$.ajax({
		type:"GET",
		dataType:"jsonp",
		url:"http://ajax.googleapis.com/ajax/services/feed/load",
		data:{"v":"1.0", "num":this.options.article_count, "q":url},

		success: function(result){
			callback(rss.extractFeedInfo(result));
		}
	});
};
RSS.prototype.extractFeedInfo = function (rawRSSData) {
	var rawFeed = rawRSSData.responseData.feed;
	var now = Math.floor(Date.now() / 1000);

	var feed = {
		title: rawFeed.title,
		description: rawFeed.description,
		feed_url: rawFeed.feedUrl,
		url: rawFeed.link,
		updated_at: now,
		items: []
	};
	for (var i = 0; i < rawFeed.entries.length; i++) {
		feed.items.push ({
			title: rawFeed.entries[i].title,
			description: rawFeed.entries[i].contentSnippet.substr (0, 30) + '...',
			url: rawFeed.entries[i].link,
			published_at: rawFeed.entries[i].publishedDate,
			is_read: false,
		});
	}
	return feed;
};

module.exports = RSS;

