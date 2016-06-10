var fs = require('fs');
var request = require('request');
var blessed = require('blessed'), contrib = require('blessed-contrib'), current = 'Design';
var screen = blessed.screen();
var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
var log = grid.set(1, 2, 9, 10, contrib.log, {
    fg: 'green',
    selectedFg: 'green',
    label: 'Chat'
});
var tree = grid.set(1, 0, 10, 2, contrib.tree, {
    fg: 'green',
    template: { lines: true },
    label: 'Channels'
});
var cli = grid.set(9, 2, 2, 10, contrib.cli, {
    label: 'Say something',
    secret: false
});
tree.focus();
cli.on('submit', function (e) {
    console.log("message sent");
});
cli.on('keypress', function (e) {
    this.setValue(this.getValue() + e);
});
tree.on('select', function (node) {
    current = node.id;
    log.logLines = [];
    if (node.is_group) {
        getGroupHistory(current);
    }
    if (node.is_im) {
        getImHistory(current);
    }
    if (node.is_channel) {
        getChannelHistory(current);
    }
});
screen.key(['C-c'], function (ch, key) {
    return process.exit(0);
});
screen.render();
var RtmClient = require('slack-client').RtmClient;
var WebClient = require('slack-client').WebClient;
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS;
var RTM_EVENTS = require('slack-client').RTM_EVENTS;
var MemoryDataStore = require('slack-client').MemoryDataStore;
var token = "xoxp-2186881373-3434959869-40815580818-34da98f772";
var rtm = new RtmClient(token, {
    logLevel: '',
    dataStore: new MemoryDataStore({})
});
var web = new WebClient(token);
rtm.start();
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function handleRTMAuthenticated(rtmStartData) {
    log.log("Authenticated to Markit Slack");
    var channels = rtmStartData.channels;
    var groups = rtmStartData.groups;
    var ims = rtmStartData.ims;
    fs.writeFile('StartData.json', JSON.stringify(rtmStartData), null, " ");
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
        var userName = rtm.dataStore.getUserById(im.user).name;
        channelTree["children"][userName] = im;
    });
    getChannelHistory(channelTree.children['design'].id, 'channels');
    tree.setData(channelTree);
});
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    postMessage(message);
});
function getImHistory(id) {
    web.dm.history(id, {}, function (err, response) {
        fs.writeFile('imHistoryReturn.json', JSON.stringify(response, null, " "));
        response.messages = response.messages || [{ text: "No messages found in channel " + id }];
        response.messages.forEach(function (message) { postMessage(message); });
    });
}
function getChannelHistory(id) {
    web.channels.history(id, {}, function (err, response) {
        fs.writeFile('historyReturn.json', JSON.stringify(response, null, " "));
        response.messages = response.messages || [{ text: "No messages found in channel " + id }];
        response.messages.forEach(function (message) { postMessage(message); });
    });
}
function getGroupHistory(id) {
    web.groups.history(id, {}, function (err, response) {
        fs.writeFile('historyReturn.json', JSON.stringify(response, null, " "));
        response.messages = response.messages || [{ text: "No messages found in group " + id }];
        response.messages.forEach(function (message) { postMessage(message); });
    });
}
function postMessage(message) {
    var messageText = message.text;
    var user = message.user ? rtm.dataStore.getUserById(message.user).name : undefined;
    var message = "";
    if (user) {
        message += user + ": ";
    }
    if (messageText) {
        message += messageText;
    }
    log.log(message);
}
