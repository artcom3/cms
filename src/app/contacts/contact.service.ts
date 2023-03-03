import { EventEmitter, Injectable } from '@angular/core';
import {Contact} from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact [] =[];
  contactSelectEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>()

  constructor() {
     this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice()
  }

  getContact(id: string): Contact {
    let returnContact = null;
    this.contacts.forEach(contact => {
      if (contact.id == id)
        returnContact = contact;
    });
    return returnContact;
  }
  
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
  }
  

}
