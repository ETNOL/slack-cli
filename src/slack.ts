var fs = require('fs');
var RtmClient = require('slack-client').RtmClient;
var WebClient = require('slack-client').WebClient;
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
var RTM_EVENTS = require('slack-client').RTM_EVENTS;
var MemoryDataStore = require('slack-client').MemoryDataStore;

class Slack {
	rtm: any;
	web: any;
	CLIENT_EVENTS: any;
	RTM_EVENTS: any;

	constructor() {
		var token =  "xoxp-2186881373-3434959869-40815580818-34da98f772";

		this.rtm = new RtmClient(token, {
		  logLevel: '', // check this out for more on logger: https://github.com/winstonjs/winston
		  dataStore: new MemoryDataStore({}) // pass a new MemoryDataStore instance to cache information
		});

		this.web = new WebClient(token);
		this.rtm.start();
	}

	getGroupHistory(channelId: string, cb: Function) {
		this.web.groups.history(channelId, {}, cb);
	}

	getImHistory(channelId: string, cb: Function) {
		this.web.dm.history(channelId, {}, cb);
	}

	getChannelHistory(channelId:string, cb: Function) {
		this.web.channels.history(channelId, {}, cb);
	}
	
}

var slack = new Slack();
export default slack;
