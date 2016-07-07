"use strict";
var blessed = require('blessed'), contrib = require('blessed-contrib');
class AppScreen {
    constructor() {
        var screen = this.appScreen = blessed.screen();
        this.grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
        this.initChatWindow();
        this.initInputWindow();
        this.appScreen.key(['C-c'], function (ch, key) {
            return process.exit(0);
        });
        this.appScreen.render();
    }
    initInputWindow() {
        var form = blessed.form;
        var textbox = blessed.textbox;
        this.inputWindow = this.grid.set(9, 2, 2, 10, textbox, {
            name: 'input',
            input: true,
            keys: true,
            vi: false
        });
        this.inputWindow.focus();
        this.inputWindow.key('enter', function (e) {
            this.inputWindow.clearValue();
            this.inputWindow.focus();
        }.bind(this));
    }
    initChatWindow() {
        this.chatWindow = this.grid.set(1, 2, 9, 10, contrib.log, {
            fg: 'green',
            selectedFg: 'green',
            label: 'Chat'
        });
    }
    initChannelWindow() {
        this.channelWindow = this.grid.set(1, 0, 10, 2, contrib.tree, {
            fg: 'green',
            template: { lines: true },
            label: 'Channels'
        });
        this.channelWindow.focus();
    }
}
exports.AppScreen = AppScreen;
