import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {

  currentSender: string = 'Kevin';
  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgTxt') msgTxtInput!: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const subject = this.subjectInput.nativeElement.value;
    const msgTxt = this.msgTxtInput.nativeElement.value;
    const message = new Message('2', subject, msgTxt, this.currentSender);
    this.addMessageEvent.emit(message);
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTxtInput.nativeElement.value = '';
  }
}
