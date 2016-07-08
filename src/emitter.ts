import { EventEmitter } from 'events';


class cEmitter extends EventEmitter {
	constructor() {
		super();
	}
}

export const Emitter = new cEmitter();

export const EVENTS =  {
	SEND_NEW_MESSAGE: 'SEND_NEW_MESSAGE',
	UPDATE_CHANNEL_WINDOW: 'UPDATE_CHANNEL_WINDOW',
	UPDATE_CHAT_WINDOW: 'UPDATE_CHAT_WINDOW',
	NEW_GROUP_SELECTED: 'NEW_GROUP_SELECTED',
	NEW_IM_SELECTED: 'NEW_IM_SELECTED',
	NEW_CHANNEL_SELECTED: 'NEW_CHANNEL_SELECTED',
	INCOMING_MESSAGE: 'INCOMING_MESSAGE'
}
