"use strict";
const emitter_1 = require("./emitter");
var fs = require('fs');
var RtmClient = require('slack-client').RtmClient;
var WebClient = require('slack-client').WebClient;
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
var RTM_EVENTS = require('slack-client').RTM_EVENTS;
var MemoryDataStore = require('slack-client').MemoryDataStore;
class SlackClass {
    constructor() {
        var token = "xoxp-2186881373-3434959869-40815580818-34da98f772";
        this.rtm = new RtmClient(token, {
            logLevel: '',
            dataStore: new MemoryDataStore({})
        });
        this.rtm.start();
        this.web = new WebClient(token);
        this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, this.handleAuthentication.bind(this));
        this.rtm.on(RTM_EVENTS.MESSAGE, this.handleNewMessage.bind(this));
        emitter_1.Emitter.on(emitter_1.EVENTS.NEW_GROUP_SELECTED, this.getGroupHistory.bind(this));
        emitter_1.Emitter.on(emitter_1.EVENTS.NEW_CHANNEL_SELECTED, this.getChannelHistory.bind(this));
        emitter_1.Emitter.on(emitter_1.EVENTS.NEW_IM_SELECTED, this.getImHistory.bind(this));
        emitter_1.Emitter.on(emitter_1.EVENTS.SEND_NEW_MESSAGE, this.sendMessage.bind(this));
    }
    handleAuthentication(rtmStartData) {
        let channels = rtmStartData.channels;
        let groups = rtmStartData.groups;
        emitter_1.Emitter.emit(emitter_1.EVENTS.UPDATE_CHANNEL_WINDOW, channels, groups);
    }
    handleNewMessage(message) {
        emitter_1.Emitter.emit(emitter_1.EVENTS.INCOMING_MESSAGE, message);
    }
    getGroupHistory(channelId) {
        this.web.groups.history(channelId, {}, (err, response) => {
            emitter_1.Emitter.emit(emitter_1.EVENTS.UPDATE_CHAT_WINDOW, err, response);
        });
    }
    getImHistory(channelId) {
        this.web.dm.history(channelId, {}, (err, response) => {
            emitter_1.Emitter.emit(emitter_1.EVENTS.UPDATE_CHAT_WINDOW, err, response);
        });
    }
    getChannelHistory(channelId) {
        this.web.channels.history(channelId, {}, (err, response) => {
            emitter_1.Emitter.emit(emitter_1.EVENTS.UPDATE_CHAT_WINDOW, err, response);
        });
    }
    sendMessage(message, channelId) {
        this.rtm.sendMessage(message, channelId);
    }
}
exports.Slack = new SlackClass();
