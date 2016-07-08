"use strict";
const events_1 = require('events');
class cEmitter extends events_1.EventEmitter {
    constructor() {
        super();
    }
}
exports.Emitter = new cEmitter();
exports.EVENTS = {
    SEND_NEW_MESSAGE: 'SEND_NEW_MESSAGE',
    UPDATE_CHANNEL_WINDOW: 'UPDATE_CHANNEL_WINDOW',
    UPDATE_CHAT_WINDOW: 'UPDATE_CHAT_WINDOW',
    NEW_GROUP_SELECTED: 'NEW_GROUP_SELECTED',
    NEW_IM_SELECTED: 'NEW_IM_SELECTED',
    NEW_CHANNEL_SELECTED: 'NEW_CHANNEL_SELECTED',
    INCOMING_MESSAGE: 'INCOMING_MESSAGE'
};
