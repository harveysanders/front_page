describe("Data Store", function() {
	var sampleFeed = {
		title: "Coding Horror",
		description: "programming and human factors",
		url: "http://blog.codinghorror.com",
		feed_url: "http://blog.codinghorror.com/rss",
		updated_at: 1438573955514,
		items: [ {
			title: "Article Title",
			description: "Article description",
			url: "http://blog.codinghorror.com/doing-terrible-things-to-your-code/",
			published_at: 1438248709000,
			is_read: false
		} ]
	};

	//	init
	var store1, store2;
	beforeEach(function() {
		store1 = frontpage.newDataStore ('test1');
		store1.clearFeeds ();

		store2 = frontpage.newDataStore ('test2');
		store2.clearFeeds ();
	});

	it("should load the 'main' profile when none is provided", function() {
		var mainStore = frontpage.newDataStore ();
		var feedData = mainStore.loadFeeds ();
		expect (feedData.profile).toEqual ('main');
	});

	it("should be empty when it's first created", function() {
		var emptyFeeds = store1.loadFeeds ();
		expect (emptyFeeds.version).toEqual (1);
		expect (emptyFeeds.profile).toEqual ('test1');
		expect (emptyFeeds.feeds).toEqual ([]);
		expect (emptyFeeds.feeds.length).toEqual (0);
	});

	it ("should save a feed", function () {
		var feedData = store1.loadFeeds ();
		feedData.feeds.push (sampleFeed);
		store1.saveFeeds (feedData);

		var loaded = store1.loadFeeds ();
		expect (loaded.feeds.length).toEqual (1);
		var first = loaded.feeds[0];
		expect (first.title).toEqual (sampleFeed.title);
	});

	it ("should be empty when we switch to a new profile", function () {
		var feedData = store1.loadFeeds ();
		feedData.feeds.push (sampleFeed);
		store1.saveFeeds (feedData);

		var newProfile = store2.loadFeeds ();
		expect (newProfile.profile).toEqual ('test2');
		expect (newProfile.feeds.length).toEqual (0);
		expect (newProfile.feeds).toEqual ([]);
	});

	it ("should be empty after clearing", function () {
		var feedData = store1.loadFeeds ();
		feedData.feeds.push (sampleFeed);
		store1.saveFeeds (feedData);
		store1.clearFeeds ();

		var loaded = store1.loadFeeds ();
		expect (loaded.feeds.length).toEqual (0);
	});
});
