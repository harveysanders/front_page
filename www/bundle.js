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

	var Controller = __webpack_require__ (14);
	var UI = __webpack_require__ (3);
	var DataStore = __webpack_require__ (6);
	var RSS = __webpack_require__ (16);

	var controller = new Controller ({
		dataStore:	new DataStore (),
		ui:			new UI(document.getElementById ('feedUI')),
		rss:		new RSS ()
	});
	controller.run ();


/***/ },
/* 1 */,
/* 2 */,
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
/* 4 */,
/* 5 */,
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


/***/ },
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var dataset = __webpack_require__ (15);

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
		this.ui.bindEvent ('windowFocused', this.refreshFeeds.bind(this));
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
		dataset.mergeFeedInfo (this.data, feed);
		this.dataStore.saveFeeds (this.data);
		this.ui.refresh(this.data);
	};
	Controller.prototype.markItemRead = function (url) {
		dataset.markItemRead (this.data, url);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.markFeedRead = function (url) {
		dataset.markFeedRead (this.data, url);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.deleteFeed = function (url) {
		dataset.removeFeed (this.data, url);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.refreshFeeds = function (queue) {
		//	if queue is not passed, it means refresh all
		if (typeof queue === 'undefined' || queue === null) {
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
		dataset.sortFeeds (this.data, feed_urls);
		this.dataStore.saveFeeds (this.data);
	};
	Controller.prototype.refreshFeed = function (url) {
		var controller = this;
		this.rss.fetch (url, function (feed) {
			controller.processFetchedFeed (feed);
		});
	};

	module.exports = Controller;


/***/ },
/* 15 */
/***/ function(module, exports) {

	
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


/***/ },
/* 16 */
/***/ function(module, exports) {

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



/***/ }
/******/ ]);