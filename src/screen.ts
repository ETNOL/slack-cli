//import Slack from './slack.ts';

var blessed: any = require('blessed'),
  contrib: any = require('blessed-contrib');

export class AppScreen {
	grid: any;
	chatWindow: any;
	channelWindow: any;
	inputWindow: any;
	appScreen: any;
	currentChannel: string;

	constructor() {
		var screen = this.appScreen =  blessed.screen();
		this.grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

		this.initChatWindow();
		this.initInputWindow();
		//this.initChannelWindow();

		this.appScreen.key(['C-c'], function(ch, key) {
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

	initChannelWindow () {

		this.channelWindow = this.grid.set(1, 0, 10, 2, contrib.tree, {
		  fg: 'green',
		  template: { lines: true },
		  label: 'Channels'
		});

		this.channelWindow.focus()

		// this.channelWindow.on('select', (channel: Channel) => {
		//   this.currentChannel = channel.id;
		//   this.chatWindow.logLines = [];
		//
		//   if (channel.is_group) {
		// 	Slack.getGroupHistory(this.currentChannel);
		//   }
		//
		//   if (channel.is_im) {
		// 	Slack.getImHistory(this.currentChannel, function (err, response) {
		// 	  var messages = response.messages || [{ text: "No messages found in channel " + id }];
		// 	  response.messages.forEach( function (message) { postMessage(message) });
		// 	});
		//   }
		//
		//   if (channel.is_channel) {
		// 	Slack.getChannelHistory(this.currentChannel);
		//   }
		// });
	}


	// postMessage (message: Message) {
	// 	var messageText = message.text;
	// 	var user = message.user ? rtm.dataStore.getUserById(message.user).name : undefined;
	// 	var postMessage = "";
	// 	if (user) {
	// 	  postMessage += user + ": ";
	// 	}
	//
	// 	if ( messageText ) {
	// 	  postMessage += messageText;
	// 	}
	// 	this.chatWindow.log( postMessage );
	// }
}
