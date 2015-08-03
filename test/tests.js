QUnit.test ("Just testing tests", function (assert) {
	assert.ok (1 == true, "1 is true");
	assert.ok (0 == false, "Zero is false");
});

QUnit.test ("Data Store", function (assert) {
	frontpage.dataStore.set_profile ('test1');
	frontpage.dataStore.clear ();

	var data = frontpage.dataStore.load ();
	assert.ok (data.version == 1 && data.profile == 'test1' && data.feeds.length == 0, "Empty data set returned after clear");
	data.feeds.push({title: "Article 1", description: "Good Article" });
	frontpage.dataStore.save(data);

	var loaded = frontpage.dataStore.load ();
	assert.ok (data.version == 1 && data.feeds.length == 1, "Item is added");
	var first = loaded.feeds[0];
	assert.ok (first.title == "Article 1", "Added item retains its title");

	frontpage.dataStore.set_profile ('test2');
	var new_profile = frontpage.dataStore.load ();
	assert.ok (new_profile.feeds.length == 0 && new_profile.profile == 'test2', "Changing to an empty profile returns an empty data set");
});
