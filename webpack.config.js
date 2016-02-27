module.exports = {
	entry: { 
		"www/bundle": "./src/app.js",
		"test/bundle": "./test/spec/root.js",
		"www/vendor": "./src/vendor.js",
		"test/jasmine": "./test/spec/jasmine.js"
	},
	output: {
		path: "./",
		filename: "[name].js"
	}
};
