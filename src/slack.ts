import { Emitter, EVENTS } from "./emitter";
var fs = require('fs');
var RtmClient = require('slack-client').RtmClient;
var WebClient = require('slack-client').WebClient;
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
var RTM_EVENTS = require('slack-client').RTM_EVENTS;
var MemoryDataStore = require('slack-client').MemoryDataStore;

class SlackClass {
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
		this.rtm.start();

		this.web = new WebClient(token);

		this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, this.handleAuthentication.bind(this));
		this.rtm.on(RTM_EVENTS.MESSAGE, this.handleNewMessage.bind(this));
		Emitter.on(EVENTS.NEW_GROUP_SELECTED, this.getGroupHistory.bind(this));
		Emitter.on(EVENTS.NEW_CHANNEL_SELECTED, this.getChannelHistory.bind(this));
		Emitter.on(EVENTS.NEW_IM_SELECTED, this.getImHistory.bind(this));
		Emitter.on(EVENTS.SEND_NEW_MESSAGE, this.sendMessage.bind(this));
	}

	handleAuthentication(rtmStartData: any) {
		let channels = rtmStartData.channels;
		let groups = rtmStartData.groups;
		Emitter.emit(EVENTS.UPDATE_CHANNEL_WINDOW, channels, groups);
	}

	handleNewMessage (message) {
		Emitter.emit(EVENTS.INCOMING_MESSAGE, message);
	}

	getGroupHistory(channelId: string) {
		this.web.groups.history(channelId, {}, (err, response) => {
			Emitter.emit(EVENTS.UPDATE_CHAT_WINDOW, err, response);
		});
	}

	getImHistory(channelId: string) {
		this.web.dm.history(channelId, {}, (err, response) => {
			Emitter.emit(EVENTS.UPDATE_CHAT_WINDOW, err, response);
		});
	}

	getChannelHistory(channelId:string) {
		 this.web.channels.history(channelId, {}, (err, response) => {
		 	Emitter.emit(EVENTS.UPDATE_CHAT_WINDOW, err, response);
		 });
	}

	sendMessage(message, channelId) {
		this.rtm.sendMessage(message, channelId);
	}
}
export const Slack = new SlackClass();
