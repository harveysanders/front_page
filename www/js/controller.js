(function( window ) {
	var data
		;

	function getRSSFeed(url, callback) {
		$.ajax({
	        type:"GET",
	        dataType:"jsonp",
	        url:"http://ajax.googleapis.com/ajax/services/feed/load",
	        data:{"v":"1.0", "num":"10", "q":url},

	        success: function(result){
	            
	            console.log(result);
	            callback(result);
	        }
	    });
	}
	function importFeed(RSSData) {
		var RSSFeed = RSSData.responseData.feed;
		var currTime = Date.now();
		var feedItems = RSSFeed.entries;

		data = {
			version: 1,
			profile: "main",
			feeds: [
				{
					title: RSSFeed.title,
					description: RSSFeed.description,
					feed_url: RSSFeed.feedUrl,
					url: RSSFeed.link,
					updated_at: currTime,
					items: []
				}
			]
		};

		for (var i=0; i<feedItems.length; i++) {
			var item = {};
			item.title = feedItems[i].title;
			item.contentSnippet = feedItems[i].contentSnippet;
			item.url = feedItems[i].link;
			item.published_at = feedItems[i].publishedDate;
			item.is_read = false;
			data.feeds[0].items.push(item); //confused on which index of feeds to push to.
		}return data;
	}

	/**
 *	Part 1: put the RSS feed data into our format
 *  This function would take in the data as it comes from the RSS API and return something like
 * 	{
 *		title: "Feed title",
 * 		url: "http://blogurl.com",
 * 		feed_url: "http://blogurl.com/rss",
 * 		...
 * 		items: [
 * 			{	title: "article one", url: "http://blogurl.com/1", ... },
 * 			...
 * 		]
 *	}
 * 
 * The proper place to call this is probably INSIDE getRSSFeed before calling the callback,
 * since this method needs to know which properties the RSS feed supplies. Then everything outside
 * of getRSSFeed (and this helper) can be oblivious of all details about the source of the data.
 */
 function extractRSSFeedInfo (rawFeedObject) {

 }
 
/**
 * Part 2: find out if our current data already contains this feed, and if so at which index in data.feeds
 * We're probably just looping through and looking at the feed_url
 */
 function getFeedIndex (data, feed) {

 }
  
/**
 * Part 3a: If Part 2 decides we DON'T already have this feed,
 * we can probably just insert it at the end. This may not need to be a function of its own,
 * but sometimes reading a well-named function call (not that I've chosen the best names)
 * makes it way easier to follow by letting your brain stay in the higher-level logic. 
 */
 function insertNewFeed(data, feed) { data.feeds.push(feed); }

/**
 * Part 3b: If part 2 decides we DO already have this feed,
 * we need to update data.feeds[feedIndex] with the new data in feed
 * 
 * For the most part, the new info in feed is going to supercede anything
 * we have stored. The exceptions would be any additional info we added,
 * that's not provided by the RSS feed; so far I think the is_read bit is it.
 * So... we could just update the is_read bits of feed with whatever's in
 * data.feeds[feedIndex] and then replace data.feeds[feedIndex] with feed
 */
 function updateFeed (data, feedIndex, feed) { }

}(window));
