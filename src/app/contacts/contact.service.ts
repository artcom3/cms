import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  maxContactId = 0;
  private contacts: Contact [] =[];
  // contactSelectEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>()
  contactListChangedEvent = new Subject<Contact[]>()

  constructor(private http: HttpClient) {
    this.getContacts()
  }

  getContacts() {
    return this.http
      .get<Contact[]>('https://khcms-8c149-default-rtdb.firebaseio.com/contacts.json')
      .pipe(tap({
        next: (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          contacts.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          this.contactListChangedEvent.next(contacts.slice());
        },
        error: (error: any) => (console.log(error))
      }));
  }

  storeContacts(contacts: Contact[]) {
    const updatedContacts = JSON.stringify(contacts);
    this.http
      .put(
        'https://khcms-8c149-default-rtdb.firebaseio.com/contacts.json',
        updatedContacts,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
      )
      .subscribe({
        next: () => {
          this.contactListChangedEvent.next(contacts.slice())
        },
        error: (error:any) => (console.log(error))
      })
  }

  getContact(id: string): Contact {
    let returnContact = null;
    this.contacts.forEach(contact => {
      if (contact.id === id)
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
    this.storeContacts(contactsClone);
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
    this.storeContacts(contactsListClone);
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
    this.storeContacts(ContactsListClone);
  }; 
}
