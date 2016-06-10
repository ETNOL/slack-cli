"use strict";
var screen_ts_1 = require('./screen.ts');
var slack_ts_1 = require('./slack.ts');
var fs = require('fs');
slack_ts_1.default.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function handleRTMAuthenticated(rtmStartData) {
    screen_ts_1.default.chatWindow.log("Authenticated to Markit Slack");
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
    getChannelHistory(channelTree.children['design'].id);
    screen_ts_1.default.channelWindow.setData(channelTree);
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
    var postMessage = "";
    if (user) {
        postMessage += user + ": ";
    }
    if (messageText) {
        postMessage += messageText;
    }
    screen_ts_1.default.chatWindow.log(postMessage);
}
