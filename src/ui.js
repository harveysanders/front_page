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
