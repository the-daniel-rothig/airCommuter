var self = require("sdk/self");
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: "*.airbnb.co.uk",
  //contentScriptWhen: 'ready',
  contentScriptFile: [
	self.data.url("jquery.min.js"),
	self.data.url("airCommuter.js")
  ]
});