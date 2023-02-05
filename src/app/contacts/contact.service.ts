import { EventEmitter, Injectable } from '@angular/core';
import {Contact} from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact [] =[];
  contactSelectEvent = new EventEmitter<Contact>();

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
  
}
