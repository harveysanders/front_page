describe("UI", function() {
	var ui;
	beforeEach(function(done) {
		var data = fixture.sampleDataOne;
		ui = frontpage.getUI(document.getElementById('feedUI'), { max_title_length: 40 });
		ui.init(data, function () {	done (); });
	});

	it("creates the 'New Feed' UI", function() {
		expect ($('#feedUI').find('.newFeedUI').length).toEqual (1);
	});
	it("only creates the 'New Feed' UI once", function() {
		expect ($('#feedUI').find('.newFeedUI').length).toEqual (1);
	});

	it("creates the feed element", function() {
		expect ($('#feedUI').find('.feed').length).toEqual (1);
	});

	it("triggers the 'feedAdded' event when a feed URL is supplied", function () {
		var handler = jasmine.createSpy ('handler');
		ui.bind('feedAdded', handler);

		var url = 'https://www.site.com';
		$("#feedUI .newFeedURL").val (url);
		$("#feedUI .addFeed").trigger ('click');
		expect(handler).toHaveBeenCalledWith(url);
	});

	it("triggers the 'itemRead' event when an item is clicked", function () {
		var handler = jasmine.createSpy ('handler');
		ui.bind('itemRead', handler);

		var $feed = $("#feedUI .feed").first ();
		var initialReadCount = $feed.find('li.read').length;
		var $item = $feed.find("li").not(".read").first ();
		var $link = $item.find('a');

		$link.trigger ('click');
		expect(handler).toHaveBeenCalledWith($link.attr ('href'));
		expect($feed.find('li.read').length).toBeGreaterThan (initialReadCount);
	});

	it("triggers the 'feedRead' event when a feed is read", function () {
		var handler = jasmine.createSpy ('handler');
		ui.bind('feedRead', handler);

		var $feed = $("#feedUI .feed").first ();
		expect($feed.find('li').length).toBeGreaterThan ($feed.find('li.read').length);

		$feed.find(".markRead").trigger ('click');
		expect(handler).toHaveBeenCalledWith($feed.attr ('data-feedurl'));
		expect($feed.find('li').length).toEqual ($feed.find('li.read').length);
	});

	it("triggers the 'feedDeleted' event when a feed is deleted", function () {
		var handler = jasmine.createSpy ('handler');
		ui.bind('feedDeleted', handler);

		var feedCount = $("#feedUI .feed").length;
		var $feed = $("#feedUI .feed").first ();
		$feed.find(".deleteFeed").trigger ('click');
		expect(handler).toHaveBeenCalledWith($feed.attr ('data-feedurl'));
		expect($("#feedUI .feed").length).toEqual (feedCount - 1);
	});

	it("triggers the 'refreshFeed' event when a feed is refreshed", function () {
		var handler = jasmine.createSpy ('handler');
		ui.bind('refreshFeed', handler);

		var feedCount = $("#feedUI .feed").length;
		var $feed = $("#feedUI .feed").first ();
		$feed.find(".refresh").trigger ('click');
		expect(handler).toHaveBeenCalledWith($feed.attr ('data-feedurl'));
		expect($feed.find ('ul li').length).toEqual (0);
	});

	it("truncates the article title where appropriate", function () {
		var data = $.extend(true, {}, fixture.sampleDataOne);
		var $feed = $("#feedUI .feed").first ();
		var wholeTitle = $feed.find ('li a').eq(0).text ();
		var truncatedTitle = $feed.find ('li a').eq(2).text ();
		expect(wholeTitle).toEqual (data.feeds[0].items[0].title);
		expect(truncatedTitle.length).toBeLessThan (data.feeds[0].items[2].title.length);
		expect(truncatedTitle.length).toEqual (40);
	});

	it("can be updated when the data changes", function () {
		var newData = $.extend(true, {}, fixture.sampleDataOne);
		newData.feeds[0].items.push({
			title: "Article Being Added",
			description: "Just Adding it!",
			url: "http://blog.codinghorror.com/yet-another-article/",
			published_at: 1438248709000,
			is_read: false
		});

		var $feeds = $("#feedUI .feed");
		var initialFeedCount = $feeds.length;
		var initialItemCount = $feeds.first ().find('li').length;
		ui.refresh(newData);

		$feeds = $("#feedUI .feed");
		expect ($feeds.length).toEqual (initialFeedCount);
		expect ($feeds.first ().find('li').length).toEqual (initialItemCount + 1);
	});

	it("resets the URL input when refreshing the UI", function () {
		$("#feedUI .newFeedURL").val ('http://www.test.com/rss');
		ui.refresh (fixture.sampleDataOne);
		expect($("#feedUI .newFeedURL").val ()).toEqual ('');
	});

	it("doesn't change anything on refresh if the data is the same", function () {
		var startingText = $.trim ($("#feedUI").text ());
		expect (startingText).not.toEqual ('');
		ui.refresh (fixture.sampleDataOne);
		ui.refresh (fixture.sampleDataOne);
		expect($.trim ($("#feedUI").text ())).toEqual (startingText);
	});
});
