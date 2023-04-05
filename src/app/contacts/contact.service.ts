import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject, map, tap } from 'rxjs';
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
    // this.getContacts()
  }

  getContacts() {
    return this.http
      .get('http://localhost:3000/contacts')
      .pipe(
        map(response => {
          console.log(response['message']);
          return response['contacts'];
        }),
        tap({
          next: (contacts: Contact[]) => {
            this.contacts = contacts;
            this.sortAndSend();
          },
          error: (error: any) => (console.log(error))
        })
      );
  }

  sortAndSend(){
    this.contacts.sort((a,b) => {
      return a.name.localeCompare(b.name, undefined, {sensitivity: 'base'})
    });
    console.log(this.contacts);
    this.contactListChangedEvent.next(this.contacts.slice())
  }

  // storeContacts(contacts: Contact[]) {
  //   const updatedContacts = JSON.stringify(contacts);
  //   this.http
  //     .put(
  //       'https://khcms-8c149-default-rtdb.firebaseio.com/contacts.json',
  //       updatedContacts,
  //       {
  //         headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //       }
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.contactListChangedEvent.next(contacts.slice())
  //       },
  //       error: (error:any) => (console.log(error))
  //     })
  // }

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

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }
  
  // getMaxId() {
  //   let maxId = 0;
  //   this.contacts.forEach((contact) => {
  //     const currentId = parseInt(contact.id)
  //     if (currentId > maxId)
  //       maxId = currentId;
  //   })
  //   return maxId;
  // };

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
    contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  };

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newContact.id = originalContact.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }; 
}
