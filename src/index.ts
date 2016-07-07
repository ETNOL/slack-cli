import { AppScreen } from './screen';
//import Slack from './slack';

var fs = require('fs');
var appScreen = new AppScreen();

// //----- Initialization --------------//
// Slack.rtm.on(Slack.CLIENT_EVENTS.RTM.AUTHENTICATED, function handleRTMAuthenticated(rtmStartData) {
//   AppScreen.chatWindow.log("Authenticated to Markit Slack");
//   var channels = rtmStartData.channels;
//   var groups = rtmStartData.groups;
//   var ims = rtmStartData.ims;
//
//   fs.writeFile('StartData.json', JSON.stringify(rtmStartData), null, " ");
//   var channelTree = {
// 	"extended": true,
// 	children: {}
//   };
//
//   channels.forEach(function (channel) {
//  	if (channel["is_member"]) {
// 		channelTree["children"][channel.name] = channel ;
// 	}
//   });
//
//   groups.forEach(function (group) {
// 	  channelTree["children"][group.name] = group;
//   });
//
//   ims.forEach(function (im) {
//       var userName = Slack.rtm.dataStore.getUserById(im.user).name;
// 	  channelTree["children"][userName] = im;
//   });
//
//   //web.dm.list(function (err, response) {
//   //  fs.writeFile('dmList.json', JSON.stringify(response, null, " "));
//   //  response.ims.forEach(function (im) {
//   //    var userName = rtm.dataStore.getUserById(im.user).name
//   //    channelTree["children"][userName] = im;
//   //  })
//   //})
//
//   // Hardcode to start in design right now.
//   getChannelHistory(channelTree.children['design'].id)
//   AppScreen.channelWindow.setData(channelTree);
// });
//
// //---------Incoming Messages ------------//
// Slack.rtm.on(Slack.RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
// 	postMessage(message);
// });
//
//
// function getChannelHistory(id) {
// 	web.channels.history(id, {}, function (err, response) {
// 	  fs.writeFile('historyReturn.json', JSON.stringify(response, null, " "));
// 	  response.messages = response.messages || [{ text: "No messages found in channel " + id }];
// 	  response.messages.forEach( function (message) { postMessage(message) });
// 	});
// }
//
// function getGroupHistory(id) {
// 	web.groups.history(id, {}, function (err, response) {
// 	  fs.writeFile('historyReturn.json', JSON.stringify(response, null, " "));
// 	  response.messages = response.messages || [{ text: "No messages found in group " + id }];
// 	  response.messages.forEach( function (message) { postMessage(message) });
// 	});
// }
//
//
//
// // hold on these untill emoji's are supported
// //rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
// //  log.log('Reaction added:', reaction);
// //});
// //
// //rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
// //  log.log('Reaction removed:', reaction);
// //});
