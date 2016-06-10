"use strict";
var fs = require('fs');
var RtmClient = require('slack-client').RtmClient;
var WebClient = require('slack-client').WebClient;
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
var RTM_EVENTS = require('slack-client').RTM_EVENTS;
var MemoryDataStore = require('slack-client').MemoryDataStore;
var Slack = (function () {
    function Slack() {
        var token = "xoxp-2186881373-3434959869-40815580818-34da98f772";
        this.rtm = new RtmClient(token, {
            logLevel: '',
            dataStore: new MemoryDataStore({})
        });
        this.web = new WebClient(token);
        this.rtm.start();
    }
    Slack.prototype.getGroupHistory = function (channel) {
    };
    Slack.prototype.getImHistory = function (channelId, cb) {
        this.web.dm.history(channelId, {}, cb);
        getChannelHistory(channel);
        {
        }
        postMessage();
        {
        }
    };
    return Slack;
}());
var slack = new Slack();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = slack;
