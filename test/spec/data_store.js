describe("Data Store", function() {
	//	init
	var store1, store2;
	var sampleFeed = window.fixture.sampleFeedOne;
	beforeEach(function() {
		store1 = frontpage.getDataStore ('test1');
		store1.clearFeeds ();

		store2 = frontpage.getDataStore ('test2');
		store2.clearFeeds ();
	});

	it("should load the 'main' profile when none is provided", function() {
		var mainStore = frontpage.getDataStore ();
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
