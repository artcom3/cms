import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

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
    .get('http://localhost:3000/messages')
    .pipe(
      map(response => {
        console.log(response['message']);
        return response['messages'];
      }))
    .subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.sortAndSend();
      },
      error: (error:any) => (console.log(error))
    })
  }

  sortAndSend(){
    this.messages.sort((a,b) => parseInt(a.id) - parseInt(b.id));
    console.log(this.messages);
    this.messageChangedEvent.emit(this.messages.slice())
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
    if (!message) {
      return;
    }
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ messageInfo: string, message: Message }>('http://localhost:3000/messages',
    message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          console.log(responseData);
          this.messages.push(responseData['message']);
          this.sortAndSend();
        }
      );
  }
}
