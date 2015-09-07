(function (extend) {
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

	function updateFeeds(container, feeds) {
		$.each(feeds, function (index, feed) {
			var $feed = getFeedContainer(container, feed.feed_url);
			var $header = $feed.find('h2');
			$header.html('');
			if (feed.url) {
				$('<a/>', {
					text: feed.title,
					href: feed.url,
					target: "_blank"
				}).appendTo ($header);
			} else {
				$header.text(feed.title);
			}
			updateFeedItems($feed, feed.items);
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
	function updateFeedItems($feed, items) {
		var $list = $feed.find('ul').html('');
		$.each(items, function (i, item) {
			var $item = cloneTemplate ('feedItemTemplate');
			$item.find('a').attr('href', item.url).text(item.title);
			if (item.is_read){
				$item.addClass('read');
			}
			$list.append ($item);
		});
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
		});
	}

	/**
	*	Export the public API
	*/
	function UI(container) {
		this.container = container || document.body;
		this.eventHandlers = {
			feedAdded: function(feed_url) {},
			feedRead: function(feed_url) {},
			itemRead: function(item_url) {},
			feedDeleted: function(item_url) {},
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
		updateFeeds(this.container, data.feeds);
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

	/**
	*	Expose a method for creating a data store linked to a particular profile
	*/
	extend.frontpage = extend.frontpage || {};
	extend.frontpage.getUI = function(container) {
		return new UI(container);
	};
}(this));
