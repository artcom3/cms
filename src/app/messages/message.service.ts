import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    return this.messages.slice()
  }

  getMessage(id: string): Message {
    let returnedMessage;
    this.messages.forEach(message => {
      if (message.id == id)
        returnedMessage = message;
    });
    returnedMessage = null
    return returnedMessage;
  }

  addMessage(message: Message) {
    this.messages.push(message)
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
