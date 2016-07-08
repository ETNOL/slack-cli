"use strict";
const emitter_1 = require('./emitter');
const slack_1 = require('./slack');
const fs = require('fs');
const blessed = require('blessed'), contrib = require('blessed-contrib');
class AppScreen {
    constructor() {
        var screen = this.appScreen = blessed.screen();
        this.grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
        this.focused = 0;
        this.focusables = [];
        this.initChannelWindow();
        this.initChatWindow();
        this.initInputWindow();
        this.appScreen.key(['C-c'], function (ch, key) {
            return process.exit(0);
        });
        this.appScreen.key(['C-w'], function () {
            if (this.focused >= this.focusables.length) {
                this.focused = 0;
            }
            this.focusables[this.focused++].focus();
            this.appScreen.render();
        }.bind(this));
        this.appScreen.render();
    }
    initInputWindow() {
        var form = blessed.form;
        var textbox = blessed.textarea;
        this.inputWindow = this.grid.set(9, 2, 2, 10, textbox, {
            name: 'input',
            input: true,
            keys: true,
            vi: false
        });
        this.focusables.push(this.inputWindow);
        this.inputWindow.focus();
        this.inputWindow.key('enter', function (e) {
            var messageContent = this.inputWindow.value;
            var channelId = this.currentChannel.id;
            emitter_1.Emitter.emit(emitter_1.EVENTS.SEND_NEW_MESSAGE, messageContent, channelId);
            this.inputWindow.clearValue();
            this.appScreen.render();
        }.bind(this));
    }
    initChatWindow() {
        this.chatWindow = this.grid.set(1, 2, 9, 10, contrib.log, {
            fg: 'green',
            selectedFg: 'green',
            label: 'Chat'
        });
        emitter_1.Emitter.on(emitter_1.EVENTS.UPDATE_CHAT_WINDOW, (err, response) => {
            fs.writeFile('channelResponse.json', JSON.stringify(response));
            response.messages = response.messages.reverse() || [{ text: "No messages found in channel " }];
            response.messages.forEach(message => { this.postMessage(message); });
        });
        emitter_1.Emitter.on(emitter_1.EVENTS.INCOMING_MESSAGE, message => {
            if (message.channel == this.currentChannel.id && message.text) {
                this.postMessage(message);
            }
        });
    }
    getNewChannelTree() {
        return {
            "extended": true,
            children: {}
        };
    }
    initChannelWindow() {
        this.channelWindow = this.grid.set(1, 0, 11, 2, contrib.tree, {
            fg: 'green',
            template: { lines: true },
            label: 'Channels'
        });
        this.focusables.push(this.channelWindow);
        emitter_1.Emitter.on(emitter_1.EVENTS.UPDATE_CHANNEL_WINDOW, (channels, groups) => {
            var channelTree = this.getNewChannelTree();
            channels.forEach(channel => {
                if (channel["is_member"]) {
                    channelTree["children"][channel.name] = channel;
                }
            });
            groups.forEach(group => {
                channelTree["children"][group.name] = group;
            });
            this.channelWindow.setData(channelTree);
            this.channelWindow.focus();
            this.appScreen.render();
        });
        this.channelWindow.on('select', (channel) => {
            this.currentChannel = channel;
            this.chatWindow.logLines = [];
            if (channel.is_group) {
                emitter_1.Emitter.emit(emitter_1.EVENTS.NEW_GROUP_SELECTED, channel.id);
            }
            if (channel.is_im) {
                emitter_1.Emitter.emit(emitter_1.EVENTS.NEW_IM_SELECTED, channel.id);
            }
            if (channel.is_channel) {
                emitter_1.Emitter.emit(emitter_1.EVENTS.NEW_CHANNEL_SELECTED, channel.id);
            }
        });
    }
    postMessage(message) {
        var messageText = message.text || "";
        var user = message.user ? slack_1.Slack.rtm.dataStore.getUserById(message.user).name : undefined;
        var formattedMessage = "";
        if (user) {
            formattedMessage += user + ": ";
        }
        if (messageText) {
            formattedMessage += messageText;
        }
        this.chatWindow.log(formattedMessage);
    }
}
exports.AppScreen = AppScreen;
