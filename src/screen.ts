import Slack from './slack';
var blessed: any = require('blessed'),
  contrib: any = require('blessed-contrib');

class AppScreen {
	grid: any;
	chatWindow: any;
	channelWindow: any;
	inputWindow: any;
	appScreen: any;
	currentChannel: string;

	constructor() {
		this.appScreen = blessed.screen();
		this.grid = new contrib.grid({rows: 12, cols: 12, screen: this.appScreen});

		this.initChatWindow();
		this.initInputWindow();
		this.initChannelWindow();

		this.appScreen.key(['C-c'], function(ch, key) {
		  return process.exit(0);
		});

		this.appScreen.render();
	}

	initInputWindow() {
		this.inputWindow = this.grid.set(9, 2, 2, 10, contrib.cli, {
		  label: 'Say something',
		  secret: false
		});

		this.inputWindow.on('submit', function (e) {
			console.log("message sent");
		});

		this.inputWindow.on('keypress', function (e) {
			this.setValue(
				this.getValue() + e
		  	)
		});
	}

	initChatWindow() {
		this.chatWindow = this.grid.set(1, 2, 9, 10, contrib.log, {
		  fg: 'green',
		  selectedFg: 'green',
		  label: 'Chat'
		});
	}

  initChannelTree(rtmStartData) {
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
    		channelTree["children"][channel.name] = channel ;
    	}
    });

    groups.forEach(function (group) {
  	  channelTree["children"][group.name] = group;
    });

    ims.forEach(function (im) {
      var userName = Slack.rtm.dataStore.getUserById(im.user).name;
  	  channelTree["children"][userName] = im;
    });

    this.channelWindow.setData(channelTree);
  }

	initChannelWindow () {
		this.channelWindow = this.grid.set(1, 0, 10, 2, contrib.tree, {
		  fg: 'green',
		  template: { lines: true },
		  label: 'Channels'
		});

		this.channelWindow.focus()

		this.channelWindow.on('select', (channel: Channel) => {
		  this.currentChannel = channel.id;
		  this.chatWindow.logLines = [];

		  if (channel.is_group) {
			Slack.getGroupHistory(this.currentChannel, this.postMessages);
		  }
		  if (channel.is_im) {
			Slack.getImHistory(this.currentChannel, this.postMessages);
		  }

		  if (channel.is_channel) {
			Slack.getChannelHistory(this.currentChannel, this.postMessages);
		  }
		});

  Slack.getChannelHistory(this.channelWindow.children['design'].id, this.postMessages);
	}

  postMessages(err, messages) {
		  var messages = messages || [{ text: "No messages found in channel " + this.currentChannel }];
		  messages.forEach( (message) => { this.postMessage(message) });
  }

  postMessage(message) {
  	var messageText = message.text;
  	var user = message.user ? Slack.rtm.dataStore.getUserById(message.user).name : undefined;
  	var postMessage = "";
  	if (user) {
  	  postMessage += user + ": ";
  	}

  	if ( messageText ) {
  	  postMessage += messageText;
  	}
  	this.chatWindow.log( postMessage );
  }
}

var appScreen = new AppScreen();
export default appScreen;
