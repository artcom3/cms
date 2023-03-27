import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  currentSender: string = '2';
  @ViewChild('subject') subject!: ElementRef;
  @ViewChild('msgTxt') msgTxt!: ElementRef;

  constructor(private messageService: MessageService) { }

  onSendMessage() {
    this.messageService.addMessage({
      id: null,
      subject: this.subject.nativeElement.value,
      msgText: this.msgTxt.nativeElement.value,
      sender: this.currentSender
    })
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgTxt.nativeElement.value = '';
  }
}
