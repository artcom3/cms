import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {

  messages: Message[] = [
    new Message('1', 'Report Grade', 'The grades for the assignment has been posted', 'Bro. Jackson'),
    new Message('2', 'Due Assignemnt', 'Assignment 8 is due on Saturday', 'Bro. Jackson'),
    new Message('3', 'Meeting Request', 'Can I meet with you sometime', 'Mr. Smith'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
