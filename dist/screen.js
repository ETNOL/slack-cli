"use strict";
var slack_ts_1 = require('./slack.ts');
var blessed = require('blessed'), contrib = require('blessed-contrib');
var AppScreen = (function () {
    function AppScreen() {
        this.appScreen = blessed.screen();
        this.grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
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
                slack_ts_1.default.getGroupHistory(_this.currentChannel);
            }
            if (channel.is_im) {
                slack_ts_1.default.getImHistory(_this.currentChannel, function (err, response) {
                    var messages = response.messages || [{ text: "No messages found in channel " + id }];
                    response.messages.forEach(function (message) { postMessage(message); });
                });
            }
            if (channel.is_channel) {
                slack_ts_1.default.getChannelHistory(_this.currentChannel);
            }
        });
    };
    return AppScreen;
}());
var appScreen = new AppScreen();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = appScreen;
