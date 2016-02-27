/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__ (1);
	__webpack_require__ (2);
	__webpack_require__ (5);



/***/ },
/* 1 */
/***/ function(module, exports) {

	describe("Hello Test", function() {
	  it("should recognize true and false", function() {
	    expect(!!1).toEqual(true);
	    expect(!!0).toEqual(false);
	  });
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var UI = __webpack_require__ (3)
	var fixture = __webpack_require__ (4)

	describe("UI", function() {
		var ui;
		beforeEach(function(done) {
			var data = fixture.sampleDataOne;
			ui = new UI (document.getElementById('feedUI'), { max_title_length: 40 });
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var default_options = {
		max_title_length: 40
	};

	function loadAndInjectTemplates(callback){
		$.get('../templates.html', function (templateHTML) {
			$('body').append (templateHTML);
			callback ();
		});
	}
	function cloneTemplate(templateId){
		return $("#" + templateId).clone (true).removeAttr ('id');
	}

	function clear (container) {
		$(container).html('');
	}
	function addNewFeedUI (container) {
		cloneTemplate ('newFeedUITemplate').appendTo (container);
	}
	function addFeedContainer(container) {
		$(container).append($('<ul/>', { 'class': 'feeds' }));
	}

	function updateFeeds(container, feeds, options) {
		$.each(feeds, function (index, feed) {
			var $feed = getFeedContainer(container, feed.feed_url);
			var $header = $feed.find('h2 span');
			var $favicon = $feed.find('h2 img');
			$header.html('');
			if (feed.url) {
				$('<a/>', {
					text: feed.title,
					href: feed.url,
					target: "_blank"
				}).appendTo ($header);
				$favicon.attr('src', getFaviconFromLink(feed.url))
					.on ('error', function () { $(this).remove () });
			} else {
				$favicon.remove ();
				$header.text(feed.title);
			}
			updateFeedItems($feed, feed.items, options);
		});
	}
	function getFeedContainer(container, feedURL){
		var $feed = $(container).find('.feed[data-feedurl="' + feedURL + '"]');
		if ($feed.length > 0) {
			$feed = $feed.first ();
		} else {
			$feed = addNewFeed(container, feedURL);
		}
		return $feed;
	}
	function addNewFeed(container, feedURL){
		var $feed = cloneTemplate ('feedTemplate')
			.attr('data-feedurl', feedURL);
		$(container).find('.feeds').append ($feed);
		return $feed;
	}
	function updateFeedItems($feed, items, options) {
		var $list = $feed.find('ul').html('');
		$.each(items, function (i, item) {
			var $item = cloneTemplate ('feedItemTemplate');
			var title = item.title;
			var truncated = false;
			if (title.length > options.max_title_length) {
				title = title.substr (0, options.max_title_length - 3) + '...';
				truncated = true;
			}
			$link = $item.find('a').attr('href', item.url).text(title);
			if (item.is_read){
				$item.addClass('read');
			}
			if (truncated) {
				$item.attr('title', item.title);
			}
			$list.append ($item);
		});
	}
	function getFaviconFromLink (url) {
		var firstSlash = url.indexOf('/', 8);
		var domain = (firstSlash === -1) ? url : url.substr (0, firstSlash);
		return domain + '/favicon.ico';
	}

	function bindEvents (container, ui) {
		$(container).on ('click', '.feed li', function () {
			var $item = $(this);
			var $link = $item.find('a');
			$item.addClass ('read');
			ui.trigger ('itemRead', $link.attr ('href'));
			return true;
		}).on ('click', 'a.markRead', function (e) {
			var $feed = $(this).parents ('.feed');
			$feed.find ('li').addClass ('read');
			ui.trigger ('feedRead', $feed.attr ('data-feedurl'));
			e.preventDefault ();
		}).on ('click', '.addFeed', function () {
			var url = $(this).parents ('.newFeedUI').find ('input.newFeedURL').val ();
			if (url) {
				ui.trigger ('feedAdded', url);
			}
		}).on ('click', '.deleteFeed', function (e) {
			var $feed = $(this).parents ('.feed');
			var url = $feed.attr ('data-feedurl');
			$feed.remove ();
			ui.trigger ('feedDeleted', url);
			e.preventDefault ();
		}).on ('click', '.refresh', function (e) {
			var $feed = $(this).parents ('.feed');
			var url = $feed.attr ('data-feedurl');
			$feed.find ('ul li').remove ();
			ui.trigger ('refreshFeed', url);
			e.preventDefault ();
		});

		$(window).on ('focus', function () {
			ui.trigger ('windowFocused', null);
		});
		
		$(container).find ('ul.feeds').sortable ({
			update: function () {
				var order = [];
				$(container).find ('li.feed').each (function () {
					order.push ($(this).attr ('data-feedurl'));
				});
				ui.trigger ('feedsSorted', order);
			}
		});
	}

	/**
	*	Export the public API
	*/
	function UI(container, options) {
		this.container = container || document.body;
		this.options = $.extend({}, default_options, options);
		this.eventHandlers = {
			feedAdded: function(feed_url) {},
			feedRead: function(feed_url) {},
			itemRead: function(item_url) {},
			feedDeleted: function(item_url) {},
			feedsSorted: function(feed_urls) {},
			refreshFeed: function(feed_url) {},
			windowFocused: function() {}
		};
	}
	UI.prototype.init = function(data, callback) {
		ui = this;
		loadAndInjectTemplates (function () {
			clear (ui.container);
			addNewFeedUI (ui.container);
			addFeedContainer (ui.container);
			bindEvents (ui.container, ui);
			ui.refresh(data, callback);
		});
	};
	UI.prototype.refresh = function(data, callback) {
		updateFeeds(this.container, data.feeds, this.options);
		$(this.container).find ('.newFeedUI input.newFeedURL').val ('');
		if (typeof callback === 'function'){
			callback ();
		}
	};
	UI.prototype.bind = function(eventName, handler) {
		this.eventHandlers[eventName] = handler;
	};
	UI.prototype.bindEvent = function (eventName, handler) {
		this.bind (eventName, handler);
	}
	UI.prototype.trigger = function(eventName, eventInfo) {
		console.log ('triggering event "' + eventName + '"', eventInfo);
		this.eventHandlers[eventName](eventInfo);
	};

	module.exports = UI;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var fixture = {
		sampleFeedOne : {
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
			}, {
				title: "Article Two Title",
				description: "Article Two description",
				url: "http://blog.codinghorror.com/other-url/",
				published_at: 1438248709000,
				is_read: true
			}, {
				title: "Welcome to the Internet of Compromised Things But this time the title is longer and longer and longer",
				description: "Just ranting about insecure routers and other hardware",
				url: "http://blog.codinghorror.com/welcome-to-the-internet-of-compromised-things/",
				published_at: 1438248709000,
				is_read: false
			} ]
		}
	}
	fixture.sampleDataOne = {
		version: 1,
		profile: 'main',
		feeds: [ fixture.sampleFeedOne ]
	};

	module.exports = fixture;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var DataStore = __webpack_require__ (6)
	var fixture = __webpack_require__ (4)

	describe("Data Store", function() {
		//	init
		var store1, store2;
		var sampleFeed = fixture.sampleFeedOne;
		beforeEach(function() {
			store1 = new DataStore ('test1');
			store1.clearFeeds ();

			store2 = new DataStore ('test2');
			store2.clearFeeds ();
		});

		it("should load the 'main' profile when none is provided", function() {
			var mainStore = new DataStore ();
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


/***/ },
/* 6 */
/***/ function(module, exports) {

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

	module.exports = DataStore;


/***/ }
/******/ ]);