import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: Message[] = [];
  maxContactId = 0;
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages() {
    return this.http
    .get('https://khcms-8c149-default-rtdb.firebaseio.com/messages.json')
    .subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.maxContactId = this.getMaxId();
        messages.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        this.messageChangedEvent.emit(messages.slice())
      },
      error: (error:any) => (console.log(error))
    })
  }

  storeContacts(messages: Message[]) {
    const updatedMessages = JSON.stringify(messages);
    this.http
      .put(
        'https://khcms-8c149-default-rtdb.firebaseio.com/messages.json',
        updatedMessages,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
      )
      .subscribe({
        next: () => {
          this.messageChangedEvent.emit(messages.slice())
        },
        error: (error:any) => (console.log(error))
      })
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

  getMaxId() {
    let maxId = 0;
    this.messages.forEach((message) => {
      const currentId = parseInt(message.id)
      if (currentId > maxId)
        maxId = currentId;
    })
    return maxId;
  };

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }
    this.maxContactId++;
    newMessage.id = this.maxContactId.toString();
    this.messages.push(newMessage);
    this.storeContacts(this.messages.slice());
  }
}
