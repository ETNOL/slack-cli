"use strict";
var screen_1 = require('./screen');
var slack_1 = require('./slack');
var fs = require('fs');
slack_1.default.rtm.on(slack_1.default.CLIENT_EVENTS.RTM.AUTHENTICATED, function handleRTMAuthenticated(rtmStartData) {
    screen_1.default.chatWindow.log("Authenticated to Markit Slack");
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
    screen_1.default.channelWindow.setData(channelTree);
});
slack_1.default.rtm.on(slack_1.default.RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    screen_1.default.postMessage(message);
});
