import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  currentSender: string = 'Kevin';
  @ViewChild('subject') subject!: ElementRef;
  @ViewChild('msgTxt') msgTxt!: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage() {
    this.addMessageEvent.emit({
      id: "2",
      subject: this.subject.nativeElement.value,
      msgTxt: this.msgTxt.nativeElement.value,
      sender: this.currentSender
    })    
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgTxt.nativeElement.value = '';
  }
}
