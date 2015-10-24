window.fixture = {
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
window.fixture.sampleDataOne = {
	version: 1,
	profile: 'main',
	feeds: [ fixture.sampleFeedOne ]
};
