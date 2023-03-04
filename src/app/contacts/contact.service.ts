import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  maxContactId = 0;
  private contacts: Contact [] =[];
  // contactSelectEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>()
  contactListChangedEvent = new Subject<Contact[]>()

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
    const contactsClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsClone);
  }
  
  getMaxId() {
    let maxId = 0;
    this.contacts.forEach((contact) => {
      const currentId = parseInt(contact.id)
      if (currentId > maxId)
        maxId = currentId;
    })
    return maxId;
  };

  addContact(newContact: Contact) {
    if (!Contact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    const contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  };

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact)
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const ContactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(ContactsListClone);
  }; 
}
