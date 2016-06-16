"use strict";
var slack_1 = require('./slack');
var blessed = require('blessed'), contrib = require('blessed-contrib');
var AppScreen = (function () {
    function AppScreen() {
        this.appScreen = blessed.screen();
        this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.appScreen });
        this.initChatWindow();
        this.initInputWindow();
        this.initChannelWindow();
        this.appScreen.key(['C-c'], function (ch, key) {
            return process.exit(0);
        });
        this.appScreen.render();
    }
    AppScreen.prototype.initInputWindow = function () {
        this.inputWindow = this.grid.set(9, 2, 2, 10, contrib.cli, {
            label: 'Say something',
            secret: false
        });
        this.inputWindow.on('submit', function (e) {
            console.log("message sent");
        });
        this.inputWindow.on('keypress', function (e) {
            this.setValue(this.getValue() + e);
        });
    };
    AppScreen.prototype.initChatWindow = function () {
        this.chatWindow = this.grid.set(1, 2, 9, 10, contrib.log, {
            fg: 'green',
            selectedFg: 'green',
            label: 'Chat'
        });
    };
    AppScreen.prototype.initChannelTree = function (rtmStartData) {
        this.chatWindow.log("Authenticated to Markit Slack");
        var channels = rtmStartData.channels;
        var groups = rtmStartData.groups;
        var ims = rtmStartData.ims;
        var channelTree = {
            "extended": true,
            children: {}
        };
        channels.forEach(function (channel) {
            if (channel["is_member"]) {
                channelTree["children"][channel.name] = channel;
            }
        });
        groups.forEach(function (group) {
            channelTree["children"][group.name] = group;
        });
        ims.forEach(function (im) {
            var userName = slack_1.default.rtm.dataStore.getUserById(im.user).name;
            channelTree["children"][userName] = im;
        });
        this.channelWindow.setData(channelTree);
    };
    AppScreen.prototype.initChannelWindow = function () {
        var _this = this;
        this.channelWindow = this.grid.set(1, 0, 10, 2, contrib.tree, {
            fg: 'green',
            template: { lines: true },
            label: 'Channels'
        });
        this.channelWindow.focus();
        this.channelWindow.on('select', function (channel) {
            _this.currentChannel = channel.id;
            _this.chatWindow.logLines = [];
            if (channel.is_group) {
                slack_1.default.getGroupHistory(_this.currentChannel, _this.postMessages);
            }
            if (channel.is_im) {
                slack_1.default.getImHistory(_this.currentChannel, _this.postMessages);
            }
            if (channel.is_channel) {
                slack_1.default.getChannelHistory(_this.currentChannel, _this.postMessages);
            }
        });
        slack_1.default.getChannelHistory(this.channelWindow.children['design'].id, this.postMessages);
    };
    AppScreen.prototype.postMessages = function (err, messages) {
        var _this = this;
        var messages = messages || [{ text: "No messages found in channel " + this.currentChannel }];
        messages.forEach(function (message) { _this.postMessage(message); });
    };
    AppScreen.prototype.postMessage = function (message) {
        var messageText = message.text;
        var user = message.user ? slack_1.default.rtm.dataStore.getUserById(message.user).name : undefined;
        var postMessage = "";
        if (user) {
            postMessage += user + ": ";
        }
        if (messageText) {
            postMessage += messageText;
        }
        this.chatWindow.log(postMessage);
    };
    return AppScreen;
}());
var appScreen = new AppScreen();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = appScreen;
